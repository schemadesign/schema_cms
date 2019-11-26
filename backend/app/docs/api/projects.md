# Projects
Supports creating, viewing, and updating projects associated with user accounts.

## Create a new project

**Request**:

`POST` `/api/v1/projects/`

Parameters:

Name       | Type   | Required | Description
-----------|--------|----------|------------
title      | string | Yes      | Title of project.
owner      | string | Yes      | Creator of the project.
description| text   | No       | Description for the created project.
status     | string | No       | Current status of the project.
editors    | list   | No       | Editors list of the project.

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:


```json
Content-Type: application/json
201 Created
   
{
  "id": 1,
  "title": "Recruitter Yotta",
  "slug": "recruitter-yotta",
  "description": "This one is first project and its description",
  "status": "initial",
  "owner": "3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e",
  "editors": [
      "3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e",
      "44da51ad7-a8b4-4355-b5d6-b51f01f1cb2e"
  ],
  "created": "2019-08-21T10:12:52.030038Z",
  "modified": "2019-08-21T10:12:52.030069Z"
}
```


## Get a projects's information

**Request**:

`GET` `/api/v1/projects/:id`

*Note:*

- **[Authorization Protected](authentication.md)**

Parameters:

**Response**:

```json
Content-Type application/json
200 OK
{
  "id": 1,
  "title": "Recruitter Yotta",
  "slug": "recruitter-yotta",
  "description": "This one is first project and its description",
  "status": "initial",
  "owner": {
      "id": "3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e",
      "first_name": "John",
      "last_name": "Farrel"
  },
  "editors": [
      "3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e",
      "44da51ad7-a8b4-4355-b5d6-b51f01f1cb2e"
  ],
  "created": "2019-08-21T10:12:52.030038Z",
  "modified": "2019-08-21T10:12:52.030069Z"
}
```

`PUT/PATCH` `/api/v1/projects/:id`

Parameters:

Name       | Type   | Description
-----------|--------|---
title      | string | The title of the project object.
description| text   | The description of the project object.
status     | string | The status of project object ([available statuses](#enums)).
owner      | string | The creator of the project object.
editors    | list   | The editors list of the project object.


*Note:*

- **[Authorization Protected](authentication.md)**
- All parameters are optional

**Response**:

```json
Content-Type application/json
200 OK
{
  "id": 1,
  "title": "Recruitter Yotta",
  "slug": "recruitter-yotta",
  "description": "This one is first project and its description",
  "status": "initial",
  "owner": {
      "id": "3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e",
      "first_name": "John",
      "last_name": "Farrel"
  },
  "editors": [
      "3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e",
      "44da51ad7-a8b4-4355-b5d6-b51f01f1cb2e"
  ],
  "created": "2019-08-21T10:12:52.030038Z",
  "modified": "2019-08-21T12:51:53.644557Z"
}
```

## Delete the project information

**Request**:

`DELETE` `/api/v1/projects/:id`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
204 No Content
```

## list project users

**Request**:

`GET` `/api/v1/projects/:id/users`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": "a3f2757e-3c0f-48c2-969e-8947fee8be87",
            "first_name": "Jan",
            "last_name": "Kowalsky"
        }
    ]
}
```

## Remove editor from project

**Request**:

`POST` `/api/v1/projects/:id/remove-editor`

Parameters:

Name  | Type    | Required | Description
------|---------|----------|------------
id    | string  | Yes      | User ID.

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
```

## Add editor to project

**Request**:

`POST` `/api/v1/projects/:id/add-editor`

Parameters:

Name  | Type    | Required | Description
------|---------|----------|------------
id    | string  | Yes      | User ID.

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
```

## list project directories

**Request**:

`GET` `/api/v1/projects/:id/directories`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
[
    {
        "id": 2,
        "name": "Info",
        "created_by": {
            "id": "95fad5a2-d6c0-48cc-9fb5-b492f04d48f7",
            "first_name": "",
            "last_name": ""
        },
        "created": "2019-11-21T12:16:39+0000",
        "modified": "2019-11-21T12:16:39+0000",
        "project": 1
    },
    {
        "id": 1,
        "name": "Index",
        "created_by": {
            "id": "95fad5a2-d6c0-48cc-9fb5-b492f04d48f7",
            "first_name": "",
            "last_name": ""
        },
        "created": "2019-11-21T12:16:35+0000",
        "modified": "2019-11-21T12:16:35+0000",
        "project": 1
    }
]
```

## Add directory to project

**Request**:

`POST` `/api/v1/projects/:id/directories`

Parameters:

Name  | Type    | Required | Description
------|---------|----------|------------
name  | string  | Yes      | Directory name

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
201 CREATED

{
    "id": 3,
    "name": "Views",
    "created_by": {
        "id": "95fad5a2-d6c0-48cc-9fb5-b492f04d48f7",
        "first_name": "",
        "last_name": ""
    },
    "created": "2019-11-21T14:00:59+0000",
    "modified": "2019-11-21T14:00:59+0000",
    "project": 1
}
```

## Enums
Project statuses: `initial`, `processing`
