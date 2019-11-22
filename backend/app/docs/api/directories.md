# Directories

## Get directories data

**Request**:

`GET` `/api/v1/directories`

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

## Create directory

**Request**:

`POST` `/api/v1/directories`


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

## Get directory data

**Request**:

`GET` `/api/v1/directories/:id`

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

`PATCH` `/api/v1/directories/:id`

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