# Public API

## Get All Project
**Request**:

`GET` `/projects`

**Response**:


```json
Content-Type: application/json
200 OK
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "meta": {
         "id": 1,
         "owner": "Jan Kowalsky",
         "description": "Test Project",
         "title": "PagesExampleProject",
         "updated": "2020-01-28T13:53:02.848621+00:00",
         "created": "2020-01-28T13:53:02.848594+00:00"
      },
      "data_sources": [
         {"name": "TestDS2", "type": "file", "id": 2, "tags": {"category_1": ["value1", "value2"]}},
         {"name": "TestDS1", "type": "file", "id": 1, "tags": {}}
      ], 
      "content": {
         "sections": [
          {
            "id": 1,
            "name": "Section Name",
            "slug": "section-name",
            "pages": [
              {
                "id": 1,
                "name": "Page Name",
                "slug": "page-name",
                "template": "New Page Template",
                "description": "New page test.",
                "tags": {
                    "category_1": ["value1", "value2"],
                    "category_2": ["value3", "value4"]
                },               
                "keywords": "new;page",
                "created_by": "Jan Kowalsky",
                "updated": "2020-05-05"
              },
            ]
          },
        ]
      }
    }
  ]
}
```

## Get Project
**Request**:

`GET` `/projects/<id>`

**Response**:


```json
Content-Type: application/json
200 OK
{
  "meta": {
     "id": 1,
     "owner": "Jan Kowalsky",
     "description": "Test Project",
     "title": "PagesExampleProject",
     "updated": "2020-01-28T13:53:02.848621+00:00",
     "created": "2020-01-28T13:53:02.848594+00:00"
  },
  "data_sources": [
     {"name": "TestDS2", "type": "file", "id": 2, "tags": {"category_1": ["value1", "value2"]}},
     {"name": "TestDS1", "type": "file", "id": 1, "tags": {}}
  ], 
  "content": {
     "sections": [
      {
        "id": 1,
        "name": "Section Name",
        "slug": "section-name",
        "pages": [
          {
            "id": 1,
            "name": "Page Name",
            "slug": "page-name",
            "template": "New Page Template",
            "description": "New page test.",
            "keywords": "new;page",
            "tags": {
                "category_1": ["value1", "value2"],
                "category_2": ["value3", "value4"]
            },
            "created_by": "Jan Kowalsky",
            "updated": "2020-05-05"
          },
        ]
      },
    ]
  }
}
```

## Get Project Tags Categories
**Request**:

`GET` `/projects/<id>/tags`

**Response**:


```json
Content-Type: application/json
200 OK
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Category 1",
      "is_single_select": true,
      "type": {
          "content": true,
          "dataset": true
      },
      "tags": [
        "Value 1",
        "Value 2"
      ]
    },
    {
      "id": 2,
      "name": "Category 2",
      "is_single_select": false,
      "type": {
          "content": true,
          "dataset": false
      },
      "tags": [
        "Value 1",
        "Value 2"
      ]
    }
  ]
}
```

## Get Project Data Sources
**Request**:

`GET` `/projects/<id>/datasources`

**Response**:


```json
Content-Type: application/json
200 OK
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
      {
        "id": 1,
        "name": "TestDS1",
        "created_by": "Jan Kowalsky",
        "updated": "2020-04-03",
        "created": "2020-04-03",
        "tags": {
        "category_1": ["value1", "value2"],
        "category_2": ["value3", "value4"]
        }, 
      },
      {
        "id": 2,
        "name": "TestDS2",
        "created_by": "Jan Kowalsky",
        "updated": "2020-04-07",
        "created": "2020-04-07",
        "tags": {}
      }
    ]
}
```

## Get Project Pages
**Request**:

`GET` `/projects/<id>/pages`

**Response**:


