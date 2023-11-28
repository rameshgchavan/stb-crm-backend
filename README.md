## Set Top Boxes and Cutomers Relationship Management Backend Server

### About Server
- This server listen requestes from frontend web app
- Fetch, write and update requested data from/to database (MonogoDb)
- Send back requested data to frontend web app through the response
- Uses JWT token for security purpose
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

#### In package.json file
- Add script: `"dev":"nodemon index.js"`

  ![image](https://github.com/rameshgchavan/stb-crm-backend/assets/109573381/0d8f0f32-6762-4346-a577-bfc96c0be2f6)
#

#### In command prompt 
- Type `npm install nodemon -g`, hit Enter key on keyboard and wait for until it finished
- Type `npm dev run` to run backend server locally.
#




# stb-crm-backend

### Step to create project on local machine
1. create: stb-crm-backend folder into your drive
2. type: "cmd" in folder address bar and hit enter. Command prompt will open
3. type: "code ." and hit enter. VS code editor will open
4. create: .ingnore, .env and server.js files into folder stb-crm-backend
5. create: src and client folders into stb-crm-backend
6. create: routes and models folders into src folder
7. add: if you have build of your frontend then add it into client folder

### Requarements: 
- type: npm install cors, dotenv, express and mongoose --save 
- type: npm install nodemon -g 

##### Project structure looks like as shown in image
![image](https://github.com/rameshgchavan/stb-crm-backend/assets/109573381/e220e09e-fa51-4cef-b499-97a23906357c)

##
### Steps to set server >>>
##

### Setting environment keys (.env)
- PORT and MONGODB_URL

### Ignore (.ignore)
- .env and /node_modules

### Create Schema Models (/models/(e.g. UsersModel.js))
- Import mongoose >> Create schema >> export mongoose model as module

### Create TokenVerification Model in models/secutiy folder
- Import jsonwebtoken, dotenv
- Configure and cet environment keies
- Create fuction TokenVerification to verify token

### Routes (/Routes/(e.g. UsersRoute.js))
- Import express and models (e.g. UsersModel)
- Create express.Router object (e.g. UsersRoutes)
- Create route http request as
  - route("/").post
    - Use TokenVerification fuction in this route
  - route("/isemail").post
  - route("/signup").post
  - route("/login").post
  - route("/resetpass").put 
- Export router (e.g. UsersRoutes) as module

### Create Scrutiny Model in models/secutiy folder
- Import UsersModel schema
- Create fuction Scrutiny to scrutinize user by email, password and approval

### Setting Server (server.js)
- Import dependancies/middlewares
  - express, mongoose and dotenv
- Import Routes (e.g. UsersRoute)
- Create object of express as app 
- Environment setting
  - dotEnv.config();
  - const PORT = process.env.PORT;
  - const connectionString = process.env.MONGODB_URL
- connect to mongodb using mongoose and listen to port
- Use middlewares and routes in express
  - app.use(cors())
  - app.use(express.json())
  - app.use("/users", UsersRoutes)
- To run frontend
  - app.use(express.static('./client/build'))

### To check server on local machine
- Type "nodemon server" in command prompt and hit enter 



