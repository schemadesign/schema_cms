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
    "folder": {
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
    "folder": {
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

## list page blocks

**Request**:

`GET` `/api/v1/pages/:id/blocks`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
[
    {
        "id": 1,
        "page": 1,
        "name": "New Image",
        "type": "image_uploaded",
        "content": null,
        "image": "http://localhost:8000/pages/1/new_iamge.png",
        "is_active": true
    },
    {
        "id": 2,
        "page": 1,
        "name": "Tutorial Video",
        "type": "youtube_embed",
        "content": "<some code>",
        "image": null,
        "is_active": true
    }
]
```

## Add block to page

**Request**:

`POST` `/api/v1/pages/:id/blocks`

Parameters:

Name        | Type    | Required | Description
------------|---------|----------|------------
name        | string  | Yes      | Block name
type        | string  | Yes      | Block type
content     | string  | No       | Block content
image       | file    | No       | Image file
is_active   | bool    | No       | Is block active?


*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
201 CREATED
{
    "id": 3,
    "page": 1,
    "name": "New Snippet",
    "type": "code_snippet",
    "content": "<p>Test</p>",
    "image": null,
    "is_active": true
}
```

## activate/deactivate blocks

**Request**:

`POST` `/api/v1/pages/:id/set-blocks`

Parameters:

Name         | Type      | Description
-------------|-----------|----------------------------------------------
active       | list[int] | List of blocks to activate.
inactive     | list[int] | List od blocks to deactivate.


*Note:*

- **[Authorization Protected](authentication.md)**


**Response**:


```json
Content-Type: application/json
200 OK
```