```json
Content-Type: application/json
200 OK
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
      {
        "id": 1,
        "name": "Page Name",
        "section": {
          "id": 1,
          "name": "Test Section",
          "slug": "test-section"
        },   
        "template": {
          "id": 1,
          "name": "New Page Template"
        },
        "display_name": "page-name",
        "slug": "page-name",
        "description": "New page test.",
        "keywords": "new;page;test",
        "created_by": "Jan Kowalsky",
        "updated": "2020-05-05",
        "tags": {
            "category_1": ["value1", "value2"],
            "category_2": ["value3", "value4"]
        }
      }
    ]
}
```

## Get Section
**Request**:

`GET` `/sections/<id>`

**Response**:

```json
Content-Type: application/json
200 OK
{
  "id": 1,
  "name": "Section Name",
  "slug": "section-name",
  "pages": [
    {
      "id": 1,
      "name": "Page Name",
      "slug": "page-name",
      "template": "New Page Template",
      "description": "New page test.",
      "keywords": "new;page;test",
      "created_by": "Jan Kowalsky",
      "updated": "2020-05-05",
    }
  ]
}
```

## Get Page
**Request**:

`GET` `/pages/<id>`

**Response**:

```json
Content-Type: application/json
200 OK
{
    "id": 1,
    "name": "Page Name",
    "display_name": "page-name",
    "slug": "page-name",
    "section": {
      "id": 1,
      "name": "Test Section",
      "slug": "test-section"
    },   
    "template": {
      "id": 1,
      "name": "New Page Template"
    },
    "description": "New page test",
    "keywords": "new;page;test",
    "created_by": "Jan Kowalsky",
    "updated": "2020-04-07",
    "tags": {
        "category_1": ["value1", "value2"],
        "category_2": ["value3", "value4"]
    }, 
    "blocks": [
        {
          "id": 1,
          "name": "New Block",
          "order": 1,
          "template": {"id": 1, "name": "Test Block Template 1"},
          "elements": [
            {
              "id": 1,
              "name": "Plain Text element",
              "type": "plain_text",
              "order": 0,
              "value": "test value",
              "html": "<div id='plain-text-7' class='element text'><p>test value</p></div>"
            }
          ]
        },
        {
          "id": 2,
          "name": "New Block 2",
          "order": 2,
          "template": {"id": 2, "name": "Test Block Template 2"},
          "elements": [
            {
              "id": 2,
              "name": "Connection element",
              "type": "connection",
              "order": 0,
              "value": "https://wp.pl",
              "html": "<div id='connection-8' class='element connection'><a href='https://wp.pl' target='_blank'>https://wp.pl</a></div>"
            }
          ]
        },
        {
          "id": 3,
          "name": "New Block 3",
          "order": 3,
          "template": {"id": 2, "name": "Test Block Template 3"},
          "elements": [
            {
              "id": 9,
              "name": "Markdown element",
              "type": "markdown",
              "order": 0,
              "value": "# Header",
              "html": "<div id='markdown-9' class='element markdown'><h1>Header</h1></div>"
            }
          ]
        },
        {
          "id": 4,
          "name": "New Block 4",
          "order": 0,
          "template": {"id": 2, "name": "Test Block Template 4"},
          "elements": [
            {
              "id": 10,
              "name": "Image element",
              "type": "image",
              "order": 0,
              "value": {
                "file_name": "Screenshot_from_2020-04-06_14-20-47.png",
                "image": "http://url.com/schemacms/blocks/14/Screenshot_from_2020-04-06_14-20-47.png"
              },
              "html": "<div id='image-10' class='element image'><figure><img src='http://url.com//schemacms/blocks/14/Screenshot_from_2020-04-06_14-20-47.png' alt='Screenshot_from_2020-04-06_14-20-47.png'></figure></div>"
            }
          ]
        }
      ]
}
```
**Request**:

`GET` `/pages/<id>/html`

**Response**:

**Note**:
`This endpint will render page blocks into HTML page`

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="description" content="New page test">
	<meta name="keywords" content="new;page;test">
	<meta name="author" content="Jan Kowalsky">
	<title></title>
