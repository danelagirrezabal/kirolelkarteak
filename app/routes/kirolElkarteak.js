var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var VALID_TEL_REGEX = /^[0-9-()+]{3,20}/;

 var path = require('path'),
  fs = require('fs'),
  formidable = require('formidable');
  var bcrypt = require('bcrypt-nodejs');
  var md = require('marked');

// make sure data directory exists
//var dataDir = path.normalize(path.join(__dirname, '..', 'data'));
var dataDir = path.normalize(path.join(__dirname, '../public', 'data'));
console.log(dataDir);
var argazkiakDir = path.join(dataDir, 'argazkiak');
fs.existsSync(dataDir) || fs.mkdirSync(dataDir); 
fs.existsSync(argazkiakDir) || fs.mkdirSync(argazkiakDir);

var agiriakDir = path.join(dataDir, 'agiriak');
fs.existsSync(agiriakDir) || fs.mkdirSync(agiriakDir);


exports.aukeratzeko = function(req, res){

  req.getConnection(function (err, connection) {
      if (err)
              console.log("Error connection : %s ",err );
      //Txapelketa bat pruebetako ixkutatuta idKirolElkarteak != 42
      connection.query('SELECT idElkarteak, izenaElk FROM elkarteak',function(err,rows)  {
        if (err)
                console.log("Error query : %s ",err ); 
        console.log("kirolElkarteak : " + JSON.stringify(rows)); 
        res.render('kirolElkarteakaukeratzeko.handlebars', {title : 'kirolElkarteak-Elkartea aukeratzeko', kirolElkarteak : rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
      });   
  });  
};

exports.aukeratu = function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));

  req.session.idKirolElkarteak = req.body.sKirolElkarteak;

return res.redirect('/');
  
};

exports.sortu = function(req,res){
    var idKirolElkarteak;
    var now= new Date();
    var input = JSON.parse(JSON.stringify(req.body));
    res.locals.flash = null; //Erroreentzat
 
 /* if(!req.body.emailard.match(VALID_EMAIL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emaila ez da zuzena',
    };
   // return res.redirect(303, '/izenematea');
  }
  
  if(res.locals.flash != null){

      console.log(req.body.taldeizena); 
         return res.render('txapelketaksortu.handlebars', {
            txapelketaizena: req.body.txapelketaizena,
            taldeizena: req.body.taldeizena,
            emailard   : req.body.emailard,
            pasahitza: req.body.pasahitza

          } );
  };
*/
    req.getConnection(function (err, connection) {
      //2016-05-31
      if (err)
              console.log("Error connection : %s ",err ); 
            //

      connection.query('SELECT * FROM elkarteak where izenaElk = ?',[req.body.izenaElk],function(err,rows)  {
          
        if(err || rows.length != 0){
        //  res.redirect('/izenematea');

          res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste elkarte izen bat sartu!',
          };
          return res.render('kirolElkarteaksortu.handlebars', { //Errorea badago testu kutxan datuak beteta agertzeko, ez hutsa
            izenaElk    : req.body.izenaElk,
            ifz : req.body.ifz,
            helbideaElk: req.body.helbideaElk,
            postaKodeaElk : req.body.postaKodeaElk,
            herriaElk : req.body.herriaElk,
            telefonoaElk : req.body.telefonoaElk,
            emailElk : req.body.emailElk

          } );
        }

        var data = {
            izenaElk    : input.izenaElk,
            ifz : input.ifz,
            helbideaElk: input.helbideaElk,
            postaKodeaElk : input.postaKodeaElk,
            herriaElk : input.herriaElk,
            telefonoaElk : input.telefonoaElk,
            emailElk : input.emailElk

        };
        
        var query = connection.query("INSERT INTO elkarteak set ? ",data, function(err, rows)
        {
          if (err)
              console.log("Error inserting : %s ",err ); 

          idKirolElkarteak = rows.insertId;

          // Generate password hash
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(input.pasahitzaPart, salt);

          var data = { //Kirol elkartearentzat admin bat sortuko da Kirol elkarteko datuekin
            izenaPart    : input.izenaPart,
            abizena1Part : input.izenaElk,
            helbideaPart: input.helbideaElk,
            postaKodeaPart : input.postaKodeaElk,
            herriaPart : input.herriaElk,
            telefonoaPart : input.telefonoaElk,
            emailPart : input.emailElk,
            idElkarteakPart : idKirolElkarteak,
            jaiotzeDataPart: now,
            pasahitzaPart:   password_hash,                    
            balidatutaPart : "admin"
        };
        debugger;
        console.log(data);
        var query = connection.query("INSERT INTO partaideak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         else{
         var to = input.emailElk;
         var subj = "Kaixo administratzaile " + input.izenaPart;
         var body = "Elkarte izena: " +input.izenaElk+ "\n Emaila: " + input.emailElk + "\n Pasahitza: " + input.pasahitzaPart;
          emailService.send(to, subj, body);
        }
          //res.redirect('/taldeak');
          res.redirect(303, '/admin/kirolElkarteak');
        }); 
         //res.redirect(303, '/admin/kirolElkarteak');
        });
      });
    });    
};

exports.editatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id= req.session.idKirolElkarteak;
    req.getConnection(function (err, connection) {
 
        var query = connection.query('SELECT * FROM elkarteak where idElkarteak = ?',[id],function(err,rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
          
          req.session.idKirolElkarteak = rows[0].idElkarteak;
          res.render('kirolElkarteakeditatu.handlebars', {title: "KirolElkarteak-Elkarteak editatu",
            idKirolElkarteak : id,
            izenaElk    : rows[0].izenaElk,
            ifz : rows[0].ifz,
            helbideaElk: rows[0].helbideaElk,
            postaKodeaElk : rows[0].postaKodeaElk,
            herriaElk : rows[0].herriaElk,
            telefonoaElk : rows[0].telefonoaElk,
            emailElk : rows[0].emailElk, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,
            partaidea: req.session.partaidea
            });
          
        });
        
       // console.log(query.sql); 
    
    });
};

