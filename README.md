# Motive.js API

Motive.js is a small CLI todo-list application to sync your todos from different terminal workspaces. The peristence layer is provided by Postgresql, the models are exposed via Prisma 2, and the application is running on Express. Authentication brought to you by jsonwebtokens.

## Quick Start

To get the project running locally, you must have postgresql installed on your machine, or will otherwise have to declare your own schema definition.

#### Configure database

Clone this repository

In the `prisma` directory, declare a `.env` file with your database url:

```
DATABASE_URL="postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}?schema=public"
```

Where the `schema` should reflect your `schema.sql` file.

One you have setup your database server and added your connection url:

`psql -h HOST -d DATABASE -U USER -f schema.sql`

Where `HOST`, `DATABASE`, and `USER` are placeholders for your own credentials.

#### Running the server locally

From the root directory, run `yarn` or `npm i` to install dependencies.

Run `npx prisma introspect` to introspect the database schema and generate the prisma schema.

Next, run `npx prisma generate` to generate the @prisma/client modules and expose the client methods to the express application.

Finally, `yarn start:dev` or `npm run start:dev` to initialize the server:

`Server has started on port 8000`

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

### [Protected Route] PUT /todo/:id
```js
 Headers:
 - authorization: String (required): valid token

 Body:
 - category: String (required): Ex. work, personal
 - content: String (required): Ex. take out trash

 Return:
 - status: 204
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

## Author

- [Nicholas Gebhart](https://nicholasgebhart.com)

## License
This project is open source and available under the [MIT License](/LICENSE)
