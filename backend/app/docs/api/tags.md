# Tags

## Get tag data

**Request**:

`GET` `/api/v1/tags/:id`

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
    "key": "tagKey",
    "value": "tagValue",
    "is_active": true,
    "created": "2019-11-04T13:28:56+0000",
    "modified": "2019-11-04T13:28:56+0000"
}
```

## Edit tag data

**Request**:

`PATCH` `/api/v1/tags/:id`

Parameters:

Name         | Type     | Description
-------------|----------|----------------------------------------------
key          | string   | Tag key.
value        | string   | Value of tag.
is_active    | bool     | Is tag active?

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
    "key": "tagKey",
    "value": "tagValue",
    "is_active": true,
    "created": "2019-11-04T13:28:56+0000",
    "modified": "2019-11-04T13:28:56+0000"
}
```