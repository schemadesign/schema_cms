# Folders

## Get folders data

**Request**:

`GET` `/api/v1/folders`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 2,
            "name": "Info",
            "created_by": {
                "id": "95fad5a2-d6c0-48cc-9fb5-b492f04d48f7",
                "first_name": "",
                "last_name": ""
            },
            "created": "2019-11-21T12:28:09+0000",
            "modified": "2019-11-21T12:28:09+0000",
            "project": 1
        },
        {
            "id": 1,
            "name": "About",
            "created_by": {
                "id": "95fad5a2-d6c0-48cc-9fb5-b492f04d48f7",
                "first_name": "",
                "last_name": ""
            },
            "created": "2019-11-21T12:26:08+0000",
            "modified": "2019-11-21T12:26:08+0000",
            "project": 1
        }
    ]
}
```

## Create folder

**Request**:

`POST` `/api/v1/folders`


Parameters:

Name    | Type    | Required | Description
--------|---------|----------|------------
name    | string  | Yes      | Directory name
project | string  | Yes      | Project id
*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
201 CREATED
    {
        "id": 3,
        "name": "Graph",
        "created_by": {
            "id": "95fad5a2-d6c0-48cc-9fb5-b492f04d48f7",
            "first_name": "",
            "last_name": ""
        },
        "created": "2019-11-21T12:26:08+0000",
        "modified": "2019-11-21T12:26:08+0000",
        "project": 1
    }
```

## Get foler data

**Request**:

`GET` `/api/v1/folder/:id`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "id": 1,
    "name": "About",
    "created_by": {
        "id": "95fad5a2-d6c0-48cc-9fb5-b492f04d48f7",
        "first_name": "",
        "last_name": ""
    },
    "created": "2019-11-21T12:26:08+0000",
    "modified": "2019-11-21T12:26:08+0000",
    "project": 1
}
```


## Update directory data

**Request**:

`PATCH` `/api/v1/folders/:id`

Parameters:

Name    | Type    | Required | Description
--------|---------|----------|------------
name    | string  | Yes      | Directory name

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "id": 1,
    "name": "New About",
    "created_by": {
        "id": "95fad5a2-d6c0-48cc-9fb5-b492f04d48f7",
        "first_name": "",
        "last_name": ""
    },
    "created": "2019-11-21T12:26:08+0000",
    "modified": "2019-11-21T12:26:08+0000",
    "project": 1
}
```

## list pages in folder

**Request**:

`GET` `/api/v1/folders/:id/pages`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
[
    {
        "id": 1,
        "folder": 2,
        "title": "my super page",
        "description": "test 1",
        "keywords": "lskdjflksdjf",
        "page_url": "http://schema-api.com/projects/1/pages/1",
        "created_by": {
            "id": "57e49252-2bab-4982-9f35-7cc0df5a5cfc",
            "first_name": "",
            "last_name": ""
        },
        "created": "2019-11-22T12:12:53+0000",
        "modified": "2019-11-22T12:12:53+0000"
    },
    {
        "id": 2,
        "folder": 2,
        "title": "my super page 2",
        "description": "test 2",
        "keywords": "",
        "page_url": "http://schema-api.com/projects/1/pages/2",
        "created_by": {
            "id": "57e49252-2bab-4982-9f35-7cc0df5a5cfc",
            "first_name": "",
            "last_name": ""
        },
        "created": "2019-11-22T12:13:00+0000",
        "modified": "2019-11-22T12:13:00+0000"
    }
]
```

## Add page to folder

**Request**:

`POST` `/api/v1/folders/:id/pages`

Parameters:

Name        | Type    | Required | Description
------------|---------|----------|------------
title       | string  | Yes      | Page title
description | string  | No       | Page description
keyword     | string  | No       | Page keywords


*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
201 CREATED
{
    "id": 3,
    "folder": 2,
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