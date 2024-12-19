var bcrypt = require('bcrypt-nodejs');

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var VALID_TEL_REGEX = /^[0-9-()+]{9,20}/;
var VALID_DNI_REGEX = /^\d{8}[a-zA-Z]{1}$/;

var ilarak = [], burua = [];
var mapa;

exports.denboraldiakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *, DATE_FORMAT(noiztikDenb,"%Y/%m/%d") AS noiztikDenb, DATE_FORMAT(noraDenb,"%Y/%m/%d") AS noraDenb FROM denboraldiak where idElkarteakDenb = ? order by noiztikDenb desc',[id],function(err,rows) {       
     req.connection.query('SELECT *,  to_char("noiztikDenb", \'YYYY-MM-DD\') AS "noiztikDenbF",  to_char("noraDenb", \'YYYY-MM-DD\') AS "noraDenb" FROM denboraldiak where "idElkarteakDenb" = $1 order by "noiztikDenb" desc',[id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
          rowst = wrows.rows;     //postgres
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('denboraldiak.handlebars',{title: "Denboraldiak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
        });                        
      });   
//postgresConnect  });
};

exports.denboraldiaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("Bidali:" + input.bidali);
    var id = req.session.idKirolElkarteak;
    var now= new Date();

    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            noiztikDenb    : input.noiztikDenb,
            noraDenb   : input.noraDenb,
            deskribapenaDenb: input.deskribapenaDenb,
            idElkarteakDenb : id,
            egoeraDenb: input.egoeraDenb
        };
        
//postgres        var query = req.connection.query("INSERT INTO denboraldiak set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO denboraldiak ("noiztikDenb","noraDenb","deskribapenaDenb","idElkarteakDenb","egoeraDenb") VALUES ($1,$2,$3,$4,$5)',[input.noiztikDenb,input.noraDenb,input.deskribapenaDenb,id,input.egoeraDenb], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );input.
         
          res.redirect('/admin/denboraldiak');
        });
        
       // console.log(query.sql); 
    
//postgresConnect    });
};

exports.denboraldiakopiatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  console.log("Denboraldia kopiatzeko:" + idDenboraldia);

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres      connection.query('SELECT * FROM denboraldiak where idDenboraldia = ? ',[idDenboraldia],function(err,rows) {
     req.connection.query('SELECT * FROM denboraldiak where "idDenboraldia" = $1 ',[idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
        if (rows.length != 0) {
           var data = {
            
            noiztikDenb    : rows[0].noiztikDenb,
            noraDenb   : rows[0].noraDenb,
            deskribapenaDenb: "Denboraldi berria EGOKITU",
            idElkarteakDenb : id,
            egoeraDenb: rows[0].egoeraDenb
           };
       
//postgres           var query = req.connection.query("INSERT INTO denboraldiak set ? ",data, function(err, rows)
           var query = req.connection.query('INSERT INTO denboraldiak ("noiztikDenb","noraDenb","deskribapenaDenb","idElkarteakDenb","egoeraDenb") VALUES ($1,$2,$3,$4,$5)',[rows[0].noiztikDenb,rows[0].noraDenb,"Denboraldi berria EGOKITU",id,rows[0].egoeraDenb], function(err, rows)

           {
            if (err)
              console.log("Error inserting : %s ",err );

            var idDenboraldiaBerria = rows.insertId;
//ADI
//postgres            connection.query('SELECT * FROM taldeak where idDenboraldiaTalde = ? order by idMailaTalde, akronimoTalde',[idDenboraldia],function(err,rowst)   {
            req.connection.query('SELECT * FROM taldeak where "idDenboraldiaTalde" = $1 order by "idMailaTalde", "akronimoTalde"',[idDenboraldia],function(err,wrows)   {
             if(err)
              console.log("Error Selecting : %s ",err );
             rowst = wrows.rows;     //postgres
             for (var i in rowst) { 
/*             var datat = {
               zelaiizena : rowst[i].zelaiizena,
               zelaizki   : rowst[i].zelaizki,
               idtxapelz    : idtxapelketa
             };
*/
               var datat =  rowst[i];
               datat.idDenboraldiaTalde = idDenboraldiaBerria;
               datat.idTaldeak = null;
               var query = req.connection.query("INSERT INTO taldeak set ? ",datat, function(err, rows)
               {
                if (err)
                 console.log("Error inserting : %s ",err );
               });
             }
            });
           });          

// ADI ---->  Taldekideak KOPIATU

         }
        else    
          console.log("Denboraldia aukeratugabe");    

        res.redirect('/admin/denboraldiak');

        });
//postgresConnect     });
};

exports.denboraldiakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idDenboraldia = req.params.idDenboraldia;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres 
//postgres        connection.query("DELETE FROM denboraldiak  WHERE idElkarteakDenb = ? and idDenboraldia = ?",[id,idDenboraldia], function(err, rows)
        req.connection.query('DELETE FROM denboraldiak  WHERE "idElkarteakDenb" = $1 and "idDenboraldia" = $2',[id,idDenboraldia], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/denboraldiak');
             
        });
        
//postgresConnect     });
};

exports.denboraldiakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.params.idDenboraldia;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *, DATE_FORMAT(noiztikDenb,"%Y/%m/%d") AS noiztikDenb, DATE_FORMAT(noraDenb,"%Y/%m/%d") AS noraDenb FROM denboraldiak WHERE idElkarteakDenb = ? and idDenboraldia = ?',[id,idDenboraldia],function(err,rows)
     req.connection.query('SELECT *,  to_char("noiztikDenb", \'YYYY-MM-DD\') AS "noiztikDenb", DATE_FORMAT(noraDenb,"%Y/%m/%d") to_char("noraDenb", \'YYYY-MM-DD\') AS "noraDenb" FROM denboraldiak WHERE "idElkarteakDenb" = $1 and "idDenboraldia" = $2',[id,idDenboraldia],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            res.render('denboraldiakeditatu.handlebars', {page_title:"Denboraldiak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
//postgresConnect    }); 
};

exports.denboraldiakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.params.idDenboraldia;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
          
        var data = {
            
            noiztikDenb    : input.noiztikDenb,
            noraDenb   : input.noraDenb,
            deskribapenaDenb: input.deskribapenaDenb,
            //idElkarteakDenb : id,
            egoeraDenb: input.egoeraDenb,
            kuotaDenb: input.kuotaDenb
        };
//postgres        connection.query("UPDATE denboraldiak set ? WHERE idElkarteakDenb = ? and idDenboraldia = ? ",[data,id,idDenboraldia], function(err, rows)
        req.connection.query('UPDATE denboraldiak set "noiztikDenb"=$1,"noraDenb"=$2,"deskribapenaDenb"=$3,"egoeraDenb"=$4,"kuotaDenb"=$5 WHERE "idElkarteakDenb" = $6 and "idDenboraldia" = $7 ',[input.noiztikDenb,input.noraDenb,input.deskribapenaDenb,input.egoeraDenb,input.kuotaDenb,id,idDenboraldia], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/denboraldiak');
          
        });
    
//postgresConnect    });
};

exports.ekintzakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(noiztikEkintza,"%Y/%m/%d") AS noiztikEkintza, DATE_FORMAT(noraEkintza,"%Y/%m/%d") AS noraEkintza  FROM ekintzak where idDenboraldiaEkintza= ? and idElkarteakEkintza = ? order by noiztikEkintza desc',[idDenboraldia,id],function(err,rows) {       
     req.connection.query('SELECT *, to_char("noiztikEkintza", \'YYYY-MM-DD\') AS "noiztikEkintzaF",  to_char("noraEkintza", \'YYYY-MM-DD\') AS "noraEkintza"  FROM ekintzak where "idDenboraldiaEkintza"= $1 and "idElkarteakEkintza" = $2 order by "noiztikEkintza" desc',[idDenboraldia,id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres     
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
          rowst = wrows.rows;     //postgres  
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('ekintzak.handlebars',{title: "Ekintzak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
        });                        
      });   
//postgresConnect  });
};

exports.ekintzaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    //var idDenboraldia = '2';
    var now= new Date();

    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            motaEkintza    : input.motaEkintza,
            noiztikEkintza   : input.noiztikEkintza,
            noraEkintza : input.noraEkintza,
            kontuKorronteEkintza : input.kontuKorronteEkintza,
            diruaEkintza : input.diruaEkintza,
            idElkarteakEkintza : id,
            idDenboraldiaEkintza : idDenboraldia
        };
//postgres        var query = req.connection.query("INSERT INTO ekintzak set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO ekintzak ("motaEkintza","noiztikEkintza","noraEkintza","kontuKorronteEkintza","diruaEkintza","idElkarteakEkintza","idDenboraldiaEkintza") VALUES ($1,$2,$3,$4,$5)',[input.motaEkintza,input.noiztikEkintza,input.noraEkintza,input.kontuKorronteEkintza,input.diruaEkintza,id,idDenboraldia], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/admin/ekintzak');
        });
        
       // console.log(query.sql); 
    
//postgresConnect    });
};

exports.ekintzakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idDenboraldia = req.session.idDenboraldia;
     var idEkintzak = req.params.idEkintzak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres 
//postgres         connection.query("DELETE FROM ekintzak  WHERE idElkarteakEkintza = ? and idDenboraldiaEkintza = ? and idEkintzak = ?",[id,idDenboraldia, idEkintzak], function(err, rows)
        req.connection.query('DELETE FROM ekintzak  WHERE "idElkarteakEkintza" = $1 and "idDenboraldiaEkintza" = $2 and "idEkintzak" = $3',[id,idDenboraldia, idEkintzak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/ekintzak');
             
        });
        
//postgresConnect     });
};

exports.ekintzakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idEkintzak = req.params.idEkintzak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres      connection.query('SELECT *,DATE_FORMAT(noiztikEkintza,"%Y/%m/%d") AS noiztikEkintza, DATE_FORMAT(noraEkintza,"%Y/%m/%d") AS noraEkintza FROM ekintzak WHERE idElkarteakEkintza = ? and idDenboraldiaEkintza = ? and idEkintzak= ?',[id,idDenboraldia,idEkintzak],function(err,rows)
     req.connection.query('SELECT *,to_char("noiztikEkintza", \'YYYY-MM-DD\') AS "noiztikEkintza",  to_char("noraEkintza", \'YYYY-MM-DD\') AS "noraEkintza" FROM ekintzak WHERE idElkarteakEkintza = ? and idDenboraldiaEkintza = ? and idEkintzak= ?',[id,idDenboraldia,idEkintzak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres 
            res.render('ekintzakeditatu.handlebars', {page_title:"Ekintzak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
//postgresConnect    }); 
};

exports.ekintzakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var idEkintzak = req.params.idEkintzak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            motaEkintza    : input.motaEkintza,
            noiztikEkintza   : input.noiztikEkintza,
            noraEkintza : input.noraEkintza,
            kontuKorronteEkintza : input.kontuKorronteEkintza,
            diruaEkintza : input.diruaEkintza
        };
//postgres        connection.query("UPDATE ekintzak set ? WHERE idElkarteakEkintza = ? and idDenboraldiaEkintza = ? and idEkintzak = ?",[data,id,idDenboraldia, idEkintzak], function(err, rows)
        req.connection.query('UPDATE ekintzak set "motaEkintza"=$1,"noiztikEkintza"=$2,"noraEkintza"=$3,"kontuKorronteEkintza"=$4,"diruaEkintza"=$5 WHERE "idElkarteakEkintza" = $6 and "idDenboraldiaEkintza" = $7 and "idEkintzak" = $8',[input.motaEkintza,input.noiztikEkintza,input.noraEkintza,input.kontuKorronteEkintza,input.diruaEkintza,id,idDenboraldia, idEkintzak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/ekintzak');
          
        });
    
//postgresConnect    });
};


exports.jardunaldikopartiduakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var jardunaldia = req.params.jardunaldia;
      jardunaldia = jardunaldia.substring(0,10);   //postgres
  console.log("Jardunaldia:" + jardunaldia);
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by dataPartidu desc ',[id, jardunaldia, jardunaldia],function(err,rows) {
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by herriaLeku, dataPartidu, zenbakiLeku, orduaPartidu, zenbakiMaila, izenaTalde asc',[id, jardunaldia, jardunaldia],function(err,rows) {
     req.connection.query('SELECT *,to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartiduF"  FROM partiduak, mailak, taldeak, lekuak where "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "jardunaldiDataPartidu" >= $2 and "jardunaldiDataPartidu" <= $3 order by "herriaLeku", "dataPartidu", "zenbakiLeku", "orduaPartidu", "zenbakiMaila", "izenaTalde" asc',[id, jardunaldia, jardunaldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') as "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
          for (var i in rows){
                rows[i].egunaTexto = egunatextobihurtu(rows[i].dataPartidu);
          }

          res.render('partiduakadmin.handlebars',{title: "Partiduak", data:rows, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
        });                   
      });   
//postgresConnect  });
};

/*exports.jardunaldikopartiduakbilatupartaide2 = function(req, res){
  var id = req.session.idKirolElkarteak;
  var jardunaldia = req.params.jardunaldia;
  console.log("Jardunaldia:" + jardunaldia);
  req.getConnection(function(err,connection){
       
     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by dataPartidu desc',[id, jardunaldia, jardunaldia],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? order by jardunaldiDataPartidu desc',[id],function(err,rowsd) {
          
          if(err)
           console.log("Error Selecting : %s ",err );

          res.render('partiduak.handlebars',{title: "Partiduak", data:rows, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        });                   
      });   
  });
};*/

exports.jardunaldikopartiduakbilatupartaide = function(req, res){
  var id = req.session.idKirolElkarteak;
  var jardunaldia = req.params.jardunaldia;
      jardunaldia = jardunaldia.substring(0,10);   //postgres
  var idDenboraldia = req.params.idDenboraldia;
  req.session.jardunaldia = jardunaldia;
  req.session.idDenboraldia = idDenboraldia;
  var admin=(req.path.slice(0,24) == "/admin/partiduakmailazka");
  var jardunaldiaIkusgai;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu=? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by zenbakiMaila, izenaTalde asc, dataPartidu, orduaPartidu',[id,idDenboraldia, jardunaldia, jardunaldia],function(err,rows) {
     req.connection.query('SELECT *,to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartiduF"  FROM partiduak, mailak, taldeak, lekuak where "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu"=$2 and "jardunaldiDataPartidu" >= $3 and "jardunaldiDataPartidu" <= $4 order by "zenbakiMaila", "izenaTalde" asc, "dataPartidu", "orduaPartidu"',[id,idDenboraldia, jardunaldia, jardunaldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') as "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
              for(var i in rowsd ){
                if(req.session.jardunaldia == rowsd[i].jardunaldiDataPartidu){
                    jardunaldiDataPartidu = rowsd[i].jardunaldiDataPartidu;
                    rowsd[i].aukeratua = true;
                  }
                  else
                    rowsd[i].aukeratua = false;
                }
//postgres            connection.query('SELECT idDenboraldia, deskribapenaDenb, jardunaldiaIkusgai FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
            req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb", "jardunaldiaIkusgai" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
          
             if(err)
                console.log("Error Selecting : %s ",err );
            rowsdenb = wrows.rows;     //postgres
             for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    idDenboraldia = rowsdenb[i].idDenboraldia;
                    deskribapenaDenb = rowsdenb[i].deskribapenaDenb;
                    jardunaldiaIkusgai = rowsdenb[i].jardunaldiaIkusgai;
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
              }
//postgres             connection.query('SELECT * FROM taldeak, mailak  where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by zenbakiMaila desc, izenaTalde asc',[id, idDenboraldia],function(err,rowstalde) {
             req.connection.query('SELECT * FROM taldeak, mailak  where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "zenbakiMaila" desc, "izenaTalde" asc',[id, idDenboraldia],function(err,wrows) {
          
              if(err)
                 console.log("Error Selecting : %s ",err );
              rowstalde = wrows.rows;     //postgres
/*              for(var i in rowstalde ){
                if(idTaldeak == rowstalde[i].idTaldeak){
                    idTaldeak = rowstalde[i].idTaldeak;
                    rowstalde[i].aukeratua = true;
                  }
                  else
                    rowstalde[i].aukeratua = false;
                }
*/
              for (var i in rows){
                rows[i].egunaTexto = egunatextobihurtu(rows[i].dataPartidu);
                if (rows[i].jardunaldiDataPartidu <= jardunaldiaIkusgai){
                    rows[i].jardunaldiaIkusgai = true;
                }else{
                    rows[i].jardunaldiaIkusgai = false;
                }
                if (rows[i].orduaPartidu == "00:00:00")
                    rows[i].orduaPartidu = "";
                if (rows[i].bidaiOrduaPartidu == "00:00:00")
                    rows[i].bidaiOrduaPartidu = "";
              }



          res.render('partiduak.handlebars',{title: "Partiduak", data:rows, denboraldiak:rowsdenb, jardunaldiak:rowsd, taldeak:rowstalde, menuadmin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        });
             });
          });                  
      });   
