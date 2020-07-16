const schemaObject = {
    SCHEMA_PREVIEW: null,
    get getSchemaVariable() {
    return this.SCHEMA_PREVIEW;
    },
    set setSchemaVariable(schemaPreviewValue) {
        this.SCHEMA_PREVIEW = schemaPreviewValue
    }
};

const schemaValue = document.getElementById('schemaValue');

window.onload = function(){
    chrome.storage.sync.get('SCHEMA_PREVIEW', (data) => {
        schemaObject.setSchemaVariable = data.SCHEMA_PREVIEW;
        schemaValue.textContent = schemaObject.getSchemaVariable;
    })
};

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (schemaObject.getSchemaVariable !== changes.SCHEMA_PREVIEW.newValue) {
        schemaObject.setSchemaVariable = changes.SCHEMA_PREVIEW.newValue;
        schemaValue.textContent = schemaObject.getSchemaVariable;
    }
})
