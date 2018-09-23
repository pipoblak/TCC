var express = require('express');
var router = express.Router();
var app = express();

router.post('/', global.upload.single('facial_bin'),function (req, res) {
  if(req.file){
    req.body.facial_bin = req.file.path;
    sequelize.sync()
      .then(() => User.create(req.body))
      .then(result => {
        res.send(result.toJSON());
    }).catch(function (err) {
      return res.status(400).json( err);
    });
  }
  else{
    res.status(400).json({ message: "Imagem de Rosto Requirida."} );
  }

});
crud_interface(User,router);
module.exports = router;