//postgresConnect  });
};

exports.partiduakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.session.admin = 0;
  req.session.idTaldeak = 0;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by dataPartidu desc',[id, idDenboraldia],function(err,rows) {
     req.connection.query('SELECT *,to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartiduF"  FROM partiduak, mailak, taldeak, lekuak where "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "dataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') as "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
          for (var i in rows){
                rows[i].egunaTexto = egunatextobihurtu(rows[i].dataPartidu);
          }

          res.render('partiduakadmin.handlebars',{title: "Partiduak", data:rows, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,partaidea: req.session.partaidea});
        });                   
      });   
//postgresConnect  });
};

exports.partiduakbilatupartaide = function(req, res){
  var id = req.session.idKirolElkarteak;
  req.session.admin = 0;
  req.session.idTaldeak = 0;
  var idDenboraldia = req.params.idDenboraldia;
  req.session.idDenboraldia = idDenboraldia;
  var jardunaldiaIkusgai;


//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS bidaiEgunaPartidu, DATE_FORMAT(bidaiEgunaPartidu,"%Y/%m/%d") AS bidaiEgunaPartidu,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by dataPartidu desc',[id, idDenboraldia],function(err,rows) {
     req.connection.query('SELECT *,to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') AS "jardunaldiDataPartidu" , \'YYYY-MM-DD\') AS "bidaiEgunaPartidu" ,to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu"  FROM partiduak, mailak, taldeak, lekuak where "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "dataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') as "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
              for(var i in rowsd ){
                if(req.session.jardunaldia == rowsd[i].jardunaldiDataPartidu){
                    jardunaldiDataPartidu = rowsd[i].jardunaldiDataPartidu;
                    rowsd[i].aukeratua = true;
                  }
                  else
                    rowsd[i].aukeratua = false;
                }
//postgres            connection.query('SELECT idDenboraldia, deskribapenaDenb, jardunaldiaIkusgai FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
            req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb", "jardunaldiaIkusgai" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
          
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsdenb = wrows.rows;     //postgres
            for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    idDenboraldia = rowsdenb[i].idDenboraldia;
                    deskribapenaDenb = rowsdenb[i].deskribapenaDenb;
                    jardunaldiaIkusgai = rowsdenb[i].jardunaldiaIkusgai;
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
              }

              for (var i in rows){
                if (rows[i].jardunaldiDataPartidu <= jardunaldiaIkusgai){
                    rows[i].jardunaldiaIkusgai = true;
                }else{
                    rows[i].jardunaldiaIkusgai = false;
                }
              }

          res.render('partiduak.handlebars',{title: "Partiduak", data:rows, denboraldiak:rowsdenb, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        });  
          });                   
      });   
//postgresConnect  });
};


exports.partiduakbilatutaldekapartaide = function(req, res){
  var id = req.session.idKirolElkarteak;
  var admin=(req.path.slice(0,23) == "/admin/partiduaktaldeka");
  req.session.admin = 0;               
  var idTaldeak = req.params.idTaldeak;
  req.session.idTaldeak = idTaldeak;
  var idDenboraldia = req.session.idDenboraldia;


//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak, denboraldiak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idDenboraldiaTalde = idDenboraldia and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu = ? and idTaldeakPartidu = ? order by jardunaldiDataPartidu asc, dataPartidu, orduaPartidu',[id, idDenboraldia, idTaldeak],function(err,rows) {
     req.connection.query('SELECT *,to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartiduF"  FROM partiduak, mailak, taldeak, lekuak, denboraldiak where "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idDenboraldiaTalde" = "idDenboraldia" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 and "idTaldeakPartidu" = $3 order by "jardunaldiDataPartidu" asc, "dataPartidu", "orduaPartidu"',[id, idDenboraldia, idTaldeak],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM taldeak, mailak  where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by zenbakiMaila desc, izenaTalde asc',[id, idDenboraldia],function(err,rowstalde) {
        req.connection.query('SELECT * FROM taldeak, mailak  where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "zenbakiMaila" desc, "izenaTalde" asc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowstalde= wrows.rows;     //postgres
              for(var i in rowstalde ){
                if(idTaldeak == rowstalde[i].idTaldeak){
                    idTaldeak = rowstalde[i].idTaldeak;
                    rowstalde[i].aukeratua = true;
                  }
                  else
                    rowstalde[i].aukeratua = false;
                }


              for (var i in rows){
                if (rows[i].jardunaldiDataPartidu <= rows[i].jardunaldiaIkusgai || admin){
                    rows[i].jardunaldiaIkusgai = true;
                }else{
                    rows[i].jardunaldiaIkusgai = false;
                }
                rows[i].admin = admin;

                if (rows[i].emaitzaPartidu == "" || rows[i].emaitzaPartidu === null || rows[i].emaitzaPartidu === undefined)
                     rows[i].kolore = "#000000";
                else  
                { 
                 emaitzak = rows[i].emaitzaPartidu.split("-").map(Number);
                 if(rows[i].zenbakiLeku >= 9)    // Kanpoko partiduak
                 {
                  if(emaitzak[0] < emaitzak[1])
                     rows[i].kolore = "#00F000";     // berde ilunez irabazitakoak
                  else
                   if(emaitzak[0] > emaitzak[1])     // gorriz   galdutakoak
                     rows[i].kolore = "#FF0000";
                   else
                     rows[i].kolore = "#0000FF";     // urdinez   berdindutakoak
                 }
                 else                            // Etxeko partiduak
                  {
                  if(emaitzak[0] > emaitzak[1])
                     rows[i].kolore = "#00F000";
                  else
                   if(emaitzak[0] < emaitzak[1])
                     rows[i].kolore = "#FF0000";
                   else
                     rows[i].kolore = "#0000FF";  
                  }  
                }     

              }

               /* for(var i in rows ){
                  rows[i].adminis = admin;
                  if(req.session.arduraduna == rows[i].idArduradunTalde)
                    rows[i].arduraduna = true;
                  else
                    rows[i].arduraduna = false;
                
              }*/
          if (admin){
              req.session.admin = 1;
          }       
          else {
              req.session.admin = 0;
          }
          res.render('partiduaktaldeka.handlebars',{title: "Partiduak", data:rows, taldeak:rowstalde, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, menuadmin:admin, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
         
          });                   
      });   
//postgresConnect  });
};

exports.partiduakgehitu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM taldeak,mailak where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by idMailaTalde asc',[id, idDenboraldia],function(err,rowst) {
     req.connection.query('SELECT * FROM taldeak,mailak where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "idMailaTalde" asc',[id, idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rowst = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM lekuak where idElkarteakLeku = ? order by zenbakiLeku asc',[id],function(err,rowsl) {
        req.connection.query('SELECT * FROM lekuak where "idElkarteakLeku" = $1 order by "zenbakiLeku" asc',[id],function(err,wrows) {
            if(err)
            console.log("Error Selecting : %s ",err );
            rowsl = wrows.rows;     //postgres
            res.render('partiduaksortu.handlebars', {title : 'KirolElkarteak-Taldeak gehitu', taldeak:rowst, lekuak:rowsl,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,  atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        }); 
      });  
           
//postgresConnect  });
};

exports.partiduaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var now= new Date();

    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            idElkarteakPartidu    : id,
            idTaldeakPartidu   : input.idTaldeakPartidu,
            jardunaldiaPartidu: input.jardunaldiaPartidu,
            jardunaldiDataPartidu : input.jardunaldiDataPartidu,
            etxekoaPartidu: input.etxekoaPartidu,
            kanpokoaPartidu: input.kanpokoaPartidu,
            txapelketaPartidu: input.txapelketaPartidu,
            dataPartidu: input.dataPartidu,
            orduaPartidu: input.orduaPartidu,
            idLekuakPartidu: input.idLekuakPartidu,
            emaitzaPartidu: input.emaitzaPartidu,
            bidaiOrduaPartidu: input.bidaiOrduaPartidu,
            bidaiaNolaPartidu: input.bidaiaNolaPartidu,
            bidaiEgunaPartidu: input.bidaiEgunaPartidu,
            idDenboraldiaPartidu: idDenboraldia,
            nonPartidu : input.nonPartidu,
            bidaiKolorePartidu: input.bidaiKolorePartidu,
            arbitraiaPartidu : input.arbitraiaPartidu
        };
        
//postgres        var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rows)  
        var query = req.connection.query('INSERT INTO partiduak ("idElkarteakPartidu","idTaldeakPartidu","jardunaldiaPartidu","jardunaldiDataPartidu","etxekoaPartidu","kanpokoaPartidu","txapelketaPartidu","dataPartidu","orduaPartidu","idLekuakPartidu","emaitzaPartidu","bidaiOrduaPartidu","bidaiaNolaPartidu","bidaiEgunaPartidu","idDenboraldiaPartidu","nonPartidu","bidaiKolorePartidu","arbitraiaPartidu") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',[id,input.idTaldeakPartidu,input.jardunaldiaPartidu,input.jardunaldiDataPartidu,input.etxekoaPartidu,input.kanpokoaPartidu,input.txapelketaPartidu,input.dataPartidu,input.orduaPartidu,input.idLekuakPartidu,input.emaitzaPartidu,input.bidaiOrduaPartidu,input.bidaiaNolaPartidu,input.bidaiEgunaPartidu,idDenboraldia,input.nonPartidu,input.bidaiKolorePartidu,input.arbitraiaPartidu], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
         if (req.session.arduraduna){
            res.redirect('/partiduak');
         }else{
            res.redirect('/admin/partiduak');
         }
        }); 
    
//postgresConnect    });
};

exports.partiduakezabatu = function(req,res){

     var id = req.session.idKirolElkarteak;
     var idPartiduak = req.params.idPartiduak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres 
//postgres        connection.query("DELETE FROM partiduak WHERE idElkarteakPartidu = ? and idPartiduak = ?",[id,idPartiduak], function(err, rows)
        req.connection.query('DELETE FROM partiduak WHERE "idElkarteakPartidu" = $1 and "idPartiduak" = $2',[id,idPartiduak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );

             if (req.session.admin){
                res.redirect('/admin/partiduaktaldeka/'+ req.session.idTaldeak);
             }else{
               res.redirect('/admin/partiduak');
             }  
        });
        
//postgresConnect     });
};

exports.partiduakeditatu = function(req, res){

  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idPartiduak = req.params.idPartiduak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu,DATE_FORMAT(jardunaldiDataPartidu,"%Y/%m/%d") AS jardunaldiDataPartidu FROM partiduak WHERE idElkarteakPartidu = ? and idPartiduak = ?',[id,idPartiduak],function(err,rows)
     req.connection.query('SELECT *,to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" ,to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') as "jardunaldiDataPartidu" FROM partiduak WHERE "idElkarteakPartidu" = $1 and "idPartiduak" = $2',[id,idPartiduak],function(err,wrows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
//               connection.query('SELECT * FROM taldeak, mailak where idMailak=idMailaTalde and idElkarteakTalde = ? order by idMailaTalde asc',[id],function(err,rowst) {
//postgres            connection.query('SELECT * FROM taldeak,mailak where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by idMailaTalde asc',[id, idDenboraldia],function(err,rowst) {            
            req.connection.query('SELECT * FROM taldeak,mailak where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "idMailaTalde" asc',[id, idDenboraldia],function(err,wrows) {            
                if(err)
                  console.log("Error Selecting : %s ",err );
                rowst = wrows.rows;     //postgres         
                for(var i in rowst){
                  if(rows[0].idTaldeakPartidu == rowst[i].idTaldeak){
                    izenaTalde = rowst[i].izenaTalde;
                    izenaMaila = rowst[i].izenaMaila;
                    rowst[i].aukeratua = true;
                  }
                  else
                    rowst[i].aukeratua = false;
                }

                rows[0].taldeak = rowst;
//postgres                connection.query('SELECT * FROM lekuak where idElkarteakLeku = ? order by zenbakiLeku asc',[id],function(err,rowsl) {
                req.connection.query('SELECT * FROM lekuak where "idElkarteakLeku" = $1 order by "zenbakiLeku" asc',[id],function(err,wrows) {
            
                if(err)
                  console.log("Error Selecting : %s ",err );
                rowsl = wrows.rows;     //postgres                
                for(var i in rowsl){
                  if(rows[0].idLekuakPartidu == rowsl[i].idLekuak){
                    izenaLeku = rowst[i].izenaLeku;
                    herriaLeku = rowst[i].herriaLeku;
                    rowsl[i].aukeratua = true;
                  }
                  else
                    rowsl[i].aukeratua = false;
                }

                rows[0].lekuak = rowsl;

            res.render('partiduakeditatu.handlebars', {page_title:"Partiduak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
             });
             });              
         });
                 
//postgresConnect    }); 
};

exports.partiduakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idPartiduak = req.params.idPartiduak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            idTaldeakPartidu   : input.idTaldeakPartidu,
            jardunaldiaPartidu: input.jardunaldiaPartidu,
            jardunaldiDataPartidu : input.jardunaldiDataPartidu,
            etxekoaPartidu: input.etxekoaPartidu,
            kanpokoaPartidu: input.kanpokoaPartidu,
            txapelketaPartidu: input.txapelketaPartidu,
            dataPartidu: input.dataPartidu,
            orduaPartidu: input.orduaPartidu,
            idLekuakPartidu: input.idLekuakPartidu,
            emaitzaPartidu: input.emaitzaPartidu,
            bidaiOrduaPartidu: input.bidaiOrduaPartidu,
            bidaiaNolaPartidu: input.bidaiaNolaPartidu,
            bidaiEgunaPartidu: input.bidaiEgunaPartidu,
            nonPartidu : input.nonPartidu,
            bidaiKolorePartidu: input.bidaiKolorePartidu,
            arbitraiaPartidu : input.arbitraiaPartidu,
            diruaPartidu : input.diruaPartidu
        };
//postgres        connection.query("UPDATE partiduak set ? WHERE idElkarteakPartidu = ? and idPartiduak = ? ",[data,id,idPartiduak], function(err, rows)
        req.connection.query('UPDATE partiduak set "idLekuakPartidu"=$1, "idTaldeakPartidu"=$2, "jardunaldiaPartidu"=$3, "jardunaldiDataPartidu"=$4, "etxekoaPartidu"=$5, "kanpokoaPartidu"=$6, "txapelketaPartidu"=$7, "dataPartidu"=$8, "orduaPartidu"=$9, "emaitzaPartidu"=$10, "bidaiOrduaPartidu"=$11, "bidaiaNolaPartidu"=$12, "bidaiEgunaPartidu"=$13, "nonPartidu"=$14, "bidaiKolorePartidu"=$15, "arbitraiaPartidu"=$16, "diruaPartidu"=$17 WHERE "idElkarteakPartidu" = $18 and "idPartiduak" = $19 ',[input.idLekuakPartidu, input.idTaldeakPartidu,input.jardunaldiaPartidu,input.jardunaldiDataPartidu,input.etxekoaPartidu,input.kanpokoaPartidu,input.txapelketaPartidu,input.dataPartidu,input.orduaPartidu,input.emaitzaPartidu,input.bidaiOrduaPartidu, input.bidaiaNolaPartidu,input.bidaiEgunaPartidu,input.nonPartidu,input.bidaiKolorePartidu, input.arbitraiaPartidu, input.diruaPartidu,id,idPartiduak], function(err, rows)
        {
          if (err)
              console.log("Error Updating : %s ",err );

          if (req.session.idTaldeak){
                res.redirect('/admin/partiduaktaldeka/'+ req.session.idTaldeak);
          }
          else
           if (req.session.admin){ //Administratzaile moduan badago ordutegiak ikustean, editatu ondoren partidu ordutegira bidali
               res.redirect('/admin/partiduordutegiak/'+ req.session.idDenboraldia + '/' + req.session.jardunaldia);
           }
           else
            if (req.session.jardunaldia){ 
                res.redirect('/admin/jardunaldikopartiduak/' + req.session.jardunaldia);
            }
            else //Partiduak ataletik editatzean partiduak, partiduak orrira bidali 
                res.redirect('/admin/partiduak');
        });
    
//postgresConnect    });
};

