# Data sources

## Get list of project's data sources

**Request**:

`GET` `/api/v1/projects/<project id>/datasources`

*Note:*

- **[Authorization Protected](authentication.md)**

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
        "fields": 3,
        "preview": "http://localhost:8000/static/preview_file.json"
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
        "fields": 9,
        "preview": "http://localhost:8000/static/preview_file.json"
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
name       | string | The title of the project object.
type       | enum   | Type of source. [One of Data source statuses](#enums).
file       | file   | The CSV file.

*Note:*

- Request's content type: `multipart/form-data`
- **[Authorization Protected](authentication.md)**


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
        "fields": 9,
        "preeview": "http://localhost:8000/static/preview_file.json"
      }
    }
}
```


## Update project's data source

**Request**:

`PUT` `/api/v1/projects/<project id>/datasources/<data source id>`

Parameters:

Name       | Type   | Description
-----------|--------|---
name       | string | The title of the project object.
type       | enum   | Type of source. [One of Data source statuses](#enums).
file       | file   | The CSV file.

*Note:*

- Request's content type: `multipart/form-data`
- **[Authorization Protected](authentication.md)**


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
        "fields": 9,
        "preview": "http://localhost:8000/static/preview_file.json"
      }
    }
}
```


## Enums
Data source statuses: `file`, `database`, `api`
