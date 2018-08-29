var ResourceManager = function(DAO) {
  this.class="resource_managers";
  this.fields=["_id","first_name","last_name","cpf","username","password","created_at","updated_at"];
  this.not_updatable_fields=["_id"];
  this.dao = DAO.set(this);
}
ResourceManager.prototype.insert = function(data){
  let result = this.dao.insert(data);
  return result;
}
ResourceManager.prototype.update = function(data,selector){
  this.dao.update(data,selector);
}
ResourceManager.prototype.delete = function(selector){
  this.dao.delete(selector);
}
module.exports = ResourceManager;
