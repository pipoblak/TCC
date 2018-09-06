const crud_interface = function(model,router){
  router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    sequelize.sync()
      .then(() => model.findAll())
      .then(users => {
        res.send(JSON.stringify(users));
    });
  });
  router.post('/', function (req, res) {
    sequelize.sync()
      .then(() => model.create(req.body))
      .then(user => {
        res.send(user.toJSON());
    });
  });
  router.patch('/:id', function (req, res) {
    sequelize.sync()
      .then(() => model.update(req.body,{ where: {_id:req.params.id} }))
      .then(user => {
        res.send(user);
    });
  });
  router.delete('/:id', function (req, res) {
    sequelize.sync()
      .then(() => model.destroy({where:{_id:req.params.id}}))
      .then(user => {
        res.send({status:200});
    });
  });
}
module.exports = crud_interface;
