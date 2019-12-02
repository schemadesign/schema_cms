# Data sources

## Get list of project's data sources

**Request**:

`GET` `/api/v1/projects/:id/datasources`

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
      "active_job": {
        "id": 39,
        "scripts": [
            1
        ]
       },
      "meta_data": {
        "items": 2419,
        "fields": 3,
        "fields_names": [
            "C0",
            "C1",
            "C2",
        ],
        "preview": "http://localhost:8000/static/preview_file.json"
      }
    },
    {
      "id": 98,
      "name": "Also entire machine lay.",
      "project": 285,
      "type": "file",
      "file": "http://localhost:8000/static/file.csv",
      "active_job": {
        "id": 39,
        "scripts": [
            1
        ]
       },
      "meta_data": {
        "items": 3179,
        "fields": 9,
        "fields_names": [
            "C0",
            "C1",
            "C2",
            "C3",
            "C4",
            "C5",
            "C6",
            "C7",
            "C8",
        ],
        "preview": "http://localhost:8000/static/preview_file.json"
      }
    }
  ]
}
```

## Get list of user's data sources

**Request**:

`GET` `/api/v1/datasources`

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
      "active_job": {
        "id": 39,
        "scripts": [
            1
        ]
       },
      "meta_data": {
        "items": 2419,
        "fields": 3,
        "fields_names": [
            "C0",
            "C1",
            "C2",
        ],
        "preview": "http://localhost:8000/static/preview_file.json"
       }
    },
    {
      "id": 98,
      "name": "Also entire machine lay.",
      "project": 285,
      "type": "file",
      "active_job": {
        "id": 39,
        "scripts": [
            1
        ]
       },
      "meta_data": {
        "items": 3179,
        "fields": 9,
        "fields_names": [
            "C0",
            "C1",
            "C2",
            "C3",
            "C4",
            "C5",
            "C6",
            "C7",
            "C8",
        ],
        "preview": "http://localhost:8000/static/preview_file.json"
      }
    }
  ]
}
```


## Create new project's data source

**Request**:

`POST` `/api/v1/datasources`

Parameters:

Name       | Type   | Description
-----------|--------|---
name       | string | The title of the project object.
project    | int    | Project's ID
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

`PUT` `/api/v1/datasources/:id`

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

## Get list of available data source scripts

**Request**:

`GET` `/api/v1/datasources/:id/script`


*Note:*

- **[Authorization Protected](authentication.md)**


**Response**:


```json
Content-Type: application/json
200 OK

[
    {
        "name": "use first 10 rows",
        "body": "df = df.head(10)\n",
        "is_predefined": false,
        "file": "http://localhost:8000/scripts/use_first_10_rows.py"
    },
]
```

## Upload data source's script

**Request**:

`POST` `/api/v1/datasources/:id/script-upload`

Parameters:

Name       | Type   | Description
-----------|--------|-------------
name       | string | Script name
script     | file   | Python file


*Note:*

- Request's content type: `multipart/form-data`
- **[Authorization Protected](authentication.md)**


**Response**:


```json
Content-Type: application/json
201 Created
```

## Create new data source's job

**Request**:

`POST` `/api/v1/datasources/:id/job`

Parameters:

Name       | Type                   | Description
-----------|------------------------|------
steps      | array[[step](#step)]   | List of steps to execute

*Note:*

- **[Authorization Protected](authentication.md)**


**Response**:


```json
Content-Type: application/json
201 Created
```

## Get data source jobs history

**Request**:

`GET` `/api/v1/datasources/:id/jobs-history`

*Note:*

- **[Authorization Protected](authentication.md)**


**Response**:


```json
Content-Type: application/json
200 OK
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
        {
            "pk": 2,
            "datasource": 1,
            "steps": [
                {
                    "script": 1,
                    "exec_order": 0
                }
            ],
            "job_state": "pending",
            "result": null,
            "error": ""
        },
        {
            "pk": 1,
            "datasource": 1,
            "steps": [
                {
                    "script": 1,
                    "exec_order": 0
                }
            ],
            "job_state": "success",
            "result": "http://localhost:8000/schemacms/storage/projects/1/datasources/1/test_data_Job#1_result.csv",
            "error": ""
        }
    ]
}
```

## Get list of data source filters

**Request**:

`GET` `/api/v1/datasources/:id/filters`


*Note:*

- **[Authorization Protected](authentication.md)**


**Response**:


```json
Content-Type: application/json
200 OK
[
    {
        "id": 6,
        "datasource": 129,
        "name": "asdasdas",
        "type": "radio_button",
        "field": "asdasd",
        "field_type": "text",
        "unique_items": 123123,
        "is_active": true,
        "created": "2019-11-04T13:28:56+0000",
        "modified": "2019-11-04T13:28:56+0000"
    }
]
```
## Add filter to data source

**Request**:

`POST` `/api/v1/datasources/:id/filters`

Parameters:

Name         | Type     | Description
-------------|----------|----------------------------------------------
name         | string   | Filter name.
type         | enum     | Type of filter. [One of Filter types](#enums)
field        | string   | Field name.
filed_type   | enum     | Type of filed. [One of Field types](#enums)
unique_items | integer  | Number of unique value sin column.
is_active    | bool     | Is filter active?


*Note:*

- **[Authorization Protected](authentication.md)**


**Response**:


```json
Content-Type: application/json
201 CREATED

[
    {
        "id": 1,
        "datasource": 12,
        "name": "TestFilter",
        "type": "radio_button",
        "field": "Country Name",
        "field_type": "text",
        "unique_items": 123123,
        "is_active": true,
        "created": "2019-11-04T13:28:56+0000",
        "modified": "2019-11-04T13:28:56+0000"
    }
]
```

## activate/deactivate filters

**Request**:

`POST` `/api/v1/datasources/:id/set-filters`

Parameters:

Name         | Type      | Description
-------------|-----------|----------------------------------------------
active       | list[int] | List of filters to activate.
inactive     | list[int] | List od filters to deactivate.


*Note:*

- **[Authorization Protected](authentication.md)**


**Response**:


```json
Content-Type: application/json
200 OK
```

## Revert to data source job

**Request**:

`POST` `/api/v1/datasources/:id/revert-job`

Parameters:

Name         | Type     | Description
-------------|----------|----------------------------------------------
id           | integer  | Job ID.


*Note:*

- **[Authorization Protected](authentication.md)**


**Response**:


```json
Content-Type: application/json
200 OK
```


## Enums
Data source statuses: `file`, `database`, `api`

## Structures

#### Step

Name       | Type   | Description
-----------|--------|---
script     | int    | Script ID
exec_order | int    | Order of step
options    | object | Additional options
