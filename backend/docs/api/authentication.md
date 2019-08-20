# Authentication
For clients to authenticate, the token key should be included in the Authorization HTTP header. The key should be prefixed by the string literal "Token", with whitespace separating the two strings. For example:

```
Authorization: Bearer 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

Unauthenticated responses that are denied permission will result in an HTTP `401 Unauthorized` response with an appropriate `WWW-Authenticate` header. For example:

```
WWW-Authenticate: Bearer
```

The curl command line tool may be useful for testing token authenticated APIs. For example:

```bash
curl -X GET http://127.0.0.1:8000/api/v1/example/ -H 'Authorization: Bearer 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b'
```


## OAuth2 authentication backends

### Auth0
Auth0 authentication using oauth2 flow

**Request**:

`GET` `/api/v1/auth/login/auth0`

**Response**:
```http request
Redirect: https://schemadesign.auth0.com/login?state=X&client=Y&protocol=oauth2&redirect_uri=Z&response_type=code&scope=openid%20profile%20email
```

After user authorization by Auth0 user is redirected to home page with authorization cookies.
Token and User ID is added to the redirected url query string: `?token=X&uid=Y`


## Retrieving Tokens
Retrieve JWT Token with exchange token generated based on User's last login date.
All exchange tokens became invalid after retrieving JWT Token.

**Request**:

`POST` `/api/v1/auth/token`

Parameters:

Name       | Type   | Required | Description
-----------|--------|----------|------------
uid   | string | Yes      | The ID of user.
token   | string | Yes      | The generated exchange token.

**Responses**:

Success:
```json
Content-Type application/json
200 Created

{ 
    "token" : "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" 
}
```

Error:

```json
Content-Type application/json
400 Created

{
    "uid": ["This field is required."],
    "token": ["This field is required."],
}
```
