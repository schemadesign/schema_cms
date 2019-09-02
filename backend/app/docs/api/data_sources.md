# Data sources

## Get list of project's data sources

**Request**:

`GET` `/api/v1/projects/<project id>/datasources`

**Response**:


```json
Content-Type: application/json
200 Created
   

{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 99,
      "name": "Decade appear world.",
      "project": 285,
      "type": "file",
      "file": "http://localhost:8000/static/file.csv",
      "meta_data": {
        "items": 2419,
        "fields": 3
      }
    },
    {
      "id": 98,
      "name": "Also entire machine lay.",
      "project": 285,
      "type": "file",
      "file": "http://localhost:8000/static/file.csv",
      "meta_data": {
        "items": 3179,
        "fields": 9
      }
    }
  ]
}
```


## Create new project's data source

**Request**:

`POST` `/api/v1/projects/<project id>/datasources`

Parameters:

Name       | Type   | Description
-----------|--------|---
title      | string | The title of the project object.
description| text   | The description of the project object.
status     | string | The status of project object.
owner      | string | The creator of the project object.
editors    | list   | The editors list of the project object.

*Note:*

Request's content type: `multipart/form-data`


**Response**:


```json
Content-Type: application/json
200 Created
   

{
    {
      "id": 98,
      "name": "Also entire machine lay.",
      "project": 285,
      "type": "file",
      "file": "http://localhost:8000/static/file.csv",
      "meta_data": {
        "items": 3179,
        "fields": 9
      }
    }
}
```
