const Resource = sequelize.define('resource',
  {
    _id:{ type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    type:{type: Sequelize.STRING},
    action_id:{type: Sequelize.STRING},
    target:{type: Sequelize.STRING},
  }
)

Resource.sync()
module.exports = Resource;
