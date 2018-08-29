var Resource = function(DAO) {
  this.class="resources";
  this.fields=["_id","resource_manager_id","type","action_id","target","created_at","updated_at"];
  this.not_updatable_fields=["_id"];
  this.dao = DAO.set(this);

}
Resource.prototype.insert = function(data){
  this.dao.insert(data);
}
Resource.prototype.update = function(data,selector){
  this.dao.update(data,selector);
}
Resource.prototype.delete = function(selector){
  this.dao.delete(selector);
}
module.exports = Resource;