exports.aldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id= req.session.idKirolElkarteak;
    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaElk    : input.izenaElk,
            ifz : input.ifz,
            helbideaElk: input.helbideaElk,
            postaKodeaElk : input.postaKodeaElk,
            herriaElk : input.herriaElk,
            telefonoaElk : input.telefonoaElk,
            emailElk : input.emailElk
        };
        
        console.log(data);
        var query = connection.query("UPDATE elkarteak set ? WHERE idElkarteak = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/admin/berriak');
          
        });
        
       // console.log(query.sql); 
    
    });
};

//////////////  BERRIAK  ////////////////

exports.berriaksortu = function(req,res){
    
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
            
            izenburuaBerria    : input.izenburuaBerria,
            testuaBerria   : input.testuaBerria,
            dataBerria: now,
            idElkarteakBerria : id,
            zenbakiBerria: 0
        };
        
  
        var query = connection.query("INSERT INTO berriak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
  /*        if(input.bidali){
              var query = connection.query('SELECT * FROM taldeak where idtxapeltalde = ?',[id],function(err,rows)
              {
                for (var i in rows){
                  var to = rows[i].emailard;
                  var subj = req.session.txapelketaizena+ "-n berria: "+input.izenburua;
                  var body = "<h2>"+input.izenburua+"</h2>\n" + 
                              "<p>"+ input.testua+ "</p> \n"+
                              "<h3> Gehiago jakin nahi baduzu, sartu: http://"+hosta+"</h3>" ;
                  emailService.send(to, subj, body);
                }
              });
          }*/
          res.redirect('/admin/berriak');
        });
        
       // console.log(query.sql); 
    
    });
};

exports.berriakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;

  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM berriak where idElkarteakBerria = ? order by dataBerria desc',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );

          //for (var i in rows){
            //rows[i].testuaBerria=rows[i].testuaBerria.replace(/\r?\n/g, "<br>");

          //}
          res.render('index.handlebars',{title: "kirolElkarteak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        });                        
      });   
  });
};


exports.berriakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM berriak where idElkarteakBerria = ? order by dataBerria desc',[id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );
         
         console.log("Berriak:" +JSON.stringify(rows));
          res.render('berriak.handlebars',{title: "Berriak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
        });                        
      });   
  });
};

exports.berriakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idBerriak = req.params.idBerriak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM berriak WHERE idElkarteakBerria = ? and idBerriak = ?',[id,idBerriak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('berriakeditatu.handlebars', {page_title:"Berriak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.berriakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idBerriak = req.params.idBerriak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenburuaBerria    : input.izenburuaBerria,
            testuaBerria   : input.testuaBerria,
            //dataBerria: now,
            idElkarteakBerria : id
            //zenbakiBerria: input.zenbakiBerria
            //argazkia
        };
        
        connection.query("UPDATE berriak set ? WHERE idElkarteakBerria = ? and idBerriak = ? ",[data,id,idBerriak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/berriak');
          
        });
    
    });
};

exports.berriakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idBerriak = req.params.idBerriak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM berriak  WHERE idElkarteakBerria = ? and idBerriak = ?",[id,idBerriak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/berriak');
             
        });
        
     });
};

//////////////  EDUKIAK  ////////////////

exports.edukiaksortu = function(req,res){
    var idAzpiAtalak = req.params.idAzpiAtalak;
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
            
            izenburuaEdukia    : input.izenburuaEdukia,
            testuaEdukia   : input.testuaEdukia,
            dataEdukia: now,
            idElkarteakEdukia : id,
            idAzpiAtalakEdukia: idAzpiAtalak,
            zenbakiEdukia: 0
        };
        
  
        var query = connection.query("INSERT INTO edukiak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
  /*        if(input.bidali){
              var query = connection.query('SELECT * FROM taldeak where idtxapeltalde = ?',[id],function(err,rows)
              {
                for (var i in rows){
                  var to = rows[i].emailard;
                  var subj = req.session.txapelketaizena+ "-n berria: "+input.izenburua;
                  var body = "<h2>"+input.izenburua+"</h2>\n" + 
                              "<p>"+ input.testua+ "</p> \n"+
                              "<h3> Gehiago jakin nahi baduzu, sartu: http://"+hosta+"</h3>" ;
                  emailService.send(to, subj, body);
                }
              });
          }*/
          res.redirect('/admin/edukiak');
        });
        
       // console.log(query.sql); 
    
    });
};

