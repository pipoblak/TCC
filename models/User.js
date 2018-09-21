const User = sequelize.define('user',{
  _id:{ type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  first_name:{type: Sequelize.STRING},
  last_name:{type: Sequelize.STRING},
  cpf:{type: Sequelize.STRING, unique: true},
  rfid_token:{type: Sequelize.STRING.BINARY , unique: true},
  biometric_bin:{type: Sequelize.STRING.BINARY , unique: true},
  facial_bin:{type: Sequelize.STRING.BINARY , unique: true},
})
User.sync()
module.exports = User;
