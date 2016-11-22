

exports.sailkapenak = function (req,res){ 
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak, ekintzak, mailak, partaideak where idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idEkintzakTalde = idEkintzak and idDenboraldiaEkintza= ? and idElkarteakTalde = ? order by zenbakiMaila desc',[idDenboraldia,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('sailkapenak.handlebars',{title: "Sailkapenak", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});                       
      });   
  });

};

exports.sailkapenakadmin = function (req,res){ 
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak, ekintzak, mailak, partaideak where idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idEkintzakTalde = idEkintzak and idDenboraldiaEkintza= ? and idElkarteakTalde = ? order by zenbakiMaila desc',[idDenboraldia,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('sailkapenakadmin.handlebars',{title: "Sailkapenak", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak,partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});                       
      });   
  });

};

exports.sailkapenakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var idTaldeak = req.params.idTaldeak;
    //var urlSailkapenTalde = req.params.urlSailkapenTalde;

    
    req.getConnection(function (err, connection) {
        
        var data = {
            urlSailkapenTalde: input.urlSailkapenTalde
        };
        
        connection.query("UPDATE taldeak set ? WHERE idElkarteakTalde = ? and idTaldeak = ?",[data,id, idTaldeak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/sailkapenak');
          
        });
    
    });

};


exports.taldekopurua = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var totala = 0;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT *, count(*) as taldeakguztira FROM taldeak, mailak where idMailaTalde = idMailak and idElkarteakTalde = ? group by idMailak order by zenbakiMaila asc',[id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );


         for(var i in rows){
          totala += rows[i].taldeakguztira;
         }
         
         //console.log("Berriak:" +JSON.stringify(rows));
      res.render('taldekopurua.handlebars', {title : 'KirolElkarteak-Taldeak gehitu', taldetotala: totala, taldeak:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
   
    });  
         
  });
};

exports.jokalarikopurua = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var totala = 0;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT *, count(*) as jokalariakguztira FROM taldeak, taldekideak, mailak where idMailak = idMailaTalde and idTaldeak = idTaldeakKide and idElkarteakTalde = ? group by izenaTalde order by idMailaTalde asc',[id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );


         for(var i in rows){
          totala += rows[i].jokalariakguztira;
         }
         
         //console.log("Berriak:" +JSON.stringify(rows));
      res.render('jokalarikopurua.handlebars', {title : 'KirolElkarteak-Taldeak gehitu', taldetotala: totala, taldeak:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
   
    });  
         
  });
};

exports.kalkuluak = function(req, res){
  var id = req.session.idtxapelketa;
  req.getConnection(function (err, connection) {
      if (err)
              console.log("Error connection : %s ",err ); 
      connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[id],function(err,rows)  {
        if (err)
                console.log("Error query : %s ",err ); 
        console.log("mailak : " + JSON.stringify(rows)); 
        res.render('kalkuluak.handlebars', {title : 'Txaparrotan-Kalkuluak egin', taldeizena: req.session.txapelketaizena, idtxapelketa: req.session.idtxapelketa, mailak : rows});
      });   
  });  
};





/////////////////////////////////////////////////////////////////////////////////

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



