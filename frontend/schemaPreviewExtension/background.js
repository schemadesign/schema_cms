chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({'SCHEMA_PREVIEW': false}, function() {
        console.log("SCHEMA_PREVIEW variable has been set");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'developer.chrome.com'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});