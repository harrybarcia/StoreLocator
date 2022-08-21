const path=require('path');
const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose = require('mongoose');
const session=require('express-session');

const csrf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const upload=require("./utils/multer")


// load env vars
dotenv.config({path:'./config/config.env' });
const bodyParser=require('body-parser');

const User=require('./models/model_User');

const MONGODB_URI =
  'mongodb+srv://admin:doudou@cluster0.iaepn.mongodb.net/storelocatordb';


const app=express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});




const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
  // Body parser

  
const authRoutes = require('./routes/auth');
const storesRoutes = require('./routes/stores');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: store
  }));

// Enable Cors
app.use(cors());

// Set static folder

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: false
 }));

 app.use(csrfProtection);
 app.use(flash());
 app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
      // it is fueled by the session
      req.user = user;
      next();
  }).catch(err => console.log(err));
}
);


 app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
  }
);
app.use(authRoutes);
app.use(storesRoutes);

// app.get('/add', function (req, res) {
//   res.render('pages/add', {
//     pageTitle: 'Add Store',
//     path: '/add'});
// });


app.get('/', function (req, res) {
  res.render('pages/index', {
    pageTitle: 'Store Locator | Home',
    path: '/' });
});




mongoose
  .connect(MONGODB_URI)
  .then(result => {
    
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });