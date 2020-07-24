
chrome.runtime.onMessage.addListener((request, sender) => {
    return window.postMessage({ type: "SCHEMA_CMS", PREVIEW_MODE: request.isPreviewMode, DATA_ID: request.dataId }, "*");
});
