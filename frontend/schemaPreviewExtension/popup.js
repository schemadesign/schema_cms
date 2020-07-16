let toggleSwitch = document.getElementById('switch-button');

toggleSwitch.addEventListener('change', ()=> {
    chrome.storage.sync.get('SCHEMA_PREVIEW', function(data) {
        if(!data.SCHEMA_PREVIEW) {
            console.log('SCHEMA_PREVIEW',data.SCHEMA_PREVIEW)
            return chrome.storage.sync.set({'SCHEMA_PREVIEW': true});
        }
        console.log('SCHEMA_PREVIEW',data.SCHEMA_PREVIEW)
        return chrome.storage.sync.set({'SCHEMA_PREVIEW': false});
    });
})