exports.partiduordutegiak = function (req,res){
var id = req.session.idKirolElkarteak;
var jardunaldia = req.params.jardunaldia;
    jardunaldia = jardunaldia.substring(0,10);   //postgres
var idDenboraldia = req.params.idDenboraldia;
req.session.jardunaldia = jardunaldia;
req.session.idDenboraldia = idDenboraldia;
var etxekokanpokoak = []; //mailak
var etxekokanpokoa = {}; //maila
var egunak = []; //mailak
var eguna = {}; //maila
var lekuak = []; //multzoak
var lekua = {}; //multzoa
var partiduak = [];
var lekuaKanpoan = false;
var j,t, goizez, jauzi, kanpoan;
var k = 0, h = 0;
var vHerriak, vEgunak, vLekuak;
//var admin=(req.path.slice(0,24) == "/admin/partiduordutegiak");
//var gipuzkoa=(req.path.slice(0,26) == "/admin/partiduordutegiakgf");
//var busa=(req.path.slice(0,27) == "/admin/partiduordutegiakbus");
var admin=(req.path.slice(0,7) == "/admin/");
var gipuzkoa=(req.path.slice(0,20) == "/partiduordutegiakgf");
var busa=(req.path.slice(0,21) == "/partiduordutegiakbus");
var transfer=(req.path.slice(0,28) == "/admin/partiduordutegiaktrsf");
var textoa = "";
          if (transfer)
             textoa = "- Transferentziak";
          else 
            if (busa)
               textoa = "- Autobusak";
            else
              if (gipuzkoa)
                  textoa = "- Gipuzkoako Federazio";
          if (gipuzkoa || busa)
               admingfbus = 1;
          else 
               admingfbus = 0;
req.session.admin=0;
req.session.idTaldeak = 0;
var jardunaldiaIkusgai, jardunaldiaIkusgaiH;
var admingfbus, autobusez, kanpokoaPartidu;
//console.log(jardunaldia);
//console.log(req.path.slice(0,24));
//postgres   req.getConnection(function(err,connection){
//postgresConnectreq.connection.connect(function(err,connection){   //postgresConnect
      
//postgres      connection.query('SELECT jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by dataPartidu',[id, idDenboraldia],function(err,rowsj) {
//postgresConnect      connection.query('SELECT "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "dataPartidu"',[id, idDenboraldia],function(err,wrows) {
      req.connection.query('SELECT "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "dataPartidu"',[id, idDenboraldia],function(err,wrows) {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsj = wrows.rows;     //postgres
        if (req.session.jardunaldia == ""){
//postgres         req.session.jardunaldia = rowsj[0];
         req.session.jardunaldia = rowsj[0];
         jardunaldia = req.session.jardunaldia;
       }
//      connection.query('SELECT *,DATE_FORMAT(bidaiEgunaPartidu,"%Y/%m/%d") AS bidaiEgunaPartidu, DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu = ? and idDenboraldiaPartidu = ? order by dataPartidu, zenbakiLeku, orduaPartidu, zenbakiMaila ',[id, jardunaldia, idDenboraldia],function(err,rows) {      
//postgres      connection.query('SELECT *,DATE_FORMAT(bidaiEgunaPartidu,"%Y/%m/%d") AS bidaiEgunaPartidu, DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu = ? and idDenboraldiaPartidu = ? order by herriaLeku, dataPartidu, zenbakiLeku, bidaiOrduaPartidu, orduaPartidu, zenbakiMaila, izenaTalde asc ',[id, jardunaldia, idDenboraldia],function(err,rows) {    
//postgresConnect      connection.query('SELECT *,to_char("dataPartidu", \'YYYY-MM-DD\') as "dataPartiduF"  FROM partiduak, mailak, taldeak, lekuak where "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "jardunaldiDataPartidu" = $2 and "idDenboraldiaPartidu" = $3 order by "herriaLeku", "dataPartidu", "zenbakiLeku", "bidaiOrduaPartidu", "orduaPartidu", "zenbakiMaila", "izenaTalde" asc ',[id, jardunaldia, idDenboraldia],function(err,wrows) {    
      req.connection.query('SELECT *,to_char("dataPartidu", \'YYYY-MM-DD\') as "dataPartiduF"  FROM partiduak, mailak, taldeak, lekuak where "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "jardunaldiDataPartidu" = $2 and "idDenboraldiaPartidu" = $3 order by "herriaLeku", "dataPartidu", "zenbakiLeku", "bidaiOrduaPartidu", "orduaPartidu", "zenbakiMaila", "izenaTalde" asc ',[id, jardunaldia, idDenboraldia],function(err,wrows) {    

        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        console.log(rows.rows);     //postgres

//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
//postgresConnect        connection.query('SELECT DISTINCT to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') as "jardunaldiDataPartidu"  FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
        req.connection.query('SELECT DISTINCT to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') as "jardunaldiDataPartidu"  FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );

          rowsd= wrows.rows;     //postgres
//postgres          console.log(rowsd);     //postgres
          for(var i in rowsd ){
                if(req.session.jardunaldia == rowsd[i].jardunaldiDataPartidu){
                    jardunaldiDataPartidu = rowsd[i].jardunaldiDataPartidu;
                    rowsd[i].aukeratua = true;
                  }
                  else
                    rowsd[i].aukeratua = false;
                }
          

//postgres          connection.query('SELECT idDenboraldia, deskribapenaDenb, jardunaldiaIkusgai, DATE_FORMAT(jardunaldiaIkusgai,"%Y-%m-%d") AS jardunaldiaIkusgaiH FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
//postgresConnect         connection.query('SELECT "idDenboraldia", "deskribapenaDenb", "jardunaldiaIkusgai", to_char("jardunaldiaIkusgai", \'YYYY-MM-DD\') as "jardunaldiaIkusgaiH" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
         req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb", "jardunaldiaIkusgai", to_char("jardunaldiaIkusgai", \'YYYY-MM-DD\') as "jardunaldiaIkusgaiH" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
          
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsdenb = wrows.rows;     //postgres
            for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    idDenboraldia = rowsdenb[i].idDenboraldia;
                    deskribapenaDenb = rowsdenb[i].deskribapenaDenb;
                    jardunaldiaIkusgai = rowsdenb[i].jardunaldiaIkusgai;
                    jardunaldiaIkusgaiH = rowsdenb[i].jardunaldiaIkusgaiH;
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
                }
            

        for (var i in rows) {
         rows[i].dataPartidu = rows[i].dataPartiduF;     //postgres  
         if ((admin || gipuzkoa || busa) || (!admin && rows[i].jardunaldiDataPartidu <= jardunaldiaIkusgai)){
          if (rows[i].bidaiaNolaPartidu == null)
             autobusez = ""
          else 
             autobusez = rows[i].bidaiaNolaPartidu.slice(0,7);
         if ((gipuzkoa && rows[i].federazioaTalde == 0 && rows[i].zenbakiLeku < 8) || (transfer && rows[i].arbitraiaTalde != 0 && rows[i].federazioaTalde != 0 && rows[i].zenbakiLeku < 8) || (busa && autobusez == "AUTOBUS") || ( !gipuzkoa && !busa && !transfer)){
          if(vHerriak != rows[i].herriaLeku){
            if(vHerriak !=null){
              //console.log("vKategoria:" +vKategoria);
              lekua.partiduak = partiduak;
              lekuak[t] = lekua;
              eguna.lekuak = lekuak;
              egunak[k] = eguna;
              etxekokanpokoa.egunak = egunak;
              etxekokanpokoak[h] = etxekokanpokoa;
              //console.log("Mailak:" +t + JSON.stringify(mailak[k]));
              h++;
            }
            vHerriak = rows[i].herriaLeku;
            vEgunak = null;
            egunak = [];
            vLekuak = null;
            lekuak = []; 
            k=0;
            if (vHerriak == "Kanpoan")
                kanpoan = 1;
            else
                kanpoan = 0;

            etxekokanpokoa = {
                  herriaLeku    : rows[i].herriaLeku,
                  kanpoan  :  kanpoan
               };
               
          }
//          console.log(vEgunak+ ' - '+ rows[i].dataPartidu);     //postgres  
          if(vEgunak != rows[i].dataPartidu){
            if(vEgunak !=null){
              //console.log("vKategoria:" +vKategoria);
              lekua.partiduak = partiduak;
              lekuak[t] = lekua;
              eguna.lekuak = lekuak;
              egunak[k] = eguna;
              //console.log("Mailak:" +t + JSON.stringify(mailak[k]));
              k++;
            }
            vEgunak = rows[i].dataPartidu;
            vLekuak = null;
            lekuak = []; 
            t=0;

            eguna = {
                  dataPartidu    : rows[i].dataPartidu,
                  egunaTexto   : egunatextobihurtu(rows[i].dataPartidu)
                 // egunIzena : egunIzena
               };
               
          }
          if(vLekuak != rows[i].idLekuakPartidu){
            if(vLekuak !=null){
              //console.log("vMultzo:" +vMultzo);
              lekua.partiduak = partiduak;
              lekuak[t] = lekua;
              //console.log("Multzoak:" +t + JSON.stringify(multzoak[t]));
              t++;
            }
            vLekuak = rows[i].idLekuakPartidu;
            partiduak = []; 
            j=0;
            if (rows[i].orduaPartidu < '14:00:00')
              {
               goizez = 1;
              } 
            else 
               goizez = 0;
            /////////////////////BERRIA/////////////////////

              if (rows[i].izenaLeku == "Kanpoan")
                   lekuaKanpoan = true;
              else
                    lekuaKanpoan = false;

            /////////////////////////////////////////////////
           lekua
             = {
                  lekua    : rows[i].izenaLeku,
                  lekuaKanpoan : lekuaKanpoan
               };
               
          }
          if (goizez == 1 && rows[i].orduaPartidu > '14:00:00')
           { 
               jauzi = 1;
               goizez = 0;
           } 
          else 
               jauzi = 0;
//          if (admin && !gipuzkoa && !busa && !transfer)
//               admingfbus = admin;
//          else 
//               admingfbus = 0;

          if (transfer)
          { 
            kanpokoaPartidu = rows[i].arbitraiaTalde;
            if (rows[i].federazioaTalde == 2)
               kanpokoaPartidu += "€ - 0075 0349 41 0606161256";
            else 
               kanpokoaPartidu += "€ - 3035 0083 22 0830120507";;
          }
          else 
               kanpokoaPartidu = rows[i].kanpokoaPartidu;

          partiduak[j] = {
                  idPartiduak    : rows[i].idPartiduak,
                  izenaMaila: rows[i].izenaMaila,
                  akronimoTalde: rows[i].akronimoTalde,
                  etxekoaPartidu: rows[i].etxekoaPartidu,
                  kanpokoaPartidu    : kanpokoaPartidu,               // ADI rows[i].kanpokoaPartidu,
                  orduaPartidu    : rows[i].orduaPartidu,
                  txapelketaPartidu : rows[i].txapelketaPartidu,
                  bidaiOrduaPartidu: rows[i].bidaiOrduaPartidu,
                  bidaiaNolaPartidu: rows[i].bidaiaNolaPartidu,
                  bidaiEgunaPartidu: rows[i].bidaiEgunaPartidu,
                  emaitzaPartidu : rows[i].emaitzaPartidu,
                  nonPartidu: rows[i].nonPartidu,
//                  admin: admingfbus,
                  admin: admin,
                  jauzi : jauzi,
                  bidaiKolorePartidu : rows[i].bidaiKolorePartidu
               };
          j++;
       
     } } }
        if(vEgunak !=null){
              lekua.partiduak = partiduak;
              //lekua.lekuaKanpoan = lekuaKanpoan; //BERRIA
              lekuak[t] = lekua;
              eguna.lekuak = lekuak;
              egunak[k] = eguna;
              etxekokanpokoa.egunak = egunak;
              etxekokanpokoak[h] = etxekokanpokoa;
            }

      

        if (admin){
           req.session.admin = 1;
        }       
        else {
            req.session.admin = 0;

            /*for (var i in rowsd){
              if (rowsd[i].jardunaldiDataPartidu > jardunaldiaIkusgai){
                rowsd
              }
            }*/
        }
   
        res.render('partiduordutegiak.handlebars', {title : 'KirolElkarteak-Partiduak', jardunaldiaIkusgaiH:jardunaldiaIkusgaiH, jardunaldiaIkusgai:jardunaldiaIkusgai, data2:etxekokanpokoak, jardunaldiak:rowsd, denboraldiak:rowsdenb, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, menuadmin:admin, admingfbus:admingfbus, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna, textoa:textoa} );

//postgresConnect        connection.end();    //postgres
        });
     });   
    });
  });
//postgresConnect });        //postgresConnect
};

exports.partiduatzeratuak = function (req,res){
var id = req.session.idKirolElkarteak;

var idDenboraldia = req.params.idDenboraldia;

req.session.idDenboraldia = idDenboraldia;
var etxekokanpokoak = []; //mailak
var etxekokanpokoa = {}; //maila
var egunak = []; //mailak
var eguna = {}; //maila
var lekuak = []; //multzoak
var lekua = {}; //multzoa
var partiduak = [];
var lekuaKanpoan = false;
var j,t, goizez, jauzi, kanpoan;
var k = 0, h = 0;
var vHerriak, vEgunak, vLekuak;

var admin=(req.path.slice(0,7) == "/admin/");

req.session.admin=0;
req.session.idTaldeak = 0;
var kanpokoaPartidu;
//console.log(jardunaldia);
//console.log(req.path.slice(0,24));
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 

//postgres      connection.query('SELECT jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by dataPartidu',[id, idDenboraldia],function(err,rowsj) {
      req.connection.query('SELECT "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "dataPartidu"',[id, idDenboraldia],function(err,wrows) {

        if(err)
           console.log("Error Selecting : %s ",err );
        rowsj = wrows.rows;     //postgres
        if (req.session.jardunaldia == ""){
         req.session.jardunaldia = rowsj[0];
         jardunaldia = req.session.jardunaldia;
       }
//      connection.query('SELECT *,DATE_FORMAT(bidaiEgunaPartidu,"%Y/%m/%d") AS bidaiEgunaPartidu, DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu = ? and idDenboraldiaPartidu = ? order by dataPartidu, zenbakiLeku, orduaPartidu, zenbakiMaila ',[id, jardunaldia, idDenboraldia],function(err,rows) {      
//postgres      connection.query('SELECT *,DATE_FORMAT(bidaiEgunaPartidu,"%Y/%m/%d") AS bidaiEgunaPartidu, DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where zenbakiLeku = 7 and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by herriaLeku, dataPartidu, zenbakiMaila, izenaTalde asc ',[id, idDenboraldia],function(err,rows) {    
      req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartiduF" FROM partiduak, mailak, taldeak, lekuak where "zenbakiLeku" = 7 and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "herriaLeku", "dataPartidu", "zenbakiMaila", "izenaTalde" asc ',[id, idDenboraldia],function(err,wrows) {    

        if(err)
           console.log("Error Selecting : %s ",err );

        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') AS "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
          for(var i in rowsd ){
                if(req.session.jardunaldia == rowsd[i].jardunaldiDataPartidu){
                    jardunaldiDataPartidu = rowsd[i].jardunaldiDataPartidu;
                    rowsd[i].aukeratua = true;
                  }
                  else
                    rowsd[i].aukeratua = false;
                }
          
//postgres          connection.query('SELECT idDenboraldia, deskribapenaDenb, jardunaldiaIkusgai, DATE_FORMAT(jardunaldiaIkusgai,"%Y-%m-%d") AS jardunaldiaIkusgaiH FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
          req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb", "jardunaldiaIkusgai",  to_char("jardunaldiaIkusgai", \'YYYY-MM-DD\') AS "jardunaldiaIkusgaiH" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
          
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsdenb = wrows.rows;     //postgres
            for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    idDenboraldia = rowsdenb[i].idDenboraldia;
                    deskribapenaDenb = rowsdenb[i].deskribapenaDenb;
                    jardunaldiaIkusgai = rowsdenb[i].jardunaldiaIkusgai;
                    jardunaldiaIkusgaiH = rowsdenb[i].jardunaldiaIkusgaiH;
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
                }
            

        for (var i in rows) {

          if(vHerriak != rows[i].herriaLeku){
            if(vHerriak !=null){
              //console.log("vKategoria:" +vKategoria);
              lekua.partiduak = partiduak;
              lekuak[t] = lekua;
              eguna.lekuak = lekuak;
              egunak[k] = eguna;
              etxekokanpokoa.egunak = egunak;
              etxekokanpokoak[h] = etxekokanpokoa;
              //console.log("Mailak:" +t + JSON.stringify(mailak[k]));
              h++;
            }
            vHerriak = rows[i].herriaLeku;
            vEgunak = null;
            egunak = [];
            vLekuak = null;
            lekuak = []; 
            k=0;
            if (vHerriak == "Kanpoan")
                kanpoan = 1;
            else
                kanpoan = 0;

            etxekokanpokoa = {
                  herriaLeku    : rows[i].herriaLeku,
                  kanpoan  :  kanpoan
               };
               
          }
  
          if(vEgunak != rows[i].dataPartidu){
            if(vEgunak !=null){
              //console.log("vKategoria:" +vKategoria);
              lekua.partiduak = partiduak;
              lekuak[t] = lekua;
              eguna.lekuak = lekuak;
              egunak[k] = eguna;
              //console.log("Mailak:" +t + JSON.stringify(mailak[k]));
              k++;
            }
            vEgunak = rows[i].dataPartidu;
            vLekuak = null;
            lekuak = []; 
            t=0;

            eguna = {
                  dataPartidu    : rows[i].dataPartiduF,
                  egunaTexto   : egunatextobihurtu(rows[i].dataPartidu)
                 // egunIzena : egunIzena
               };
               
          }
          if(vLekuak != rows[i].idLekuakPartidu){
            if(vLekuak !=null){
              //console.log("vMultzo:" +vMultzo);
              lekua.partiduak = partiduak;
              lekuak[t] = lekua;
              //console.log("Multzoak:" +t + JSON.stringify(multzoak[t]));
              t++;
            }
            vLekuak = rows[i].idLekuakPartidu;
            partiduak = []; 
            j=0;
            if (rows[i].orduaPartidu < '14:00:00')
              {
               goizez = 1;
              } 
            else 
               goizez = 0;
            /////////////////////BERRIA/////////////////////

              if (rows[i].izenaLeku == "Kanpoan")
                   lekuaKanpoan = true;
              else
                    lekuaKanpoan = false;

            /////////////////////////////////////////////////
           lekua
             = {
                  lekua    : rows[i].izenaLeku,
                  lekuaKanpoan : lekuaKanpoan
               };
               
          }
          if (goizez == 1 && rows[i].orduaPartidu > '14:00:00')
           { 
               jauzi = 1;
               goizez = 0;
           } 
          else 
               jauzi = 0;

          kanpokoaPartidu = rows[i].kanpokoaPartidu;

          partiduak[j] = {
                  idPartiduak    : rows[i].idPartiduak,
                  izenaMaila: rows[i].izenaMaila,
                  akronimoTalde: rows[i].akronimoTalde,
                  etxekoaPartidu: rows[i].etxekoaPartidu,
                  kanpokoaPartidu    : kanpokoaPartidu,               // ADI rows[i].kanpokoaPartidu,
                  orduaPartidu    : rows[i].orduaPartidu,
                  txapelketaPartidu : rows[i].txapelketaPartidu,
                  bidaiOrduaPartidu: rows[i].bidaiOrduaPartidu,
                  bidaiaNolaPartidu: rows[i].bidaiaNolaPartidu,
                  bidaiEgunaPartidu: rows[i].bidaiEgunaPartidu,
                  emaitzaPartidu : rows[i].emaitzaPartidu,
                  nonPartidu: rows[i].nonPartidu,
//                  admin: admingfbus,
                  admin: admin,
                  jauzi : jauzi,
                  bidaiKolorePartidu : rows[i].bidaiKolorePartidu
               };
          j++;
       
        }
        if(vEgunak !=null){
              lekua.partiduak = partiduak;
              //lekua.lekuaKanpoan = lekuaKanpoan; //BERRIA
              lekuak[t] = lekua;
              eguna.lekuak = lekuak;
              egunak[k] = eguna;
              etxekokanpokoa.egunak = egunak;
              etxekokanpokoak[h] = etxekokanpokoa;
            }
     
        if (admin){
           req.session.admin = 1;
        }       
        else {
            req.session.admin = 0;

        }
    
        res.render('partiduatzeratuak.handlebars', {title : 'KirolElkarteak-Partidu Atzeratuak', data2:etxekokanpokoak, jardunaldiak:rowsd, denboraldiak:rowsdenb, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, menuadmin:admin, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna} );

        });
     });   
    });
  });
