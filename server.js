const path=require('path');
const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');

const mongoConnect=require('./config/db').mongoConnect;
// load env vars
dotenv.config({path:'./config/config.env' });
const bodyParser=require('body-parser');

const User=require('./models/model_User');

const app=express();

// Body parser
app.use(express.json());// send data (json) to our API

// Enable Cors
app.use(cors());

// Set static folder

app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     console.log(`${req.method} request for ${req.url}`);
//     User.findById('62fbd09500965abe18bc10c6')
        
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }
// );
// route test
app.use(bodyParser.urlencoded({
    extended: false
 }));


//Routes
// app.get('/login', (req, res) => {res.redirect('/login.html')});
// app.post('/login',(req,res)=>{
//     const {name}=req.body;
//     console.log(name);
//     res.redirect('/index.html');
// }) 
app.use('/api/v1/stores',require('./routes/stores.js'));


mongoConnect(() => {
    app.listen(3001);
  });
  