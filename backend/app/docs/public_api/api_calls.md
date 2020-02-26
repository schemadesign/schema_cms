# Public API

## Get All Project
**Request**:

`GET` `/api/v1/projects`

**Response**:


```json
Content-Type: application/json
200 OK
[
    {
      "id": 1,
      "meta": {
         "owner": "Jan Kowalsky",
         "description": "Test Project",
         "title": "PagesExampleProject",
         "updated": "2020-01-28T13:53:02.848621+00:00",
         "created": "2020-01-28T13:53:02.848594+00:00"
      },
      "data_sources": [
         {"name": "TestDS2", "type": "file", "id": 2},
         {"name": "TestDS1", "type": "file", "id": 1}
      ], 
      "pages": [
          {"description": "html format page example", "id": 1, "folder": "TestFolder", "title": "ExamplePage"}
      ]
    },
    ...
]
```

## Get Project
**Request**:

`GET` `/api/v1/projects/<id>`

**Response**:


```json
Content-Type: application/json
200 OK
{
  "id": 1,
  "meta": {
     "owner": "Jan Kowalsky",
     "description": "Test Project",
     "title": "PagesExampleProject",
     "updated": "2020-01-28T13:53:02.848621+00:00",
     "created": "2020-01-28T13:53:02.848594+00:00"
  },
  "data_sources": [
     {"name": "TestDS2", "type": "file", "id": 2},
     {"name": "TestDS1", "type": "file", "id": 1}
  ], 
  "pages": [
      {"description": "html format page example", "id": 1, "folder": "TestFolder", "title": "ExamplePage"}
  ]
}
```

## Get Page
**Request**:

`GET` `/api/v1/pages/<id>`

**Response**:

```json
Content-Type: application/json
200 OK
{
   "id":1,
   "title":"ExamplePage",
   "description":"html format page example",
   "keywords":"keyword;1",
   "folder":"TestFolder",
   "updated":"2020-01-28 13:54:00.418050+00:00",
   "creator":"Jan Kowalsky",
   "blocks":[
      {
         "name": "markdownBlock",
         "images": [],
         "id": 1,
         "type": "markdown",
         "content": "# SupeExample\r\n\r\n## Some markdown code\r\n\r\n**Request**:\r\n\r\n`GET` `/api/v1/filters/:id`",
         "exec_order": 0
      },
      {
         "name": "imageBlock",
         "id": 1,
         "type": "image",
         "content": null,
         "exec_order": 1,
         "images": [
            {
               "name": "download.jpeg",
               "url": "https://base-schemacms9bb02a51-186v5uihbpga8.s3.amazonaws.com/pages/63/download.jpeg",
               "order": 1         
            },
            {
               "name": "916ecd6cd846ccd9b4bbc8bbe1ea.jpeg",
               "url": "https://base-schemacms9bb02a51-186v5uihbpga8.s3.amazonaws.com/pages/63/916ecd6cd846ccd9b4bbc8bbe1ea.jpeg",
               "order":0   
            }
         ]
      },
      {
         "name": "codeStyleBlock",
         "images": [],
         "id": 2,
         "type": "code",
         "content": "<style>\r\nbody {\r\n    background-color: #d24dff;\r\n}\r\n</style>",
         "exec_order": 2
      },
      {
         "name": "embedBlock",
         "images": [],
         "id": 3,
         "type": "embed",
         "content": "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/_T8LGqJtuGc\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>",
         "exec_order": 3
      }
   ]
}
```
**Request**:

`GET` `/api/v1/pages/<id>?format=html`

**Response**:

**Note**:
`This endpint will render page blocks into HTML page`

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="description" content='html format page example'>
	<meta name="keywords" content="keyword;1">
	<meta name="author" content="Jan Kowalsky">
	<title>ExamplePage</title>
</head>

<body>
    <div id='1' class='markdown'><h1>SupeExample</h1>
        <h2>Some markdown code</h2>
        <p><strong>Request</strong>:</p>
        <p><code>GET</code> <code>/api/v1/filters/:id</code></p>
    </div>
		
    <div id='2' class='image'>
        <ul>
            <li><img src="https://base-schemacms9bb02a51-186v5uihbpga8.s3.amazonaws.com/pages/63/download.jpeg" alt="download.jpeg" id="1"></li>
            <li><img src="https://base-schemacms9bb02a51-186v5uihbpga8.s3.amazonaws.com/pages/63/916ecd6cd846ccd9b4bbc8bbe1ea.jpeg" alt="916ecd6cd846ccd9b4bbc8bbe1ea.jpeg" id="0"></li>  
        </ul>
    </div>

    <style>
        body {
            background-color: #d24dff;
        }
    </style>

    <div id='3' class='embed'>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/_T8LGqJtuGc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