//postgresConnect});
};

function egunatextobihurtu (eguna){
  var egunaTexto = ["Igandea", "Astelehena", "Asteartea", "Asteazkena", "Osteguna", "Ostirala", "Larunbata"];
  var dt = new Date(eguna); 
  return egunaTexto[dt.getUTCDay()];
}

exports.jardunaldiaikusgai = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var jardunaldia = req.params.jardunaldia;
      jardunaldia = jardunaldia.substring(0,10);   //postgres
  console.log(jardunaldia);

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 

       
      var data = {
            
            jardunaldiaIkusgai : jardunaldia
        };
//postgres      var query = connection.query("UPDATE denboraldiak set ? WHERE idElkarteakDenb = ? and idDenboraldia = ?",[data,id, idDenboraldia], function(err, rows)
     var query = req.connection.query('UPDATE denboraldiak set "jardunaldiaIkusgai" = $1 WHERE "idElkarteakDenb" = $2 and "idDenboraldia" = $3',[jardunaldia,id, idDenboraldia], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/admin/partiduordutegiak/'+idDenboraldia+'/'+jardunaldia);
          
      });
//postgresConnect  });
};

//PARTIDUAK KARGATU
exports.partiduakkargatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM taldeak,mailak where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by idMailaTalde asc',[id,idDenboraldia],function(err,rowst) {
     req.connection.query('SELECT * FROM taldeak,mailak where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "idMailaTalde" asc',[id,idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        rowst = wrows.rows;     //postgres
        res.render('partiduakkargatu.handlebars', {title : 'KirolElkarteak-Partiduak kargatu', taldeak:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
         
      });  
           
//postgresConnect  });
};

exports.partiduakkargatuegin = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var now= new Date();
    var partiduak = input.partiduakCSV.split("\n"); //CSV-a zatitu lerroka (partiduka)
    var partidua = [];
    var idLekuak;
    var kanpoPosizio, etxePosizio, atsedenaPosizio, partiduanoiz, aOrdua, vEguna, vBukaera, bidaiaNola;
//    var vEguna = new Date(); 
//    var vBukaera = new Date();
    var ordua = input.hasierakoordua;

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM lekuak where idElkarteakLeku = ? order by zenbakiLeku asc',[id],function(err,rowsl) {
     req.connection.query('SELECT * FROM lekuak where "idElkarteakLeku" = $1 order by "zenbakiLeku" asc',[id],function(err,wrows) {
            
      if(err)
          console.log("Error Selecting : %s ",err );
      rowsl = wrows.rows;     //postgres
      kanpoPosizio = rowsl.length-1;
      etxePosizio = input.etxekoaknon;
      atsedenaPosizio = 6;

      var  aBukaera = input.bukaerakoordua.split(":");
      var  vDenbora= input.partidudenbora * 60 * 1000;

      for (var i in partiduak){ //Partidu bakoitzeko datuak atera, ","-kin banatuta daudelako split erabiliz
          partidua = partiduak[i].split(",");
          console.log(partiduak[i]);
//debugger;
          bidaiaNola = "";
          if (partidua[1] != input.federazioTaldeIzena) //Federazioko taldearen izenean sartu duten datua ezberdina bada CSV-ko 2. zutabearekin (etxeko taldea), kanpokoa dela adierazi
           {
            if (partidua[1] == "ATSEDENA")
                idLekuak = rowsl[atsedenaPosizio].idLekuak; //Atsedena lekua  ADI zenbatgarrena ? 5 edo 6
            else
            {
                idLekuak = rowsl[kanpoPosizio].idLekuak; //Kanpoko taldearen lekua datu-baseko azkena dagoena izango da (zenbakiLeku aldagaia handiena duena)
                bidaiaNola = "AUTOBUSEZ";
            }
            partiduanoiz = partidua[0];
            vOrdua = "00:00";
           }
          else 
           {
            idLekuak = rowsl[etxePosizio].idLekuak; //Etxeko taldearen lekua datu-baseko lehenengo dagoena izango da (zenbakiLeku aldagai txikiena duena)
            if (input.etxekoaknon == 1) {
                etxePosizio--;
                if (etxePosizio < 0)
                    etxePosizio = input.etxekoaknon;
            }
//          aOrdua = partidua[0].split("-");
//          vEguna.setFullYear(aOrdua[0], aOrdua[1] - 1, aOrdua[2]); 
            vEguna = new Date(partidua[0]);

            if (input.asteburuannoiz == 0)
                partiduanoiz = partidua[0];
            else
            { 
              vEguna.setDate(vEguna.getDate() + 1); // + input.asteburuannoiz
              partiduanoiz = vEguna ;
            }
            console.log(partidua[0] + partiduanoiz + vEguna);
            if (input.partidudenbora == 0)
                vOrdua = input.hasierakoordua;
            else
            {  

                  aOrdua = ordua.split(":");
                  vEguna.setHours(aOrdua[0]);
                  vEguna.setMinutes(aOrdua[1]);
                  vEguna.setSeconds(aOrdua[2]);

                  vOrdua = vEguna.getHours() +":"+vEguna.getMinutes()+":"+vEguna.getSeconds();

                  vBukaera = vEguna;
                  vBukaera.setHours(aBukaera[0]);
                  vBukaera.setMinutes(aBukaera[1]);
                  vBukaera.setSeconds(aBukaera[2]);
                  console.log("vEguna: "+vEguna+ "-"+vBukaera);

                  vEguna.setTime(vEguna.getTime() + vDenbora);


                  if (vEguna.getTime() >= vBukaera.getTime())
                      ordua = input.hasierakoordua;
                  else
                      ordua = vEguna.getHours() +":"+vEguna.getMinutes()+":"+vEguna.getSeconds();  
            }
           }
          var data = {
            idElkarteakPartidu    : id,
            idDenboraldiaPartidu : idDenboraldia,
            idLekuakPartidu : idLekuak,
            idTaldeakPartidu : input.idTaldeakPartidu,
            jardunaldiaPartidu : parseInt(i) + 1,
            jardunaldiDataPartidu: partidua[4],      // partidua[0],
            etxekoaPartidu : partidua[1],
            kanpokoaPartidu : partidua[3],
            txapelketaPartidu : input.txapelketa,
            dataPartidu: partiduanoiz,               // partidua[0],
            orduaPartidu: vOrdua,
            bidaiOrduaPartidu : '00:00:00',
            bidaiaNolaPartidu : bidaiaNola  
          };
//postgres        var query = req.connection.query("INSERT INTO partiduak set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO partiduak ("idElkarteakPartidu","idDenboraldiaPartidu","idLekuakPartidu","idTaldeakPartidu","jardunaldiaPartidu","jardunaldiDataPartidu","etxekoaPartidu","kanpokoaPartidu","txapelketaPartidu","dataPartidu","orduaPartidu","bidaiOrduaPartidu","bidaiaNolaPartidu") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',[id,idDenboraldia,idLekuak,input.idTaldeakPartidu,parseInt(i) + 1,partidua[4],partidua[1],partidua[3],input.txapelketa,partiduanoiz,vOrdua,"00:00:00",bidaiaNola], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
          
        }); 
      }
      res.redirect('/admin/partiduak');
     });
//postgresConnect    });
};

exports.emaitzakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.session.admin = 0;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(bidaiEgunaPartidu,"%Y/%m/%d") AS bidaiEgunaPartidu,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? order by dataPartidu desc',[id],function(err,rows) {
     req.connection.query('SELECT *, to_char("bidaiEgunaPartidu", \'YYYY-MM-DD\') AS "bidaiEgunaPartidu", to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM partiduak, mailak, taldeak, lekuak where "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 order by dataPartidu desc',[id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT  to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') AS "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
          debugger;
          for(var i in rows ){
                if(req.session.arduraduna == rows[i].idArduradunTalde)
                    rows[i].arduraduna = true;
                else
                    rows[i].arduraduna = false;
                
          }

          res.render('emaitzak.handlebars',{title: "Emaitzak", data:rows, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        });                   
      });   
//postgresConnect  });
};

exports.jardunaldikoemaitzakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var jardunaldia = req.params.jardunaldia;
      jardunaldia = jardunaldia.substring(0,10);   //postgres
  console.log("Jardunaldia:" + jardunaldia);
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by zenbakiMaila asc, izenaTalde asc',[id, jardunaldia, jardunaldia],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM partiduak, mailak, taldeak, lekuak where "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "jardunaldiDataPartidu" >= $2 and "jardunaldiDataPartidu" <= $3 order by "zenbakiMaila" asc, "izenaTalde" asc',[id, jardunaldia, jardunaldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT  to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') AS "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
          res.render('emaitzak.handlebars',{title: "Partiduak", data:rows, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        });                   
      });   
//postgresConnect  });
};

exports.partiduemaitzak = function(req, res){
  var id = req.session.idKirolElkarteak;
  var jardunaldia = req.params.jardunaldia;
      jardunaldia = jardunaldia.substring(0,10);   //postgres
  var idDenboraldia = req.params.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  var emaitzak=[];
  var emaitzaPartidu;
  req.session.jardunaldia = jardunaldia;
  req.session.idDenboraldia = idDenboraldia;
  console.log("Jardunaldia:" + jardunaldia);
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where federazioaTalde != 9 and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by zenbakiMaila asc, izenaTalde asc, dataPartidu, orduaPartidu',[id, idDenboraldia, jardunaldia, jardunaldia],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartiduF" FROM partiduak, mailak, taldeak, lekuak where "federazioaTalde" != 9 and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 and "jardunaldiDataPartidu" >= $3 and "jardunaldiDataPartidu" <= $4 order by "zenbakiMaila" asc, "izenaTalde" asc, "dataPartidu", "orduaPartidu"',[id, idDenboraldia, jardunaldia, jardunaldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT  to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') AS "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
              for(var i in rowsd ){
                if(req.session.jardunaldia == rowsd[i].jardunaldiDataPartidu){
                    jardunaldiDataPartidu = rowsd[i].jardunaldiDataPartidu;
                    rowsd[i].aukeratua = true;
                  }
                  else
                    rowsd[i].aukeratua = false;
                }
//postgres          connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
          req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
          
            if(err)
               console.log("Error Selecting : %s ",err );
            rowsdenb = wrows.rows;     //postgres
            for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    idDenboraldia = rowsdenb[i].idDenboraldia;
                    deskribapenaDenb = rowsdenb[i].deskribapenaDenb;
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
            }
//postgres           connection.query('SELECT * FROM taldeak, mailak  where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by zenbakiMaila desc, izenaTalde asc',[id, idDenboraldia],function(err,rowstalde) {
           req.connection.query('SELECT * FROM taldeak, mailak  where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "zenbakiMaila" desc, "izenaTalde" asc',[id, idDenboraldia],function(err,wrows) {
          
              if(err)
                console.log("Error Selecting : %s ",err );
              rowstalde = wrows.rows;     //postgres
              for(var i in rowstalde ){
                if(idTaldeak == rowstalde[i].idTaldeak){
                    idTaldeak = rowstalde[i].idTaldeak;
                    rowstalde[i].aukeratua = true;
                  }
                  else
                    rowstalde[i].aukeratua = false;
              }

              for(var i in rows ){
                if(req.session.arduraduna == rows[i].idArduradunTalde)
                    rows[i].arduraduna = true;
                else
                    rows[i].arduraduna = false;
                if (rows[i].emaitzaPartidu == "" || rows[i].emaitzaPartidu === null || rows[i].emaitzaPartidu === undefined)
                     rows[i].kolore = "#000000";
                else  
                { 
                 emaitzak = rows[i].emaitzaPartidu.split("-").map(Number);
                 if(rows[i].zenbakiLeku >= 9)    // Kanpoko partiduak
                 {
                  if(emaitzak[0] < emaitzak[1])
                     rows[i].kolore = "#00F000";     // berde ilunez irabazitakoak
                  else
                   if(emaitzak[0] > emaitzak[1])     // gorriz   galdutakoak
                     rows[i].kolore = "#FF0000";
                   else
                     rows[i].kolore = "#0000FF";     // urdinez   berdindutakoak
                 }
                 else                            // Etxeko partiduak
                  {
                  if(emaitzak[0] > emaitzak[1])
                     rows[i].kolore = "#00F000";
                  else
                   if(emaitzak[0] < emaitzak[1])
                     rows[i].kolore = "#FF0000";
                   else
                     rows[i].kolore = "#0000FF";  
                  }  
                }     
            
              }

          res.render('emaitzak.handlebars',{title: "Emaitzak", data:rows, taldeak:rowstalde, denboraldiak:rowsdenb, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
         });
        }); 
       });                   
      });   
//postgresConnect  });
};

