var DAO = {
  initialize: function(db){
    this.db = db;
  },
  set:function(model){
    this.model = model
    return this;
  },
  valid_entries: function(entries){
    entries = Object.entries(entries);
    if(entries.length>0){
      valid_entries = [];
      invalid_entries = [];
      for(i=0;i<entries.length;i++){
        let entry = entries[i];
        if(this.model.fields.indexOf(entry[0])>=0 && this.model.not_updatable_fields.indexOf(entry[0])<0){
          valid_entries.push(entry)
        }
        else {
          invalid_entries.push(entry)
        }
      }
      return valid_entries;
    }
  },
  insert:function(data){
    let valid_entries = this.valid_entries(data);
    if(valid_entries.length > 0 ){
      sql_insert = "INSERT INTO " +  this.model.class + "(";
      for(i=0;i<valid_entries.length;i++){
        let entry = valid_entries[i];
        sql_insert += entry[0];
        if(valid_entries.length-1>i){
          sql_insert+=",";
        }
      }
      sql_insert+=") values(";
      for(i=0;i<valid_entries.length;i++){
        let entry = valid_entries[i];
        sql_insert += entry[1];
        if(valid_entries.length-1>i){
          sql_insert+=",";
        }
      }
      sql_insert+=")"
      console.log(sql_insert)
    }
  }
}
module.exports = DAO;
