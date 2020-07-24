export default function () {

  let toggleSwitch = document.getElementById('switch-button');
  let toggleSwitchValue = null;

  window.onload = function() {
    chrome.storage.local.get("isPreviewMode", function(value){
      toggleSwitchValue = value.isPreviewMode;
      toggleSwitch.checked = toggleSwitchValue;
    });
    return chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { isPreviewMode: toggleSwitchValue, dataId: 0 });
    });
  }

  toggleSwitch.addEventListener('change', ()=> {
    if (!toggleSwitchValue) {
      toggleSwitchValue = true;
      toggleSwitch.checked = toggleSwitchValue;
      chrome.storage.local.set({ "isPreviewMode": toggleSwitchValue }, function(){
      });
      return chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { isPreviewMode: toggleSwitchValue, dataId: 2 });
      });
    }
    toggleSwitchValue = false;
    toggleSwitch.checked = toggleSwitchValue;
    chrome.storage.local.set({ "isPreviewMode": toggleSwitchValue }, function(){
    });
    return chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { isPreviewMode: toggleSwitchValue, dataId: 1 });
    });
  })

};
