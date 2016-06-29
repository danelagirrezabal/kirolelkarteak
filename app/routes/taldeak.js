var bcrypt = require('bcrypt-nodejs');

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var VALID_TEL_REGEX = /^[0-9-()+]{3,20}/;
var VALID_DNI_REGEX = /^\d{8}[a-zA-Z]{1}$/;

//TALDEAK 

exports.taldeakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak, ekintzak, mailak, partaideak where idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idEkintzakTalde = idEkintzak and idDenboraldiaEkintza= ? and idElkarteakTalde = ? order by noiztikEkintza desc',[idDenboraldia,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldeakadmin.handlebars',{title: "Taldeak", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       
      });   
  });
};

exports.taldeakikusipartaide = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak, ekintzak, mailak, partaideak where idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idEkintzakTalde = idEkintzak and idDenboraldiaEkintza= ? and idElkarteakTalde = ? order by noiztikEkintza desc',[idDenboraldia,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldeak.handlebars',{title: "Taldeak", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});                       
      });   
  });
};

exports.taldeakgehitu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM mailak where idElkarteakMaila = ? order by zenbakiMaila asc',[id],function(err,rowsm) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        connection.query('SELECT * FROM partaideak where idElkarteakPart = ? order by izenaPart asc',[id],function(err,rowsp) {
            if(err)
            console.log("Error Selecting : %s ",err );

            connection.query('SELECT * FROM ekintzak where idElkarteakEkintza = ? and idDenboraldiaEkintza= ? order by idEkintzak asc',[id, idDenboraldia],function(err,rowse) {
               if(err)
                console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
      res.render('taldeaksortu.handlebars', {title : 'KirolElkarteak-Taldeak gehitu', mailak:rowsm, arduradunak:rowsp, ekintzak:rowse, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
      }); 
      });  
          });  
  });
};

exports.taldeaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    //var idDenboraldia = req.session.idDenboraldia;
    var now= new Date();

    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaTalde    : input.izenaTalde,
            idMailaTalde   : input.idMailaTalde,
            akronimoTalde : input.akronimoTalde,
            arduradunEmailTalde : input.arduradunEmailTalde,
            idArduradunTalde : input.idArduradunTalde,
            urlSailkapenTalde: input.urlSailkapenTalde,
            idEkintzakTalde : input.idEkintzakTalde,
            idElkarteakTalde : id
            //idDenboraldiaEkintza : idDenboraldia
        };
        
  
        var query = connection.query("INSERT INTO taldeak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/admin/taldeak');
        });
        
       // console.log(query.sql); 
    
    });
};

exports.taldeakezabatu = function(req,res){
          
     var id = req.session.idKirolElkarteak;
     //var idDenboraldia = req.session.idDenboraldia;
     var idTaldeak = req.params.idTaldeak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM taldeak WHERE idElkarteakTalde = ? and idTaldeak = ?",[id, idTaldeak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/taldeak');
             
        });
        
     });
};

