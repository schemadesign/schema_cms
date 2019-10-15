# Users
Manage user accounts.

## Fetch users' profile informations

**Request**:

`GET` `/api/v1/users`

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
  "result": [
    {
      "id": "6d5f9bae-a31b-4b7b-82c4-3853eda2b011",
      "username": "richard",
      "first_name": "Richard",
      "last_name": "Hendriks",
      "email": "richard@piedpiper.com",
      "role": "admin"
    },
    {
      "id": "6d5f9bae-a31b-4b7b-82c4-3853eda2b011",
      "username": "richard",
      "first_name": "Richard",
      "last_name": "Hendriks",
      "email": "richard@piedpiper.com",
      "role": "admin"
    }
  ]
}

```


## Get a user's profile information

**Request**:

`GET` `/api/v1/users/:id` <br/>
`GET` `/api/v1/users/me`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK

{
  "id": "6d5f9bae-a31b-4b7b-82c4-3853eda2b011",
  "username": "richard",
  "first_name": "Richard",
  "last_name": "Hendriks",
  "email": "richard@piedpiper.com",
  "role": "admin"
}
```

## Redirect a user to reset password page


**Request**:

`GET` `/api/v1/users/me/reset-password`

*Note:*

- **[Authorization Protected](authentication.md)**

**Response**:

```json
Content-Type application/json
200 OK

{
  "ticket": "https://schemacms.auth0.com/lo/reset",
}
```


## Update a user's profile information

**Request**:

`POST` `/api/v1/users/:id` <br/>
`PATCH` `/api/v1/users/:id` <br/>
`POST` `/api/v1/users/me` <br/>
`PATCH` `/api/v1/users/me` <br/>

Parameters:

Name       | Type   | Required | Description
-----------|--------|----------|------------
first_name | string | No       | User's first name.
last_name  | string | No       | User's last name.
email      | string | No       | User's email.
role       | string | No       | User's role ([available roles](#enums)).

*Note:*

- **[Authorization Protected](authentication.md)**
- Only user with `admin` role can change other user's profile information

**Response**:

```json
Content-Type application/json
200 OK

{
  "id": "6d5f9bae-a31b-4b7b-82c4-3853eda2b011",
  "username": "richard",
  "first_name": "Richard",
  "last_name": "Hendriks",
  "email": "richard@piedpiper.com",
  "role": "admin"
}
```

## Deactivate a user's account

**Request**:

`POST` `/api/v1/users/:id/deactivate`

*Note:*

- **[Authorization Protected](authentication.md)**
- Only user with `admin` role can deactivate a user's account

**Response**:

```json
Content-Type application/json
204 NO CONTENT
```

## Enums
User's role: `editor`, `admin`
