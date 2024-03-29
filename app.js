const fs=require('fs');
const path=require('path');
const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose = require('mongoose');
const session=require('express-session');
const Fetch=require('node-fetch');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const upload=require("./utils/multer") 
const compression = require('compression');
const https = require('https');
// load env vars
const morgan = require('morgan');
dotenv.config({path:'./config/config.env' });
const bodyParser=require('body-parser');

const User=require('./models/model_User');
// adding a comment test for git
const MONGODB_URI =
  
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.iaepn.mongodb.net/${process.env.MONGO_DATABASE}`;


const app=express();
app.use(cors());

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});





const csrfProtection = csrf();

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

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


// Set static folder

app.use(express.static(path.join(__dirname, 'public')));
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(bodyParser.urlencoded({
    extended: false
 }));
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
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






mongoose
  .connect(MONGODB_URI)
  .then(result => {

  //   console.log('Connected!');
  //   https.createServer({key:privateKey, cert:certificate}, app).listen(3000);
  // })
  app.listen(process.env.PORT || 5000)

  })
  .catch(err => {
    console.log(err);
  });