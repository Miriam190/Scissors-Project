# shortify

A URL shortener

## Description:
A QRcode result generator for shortened URLs, built for easy link download and share.

## Built With:
```diff
Node.js
Express.js
Ejs 
MongoDB
```

## Clone this Repo:

`git clone https://github.com/AnthoniaNwanya/shortify.git`

## Installation:

`npm install`

## Start App:
prod:

`npm run start`

dev:

`npm run dev`

## Test:
`npm run test`

`npm run test:watch`


## Schemas:
#### User Schema

```
({
  id: ObjectId,
  username: {
    type: String,
    required: [true, "can't be blank"],
  },
  email: {
    type: String,
    required: [true, "can't be blank"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "can't be blank"],
  },
  URLS: [
    {
      type: String,
      ref: "URL",
    },
  ],
    createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
});
```

#### URL Schema

```
({
  id: ObjectId,
  urlId: {
    type: String,
  },
  origUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
  },
  historyUrl: {
    type: String,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  User: {
    type: String,
    ref: "User",
  },
  clicker: {
    type: Array,
    default: "none" ,
  },
  createdAt: {
    type: String,
  }
});
```
## Routes and Paths
#### AUTH ROUTE
#### SignUp 
###### Method: POST /
###### Request:

```
{
  "username": "Tonia Nwanya",
  "email": "tonia@yahoo.com",
  "password": "tonia123@"
}
```

###### Response:

```
Status: 302
Redirect: /login
```

#### Login
###### Method: POST /login

###### Request:

```
{
  "email": "tonia@yahoo.com",
  "password": "tonia123@"
}
```

###### Response:

```
Status 302
Redirect: /api/shortify
```
#### USER ROUTE
#### Get All Users

###### Method: GET /api/user
###### Response:

```
{
  "success": true,
  "status": "success",
  "statusCode": 200,
  "data": [
    {
      "_id": "64919bbe9d3654b7d6402d15",
      "username": "Tonia Nwanya",
      "email": "tonia@yahoo.com",
      "URLS": [
        "http://localhost:8000/9ePLm",
        "http://localhost:8000/-NkC2",
        "http://localhost:8000/ZzNlD",
        "http://localhost:8000/HEqYm"
      ],
      "createdAt": "Tue Jun 20 2023 13:29:50 GMT+0100 (West Africa Standard Time)",
      "__v": 4
    },
    {
      "_id": "64919bbe9d3654b7d6402d15",
      "username": "Test",
      "email": "testemail2@gmail.com",
      "URLS": [],
      "createdAt": "Tue Jun 20 2023 13:10:50 GMT+0000 (Coordinated Universal Time)",
      "__v": 0
    }
  ],
  "message": "Users retrieved successfully"
}
```

#### Get User By Email

###### Method: GET /api/user/:email
###### Response:

```
{
  "success": true,
  "status": "success",
  "statusCode": 200,
  "data": {
    "_id": "64919bbe9d3654b7d6402d15",
    "username": "Tonia Nwanya",
    "email": "tonia@yahoo.com",
    "URLS": [
      "http://localhost:8000/9ePLm",
      "http://localhost:8000/-NkC2",
      "http://localhost:8000/ZzNlD",
      "http://localhost:8000/HEqYm"
    ],
    "createdAt": "Tue Jun 20 2023 13:29:50 GMT+0100 (West Africa Standard Time)",
    "__v": 4
  },
  "message": "User retrieved successfully"
}
```

#### Update User

###### Method: PUT /api/user/update/:id
###### Header Set-Cookie: {token}
###### Request:
```
{
  "username": "Toni",
  "email": "toni@yahoo.com",
  "password": "toni123@"
}
```
###### Response:

```
Status: 200
Redirect: /api/user/update/:id
```

#### Delete User

###### Method: GET /api/user/delete/:id
###### Header Set-Cookie: {token}
###### Response:

```
  Status: 302,
  Redirect: /
```

#### URL ROUTE

#### Post URL
###### Method: POST /api/shortify
###### Header Set-Cookie: {token}
###### Request:

```
{
  "origUrl": "https://github.com/AnthoniaNwanya/shortify",
  "customId": "shortify"
}
```
###### Response:

```
  Status: 200
```

#### Get URLS 
###### Method: GET /api/shortify/history
###### Header: Set-Cookie: {token}
###### Response:

```
  Status: 200
```
#### Get URL Analytics
###### Method: GET /api/shortify/analytics
###### Header: Set-Cookie: {token}

###### Response:
```
  Status: 200

```