var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received: " + event.data.text);
        window.postMessage({ type: 'variables', params: {'SCHEMA_PREVIEW': true, 'DATA_ID': 2} }, "*");
        port.postMessage(event.data.text);
    }
}, false);