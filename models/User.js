var User = function(DAO) {
  this.class="users";
  this.fields=["_id","first_name","last_name","cpf","rfid_token","biometric_bin","facial_bin","created_at","updated_at"];
  this.not_updatable_fields=["_id"];
  this.dao = DAO.set(this);

}
User.prototype.insert = function(data){
  this.dao.insert(data);
}
User.prototype.update = function(data,selector){
  this.dao.update(data,selector);
}
User.prototype.delete = function(selector){
  this.dao.delete(selector);
}
module.exports = User;
