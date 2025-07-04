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
document.addEventListener('DOMContentLoaded', async function() {
    // 获取元素
    const subscriptionUrlInput = document.getElementById('subscriptionUrl');
    const saveSubscriptionBtn = document.getElementById('saveSubscription');
    const refreshListBtn = document.getElementById('refreshList');
    const checkButton = document.getElementById('checkButton');
    const urlList = document.getElementById('urlList');

    // 加载保存的订阅URL
    const { subscriptionUrl } = await chrome.storage.local.get('subscriptionUrl');
    if (subscriptionUrl) {
        subscriptionUrlInput.value = subscriptionUrl;
    }

    // 保存订阅URL
    saveSubscriptionBtn.addEventListener('click', function() {
        const url = subscriptionUrlInput.value.trim();
        if (url) {
            chrome.runtime.sendMessage({
                action: 'updateSubscription',
                url: url
            });
            alert('订阅地址已保存并开始更新黑名单');
            updateUrlList();
        }
    });

    // 刷新黑名单列表
    refreshListBtn.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'refreshList' });
        setTimeout(updateUrlList, 1000); // 等待一秒后更新显示
    });

    // 检查当前URL
    checkButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0] && tabs[0].url) {
                chrome.runtime.sendMessage({
                    action: 'checkURL',
                    url: tabs[0].url
                });
            }
        });
    });

    // 初始更新URL列表
    updateUrlList();

    // 更新URL列表显示
    async function updateUrlList() {
        const { fileTxtContent } = await chrome.storage.local.get('fileTxtContent');
        
        // 清空现有列表
        urlList.innerHTML = '';
        
        // 显示本地黑名单
        const localUrls = fileTxtContent ? fileTxtContent.split('\n').filter(url => url.trim()) : [];
        if (localUrls.length > 0) {
            localUrls.forEach(url => {
                const div = document.createElement('div');
                div.textContent = url;
                div.style.marginLeft = '10px';
                urlList.appendChild(div);
            });
        } else {
            urlList.textContent = '暂无屏蔽的URL';
        }
    }
});
