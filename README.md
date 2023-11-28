## Set Top Boxes and Cutomers Relationship Management Backend Server

### About Server
- This server listen requestes from frontend web app
- Fetch, Write and Update requested data from/to database (MongoDb)
- Send back requested data to frontend web app through the response
- Uses JWT token for security purpose
#

### APIs Documentation
[Read](https://documenter.getpostman.com/view/16188551/2s9YeEdskW)
#

### Project status
Updating on users feedbacks.
#

### Prerequisites
- Download and install [Node.js](https://nodejs.org/en/download)
- Download and install [Visual Studio Code](https://code.visualstudio.com/download)
#

### Step to clone repository on local machine
- Click on Code button and copy path in HTTPS
![image](https://github.com/rameshgchavan/stb-crm-backend/assets/109573381/db7bb81e-f152-4498-ae21-44cf435b9a8f)

1. Create: stb-crm-project folder on your local machine's desired drive
2. Type: "cmd" in folder's address bar and hit Enter key on keyboard. Command prompt will open
3. Type `git clone`, then paste the URL you copied earlier, hit Enter key on keyboard and wait until it done.

![image](https://github.com/rameshgchavan/stb-crm-backend/assets/109573381/135d5fa0-0732-4633-b479-6c3bcfa5ce9c)

5. Type: cd, press Spacebar then Tab (until you get "stb-crm-backend) and then hit Enter key on keyboard.

![image](https://github.com/rameshgchavan/stb-crm-backend/assets/109573381/4cbe3f9f-7c61-4655-bdbc-63211a34cda8)

7. Type: npm install and hit Enter key on keyboard and wait for packages got installed successfully

![image](https://github.com/rameshgchavan/stb-crm-backend/assets/109573381/c9462143-1aa1-401f-8605-72d71377194e)

8. Type: "code ." and hit enter. Visual Studio Code will open
#

#### Inside package.json file
- Add script: `"dev":"nodemon index.js"`

  ![image](https://github.com/rameshgchavan/stb-crm-backend/assets/109573381/0d8f0f32-6762-4346-a577-bfc96c0be2f6)
#

#### Setting environment keys
- Inside .env add keys and set values:
     - PORT= 5000
     - MONGODB_URL= "mongodb+srv://databasepath"
     - JWTKEY="jwtkey"

  Note: Above values are only examples
#

#### Ignore
- Inside .ignore add: .env and /node_modules
#

#### In command prompt 
- Type `npm install nodemon -g`, hit Enter key on keyboard and wait for until it finished
- Type `npm dev run` to run backend server locally.
#

## Project description
- This project has developed by using
     - `Node.js` (Javascript runtime environmet)
     - `express.js` (Node.js framework designed to build API's web applications cross-platform)
     - `mongoose` (Node.js-based Object Data Modeling (ODM) library for MongoDB)
- This project devided into mudules which contains Database connection, Express routes (APIs), mongoose schemas, models and custom functions.
- Project folders and files structure looks like as shown in following image.

![image](https://github.com/rameshgchavan/stb-crm-backend/assets/109573381/0527aa36-6073-4219-b673-eb7cd28c762b)

### Dependencies: 
![image](https://github.com/rameshgchavan/stb-crm-backend/assets/109573381/8b8fd63a-4d3c-43f6-b8fa-0f7c27a98aae)

### Elaboration:
### ./src/`connection`
- #### /`mongoDbConnection.js`
In this file I have made connection with MongoDB database using mongoose. 

### ./src/`schemas`
- #### /`customerSchema.js`
This mongoose schema contains a Customer related data types and keys

- #### /`transactionScheme.js`
This mongoose schema contains a Transaction related data types and keys

- #### /`userSchema.js`
This mongoose schema contains a User related data types and keys

### ./src/`models`
- #### /`customerModel.js`
     - In this model I have imorted Customer schema and send it with collection name to MonogDB
     - and exorted as model

- #### /`transactionModel.js`
     - In this model I have imorted Transaction schema and send it with collection name to MonogDB
     - and exorted as model

- #### /`userModel.js`
     - In this model I have imorted User schema and send it with collection name to MonogDB
     - and exorted as model

### ./src/`functions`
- #### /`tokenVerificationModel.js`
This funtions verifies the token

- #### /`userScrutiny.js`
This funtions verifies user credentilas

### ./src/`routes`
- #### /`customerRoutes.js`
This express route contains Customer related CRUD APIs to read, write and change the requested data from/to database (MongoDB) using mongoose

- #### /`transactionRoutes.js`
This express route contains Transactions related CRUD APIs to read, write and change the requested data from/to database (MongoDB) using mongoose

- #### /`userRoutes.js`
This express route contains User related CRUD APIs to read, write and change the requested data from/to database (MongoDB) using mongoose

### `index.js`
- This is a main Javascript file of sever.
- In this file imported routes of APIs 
- In this file express app uses modules, packages, middleware, routes
- runs frontend build using express static (optional)
- and express app listening of given PORT

### About me: 
- Ramesh Chavan, Full Stack Web Developer|MERN|AlmaBetter Trainee .
    - Email: ramesh7452@gmail.com.
