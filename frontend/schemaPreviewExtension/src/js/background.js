import '../img/icon-128.png'
import '../img/icon-34.png'

chrome.runtime.onInstalled.addListener(function() {
    console.log('bcg')
    window.postMessage({ type: 'variables', params: {'SCHEMA_PREVIEW': false, 'DATA_ID': 1} }, "*");
});
// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({'SCHEMA_PREVIEW': false, 'DATA_ID': 1}, function(data) {
//     });
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//         chrome.declarativeContent.onPageChanged.addRules([{
//             conditions: [new chrome.declarativeContent.PageStateMatcher({
//                 pageUrl: {hostEquals: 'developer.chrome.com'},
//             })
//             ],
//             actions: [new chrome.declarativeContent.ShowPageAction()]
//         }]);
//     });
// });