exports.partiduemaitzaktalde = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idTaldeak = req.params.idTaldeak;
  var idDenboraldia = req.session.idDenboraldia;
  var admin = (req.path.slice(0,22) == "/admin/partiduemaitzak");
  var emaitzak=[];

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu = ? and idTaldeakPartidu = ? order by jardunaldiDataPartidu asc, dataPartidu, orduaPartidu',[id, idDenboraldia, idTaldeak],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\')AS "dataPartiduF" FROM partiduak, mailak, taldeak, lekuak where "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 and "idTaldeakPartidu" = $3 order by "jardunaldiDataPartidu" asc, "dataPartidu", "orduaPartidu"',[id, idDenboraldia, idTaldeak],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM taldeak, mailak  where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by zenbakiMaila desc, izenaTalde asc',[id, idDenboraldia],function(err,rowstalde) {
        req.connection.query('SELECT * FROM taldeak, mailak  where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "zenbakiMaila" desc, "izenaTalde" asc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowstalde = wrows.rows;     //postgres
            for(var i in rowstalde ){
                if(idTaldeak == rowstalde[i].idTaldeak){
                    idTaldeak = rowstalde[i].idTaldeak;
                    rowstalde[i].aukeratua = true;
                  }
                  else
                    rowstalde[i].aukeratua = false;
            }


            for(var i in rows ){
                rows[i].adminis = admin;
                if(req.session.arduraduna == rows[i].idArduradunTalde)
                    rows[i].arduraduna = true;
                else
                    rows[i].arduraduna = false;
                if (rows[i].emaitzaPartidu == "" || rows[i].emaitzaPartidu === null || rows[i].emaitzaPartidu === undefined)
                     rows[i].kolore = "#000000";
                else  
                { 
                 emaitzak = rows[i].emaitzaPartidu.split("-").map(Number);
                 if(rows[i].zenbakiLeku >= 9)    // Kanpoko partiduak
                 {
                  if(emaitzak[0] < emaitzak[1])
                     rows[i].kolore = "#00F000";     // berde ilunez irabazitakoak
                  else
                   if(emaitzak[0] > emaitzak[1])     // gorriz   galdutakoak
                     rows[i].kolore = "#FF0000";
                   else
                     rows[i].kolore = "#0000FF";     // urdinez   berdindutakoak
                 }
                 else                            // Etxeko partiduak
                  {
                  if(emaitzak[0] > emaitzak[1])
                     rows[i].kolore = "#00F000";
                  else
                   if(emaitzak[0] < emaitzak[1])
                     rows[i].kolore = "#FF0000";
                   else
                     rows[i].kolore = "#0000FF";  
                  }  
                }                     
            }

              


          res.render('emaitzaktaldeka.handlebars',{title: "Emaitzak taldeka",admin:admin, data:rows, taldeak:rowstalde, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
      
        });                   
      });   
//postgresConnect  });
};

exports.partiduemaitzakadmin = function(req, res){
  var id = req.session.idKirolElkarteak;
  var jardunaldia = req.params.jardunaldia;
      jardunaldia = jardunaldia.substring(0,10);   //postgres
  var idDenboraldia = req.params.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  var admin = (req.path.slice(0,22) == "/admin/partiduemaitzak");
  var emaitzak=[];
  req.session.jardunaldia = jardunaldia;
  req.session.idDenboraldia = idDenboraldia;
//  console.log("Jardunaldia:" + jardunaldia);

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where federazioaTalde != 9 and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by zenbakiMaila asc, izenaTalde asc, dataPartidu, orduaPartidu',[id, idDenboraldia, jardunaldia, jardunaldia],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM partiduak, mailak, taldeak, lekuak where "federazioaTalde" != 9 and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 and "jardunaldiDataPartidu" >= $3 and "jardunaldiDataPartidu" <= $4 order by "zenbakiMaila" asc, "izenaTalde" asc, "dataPartidu", "orduaPartidu"',[id, idDenboraldia, jardunaldia, jardunaldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') AS "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
              for(var i in rowsd ){
                if(req.session.jardunaldia == rowsd[i].jardunaldiDataPartidu){
                    jardunaldiDataPartidu = rowsd[i].jardunaldiDataPartidu;
                    rowsd[i].aukeratua = true;
                  }
                  else
                    rowsd[i].aukeratua = false;
                }
//postgres          connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
          req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb" FROM "denboraldiak" where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
          
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsdenb = wrows.rows;     //postgres
            for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    idDenboraldia = rowsdenb[i].idDenboraldia;
                    deskribapenaDenb = rowsdenb[i].deskribapenaDenb;
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
            }
//postgres            connection.query('SELECT * FROM taldeak, mailak  where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by zenbakiMaila desc, izenaTalde asc',[id, idDenboraldia],function(err,rowstalde) {
            req.connection.query('SELECT * FROM taldeak, mailak  where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "zenbakiMaila" desc, "izenaTalde" asc',[id, idDenboraldia],function(err,wrows) {
          
              if(err)
                console.log("Error Selecting : %s ",err );
              rowstalde = wrows.rows;     //postgres
              for(var i in rowstalde ){
                if(idTaldeak == rowstalde[i].idTaldeak){
                    idTaldeak = rowstalde[i].idTaldeak;
                    rowstalde[i].aukeratua = true;
                  }
                  else
                    rowstalde[i].aukeratua = false;
              }

              for(var i in rows ){
                if (rows[i].emaitzaPartidu == "" || rows[i].emaitzaPartidu === null || rows[i].emaitzaPartidu === undefined)
                     rows[i].kolore = "#000000";
                else  
                { 
                 emaitzak = rows[i].emaitzaPartidu.split("-").map(Number);
                 if(rows[i].zenbakiLeku >= 9)    // Kanpoko partiduak
                 {
                  if(emaitzak[0] < emaitzak[1])
                     rows[i].kolore = "#00F000";     // berde ilunez irabazitakoak
                  else
                   if(emaitzak[0] > emaitzak[1])     // gorriz   galdutakoak
                     rows[i].kolore = "#FF0000";
                   else
                     rows[i].kolore = "#0000FF";     // urdinez   berdindutakoak
                 }
                 else                            // Etxeko partiduak
                  {
                  if(emaitzak[0] > emaitzak[1])
                     rows[i].kolore = "#00F000";
                  else
                   if(emaitzak[0] < emaitzak[1])
                     rows[i].kolore = "#FF0000";
                   else
                     rows[i].kolore = "#0000FF";  
                  }  
                }                     
              }

          res.render('emaitzakadmin.handlebars',{title: "Emaitzak admin", admin:admin, data:rows, taldeak:rowstalde, denboraldiak:rowsdenb, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
            });
          }); 
        });                   
      });   
//postgresConnect  });
};

exports.partiduemaitzaksartuadmin = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idPartidua = req.params.idPartidua;
  //var idDenboraldia = req.params.idDenboraldia;
  //req.session.jardunaldia = jardunaldia;
  //req.session.idDenboraldia = idDenboraldia;

  var admin = (req.path.slice(0,20) == "/admin/emaitzaksartu");

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak where idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idPartiduak = ?',[id, idPartidua],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM partiduak, mailak, taldeak where "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idPartiduak" = $2',[id, idPartidua],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
         if (rows.length != 0){
            rows[0].admin=admin;
            res.render('emaitzasartu.handlebars',{title: "Emaitzak admin", data:rows, admin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});

         }else{
            res.redirect('/');
         }

        }); 
                       
      
//postgresConnect  });
};




exports.partiduemaitzakgordeadmin = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idPartidua = req.params.idPartidua;
    var taldeka = (req.path.slice(0,27) == "/admin/emaitzaktaldekagorde");

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            emaitzaPartidu : input.emaitzaPartidu,
            arbitraiaPartidu : input.arbitraiaPartidu,
            diruaPartidu : input.diruaPartidu
        };
//postgres        connection.query("UPDATE partiduak set ? WHERE idElkarteakPartidu = ? and idPartiduak = ? ",[data,id,idPartidua], function(err, rows)
        req.connection.query('UPDATE partiduak set "emaitzaPartidu"=$1,"arbitraiaPartidu"=$2,"diruaPartidu"=$3 WHERE "idElkarteakPartidu" = $4 and "idPartiduak" = $5 ',[input.emaitzaPartidu,input.arbitraiaPartidu,input.diruaPartidu ,id,idPartidua], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );

//postgres          connection.query('SELECT *,DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idPartiduak = ?',[id, idPartidua],function(err,rowsp) {
          req.connection.query('SELECT *, to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\')AS "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idPartiduak" = $2',[id, idPartidua],function(err,wrows) {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rowsp = wrows.rows;     //postgres

            //res.redirect('/admin/partiduemaitzak/'+ req.session.idDenboraldia + '/' + req.session.jardunaldia);

            if (req.session.erabiltzaile=="admin")
             {
              if (taldeka)
                   res.redirect('/admin/partiduemaitzaktalde/'+ rowsp[0].idTaldeakPartidu);
              else
                   res.redirect('/admin/partiduemaitzak/'+ rowsp[0].idDenboraldiaPartidu + '/' + rowsp[0].jardunaldiDataPartidu);
             }
            else
                res.redirect('/partiduemaitzak/'+ rowsp[0].idDenboraldiaPartidu + '/' + rowsp[0].jardunaldiDataPartidu);
         
           });
        });
    
//postgresConnect    });
};

exports.ekitaldiakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;
  var jardunaldia = req.params.jardunaldia;
      jardunaldia = jardunaldia.substring(0,10);   //postgres
  var idDenboraldia = req.params.idDenboraldia;
  req.session.jardunaldia = jardunaldia;
  req.session.idDenboraldia = idDenboraldia;
  var admin=(req.path.slice(0,7) == "/admin/");
  var jardunaldiaIkusgai;
//postgres  req.getConnection(function(err,connection){
//postgresConnect //postgresConnect req.connection.connect(function(err,connection){                //postgres 
       
//     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu=? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by zenbakiMaila, izenaTalde asc, dataPartidu, orduaPartidu',[id,idDenboraldia, jardunaldia, jardunaldia],function(err,rows) {
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where idPartiduak=idPartiduakEkitaldiak and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by dataPartidu desc',[id, idDenboraldia, jardunaldia, jardunaldia],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartiduF" FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where "idPartiduak"="idPartiduakEkitaldiak" and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 and "jardunaldiDataPartidu" >= $3 and "jardunaldiDataPartidu" <= $4 order by "dataPartidu" desc',[id, idDenboraldia, jardunaldia, jardunaldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT  to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') AS "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
              for(var i in rowsd ){
                if(req.session.jardunaldia == rowsd[i].jardunaldiDataPartidu){
                    jardunaldiDataPartidu = rowsd[i].jardunaldiDataPartidu;
                    rowsd[i].aukeratua = true;
                  }
                  else
                    rowsd[i].aukeratua = false;
                }

//postgres            connection.query('SELECT idDenboraldia, deskribapenaDenb, jardunaldiaIkusgai FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
            req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb", "jardunaldiaIkusgai" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
          
             if(err)
                console.log("Error Selecting : %s ",err );
             rowsdenb = wrows.rows;     //postgres
             for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    idDenboraldia = rowsdenb[i].idDenboraldia;
                    deskribapenaDenb = rowsdenb[i].deskribapenaDenb;
                    jardunaldiaIkusgai = rowsdenb[i].jardunaldiaIkusgai;
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
              }

//postgres             connection.query('SELECT * FROM taldeak, mailak  where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by zenbakiMaila desc, izenaTalde asc',[id, idDenboraldia],function(err,rowstalde) {
             req.connection.query('SELECT * FROM taldeak, mailak  where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "zenbakiMaila" desc, "izenaTalde" asc',[id, idDenboraldia],function(err,wrows) {
          
              if(err)
                 console.log("Error Selecting : %s ",err );
              rowstalde = wrows.rows;     //postgres
/*              for(var i in rowstalde ){
                if(idTaldeak == rowstalde[i].idTaldeak){
                    idTaldeak = rowstalde[i].idTaldeak;
                    rowstalde[i].aukeratua = true;
                  }
                  else
                    rowstalde[i].aukeratua = false;
                }
*/
              for (var i in rows){
                rows[i].admin = admin;
                if (rows[i].jardunaldiDataPartidu <= jardunaldiaIkusgai  || admin){
                    rows[i].jardunaldiaIkusgai = true;
                    rows[i].egunaTexto = egunatextobihurtu(rows[i].dataPartidu);
                }else{
                    rows[i].jardunaldiaIkusgai = false;
                }
              }



          res.render('ekitaldiak.handlebars',{title: "Ekitaldiak", data:rows, denboraldiak:rowsdenb, jardunaldiak:rowsd, taldeak:rowstalde, menuadmin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        });
             });
          });                  
      });   
//postgresConnect  });
};

exports.ekitaldiakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.session.admin = 0;
  req.session.idTaldeak = 0;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where idPartiduak=idPartiduakEkitaldiak and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by dataPartidu desc',[id, idDenboraldia],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartiduF" FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where "idPartiduak"="idPartiduakEkitaldiak" and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "dataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT  to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') AS "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
          for (var i in rows){
                rows[i].egunaTexto = egunatextobihurtu(rows[i].dataPartidu);
          }

          res.render('ekitaldiakadmin.handlebars',{title: "Partiduak", data:rows, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,partaidea: req.session.partaidea});
        });                   
      });   
//postgresConnect  });
};

exports.jardunaldikoekitaldiakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var jardunaldia = req.params.jardunaldia;
      jardunaldia = jardunaldia.substring(0,10);   //postgres
  console.log("Jardunaldia:" + jardunaldia);
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by dataPartidu desc ',[id, jardunaldia, jardunaldia],function(err,rows) {
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where idPartiduak=idPartiduakEkitaldiak and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by herriaLeku, dataPartidu, zenbakiLeku, orduaPartidu, zenbakiMaila, izenaTalde asc',[id, jardunaldia, jardunaldia],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where "idPartiduak"="idPartiduakEkitaldiak" and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "jardunaldiDataPartidu" >= $1 and "jardunaldiDataPartidu" <= $3 order by "herriaLeku", "dataPartidu", "zenbakiLeku", "orduaPartidu", "zenbakiMaila", "izenaTalde" asc',[id, jardunaldia, jardunaldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
        req.connection.query('SELECT DISTINCT  to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') AS "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[id, idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
          for (var i in rows){
                rows[i].egunaTexto = egunatextobihurtu(rows[i].dataPartidu);
          }

          res.render('ekitaldiakadmin.handlebars',{title: "Ekitaldiak", data:rows, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
        });                   
      });   
//postgresConnect  });
};

exports.ekitaldiakpartidu = function(req, res){

  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idPartiduak = req.params.idPartiduak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM ekitaldiak WHERE idElkarteakEkitaldiak = ? and idPartiduakEkitaldiak = ?',[id,idPartiduak],function(err,rowse)
    req.connection.query('SELECT * FROM ekitaldiak WHERE "idElkarteakEkitaldiak" = $1 and "idPartiduakEkitaldiak" = $2',[id,idPartiduak],function(err,wrows)
    {
      if(err)
            console.log("Error Selecting : %s ",err );
      rowse = wrows.rows;     //postgres
      if (rowse.length != 0)
          res.redirect('/admin/ekitaldiakeditatu/'+ rowse[0].idEkitaldiak);
      else 
       {    
//postgres         connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu,DATE_FORMAT(jardunaldiDataPartidu,"%Y/%m/%d") AS jardunaldiDataPartidu FROM partiduak, lekuak, taldeak, mailak WHERE idLekuakPartidu=idLekuak and idTaldeak=idTaldeakPartidu and idMailak=idMailaTalde and idElkarteakPartidu = ? and idPartiduak = ?',[id,idPartiduak],function(err,rows)
         req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu", to_char("jardunaldiDataPartidu ", \'YYYY-MM-DD\') AS "jardunaldiDataPartidu" FROM partiduak, lekuak, taldeak, mailak WHERE "idLekuakPartidu"="idLekuak" and "idTaldeak"="idTaldeakPartidu" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idPartiduak" = $2',[id,idPartiduak],function(err,wrows)
         {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            res.render('ekitaldiaksortu.handlebars', {title : 'KirolElkarteak-Ekitaldiak gehitu', data:rows,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,  atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
           
          });
       } 
    });
//postgresConnect  }); 
};

exports.ekitaldiakgehitu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM taldeak,mailak where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by idMailaTalde asc',[id, idDenboraldia],function(err,rowst) {
     req.connection.query('SELECT * FROM taldeak,mailak where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "idMailaTalde" asc',[id, idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rowst = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM lekuak where idElkarteakLeku = ? order by zenbakiLeku asc',[id],function(err,rowsl) {
        req.connection.query('SELECT * FROM lekuak where "idElkarteakLeku" = $1 order by "zenbakiLeku" asc',[id],function(err,wrows) {
            if(err)
            console.log("Error Selecting : %s ",err );
            rowsl = wrows.rows;     //postgres
            res.render('ekitaldiaksortu.handlebars', {title : 'KirolElkarteak-Ekitaldiak gehitu', taldeak:rowst, lekuak:rowsl,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,  atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        }); 
      });  
           
//postgresConnect  });
};

exports.ekitaldiaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var now= new Date();

    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            idElkarteakEkitaldiak    : id,
            idPartiduakEkitaldiak   : input.idPartiduak,
            bazkideeguna: input.bazkideeguna,
            bazkideordua : input.bazkideordua,
            noizarteeguna: input.noizarteeguna,
            noizarteordua: input.noizarteordua,
            zenbatentzat: input.zenbatentzat,
            bakoitzak: input.bakoitzak,
            eserlekuak: input.eserlekuak,
            harmailak: input.harmailak,
            komentarioa: input.komentarioa
        };
//postgres        var query = req.connection.query("INSERT INTO ekitaldiak set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO ekitaldiak ("idElkarteakEkitaldiak","idPartiduakEkitaldiak","bazkideeguna","bazkideordua","noizarteeguna","noizarteordua","zenbatentzat","bakoitzak","eserlekuak","harmailak","komentarioa") VALUES ($1,$2,$3,$4,$5)',[id,input.idPartiduakEkitaldiak,input.bazkideeguna,input.bazkideordua,input.noizarteeguna,input.noizarteordua,input.zenbatentzat,input.bakoitzak,input.eserlekuak,input.harmailak,input.komentarioa], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
         if (req.session.arduraduna){
            res.redirect('/ekitaldiak');
         }else{
            res.redirect('/admin/ekitaldiak');
         }
        }); 
    
