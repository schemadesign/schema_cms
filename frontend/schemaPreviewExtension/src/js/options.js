import "../css/options.css";

const schemaObject = {
    SCHEMA_PREVIEW: null,
    DATA_ID: null,
    get getSchemaVariable() {
        return this.SCHEMA_PREVIEW;
    },
    set setSchemaVariable(schemaPreviewValue) {
        this.SCHEMA_PREVIEW = schemaPreviewValue
    },
    get getDataId() {
        return this.DATA_ID;
    },
    set setDataId(dataId) {
        this.DATA_ID = dataId
    }
};

const schemaValue = document.getElementById('schemaValue');
const dataId = document.getElementById('dataId');
const dataContent = document.getElementById('dataContent');

window.onload = function(){
    chrome.storage.sync.get('SCHEMA_PREVIEW', (data) => {
        schemaObject.setSchemaVariable = data.SCHEMA_PREVIEW;
        schemaValue.textContent = schemaObject.getSchemaVariable;
    });
    chrome.storage.sync.get('DATA_ID', (data) => {
        schemaObject.setDataId = data.DATA_ID;
        dataId.textContent = schemaObject.getDataId;
        fetch(`http://localhost:8000/public-api/datasources/${data.DATA_ID}`)
            .then(response => response.json())
            .then(data => {
                dataContent.textContent = JSON.stringify(data);
            });
    })
};

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (schemaObject.getSchemaVariable !== changes.SCHEMA_PREVIEW.newValue) {
        schemaObject.setSchemaVariable = changes.SCHEMA_PREVIEW.newValue;
        schemaValue.textContent = schemaObject.getSchemaVariable;
    }
    if (schemaObject.getDataId !== changes.DATA_ID.newValue) {
        schemaObject.setDataId = changes.DATA_ID.newValue;
        dataId.textContent = schemaObject.getDataId;
        fetch(`http://localhost:8000/public-api/datasources/${schemaObject.getDataId}`)
            .then(response => response.json())
            .then(data => {
                dataContent.textContent = JSON.stringify(data);
            });
    }
})
