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
    const syncIntervalSelect = document.getElementById('sync-interval');
    const saveSyncIntervalBtn = document.getElementById('saveSyncInterval');

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

    // 读取并显示当前同步间隔
    const { syncIntervalMinutes } = await chrome.storage.local.get('syncIntervalMinutes');
    if (syncIntervalMinutes && syncIntervalSelect) {
        syncIntervalSelect.value = String(syncIntervalMinutes);
    }
    // 保存同步间隔
    if (saveSyncIntervalBtn) {
      saveSyncIntervalBtn.addEventListener('click', function() {
        const minutes = parseInt(syncIntervalSelect.value, 10);
        if (!isNaN(minutes) && minutes > 0) {
          chrome.storage.local.set({ syncIntervalMinutes: minutes });
          alert('同步间隔已保存: ' + minutes + ' 分钟');
        }
      });
    }

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

// 移除网址功能
const removeUrlBtn = document.getElementById('remove-url-btn');
if (removeUrlBtn) {
  removeUrlBtn.addEventListener('click', async function() {
    const input = document.getElementById('remove-url-input');
    const msgDiv = document.getElementById('remove-url-msg');
    const url = input.value.trim();
    if (!url) {
      msgDiv.textContent = '请输入网址';
      return;
    }
    const { fileTxtContent } = await chrome.storage.local.get('fileTxtContent');
    let urls = fileTxtContent ? fileTxtContent.split('\n').map(u => u.trim()).filter(Boolean) : [];
    const index = urls.indexOf(url);
    if (index > -1) {
      urls.splice(index, 1);
      await chrome.storage.local.set({ fileTxtContent: urls.join('\n') });
      msgDiv.textContent = '已移除：' + url;
      input.value = '';
      // 刷新列表
      const urlList = document.getElementById('urlList');
      if (urlList) {
        urlList.innerHTML = '';
        urls.forEach(u => {
          const div = document.createElement('div');
          div.textContent = u;
          div.style.marginLeft = '10px';
          urlList.appendChild(div);
        });
        if (urls.length === 0) {
          urlList.textContent = '暂无屏蔽的URL';
        }
      }
    } else {
      msgDiv.textContent = '未找到该网址';
    }
  });
}