//postgresConnect    });
};

exports.ekitaldiakezabatu = function(req,res){

     var id = req.session.idKirolElkarteak;
     var idEkitaldiak = req.params.idEkitaldiak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres         connection.query("DELETE FROM ekitaldiak WHERE idElkarteakEkitaldiak = ? and idEkitaldiak = ?",[id,idEkitaldiak], function(err, rows)
        req.connection.query('DELETE FROM ekitaldiak WHERE "idElkarteakEkitaldiak" = $1 and "idEkitaldiak" = $2',[id,idEkitaldiak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );

             if (req.session.admin){
                res.redirect('/admin/ekitaldiaktaldeka/'+ req.session.idTaldeak);
             }else{
               res.redirect('/admin/ekitaldiak');
             }  
        });
        
//postgresConnect     });
};

exports.ekitaldiakeditatu = function(req, res){

  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idEkitaldiak = req.params.idEkitaldiak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
       
//        connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu,DATE_FORMAT(jardunaldiDataPartidu,"%Y/%m/%d") AS jardunaldiDataPartidu FROM partiduak WHERE idElkarteakPartidu = ? and idPartiduak = ?',[id,idPartiduak],function(err,rows)
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where idPartiduak=idPartiduakEkitaldiak and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakEkitaldiak = ? and idEkitaldiak = ? order by dataPartidu desc',[id, idEkitaldiak],function(err,rows) 
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where "idPartiduak"="idPartiduakEkitaldiak" and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakEkitaldiak" = $1 and "idEkitaldiak" = $2 order by "dataPartidu" desc',[id, idEkitaldiak],function(err,wrows) 
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            res.render('ekitaldiakeditatu.handlebars', {page_title:"Ekitaldiak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
              
         });
//postgresConnect   }); 
};

exports.ekitaldiakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idEkitaldiak = req.params.idEkitaldiak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            bazkideeguna: input.bazkideeguna,
            bazkideordua : input.bazkideordua,
            noizarteeguna: input.noizarteeguna,
            noizarteordua: input.noizarteordua,
            zenbatentzat: input.zenbatentzat,
            bakoitzak: input.bakoitzak,
            eserlekuak: input.eserlekuak,
            harmailak: input.harmailak,
            komentarioa: input.komentarioa
        };
//postgres        connection.query("UPDATE ekitaldiak set ? WHERE idElkarteakEkitaldiak = ? and idEkitaldiak = ? ",[data,id,idEkitaldiak], function(err, rows)
        req.connection.query('UPDATE ekitaldiak set bazkideeguna=$1,bazkideordua=$2,noizarteeguna=$3,noizarteordua=$4,zenbatentzat=$5,bakoitzak=$6,eserlekuak=$7,harmailak=$8,komentarioa=$9 WHERE "idElkarteakEkitaldiak" = $10 and "idEkitaldiak" = $11 ',[input.bazkideeguna,input.bazkideordua,input.noizarteeguna,input.noizarteordua,input.zenbatentzat,input.bakoitzak,input.eserlekuak,input.harmailak,input.komentarioa,id,idEkitaldiak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );

          if (req.session.idTaldeak){
                res.redirect('/admin/ekitaldiaktaldeka/'+ req.session.idTaldeak);
          }
          else
           if (req.session.admin){ //Administratzaile moduan badago ordutegiak ikustean, editatu ondoren partidu ordutegira bidali
               res.redirect('/admin/partiduordutegiak/'+ req.session.idDenboraldia + '/' + req.session.jardunaldia);
           }
           else
            if (req.session.jardunaldia){ 
//                res.redirect('/admin/jardunaldikoekitaldiak/' + req.session.jardunaldia);
                res.redirect('/admin/ekitaldiak');
            }
            else //Partiduak ataletik editatzean partiduak, partiduak orrira bidali 
                res.redirect('/admin/ekitaldiak');
        });
    
//postgresConnect    });
};

exports.harmailakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idEkitaldiak = req.params.idEkitaldiak;
  var admin=(req.path.slice(0,7) == "/admin/");
  req.session.admin = 0;
  req.session.idTaldeak = 0;
//  var mapa;
//  var ilarak = [], burua = []; //multzoak
  var ilara = {}; //multzoa
  var eserlekuak = [];
  var fila, eserleku, kolore, f = 0, h = 0, aukerabaiez, iilara, jeserleku;
  var izenemate1 = 0, izenemate2 = 0, izenemate3 = 0, izenemate4 = 0, izenematea = {}, izenemateak = [];

  var now= new Date();   // now : UTC +2ordu heroku config:add TZ="Europe/Madrid" 
/*       
    if (process.env.NODE_ENV == 'production'){
      now.setUTCHours(now.getHours());
      now.setUTCMinutes(now.getMinutes()); 
    }
*/    
  var tope = 1, zenbat = 0;
  var aditestua = "Aukeratu ilara eta eserleku berdeak harmailan.", bazkidezenbakiabai = "", ertzakEz = 0;
  var vHasiera,aHasiera,aHasieraOrdua,hasiera,vBukaera,aBukaera,bukaera;


  ilarak = [];
  burua = []; 

//debugger;

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where idPartiduak=idPartiduakEkitaldiak and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idEkitaldiak = ? order by dataPartidu desc',[id, idEkitaldiak],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where "idPartiduak"="idPartiduakEkitaldiak" and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idEkitaldiak" = $2 order by "dataPartidu" desc',[id, idEkitaldiak],function(err,wrows) {
      if(err)
           console.log("Error Selecting : %s ",err );
      rows = wrows.rows;     //postgres
//        console.log ("rows : " +JSON.stringify(rows));
      if(rows.length != 0) {

        if (rows[0].bakoitzak != 0)
        {
            izenemate1 = 1;
            if (rows[0].bakoitzak >= 2)
                       izenemate2 = 1;
            if (rows[0].bakoitzak >= 3)
                       izenemate3 = 1;
            if (rows[0].bakoitzak >= 4)
                       izenemate4 = 1;
        }

          vHasiera = new Date();
          hasiera = rows[0].bazkideeguna;
          aHasiera = hasiera.split("-");
          vHasiera.setDate(aHasiera[2]);
          vHasiera.setMonth(aHasiera[1] - 1);
          vHasiera.setYear(aHasiera[0]);
          aHasieraOrdua = rows[0].bazkideordua.split(":");
          vHasiera.setHours(aHasieraOrdua[0],aHasieraOrdua[1],0);

//          vHasiera.set
          vBukaera = new Date();
          bukaera = rows[0].noizarteeguna;
          aBukaera = bukaera.split("-");
          vBukaera.setDate(aBukaera[2]);
          vBukaera.setMonth(aBukaera[1] - 1);
          vBukaera.setYear(aBukaera[0]);  
          aBukaeraOrdua = rows[0].noizarteordua.split(":");
          vBukaera.setHours(aBukaeraOrdua[0],aBukaeraOrdua[1],0);

//        console.log ("egunak : " + vHasiera +" " + vBukaera +" " + now);

        if(vHasiera > now) {
          aditestua = "Bazkideak apuntatzeko epea. Aukeratu ilara eta eserleku berdeak harmailan. ";
          bazkidezenbakiabai = 'required';
          ertzakEz = 1;
        }

        else if(vBukaera < now) {
          if(req.xhr) return res.json({ error: 'Invalid bukaera' });
            res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: rows[0].noizarteeguna + ' - ' + rows[0].noizarteordua +  ' bukatu zen izen-ematea.',
          };
          aditestua = "Apuntatzeko epea bukatuta!";
          izenemate1 = 0;
        }
/*
        if (rows[0].harmailak)
            mapa = mapasortu(rows[0].harmailak);
        else
            mapa = [];
*/
        mapa = mapasortu(rows[0].harmailak, ertzakEz);

        if (rows[0].eserlekuak != 0)
        {  
            mapa = mapaegokitu(mapa, rows[0].eserlekuak);
        }
//postgres        connection.query('SELECT * FROM ikusleak WHERE idElkarteakIkusle = ? and idEkitaldiakIkusle = ?',[id,idEkitaldiak],function(err,rowsi)
        req.connection.query('SELECT * FROM ikusleak WHERE "idElkarteakIkusle" = $1 and "idEkitaldiakIkusle" = $2?',[id,idEkitaldiak],function(err,wrows)
        {
          if(err)
              console.log("Error Selecting : %s ",err );
          rowsi = wrows.rows;     //postgres
//          console.log ("rowsi : " +JSON.stringify(rowsi));

          for (var k in rowsi){
//                      console.log ("rowsi : " + k +"-"+JSON.stringify(rowsi[k]);
//                rows[i].admin = admin;
            iilara = parseInt(rowsi[k].ilara);
            jeserleku = parseInt(rowsi[k].eserlekua1);
            if (iilara != 0 && jeserleku != 0)
            {
                if (rowsi[k].balidatuta == 0)
                         aukerabaiez = 1000;      // balidatu gabe
                else  
                         aukerabaiez = 2000;      // balidatuta

                if (mapa[iilara][jeserleku] >= 1 && mapa[iilara][jeserleku] <= 999)   // eserleku hautagai
                     mapa[iilara][jeserleku] += aukerabaiez;                  // eserleku aukerabaiez
                else if (admin)
                   aditestua = "Ilara-eserleku1 gaizki: "+ iilara +"-"+jeserleku +" : "+rowsi[k].izenabizenak1;

                if (rowsi[k].eserlekua2 != 0)                  // 2.eserleku
                {
                    jeserleku = parseInt(rowsi[k].eserlekua2);
                    if (mapa[iilara][jeserleku] >= 1 && mapa[iilara][jeserleku] <= 999)   // eserleku hautagai
                         mapa[iilara][jeserleku] += aukerabaiez;
                    else if (admin)
                          aditestua = "Ilara-eserleku2 gaizki: "+ iilara +"-"+jeserleku +" : "+rowsi[k].izenabizenak2;
                }
                if (rowsi[k].eserlekua3 != 0)                  // 3.eserleku
                {
                    jeserleku = parseInt(rowsi[k].eserlekua3);
                    if (mapa[iilara][jeserleku] >= 1 && mapa[iilara][jeserleku] <= 999)   // eserleku hautagai
                         mapa[iilara][jeserleku] += aukerabaiez;
                    else if (admin)
                          aditestua = "Ilara-eserleku3 gaizki: "+ iilara +"-"+jeserleku +" : "+rowsi[k].izenabizenak3;
                }
                if (rowsi[k].eserlekua4 != 0)                  // 4.eserleku
                {
                    jeserleku = parseInt(rowsi[k].eserlekua4);
                    if (mapa[iilara][jeserleku] >= 1 && mapa[iilara][jeserleku] <= 999)   // eserleku hautagai
                         mapa[iilara][jeserleku] += aukerabaiez;
                    else if (admin)
                          aditestua = "Ilara-eserleku4 gaizki: "+ iilara +"-"+jeserleku +" : "+rowsi[k].izenabizenak4;
                }
            }
          }

//  console.log ("Mapa : " + mapa);

//          for (var i in mapa){                        // Behetik gora
          for (var i = 8; i >= 0; i--) {                  // Goitik behera 
             for (var j = 0; j < 77; j++) {
                aukeragai = 0;
                if (mapa[i][j] == 0)
                {
                     if (i == 0)
                     {   eserleku = "#";
                         kolore = "#FFFFFF";     // txuriz   (0,0)
                     }
                     else
                     {   eserleku = "X";
                         kolore = "#FF0000";     // gorriz   ezin hautatuak
                     }
                }
                else
                  if (mapa[i][j] == "_" || mapa[i][j] == "-")   // aldagela sarrera edo eskailera
                  {
                      eserleku = mapa[i][j];    
                      kolore = "#FFFFFF";         // txuriz 
                  }
                  else  
                  {
                     if (mapa[i][j] > 1000)   // eserleku aukeratuak
                     {
                         eserleku = "_";
                         zenbat += 1;
                     }      
                     else
                         eserleku = mapa[i][j];
                     if (i == 0 || j == 0)
                         kolore = "#FF00FF";      // burua   morez
                     else 
                       if (mapa[i][j] > 2000)   // eserleku balidatuak
                             kolore = "#3364FF";     // urdinez    ezin hautatu
                       else 
                         if (mapa[i][j] > 1000)   // eserleku balidatu gabeak
                             kolore = "yellow";     // laranjaz    erdi hautatuak  "#FFBB33"
                         else 
                         {
                             kolore = "#00F000";     // berdez    hautatzeko
                             aukeragai = 1;
                             tope = 0;                // tokia dago
                         }
                  }
                
//             if (i == 1)
//                  console.log ("eserleku: " + i + " - " + j + " - "+ eserleku);

                eserlekuak[h] = { 
                  ilara : i,
                  eserleku : eserleku,
                  kolore : kolore, 
                  aukeragai : aukeragai,
                  admin: admin
                };

                h++;

                if (j == 10 || j == 29 || j == 48 || j == 66)   // eskailerak sartu
                {
                  eserlekuak[h] = { 
                    ilara : i,
                    eserleku : "-",
                    kolore : "#FFFFFF", 
                    aukeragai : aukeragai,
                    admin: admin
                  };
                  h++;
                  eserlekuak[h] = eserlekuak[h-1] //  bakoitzean bi
                  h++;
                }

             }
//                          console.log ("Eserlekuak : " + i + " - "+JSON.stringify(eserlekuak));
             ilara.eserlekuak = eserlekuak;

             if (i == 0)
                burua[i] = ilara;
             else
             { 
//                ilarak[i] = ilara;       // Behetik gora
                ilarak[f] = ilara;          // Goitik behera
                f++;
             }
             eserlekuak = [];
             ilara = {};
             h = 0;
//            console.log ("Ilara : " + i + " - "+JSON.stringify(ilara));
          }
//          console.log ("zenbat : " + zenbat);
          if(rows[0].zenbatentzat <= zenbat)  // ekitaldiko topea pasata
               tope = 1;
          if(tope == 1) {
           if(req.xhr) return res.json({ error: 'Invalid beteta' });
              res.locals.flash = {
                 type: 'danger',
                 intro: 'Adi!',
                 message: 'Ikusle kopurua beteta. Itxaron zerrendan geratu nahi baduzu, ondorengo datuak bete mesedez.',
              };
              aditestua = "Ikusle kopurua beteta! Itxaron zerrendan geratu nahi baduzu, ondorengo datuak bete mesedez.";
          }
          rows[0].izenemate1 = izenemate1;
          rows[0].izenemate2 = izenemate2;
          rows[0].izenemate3 = izenemate3; 
          rows[0].izenemate4 = izenemate4;
          rows[0].egunaTexto = egunatextobihurtu(rows[0].dataPartidu);
          rows[0].bazkidezenbakiabai = bazkidezenbakiabai;
          rows[0].admin = admin;
          rows[0].tope = tope;
          rows[0].aditestua = aditestua;

//                  console.log ("Ilarak : " +JSON.stringify(ilarak));
   //    }
//          res.render('harmailak.handlebars',{title: "Harmailak", mapa:mapa, data:rows, burua:burua, ilarak:ilarak, izenemateak:izenemateak, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,partaidea: req.session.partaidea, menuadmin: admin});
          res.render('harmailak.handlebars',{title: "Harmailak", data:rows, burua:burua, ilarak:ilarak, izenemateak:izenemateak, tope: tope, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,partaidea: req.session.partaidea, menuadmin: admin});

        });                   
     }
   });   
//postgresConnect  });
};

function mapasortu (harmaila, ertzakEz){

  var mapa= new Array(9);
  var mapai;
  for (var i = 0; i < 9; i++) {
      mapa[i] = new Array(85);
  }
  for (var i in mapa){
    eserlekuzenbakia = 0;
    for (var j = 0; j < 85; j++) {
//      console.log ("j : " + j);
      if (j == 0)
        mapa[i][j] = i;
      else
//        if (((i>=1 && i<=2) || (i>=5 && i<=8)) && (j>=35 && j<=40))  // aldagela sarrera  // Behetik gora
        if (((i>=7 && i<=8) || (i>=1 && i<=4)) && (j>=35 && j<=40))  // aldagela sarrera  // Goitik behera
            mapa[i][j] = "_";
        else
          if (ertzakEz == 1 && i !=0 && (j < 11 || j > 66))  // ertzakEz erdikoa bete arte
               mapa[i][j] = "0";
          else
               mapa[i][j] = j;
    }
  }
//  console.log ("Mapa : " + mapa);

  return mapa;
}

