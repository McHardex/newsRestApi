# Mchardex news-react API

# End Points Functionalities
|End Point| Body Payload | Description  | Require Auth Token|
|:---------------------:|  :----:| :----:| :----:|
| **POST /users/** | name, email, bio, password | Create User | false
| **POST /api/auth**| email, password | Login user | false
| **GET /api/articles** | - | Fetches all articles by a logged in user| true
| **GET api/users** | - | Fetches all users in the database | true
| **GET api/writers** | - | Fetches all users who have written a minimum of 1 article | true
| **GET api/me** | - | Fetches personal profile | true



# Running The Application

-  Clone or download the repo
```
git clone https://github.com/McHardex/newsRestApi.git
```

- Navigate to the app directory
```
cd newsRestApi
```

- Bundle dependencies
```
npm install
```

- Start the application
```
run ```mongod``` on terminal to start mongoose server
```
```
export news_jwtPrivateKey='<A SECRETE KEY>'
```
```
npm start  -to start the app 
```
___

# Running Tests

The tests are run using Jest.
```
npm test
```
