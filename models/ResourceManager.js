var ResourceManager = function(DAO) {
  this.class="resource_managers";
  this.fields=["_id","first_name","last_name","cpf","username","password","created_at","updated_at"];
  this.not_updatable_fields=["_id"];
  this.dao = DAO.set(this);
}
ResourceManager.prototype.insert = function(data){
  this.dao.insert(data);
}
module.exports = ResourceManager;
