export default function () {

  let toggleSwitch = document.getElementById('switch-button');
  let x  = document.getElementById('myid')
  let toggleSwitchValue = false;

  toggleSwitch.addEventListener('change', ()=> {
    if (!toggleSwitchValue) {
      toggleSwitchValue = true;
      toggleSwitch.checked = toggleSwitchValue;
      x.classList.add('test');
      return chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { isPreviewMode: true, dataId: 2 });
      });
    }
    toggleSwitchValue = false;
    toggleSwitch.checked = toggleSwitchValue;
    x.classList.remove('test');
    return chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { isPreviewMode: false, dataId: 1 });
    });
  })

};
