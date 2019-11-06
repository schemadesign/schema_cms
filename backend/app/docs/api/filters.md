# Filters

## Get filter data

**Request**:

`GET` `/api/v1/filters/:id`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "id": 6,
    "datasource": 129,
    "name": "NewFilter",
    "type": "radio_button",
    "field": "Country Name",
    "field_type": "text",
    "unique_items": 123123,
    "is_active": true,
    "created": "2019-11-04T13:28:56+0000",
    "modified": "2019-11-04T13:28:56+0000"
}
```

## Edit filter data

**Request**:

`PATCH` `/api/v1/filters/:id`

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
Content-Type application/json
200 OK
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
```