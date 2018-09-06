const ResourceManager = sequelize.define('resource_manager',
  {
    _id:{ type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    first_name:{type: Sequelize.STRING},
    last_name:{type: Sequelize.STRING},
    cpf:{type: Sequelize.STRING, unique: true},
    username:{type: Sequelize.STRING, unique: true},
    password:{type: Sequelize.STRING, unique: true}
  },
  {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
  }
)

ResourceManager.sync()


ResourceManager.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = ResourceManager;
