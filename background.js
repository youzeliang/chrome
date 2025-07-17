// 存储默认配置
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({
    fileTxtContent: '',
    subscriptionUrl: ''
  });
});

// 缓存机制
let remoteUrlsCache = {
  data: [],
  timestamp: 0
};

// 获取远程黑名单（带缓存）
async function getRemoteBlockList() {
  try {
    const now = Date.now();
    const cacheValidTime = 10 * 60 * 1000; // 10分钟的缓存时间（毫秒）

    // 如果缓存还在有效期内，直接返回缓存的数据
    if (now - remoteUrlsCache.timestamp < cacheValidTime) {
      return remoteUrlsCache.data;
    }

    const { subscriptionUrl } = await chrome.storage.local.get('subscriptionUrl');
    if (!subscriptionUrl) return [];

    const response = await fetch(subscriptionUrl, {
      headers: {
        'Accept': 'text/plain',
        'Cache-Control': 'no-cache'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch');
    
    const text = await response.text();
    
    // 检查内容是否为HTML
    if (text.trim().toLowerCase().startsWith('<!doctype html')) {
      return [];
    }
    
    const urls = text.split('\n')
      .map(url => url.trim())
      .filter(url => url && !url.startsWith('#'));

    // 更新缓存
    remoteUrlsCache = {
      data: urls,
      timestamp: now
    };

    return urls;
  } catch (error) {
    // 如果获取失败但有缓存，返回缓存的数据
    if (remoteUrlsCache.data.length > 0) {
      return remoteUrlsCache.data;
    }
    return [];
  }
}

// 处理快捷键命令
chrome.commands.onCommand.addListener((command) => {
  if (command === 'save-current-url') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0] && tabs[0].url) {
        addLocalBlockedUrl(tabs[0].url);
      }
    });
  }
});

// 添加本地黑名单URL
async function addLocalBlockedUrl(url) {
  const { fileTxtContent } = await chrome.storage.local.get('fileTxtContent');
  let urls = fileTxtContent ? fileTxtContent.split('\n') : [];
  urls = urls.filter(u => u.trim() !== '');
  
  if (!urls.includes(url)) {
    urls.push(url);
    await chrome.storage.local.set({
      fileTxtContent: urls.join('\n')
    });
    console.log('新URL已添加到本地黑名单:', url);
  }
}

// 监听消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkURL') {
    checkURL(request.url);
  } else if (request.action === 'updateSubscription') {
    chrome.storage.local.set({ subscriptionUrl: request.url });
  }
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // 检查 URL 变化
  if (changeInfo.url) {
    checkURL(changeInfo.url);
  }
  // 检查页面加载完成
  else if (changeInfo.status === 'complete' && tab.url) {
    checkURL(tab.url);
  }
});

// 检查URL是否在黑名单中
async function checkURL(url) {
  // 检查是否是有效的URL并且是http或https协议
  try {
    if (!url || url === 'about:blank') return;
    
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      return;
    }

    // 获取本地黑名单
    const { fileTxtContent } = await chrome.storage.local.get('fileTxtContent');
    const localUrls = fileTxtContent ? fileTxtContent.split('\n').filter(u => u.trim()) : [];
    
    // 实时获取远程黑名单
    const remoteUrls = await getRemoteBlockList();
    
    // 合并本地和远程黑名单
    const allBlockedUrls = [...new Set([...localUrls, ...remoteUrls])];
    
    // 检查URL是否匹配任何黑名单规则（使用强匹配）
    const shouldBlock = allBlockedUrls.some(blockedUrl => {
      if (!blockedUrl) return false;
      blockedUrl = blockedUrl.trim();
      return url === blockedUrl;
    });

    if (shouldBlock) {
      await chrome.tabs.update({ url: 'about:blank' });
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Invalid URL')) {
      return;
    }
  }
}

// 定时同步远程黑名单
function setupSyncAlarm() {
  chrome.storage.local.get('syncIntervalMinutes', ({ syncIntervalMinutes }) => {
    const interval = Number(syncIntervalMinutes) || 10; // 默认10分钟
    chrome.alarms.clear('syncRemoteBlockList', () => {
      chrome.alarms.create('syncRemoteBlockList', { periodInMinutes: interval });
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupSyncAlarm();
});

// 扩展启动时也设置一次
setupSyncAlarm();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.syncIntervalMinutes) {
    setupSyncAlarm();
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncRemoteBlockList') {
    getRemoteBlockList(); // 只需刷新缓存即可
  }
});