//Public folder consists of static files like css, js, images

require('dotenv').config();
const express = require('express');             //for express server
const exrpesslayouts = require('express-ejs-layouts');     //for layout
const connectDB = require('./server/config/db');           //for database connection
const cookieParser = require('cookie-parser');             //for parsing cookies, session
const methodOverride = require('method-override');         //for using put and delete method in form
const session = require('express-session');
const MongoStore = require('connect-mongo');                //for storing session in database

const app = express();
const PORT = 5000 || process.env.PORT;          //port number 5000 for development and process.env.PORT for production
const {isActiveRoute} = require('./server/helpers/routeHelpers'); //for checking active route

connectDB();

app.use(express.urlencoded({ extended: true }));    //for parsing form data for searching
app.use(express.json());                            //for parsing json data
app.use(methodOverride('_method'));                 //for using put and delete method in form
app.use(cookieParser());                            //for parsing cookies, session

app.use(session({
    secret: 'keyborad cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}))

app.use(express.static('public'));              //for static files like css, js, images

//Templating Engine for layout as a Middleware
app.use(exrpesslayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;       //for checking active route

 
//routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});