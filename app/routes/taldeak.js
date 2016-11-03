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
       
     connection.query('SELECT * FROM taldeak, ekintzak, mailak, partaideak where idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idEkintzakTalde = idEkintzak and idDenboraldiaEkintza= ? and idElkarteakTalde = ? order by zenbakiMaila asc',[idDenboraldia,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldeakpartaide.handlebars',{title: "Taldeak", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea});                       
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


            var path = require('path'),
            fs = require('fs'),
            formidable = require('formidable');
            var bcrypt = require('bcrypt-nodejs');

            var dataDir = path.normalize(path.join(__dirname, '../public', 'data'));
            console.log(dataDir);
            var taldeargazkiakDir = path.join(dataDir, 'taldeargazkiak');
            fs.existsSync(dataDir) || fs.mkdirSync(dataDir); 
            fs.existsSync(taldeargazkiakDir) || fs.mkdirSync(taldeargazkiakDir);

            var argazkiak = [];
            var argazkia = {};
            var idKirolElkarteak = req.session.idKirolElkarteak;
            var elkartedir = taldeargazkiakDir + '/' + idKirolElkarteak + '/' + idTaldeak; 
            fs.existsSync(elkartedir) || fs.mkdirSync(elkartedir);
            fs.readdir(elkartedir, function (err, files) {
            if (err) throw err;
            console.log("/usr files: " + files);
            for (var i in files){
              //argazkiak[i] = files[i];
              console.log(files[i]);
              argazkia = {
                  files    : files[i],
                  idKirolElkarteak  : req.session.idKirolElkarteak,
                  idTaldeak: idTaldeak
               };
    
              argazkiak[i] = argazkia;
            };
          });





          res.render('taldekideakadmin.handlebars',{title: "Taldekideak", idTaldeak: idTaldeak, irudiak:argazkiak, data:rows, talde:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       
      });   
    });
  });
};

exports.taldekideakbilatupartaide = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  req.getConnection(function(err,connection){

    connection.query('SELECT * FROM taldeak, mailak where idMailaTalde=idMailak and idTaldeak = ? and idElkarteakTalde = ?',[idTaldeak,id],function(err,rowst) {
       
     connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, ekintzak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idEkintzakTalde = idEkintzak and idDenboraldiaEkintza= ? and idTaldeakKide = ? and idElkarteakTalde = ? order by noiztikEkintza desc',[idDenboraldia,idTaldeak,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );


         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldekideakpartaide.handlebars',{title: "Taldekideak", data:rows, talde:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       
      });   
    });
  });
};


exports.taldekideakbilatupartaideargazkiekin = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  req.getConnection(function(err,connection){

    connection.query('SELECT * FROM taldeak, mailak where idMailaTalde=idMailak and idTaldeak = ? and idElkarteakTalde = ?',[idTaldeak,id],function(err,rowst) {
       
     connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, ekintzak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idEkintzakTalde = idEkintzak and idDenboraldiaEkintza= ? and idTaldeakKide = ? and idElkarteakTalde = ? order by noiztikEkintza desc',[idDenboraldia,idTaldeak,id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
            
            var path = require('path'),
            fs = require('fs'),
            formidable = require('formidable');
            var bcrypt = require('bcrypt-nodejs');

            var dataDir = path.normalize(path.join(__dirname, '../public', 'data'));
            console.log(dataDir);
            var taldeargazkiakDir = path.join(dataDir, 'taldeargazkiak');
            fs.existsSync(dataDir) || fs.mkdirSync(dataDir); 
            fs.existsSync(taldeargazkiakDir) || fs.mkdirSync(taldeargazkiakDir);

            var argazkiak = [];
            var argazkia = {};
            var idKirolElkarteak = req.session.idKirolElkarteak;
            var elkartedir = taldeargazkiakDir + '/' + idKirolElkarteak + '/' + idTaldeak; 
            fs.existsSync(elkartedir) || fs.mkdirSync(elkartedir);
            fs.readdir(elkartedir, function (err, files) {
            if (err) throw err;
            console.log("/usr files: " + files);
            for (var i in files){
              //argazkiak[i] = files[i];
              console.log(files[i]);
              argazkia = {
                  files    : files[i],
                  idKirolElkarteak  : req.session.idKirolElkarteak,
                  idTaldeak: idTaldeak
               };
    
              argazkiak[i] = argazkia;
            };
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldekideakpartaide.handlebars',{title: "Taldekideak", data:rows, irudiak:argazkiak, talde:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, atalak: req.session.atalak});                       
      });   
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


exports.taldeargazkiaigo = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  var fitxategiIzena;
  var path = require('path'),
            fs = require('fs'),
            formidable = require('formidable');
            var bcrypt = require('bcrypt-nodejs');
  var dataDir = path.normalize(path.join(__dirname, '../public', 'data'));
  fs.existsSync(dataDir) || fs.mkdirSync(dataDir); 
  var taldeargazkiakDir = path.join(dataDir, 'taldeargazkiak');
  fs.existsSync(taldeargazkiakDir) || fs.mkdirSync(taldeargazkiakDir);

       
          var taldedir = taldeargazkiakDir + '/' + id + '/' + idTaldeak;
          //fs.rmdirSync(taldedir);


        //ARGAZKIAK EZABATZEKO
       // var deleteFolderRecursive = function(path) {
        if( fs.existsSync(taldedir) ) {
          fs.readdirSync(taldedir).forEach(function(file,index){
              var curPath = taldedir + "/" + file;
        //if(fs.lstatSync(curPath).isDirectory()) { // recurse
       // deleteFolderRecursive(curPath);
        //      } else { // delete file
              fs.unlinkSync(curPath);
             // }
            //});
        //fs.rmdirSync(path);
          });
        //};
        };  




          fs.existsSync(taldedir) || fs.mkdirSync(taldedir);
          var form = new formidable.IncomingForm();
          form.keepExtensions = true;
          form.uploadDir = taldedir;
          form.on('fileBegin', function(name, file){
            //rename the incoming file to the file's name
            file.path = form.uploadDir + "/" + file.name;
            fitxategiIzena=file.name;

          });

          form.parse(req, function(err, fields, files){
            console.log(fields);
            console.log(files);
          //if(err) return res.redirect(303, '/error');
            if(err) {
              req.session.flash = {
                type: 'danger',
                intro: 'Oops!',
                message: 'Berriz saiatu',
              };
              return res.redirect(303, '/admin/agiriak');
            }
            //var argazkia = files.argazkia;
            //var dir = argazkiakDir + '/' + idKirolElkarteak;
            //var path = dir + '/' + fields.izena;
            //fs.mkdirSync(dir);
            //fs.renameSync(argazkia.path, dir + '/' + fields.izena);
            //saveContestEntry('vacation-photo', fields.email,
            //   req.params.year, req.params.month, path);
            req.session.flash = {
              type: 'success',
              intro: 'Oso ondo!',
              message: 'Argazkia igo da.',
            };
         
         //console.log("Berriak:" +JSON.stringify(rows));
      //res.render('taldeargazkia.handlebars', {title : 'KirolElkarteak-Taldeak gehitu', idTaldeak:idTaldeak, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                res.redirect('/admin/taldekideak/'+idTaldeak);

         
  });
};





////////////////////////////////////////////////// NERIA



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

