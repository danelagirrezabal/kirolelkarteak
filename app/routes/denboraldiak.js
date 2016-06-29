var bcrypt = require('bcrypt-nodejs');

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var VALID_TEL_REGEX = /^[0-9-()+]{3,20}/;
var VALID_DNI_REGEX = /^\d{8}[a-zA-Z]{1}$/;


exports.denboraldiakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM denboraldiak where idElkarteakDenb = ? order by noiztikDenb desc',[id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('denboraldiak.handlebars',{title: "Denboraldiak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
        });                        
      });   
  });
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

    req.getConnection(function (err, connection) {
        
        var data = {
            
            noiztikDenb    : input.noiztikDenb,
            noraDenb   : input.noraDenb,
            deskribapenaDenb: input.deskribapenaDenb,
            idElkarteakDenb : id,
            egoeraDenb: input.egoeraDenb
        };
        
  
        var query = connection.query("INSERT INTO denboraldiak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/admin/denboraldiak');
        });
        
       // console.log(query.sql); 
    
    });
};

exports.denboraldiakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idDenboraldia = req.params.idDenboraldia;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM denboraldiak  WHERE idElkarteakDenb = ? and idDenboraldia = ?",[id,idDenboraldia], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/denboraldiak');
             
        });
        
     });
};

exports.denboraldiakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.params.idDenboraldia;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM denboraldiak WHERE idElkarteakDenb = ? and idDenboraldia = ?',[id,idDenboraldia],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('denboraldiakeditatu.handlebars', {page_title:"Denboraldiak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.denboraldiakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.params.idDenboraldia;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            noiztikDenb    : input.noiztikDenb,
            noraDenb   : input.noraDenb,
            deskribapenaDenb: input.deskribapenaDenb,
            //idElkarteakDenb : id,
            egoeraDenb: input.egoeraDenb
        };
        
        connection.query("UPDATE denboraldiak set ? WHERE idElkarteakDenb = ? and idDenboraldia = ? ",[data,id,idDenboraldia], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/denboraldiak');
          
        });
    
    });
};

exports.ekintzakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM ekintzak where idDenboraldiaEkintza= ? and idElkarteakEkintza = ? order by noiztikEkintza desc',[idDenboraldia,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('ekintzak.handlebars',{title: "Ekintzak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
        });                        
      });   
  });
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

    req.getConnection(function (err, connection) {
        
        var data = {
            
            motaEkintza    : input.motaEkintza,
            noiztikEkintza   : input.noiztikEkintza,
            noraEkintza : input.noraEkintza,
            kontuKorronteEkintza : input.kontuKorronteEkintza,
            diruaEkintza : input.diruaEkintza,
            idElkarteakEkintza : id,
            idDenboraldiaEkintza : idDenboraldia
        };
        
  
        var query = connection.query("INSERT INTO ekintzak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/admin/ekintzak');
        });
        
       // console.log(query.sql); 
    
    });
};

exports.ekintzakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idDenboraldia = req.session.idDenboraldia;
     var idEkintzak = req.params.idEkintzak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM ekintzak  WHERE idElkarteakEkintza = ? and idDenboraldiaEkintza = ? and idEkintzak = ?",[id,idDenboraldia, idEkintzak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/ekintzak');
             
        });
        
     });
};

exports.ekintzakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idEkintzak = req.params.idEkintzak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM ekintzak WHERE idElkarteakEkintza = ? and idDenboraldiaEkintza = ? and idEkintzak= ?',[id,idDenboraldia,idEkintzak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('ekintzakeditatu.handlebars', {page_title:"Ekintzak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.ekintzakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var idEkintzak = req.params.idEkintzak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            motaEkintza    : input.motaEkintza,
            noiztikEkintza   : input.noiztikEkintza,
            noraEkintza : input.noraEkintza,
            kontuKorronteEkintza : input.kontuKorronteEkintza,
            diruaEkintza : input.diruaEkintza
        };
        
        connection.query("UPDATE ekintzak set ? WHERE idElkarteakEkintza = ? and idDenboraldiaEkintza = ? and idEkintzak = ?",[data,id,idDenboraldia, idEkintzak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/ekintzak');
          
        });
    
    });
};


exports.jardunaldikopartiduakbilatu = function(req, res){
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

          res.render('partiduakadmin.handlebars',{title: "Partiduak", data:rows, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
        });                   
      });   
  });
};

