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
  select:function(){

  },
  insert: function(data){
    let valid_entries = this.valid_entries(data);
    if(valid_entries.length > 0 ){
      sql = "INSERT INTO " +  this.model.class + "(";
      for(i=0;i<valid_entries.length;i++){
        let entry = valid_entries[i];
        sql += entry[0];
        if(valid_entries.length-1>i){
          sql+=",";
        }
      }
      sql+=") values(";
      for(i=0;i<valid_entries.length;i++){
        let entry = valid_entries[i];
        if(typeof(entry[1]) == "string")
          sql += "'" + entry[1] + "'";
        else
          sql += entry[1];
        if(valid_entries.length-1>i){
          sql+=",";
        }
      }
      sql+=");"
      this.in_query=true;
      result = this.db.query(sql, function(error,results,fields){
        this.in_query=false;
        if(!error){
          return results
        }
      });
      return result;
    }
  },
  update: function(data,selector){
    let valid_entries = this.valid_entries(data);
    if(selector != undefined){
      if(valid_entries.length > 0 ){
        sql = "UPDATE " +  this.model.class + " SET ";
        for(i=0;i<valid_entries.length;i++){
          let entry = valid_entries[i];
          if(typeof(entry[1]) == "string")
            sql += entry[0] + "=" + "'" + entry[1] + "'";
          else
            sql += entry[0] + "=" + entry[1];
          if(valid_entries.length-1>i){
            sql+=",";
          }
        }
        selector_entries = Object.entries(selector);
        if(selector_entries.length>0){
          sql += " where ";
          for(i=0;i<selector_entries.length;i++){
            let entry = selector_entries[i];
            if(typeof(entry[1]) == "string")
              sql += entry[0] + "=" + "'" + entry[1] + "'";
            else
              sql += entry[0] + "=" + entry[1];
            if(selector_entries.length-1>i){
              sql+=",";
            }
          }
          sql += ";";
          result = this.db.query(sql, function(error,results,fields){
            if(!error){
              return results
            }
          });
          return result;
        }
      }
    }
  },
  delete: function(selector){
    sql="";
    selector_entries = Object.entries(selector);
    if(selector_entries.length>0){
      sql += "DELETE FROM "+this.model.class + " where ";
      for(i=0;i<selector_entries.length;i++){
        let entry = selector_entries[i];
        if(typeof(entry[1]) == "string")
          sql += entry[0] + "=" + "'" + entry[1] + "'";
        else
          sql += entry[0] + "=" + entry[1];
        if(selector_entries.length-1>i){
          sql+=",";
        }
      }
      sql += ";";
      result = this.db.query(sql, function(error,results,fields){
        if(!error){
          return results
        }
      });
      return result;
    }
  }
}
module.exports = DAO;
