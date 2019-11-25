# Blocks

## Get single block data

**Request**:

`GET` `/api/v1/blocks/:id`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "id": 3,
    "page": {
        "id": 1,
        "title": "New Page",
        "directory": 1
    },
    "name": "New Snippet",
    "type": "code_snippet",
    "content": "<p>Test</p>",
    "image": null,
    "is_active": true
}
`````

## Update block data

**Request**:

`PATCH` `/api/v1/blocks/:id`

Parameters:

Name        | Type    | Required | Description
------------|---------|----------|------------
name        | string  | no       | Block name
type        | string  | no       | Block type
content     | string  | No       | Block content
image       | file    | No       | Image file
is_active   | bool    | No       | Is block active?

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "id": 4,
    "page": 1,
    "name": "New Snippet",
    "type": "code_snippet",
    "content": "<p>Test New</p>",
    "image": null,
    "is_active": true
}
```