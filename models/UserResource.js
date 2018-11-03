const UserResource = sequelize.define('user_resource',
  {
    _id:{ type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    resource_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Resource,
        key: '_id'
      }
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: '_id'
      }
    },
  }
)

UserResource.sync()

module.exports = UserResource;
