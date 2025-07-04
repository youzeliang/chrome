// 扩展启动时写入一条 fileTxtContent 测试数据
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({
    fileTxtContent: 'https://www.baidu1.com/'
  }, function() {
    console.log('测试数据已写入 storage');
  });
});

// 处理快捷键命令
chrome.commands.onCommand.addListener((command) => {
  if (command === 'save-current-url') {
    // 获取当前活动标签页的URL
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0] && tabs[0].url) {
        const currentUrl = tabs[0].url;
        // 从storage中获取现有的URL列表
        chrome.storage.local.get('fileTxtContent', function(result) {
          let urls = result.fileTxtContent || '';
          // 将现有URLs转换为数组
          let urlArray = urls.split('\n').filter(url => url.trim() !== '');
          
          // 检查URL是否已存在
          if (!urlArray.includes(currentUrl)) {
            // URL不存在，添加到数组
            urlArray.push(currentUrl);
            // 将数组转回字符串，每个URL用换行符分隔
            const newUrls = urlArray.join('\n');
            // 保存回storage
            chrome.storage.local.set({fileTxtContent: newUrls}, function() {
              console.log('新URL已保存：', currentUrl);
            });
          } else {
            console.log('URL已存在，未重复添加：', currentUrl);
          }
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkURL') {
    checkURL(request.url);
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log('onUpdated');
  // 当地址栏URL变化时执行处理逻辑
  // if (changeInfo.url) {
    checkURL(changeInfo.url);
    console.log('地址栏URL变化：', changeInfo.url);
    // 在此处进行其他操作
  // }
});

function checkURL(url) {
  // 从 chrome.storage.local 获取 file.txt 内容
  chrome.storage.local.get('fileTxtContent', function(result) {
    var data = result.fileTxtContent || '';
    var allowedURLs = data.split('\n').map(url => url.trim());
    if (allowedURLs.includes(url)) {
      // 如果地址在文件中，跳转到空白页
      console.log("URL is allowed. Redirecting to about:blank");
      chrome.tabs.update({url: 'about:blank'});
    } else {
      console.log("URL is not allowed. Redirecting to the original URL");
      // 否则，正常访问
      // chrome.tabs.update({url: url});
    }
  });
}