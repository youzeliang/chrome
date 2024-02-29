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
  // 获取扩展目录中的文件路径
  var fileUrl = chrome.runtime.getURL('file.txt');

  // 使用 fetch API 读取文件内容
  fetch(fileUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      // 成功获取文件内容
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
    })
    .catch(error => {
      console.error('Failed to load file:', error);
    });
}