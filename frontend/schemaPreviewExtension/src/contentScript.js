chrome.runtime.onMessage.addListener((request, sender) => {
  return window.postMessage(
    {
      type: "SCHEMA_CMS",
      PREVIEW_MODE: request.isPreviewMode,
      DATA_ID: request.dataId
    },
    "*"
  );
});

window.addEventListener('message', (event) => {
    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        chrome.storage.local.set({ "isPreviewMode": false });
    }
})

