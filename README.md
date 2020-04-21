# Motive.js API

### POST /auth/register
```js
 Body:
 - username: String (required): unique username
 - password: String (required): password

 Return:
 - status: 201
 - id: Int
```

### POST /auth/login
```js
 Body:
 - username: String (required): unique username
 - password: String (required): password

 Return:
 - status: 200
 - payload: String: token
```

### [Protected Route] PUT /auth/update
```js
 Headers:
 - authorization: String (required): valid token

 Body:
 - oldPassword: String (required): previous password
 - newPassword: String (required): updated password

 Return:
 - status: 204
```

### [Protected Route] GET /todo
```js
 Headers:
 - authorization: String (required): valid token

 Return:
 - status: 200
 - todos: Todo[] | []
```

### [Protected Route] GET /filter?search={search}
```js
 Headers:
 - authorization: String (required): valid token

 Query:
 - search: String (required): filter string

 Return:
 - status: 200
 - todo: Todo[] | []
```

### [Protected Route] POST /todo
```js
 Headers:
 - authorization: String (required): valid token

 Body:
 - category: String (required): Ex. work, personal
 - content: String (required): Ex. take out trash

 Return:
 - status: 200
 - todos: Todo
```

### [Protected Route] DELETE /todo
```js
 Headers:
 - authorization: String (required): valid token

 Params:
 - id: Int (required): todo id to be deleted

 Return:
 - status: 202
 - todos: Todo
```