exports.partiduakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  req.session.admin = 0;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? order by dataPartidu desc',[id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? order by jardunaldiDataPartidu desc',[id],function(err,rowsd) {
          
          if(err)
           console.log("Error Selecting : %s ",err );

          res.render('partiduakadmin.handlebars',{title: "Partiduak", data:rows, jardunaldiak:rowsd,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
        });                   
      });   
  });
};

exports.partiduakgehitu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak,mailak where idMailak=idMailaTalde and idElkarteakTalde = ? order by idMailaTalde asc',[id],function(err,rowst) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        connection.query('SELECT * FROM lekuak where idElkarteakLeku = ? order by zenbakiLeku asc',[id],function(err,rowsl) {
            if(err)
            console.log("Error Selecting : %s ",err );

            res.render('partiduaksortu.handlebars', {title : 'KirolElkarteak-Taldeak gehitu', taldeak:rowst, lekuak:rowsl,jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,  partaidea: req.session.partaidea});
        }); 
      });  
           
  });
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

    req.getConnection(function (err, connection) {
        
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
            nonPartidu : input.nonPartidu
        };
        
  
        var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/admin/partiduak');
        }); 
    
    });
};

exports.partiduakezabatu = function(req,res){

     var id = req.session.idKirolElkarteak;
     var idPartiduak = req.params.idPartiduak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM partiduak WHERE idElkarteakPartidu = ? and idPartiduak = ?",[id,idPartiduak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/partiduak');
             
        });
        
     });
};

exports.partiduakeditatu = function(req, res){

  var id = req.session.idKirolElkarteak;
  var idPartiduak = req.params.idPartiduak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu,DATE_FORMAT(jardunaldiDataPartidu,"%Y/%m/%d") AS jardunaldiDataPartidu FROM partiduak WHERE idElkarteakPartidu = ? and idPartiduak = ?',[id,idPartiduak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

               connection.query('SELECT * FROM taldeak, mailak where idMailak=idMailaTalde and idElkarteakTalde = ? order by idMailaTalde asc',[id],function(err,rowst) {
            
                if(err)
                  console.log("Error Selecting : %s ",err );
                
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

                connection.query('SELECT * FROM lekuak where idElkarteakLeku = ? order by zenbakiLeku asc',[id],function(err,rowsl) {
            
                if(err)
                  console.log("Error Selecting : %s ",err );
                
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
                 
    }); 
};

exports.partiduakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idPartiduak = req.params.idPartiduak;
    
    req.getConnection(function (err, connection) {
        
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
            nonPartidu : input.nonPartidu
        };
        
        connection.query("UPDATE partiduak set ? WHERE idElkarteakPartidu = ? and idPartiduak = ? ",[data,id,idPartiduak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );


         if (req.session.admin){ //Administratzaile moduan badago ordutegiak ikustean, editatu ondoren partidu ordutegira bidali
            res.redirect('/admin/partiduordutegiak/'+ req.session.idDenboraldia + '/' + req.session.jardunaldia);
         }
         else //Partiduak ataletik editatzean partiduak, partiduak orrira bidali 
            res.redirect('/admin/partiduak');
          
        });
    
    });
};

