require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const app = express();
const PORT = 3000 || process.env.PORT;

const connectDB = require('./server/config/db');
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));



app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.mongodb_uri
    }),
  }));


app.use(express.static('public'));


app.use(expressLayout);
app.set('layout','./layouts/user');

app.set('view engine', 'ejs');


app.use('/',require('./server/routes/user'));
app.use('/',require('./server/routes/admin'));



app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
});