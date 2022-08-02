const path=require('path');
const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const connectDB=require('./config/db')
const bodyParser = require("body-parser");

// load env vars
dotenv.config({path:'./config/config.env' });


connectDB();
const app=express();

// Body parser
app.use(express.json());// send data (json) to our API

// Enable Cors
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set static folder

app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));
// route test
app.get('/test',(req, res)=>{
    res.send('Hell');
})
//Routes
app.use('/api/v1/stores',require('./routes/stores.js'));

const PORT=process.env.PORT
app.listen(PORT, ()=>console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