exports.taldeakeditatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak WHERE idElkarteakTalde = ? and idTaldeak= ?',[id,idTaldeak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

              connection.query('SELECT * FROM mailak where idElkarteakMaila = ? order by zenbakiMaila asc',[id],function(err,rowsm) {
            
                if(err)
                  console.log("Error Selecting : %s ",err );
                
                for(var i in rowsm ){
                  if(rows[0].idMailaTalde == rowsm[i].idMailak){
                    izenaMaila = rowsm[i].izenaMaila;
                    rowsm[i].aukeratua = true;
                  }
                  else
                    rowsm[i].aukeratua = false;
                }

                rows[0].mailak = rowsm;

                connection.query('SELECT * FROM partaideak where idElkarteakPart = ? order by izenaPart asc',[id],function(err,rowsp) {
                  if(err)
                    console.log("Error Selecting : %s ",err );

                  for(var i in rowsp ){
                    if(rows[0].idArduradunTalde == rowsp[i].idPartaideak){
                      izenaPart = rowsp[i].izenaPart;
                      abizena1Part = rowsp[i].abizena1Part;
                      rowsp[i].aukeratua = true;
                    }
                    else
                      rowsp[i].aukeratua = false;
                  }

                  rows[0].arduradunak = rowsp;

                  connection.query('SELECT * FROM ekintzak where idElkarteakEkintza = ? and idDenboraldiaEkintza= ? order by idEkintzak asc',[id, idDenboraldia],function(err,rowse) {
                    if(err)
                      console.log("Error Selecting : %s ",err );
                    
                    for(var i in rowse ){
                      if(rows[0].idEkintzakTalde == rowse[i].idEkintzak){
                        motaEKintza = rowsm[i].motaEkitnza;
                        rowse[i].aukeratua = true;
                      }
                      else
                        rowse[i].aukeratua = false;
                    } 

                    rows[0].ekintzak = rowse;

            res.render('taldeakeditatu.handlebars', {page_title:"Taldeak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                  });
                });
            });
                 
    }); 
};


exports.taldeakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var idTaldeak = req.params.idTaldeak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaTalde    : input.izenaTalde,
            idMailaTalde   : input.idMailaTalde,
            akronimoTalde : input.akronimoTalde,
            arduradunEmailTalde : input.arduradunEmailTalde,
            idArduradunTalde : input.idArduradunTalde,
            urlSailkapenTalde: input.urlSailkapenTalde,
            idEkintzakTalde : input.idEkintzakTalde,
        };
        
        connection.query("UPDATE taldeak set ? WHERE idElkarteakTalde = ? and idTaldeak = ?",[data,id, idTaldeak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/taldeak');
          
        });
    
    });
};

//TALDEKIDEAK

exports.taldekideakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  req.getConnection(function(err,connection){

    connection.query('SELECT * FROM taldeak, mailak where idMailaTalde=idMailak and idTaldeak = ? and idElkarteakTalde = ?',[idTaldeak,id],function(err,rowst) {
       
     connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, ekintzak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idEkintzakTalde = idEkintzak and idDenboraldiaEkintza= ? and idTaldeakKide = ? and idElkarteakTalde = ? order by noiztikEkintza desc',[idDenboraldia,idTaldeak,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldekideakadmin.handlebars',{title: "Taldekideak", data:rows, talde:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       
      });   
    });
  });
};

exports.taldekideakgehitu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by idPartaideMotak asc',[id],function(err,rowsm) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        connection.query('SELECT * FROM partaideak where idElkarteakPart = ? order by izenaPart asc',[id],function(err,rowsp) {
            if(err)
            console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
      res.render('taldekideaksortu.handlebars', {title : 'KirolElkarteak-Taldeak gehitu', motak:rowsm, partaideak:rowsp, idTaldeak:idTaldeak, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
      }); 
      });  
         
  });
};

exports.taldekideaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idTaldeak = req.params.idTaldeak;
    var now= new Date();

    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

    req.getConnection(function (err, connection) {
        
        var data = {
            materialaKide    : input.materialaKide,
            ordainduKide   : input.ordainduKide,
            kamixetaZenbKide : input.kamixetaZenbKide,
            idMotaKide : input.idMotaKide,
            idTaldeakKide : idTaldeak,
            idPartaideakKide: input.idPartaideakKide,
            bazkideZenbKide : input.bazkideZenbKide,
            idElkarteakKide : id
        };
        
  
        var query = connection.query("INSERT INTO taldekideak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/admin/taldekideak/'+idTaldeak);
        });
        
       // console.log(query.sql); 
    
    });
};

exports.taldekideakezabatu = function(req,res){
          
     var id = req.session.idKirolElkarteak;
     var idTaldeak = req.params.idTaldeak;
     var idTaldekideak = req.params.idTaldekideak;

    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM taldekideak WHERE idElkarteakKide = ? and idTaldekideak = ?",[id, idTaldekideak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/taldekideak/'+idTaldeak);
             
        });
        
     });
};