exports.edukiakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idAtalak = req.params.idAtalak;

  if (idAtalak == null)
    idAtalak=req.session.atalak[0].idAtalak;

  //var atalak = []; //egunak
  //var atala = {}; //eguna
  var azpiAtalak = []; //lekuak
  var azpiAtala = {}; //lekua
  var edukiak = []; //partiduak
  var j,t=0;
  //var k = 0;
  var vAtalak, vAzpiAtalak;
 
  req.getConnection(function(err,connection){
       
     
     connection.query('SELECT * FROM edukiak, azpiAtalak where idElkarteakEdukia = ? and idAzpiAtalakEdukia = idAzpiAtalak and idAtalakAzpiAtala = ? order by zenbakiAzpiAtala asc, zenbakiEdukia asc,  dataEdukia desc',[id, idAtalak],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          

          //for (var i in rows){
            //rows[i].testuaBerria=rows[i].testuaBerria.replace(/\r?\n/g, "<br>");

          //}


          for (var i in rows) {
  
          
          if(vAzpiAtalak != rows[i].idAzpiAtalak){
            if(vAzpiAtalak !=null){
              azpiAtala.edukiak = edukiak;
              azpiAtalak[t] = azpiAtala;
              t++;
            }
            vAzpiAtalak = rows[i].idAzpiAtalak;
            edukiak = []; 
            j=0;
          
            azpiAtala = {
                  idAzpiAtalak    : rows[i].idAzpiAtalak,
                  izenaAzpiAtala : rows[i].izenaAzpiAtala
               };
               
          }

          var testuahtml = md(rows[i].testuaEdukia);
          //console.log("HTML:   " + JSON.stringify(testuahtml));
          edukiak[j] = {
                  idEdukiak    : rows[i].idEdukiak,
                  izenburuaEdukia : rows[i].izenburuaEdukia,
                  testuaEdukia: rows[i].testuaEdukia,
                  htmlEdukia : testuahtml
               };
          j++;
       
     }
        if(vAzpiAtalak !=null){
              azpiAtala.edukiak = edukiak;
              azpiAtalak[t] = azpiAtala;
              //atala.azpiAtalak = azpiAtalak;
              //atalak[k] = atala;
              //k++;
            }


          //console.log("Rows:" +JSON.stringify(rows));
          //connection.end();

      if(req.session.erabiltzaile == "admin"){
          res.redirect('/kirolElkarteakeditatu');
      }else{
          res.render('edukiakikusi.handlebars',{title: "kirolElkarteak", azpiAtalak:azpiAtalak, data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});

      }


          //connection.end();
        });  

      });   

  });
           //res.render('edukiakikusi.handlebars',{title: "kirolElkarteak", jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea});

};   

     //connection.query('SELECT * FROM (atalak LEFT JOIN azpiAtalak ON idAtalak=idAtalakAzpiAtala) LEFT JOIN edukiak ON idAzpiAtalak=idAzpiAtalakEdukia where idAtalak=idAtalakAzpiAtala and idAzpiAtalak=idAzpiAtalakEdukia and idElkarteakEdukia = ? order by zenbakiAtala asc, zenbakiAzpiAtala asc, zenbakiEdukia asc, dataEdukia desc',[id],function(err,rows) {
     //connection.query('SELECT * FROM atalak LEFT JOIN (azpiAtalak INNER JOIN edukiak ON idAzpiAtalak=idAzpiAtalakEdukia) ON idAtalak=idAtalakAzpiAtala  where idElkarteakEdukia = ? order by zenbakiAtala asc, zenbakiAzpiAtala asc, zenbakiEdukia asc, dataEdukia desc',[id],function(err,rows) {


exports.edukiakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var atalak = []; //egunak
  var atala = {}; //eguna
  var azpiAtalak = []; //lekuak
  var azpiAtala = {}; //lekua
  var edukiak = []; //partiduak
  var j,t;
  var k = 0;
  var vAtalak, vAzpiAtalak;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT *,DATE_FORMAT(dataEdukia,"%Y-%m-%d") AS dataEdukia FROM (atalak LEFT JOIN azpiAtalak ON idAtalak=idAtalakAzpiAtala) LEFT JOIN edukiak ON idAzpiAtalak=idAzpiAtalakEdukia where idAtalak=idAtalakAzpiAtala and idAzpiAtalak=idAzpiAtalakEdukia and idElkarteakEdukia = ? order by zenbakiAtala asc, zenbakiAzpiAtala asc, zenbakiEdukia asc, dataEdukia desc',[id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );
         
         //console.log("Edukiak:" +JSON.stringify(rows));


        // debugger;



        for (var i in rows) {
  
          if(vAtalak != rows[i].idAtalak){
            if(vAtalak !=null){
              azpiAtala.edukiak = edukiak;
              azpiAtalak[t] = azpiAtala;
              atala.azpiAtalak = azpiAtalak;
              atalak[k] = atala;
              k++;
            }
            vAtalak = rows[i].idAtalak;
            vAzpiAtalak = null;
            azpiAtalak = []; 
            t=0;
            atala = {
                  idAtalak    : rows[i].idAtalak,
                  izenaAtala  : rows[i].izenaAtala,
                  zenbakiAtala: rows[i].zenbakiAtala
               };
               
          }
          if(vAzpiAtalak != rows[i].idAzpiAtalak){
            if(vAzpiAtalak !=null){
              azpiAtala.edukiak = edukiak;
              azpiAtalak[t] = azpiAtala;
              t++;
            }
            vAzpiAtalak = rows[i].idAzpiAtalak;
            edukiak = []; 
            j=0;
          
            azpiAtala = {
                  idAzpiAtalak    : rows[i].idAzpiAtalak,
                  izenaAzpiAtala : rows[i].izenaAzpiAtala,
                  zenbakiAzpiAtala: rows[i].zenbakiAzpiAtala
               };
               
          }
          edukiak[j] = {
                  idEdukiak    : rows[i].idEdukiak,
                  izenburuaEdukia : rows[i].izenburuaEdukia,
                  dataEdukia    : rows[i].dataEdukia,
                  zenbakiEdukia : rows[i].zenbakiEdukia
               };
          j++;
       
     }
        if(vAtalak !=null){
              azpiAtala.edukiak = edukiak;
              azpiAtalak[t] = azpiAtala;
              atala.azpiAtalak = azpiAtalak;
              atalak[k] = atala;
              k++;
            }

//console.log("Atalak:" +JSON.stringify(atalak));

          res.render('edukiak.handlebars',{title: "Edukiak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        });                        
      });   
  });
};