exports.partiduordutegiak = function (req,res){
var id = req.session.idKirolElkarteak;
var jardunaldia = req.params.jardunaldia;
var idDenboraldia = req.params.idDenboraldia;
req.session.jardunaldia = jardunaldia;
req.session.idDenboraldia = idDenboraldia;
//var etxekokanpokoak = []; //mailak
//var etxekokanpokoa = {}; //maila
var egunak = []; //mailak
var eguna = {}; //maila
var lekuak = []; //multzoak
var lekua = {}; //multzoa
var partiduak = [];
var j,t;
var k = 0;
var vEgunak, vLekuak;
var admin=(req.path.slice(0,24) == "/admin/partiduordutegiak");
req.session.admin=0;
console.log(jardunaldia);
console.log(req.path.slice(0,24));
   req.getConnection(function(err,connection){
     //connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? and idDenboraldiaPartidu = ? order by dataPartidu desc',[id, jardunaldia, jardunaldia, idDenboraldia],function(err,rows) {
      connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu = ? and idDenboraldiaPartidu = ? order by dataPartidu, zenbakiLeku, zenbakiMaila ',[id, jardunaldia, idDenboraldia],function(err,rows) {

        if(err)
           console.log("Error Selecting : %s ",err );

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
          

          connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
          
            if(err)
              console.log("Error Selecting : %s ",err );

            for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    idDenboraldia = rowsdenb[i].idDenboraldia;
                    deskribapenaDenb = rowsdenb[i].deskribapenaDenb;
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
                }
            

        for (var i in rows) {
  
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
                  dataPartidu    : rows[i].dataPartidu
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
          
            lekua = {
                  lekua    : rows[i].izenaLeku
               };
               
          }
          partiduak[j] = {
                  idPartiduak    : rows[i].idPartiduak,
                  izenaMaila: rows[i].izenaMaila,
                  etxekoaPartidu: rows[i].etxekoaPartidu,
                  kanpokoaPartidu    : rows[i].kanpokoaPartidu,
                  orduaPartidu    : rows[i].orduaPartidu,
                  txapelketaPartidu : rows[i].txapelketaPartidu,
                  bidaiOrduaPartidu: rows[i].bidaiOrduaPartidu,
                  bidaiaNolaPartidu: rows[i].bidaiaNolaPartidu,
                  bidaiEgunaPartidu: rows[i].bidaiEgunaPartidu,
                  emaitzaPartidu : rows[i].emaitzaPartidu,
                  nonPartidu: rows[i].nonPartidu,
                  admin: admin
               };
          j++;
       
     }
        if(vEgunak !=null){
              lekua.partiduak = partiduak;
              lekuak[t] = lekua;
              eguna.lekuak = lekuak;
              egunak[k] = eguna;
              k++;
            }
        if (admin){
           req.session.admin = 1;
        }       
        else {
            req.session.admin = 0;
        }
  
        res.render('partiduordutegiak.handlebars', {title : 'KirolElkarteak-Partiduak', data2:egunak, jardunaldiak:rowsd, denboraldiak:rowsdenb, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, menuadmin:admin} );

        
     });   
    });
  });
});
};

//PARTIDUAK KARGATU
exports.partiduakkargatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak,mailak where idMailak=idMailaTalde and idElkarteakTalde = ? order by idMailaTalde asc',[id],function(err,rowst) {
            
        if(err)
           console.log("Error Selecting : %s ",err );


            res.render('partiduakkargatu.handlebars', {title : 'KirolElkarteak-Partiduak kargatu', taldeak:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
         
      });  
           
  });
};

exports.partiduakkargatuegin = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var now= new Date();
    var partiduak = input.partiduakCSV.split("\n"); //CSV-a zatitu lerroka (partiduka)
    var partidua = [];
    var idLekuak;
    var kanpoPosizio;

    req.getConnection(function (err, connection) {

     connection.query('SELECT * FROM lekuak where idElkarteakLeku = ? order by zenbakiLeku asc',[id],function(err,rowsl) {
            
      if(err)
          console.log("Error Selecting : %s ",err );
      kanpoPosizio = rowsl.length-1;
      for (var i in partiduak){ //Partidu bakoitzeko datuak atera, ","-kin banatuta daudelako split erabiliz
          partidua = partiduak[i].split(",");
          console.log(partiduak[i]);


          if (partidua[1] == input.federazioTaldeIzena) //Federazioko taldearen izenean sartu duten datua berdina bada CSV-ko 2. zutabearekin (etxeko taldea), etxekoa dela adierazi
            idLekuak = rowsl[0].idLekuak; //Etxeko taldearen lekua datu-baseko lehenengo dagoena izango da (zenbakiLeku aldagai txikiena duena)
          else
            idLekuak = rowsl[kanpoPosizio].idLekuak; //Kanpoko taldearen lekua datu-baseko azkena dagoena izango da (zenbakiLeku aldagaia handiena duena)

        
        var data = {
            
            idElkarteakPartidu    : id,
            idDenboraldiaPartidu : idDenboraldia,
            idLekuakPartidu : idLekuak,
            idTaldeakPartidu : input.idTaldeakPartidu,
            jardunaldiaPartidu : i + 1,
            jardunaldiDataPartidu: partidua[0],
            etxekoaPartidu : partidua[1],
            kanpokoaPartidu : partidua[3],
            txapelketaPartidu : input.txapelketa,
            dataPartidu: partidua[0],

        };
        
  
        var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          
        }); 
      }
      res.redirect('/admin/partiduak');
     });
    });
};