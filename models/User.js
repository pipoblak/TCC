const User = sequelize.define('user',{
  _id:{ type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  first_name:{type: Sequelize.STRING},
  last_name:{type: Sequelize.STRING},
  cpf:{type: Sequelize.STRING, unique: true},
  pin:{type: Sequelize.STRING},
  rfid_token:{type: Sequelize.STRING.BINARY , unique: true},
  biometric_bin:{type: Sequelize.STRING(5000)},
  facial_bin:{type: Sequelize.BLOB('long')},
  facial_bin_path:{type: Sequelize.STRING , unique: true},
})
User.sync()
module.exports = User;