exports.edukiakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idEdukiak = req.params.idEdukiak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM edukiak WHERE idElkarteakEdukia = ? and idEdukiak = ?',[id,idEdukiak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('edukiakeditatu.handlebars', {page_title:"Edukiak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.edukiakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idEdukiak = req.params.idEdukiak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenburuaEdukia    : input.izenburuaEdukia,
            testuaEdukia   : input.testuaEdukia,
            //dataBerria: now,
            idElkarteakEdukia : id
            //zenbakiBerria: input.zenbakiBerria
            //argazkia
        };
        
        connection.query("UPDATE edukiak set ? WHERE idElkarteakEdukia = ? and idEdukiak = ? ",[data,id,idEdukiak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/edukiak');
          
        });
    
    });
};

exports.edukiakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idEdukiak = req.params.idEdukiak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM edukiak  WHERE idElkarteakEdukia = ? and idEdukiak = ?",[id,idEdukiak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/edukiak');
             
        });
        
     });
};


//////////////  ATALAK  ////////////////

exports.atalaksortu = function(req,res){
    
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
            
            izenaAtala    : input.izenaAtala,
            zenbakiAtala   : input.zenbakiAtala,
            idElkarteakAtala : id,
        };
        
  
        var query = connection.query("INSERT INTO atalak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
  /*        if(input.bidali){
              var query = connection.query('SELECT * FROM taldeak where idtxapeltalde = ?',[id],function(err,rows)
              {
                for (var i in rows){
                  var to = rows[i].emailard;
                  var subj = req.session.txapelketaizena+ "-n berria: "+input.izenburua;
                  var body = "<h2>"+input.izenburua+"</h2>\n" + 
                              "<p>"+ input.testua+ "</p> \n"+
                              "<h3> Gehiago jakin nahi baduzu, sartu: http://"+hosta+"</h3>" ;
                  emailService.send(to, subj, body);
                }
              });
          }*/
          res.redirect('/admin/atalak');
        });
        
       // console.log(query.sql); 
    
    });
};

exports.atalakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;

  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM atalak where idElkarteakAtala = ? order by zenbakiAtala asc',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );

          //for (var i in rows){
            //rows[i].testuaBerria=rows[i].testuaBerria.replace(/\r?\n/g, "<br>");

          //}
          res.render('index.handlebars',{title: "kirolElkarteak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
        });                        
      });   
  });
};

exports.atalakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM atalak where idElkarteakAtala = ? order by zenbakiAtala asc',[id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );
         
         console.log("Atalak:" +JSON.stringify(rows));
          res.render('atalak.handlebars',{title: "Atalak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
        });                        
      });   
  });
};

exports.atalakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idAtalak = req.params.idAtalak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM atalak WHERE idElkarteakAtala = ? and idAtalak = ?',[id,idAtalak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('atalakeditatu.handlebars', {page_title:"Atalak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.atalakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idAtalak = req.params.idAtalak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaAtala    : input.izenaAtala,
            zenbakiAtala   : input.zenbakiAtala,
            //dataBerria: now,
            idElkarteakAtala : id
            //zenbakiBerria: input.zenbakiBerria
            //argazkia
        };
        
        connection.query("UPDATE atalak set ? WHERE idElkarteakAtala = ? and idAtalak = ? ",[data,id,idAtalak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/atalak');
          
        });
    
    });
};

exports.atalakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idAtalak = req.params.idAtalak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM atalak  WHERE idElkarteakAtala = ? and idAtalak = ?",[id,idAtalak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/atalak');
             
        });
        
     });
};

//////////////  AZPIATALAK  ////////////////

exports.azpiAtalaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("Bidali:" + input.bidali);
    var id = req.session.idKirolElkarteak;
    var idAtalak = req.params.idAtalak;
    var now= new Date();

    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaAzpiAtala    : input.izenaAzpiAtala,
            zenbakiAzpiAtala   : input.zenbakiAzpiAtala,
            idElkarteakAzpiAtala : id,
            idAtalakAzpiAtala: idAtalak
        };
        
  
        var query = connection.query("INSERT INTO azpiAtalak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
  /*        if(input.bidali){
              var query = connection.query('SELECT * FROM taldeak where idtxapeltalde = ?',[id],function(err,rows)
              {
                for (var i in rows){
                  var to = rows[i].emailard;
                  var subj = req.session.txapelketaizena+ "-n berria: "+input.izenburua;
                  var body = "<h2>"+input.izenburua+"</h2>\n" + 
                              "<p>"+ input.testua+ "</p> \n"+
                              "<h3> Gehiago jakin nahi baduzu, sartu: http://"+hosta+"</h3>" ;
                  emailService.send(to, subj, body);
                }
              });
          }*/
          res.redirect('/admin/azpiAtalak/' + idAtalak);
        });
        
       // console.log(query.sql); 
    
    });
};

exports.azpiAtalakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;

  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM azpiAtalak where idElkarteakAzpiAtala = ? order by zenbakiAzpiAtala asc',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );

          //for (var i in rows){
            //rows[i].testuaBerria=rows[i].testuaBerria.replace(/\r?\n/g, "<br>");

          //}
          res.render('index.handlebars',{title: "kirolElkarteak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
        });                        
      });   
  });
};

exports.azpiAtalakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idAtalak = req.params.idAtalak;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM azpiAtalak where idElkarteakAzpiAtala = ? and idAtalakAzpiAtala = ? order by zenbakiAzpiAtala asc',[id, idAtalak],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );
         
         console.log("AzpiAtalak:" +JSON.stringify(rows));
          res.render('azpiatalak.handlebars',{title: "AzpiAtalak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, idAtalak: idAtalak});
        });                        
      });   
  });
};

