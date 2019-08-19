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


## Retrieving Tokens
A user need to be authorized by [Auth0](https://auth0.com/) and through by backend's login process. A logged in user can retrieve their token with the following request:

**Request**:

`GET` `/api/v1/auth/token`

**Response**:
```json
{ 
    "token" : "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" 
}
```