</body>
</html>
```

## Get Data Source preview
**Request**:

`GET` `/api/v1/datasources/<id>`

**Response**:

```json
Content-Type: application/json
200 OK
{
   "id": 1,
   "meta": {
      "source-url": null,
      "creator": "Jan Kowalsky",
      "name": "TestDS1",
      "description": null,
      "source": null,
      "updated": "2020-02-19T13:32:13.645863+00:00",
      "methodology": null
   },
   "shape": [1000000, 3],
   "fields": {
      "0": {
         "name": "Total Revenue",
         "type": "number"
      },
      "1": {
         "name": "Total Cost",
         "type": "number" 
      },
      "2": {
         "name": "Total Profit",
         "type": "number"
      },
   },
   "filters": [],
   "tags": [
      {
        "name": "tagList1",
        "id": 1,
        "tags": [
          {
            "list": "tagList1",
            "value": "tag1",
            "id": 1
          },
          {
            "list": "tagList1",
            "value": "tag2",
            "id": 2
          },
          {
            "list": "tagList1",
            "value": "tag3",
            "id": 3
          }
        ]
      },
      {
        "name": "tagList2",
        "id": 2,
        "tags": [
          {
            "list": "tagList2",
            "value": "tag1",
            "id": 4
          },
          {
            "list": "tagList2",
            "value": "tag2",
            "id": 5
          },
          {
            "list": "tagList2",
            "value": "tag3",
            "id": 6
          },
          {
            "list": "tagList2",
            "value": "tag4",
            "id": 7
          }
        ]
      } 
   ],
   "records": {
      "0": {
         "Total Revenue": 14862.69,
         "Total Cost": 11023.56,
         "Total Profit": 3839.13
      },
      "1": {
         "Total Revenue": 503890.08,
         "Total Cost": 165258.24,
         "Total Profit": 338631.84
      },
      "2": {
         "Total Revenue":151880.4,
         "Total Cost":131288.4,
         "Total Profit":20592.0
      },
      "3": {
         "Total Revenue": 61415.36,
         "Total Cost": 20142.08,
         "Total Profit": 41273.28
      },
      "4": {
         "Total Revenue": 188518.85,
         "Total Cost":  126301.67,
         "Total Profit":62217.18
      },
      "5": {
         "Total Revenue": 12866.07,
         "Total Cost": 9542.68,
         "Total Profit": 3323.39
      },
      "6": {
         "Total Revenue": 28327.65,
         "Total Cost": 18978.63,
         "Total Profit": 9349.02
      },
      "7": {
         "Total Revenue": 70036.2,
         "Total Cost": 46922.04,
         "Total Profit": 23114.16   
      },
      "8": {
         "Total Revenue": 583484.16,
         "Total Cost": 470364.16,
         "Total Profit": 113120.0     
      },
      "9": {
         "Total Revenue": 3396169.6,
         "Total Cost": 2045547.44,
         "Total Profit": 1350622.16
      }
   }
}
```

## Get Data Source meta
**Request**:

`GET` `/api/v1/datasources/<id>/meta`

**Response**:

```json
Content-Type: application/json
200 OK
{
  "source-url": null,
  "creator": "Jan Kowalsky",
  "name": "TestDS1",
  "description": null,
  "source": null,
  "updated": "2020-02-19T13:32:13.645863+00:00",
  "methodology": null
}
```

## Get Data Source fields
**Request**:

`GET` `/api/v1/datasources/<id>/fields`

**Response**:

```json
Content-Type: application/json
200 OK
{
  "0": {
    "name": "Total Revenue",
    "type": "number"
  },
  "1": {
    "name": "Total Cost",
    "type": "number"
  },
  "2": {
    "name": "Total Profit",
    "type": "number"
  }
}
```

## Get Data Source filters
**Request**:

`GET` `/api/v1/datasources/<id>/filters`

**Response**:

```json
Content-Type: application/json
200 OK
[
  {
    "name": "exampleFilter1",
    "id": 1,
    "type": "checkbox",
    "field": "Region"
  },
  {
    "name": "exampleFilter2",
    "id": 2,
    "type": "range",
    "field": "Total Revenue"
  }
]
```

## Get Data Source records
**Request**:

`GET` `/api/v1/datasources/<id>/records`

**Note**:

**Extra parameters:**

`page_size` - number of rows on page to fetch - default `5000`

`page` - number of page to fetch - default `5000`

`orient ` - records output format (check orients [here](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html) - default `index`

`columns` - list of columns you want to fetch, example:

* `/api/v1/datasources/<id>/records?columns=Total Revenue,Total Cost`

**Response**:

```json
Content-Type: application/json
200 OK
{
  "count": 1000000,
  "pages": 200,
  "records": {
    "0": {
      "Total Revenue": 14862.69,
      "Total Cost": 11023.56,
      "Total Profit": 3839.13
    },
    "1": {
      "Total Revenue": 503890.08,
      "Total Cost": 165258.24,
      "Total Profit": 338631.84
    },
    "2": {
      "Total Revenue": 151880.4,
      "Total Cost": 131288.4,
      "Total Profit": 20592
    },
    ...,
  }
}
```