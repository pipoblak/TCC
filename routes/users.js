var express = require('express');
var router = express.Router();
var app = express();
crud_interface(User,router);
module.exports = router;