exports.azpiAtalakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idAzpiAtalak = req.params.idAzpiAtalak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM azpiAtalak WHERE idElkarteakAzpiAtala = ? and idAzpiAtalak = ?',[id,idAzpiAtalak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('azpiatalakeditatu.handlebars', {page_title:"AzpiAtalak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.azpiAtalakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idAzpiAtalak = req.params.idAzpiAtalak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaAzpiAtala    : input.izenaAzpiAtala,
            zenbakiAzpiAtala   : input.zenbakiAzpiAtala,
            //dataBerria: now,
            idElkarteakAzpiAtala : id,
            //zenbakiBerria: input.zenbakiBerria
            //argazkia
        };
        
        connection.query("UPDATE azpiAtalak set ? WHERE idElkarteakAzpiAtala = ? and idAzpiAtalak = ? ",[data,id,idAzpiAtalak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/edukiak');
          
        });
    
    });
};

exports.azpiAtalakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idAzpiAtalak = req.params.idAzpiAtalak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM azpiAtalak  WHERE idElkarteakAzpiAtala = ? and idAzpiAtalak = ?",[id,idAzpiAtalak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/edukiak');
             
        });
        
     });
};

///////////////// AGIRIAK ///////////////////////////

exports.agiriaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var now= new Date();
    console.log(input);
    var publikoa = 0;

    /*var elkartedir = agiriakDir + '/' + id;
          fs.existsSync(elkartedir) || fs.mkdirSync(elkartedir);
          var form = new formidable.IncomingForm();
          form.keepExtensions = true;
          form.uploadDir = elkartedir;
          form.parse(req, function(err, fields, files){
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
              message: 'Agiria igo da.',
            };*/

    if (input.publiko){
        publikoa = 1;
    };

    req.getConnection(function (err, connection) {
        
        var data = {
            
            atalaAgiria    : input.atalaAgiria,
            izenaAgiria   : input.izenaAgiria,
            urlAgiria : input.urlAgiria,
            dataAgiria: now,
            publikoAgiria : publikoa,
            idElkarteakAgiria : id,
            idDenboraldiaAgiria : idDenboraldia
        };
        
  
        var query = connection.query("INSERT INTO agiriak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );


          
         
          res.redirect('/admin/agiriak');
            //res.render('agiriakigo.handlebars', {page_title:"Agiriak igo",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});

        });
        
       // console.log(query.sql); 
    
    });
//});
};


exports.agiriakigo = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var now= new Date();
    console.log(input);
    var fitxategiIzena;

    var elkartedir = agiriakDir + '/' + id;
          fs.existsSync(elkartedir) || fs.mkdirSync(elkartedir);
          var form = new formidable.IncomingForm();
          form.keepExtensions = true;
          form.uploadDir = elkartedir;
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
              message: 'Agiria igo da.',
            };
          
         
          //res.redirect('/admin/agiriak');
          res.render('agiriaksortu.handlebars', {page_title:"Agiriak igo", urlAgiria: fitxategiIzena, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});


        });
        
       // console.log(query.sql); 
    
    //});
//});
};


/*
exports.agiriakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;

  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM agiriak where idElkarteakAgiria = ? order by dataAgiria desc',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );
         
          res.render('index.handlebars',{title: "kirolElkarteak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
        });                        
      });   
  });
};*/

exports.agiriakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT *, DATE_FORMAT(dataAgiria,"%Y/%m/%d") AS dataAgiria FROM agiriak where idElkarteakAgiria = ? order by publikoAgiria, dataAgiria desc',[id],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );
          
          for(var i in rows){
            if (rows[i].publikoAgiria == 1){
                rows[i].publikoAgiria = "BAI";
            }else{
                rows[i].publikoAgiria = "EZ";
            }
          }
         
          res.render('agiriakadmin.handlebars',{title: "Agiriak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
        });                        
      });   
  });
};

exports.agiriakbilatupartaide = function(req, res){
  var id = req.session.idKirolElkarteak;
  var publikoa = 1;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT *, DATE_FORMAT(dataAgiria,"%Y/%m/%d") AS dataAgiria FROM agiriak, elkarteak where idElkarteakAgiria = ? and idElkarteak = idElkarteakAgiria and publikoAgiria = ? order by dataAgiria desc',[id, publikoa],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
    
         
          res.render('agiriak.handlebars',{title: "Agiriak", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
      });                        
        
  });
};

exports.agiriakeditatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idAgiriak = req.params.idAgiriak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT *,DATE_FORMAT(dataAgiria,"%Y/%m/%d") AS dataAgiria FROM agiriak WHERE idElkarteakAgiria = ? and idAgiriak = ?',[id,idAgiriak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

            for(var i in rows){
              if (rows[i].publikoAgiria == 1){
                rows[i].publikoaDa = true;
              }else{
                rows[i].publikoDa = false;
              }
            }

            res.render('agiriakeditatu.handlebars', {page_title:"Agiriak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.agiriakaldatu = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idAgiriak = req.params.idAgiriak;
    var publikoa = 0;

    if (input.publiko){
        publikoa = 1;
    };
    
    req.getConnection(function (err, connection) {
        
        var data = {  
            atalaAgiria    : input.atalaAgiria,
            izenaAgiria   : input.izenaAgiria,
            urlAgiria : input.urlAgiria,
            dataAgiria: input.dataAgiria,
            publikoAgiria : publikoa

        };
        
        connection.query("UPDATE agiriak set ? WHERE idElkarteakAgiria = ? and idAgiriak = ? ",[data,id,idAgiriak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/agiriak');
          
        });
    
    });
};

exports.agiriakaldatufitxategi = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idAgiriak = req.params.idAgiriak;

    var now= new Date();
    console.log(input);
    var fitxategiIzena;

    var elkartedir = agiriakDir + '/' + id;
          fs.existsSync(elkartedir) || fs.mkdirSync(elkartedir);
          var form = new formidable.IncomingForm();
          form.keepExtensions = true;
          form.uploadDir = elkartedir;
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
              message: 'Agiria igo da.',
            };
    
    req.getConnection(function (err, connection) {
        
        var data = {  
            urlAgiria : fitxategiIzena,
        };
        
        connection.query("UPDATE agiriak set ? WHERE idElkarteakAgiria = ? and idAgiriak = ? ",[data,id,idAgiriak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/agiriak');
          
        });
    
    });
  });
};

