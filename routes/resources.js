var express = require('express');
var router = express.Router();
var app = express();
crud_interface(Resource,router);
module.exports = router;