function mapaegokitu (mapa , eserlekuak){
  var mapai, k, n, jauzi;

  for (var i = 1; i < 9; i++){
    k = 1;

    
//    if (i % 2)  {                     // ilara bakoiti edo bikoiti
    if ((i + 1) % 2) {                      // ilara bakoiti edo bikoiti
          k += eserlekuak;   
          jauzi = 2 * eserlekuak;
    } 

    if (i == 1)                                // 1.lerroa eta  
          jauzi = 1;                         // ezin dira aukeratu   banaka pasatzeko   

    for (var j = k; j < 85; j = j + jauzi) {
      if(mapa[i][j] != "_")   // aldagela sarrera ez egokitu
      {

        for (var m = 0; m < eserlekuak; m++) {
            n = j + m;
            mapa[i][n] = 0;   // ezin dira aukeratu   saltoka 1 edo bi edo
        }
      }
    }
//    console.log ("mapaegokitua : " + i + " - " + mapa[i]);
  }
//    console.log ("Mapaegokitua : " + mapa);
  return mapa;
}

function eserlekuagune (eserleku){
//                if (j == 10 || j == 29 || j == 48 || j == 66)   // eskailerak sartu
  var gunea;
  if (eserleku > 66)
        gunea = "A";
  else
    if (eserleku > 48)
          gunea = "B";
    else
        if (eserleku > 29)
              gunea = "C";
        else
          if (eserleku > 10)
                gunea = "D";
          else
                gunea = "E";

  return gunea;
}

exports.ikusleakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idEkitaldiak = req.params.idEkitaldiak;
  var admin=(req.path.slice(0,7) == "/admin/");
  var jardunaldiaIkusgai;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
       
/*
        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[id, idDenboraldia],function(err,rowsd) {
          
          if(err)
           console.log("Error Selecting : %s ",err );

              for(var i in rowsd ){
                if(req.session.jardunaldia == rowsd[i].jardunaldiDataPartidu){
                    jardunaldiDataPartidu = rowsd[i].jardunaldiDataPartidu;
                    rowsd[i].aukeratua = true;
                  }
                  else
                    rowsd[i].aukeratua = false;
                }

            connection.query('SELECT idDenboraldia, deskribapenaDenb, jardunaldiaIkusgai FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
          
             if(err)
                console.log("Error Selecting : %s ",err );

             for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    idDenboraldia = rowsdenb[i].idDenboraldia;
                    deskribapenaDenb = rowsdenb[i].deskribapenaDenb;
                    jardunaldiaIkusgai = rowsdenb[i].jardunaldiaIkusgai;
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
              }

             connection.query('SELECT * FROM taldeak, mailak  where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by zenbakiMaila desc, izenaTalde asc',[id, idDenboraldia],function(err,rowstalde) {
          
              if(err)
                 console.log("Error Selecting : %s ",err );
*/
/*              for(var i in rowstalde ){
                if(idTaldeak == rowstalde[i].idTaldeak){
                    idTaldeak = rowstalde[i].idTaldeak;
                    rowstalde[i].aukeratua = true;
                  }
                  else
                    rowstalde[i].aukeratua = false;
                }
*/
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where idPartiduak=idPartiduakEkitaldiak and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakEkitaldiak = ? and idEkitaldiak = ? ',[id, idEkitaldiak],function(err,rowse) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where "idPartiduak"="idPartiduakEkitaldiak" and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakEkitaldiak" = $1 and "idEkitaldiak" = $2 ',[id, idEkitaldiak],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM ikusleak WHERE balidatuta != 0 and idElkarteakIkusle = ? and idEkitaldiakIkusle = ? order by  eserlekua1, ilara, sortuaIkusle, izenabizenak1, bazkidezenbakia',[id,idEkitaldiak],function(err,rows)
        req.connection.query('SELECT * FROM ikusleak WHERE "balidatuta" != 0 and "idElkarteakIkusle" = $1 and "idEkitaldiakIkusle" = $2 order by  "eserlekua1", "ilara", "sortuaIkusle", "izenabizenak1", "bazkidezenbakia"',[id,idEkitaldiak],function(err,wrows)
        {          
          if(err)
           console.log("Error Selecting : %s ",err );
          rows = wrows.rows;     //postgres
          for (var i in rows){
                rows[i].egunaTexto = egunatextobihurtu(rows[i].dataPartidu);
                if (rows[i].eserlekua2 != 0)
                {
                     gunea = eserlekuagune(rows[i].eserlekua2); 
                     sarrera2 = rows[i].ilara + "-" + rows[i].eserlekua2 + " : " + gunea;
                }
                else sarrera2 = " ";
                if (rows[i].eserlekua3 != 0) 
                {
                     gunea = eserlekuagune(rows[i].eserlekua2); 
                     sarrera3 = rows[i].ilara + "-" + rows[i].eserlekua3 + " : " + gunea;
                }
                else sarrera3 = " ";
                if (rows[i].eserlekua4 != 0) 
                {
                     gunea = eserlekuagune(rows[i].eserlekua2); 
                     sarrera4 = rows[i].ilara + "-" + rows[i].eserlekua4 + " : " + gunea;
                }
                else sarrera4 = " ";

                if (rows[i].eserlekua1 != 0)
                {
                     gunea = eserlekuagune(rows[i].eserlekua1); 
                }
                else gunea = " ";

                rows[i].gunea = gunea;
                rows[i].sarrera2 = sarrera2;
                rows[i].sarrera3 = sarrera3;
                rows[i].sarrera4 = sarrera4;

          }

          res.render('ikusleak.handlebars',{title: "Ikusleak", data:rows, burua:rowse, menuadmin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        });
     });   
//             });
//          });                  
//      });   
//postgresConnect  });
};

exports.ikusleakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idEkitaldiak = req.params.idEkitaldiak;
  var gunea, sarrera2, sarrera3, sarrera4;
//  req.session.admin = 0;
//  req.session.idTaldeak = 0;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where idPartiduak=idPartiduakEkitaldiak and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakEkitaldiak = ? and idDenboraldiaPartidu = ? and idEkitaldiak = ? ',[id, idDenboraldia, idEkitaldiak],function(err,rowse) {
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM ekitaldiak, partiduak, mailak, taldeak, lekuak where "idPartiduak"="idPartiduakEkitaldiak" and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakEkitaldiak" = $1 and "idDenboraldiaPartidu" = $2 and "idEkitaldiak" = $3 ',[id, idDenboraldia, idEkitaldiak],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rowse = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM ikusleak WHERE idElkarteakIkusle = ? and idEkitaldiakIkusle = ? order by ilara, eserlekua1 , sortuaIkusle, izenabizenak1, bazkidezenbakia',[id,idEkitaldiak],function(err,rows)
        req.connection.query('SELECT * FROM ikusleak WHERE "idElkarteakIkusle" = $1 and "idEkitaldiakIkusle" = $2 order by ilara, eserlekua1 , sortuaIkusle, izenabizenak1, bazkidezenbakia',[id,idEkitaldiak],function(err,wrows)
        {          
          if(err)
           console.log("Error Selecting : %s ",err );
          rows = wrows.rows;     //postgres
          for (var i in rows){
                rows[i].egunaTexto = egunatextobihurtu(rows[i].dataPartidu);
                if (rows[i].eserlekua2 != 0)
                {
                     gunea = eserlekuagune(rows[i].eserlekua2); 
                     sarrera2 = rows[i].ilara + "-" + rows[i].eserlekua2 + " * " + gunea + " : " + rows[i].izenabizenak2 + " + " + rows[i].bazkidezenbakia2;
                }
                else sarrera2 = " ";
                if (rows[i].eserlekua3 != 0) 
                {
                     gunea = eserlekuagune(rows[i].eserlekua2); 
                     sarrera3 = rows[i].ilara + "-" + rows[i].eserlekua3 + " * " + gunea + " : " + rows[i].izenabizenak3 + " + " + rows[i].bazkidezenbakia3;
                }
                else sarrera3 = " ";
                if (rows[i].eserlekua4 != 0) 
                {
                     gunea = eserlekuagune(rows[i].eserlekua2); 
                     sarrera4 = rows[i].ilara + "-" + rows[i].eserlekua4 + " * " + gunea + " : " + rows[i].izenabizenak4 + " + " + rows[i].bazkidezenbakia4;
                }
                else sarrera4 = " ";

                if (rows[i].eserlekua1 != 0)
                {
                     gunea = eserlekuagune(rows[i].eserlekua1); 
                }
                else gunea = " ";

                rows[i].gunea = gunea;
                rows[i].sarrera2 = sarrera2;
                rows[i].sarrera3 = sarrera3;
                rows[i].sarrera4 = sarrera4;

                rows[i].ikusleZenbakia = rows[i].idIkusleak * 3456789;
                rows[i].ekitaldiZenbakia = rows[i].idEkitaldiakIkusle * 9876543;
          }

          res.render('ikusleakadmin.handlebars',{title: "Ikuslea", burua: rowse, data:rows,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,partaidea: req.session.partaidea});
        });                   
      });   
//postgresConnect  });
};

exports.ikusleakekitaldi = function(req, res){

  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idEkitaldiak = req.params.idEkitaldiak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM ekitaldiak WHERE idElkarteakEkitaldiak = ? and idEkitaldiak = ?',[id,idEkitaldiak],function(err,rowse)
    req.connection.query('SELECT * FROM ekitaldiak WHERE "idElkarteakEkitaldiak" = $1 and "idEkitaldiak" = $2',[id,idEkitaldiak],function(err,wrows)
    {
      if(err)
            console.log("Error Selecting : %s ",err );
      rowse = wrows.rows;     //postgres
      if (rowse.length != 0)
          res.redirect('/admin/ekitaldiakeditatu/'+ rowse[0].idEkitaldiak);
      else 
       {    
//postgres         connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu,DATE_FORMAT(jardunaldiDataPartidu,"%Y/%m/%d") AS jardunaldiDataPartidu FROM partiduak, lekuak, taldeak, mailak WHERE idLekuakPartidu=idLekuak and idTaldeak=idTaldeakPartidu and idMailak=idMailaTalde and idElkarteakPartidu = ? and idPartiduak = ?',[id,idPartiduak],function(err,rows)
         req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu", to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\')AS "jardunaldiDataPartidu" FROM partiduak, lekuak, taldeak, mailak WHERE "idLekuakPartidu"="idLekuak" and "idTaldeak"="idTaldeakPartidu" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "idPartiduak" = $2',[id,idPartiduak],function(err,wrows)
         {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            res.render('ikusleakadmin.handlebars', {title : 'KirolElkarteak-Ikusleak', data:rows,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,  atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
           
          });
       } 
    });
//postgresConnect  }); 
};

exports.ikusleakgehitu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM taldeak,mailak where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by idMailaTalde asc',[id, idDenboraldia],function(err,rowst) {
     req.connection.query('SELECT * FROM taldeak,mailak where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "idMailaTalde" asc',[id, idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rowst = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM lekuak where idElkarteakLeku = ? order by zenbakiLeku asc',[id],function(err,rowsl) {
        req.connection.query('SELECT * FROM lekuak where "idElkarteakLeku" = $1 order by "zenbakiLeku" asc',[id],function(err,wrows) {
            if(err)
            console.log("Error Selecting : %s ",err );
            rowsl = wrows.rows;     //postgres
            res.render('ikusleaksortu.handlebars', {title : 'KirolElkarteak-Ekitaldiak gehitu', taldeak:rowst, lekuak:rowsl,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,  atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        }); 
      });  
           
//postgresConnect  });
};

exports.ikusleaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var idEkitaldiak = req.params.idEkitaldiak;
    var admin=(req.path.slice(0,7) == "/admin/");
    var now= new Date();
    var ilara = 0, eserlekua1 = 0, eserlekua2 = 0, eserlekua3 = 0, eserlekua4 = 0;
    var izenemate1 = 0, izenemate2 = 0, izenemate3 = 0, izenemate4 = 0;
    var datak = [], erroremezua = "";
    var aditestua = "";
    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

//console.log ("Mapaegokitua : " + mapa);

    res.locals.flash = null;

    //Errore kontrolak
    if(!req.body.nanzenbakia.match(VALID_DNI_REGEX)) {
      if(req.xhr) return res.json({ error: 'Invalid DNI' });
        res.locals.flash = {
          type: 'danger',
          intro: 'Adi!',
          message: 'N.A.N.-a ez da zuzena',
        };
        erroremezua += "N.A.N.-a ez da zuzena ";
    }
    if(!req.body.telefonoa.match(VALID_TEL_REGEX)) {
      if(req.xhr) return res.json({ error: 'Invalid telefono' });
        res.locals.flash = {
          type: 'danger',
          intro: 'Adi!',
          message: 'Telefonoa ez da zuzena',
        };
        erroremezua += "Telefonoa ez da zuzena ";
    }
    if(!req.body.emaila.match(VALID_EMAIL_REGEX)) {
      if(req.xhr) return res.json({ error: 'Invalid mail' });
        res.locals.flash = {
          type: 'danger',
          intro: 'Adi!',
          message: 'Emaila ez da zuzena',
        };
        erroremezua += "Emaila ez da zuzena ";
    }
// eserleku zenbakien azterketa
    eserlekua1 = (parseInt(input.eserleku1));
    if (req.body.izenabizenak2 && req.body.izenabizenak2 != "" && req.body.izenabizenak2 != " ")
    {
        eserlekua2 = (parseInt(input.eserleku2));
        if (eserlekua1 > eserlekua2)
        {
            eserlekua1 = eserlekua2;
            eserlekua2 = (parseInt(input.eserleku1));
        }  
        if (req.body.izenabizenak4 && req.body.izenabizenak4 != "" && req.body.izenabizenak4 != " ")
        {
             eserlekua4 = eserlekua2;
             eserlekua2 = (eserlekua1 + 2);  //   - 1
             eserlekua3 = (eserlekua4 - 2);   //   + 1
        }
        else if (req.body.izenabizenak3 && req.body.izenabizenak3 != "" && req.body.izenabizenak3 != " ")
        {
             eserlekua3 = eserlekua2;
             eserlekua2 = (eserlekua3 - 2);    //    - 1
        }     
    }

    if ((eserlekua4 != 0 && (eserlekua2 + 2) != eserlekua3) ||
         (eserlekua3 != 0 && (eserlekua1 + 2) != eserlekua2) ||
          (eserlekua2 != 0 && (eserlekua1 + 2) != eserlekua2)) 
      erroremezua += "Eserleku zenbakiak ez daude ondo ";

    ilara = (parseInt(input.ilara));
//    console.log("Eserlekuak : " +ilara +"-"+eserlekua1+"-"+eserlekua2 +"-"+eserlekua3 +"-"+ eserlekua4 );

    if ((mapa[ilara][eserlekua1] < 1 || mapa[ilara][eserlekua1] > 999) ||
         (eserlekua2 != 0 && (mapa[ilara][eserlekua2] < 1 || mapa[ilara][eserlekua2] > 999)) ||
         (eserlekua3 != 0 && (mapa[ilara][eserlekua3] < 1 || mapa[ilara][eserlekua3] > 999)) ||
         (eserlekua4 != 0 && (mapa[ilara][eserlekua3] < 1 || mapa[ilara][eserlekua4] > 999)))
      erroremezua += "Eserlekuak ez daude libre ";
//    console.log("harmaila : " +mapa[ilara][eserlekua1] + mapa[ilara]);

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
//postgres      connection.query('SELECT * FROM ikusleak where idEkitaldiakIkusle = ? and (izenabizenak1 = ? or emaila = ? or nanzenbakia = ? or bazkidezenbakia = ?)',[idEkitaldiak, req.body.izenabizenak1, req.body.emaila, req.body.nanzenbakia, req.body.bazkidezenbakia],function(err,rows)  {
      req.connection.query('SELECT * FROM ikusleak where "idEkitaldiakIkusle" = $1 and (izenabizenak1 = $2 or emaila = $2 or nanzenbakia = $3 or bazkidezenbakia = $4)',[idEkitaldiak, req.body.izenabizenak1, req.body.emaila, req.body.nanzenbakia, req.body.bazkidezenbakia],function(err,wrows)  {

        if(err)
          console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
        if (rows.length != 0){
         var izenaberdin = 0, emailaberdin = 0, nanzenbakiaberdin = 0, bazkidezenbakiaberdin = 0; 
         for(var i in rows ){
           if(rows[i].izenabizenak1 == req.body.izenabizenak1){
                izenaberdin++;
            }
            if(rows[i].emaila == req.body.emaila){
                emailaberdin++;
            }
            if(rows[i].nanzenbakia == req.body.nanzenbakia){
                nanzenbakiaberdin++;
            }
            if(rows[i].bazkidezenbakia == req.body.bazkidezenbakia){
                bazkidezenbakiaberdin++;
            }
         } 
         if ( !admin && (izenaberdin >= 1 || emailaberdin >= 2 || nanzenbakiaberdin >= 1 || bazkidezenbakiaberdin >= 1))
         { 
          if (izenaberdin >= 1)
          {
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste izen-abizen bat sartu behar duzu! Dagoenekoz, izen-abizen hori erabilita dago eta.',
           };
           erroremezua += "Beste izen-abizen bat sartu behar duzu! ";
          }
          else if (emailaberdin >= 2) 
          {
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste email batekin izen-eman behar duzu! Dagoenekoz email horrekin 2 izen-emate sortuta daude eta. Email batekin 2 izen-emate bakarrik sor daiteke!',
           };
           erroremezua += "Beste email batekin izen-eman behar duzu ";
          }
          else if (nanzenbakiaberdin >= 1)
          {
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste N.A.N bat sartu behar duzu! Dagoenekoz, NAN zenbaki hori erabilita dago eta.',
           };
           erroremezua += "Beste N.A.N bat sartu behar duzu! ";
          }
          else 
          {
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste bazkide zenbakia behar duzu! Dagoenekoz, bazkide zenbaki hori erabilita dago eta.',
           };
           erroremezua += "Beste bazkide zenbakia behar duzu!  ";
          }

         }
        }    