exports.agiriakezabatu = function(req,res){
     var id = req.session.idKirolElkarteak;
     var idAgiriak = req.params.idAgiriak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM agiriak  WHERE idElkarteakAgiria = ? and idAgiriak = ?",[id,idAgiriak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/agiriak');
             
        });
        
     });
};



//////////////////// ARGAZKIAK ///////////////////////////


exports.argazkiakigo = function(req, res){
  var idKirolElkarteak = req.session.idKirolElkarteak;
    var elkartedir = argazkiakDir + '/' + idKirolElkarteak;
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);

  //var txapelketadir = path.join(argazkiakDir, idKirolElkarteak);
  fs.existsSync(elkartedir) || fs.mkdirSync(elkartedir);
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = elkartedir;
    form.parse(req, function(err, fields, files){
        //if(err) return res.redirect(303, '/error');
        if(err) {
            res.session.flash = {
                type: 'danger',
                intro: 'Oops!',
                message: 'Berriz saiatu',
            };
            return res.redirect(303, '/admin/argazkiak');
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
        return res.redirect(303, '/admin/argazkiak');
    });
};

exports.argazkiakikusi = function(req, res){
  var argazkiak = [];
  var argazkia = {};
  debugger;
  var idKirolElkarteak = req.session.idKirolElkarteak;
  var elkartedir = argazkiakDir + '/' + idKirolElkarteak;
  //var txapelketadir = path.join(argazkiakDir, idKirolElkarteak);
  fs.existsSync(elkartedir) || fs.mkdirSync(elkartedir);
  fs.readdir(elkartedir, function (err, files) {
  if (err) throw err;
  console.log("/usr files: " + files);
  for (var i in files){
    //argazkiak[i] = files[i];
    console.log(files[i]);
    argazkia = {
                  files    : files[i],
                  idKirolElkarteak  : req.session.idKirolElkarteak
               };
    
    argazkiak[i] = argazkia;
  }
  console.log(JSON.stringify(argazkiak));
  res.render('argazkiak.handlebars', {title: "KirolElkarteak - Argazkiak", irudiak:argazkiak, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
  });
};

exports.taldeargazkiakikusi = function(req, res){
  var argazkiak = [];
  var argazkia = {};
  var idKirolElkarteak = req.session.idKirolElkarteak;
  var elkartedir = argazkiakDir + '/' + idKirolElkarteak;
  //var txapelketadir = path.join(argazkiakDir, idKirolElkarteak);
  fs.existsSync(elkartedir) || fs.mkdirSync(elkartedir);
  fs.readdir(elkartedir, function (err, files) {
  if (err) throw err;
  console.log("/usr files: " + files);
  for (var i in files){
    //argazkiak[i] = files[i];
    console.log(files[i]);
    argazkia = {
                  files    : files[i],
                  idKirolElkarteak  : req.session.idKirolElkarteak
               };
    
    argazkiak[i] = argazkia;
  }
  console.log(JSON.stringify(argazkiak));
  res.render('argazkiak.handlebars', {title: "KirolElkarteak - Argazkiak", irudiak:argazkiak, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
  });
};


//////////////// KONTAKTUA ////////////////////////

exports.kontaktuabidali = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(req.body);
    res.locals.flash = null;

  if(!req.body.email.match(VALID_EMAIL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emaila ez da zuzena',
    };
  }

  if(res.locals.flash != null){ //Errore kontrola
         return res.render('kontaktua.handlebars', {
            izenabizen: req.body.izenabizen,
            telef   : req.body.telef,
            email   : req.body.email,
            herri   : req.body.herri,
            azalpena    : input.azalpena,
            

          } );
       }
  
  else {

    req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM elkarteak where idElkarteak = ?',[req.session.idKirolElkarteak],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
    
        var to = rows[0].emailElk;
         var subj = "Web orriko zalantza " +rows[0].izenaElk+":  " + input.izenabizen;
         var body = "<p><b>Izen abizenak:</b>  " + input.izenabizen + "</p>";
          body += "<p><b>Emaila:</b>  " + input.email + "</p>";
          body += "<p><b>Telefonoa:</b>  " + input.telef + "</p>";
          body += "<p><b>Herria:</b>  " + input.herri+ "</p>";
          body += "<p><b>Azalpena:</b> " +"<pre>"+ input.azalpena + "</pre></p>";
          console.log("input:" + input.izenabizen);
          emailService.send(to, subj, body);

          res.locals.flash = {
              type: 'success',
              intro: 'Bidalita!',
              message: 'Egun gutxiren buruan erantzuna jasoko duzu!',
          };
              
          res.redirect(303,'/');
       });
     });
    }
};



exports.jokalariakikusi = function(req,res){

  req.getConnection(function(err,connection){
      connection.query('SELECT * FROM taldeak, jokalariak WHERE idtaldeak = idtaldej and idtxapeltalde = ? order by jokalariizena, idtaldeak',[req.session.idKirolElkarteak],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );

        res.render('jokalariakadmin.handlebars', {title : 'Txaparrotan-JokalariakAdmin', data2:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
    });
  });
}

exports.mantenimentu = function(req, res){
  var now= new Date();

  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak WHERE idtaldeak > 172',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
          for(var i in rows){
            // Generate password hash
            var salt = bcrypt.genSaltSync();
            var password_hash = bcrypt.hashSync(rows[i].pasahitza, salt);

            var data = {
            
            balidatuta : 1,
            idtxapeltalde   : 20,
            sortzedata   : now,
            pasahitza   : password_hash
        
            };
        
            connection.query("UPDATE taldeak set ? WHERE idtaldeak = ?  ",[data,rows[i].idtaldeak], function(err, rows)
            {
                if(err)

                  console.log("Error Updating : %s ",err );
             
              
            });
          }
                           
         });
                 
    }); 
};

