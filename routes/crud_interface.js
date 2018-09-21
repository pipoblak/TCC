const crud_interface = function(model,router){
  router.post('/', function (req, res) {
    sequelize.sync()
      .then(() => model.create(req.body))
      .then(result => {
        res.send(result.toJSON());
    }).catch(function (err) {
      return res.status(400).json({ error: err });
    });
  });
  router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    sequelize.sync()
      .then(() => model.findAll())
      .then(results => {
        res.send(JSON.stringify(results));
    });
  });
  router.patch('/:id', function (req, res) {
    sequelize.sync()
      .then(() => model.update(req.body,{ where: {_id:req.params.id} }))
      .then(user => {
        res.send(user);
    }).catch(function (err) {
      return res.status(400).json({ error: err });
    });
  });
  router.delete('/:id', function (req, res) {
    sequelize.sync()
      .then(() => model.destroy({where:{_id:req.params.id}}))
      .then(result => {
        res.send({status:200});
    });
  });
}
module.exports = crud_interface;