exports.taldekideakeditatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldekideak = req.params.idTaldekideak;
  var baiez = [{ordainduKide:"Bai"}, {ordainduKide:"Ez"}];
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldekideak WHERE idElkarteakKide = ? and idTaldekideak= ?',[id,idTaldekideak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

              connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by idPartaideMotak asc',[id],function(err,rowsm) {
            
                if(err)
                  console.log("Error Selecting : %s ",err );
                
                for(var i in rowsm ){
                  if(rows[0].idMotaKide == rowsm[i].idPartaideMotak){
                    deskribapenMota = rowsm[i].deskribapenMota;
                    rowsm[i].aukeratua = true;
                  }
                  else
                    rowsm[i].aukeratua = false;
                }

                rows[0].motak = rowsm;

                connection.query('SELECT * FROM partaideak where idElkarteakPart = ? order by izenaPart asc',[id],function(err,rowsp) {
                  if(err)
                    console.log("Error Selecting : %s ",err );

                  for(var i in rowsp ){
                    if(rows[0].idPartaideakKide == rowsp[i].idPartaideak){
                      izenaPart = rowsp[i].izenaPart;
                      abizena1Part = rowsp[i].abizena1Part;
                      abizena2Part = rowsp[i].abizena2Part;
                      rowsp[i].aukeratua = true;
                    }
                    else
                      rowsp[i].aukeratua = false;
                  }

                  rows[0].partaideak = rowsp;

                  for(var i in baiez ){
                    if(rows[0].ordainduKide == baiez[i].ordainduKide){
                      ordainduKide = rowsp[i].ordainduKide;
                      baiez[i].aukeratua = true;
                    }
                    else
                      baiez[i].aukeratua = false;
                  }

                  rows[0].ordainduKide = baiez;


            res.render('taldekideakeditatu.handlebars', {page_title:"Taldekideak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         
                  });
                });
            });
                 
    }); 
};


exports.taldekideakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idTaldekideak = req.params.idTaldekideak;
    var idTaldeak = req.params.idTaldeak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            materialaKide    : input.materialaKide,
            ordainduKide   : input.ordainduKide,
            kamixetaZenbKide : input.kamixetaZenbKide,
            idMotaKide : input.idMotaKide,
            idPartaideakKide: input.idPartaideakKide,
            bazkideZenbKide : input.bazkideZenbKide,
        };
        
        connection.query("UPDATE taldekideak set ? WHERE idElkarteakKide = ? and idTaldekideak = ?",[data,id, idTaldekideak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/taldekideak/'+idTaldeak);
          
        });
    
    });
};



////////////////////////////////////////////////// NERIA
exports.taldeakjokalariakikusi = function(req,res){
var taldeak = []; 
var taldea = {};
var jokalariak = []; 
var j;
var t = 0;
var vTalde;
var date = new Date();
  req.getConnection(function(err,connection){
      connection.query('SELECT * FROM taldeak LEFT JOIN jokalariak ON idtaldeak=idtaldej WHERE idtxapeltalde = ? and balidatuta != "admin" order by idtaldeak, idjokalari',[req.session.idKirolElkarteak],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        for (var i in rows) { 
          if(vTalde != rows[i].idtaldeak){
            if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldeak[t] = taldea;
              t++;
            }
            vTalde = rows[i].idtaldeak;
            jokalariak = []; 
            j=0;
            if(rows[i].sortzedata != null){
            data = rows[i].sortzedata;
            rows[i].sortzedata= data.getFullYear() + "-"+ (data.getMonth() +1) +"-"+ data.getDate()+" "+data.getHours()+":"+data.getMinutes();
          }
          
            taldea = {

                  idtaldeak  : rows[i].idtaldeak,
                  taldeizena    : rows[i].taldeizena,
                  herria    : rows[i].herria,
                  DNIard    : rows[i].DNIard,
                  izenaard    : rows[i].izenaard,
                  emailard   : rows[i].emailard,
                  telefonoard    : rows[i].telefonoard,
                  sortzedata: rows[i].sortzedata,
                  balidatuta : rows[i].balidatuta
               };
               
          }
          jokalariak[j] = {
                  jokalariizena    : rows[i].jokalariizena,
                  emailaj   : rows[i].emailaj,
                  telefonoaj: rows[i].telefonoaj,
                  kamisetaneurria : rows[i].kamisetaneurria
               };
          j++;
          
        }
        if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldeak[t] = taldea;
              t++;
            }
        res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-TaldeakAdmin', data2:taldeak, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
    });
  });
}

