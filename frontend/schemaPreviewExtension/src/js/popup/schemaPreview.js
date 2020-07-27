export default () => {

  let toggleSwitch = document.getElementById('switch-button');
  let toggleSwitchValue = null;

  window.onload = () => {
    console.log('popup', chrome.storage.local, chrome.tabs)
    chrome.storage.local.get("isPreviewMode", (value) => {
      toggleSwitchValue = value.isPreviewMode;
      toggleSwitch.checked = toggleSwitchValue;
    });
    return chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { isPreviewMode: toggleSwitchValue, dataId: 0 });
    });
  }

  toggleSwitch.addEventListener('change', ()=> {
    if (!toggleSwitchValue) {
      toggleSwitchValue = true;
      toggleSwitch.checked = toggleSwitchValue;
      chrome.storage.local.set({ "isPreviewMode": toggleSwitchValue });
      return chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { isPreviewMode: toggleSwitchValue, dataId: 2 });
      });
    }
    toggleSwitchValue = false;
    toggleSwitch.checked = toggleSwitchValue;
    chrome.storage.local.set({ "isPreviewMode": toggleSwitchValue });
    return chrome.tabs.query({ active: true, currentWindow: true }, (tabs)  =>{
      chrome.tabs.sendMessage(tabs[0].id, { isPreviewMode: toggleSwitchValue, dataId: 1 });
    });
  })
};
