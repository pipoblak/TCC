var Startup = {
  start: function(db,setup){
    startup_result = db.query(setup, function(error,results,fields){
      if(!error){
        console.log("<----- SQL Setup OK ----->")
      }
    });
    // console.log(startup_result)

  }

}

module.exports = Startup;
