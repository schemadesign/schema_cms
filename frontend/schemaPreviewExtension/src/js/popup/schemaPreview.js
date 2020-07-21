export default function () {
  let toggleSwitch = document.getElementById('switch-button');

  window.onload = function(){
    chrome.storage.sync.get('SCHEMA_PREVIEW', (data) => {
      toggleSwitch.checked = data.SCHEMA_PREVIEW;
    })
  };

  toggleSwitch.addEventListener('change', ()=> {
    chrome.storage.sync.get('SCHEMA_PREVIEW', function(data) {
      if(!data.SCHEMA_PREVIEW) {
        return chrome.storage.sync.set({'SCHEMA_PREVIEW': true, DATA_ID: 2});
      }
      return chrome.storage.sync.set({'SCHEMA_PREVIEW': false, DATA_ID: 1});
    });
  })

};
