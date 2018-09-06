const Resource = sequelize.define('resource',
  {
    _id:{ type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    resource_manager_id: {
      type: Sequelize.INTEGER,
      references: {
        model: ResourceManager,
        key: '_id'
      }
    },
    type:{type: Sequelize.STRING},
    action_id:{type: Sequelize.STRING},
    target:{type: Sequelize.STRING},
  }
)

Resource.sync()
module.exports = Resource;
