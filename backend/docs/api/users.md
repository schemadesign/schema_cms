# Users
Supports viewing user accounts.

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
}
```

