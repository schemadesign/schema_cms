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
  "created": "2019-08-21T10:12:52.030038Z",
  "modified": "2019-08-21T10:12:52.030069Z"
}
```


## Get a projects's information

**Request**:

`GET` `/api/v1/projects/:id`

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
  "owner": "3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e",
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
status     | string | The status of project object.
owner      | string | The creator of the project object.



*Note:*

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
  "owner": "3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e",
  "created": "2019-08-21T10:12:52.030038Z",
  "modified": "2019-08-21T12:51:53.644557Z"
}
```

## Delete the project information

**Request**:

`DELETE` `/api/v1/projects/:id`

**Response**:

```json
Content-Type application/json
204 No Content
```