// erroreak baldi badaude
    izenemate1 = 1;
    if (req.body.izenabizenak2 && req.body.izenabizenak2 != "" && req.body.izenabizenak2 != " ")
          izenemate2 = 1;
    if (req.body.izenabizenak3 && req.body.izenabizenak3 != "" && req.body.izenabizenak3 != " ")
                       izenemate3 = 1;
    if (req.body.izenabizenak4 && req.body.izenabizenak4 != "" && req.body.izenabizenak4 != " ")
                       izenemate4 = 1;
    req.body.izenemate1 = izenemate1;
    req.body.izenemate2 = izenemate2;
    req.body.izenemate3 = izenemate3; 
    req.body.izenemate4 = izenemate4;
    req.body.admin = admin;
    req.body.idEkitaldiak = idEkitaldiak;
    datak[0] = req.body;
// erroreak baldi badaude
//    if(res.locals.flash != null){
    if(erroremezua != ''){  
//Erroreak badaude "local.flash" aldagaian gordeak, itzuli balioak errorearekin
        res.locals.flash = {
          type: 'danger',
          intro: 'ADI ERROREAK DAUDE!',
          message: erroremezua,
        };
        aditestua = erroremezua;
        datak[0].aditestua = aditestua;
        return res.render('harmailak.handlebars',{title: "Harmailak", data:datak, burua:burua, ilarak:ilarak, aditestua: aditestua,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,partaidea: req.session.partaidea, menuadmin: admin});
    }
  
//        if (input.eserleku2 != "")
     
        var data = {
            
            idElkarteakIkusle    : id,
            idEkitaldiakIkusle   : idEkitaldiak,
//            idPartaideakIkusle   : idEkitaldiak,

            bazkidezenbakia: input.bazkidezenbakia,
            nanzenbakia : input.nanzenbakia,
            izenabizenak1: input.izenabizenak1,
            ilara: (parseInt(input.ilara)),
            eserlekua1: eserlekua1,
            telefonoa: input.telefonoa,
            emaila: input.emaila,
            berezitasunak: input.berezitasunak,
            izenabizenak2: input.izenabizenak2,
            eserlekua2: eserlekua2,
            bazkidezenbakia2: input.bazkidezenbakia2,
            nanzenbakia2 : input.nanzenbakia2,
            izenabizenak3: input.izenabizenak3,
            eserlekua3: eserlekua3,
            bazkidezenbakia3: input.bazkidezenbakia3,
            nanzenbakia3 : input.nanzenbakia3,
            izenabizenak4: input.izenabizenak4,
            eserlekua4: eserlekua4,
            bazkidezenbakia4: input.bazkidezenbakia4,
            nanzenbakia4 : input.nanzenbakia4,
            balidatuta    : "0",
            sortuaIkusle : now,
            aldatuaIkusle : now
        };

//         console.log ("data : " +JSON.stringify(data));

        datak[0] = data;
//postgres        var query = req.connection.query("INSERT INTO ikusleak set ? ",data, function(err, rowsi)  
        var query = req.connection.query('INSERT INTO ikusleak set ? ',data, function(err, rowsi)
        {
  
         if (err)
              console.log("Error inserting : %s ",err );



          if(input.tope == 1) {
                  if(req.xhr) return res.json({ error: 'Invalid beteta' });
                  res.locals.flash = {
                      type: 'danger',
                      intro: 'Adi!',
                      message: 'Ikusle kopurua beteta. Itxaron zerrendan sartu dugu zure eskaera',
                  };
                aditestua = "Ikusle kopurua beteta. Itxaron zerrendan sartu dugu zure eskaera, ekitaldia ikusteko aukerarik izanez gero, mezu bat jasoko duzue. Adi egon!";
          }
                


          if(res.locals.flash != null){
//                   var mailaizena;   
              var to = input.emaila;
              var subj = "Itxaron zerrendan " + data.izenabizenak1 +" sartua ";

              var body = "<p style='color:#FF0000'><b>"+data.izenabizenak1+"</b> izenean egindako eskaera itxaron zerrendan dago. </p>";
                  body += "<p style='color:#0000FF'> Aukerarik sortu ezkero, emaila baten bidez, adieraziko zaizue. Mila esker!</p> \n \n";
                  body += "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak zkeskubaloia.partidak@gmail.com -era bidali</h3>" ;

              emailService.send(to, subj, body);

              res.render('ikusleakitxaron.handlebars', {title: "Itxaron zerrendan", taldeizena:data.taldeizena, txapelketaizena:req.session.txapelketaizena, idtxapelketa: req.session.idtxapelketa, aditestua:aditestua, emaila:data.emaila, izenaard: data.izenaard, menuadmin: admin});

//                   res.render('kontaktua.handlebars', {title : 'Txaparrotan-Kontaktua', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa, aditestua:aditestua});
          }
          else{

                  //Enkriptatu partaide zenbakia. Zenbaki hau aldatuz gero, partaidea balidatu ere aldatu!
         var ekitaldiZenbakia = parseInt(idEkitaldiak) * 9876543;
         var ikusleZenbakia = rowsi.insertId * 3456789;
         //var mailaizena;   
         var to = input.emaila;
         var subj = "Sarrerak balidatu ahal izateko " + data.izenabizenak1 +". Sarrera: "+ data.ilara + " - " + data.eserlekua1;
         var hosta = req.hostname;
         if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
         }
         //Ikusleak sortzeko bidaliko den mezua BALIDAZIO LINKAREKIN
         var body = "<p> Sarrerak lortzeko "+input.emaila+" emaila balidatu behar da : </p>";
         body += "<h3> klik egin: <b>  http://"+hosta+"/sarrerakbalidatu/" + ekitaldiZenbakia + "/" + ikusleZenbakia + ". </b> </h3>";
         body += "<p> Ez bazaizu klikatzeko link moduan agertzen, kopiatu eta pegatu nabigatzailean. </p>";
         body += "<p><b> Aldaketak edo etorri ezina baduzue</b> , bidali oharra zuen eserleku erreserba datoekin <b> zkeskubaloia.partidak@gmail.com </b> -era</p>";
         body += "<p>Mila esker!</p>";
//          req.session.idPartaideak = rows.insertId;
          emailService.send(to, subj, body);
         
          res.render('ikusleakeskerrak.handlebars', {title: "Mila esker!", data:datak, atalak: req.session.atalak, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna, menuadmin: admin});
/* 
         if (req.session.arduraduna){
            res.redirect('/ekitaldiak');
         }else{
            res.redirect('/admin/ekitaldiak');
         }
*/
         }
        }); 
     });
//postgresConnect    });
};

exports.sarrerakbalidatu = function(req,res){

    var ekitaldiZenbakia = req.params.ekitaldiZenbakia;    
    var ikusleZenbakia = req.params.ikusleZenbakia;

    //ADI! partaideasortu-n aldatu balio hau aldatuz gero
    var idIkusleak = ikusleZenbakia / 3456789;
    var idEkitaldiak = ekitaldiZenbakia / 9876543;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM ikusleak where idEkitaldiakIkusle = ? and idIkusleak = ?',[idEkitaldiak, idIkusleak],function(err,rows)  {
     req.connection.query('SELECT * FROM ikusleak where "idEkitaldiakIkusle" = $1 and "idIkusleak" = $2',[idEkitaldiak, idIkusleak],function(err,wrows)  {

      if(err)
          console.log("Error Selecting : %s ",err );
      rows = wrows.rows;     //postgres        
      if (rows.length != 0)  
      {  
        var data = {
            
            balidatuta    : 1
      
        };
        
        req.connection.query('UPDATE ikusleak set balidatuta = $1 WHERE "idEkitaldiakIkusle" = $2 and "idIkusleak" = $3 and balidatuta = $4' ,[1, idEkitaldiak,idIkusleak,0], function(err, rowsu)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );

//         var ikusleZenbakia= rows.insertId * 3456789;
         //var mailaizena;   
         var ekitaldiZenbakia = idEkitaldiak * 3456789;
         var ikusleZenbakia = idIkusleak * 9876543;
         var to = rows[0].emaila;
         var subj = "Sarrerak ekitaldian sartzeko " + rows[0].izenabizenak1 +". Sarrera : "+ rows[0].ilara + " - " + rows[0].eserlekua1;
         var hosta = req.hostname;
         if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
         }
         //Ikusleak sortzeko bidaliko den mezua BALIDAZIO LINKAREKIN
         var body = "<p> Ekitaldirako sarrerak ikusteko, </p>";
         body += "<h3> klik egin: http://"+hosta+"/sarrerakikusi/" + ekitaldiZenbakia + "/" + ikusleZenbakia + " </h3>";
         body += "<p> Ez bazaizu klikatzeko link moduan agertzen, kopiatu eta pegatu nabigatzailean. </p>";
         body += "<p>Ondoren, gorde pantailan agertzen diren sarrerak edo sarreran pantailaratu berriro.</p>";
         body += "<p>Ekitaldira arte!</p>";
//          req.session.idPartaideak = rows.insertId;
          emailService.send(to, subj, body);
       
         res.redirect('/sarrerakikusi/'+ ekitaldiZenbakia + '/' + ikusleZenbakia);
          
        });
      }
     });    
//postgresConnect    });
};

exports.sarrerakikusi = function(req, res){

  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var ekitaldiZenbakia = req.params.ekitaldiZenbakia;    
  var ikusleZenbakia = req.params.ikusleZenbakia;

    //ADI! partaideasortu-n aldatu balio hau aldatuz gero
  var idEkitaldiak = ekitaldiZenbakia / 3456789;
  var idIkusleak = ikusleZenbakia / 9876543;

    var sarrera2, sarrera3, sarrera4;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM ikusleak, ekitaldiak, partiduak, mailak, taldeak, lekuak where idEkitaldiak=idEkitaldiakIkusle and idPartiduak=idPartiduakEkitaldiak and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idEkitaldiakIkusle = ? and idIkusleak = ? order by dataPartidu desc',[idEkitaldiak, idIkusleak],function(err,rows) 
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM ikusleak, ekitaldiak, partiduak, mailak, taldeak, lekuak where "idEkitaldiak"="idEkitaldiakIkusle" and "idPartiduak"="idPartiduakEkitaldiak" and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idEkitaldiakIkusle" = $1 and "idIkusleak" = $2 order by "dataPartidu" desc',[idEkitaldiak, idIkusleak],function(err,wrows) 
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres 
            for (var i in rows){
                rows[i].egunaTexto = egunatextobihurtu(rows[i].dataPartidu);
                if (rows[i].eserlekua2 != 0)
                {
                     gunea = eserlekuagune(rows[i].eserlekua2); 
                     sarrera2 = rows[i].ilara + "-" + rows[i].eserlekua2 + " : " + gunea;
                }
                else sarrera2 = " ";
                if (rows[i].eserlekua3 != 0) 
                {
                     gunea = eserlekuagune(rows[i].eserlekua2); 
                     sarrera3 = rows[i].ilara + "-" + rows[i].eserlekua3 + " : " + gunea;
                }
                else sarrera3 = " ";
                if (rows[i].eserlekua4 != 0) 
                {
                     gunea = eserlekuagune(rows[i].eserlekua2); 
                     sarrera4 = rows[i].ilara + "-" + rows[i].eserlekua4 + " : " + gunea;
                }
                else sarrera4 = " ";

                if (rows[i].eserlekua1 != 0)
                {
                     gunea = eserlekuagune(rows[i].eserlekua1); 
                }
                else gunea = " ";

                rows[i].gunea = gunea;
                rows[i].sarrera2 = sarrera2;
                rows[i].sarrera3 = sarrera3;
                rows[i].sarrera4 = sarrera4;
            }
            res.render('ikusleaksarrerak.handlebars', {title: "Sarrerak",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
              
         });
//postgresConnect   }); 
};

exports.ikusleakezabatu = function(req,res){

     var id = req.session.idKirolElkarteak;
     var idEkitaldiak = req.params.idEkitaldiak;
     var idIkusleak = req.params.idIkusleak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres 
//postgres        connection.query("DELETE FROM ikusleak WHERE idElkarteakIkusle = ? and idIkusleak = ?",[id,idIkusleak], function(err, rows)
        req.connection.query('DELETE FROM ikusleak WHERE "idElkarteakIkusle" = $1 and "idIkusleak" = $2',[id,idIkusleak], function(err,rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );

             if (req.session.admin){
                res.redirect('/admin/ikusleak/'+ idEkitaldiak);
             }else{
               res.redirect('/admin/ikusleak/'+ idEkitaldiak);
             }  
        });
        
//postgresConnect     });
};

exports.ikusleakeditatu = function(req, res){

  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idEkitaldiak = req.params.idEkitaldiak;
  var idIkusleak = req.params.idIkusleak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM ikusleak, ekitaldiak, partiduak, mailak, taldeak, lekuak where idEkitaldiak=idEkitaldiakIkusle and idPartiduak=idPartiduakEkitaldiak and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakIkusle = ? and idIkusleak = ? order by dataPartidu desc',[id, idIkusleak],function(err,rows) 
     req.connection.query('SELECT *, to_char("dataPartidu", \'YYYY-MM-DD\') AS "dataPartidu" FROM ikusleak, ekitaldiak, partiduak, mailak, taldeak, lekuak where "idEkitaldiak"="idEkitaldiakIkusle" and "idPartiduak"="idPartiduakEkitaldiak" and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakIkusle" = $1 and "idIkusleak" = $2 order by "dataPartidu" desc',[id, idIkusleak],function(err,wrows) 
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            res.render('ikusleakeditatu.handlebars', {page_title:"Ekitaldiak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
              
         });
//postgresConnect   }); 
};

exports.ikusleakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idEkitaldiak = req.params.idEkitaldiak;
    var idIkusleak = req.params.idIkusleak;
    var now= new Date();  
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
       
        var data = {
            
            bazkidezenbakia: input.bazkidezenbakia,
            nanzenbakia : input.nanzenbakia,
            izenabizenak1: input.izenabizenak1,
            ilara: (parseInt(input.ilara)),
            eserlekua1: (parseInt(input.eserlekua1)),
            telefonoa: input.telefonoa,
            emaila: input.emaila,
            berezitasunak: input.berezitasunak,
            izenabizenak2: input.izenabizenak2,
            eserlekua2: (parseInt(input.eserlekua2)),
            bazkidezenbakia2: input.bazkidezenbakia2,
            nanzenbakia2 : input.nanzenbakia2,
            izenabizenak3: input.izenabizenak3,
            eserlekua3: (parseInt(input.eserlekua3)),
            bazkidezenbakia3: input.bazkidezenbakia3,
            nanzenbakia3 : input.nanzenbakia3,
            izenabizenak4: input.izenabizenak4,
            eserlekua4: (parseInt(input.eserlekua4)),
            bazkidezenbakia4: input.bazkidezenbakia4,
            nanzenbakia4 : input.nanzenbakia4,
            aldatuaIkusle : now
        };

//        console.log ("dataU : " +JSON.stringify(data));
//postgres        connection.query("UPDATE ikusleak set ? WHERE idElkarteakIkusle = ? and idIkusleak = ? ",[data,id,idIkusleak], function(err, rows)
        req.connection.query('UPDATE ikusleak set ? WHERE "idElkarteakIkusle" = $2 and "idIkusleak" = $3 ',[data,id,idIkusleak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );

          if (req.session.idTaldeak){
                res.redirect('/admin/ekitaldiaktaldeka/'+ req.session.idTaldeak);
          }
          else
           if (req.session.admin){ //Administratzaile moduan badago ordutegiak ikustean, editatu ondoren partidu ordutegira bidali
               res.redirect('/admin/ikusleak/'+ idEkitaldiak);
           }
           else
            if (req.session.jardunaldia){ 
//                res.redirect('/admin/jardunaldikoekitaldiak/' + req.session.jardunaldia);
                res.redirect('/admin/ikusleak/'+ idEkitaldiak);
            }
            else //Partiduak ataletik editatzean partiduak, partiduak orrira bidali 
                res.redirect('/admin/ikusleak/'+ idEkitaldiak);
        });
    
//postgresConnect    });
};