exports.ikusi = function (req,res){ 
var mailak = [];
var maila = {};
var taldeak = [];
var j,t;
var k = 0;
var vKategoria, postua;

  req.getConnection(function(err,connection){
    connection.query('SELECT * FROM taldeak,maila where kategoria=idmaila and (balidatuta = "admin" or balidatuta >= 1) and idtxapeltalde = ? order by mailazki,sortzedata',[req.session.idtxapelketa],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        if(rows.length == 0){
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Inskripzio epea zabalik bada, izena eman'
           };
           return res.redirect('/izenematea'); 
        };
        for (var i in rows) { 
         
           if(vKategoria != rows[i].kategoria){
            if(vKategoria !=null){
              maila.taldeak = taldeak;
              mailak[k] = maila;
              k++;
            }
            vKategoria = rows[i].kategoria;
            taldeak = []; 
            j=0;
            maila = {
                  kategoria    : rows[i].kategoria,
                  mailaizena  : rows[i].mailaizena
               };
               
          }
          
          taldeak[j] = {
                  postua : j+1,
                  taldeizena    : rows[i].taldeizena,
                  herria    : rows[i].herria,
                  
               };
          j++;

        }
        if(vKategoria !=null){
              maila.taldeak = taldeak;
              mailak[k] = maila;
              k++;
            }
        
        res.render('taldeak.handlebars', {title : 'Txaparrotan-Taldeak', data2:mailak, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, taldeizena: req.session.taldeizena} );

    });
  });
}





exports.editatu = function(req, res){

  //var id = req.params.id;
  var id = req.session.idtalde;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak WHERE idtaldeak = ?',[id],function(err,rows)
        {
          if(err)
              console.log("Error Selecting : %s ",err );          
          connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
            if(err)
              console.log("Error Selecting : %s ",err );

            for(var i in rowsm ){
               if(rows[0].kategoria == rowsm[i].idmaila){
                  mailaizena = rowsm[i].mailaizena;
                  rowsm[i].aukeratua = true;
               }
               else
                  rowsm[i].aukeratua = false;
            }

            rows[0].mailak = rowsm;
            console.log("Taldea:"+rows[0].taldeizena);
            res.render('taldeaeditatu.handlebars', {title:"Taldea aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, taldeizena: req.session.taldeizena});
                           
          });
     });                 
  }); 
};

exports.aldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
   var id = req.session.idtalde;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            taldeizena : input.taldeizena,
            kategoria   : input.kategoria,
            herria   : input.herria,
            izenaard   : input.izenaard,
            telefonoard   : input.telefonoard,
            emailard   : input.emailard,
        
        };
        
        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ?  ",[data,id], function(err, rows)
        {
            if(err || rows.length != 0){
        //  res.redirect('/izenematea');
              res.locals.flash = {
                 type: 'danger',
                 intro: 'Adi!',
                 message: 'Saiatu berriz',
              };
            }

              console.log("Error Updating : %s ",err );
         
          res.redirect('/jokalariak');
          
        });
    
    });
  //}
};

exports.saioahasteko = function(req, res){
  var id = req.session.idtxapelketa;
  req.getConnection(function (err, connection) {
      if (err)
              console.log("Error connection : %s ",err ); 
      //connection.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = "admin" or balidatuta = 1) and emailard = ? ',[id],function(err,rows)     {
      connection.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = "admin" or balidatuta >= 1) and idtxapeltalde = ? order by taldeizena',[id],function(err,rows)  {
        if (err)
                console.log("Error query : %s ",err ); 
        console.log("taldeak : " + JSON.stringify(rows)); 
        res.render('login.handlebars', {title : 'Txaparrotan-Login',taldeizena: req.session.taldeizena, taldeak : rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
      });   
  });  
};



