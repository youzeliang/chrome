window.addEventListener("load", () => {
  const checkButton = document.getElementById("checkButton");
  if (checkButton) {
    checkButton.addEventListener("click", function () {
      console.log("click");
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log('tabs',tabs);
        var url = tabs[0].url;
        chrome.runtime.sendMessage({ action: "checkURL", url: url });
      });
    });
  } else {
    console.warn("checkButton not found in DOM");
  }
});

// 当弹出窗口打开时，显示保存的URL列表
document.addEventListener('DOMContentLoaded', function() {
    // 获取并显示保存的URL列表
    chrome.storage.local.get('fileTxtContent', function(result) {
        const urlList = document.getElementById('urlList');
        if (result.fileTxtContent) {
            // 将文本分割成URL数组并过滤掉空行
            const urls = result.fileTxtContent.split('\n').filter(url => url.trim());
            // 显示URL列表
            urls.forEach(url => {
                const div = document.createElement('div');
                div.textContent = url;
                div.style.marginBottom = '5px';
                urlList.appendChild(div);
            });
        } else {
            urlList.textContent = '暂无保存的URL';
        }
    });
});
