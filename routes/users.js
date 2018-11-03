var express = require('express');
var router = express.Router();
var app = express();
var fs = require('fs');
var AWS = require('aws-sdk');
var config = new AWS.Config({
  accessKeyId: 'AKIAI4TQI4JM2G37OWXA', secretAccessKey: '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', region: 'us-east-1'
});
AWS.config = config;
var rekognition = new AWS.Rekognition();

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
function blob_file(file){
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap);
}
router.post('/', global.upload.single('facial_bin'),function (req, res) {
  if(req.file){
    req.body.facial_bin_path = req.file.path;
    req.body.facial_bin = base64_encode(req.file.path);
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
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  sequelize.sync()
    .then(() => User.findAll({attributes: { exclude: ["facial_bin"]}}))
    .then(results => {
      res.send(JSON.stringify(results));
  });
});
router.get('/request_access', function (req, res) {
  sequelize.sync()
    .then(() => User.find({where:{rfid_token:req.query.rfid_token}, attributes: { exclude: ["facial_bin"]}}))
    .then(result => {
      res.send(result);
  }).catch(function (err) {
    return res.status(400).json({ error: err });
  });
});
router.post('/:id/compare_face',global.tempUpload.single('image'),function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  sequelize.sync()
    .then(() => User.find({id:req.params.id }))
    .then(user => {
      let params = {
        SourceImage: { /* required */
          Bytes: Buffer.from(user.facial_bin.toString(), 'base64')
        },
        TargetImage: { /* required */
          Bytes: blob_file(req.file.path)
        },
        SimilarityThreshold: 0.0
      };
      rekognition.compareFaces(params,function(err,data){
        if (err) res.send(JSON.stringify(err));
        else{
          let similarity = data.FaceMatches[0].Similarity;
          let paraconcistenteR = similarity - (100 - similarity);
          res.send(JSON.stringify(paraconcistenteR));

         }
        fs.unlink(req.file.path);
      });

  });


});
crud_interface(User,router);
module.exports = router;