</head>

<body>
    <div id='plain-text-1' class='element text'><p>test value</p></div>
    <div id='connection-2' class='element connection'><a href='https://wp.pl' target='_blank'>https://wp.pl</a></div>
    <div id='markdown-3' class='element markdown'><h1>Header</h1></div>
    <div id='image4' class='element image'><figure><img src='http://localstack:4572/schemacms/blocks/14/Screenshot_from_2020-04-06_14-20-47.png' alt='Screenshot_from_2020-04-06_14-20-47.png'></figure></div>
</body>
</html>

```


## Get Page Blocks
**Request**:

`GET` `/pages/<id>/blocks`

**Response**:

```json
Content-Type: application/json
200 OK
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "New Block",
      "order": 1,
      "template": {"id": 1, "name": "Test Block Template 1"},
      "elements": [
        {
          "id": 1,
          "name": "Plain Text element",
          "type": "plain_text",
          "order": 0,
          "value": "test value",
          "html": "<div id='plain-text-7' class='element text'><p>test value</p></div>"
        }
      ]
    },
  ]
}
```


## Get Page Block
**Request**:

`GET` `/pages/<id>/blocks/<id>`

**Response**:

```json
Content-Type: application/json
200 OK
{
  "id": 1,
  "name": "New Block",
  "order": 1,
  "template": {"id": 1, "name": "Test Block Template 1"},
  "elements": [
    {
      "id": 1,
      "name": "Plain Text element",
      "type": "plain_text",
      "order": 0,
      "value": "test value",
      "html": "<div id='plain-text-7' class='element text'><p>test value</p></div>"
    }
  ]
}
```

## Get Data Sources
**Request**:

`GET` `/datasources`

**Response**:


```json
Content-Type: application/json
200 OK
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
      {
        "id": 1,
        "name": "TestDS1",
        "project": 1,
        "tags": ["tag", "value"],
        "created_by": "Jan Kowalsky",
        "updated": "2020-04-03",
        "created": "2020-04-03"
      },
      {
        "id": 2,
        "name": "TestDS2",
        "project": 1,
        "tags": ["tag", "value"],
        "created_by": "Jan Kowalsky",
        "updated": "2020-04-03",
        "created": "2020-04-03"
      },
      {
        "id": 3,
        "name": "TestDS3",
        "project": 2,
        "tags": ["tag", "value"],
        "created_by": "Jan Kowalsky",
        "updated": "2020-04-07",
        "created": "2020-04-07"
      }
    ]
}
```


## Get Data Source preview
**Request**:

`GET` `/datasources/<id>`

**Response**:

```json
Content-Type: application/json
200 OK
{
   "meta": {
      "id": 2,
      "created_by": "Jan Kowalsky",
      "name": "TestDS1",
      "updated": "2020-04-07",
      "created": "2020-04-07"
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
   "tags": ["tag", "value"],
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

`GET` `/datasources/<id>/meta`

**Response**:

```json
Content-Type: application/json
200 OK
{
    "id": 2,
    "created_by": "Jan Kowalsky",
    "name": "TestDS1",
    "updated": "2020-04-07",
    "created": "2020-04-07"
}
```

## Get Data Source fields
**Request**:

`GET` `/datasources/<id>/fields`

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

`GET` `/datasources/<id>/filters`

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

`GET` `/datasources/<id>/records`

**Note**:

**Extra parameters:**

`page_size` - number of rows on page to fetch - default `5000`

`page` - number of page to fetch - default `5000`

`orient ` - records output format (check orients [here](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html) - default `index`

`columns` - list of columns you want to fetch, example:

* `/datasources/<id>/records?columns=Total Revenue,Total Cost`

**Response**:

```json
Content-Type: application/json
200 OK
{
  "count": 1000000,
  "pages": 200,
  "results": {
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