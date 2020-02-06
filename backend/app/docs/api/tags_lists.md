# Tags

## Get tag data

**Request**:

`GET` `/api/v1/tags-lists/:id`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "id": 6,
    "datasource": {
        "id": 1,
        "name": "TestDataSource"
     },
    "name": "tagsListName",
    "is_active": true,
    "created": "2019-11-04T13:28:56+0000",
    "modified": "2019-11-04T13:28:56+0000",
    "tags": [
        {"id": 1, "value": "tagValue", "exec_order": 0},
    ]
}
```

## Edit tag data

**Request**:

`PATCH` `/api/v1/tags/:id`

Parameters:

Name         | Type     | Description
-------------|----------|----------------------------------------------
name         | string   | Tags list name.
is_active    | bool     | Is tags list active?

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "id": 6,
    "datasource": {
        "id": 1,
        "name": "TestDataSource"
     },
    "name": "tagsListName",
    "is_active": true,
    "created": "2019-11-04T13:28:56+0000",
    "modified": "2019-11-04T13:28:56+0000",
    "tags": [
        {"id": 1, "value": "tagValue", "exec_order": 0},
    ]
}
```