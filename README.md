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
### Steps to set sever >>>
##

### Setting environment keys (.env)
- PORT and MONGODB_URL

### Ignore (.ignore)
- .env and /node_modules

### Create Models (/models/(e.g. UsersModel.js))
- Import mongoose >> Create schema >> export mongoose model as module

### Routes (/Routes/(e.g. UsersRoute.js))
- Import express and models (e.g. UsersModel)
- Create express.Router object (e.g. UsersRoutes)
- Create route http request as
  - route("/login").post
  - route("/isemail").post
  - route("/signup").post
  - route("/resetpass").put 
- Export router (e.g. UsersRoutes) as module

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
- Run frontend
  - app.use(express.static('./client/build'))



