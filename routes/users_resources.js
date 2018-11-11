var express = require('express');
var router = express.Router();
var app = express();
router.patch('/update_permission', function (req, res) {
  sequelize.sync()
    .then(() => UserResource.update({active: req.body.permission},{ where: {user_id:req.body.user_id, resource_id: req.body.resource_id} }))
    .then(user_resource => {
      res.send(user_resource);
  }).catch(function (err) {
    return res.status(400).json({ error: err });
  });
});
router.get('/has_permission', function (req, res) {
  sequelize.sync()
    .then(() => UserResource.find({where:{user_id:req.query.user_id, resource_id: req.query.resource_id}}))
    .then(result => {
      res.send(result.active);
  }).catch(function (err) {
    return res.status(400).json({ error: err });
  });
});
crud_interface(UserResource,router);
module.exports = router;
