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
    "datasource": {"id":  8, "project":  1},
    "steps": [{"script":  1, "exec_order":  0, "body":  "df = df.head(3)"}],
    "job_state": "success",
    "result": "http://localhost:8000/schemacms/8/results_test.csv",
    "source_file_url": "http://localhost:8000/schemacms/8/source_file.csv?versionID=1123",
    "description": "this is test job",
    "error": ""
}
```

## Edit job description

**Request**:

`PATCH` `/api/v1/jobs/:id`

Parameters:

Name       | Type   | Required | Description
-----------|--------|----------|------------
description| text   | No       | Description for the job.

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK
{
    "description": "this is test job"
}
```

## Get job results preview

**Request**:

`GET` `/api/v1/jobs/:id/preview`

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
            "max": 1.0,
            "dtype": "int64",
            "sample": 1
        },
        "last": {
            "count": 1.0,
            "mean": 10.0,
            "std": null,
            "min": 10.0,
            "max": 10.0,
            "dtype": "int64",
            "sample": 10
        }
    }
}
```