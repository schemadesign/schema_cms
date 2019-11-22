# Pages

## Get single page data

**Request**:

`GET` `/api/v1/pages/:id`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "id": 3,
    "directory": {
        "id": 2,
        "name": "About",
        "project": 1
    },
    "title": "test page",
    "description": "i'm testing page",
    "keywords": "test; page",
    "page_url": "http://schema-api.com/projects/1/pages/3",
    "created_by": {
        "id": "57e49252-2bab-4982-9f35-7cc0df5a5cfc",
        "first_name": "",
        "last_name": ""
    },
    "created": "2019-11-22T13:09:02+0000",
    "modified": "2019-11-22T13:09:02+0000"
}
```


## Update page data

**Request**:

`PATCH` `/api/v1/pages/:id`

Parameters:

Name        | Type    | Required | Description
------------|---------|----------|------------
title       | string  | No       | Page title
description | string  | No       | Page description
keyword     | string  | No       | Page keywords

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "id": 3,
    "directory": {
        "id": 2,
        "name": "About",
        "project": 1
    },
    "title": "new test page",
    "description": "i'm testing page",
    "keywords": "test; page",
    "page_url": "http://schema-api.com/projects/1/pages/3",
    "created_by": {
        "id": "57e49252-2bab-4982-9f35-7cc0df5a5cfc",
        "first_name": "",
        "last_name": ""
    },
    "created": "2019-11-22T13:09:02+0000",
    "modified": "2019-11-22T13:09:02+0000"
}
```