exports.lekuakbilatu = function(req, res){
  
  var id = req.session.idKirolElkarteak;

  req.getConnection(function(err,connection){     
   
        connection.query('SELECT * FROM lekuak where idElkarteakLeku= ?',[id],function(err,rows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
         
          res.render('lekuak.handlebars', {title : 'KirolElkarteak-Lekuak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );

       });
    });
  
};

exports.lekuakeditatu = function(req, res){

  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idLekuak = req.params.idLekuak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM lekuak WHERE idElkarteakLeku = ? and idLekuak = ?',[id,idLekuak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('lekuakeditatu.handlebars', {page_title:"Lekuak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.lekuaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;

    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaLeku : input.izenaLeku,
            helbideaLeku   : input.helbideaLeku,
            herriaLeku : input.herriaLeku,
            zenbakiLeku : input.zenbakiLeku,
            idElkarteakLeku    : id
        };
        
        console.log(data);
        var query = connection.query("INSERT INTO lekuak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/lekuak');
          
        });
    
    });
};
exports.lekuakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idLekuak = req.params.idLekuak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaLeku : input.izenaLeku,
            helbideaLeku   : input.helbideaLeku,
            herriaLeku : input.herriaLeku,
            zenbakiLeku : input.zenbakiLeku

        };
        
        connection.query("UPDATE lekuak set ? WHERE idElkarteakLeku = ? and idLekuak = ? ",[data,id,idLekuak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/lekuak');
          
        });
    
    });
};

exports.lekuakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idLekuak = req.params.idLekuak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM lekuak  WHERE idElkarteakLeku = ? and idLekuak = ?",[id,idLekuak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/lekuak');
             
        });
        
     });
};

exports.mailakbilatu = function(req, res){
  
  var id = req.session.idKirolElkarteak;

  req.getConnection(function(err,connection){     
   
        connection.query('SELECT * FROM mailak where idElkarteakMaila= ?',[id],function(err,rows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
         
          res.render('mailak.handlebars', {title : 'KirolElkarteak-Mailak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );

       });
    });
  
};

exports.mailakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idMailak = req.params.idMailak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM mailak WHERE idElkarteakMaila = ? and idMailak = ?',[id,idMailak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
   

            res.render('mailakeditatu.handlebars', {page_title:"Maila aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.mailaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;

    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaMaila : input.izenaMaila,
            zenbakiMaila   : input.zenbakiMaila,
            akronimoMaila   : input.akronimoMaila,
            idElkarteakMaila    : id
        };
        
        console.log(data);
        var query = connection.query("INSERT INTO mailak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/mailak');
          
        });
    
    });
};
exports.mailakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idMailak = req.params.idMailak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaMaila : input.izenaMaila,
            zenbakiMaila   : input.zenbakiMaila,
            akronimoMaila   : input.akronimoMaila

        };
        
        connection.query("UPDATE mailak set ? WHERE idElkarteakMaila = ? and idMailak = ? ",[data,id,idMailak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/mailak');
          
        });
    
    });
};

exports.mailakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idMailak = req.params.idMailak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM mailak  WHERE idElkarteakMaila = ? and idMailak = ?",[id,idMailak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/mailak');
             
        });
        
     });
};

exports.partaidemotakbilatu = function(req, res){
  
  var id = req.session.idKirolElkarteak;

  req.getConnection(function(err,connection){     
   
        connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak= ?',[id],function(err,rows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
         
          res.render('partaidemotak.handlebars', {title : 'KirolElkarteak-Partaide motak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );

       });
    });
  
};

exports.partaidemotakeditatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idPartaideMotak = req.params.idPartaideMotak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM partaideMotak WHERE idElkarteakPartaideMotak = ? and idPartaideMotak = ?',[id,idPartaideMotak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
   

            res.render('partaidemotakeditatu.handlebars', {page_title:"Partaide motak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.partaidemotaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;

    req.getConnection(function (err, connection) {
        
        var data = {
            
            deskribapenMota : input.deskribapenMota,
            idElkarteakPartaideMotak    : id
        };
        
        console.log(data);
        var query = connection.query("INSERT INTO partaideMotak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/partaidemotak');
          
        });
    
    });
};
exports.partaidemotakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idPartaideMotak = req.params.idPartaideMotak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            deskribapenMota : input.deskribapenMota

        };
        
        connection.query("UPDATE partaideMotak set ? WHERE idElkarteakPartaideMotak = ? and idPartaideMotak = ? ",[data,id,idPartaideMotak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/partaidemotak');
          
        });
    
    });
};

exports.partaidemotakezabatu = function(req,res){
     var id = req.session.idKirolElkarteak;
     var idPartaideMotak = req.params.idPartaideMotak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM partaideMotak  WHERE idElkarteakPartaideMotak = ? and idPartaideMotak = ?",[id,idPartaideMotak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/partaidemotak');
             
        });
        
     });
};

