window.addEventListener("load", () => {
  const checkButton = document.getElementById("checkButton");
  checkButton.addEventListener("click", function () {
    console.log("click");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log('tabs',tabs);
      var url = tabs[0].url;
      chrome.runtime.sendMessage({ action: "checkURL", url: url });
    });
  });
});