exports.bilatu = function(req, res){
  var taldea;
  var id = req.session.idtalde;
  var now= new Date();
  //var id = req.params.id;
  var bukaera,aBukaera, vBukaera,aldaketabai;
  var aldaketa = {};
  var aldaketarray = [];
  req.getConnection(function(err,connection){
    
    
     connection.query('SELECT * FROM taldeak,maila,txapelketa where idmaila = kategoria and idtxapelketa=idtxapeltalde and idtaldeak = ?',[id],function(err,rows)     {
            
        if(err)

           console.log("Error Selecting : %s ",err );

        vBukaera = new Date();
        bukaera = rows[0].inskripziobukaerae;
        aBukaera = bukaera.split("-");
        vBukaera.setDate(aBukaera[2]);
        vBukaera.setMonth(aBukaera[1] - 1);
        vBukaera.setYear(aBukaera[0]);

        if(vBukaera > now){
          aldaketabai = true;
        }
        else{
          aldaketabai = false;
        }

        taldea = rows;
        rows[0].aldaketabai = aldaketabai;
        aldaketa.aldaketabai = aldaketabai;
        aldaketarray[0] = aldaketa;

        console.log("aldaketabai : %s ",aldaketabai ); 
        console.log("aldaketa : " + JSON.stringify(aldaketarray)); 
        console.log("taldea : " + JSON.stringify(rows));
   
        connection.query('SELECT * FROM jokalariak where idtaldej= ?',[id],function(err,rowsj)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );

          for(var i in rowsj ){
               rowsj[i].aldaketabai = aldaketabai;
          }

          console.log("jokalariak : " + JSON.stringify(rowsj));

          res.render('jokalariak.handlebars', {title : 'Txaparrotan-Datuak', data2:rows , data:rowsj, aldaketabai : aldaketabai, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, taldeizena: req.session.taldeizena} );

                           
         });
       });
    });
  
};
exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers-Node.js"});
};
exports.edit = function(req, res){
    
  var id = req.params.id;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM customer WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit_customer',{page_title:"Edit Customers - Node.js",data:rows});
                           
         });
                 
    }); 
};

