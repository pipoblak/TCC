var express = require('express');
var router = express.Router();
var app = express();
crud_interface(ResourceManager,router);
module.exports = router;
