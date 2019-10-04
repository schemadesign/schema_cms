# Jobs

## Get job data

**Request**:

`GET` `/api/v1/jobs/:id`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "pk": 8,
    "datasource": 8,
    "steps": [{"script":  1, "exec_order":  0}],
    "job_state": "success",
    "result": "http://localhost:8000/schemacms/storage/projects/1/datasources/8/results_test.csv",
    "error": ""
}
```

## Get job results preview

**Request**:

`GET` `/api/v1/jobs/:id/result-preview`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "data": [
        {
            "first": 1,
            "last": 10
        }
    ],
    "fields": {
        "first": {
            "count": 1.0,
            "mean": 1.0,
            "std": null,
            "min": 1.0,
            "50%": 1.0,
            "max": 1.0,
            "dtype": "int64",
            "sample": 1
        },
        "last": {
            "count": 1.0,
            "mean": 10.0,
            "std": null,
            "min": 10.0,
            "50%": 10.0,
            "max": 10.0,
            "dtype": "int64",
            "sample": 10
        }
    }
}
```