exports.izenematea = function(req,res){

    res.locals.flash = null;
    var now= new Date();
    var vHasiera,aHasiera,hasiera,vBukaera,aBukaera,bukaera,aditestua;
           console.log("IdTxaelketa : %s ",req.session.idtxapelketa );
    req.getConnection(function(err,connection){
      connection.query('SELECT * FROM txapelketa where idtxapelketa = ?',[req.session.idtxapelketa],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );

        connection.query('SELECT count(*) as guztira FROM taldeak where idtxapeltalde= ? and balidatuta != "admin" ',[req.session.idtxapelketa],function(err,rowsg)     {
          if(err)
           console.log("Error Selecting : %s ",err );
        if(rows.length != 0) {
          vHasiera = new Date();
          hasiera = rows[0].inskripziohasierae;

          aHasiera = hasiera.split("-");
          vHasiera.setDate(aHasiera[2]);
          vHasiera.setMonth(aHasiera[1] - 1);
          vHasiera.setYear(aHasiera[0]);

          vBukaera = new Date();
          bukaera = rows[0].inskripziobukaerae;
          aBukaera = bukaera.split("-");
          vBukaera.setDate(aBukaera[2]);
          vBukaera.setMonth(aBukaera[1] - 1);
          vBukaera.setYear(aBukaera[0]);  

        if(vHasiera > now) {
          if(req.xhr) return res.json({ error: 'Invalid hasiera' });
            res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: rows[0].inskripziohasierae + ' irekitzen da izen-ematea.',
          };
          aditestua = "Oraindik apuntatzeko epea ireki gabe.";
        }

        else if(vBukaera < now) {
          if(req.xhr) return res.json({ error: 'Invalid bukaera' });
            res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: rows[0].inskripziobukaerae + ' bukatu zen izen-ematea.',
          };
          aditestua = "Apuntatzeko epea bukatuta!"
        }

        else if(rowsg[0].guztira >= rows[0].taldekopmax) {
           if(req.xhr) return res.json({ error: 'Invalid beteta' });
            res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Talde kopurua beteta.',
          };
          aditestua = "Talde kopurua beteta! Txapelketa itxita dago! Hala ere, idatzi zuen taldearen izena eta zein mailetakoak zareten (sexua barne) eta posible izanez gero, zuekin kontaktuan jarriko gara!";
         }
         
        }        
        if(res.locals.flash != null){
         //res.redirect(303,'/');
          res.render('kontaktua.handlebars', {title : 'Txaparrotan-Kontaktua', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa, aditestua:aditestua});

        }
        else{
          connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
            if(err)
              console.log("Error Selecting : %s ",err );

          res.render('taldeaksortu.handlebars', {title : 'Txaparrotan-Izen-ematea', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa, mailak:rowsm});
         });
        }
      });
     });
    });
}
exports.sortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    res.locals.flash = null;
    var now= new Date();

    if(!req.body.DNIard.match(VALID_DNI_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid DNI' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'NANa ez da zuzena',
    };
   // return res.render('taldeaksortu.handlebars', {DNIard: DNI});
    //return res.redirect(303, '/izenematea');
  }

    else if(!req.body.telefonoard.match(VALID_TEL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid telefono' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Telefonoa ez da zuzena',
    };
    //return res.redirect(303, '/izenematea');
  }

  else if(!req.body.emailard.match(VALID_EMAIL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emaila ez da zuzena',
    };
   // return res.redirect(303, '/izenematea');
  }

  else if(req.body.pasahitza != req.body.pasahitza2) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Pasahitzak ez dira berdinak',
    };
   // return res.redirect(303, '/izenematea');
  }

  else if(req.body.emailard != req.body.emailard2) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emailak ez dira berdinak',
    };
   // return res.redirect(303, '/izenematea');
  }

  req.getConnection(function (err, connection) {
   connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
      if(err)
        console.log("Error Selecting : %s ",err ); 

      for(var i in rowsm ){
          if(req.body.kategoria == rowsm[i].idmaila){
            mailaizena = rowsm[i].mailaizena;
            rowsm[i].aukeratua = true;
          }
          else
            rowsm[i].aukeratua = false;
      }
 
      if(res.locals.flash != null){

         return res.render('taldeaksortu.handlebars', {
            title : 'Txaparrotan-Izen-ematea',
            // taldeizena : req.session.taldeizena,
            idtxapelketa : req.session.idtxapelketa,
            mailak : rowsm,
            taldeizena: req.body.taldeizena,
            kategoria   : req.body.kategoria,
            herria   : req.body.herria,
            DNIard    : req.body.DNIard,
            izenaard   : req.body.izenaard,
            telefonoard   : req.body.telefonoard,
            emailard   : req.body.emailard,
            emailard2 : req.body.emailard2

          } );
      }
  
//  req.getConnection(function (err, connection) {

      connection.query('SELECT * FROM taldeak where idtxapeltalde= ? and taldeizena = ?',[req.session.idtxapelketa, req.body.taldeizena],function(err,rows)  {

 //     connection.query('SELECT * FROM taldeak where taldeizena = ?',[req.body.taldeizena],function(err,rows)  {
            
        if(err || rows.length != 0){
        //  res.redirect('/izenematea');
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste talde izen bat sartu!',
           };


           return res.render('taldeaksortu.handlebars', {
            title : 'Txaparrotan-Izen-ematea',
            // taldeizena : req.session.taldeizena,
            idtxapelketa : req.session.idtxapelketa,
            mailak : rowsm,
            taldeizena: req.body.taldeizena,
            kategoria   : req.body.kategoria,
            herria   : req.body.herria,
            DNIard    : req.body.DNIard,
            izenaard   : req.body.izenaard,
            telefonoard   : req.body.telefonoard,
            emailard   : req.body.emailard,
            emailard2 : req.body.emailard2

           });
        }
        connection.query('SELECT * FROM txapelketa where idtxapelketa = ?',[req.session.idtxapelketa],function(err,rowst)  {          
            
            if(err)
                console.log("Error inserting : %s ",err );
        // Generate password hash
            var salt = bcrypt.genSaltSync();
            var password_hash = bcrypt.hashSync(input.pasahitza, salt);

          

            var data = {
            
            taldeizena    : input.taldeizena,
            idtxapeltalde : req.session.idtxapelketa,
            kategoria   : input.kategoria,
            herria   : input.herria,
            DNIard    : input.DNIard,
            izenaard   : input.izenaard,
            telefonoard   : input.telefonoard,
            emailard   : input.emailard,
            pasahitza:   password_hash,     //input.pasahitza,
            sortzedata : now,
            lehentasuna : 99
           };

           var query = connection.query("INSERT INTO taldeak set ? ",data, function(err, rows)
           {
  
            if (err)
              console.log("Error inserting : %s ",err );

        //Enkriptatu talde zenbakia. Zenbaki hau aldatuz gero, taldea balidatu ere aldatu!
         var taldezenbakia= rows.insertId * 3456789;
         var mailaizena;   
         var to = input.emailard;
         var subj = "Ongi-etorri " + data.izenaard;
         var hosta = req.hostname;
         if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
         }
         for(var i in rowsm ){
          if(data.kategoria == rowsm[i].idmaila){
            mailaizena = rowsm[i].mailaizena;
          }
         }
         var body = "<p>"+data.taldeizena+" "+mailaizena+" mailan taldea balidatu ahal izateko, </p>";
         body += "<h3> klik egin: http://"+hosta+"/taldeabalidatu/" + taldezenbakia+ ". </h3>";
         body += "<p>Ondoren, saioa hasi eta zure jokalariak gehitu.</p> <p> Hori egindakoan, " +rowst[0].kontukorrontea+ " kontu korrontean  "+rowst[0].prezioa+ "euro sartu eta kontzeptu bezala "+data.taldeizena+"-"+data.izenaard+" jarri.</p>";
         body += "<p>Hori egin arte, zure taldea ez da apuntaturik egongo. Mila esker!</p>";
          req.session.idtalde = rows.insertId;
          emailService.send(to, subj, body);
          //res.redirect('/taldeak');
          res.render('taldeaeskerrak.handlebars', {title: "Mila esker!", taldeizena:data.taldeizena, txapelketaizena:req.session.txapelketaizena, kk:rowst[0].kontukorrontea, prezio: rowst[0].prezioa, emailard:data.emailard, izenaard: data.izenaard,mailaizena: mailaizena});
          });
        }); 
      });
    });
  });
};








exports.delete_customer = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM customer  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/customers');
             
        });
        
     });
};

/*exports.partiduak = function(req, res){
  var taldea;
  var id = req.session.idtalde;
  //var id = req.params.id;
  req.getConnection(function(err,connection){
    
    
    connection.query('SELECT *,t1.taldeizena taldeizena1,t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1,taldeak t2,grupoak where idgrupop=idgrupo and t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and t1.idtxapeltalde = ? and t2.idtxapeltalde = ? and (p.idtalde1 = ? or p.idtalde2 = ? )order by pareguna, parordua,zelaia',[id, id, id,id],function(err,rows)     {
     
            
        if(err)

           console.log("Error Selecting : %s ",err );
        
        console.log(rows);
        res.render('emaitzak.handlebars', {title : 'Txaparrotan-Emaitzak', data2: rows, taldeizena: req.session.taldeizena});
                           

       });
    });
  
};*/
