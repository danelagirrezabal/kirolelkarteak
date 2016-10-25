

exports.sailkapenak = function (req,res){ 
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak, ekintzak, mailak, partaideak where idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idEkintzakTalde = idEkintzak and idDenboraldiaEkintza= ? and idElkarteakTalde = ? order by noiztikEkintza desc',[idDenboraldia,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('sailkapenak.handlebars',{title: "Sailkapenak", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea});                       
      });   
  });

};

exports.sailkapenakadmin = function (req,res){ 
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak, ekintzak, mailak, partaideak where idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idEkintzakTalde = idEkintzak and idDenboraldiaEkintza= ? and idElkarteakTalde = ? order by noiztikEkintza desc',[idDenboraldia,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('sailkapenakadmin.handlebars',{title: "Sailkapenak", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak,partaidea: req.session.partaidea});                       
      });   
  });

};

exports.sailkapenakaldatu = function(req,res){
    
    //EGITEKO DAGO
};





exports.multzoakreset = function(req, res){
  var id = req.session.idtxapelketa;
  var vKategoria;
  vKategoria = req.body.kategoria3;
  var vGrupo;
  console.log("vKategoria: "+vKategoria+req.path);
  req.getConnection(function(err,connection){
          var data = {
            
            idgrupot    : null,
            jokatutakopartiduak : null,
            irabazitakopartiduak : null,
            puntuak : null

        
        };
        debugger;
        //Update taldea ta delete grupoak.
        connection.query("UPDATE taldeak set ? WHERE idtxapeltalde = ? and kategoria = ? ",[data,id,vKategoria], function(err, rowst)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );

          connection.query("DELETE FROM grupoak WHERE idtxapelketam = ? and kategoriam = ? ",[id,vKategoria], function(err, rowsd)
            {
            
              if (err)
                console.log("Error Updating : %s ",err );
        
              res.redirect(303, '/admin/kalkuluak');
            });
        
        });
  }); 
};

exports.partiduakreset = function(req, res){
  var id = req.session.idtxapelketa;
  var vGrupo;
  console.log("Partiduak reset: " +id);
  req.getConnection(function(err,connection){
          var data = {

            jokatutakopartiduak : null,
            irabazitakopartiduak : null,
            puntuak : null

        
        };
        //Update taldea ta delete grupoak.
        connection.query("UPDATE taldeak set ? WHERE idtxapeltalde = ?  ",[data,id], function(err, rowst)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );

          connection.query('SELECT * FROM grupoak WHERE idtxapelketam = ? ',[id], function(err, rows)
            {
            
              if (err)
                console.log("Error Updating : %s ",err );

              for(var i in rows){

                connection.query("DELETE FROM partiduak WHERE idgrupop = ?  ",[rows[i].idgrupo], function(err, rowsd)
                {
            
                  if (err)
                   console.log("Error Updating : %s ",err );   

                });
              }
              res.redirect(303, '/admin/kalkuluak');
            });
        });
  }); 
};