exports.ordaintzekoerakbilatu = function(req, res){
  
  var id = req.session.idKirolElkarteak;

  req.getConnection(function(err,connection){     
   
        connection.query('SELECT * FROM ordaintzekoErak where idElkarteakOrdaintzekoErak= ?',[id],function(err,rows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
         
          res.render('ordaintzekoerak.handlebars', {title : 'KirolElkarteak-Ordaintzeko erak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );

       });
    });
  
};

exports.ordaintzekoerakeditatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idOrdaintzekoErak = req.params.idOrdaintzekoErak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM ordaintzekoErak WHERE idElkarteakOrdaintzekoErak = ? and idOrdaintzekoErak = ?',[id,idOrdaintzekoErak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
   

            res.render('ordaintzekoerakeditatu.handlebars', {page_title:"Ordaintzeko erak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.ordaintzekoeraksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;

    req.getConnection(function (err, connection) {
        
        var data = {
            
            deskribapenaOrdainEra : input.deskribapenaOrdainEra,
            idElkarteakOrdaintzekoErak    : id
        };
        
        console.log(data);
        var query = connection.query("INSERT INTO ordaintzekoErak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/ordaintzekoerak');
          
        });
    
    });
};
exports.ordaintzekoerakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idOrdaintzekoErak = req.params.idOrdaintzekoErak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            deskribapenaOrdainEra : input.deskribapenaOrdainEra

        };
        
        connection.query("UPDATE ordaintzekoErak set ? WHERE idElkarteakOrdaintzekoErak = ? and idOrdaintzekoErak = ? ",[data,id,idOrdaintzekoErak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/ordaintzekoerak');
          
        });
    
    });
};

exports.ordaintzekoerakezabatu = function(req,res){
     var id = req.session.idKirolElkarteak;
     var idOrdaintzekoErak = req.params.idOrdaintzekoErak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM ordaintzekoErak WHERE idElkarteakOrdaintzekoErak = ? and idOrdaintzekoErak = ?",[id,idOrdaintzekoErak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/ordaintzekoerak');
             
        });
        
     });
};

exports.mezuakbidali = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("Bidali:" + input.bidali);
    var id = req.session.idKirolElkarteak;
    var taldeak2;

    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

    req.getConnection(function (err, connection) {
         
        if(input.mezumota == "prest"){

            connection.query('SELECT * FROM taldeak,jokalariak where idtaldeak=idtaldej and idtxapeltalde = ? and balidatuta > 0 order by idtaldeak, idjokalari',[req.session.idKirolElkarteak],function(err,rows)     {
              if(err)
                console.log("Error Selecting : %s ",err );
              var subj = req.session.txapelketaizena+ " txapelketa prest";
              var body = "<h2> Txapelketa prest </h2>\n" + 
                              "<p>"+ req.session.txapelketaizena+ "</p> \n"+
                              "<h3> Partiduen ordutegia ikusi ahal izateko sartu: http://"+hosta+"</h3>" ;
              taldeak2 = mezuaknori(input.bidali,subj,body,rows);

              console.log("Taldeak2: "+JSON.stringify(taldeak2));

              res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:taldeak2, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
       
             });
        }

        else if(input.mezumota == "ordgabe"){

              var query = connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde = ? and idKirolElkarteak=idtxapeltalde and balidatuta < 5 and balidatuta > 0',[id],function(err,rows)
              {

                if(err)
                  console.log("Error Selecting : %s ",err );

                var subj = req.session.txapelketaizena+ " txapelketa ordainketa egin mesedez!";
                var body = "<h2> Ordainketa egin mesedez! </h2>\n" + 
                              "<p>"+ req.session.txapelketaizena+ "</p> \n"+
                              "<h3> Sartu " +rows[0].prezioa+" kontu zenbaki honetan: "+rows[0].kontukorrontea+ "</h3>" ;
               taldeak2 = mezuaknori(input.bidali,subj,body,rows);

               console.log("Taldeak2: "+JSON.stringify(taldeak2));

               res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:taldeak2, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
       
          });
        }

        else if(input.mezumota == "jokgabe"){

              connection.query('SELECT * FROM taldeak where idtxapeltalde = ? and balidatuta != "admin" and balidatuta > 0 and NOT EXISTS (SELECT * FROM jokalariak where idtaldeak=idtaldej) order by idtaldeak',[req.session.idKirolElkarteak],function(err,rows)     {
              if(err)
                console.log("Error Selecting : %s ",err );

              var subj = req.session.txapelketaizena+ " txapelketan jokalariak gehitu";
              var body = "<h2> Jokalariak sartzeko dituzue </h2>\n" + 
                              "<p>"+ req.session.txapelketaizena+ "</p> \n"+
                              "<h3> Sartu: http://" +hosta+" eta ondoren has ezazu saioa zure datuekin jokalariak gehitu ahal izateko</h3>" ;
              taldeak2 = mezuaknori(input.bidali,subj,body,rows);

              console.log("Taldeak2: "+JSON.stringify(taldeak2));

              res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:taldeak2, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
       
             });
        }
        
     });   
};

function mezuaknori(bidali,subj,body,rows){
 console.log("Funtzioan sartuta:" +subj);
var taldeak = []; 
var taldea = {};
var jokalariak = []; 
var j;
var t = 0;
var vTalde;
var date = new Date();
      
        for (var i in rows) { 
          if(vTalde != rows[i].idtaldeak){
            if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldeak[t] = taldea;
              t++;
              if(bidali){
                  var to = taldea.emailard;
                  //var cc 
                  emailService.send(to, subj, body);
              }
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
          if (i==0)
            console.log("Jokizena: "+rows[i].jokalariizena);
          if(rows[i].jokalariizena == null){
            
            jokalariak[j] = {
                  jokalariizena    : rows[i].jokalariizena,
                  emailaj   : rows[i].emailaj,
                  telefonoaj: rows[i].telefonoaj,
                  kamisetaneurria : rows[i].kamisetaneurria
               };
          j++;
          }
          
        }
        if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldeak[t] = taldea;
              t++;

              if(bidali){
                  var to = taldea.emailard;
                  //var cc 
                  emailService.send(to, subj, body);
              }
        }
        console.log("Taldeak: "+JSON.stringify(taldeak));
        return taldeak;
  
}

function mezuabidali(){
              
}

function preview(req,res){
  
              
}
