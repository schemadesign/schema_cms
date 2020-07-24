export default function () {

  let toggleSwitch = document.getElementById('switch-button');
  let toggleSwitchValue = false;

  toggleSwitch.addEventListener('change', ()=> {
    if (!toggleSwitchValue) {
      toggleSwitchValue = true;
      toggleSwitch.checked = toggleSwitchValue;
      return chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { isPreviewMode: true, dataId: 2 });
      });
    }
    toggleSwitchValue = false;
    toggleSwitch.checked = toggleSwitchValue;
    return chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { isPreviewMode: false, dataId: 1 });
    });
  })

};
