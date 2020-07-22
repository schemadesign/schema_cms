export default function () {
  chrome.tabs.sendMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
  let toggleSwitch = document.getElementById('switch-button');

  let toggleSwitchValue = false;
  window.addEventListener("message", function(event) {
    console.log('popup', event.data.params)
    if (event.source != window)
      return;
    toggleSwitchValue = event.data.params.SCHEMA_PREVIEW;
  });

  toggleSwitch.addEventListener('change', ()=> {
    console.log('click')
    if (!toggleSwitchValue) {
      console.log('toggle')
      toggleSwitch.checked = toggleSwitchValue;
      return window.postMessage({ type: 'variables', params: {'SCHEMA_PREVIEW': true, 'DATA_ID': 2} }, "*");
    }
    console.log('toggle')
    toggleSwitch.checked = toggleSwitchValue;
    return window.postMessage({ type: 'variables', params: {'SCHEMA_PREVIEW': false, 'DATA_ID': 1} }, "*");
  })

};
