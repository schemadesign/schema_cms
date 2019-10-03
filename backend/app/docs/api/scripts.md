# Scripts

## Get script data

**Request**:

`GET` `/api/v1/scripts/:id`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK

{
    "id": 1,
    "datasource": 1,
    "name": "test script",
    "is_predefined": true,
    "created_by": {
        "id": "1a24d51a-8a6d-444b-a9ff-d42e724853bd",
        "first_name": "Jan",
        "last_name": "Kowalsky"
    },
    "file": "http://localtest/schemacms/scripts/lambda2.py",
    "body": "df = df.head(3)\n"
}
```