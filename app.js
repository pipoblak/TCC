global.bcrypt = require("bcrypt-nodejs")
global.uuid = require('uuid/v4');
global.multer = require("multer") //FOR IMAGE SAVING
global.storage = global.multer.diskStorage({
  destination: function(req,file,callback){
    callback(null,'./uploads/')
  },
  filename: function(req, file, callback){
    callback(null, global.uuid() +"_" + file.originalname)
  },
});
global.storageTemp = global.multer.diskStorage({
  destination: function(req,file,callback){
    callback(null,'./temp/uploads/')
  },
  filename: function(req, file, callback){
    callback(null, global.uuid() +"_" + file.originalname)
  },
});
global.upload = global.multer({storage: global.storage});
global.tempUpload = global.multer({storage: global.storageTemp});
//Module for ORM mysql
global.Sequelize = require('sequelize');
global.sequelize = new Sequelize('tcc', 'tcc', 'fe170897', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

// Start MODELS
global.Resource = require('./models/Resource')
global.User = require('./models/User')
global.UserResource = require('./models/UserResource')
var cors = require('cors');
var fs = require('fs');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db_con = require('./private/db_con');
var sql_startup = fs.readFileSync('./private/setup.sql').toString();
var startup = require('./private/startup');

global.crud_interface = require('./routes/crud_interface')

//ROUTES
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userResourcesRouter = require('./routes/users_resources');
var resourcesRouter = require('./routes/resources');



var app = express();
app.use(cors())
app.use('/uploads',express.static('uploads'));

// sequelize.sync()
//   .then(() => ResourceManager.create({
//     first_name: 'felipe',
//     password:"test"
//   }))
//   .then(user => {
//     console.log(user.toJSON());
//     // console.log(user.validPassword("test"))
//   });
// ResourceManager.findOne({ where: { _id: 4 } }).then(function (user) {
//   console.log(user.validPassword("test"))
// });
// console.log(User.)
// START DB SCHEMA
startup.start(db_con, sql_startup);
db_con.database="tcc";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user_resources', userResourcesRouter);
app.use('/resources', resourcesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
