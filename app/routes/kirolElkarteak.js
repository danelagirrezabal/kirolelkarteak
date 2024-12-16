var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var VALID_TEL_REGEX = /^[0-9-()+]{3,20}/;

 var path = require('path'),
  fs = require('fs'),
  formidable = require('formidable');
  var bcrypt = require('bcrypt-nodejs');
  var md = require('marked');
  var credentials = require('../credentials.js');
  var Twitter = require('twit');
  var twitter = new Twitter(credentials.twitter);
/*            
              twitter.get('followers/list', { screen_name: 'zkeskubaloia' }, function (err, data, response) {
                  if (err) {
                        console.log(err);
                  } else {
                      data.users.forEach(function(user){
                        console.log(user.screen_name);
                      });
                  }
              }); 
*/
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

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
      if (err)
              console.log("Error connection : %s ",err );
      //Txapelketa bat pruebetako ixkutatuta idKirolElkarteak != 42
//postgres      connection.query('SELECT idElkarteak, izenaElk FROM elkarteak',function(err,rows)  {
      req.connection.query('SELECT "idElkarteak", "izenaElk" FROM elkarteak',function(err,wrows)  {        
        if (err)
                console.log("Error query : %s ",err ); 
        rows = wrows.rows;     //postgres
        console.log("kirolElkarteak : " + JSON.stringify(rows)); 
        res.render('kirolElkarteakaukeratzeko.handlebars', {title : 'kirolElkarteak-Elkartea aukeratzeko', kirolElkarteak : rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
      });   
//postgresConnect  });  
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
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
      //2016-05-31
      if (err)
              console.log("Error connection : %s ",err ); 
            //
//postgres      connection.query('SELECT * FROM elkarteak where izenaElk = ?',[req.body.izenaElk],function(err,rows)  {
      req.connection.query('SELECT * FROM elkarteak where "izenaElk" = $1',[req.body.izenaElk],function(err,wrows)  {
        rows = wrows.rows;     //postgres

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
//postgres        var query = connection.query("INSERT INTO elkarteak set ? ",data, function(err, rows)        
        var query = req.connection.query("INSERT INTO elkarteak set $1 ",data, function(err, wrows)
        {
          if (err)
              console.log("Error inserting : %s ",err ); 
          rows = wrows.rows;     //postgres
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
//postgres        var query = connection.query("INSERT INTO partaideak set ? ",data, function(err, rows)
        var query = req.connection.query("INSERT INTO partaideak set $1 ",data, function(err, wrows)          
        {
         rows = wrows.rows;     //postgres
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
//postgresConnect    });    
};

exports.editatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id= req.session.idKirolElkarteak;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres        var query = connection.query('SELECT * FROM elkarteak where idElkarteak = ?',[id],function(err,rows) 
        var query = req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1',[id],function(err,wrows)
        {
          
          if (err)
              console.log("Error inserting : %s ",err );
          rows = wrows.rows;     //postgres
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
            partaidea: req.session.partaidea,
            adminatalak: req.session.adminatalak
            });
          
        });
        
       // console.log(query.sql); 
    
//postgresConnect    });
};

exports.aldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id= req.session.idKirolElkarteak;
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
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
  //postgres      var query = connection.query("UPDATE elkarteak set ? WHERE idElkarteak = ? ",[data,id], function(err, rows)
        var query = req.connection.query('UPDATE elkarteak set "izenaElk"=$1,"ifz"=$2,"helbideaElk"=$3,"postaKodeaElk"=$4,"herriaElk"=$5,"telefonoaElk"=$6,"emailElk"=$7 WHERE "idElkarteak" = $8',[input.izenaElk,input.ifz,input.helbideaElk,input.postaKodeaElk,input.herriaElk,input.telefonoaElk,input.emailElk,id], function(err, rows)
        {
          if (err)
              console.log("Error inserting : %s ",err );
          
          res.redirect('/kirolElkarteakeditatu');
          
        });
        
       // console.log(query.sql); 
    
//postgresConnect    });
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

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenburuaBerria    : input.izenburuaBerria,
            testuaBerria   : input.testuaBerria,
            dataBerria: now,
            idElkarteakBerria : id,
            zenbakiBerria: 0
        };
        
//postgres        var query = connection.query("INSERT INTO berriak set ? ",data, function(err, rows)  
        var query = req.connection.query("INSERT INTO berriak set $1 ",data, function(err, rows)
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
    
//postgresConnect    });
};

exports.berriakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM berriak where idElkarteakBerria = ? order by dataBerria desc',[id],function(err,rows)     {       
     req.connection.query('SELECT * FROM berriak where "idElkarteakBerria" = $1 order by "dataBerria" desc',[id],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowst = wrows.rows;     //postgres
          //for (var i in rows){
            //rows[i].testuaBerria=rows[i].testuaBerria.replace(/\r?\n/g, "<br>");

          //}
          res.render('index.handlebars',{title: "kirolElkarteak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
        });                        
      });   
//postgresConnect  });
};


exports.berriakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM berriak where idElkarteakBerria = ? order by dataBerria desc',[id],function(err,rows) {       
     req.connection.query('SELECT * FROM berriak where "idElkarteakBerria" = $1 order by "dataBerria" desc',[id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {     
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
          rowst = wrows.rows;     //postgres
         console.log("Berriak:" +JSON.stringify(rows));
          res.render('berriak.handlebars',{title: "Berriak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
        });                        
      });   
//postgresConnect  });
};

exports.berriakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idBerriak = req.params.idBerriak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM berriak WHERE idElkarteakBerria = ? and idBerriak = ?',[id,idBerriak],function(err,rows)
     req.connection.query('SELECT * FROM berriak WHERE "idElkarteakBerria" = $1 and "idBerriak" = $2',[id,idBerriak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres 
            res.render('berriakeditatu.handlebars', {page_title:"Berriak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
//postgresConnect    }); 
};

exports.berriakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idBerriak = req.params.idBerriak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenburuaBerria    : input.izenburuaBerria,
            testuaBerria   : input.testuaBerria,
            //dataBerria: now,
            idElkarteakBerria : id
            //zenbakiBerria: input.zenbakiBerria
            //argazkia
        };
//postgres        connection.query("UPDATE berriak set ? WHERE idElkarteakBerria = ? and idBerriak = ? ",[data,id,idBerriak], function(err, rows)
        req.connection.query('UPDATE berriak set "izenburuaBerria"=$1,"testuaBerria"=$2 WHERE "idElkarteakBerria" = $3 and "idBerriak" = $4',[input.izenburuaBerria,input.testuaBerria,id,idBerriak], function(err, rows) 
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/berriak');
          
        });
    
//postgresConnect    });
};

exports.berriakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idBerriak = req.params.idBerriak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres
//postgres        connection.query("DELETE FROM berriak  WHERE idElkarteakBerria = ? and idBerriak = ?",[id,idBerriak], function(err, rows)
        req.connection.query('DELETE FROM berriak  WHERE "idElkarteakBerria" = $1 and "idBerriak" = $2',[id,idBerriak], function(err, rows) {
//        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/berriak');
             
        });
        
//postgresConnect     });
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

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenburuaEdukia    : input.izenburuaEdukia,
            testuaEdukia   : input.testuaEdukia,
            dataEdukia: now,
            idElkarteakEdukia : id,
            idAzpiAtalakEdukia: idAzpiAtalak,
            zenbakiEdukia: input.zenbakiEdukia
        };
//postgres        var query = connection.query("INSERT INTO edukiak set ? ",data, function(err, rows)        
        var query = req.connection.query("INSERT INTO edukiak set $1 ",data, function(err, rows)
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

          if (input.bidali){
            
              var status = input.izenburuaEdukia + " - http://zarauzkoeskubaloia.herokuapp.com/ \n #GipuzkoaEskubaloia \n #123Zarautz";

              twitter.post('statuses/update', { status: status }, function (err, data, response) {
                  if (err) {
                        console.log(err);
                  } else {
                        console.log(data.text + ' txiotu da');
                  }
              });
          }

          res.redirect('/admin/edukiak');
        });
        
       // console.log(query.sql); 
    
//postgresConnect    });
};

exports.edukiakosoriksortu = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var izenaAtala;
        var now= new Date();

    
    if ((input.atalak == "" && input.izenaAtala == "") || (input.azpiAtalak =="" && input.izenaAzpiAtala == "")){
      console.log("redirect pasa da");
      res.redirect('/admin/edukiakgehituosorik');
    }else{

  
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
            console.log("redirect ez da pasa");


      if (input.atalak == ""){

        var dataatala = {
            
            izenaAtala    : input.izenaAtala,
            idElkarteakAtala : id,
            zenbakiAtala: 0
        };  
//postgres        var query = connection.query("INSERT INTO atalak set ? ",dataatala, function(err, rows)  
        var query = req.connection.query("INSERT INTO atalak set $1 ",dataatala, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );

          rows = wrows.rows;     //postgres
          var dataazpiatala = {
            
            izenaAzpiAtala    : input.izenaAzpiAtala,
            idElkarteakAzpiAtala : id,
            idAtalakAzpiAtala: rows.insertId, //Hemen aurreko atalaren id jarri behar da!!!
            zenbakiAzpiAtala: 0
          };
//postgres          var query = connection.query("INSERT INTO azpiAtalak set ? ",dataazpiatala, function(err, rows)
          var query = req.connection.query("INSERT INTO azpiAtalak set $1 ",dataazpiatala, function(err, rows)
          {
  
                if (err)
                    console.log("Error inserting : %s ",err );
                rows = wrows.rows;     //postgres
                var dataedukia = {
            
                    izenburuaEdukia    : input.izenburuaEdukia,
                    testuaEdukia   : input.testuaEdukia,
                    dataEdukia: now,
                    idElkarteakEdukia : id,
                    idAzpiAtalakEdukia: rows.insertId, //Hemen aurreko azpiatalaren id jarri behar da!!!
                    zenbakiEdukia: 0
                };
//postgres                var query = connection.query("INSERT INTO edukiak set ? ",dataedukia, function(err, rows)
                var query = req.connection.query("INSERT INTO edukiak set $1 ",dataedukia, function(err, rows)
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

                });

            });
        }else{


            var dataedukia = {
            
                    izenburuaEdukia    : input.izenburuaEdukia,
                    testuaEdukia   : input.testuaEdukia,
                    dataEdukia: now,
                    idElkarteakEdukia : id,
                    idAzpiAtalakEdukia: input.azpiAtalak, //Hemen aurreko azpiatalaren id jarri behar da!!!
                    zenbakiEdukia: 0

            }
//postgres            var query = connection.query("INSERT INTO edukiak set ? ",dataedukia, function(err, rows)
            var query = req.connection.query("INSERT INTO edukiak set $1 ",dataedukia, function(err, rows)
            {
  
                if (err)
                    console.log("Error inserting : %s ",err );

                if (input.bidali){
            
                 var status = input.izenburuaEdukia + " - http://zarauzkoeskubaloia.herokuapp.com/";

                 twitter.post('statuses/update', { status: status }, function (err, data, response) {
                   if (err) {
                        console.log(err);
                   } else {
                        console.log(data.text + ' txiotu da');
                   }
                 });
                }
        


                  res.redirect('/admin/edukiak');

            });
        }
       // console.log(query.sql); 
    
//postgresConnect    });
}
};

exports.edukiakosorikgehitu = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * from atalak where idElkarteakAtala = ? order by zenbakiAtala desc',[id],function(err,rowsa) {
     req.connection.query('SELECT * from atalak where "idElkarteakAtala" = $1 order by "zenbakiAtala" desc',[id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
    
        rowsa = wrows.rows;     //postgres

    res.render('edukiaksortuosorik.handlebars', {title : 'KirolElkarteak-Edukiak gehitu', atalakeduki:rowsa, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});


  });
//postgresConnect   });
};

exports.edukietarakoazpiatalaklortu = function(req, res){

  var atala = req.params.atala;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT idAzpiAtalak, izenaAzpiAtala FROM azpiAtalak where idElkarteakAzpiAtala = ? and idAtalakAzpiAtala = ?',[req.session.idKirolElkarteak, atala],function(err,rows)     
     req.connection.query('SELECT "idAzpiAtalak", "izenaAzpiAtala" FROM azpiAtalak where "idElkarteakAzpiAtala" = $1 and "idAtalakAzpiAtala" = $2',[req.session.idKirolElkarteak, atala],function(err,wrows)     
     
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            res.json(rows);

         });
                  
//postgresConnect  }); 
};

exports.edukiakhasiera = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idAtalak = req.params.idAtalak;
  var admin=(req.session.erabiltzaile == "admin");
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
 
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres       
     
//postgres     connection.query('SELECT * FROM edukiak, azpiAtalak, atalak where zenbakiAtala > 0 AND zenbakiAtala <= 10 AND idElkarteakEdukia = ? and idAzpiAtalakEdukia = idAzpiAtalak and idAtalakAzpiAtala = idAtalak and zenbakiAzpiAtala != ? and zenbakiEdukia != ? order by zenbakiEdukia asc,  dataEdukia desc',[id, 0, 0],function(err,rows)     {
     req.connection.query('SELECT * FROM edukiak, azpiAtalak, atalak where "zenbakiAtala" > \'0\' AND "zenbakiAtala" <= \'10\' AND "idElkarteakEdukia" = $1 and "idAzpiAtalakEdukia" = "idAzpiAtalak" and "idAtalakAzpiAtala" = "idAtalak" and "zenbakiAzpiAtala" != $2 and "zenbakiEdukia" != $3 order by "zenbakiEdukia" asc,  "dataEdukia" desc',[id, 0, 0],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {     
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          

          //for (var i in rows){
            //rows[i].testuaBerria=rows[i].testuaBerria.replace(/\r?\n/g, "<br>");

          //}

          rowst = wrows.rows;   //postgres

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

          rows[i].htmlEdukia = testuahtml;

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

//      if(req.session.erabiltzaile == "admin"){
//          res.redirect('/kirolElkarteakeditatu');
//      }else{
          res.render('edukiakhasiera.handlebars',{title: "kirolElkarteak", azpiAtalak:azpiAtalak, data:rows, data2: rowst,menuadmin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
//      }


          //connection.end();
        });  

      });   

//postgresConnect  });
           //res.render('edukiakikusi.handlebars',{title: "kirolElkarteak", jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea});

};

exports.atalakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idAtalak = req.params.idAtalak;
  var admin=(req.session.erabiltzaile == "admin");
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

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
       
//postgres      connection.query('SELECT * FROM edukiak, azpiAtalak where idElkarteakEdukia = ? and idAzpiAtalakEdukia = idAzpiAtalak and idAtalakAzpiAtala = ? and zenbakiAzpiAtala != ? and zenbakiEdukia != ? order by zenbakiAzpiAtala asc, zenbakiEdukia asc,  dataEdukia desc',[id, idAtalak, 0, 0],function(err,rows)     {
      req.connection.query('SELECT * FROM edukiak, azpiAtalak where "idElkarteakEdukia" = $1 and "idAzpiAtalakEdukia" = "idAzpiAtalak" and "idAtalakAzpiAtala" = $2 and "zenbakiAzpiAtala" != $3 and "zenbakiEdukia" != $4 order by "zenbakiAzpiAtala" asc, "zenbakiEdukia" asc,  "dataEdukia" desc',[id, idAtalak, 0, 0],function(err,wrows)     {            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres        
     
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {          
          if(err)
           console.log("Error Selecting : %s ",err );
          
          rowst = wrows.rows;     //postgres
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

          res.render('edukiakikusi.handlebars',{title: "kirolElkarteak", azpiAtalak:azpiAtalak, data:rows, data2: rowst,menuadmin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, adminatalak: req.session.adminatalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna, menuadmin:admin});

        });  

      });   

//postgresConnect  });

};

exports.azpiatalakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idAzpiAtalak = req.params.idAzpiAtalak;
  var admin=(req.session.erabiltzaile == "admin");
  //if (idAtalak == null)
  //  idAtalak=req.session.atalak[0].idAtalak;

  //var atalak = []; //egunak
  //var atala = {}; //eguna
  var azpiAtalak = []; //lekuak
  var azpiAtala = {}; //lekua
  var edukiak = []; //partiduak
  var j,t=0;
  //var k = 0;
  var vAtalak, vAzpiAtalak;
 
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
       
//postgres     connection.query('SELECT * FROM edukiak, azpiAtalak where idElkarteakEdukia = ? and idAzpiAtalakEdukia = idAzpiAtalak and idAzpiAtalak = ? and zenbakiEdukia != ? order by zenbakiAzpiAtala asc, zenbakiEdukia asc,  dataEdukia desc',[id, idAzpiAtalak, 0],function(err,rows)     {
     req.connection.query('SELECT * FROM edukiak, azpiAtalak where "idElkarteakEdukia" = $1 and "idAzpiAtalakEdukia" = "idAzpiAtalak" and "idAzpiAtalak" = $2 and "zenbakiEdukia" != $3 order by "zenbakiAzpiAtala" asc, "zenbakiEdukia" asc,  "dataEdukia" desc',[id, idAzpiAtalak, 0],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          
          rowst = wrows.rows;     //postgres
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

          res.render('edukiakikusi.handlebars',{title: "kirolElkarteak", azpiAtalak:azpiAtalak, data:rows, data2: rowst,menuadmin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});

        });  

      });   

//postgresConnect  });

};

exports.edukiakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idEdukiak = req.params.idEdukiak;
  var admin=(req.session.erabiltzaile == "admin");
  //if (idAtalak == null)
  //  idAtalak=req.session.atalak[0].idAtalak;

  //var atalak = []; //egunak
  //var atala = {}; //eguna
  var azpiAtalak = []; //lekuak
  var azpiAtala = {}; //lekua
  var edukiak = []; //partiduak
  var j,t=0;
  //var k = 0;
  var vAtalak, vAzpiAtalak;
 
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
       
//postgres     connection.query('SELECT * FROM edukiak, azpiAtalak where idElkarteakEdukia = ? and idAzpiAtalakEdukia = idAzpiAtalak and idEdukiak = ? and zenbakiEdukia != ? order by zenbakiAzpiAtala asc, zenbakiEdukia asc,  dataEdukia desc',[id, idEdukiak, 0],function(err,rows)     {
     req.connection.query('SELECT * FROM edukiak, azpiAtalak where "idElkarteakEdukia" = $1 and "idAzpiAtalakEdukia" = "idAzpiAtalak" and "idEdukiak" = $2 and "zenbakiEdukia" != $3 order by "zenbakiAzpiAtala" asc, "zenbakiEdukia" asc,  "dataEdukia" desc',[id, idEdukiak, 0],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         
        rows = wrows.rows;     //postgres
//postgres      connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {  
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          
          rowst = wrows.rows;     //postgres
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

//      if(req.session.erabiltzaile == "admin"){
//          res.redirect('/kirolElkarteakeditatu');
//      }else{
          res.render('edukiakikusi.handlebars',{title: "kirolElkarteak", azpiAtalak:azpiAtalak, data:rows, data2: rowst,menuadmin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
//      }


          //connection.end();
        });  

      });   

//postgresConnect  });
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
  //postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT *,DATE_FORMAT(dataEdukia,"%Y-%m-%d") AS dataEdukia FROM (atalak LEFT JOIN azpiAtalak ON idAtalak=idAtalakAzpiAtala) LEFT JOIN edukiak ON idAzpiAtalak=idAzpiAtalakEdukia where idAtalak=idAtalakAzpiAtala and idAzpiAtalak=idAzpiAtalakEdukia and idElkarteakEdukia = ? order by zenbakiAtala asc, zenbakiAzpiAtala asc, zenbakiEdukia asc, dataEdukia desc',[id],function(err,rows) {
     req.connection.query('SELECT *,to_char("dataEdukia", \'YYYY-MM-DD\') AS dataEdukiaF FROM (atalak LEFT JOIN azpiAtalak ON "idAtalak"="idAtalakAzpiAtala") LEFT JOIN edukiak ON "idAzpiAtalak"="idAzpiAtalakEdukia" where "idAtalak"="idAtalakAzpiAtala" and "idAzpiAtalak"="idAzpiAtalakEdukia" and "idElkarteakEdukia" = $1 order by "zenbakiAtala" asc, "zenbakiAzpiAtala" asc, "zenbakiEdukia" asc, "dataEdukia" desc',[id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
        rowst = wrows.rows;     //postgres 
         //console.log("Edukiak:" +JSON.stringify(rows));


        // debugger;

        for (var i in rows) {
          rows[i].dataEdukia = rows[i].dataEdukiaF;     //postgres 
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
//postgresConnect  });
};

exports.edukiakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idEdukiak = req.params.idEdukiak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM edukiak WHERE idElkarteakEdukia = ? and idEdukiak = ?',[id,idEdukiak],function(err,rows)
     req.connection.query('SELECT * FROM edukiak WHERE "idElkarteakEdukia" = $1 and "idEdukiak" = $2',[id,idEdukiak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            res.render('edukiakeditatu.handlebars', {page_title:"Edukiak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
//postgresConnect    }); 
};

exports.edukiakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idEdukiak = req.params.idEdukiak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenburuaEdukia    : input.izenburuaEdukia,
            testuaEdukia   : input.testuaEdukia,
            zenbakiEdukia: input.zenbakiEdukia,
            //dataBerria: now,
            idElkarteakEdukia : id

            //argazkia
        };
//postgres        connection.query("UPDATE edukiak set ? WHERE idElkarteakEdukia = ? and idEdukiak = ? ",[data,id,idEdukiak], function(err, rows)
        req.connection.query('UPDATE edukiak set "izenburuaEdukia" = $1, "testuaEdukia" = $2, "zenbakiEdukia" = $3 WHERE "idElkarteakEdukia" = $4 and "idEdukiak" = $5 ',[input.izenburuaEdukia, input.testuaEdukia, input.zenbakiEdukia,id,idEdukiak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
            
          if (input.bidali){
            
              var status = input.izenburuaEdukia + " - http://zarauzkoeskubaloia.herokuapp.com/";

              twitter.post('statuses/update', { status: status }, function (err, data, response) {
                  if (err) {
                        console.log(err);
                  } else {
                        console.log(data.text + ' txiotu da');
                  }
              });
          }
          res.redirect('/admin/edukiak');
          connection.end();
        });
    
//postgresConnect    });
};

exports.edukiakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idEdukiak = req.params.idEdukiak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres
//postgres        connection.query("DELETE FROM edukiak  WHERE idElkarteakEdukia = ? and idEdukiak = ?",[id,idEdukiak], function(err, rows)
        req.connection.query('DELETE FROM edukiak  WHERE "idElkarteakEdukia" = $1 and "idEdukiak" = $2',[id,idEdukiak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/edukiak');
             connection.end();
        });
        
//postgresConnect     });
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

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenaAtala    : input.izenaAtala,
            zenbakiAtala   : input.zenbakiAtala,
            idElkarteakAtala : id,
        };
        
//postgres        var query = connection.query("INSERT INTO atalak set ? ",data, function(err, rows)  
        var query = req.connection.query("INSERT INTO atalak set $1 ",data, function(err, rows)
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
    
//postgresConnect    });
};

exports.atalakikusi2 = function(req, res){
  var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM atalak where idElkarteakAtala = ? order by zenbakiAtala asc',[id],function(err,rows)     {
     req.connection.query('SELECT * FROM atalak where "idElkarteakAtala" = $1 order by "zenbakiAtala" asc',[id],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
          rowst = wrows.rows;     //postgres
          //for (var i in rows){
            //rows[i].testuaBerria=rows[i].testuaBerria.replace(/\r?\n/g, "<br>");

          //}
          res.render('index.handlebars',{title: "kirolElkarteak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
        });                        
      });   
//postgresConnect  });
};

exports.atalakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM atalak where idElkarteakAtala = ? order by zenbakiAtala asc',[id],function(err,rows) {
     req.connection.query('SELECT * FROM atalak where "idElkarteakAtala" = $1 order by "zenbakiAtala" asc',[id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres    
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
          rowst = wrows.rows;     //postgres
//         console.log("Atalak:" +JSON.stringify(rows));
          res.render('atalak.handlebars',{title: "Atalak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea:req.session.partaidea});
        });                        
      });   
//postgresConnect  });
};

exports.atalakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idAtalak = req.params.idAtalak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM atalak WHERE idElkarteakAtala = ? and idAtalak = ?',[id,idAtalak],function(err,rows)
     req.connection.query('SELECT * FROM atalak WHERE "idElkarteakAtala" = $1 and "idAtalak" = $2',[id,idAtalak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres 
            res.render('atalakeditatu.handlebars', {page_title:"Atalak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
//postgresConnect    }); 
};

exports.atalakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idAtalak = req.params.idAtalak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenaAtala    : input.izenaAtala,
            zenbakiAtala   : input.zenbakiAtala,
            //dataBerria: now,
            idElkarteakAtala : id
            //zenbakiBerria: input.zenbakiBerria
            //argazkia
        };
//postgres        connection.query("UPDATE atalak set ? WHERE idElkarteakAtala = ? and idAtalak = ? ",[data,id,idAtalak], function(err, rows)
        req.connection.query('UPDATE atalak set "izenaAtala"=$1,"zenbakiAtala"=$2 WHERE "idElkarteakAtala" = $3 and "idAtalak" = $4 ',[input.izenaAtala,input.zenbakiAtala,id,idAtalak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/atalak');
          
        });
    
//postgresConnect    });
};

exports.atalakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idAtalak = req.params.idAtalak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres
//postgres        connection.query("DELETE FROM atalak  WHERE idElkarteakAtala = ? and idAtalak = ?",[id,idAtalak], function(err, rows)        
        req.connection.query('DELETE FROM atalak  WHERE "idElkarteakAtala" = $1 and "idAtalak" = $2',[id,idAtalak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/atalak');
             
        });
        
//postgresConnect     });
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

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenaAzpiAtala    : input.izenaAzpiAtala,
            zenbakiAzpiAtala   : input.zenbakiAzpiAtala,
            idElkarteakAzpiAtala : id,
            idAtalakAzpiAtala: idAtalak
        };
        
//postgres        var query = connection.query("INSERT INTO azpiAtalak set ? ",data, function(err, rows)  
        var query = req.connection.query("INSERT INTO azpiAtalak set $1 ",data, function(err, rows)
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
    
//postgresConnect    });
};

exports.azpiAtalakikusi = function(req, res){
  var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM azpiAtalak where idElkarteakAzpiAtala = ? order by zenbakiAzpiAtala asc',[id],function(err,rows)     {
     req.connection.query('SELECT * FROM azpiAtalak where "idElkarteakAzpiAtala" = $1 order by "zenbakiAzpiAtala" asc',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
         rowst = wrows.rows;     //postgres 
          //for (var i in rows){
            //rows[i].testuaBerria=rows[i].testuaBerria.replace(/\r?\n/g, "<br>");

          //}
          res.render('index.handlebars',{title: "kirolElkarteak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia});
        });                        
      });   
//postgresConnect  });
};

exports.azpiAtalakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idAtalak = req.params.idAtalak;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM azpiAtalak where idElkarteakAzpiAtala = ? and idAtalakAzpiAtala = ? order by zenbakiAzpiAtala asc',[id, idAtalak],function(err,rows) {
     req.connection.query('SELECT * FROM azpiAtalak where "idElkarteakAzpiAtala" = $1 and "idAtalakAzpiAtala" = $2 order by "zenbakiAzpiAtala" asc',[id, idAtalak],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
          rowst = wrows.rows;     //postgres          
         console.log("AzpiAtalak:" +JSON.stringify(rows));
          res.render('azpiatalak.handlebars',{title: "AzpiAtalak", data:rows, data2: rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, idAtalak: idAtalak, partaidea: req.session.partaidea});
        });                        
      });   
//postgresConnect  });
};

exports.azpiAtalakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idAzpiAtalak = req.params.idAzpiAtalak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM azpiAtalak WHERE idElkarteakAzpiAtala = ? and idAzpiAtalak = ?',[id,idAzpiAtalak],function(err,rows)
     req.connection.query('SELECT * FROM azpiAtalak WHERE "idElkarteakAzpiAtala" = $1 and "idAzpiAtalak" = $2',[id,idAzpiAtalak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres   
            res.render('azpiatalakeditatu.handlebars', {page_title:"AzpiAtalak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
//postgresConnect    }); 
};

exports.azpiAtalakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idAzpiAtalak = req.params.idAzpiAtalak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenaAzpiAtala    : input.izenaAzpiAtala,
            zenbakiAzpiAtala   : input.zenbakiAzpiAtala,
            //dataBerria: now,
            idElkarteakAzpiAtala : id,
            //zenbakiBerria: input.zenbakiBerria
            //argazkia
        };
//postgres        connection.query("UPDATE azpiAtalak set ? WHERE idElkarteakAzpiAtala = ? and idAzpiAtalak = ? ",[data,id,idAzpiAtalak], function(err, rows)
        req.connection.query('UPDATE azpiAtalak set "izenaAzpiAtala"=$1,"zenbakiAzpiAtala"=$2 WHERE idElkarteakAzpiAtala = $3 and idAzpiAtalak = $4 ',[input.izenaAzpiAtala,input.zenbakiAzpiAtala,id,idAzpiAtalak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/edukiak');
          
        });
    
//postgresConnect    });
};

exports.azpiAtalakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idAzpiAtalak = req.params.idAzpiAtalak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres
//postgres        connection.query("DELETE FROM azpiAtalak  WHERE idElkarteakAzpiAtala = ? and idAzpiAtalak = ?",[id,idAzpiAtalak], function(err, rows)
        req.connection.query("DELETE FROM azpiAtalak  WHERE idElkarteakAzpiAtala = $1 and idAzpiAtalak = $2",[id,idAzpiAtalak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/edukiak');
             
        });
        
//postgresConnect     });
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

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            atalaAgiria    : input.atalaAgiria,
            izenaAgiria   : input.izenaAgiria,
            urlAgiria : input.urlAgiria,
            dataAgiria: now,
            publikoAgiria : publikoa,
            idElkarteakAgiria : id,
            idDenboraldiaAgiria : idDenboraldia
        };
        
  
        var query = req.connection.query("INSERT INTO agiriak set ? ",[data], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
     
          res.redirect('/admin/agiriak');
            //res.render('agiriakigo.handlebars', {page_title:"Agiriak igo",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});

        });
        
       // console.log(query.sql); 
    
//postgresConnect    });
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
  var idDenboraldia = req.session.idDenboraldia;  
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT *, DATE_FORMAT(dataAgiria,"%Y/%m/%d") AS dataAgiria FROM agiriak, elkarteak where idElkarteakAgiria = ? and idElkarteak = idElkarteakAgiria and idDenboraldiaAgiria = ? order by publikoAgiria, dataAgiria desc',[id, idDenboraldia],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataAgiria", \'YYYY-MM-DD\') AS "dataAgiria" FROM agiriak, elkarteak where "idElkarteakAgiria" = $1 and "idElkarteak" = "idElkarteakAgiria" and "idDenboraldiaAgiria" = $2 order by "publikoAgiria", "dataAgiria" desc',[id, idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ? ',[id],function(err,rowst)     {
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1 ',[id],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
          rowst = wrows.rows;     //postgres
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
//postgresConnect  });
};

exports.agiriakbilatupartaide = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;   
  var publikoa = 1;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT *, DATE_FORMAT(dataAgiria,"%Y/%m/%d") AS dataAgiria FROM agiriak, elkarteak where idElkarteakAgiria = ? and idElkarteak = idElkarteakAgiria and publikoAgiria = ? and idDenboraldiaAgiria = ? order by dataAgiria desc',[id, publikoa, idDenboraldia],function(err,rows) {
     req.connection.query('SELECT *, to_char("dataAgiria", \'YYYY-MM-DD\')AS "dataAgiriaF" FROM agiriak, elkarteak where "idElkarteakAgiria" = $1 and "idElkarteak" = "idElkarteakAgiria" and "publikoAgiria" = $2 and "idDenboraldiaAgiria" = $3 order by "dataAgiria" desc',[id, publikoa, idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
    
          rows = wrows.rows;     //postgres    
          res.render('agiriak.handlebars',{title: "Agiriak", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
      });                        
        
//postgresConnect  });
};

exports.agiriakeditatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idAgiriak = req.params.idAgiriak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT *,DATE_FORMAT(dataAgiria,"%Y/%m/%d") AS dataAgiria FROM agiriak WHERE idElkarteakAgiria = ? and idAgiriak = ?',[id,idAgiriak],function(err,rows)
     req.connection.query('SELECT *,to_char("dataAgiria", \'YYYY-MM-DD\')AS "dataAgiria" FROM agiriak WHERE "idElkarteakAgiria" = $1 and "idAgiriak" = $2',[id,idAgiriak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres  
            for(var i in rows){
              if (rows[i].publikoAgiria == 1){
                rows[i].publikoaDa = true;
              }else{
                rows[i].publikoDa = false;
              }
            }

            res.render('agiriakeditatu.handlebars', {page_title:"Agiriak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
//postgresConnect    }); 
};

exports.agiriakaldatu = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idAgiriak = req.params.idAgiriak;
    var publikoa = 0;

    if (input.publiko){
        publikoa = 1;
    };
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {  
            atalaAgiria    : input.atalaAgiria,
            izenaAgiria   : input.izenaAgiria,
            urlAgiria : input.urlAgiria,
            dataAgiria: input.dataAgiria,
            publikoAgiria : publikoa

        };
//postgres        connection.query("UPDATE agiriak set ? WHERE idElkarteakAgiria = ? and idAgiriak = ? ",[data,id,idAgiriak], function(err, rows)
        req.connection.query('UPDATE agiriak set "atalaAgiria"=$1,"izenaAgiria"=$2,"urlAgiria"=$3,"dataAgiria"=$4,"publikoAgiria"=$5 WHERE idElkarteakAgiria = $6 and idAgiriak = $7 ',[input.atalaAgiria,input.izenaAgiria,input.urlAgiria,input.dataAgiria,publikoa,id,idAgiriak], function(err, rows)
        {
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/agiriak');
          
        });
    
//postgresConnect    });
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
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {  
            urlAgiria : fitxategiIzena,
        };
        
        req.connection.query('UPDATE agiriak set "urlAgiria"=$1 WHERE "idElkarteakAgiria" = $2 and "idAgiriak" = $3 ',[fitxategiIzena,id,idAgiriak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/agiriak');
          
        });
    
    });
//postgresConnect  });
};

exports.agiriakezabatu = function(req,res){
     var id = req.session.idKirolElkarteak;
     var idAgiriak = req.params.idAgiriak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres
//postgres        connection.query("DELETE FROM agiriak  WHERE idElkarteakAgiria = ? and idAgiriak = ?",[id,idAgiriak], function(err, rows)
        req.connection.query('DELETE FROM agiriak  WHERE "idElkarteakAgiria" = $1 and "idAgiriak" = $2',[id,idAgiriak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/agiriak');
             
        });
        
//postgresConnect     });
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

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM elkarteak where idElkarteak = ?',[req.session.idKirolElkarteak],function(err,rows)     {
     req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1',[req.session.idKirolElkarteak],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
        if(rows.length != 0){    
         var to = rows[0].emailElk;
         var subj = "Web orriko zalantza " +rows[0].izenaElk+":  " + input.izenabizen;
         var body = "<p><b>Izen abizenak:</b>  " + input.izenabizen + "</p>";
          body += "<p><b>Emaila:</b>  " + input.email + "</p>";
          body += "<p><b>Telefonoa:</b>  " + input.telef + "</p>";
          body += "<p><b>Herria:</b>  " + input.herri+ "</p>";
          body += "<p><b>Azalpena:</b> " +"<pre>"+ input.azalpena + "</pre></p>";
          console.log("input:" + input.izenabizen);
          emailService.send(to, subj, body);
        }  
        res.locals.flash = {
              type: 'success',
              intro: 'Bidalita!',
              message: 'Egun gutxiren buruan erantzuna jasoko duzu!',
          };
              
        res.redirect(303,'/');
       });
//postgresConnect     });
    }
};


exports.mantenimentu = function(req, res){
  var now= new Date();

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM taldeak WHERE idtaldeak > 172',function(err,rows)       
     req.connection.query('SELECT * FROM taldeak WHERE "idtaldeak" > 172',function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
          rows = wrows.rows;     //postgres
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
        
            req.connection.query("UPDATE taldeak set ? WHERE idtaldeak = ?  ",[data,rows[i].idtaldeak], function(err, rows)
            {
                if(err)
                  console.log("Error Updating : %s ",err );
            });
          }
          res.redirect('/kirolElkarteakeditatu');                           
        });
//postgresConnect  }); 
};

exports.mantenimentuegin = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var now= new Date();
    var taldekideak = input.mantenimentuCSV.split("\n"); //CSV-a zatitu lerroka (partiduka)
    var taldekidea = [];

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
   
//      connection.query('SELECT * FROM taldeak WHERE idtaldeak > 172',function(err,rows)
//postgres     connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldia= ? and idElkarteakTalde = ?  order by idTaldekideak',[idDenboraldia,id],function(err,rows) {            
     req.connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartaideakKide"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldia"= $1 and "idElkarteakTalde" = $2  order by "idTaldekideak"',[idDenboraldia,id],function(err,wrows) {            
      if(err)
                console.log("Error Selecting : %s ",err );
      rows = wrows.rows;     //postgres
      for(var i in rows){
            taldekidea = taldekideak[i].split(";");
            console.log("input : " + i + "-" + rows[i].izenaPart + "-" + taldekidea[0] + "-" + taldekidea[1]);

            var data = {
                  bazkideZenbKide : taldekidea[1]
            };
//postgres          connection.query("UPDATE taldekideak set ? WHERE idElkarteakKide = ? and idTaldekideak = ?",[data,id, rows[i].idTaldekideak], function(err, rowsu)
          req.connection.query('UPDATE taldekideak set $1 WHERE "idElkarteakKide" = $2 and "idTaldekideak" = $3',[data,id, rows[i].idTaldekideak], function(err, rowsu)
          {
  
            if (err)
              console.log("Error Updating : %s ",err );
         
          });
      }
      res.redirect('/kirolElkarteakeditatu');
    });
//postgresConnect  }); 
};

exports.lekuakbilatu = function(req, res){
  
  var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres    
//postgres        connection.query('SELECT * FROM lekuak where idElkarteakLeku= ?',[id],function(err,rows)     {   
        req.connection.query('SELECT * FROM lekuak where "idElkarteakLeku" = $1',[id],function(err,wrows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
          rows = wrows.rows;     //postgres
          res.render('lekuak.handlebars', {title : 'KirolElkarteak-Lekuak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );

       });
//postgresConnect    });
  
};

exports.lekuakeditatu = function(req, res){

  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idLekuak = req.params.idLekuak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM lekuak WHERE idElkarteakLeku = ? and idLekuak = ?',[id,idLekuak],function(err,rows)
     req.connection.query('SELECT * FROM lekuak WHERE "idElkarteakLeku" = $1 and "idLekuak" = $2',[id,idLekuak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            res.render('lekuakeditatu.handlebars', {page_title:"Lekuak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
//postgresConnect    }); 
};

exports.lekuaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenaLeku : input.izenaLeku,
            helbideaLeku   : input.helbideaLeku,
            herriaLeku : input.herriaLeku,
            zenbakiLeku : input.zenbakiLeku,
            idElkarteakLeku    : id
        };
        
        console.log(data);
        var query = req.connection.query("INSERT INTO lekuak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/lekuak');
          
        });
    
//postgresConnect    });
};
exports.lekuakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idLekuak = req.params.idLekuak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenaLeku : input.izenaLeku,
            helbideaLeku   : input.helbideaLeku,
            herriaLeku : input.herriaLeku,
            zenbakiLeku : input.zenbakiLeku

        };
//postgres        connection.query('UPDATE lekuak set ? WHERE idElkarteakLeku = ? and idLekuak = ? ',[data,id,idLekuak], function(err, rows)
        req.connection.query('UPDATE lekuak set "izenaLeku"=$1, "zenbakiLeku"=$2, "helbideaLeku"=$3, "herriaLeku"=$4 WHERE "idElkarteakLeku" = $5 and "idLekuak" = $6 ',[input.izenaLeku,input.helbideaLeku,input.herriaLeku,input.zenbakiLeku,id,idLekuak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/lekuak');
          
        });
    
//postgresConnect    });
};

exports.lekuakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idLekuak = req.params.idLekuak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres
//postgres        connection.query("DELETE FROM lekuak  WHERE idElkarteakLeku = ? and idLekuak = ?",[id,idLekuak], function(err, rows)
        req.connection.query('DELETE FROM lekuak  WHERE "idElkarteakLeku" = $1 and "idLekuak" = $2',[id,idLekuak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/lekuak');
             
        });
        
//postgresConnect     });
};

exports.mailakbilatu = function(req, res){
  
  var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres     
//postgres        connection.query('SELECT * FROM mailak where idElkarteakMaila= ? order by zenbakiMaila, idMailak',[id],function(err,rows)     {
        req.connection.query('SELECT * FROM mailak where "idElkarteakMaila"= $1 order by "zenbakiMaila", "idMailak"',[id],function(err,wrows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
          rows = wrows.rows;     //postgres
          res.render('mailak.handlebars', {title : 'KirolElkarteak-Mailak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );

       });
//postgresConnect    });
  
};

exports.mailakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idMailak = req.params.idMailak;
  var generoa = [{izena: "Neska", balioa: "N"}, {izena: "Mutila", balioa: "M"}];  

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM mailak WHERE idElkarteakMaila = ? and idMailak = ?',[id,idMailak],function(err,rows)
     req.connection.query('SELECT * FROM mailak WHERE "idElkarteakMaila" = $1 and "idMailak" = $2',[id,idMailak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            for(var i in generoa ){
                  if(rows[0].generoMaila == generoa[i].balioa){
                    generoa[i].aukeratua = true;
                  }
                  else
                    generoa[i].aukeratua = false;
            }   
            rows[0].generoa = generoa;

            res.render('mailakeditatu.handlebars', {page_title:"Maila aldatu",data:rows, generoa:generoa, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
//postgresConnect    }); 
};

exports.mailaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenaMaila : input.izenaMaila,
            generoMaila : input.generoMaila,
            zenbakiMaila   : input.zenbakiMaila,
            akronimoMaila   : input.akronimoMaila,
            idElkarteakMaila    : id
        };
        
        console.log(data);
        var query = req.connection.query("INSERT INTO mailak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/mailak');
          
        });
    
//postgresConnect    });
};
exports.mailakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idMailak = req.params.idMailak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            izenaMaila : input.izenaMaila,
            generoMaila : input.generoMaila,
            zenbakiMaila   : input.zenbakiMaila,
            akronimoMaila   : input.akronimoMaila

        };
//postgres        connection.query("UPDATE mailak set ? WHERE idElkarteakMaila = ? and idMailak = ? ",[data,id,idMailak], function(err, rows)
        req.connection.query('UPDATE mailak set "izenaMaila"=$1,"generoMaila"=$2,"zenbakiMaila"=$3,"akronimoMaila"=$4 WHERE idElkarteakMaila = $5 and idMailak = $6 ',[input.izenaMaila,input.generoMaila,input.zenbakiMaila,input.akronimoMaila,id,idMailak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/mailak');
          
        });
    
//postgresConnect    });
};

exports.mailakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idKirolElkarteak;
     var idMailak = req.params.idMailak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres
//postgres        connection.query("DELETE FROM mailak  WHERE idElkarteakMaila = ? and idMailak = ?",[id,idMailak], function(err, rows)
        req.connection.query('DELETE FROM mailak  WHERE "idElkarteakMaila" = $1 and "idMailak" = $2',[id,idMailak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/mailak');
             
        });
        
//postgresConnect     });
};

exports.partaidemotakbilatu = function(req, res){
  
  var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres    
//postgres        connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak= ? order by zenbakiMota',[id],function(err,rows)     {
        req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota"',[id],function(err,wrows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
          rows = wrows.rows;     //postgres
          res.render('partaidemotak.handlebars', {title : 'KirolElkarteak-Partaide motak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );

       });
//postgresConnect    });
  
};

exports.partaidemotakeditatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idPartaideMotak = req.params.idPartaideMotak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgres     connection.query('SELECT * FROM partaideMotak WHERE idElkarteakPartaideMotak = ? and idPartaideMotak = ?',[id,idPartaideMotak],function(err,rows)
     req.connection.query('SELECT * FROM partaideMotak WHERE "idElkarteakPartaideMotak" = $1 and "idPartaideMotak" = $2',[id,idPartaideMotak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
   
            rows = wrows.rows;     //postgres
            res.render('partaidemotakeditatu.handlebars', {page_title:"Partaide motak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
//postgresConnect    }); 
};

exports.partaidemotaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            deskribapenMota : input.deskribapenMota,
            zenbakiMota : input.zenbakiMota,
            idElkarteakPartaideMotak    : id
        };
        
        console.log(data);
        var query = req.connection.query("INSERT INTO partaideMotak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/partaidemotak');
          
        });
    
//postgresConnect    });
};
exports.partaidemotakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idPartaideMotak = req.params.idPartaideMotak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres
        
        var data = {
            
            deskribapenMota : input.deskribapenMota,
            zenbakiMota : input.zenbakiMota
        };
//postgres        connection.query("UPDATE partaideMotak set ? WHERE idElkarteakPartaideMotak = ? and idPartaideMotak = ? ",[data,id,idPartaideMotak], function(err, rows)
        req.connection.query('UPDATE partaideMotak set "deskribapenMota"=$1,"zenbakiMota"=$2 WHERE idElkarteakPartaideMotak = $3 and idPartaideMotak = $4 ',[input.deskribapenMota,input.zenbakiMota,id,idPartaideMotak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/partaidemotak');
          
        });
    
//postgresConnect    });
};

exports.partaidemotakezabatu = function(req,res){
     var id = req.session.idKirolElkarteak;
     var idPartaideMotak = req.params.idPartaideMotak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres
//postgres        connection.query("DELETE FROM partaideMotak  WHERE idElkarteakPartaideMotak = ? and idPartaideMotak = ?",[id,idPartaideMotak], function(err, rows)
        req.connection.query('DELETE FROM partaideMotak  WHERE "idElkarteakPartaideMotak" = $1 and "idPartaideMotak" = $2',[id,idPartaideMotak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/partaidemotak');
             
        });
        
//postgresConnect     });
};

exports.ordaintzekoerakbilatu = function(req, res){
  
  var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres     
//postgres        connection.query('SELECT * FROM ordaintzekoErak where idElkarteakOrdaintzekoErak= ?',[id],function(err,rows)     {
        req.connection.query('SELECT * FROM ordaintzekoErak where "idElkarteakOrdaintzekoErak"= $1',[id],function(err,wrows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
          rows = wrows.rows;     //postgres
          res.render('ordaintzekoerak.handlebars', {title : 'KirolElkarteak-Ordaintzeko erak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );

       });
//postgresConnect    });
  
};

exports.ordaintzekoerakeditatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idOrdaintzekoErak = req.params.idOrdaintzekoErak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM ordaintzekoErak WHERE idElkarteakOrdaintzekoErak = ? and idOrdaintzekoErak = ?',[id,idOrdaintzekoErak],function(err,rows)       
     req.connection.query('SELECT * FROM ordaintzekoErak WHERE "idElkarteakOrdaintzekoErak" = $1 and "idOrdaintzekoErak" = $2',[id,idOrdaintzekoErak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
   
            rows = wrows.rows;     //postgres
            res.render('ordaintzekoerakeditatu.handlebars', {page_title:"Ordaintzeko erak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
//postgresConnect    }); 
};

exports.ordaintzekoeraksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            deskribapenaOrdainEra : input.deskribapenaOrdainEra,
            idElkarteakOrdaintzekoErak    : id
        };
        
        console.log(data);
        var query = req.connection.query("INSERT INTO ordaintzekoErak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/ordaintzekoerak');
          
        });
    
//postgresConnect    });
};
exports.ordaintzekoerakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idOrdaintzekoErak = req.params.idOrdaintzekoErak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            deskribapenaOrdainEra : input.deskribapenaOrdainEra

        };
//postgres        connection.query("UPDATE ordaintzekoErak set ? WHERE idElkarteakOrdaintzekoErak = ? and idOrdaintzekoErak = ? ",[data,id,idOrdaintzekoErak], function(err, rows)
        req.connection.query('UPDATE ordaintzekoErak set "deskribapenaOrdainEra" = $1 WHERE "idElkarteakOrdaintzekoErak" = $2 and "idOrdaintzekoErak" = $3 ',[input.deskribapenaOrdainEra,id,idOrdaintzekoErak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/ordaintzekoerak');
          
        });
    
//postgresConnect    });
};

exports.ordaintzekoerakezabatu = function(req,res){
     var id = req.session.idKirolElkarteak;
     var idOrdaintzekoErak = req.params.idOrdaintzekoErak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres 
//postgres        connection.query("DELETE FROM ordaintzekoErak WHERE idElkarteakOrdaintzekoErak = ? and idOrdaintzekoErak = ?",[id,idOrdaintzekoErak], function(err, rows)
        req.connection.query('DELETE FROM ordaintzekoErak WHERE "idElkarteakOrdaintzekoErak" = $1 and "idOrdaintzekoErak" = $2',[id,idOrdaintzekoErak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
        //postgres    
             res.redirect('/admin/ordaintzekoerak');
             
        });
        
//postgresConnect     });
};

exports.mezuakbidali = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("Bidali:" + req.session.jardunaldia);
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var jardunaldia = req.session.jardunaldia;
    var taldeak2 , idEnkript;

    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }
    var nora = 0, zenbat = 10;
    if (!req.session.nondik){ 
          req.session.nondik = 0;
    }
    var nondik = req.session.nondik;
debugger;      
console.log("nondik: "+ nondik );
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
         
        if(input.mezumota == "emarbi"){
    //postgres        connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where federazioaTalde != 9 and zenbakiLeku != 8 and idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and jardunaldiDataPartidu = ? order by zenbakiMaila, izenaTalde asc ,orduaPartidu',[id, jardunaldia],function(err,rows) {
            req.connection.query('SELECT *,to_char("dataPartidu", \'YYYY-MM-DD\')AS "dataPartidu" FROM partiduak, mailak, taldeak, lekuak where "federazioaTalde" != 9 and "zenbakiLeku" != 8 and "idLekuak"="idLekuakPartidu" and "idTaldeakPartidu"="idTaldeak" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idElkarteakPartidu" = $1 and "jardunaldiDataPartidu" = $2 order by "zenbakiMaila", "izenaTalde" asc ,"orduaPartidu"',[id, jardunaldia],function(err,wrows) {
            
              if(err) 
               console.log("Error Selecting : %s ",err );
              rows = wrows.rows;     //postgres   
              for (var i in rows){
                if(rows[i].emaitzaPartidu == ""){
                  if(i >= nondik && nora < zenbat){
//                    if (to != rows[i].emailard){
                    idEnkript = rows[i].idPartiduak * 3456789;
                    var egunaTexto = ["Igandea", "Astelehena", "Asteartea", "Asteazkena", "Osteguna", "Ostirala", "Larunbata"];
                    var dt = new Date(rows[i].dataPartidu);
                    var eguna = egunaTexto[dt.getUTCDay()];
                    var to = rows[i].arduradunEmailTalde;
                    var body = "<h2>"+ eguna +"n, "+ rows[i].orduaPartidu +"n, "+ rows[i].izenaTalde+ " partidua "+ rows[i].izenaLeku + "</h2>\n" + 
                               "<p>"+ rows[i].etxekoaPartidu + " - " + rows[i].kanpokoaPartidu + "</p> \n";
                    if (rows[i].zenbakiLeku >= 9)    // KANPOAN
                     {
                       body += "<p> Irteera: "+rows[i].bidaiOrduaPartidu+" - "+rows[i].bidaiaNolaPartidu+" - "+rows[i].nonPartidu+
                               " - "+rows[i].bidaiEgunaPartidu+"</p>\n";
                     } 
//                    if (rows[i].arbitraiaTalde != 0)
                    if (rows[i].federazioaTalde == 0 && rows[i].arbitraiaTalde == 1)
                     {
                      var subj = rows[i].dataPartidu+ "-ko emaitza eta arbitraia sartzeko: "+ rows[i].izenaTalde;  
                      body += "<h2>Emaitza eta arbitraia eguneratzeko:</h2>\n" +
                              "<p style=color:red><h3>klikatu beheko linka eta ireki nabigatzailean</h3></p> \n"+
                              "<p style=color:red><h3>XX-YY ordezkatu emaitzagatik, ordezkatu ZZ.ZZ arbitraiagatik eta klikatu</h3></p> \n"+
//                              "<p><h3> eta klikatu: http://"+hosta+"/emaitzabidali/"+ idEnkript +"/XX-YY/ZZZ</h3>" ;
                              "<p><h3>http://zarauzkoeskubaloia.herokuapp.com/emaitzabidali/"+ idEnkript +"/XX-YY/ZZ.ZZ</h3></p> \n";
                      body += "<h3>Adibidez arbitraia 19,30 euro izan bada eta emaitza 22-25:</h3>\n" +
                              "<p><b>XX-YY</b>  partez  emaitza ipini behar da :    <b>22-25</b> </p> \n"+
                              "<p><b>ZZ.ZZ</b>  partez  arbitaria ipini behar da, dezimalak puntu batekin :    <b>19.30</b> </p> \n"+
                              "<p>Nabigatzailean, linkaren bukaera horrela gelditu behar du: <b>22-25/19.30</b> </p> \n"+
                              "<p style=color:blue><h3>http://zarauzkoeskubaloia.herokuapp.com/emaitzabidali/"+ idEnkript +"/<b>22-25/19.30</b></h3></p> \n";
                     }
                    else 
                     {
                      var subj = rows[i].dataPartidu+ "-ko emaitza sartzeko: "+ rows[i].izenaTalde;
                      body += "<h2>Emaitza eguneratzeko:</h2>\n" +
                              "<p style=color:red><h3>klikatu beheko linka eta ireki nabigatzailean</h3></p> \n"+
                              "<p style=color:red><h3>XX-YY ordezkatu emaitzagatik eta klikatu</h3></p> \n"+
//                              "<p><h3> eta klikatu: http://"+hosta+"/emaitzabidali/"+ idEnkript +"/XX-YY</h3>" ;
                              "<p><h3>http://zarauzkoeskubaloia.herokuapp.com/emaitzabidali/"+ idEnkript +"/XX-YY</h3></p> \n";
                      body += "<h3>Adibidez emaitza 22-25:</h3>\n" +
                              "<p><b>XX-YY</b>  partez  emaitza ipini behar da :    <b>22-25</b> </p> \n"+
                              "<p>Nabigatzailean, linkaren bukaera horrela gelditu behar du: <b>22-25</b> </p> \n"+
                              "<p style=color:blue><h3>http://zarauzkoeskubaloia.herokuapp.com/emaitzabidali/"+ idEnkript +"/<b>22-25</b></h3></p> \n";

                     }
//                    body += "<p> Ikusi ordutegia: http://zarauzkoeskubaloia.herokuapp.com eta aukeratu Partiduen Ordutegia</p>\n";   

//                     if (rows[i].arbitraiaTalde != 0)
//                      { 
                      console.log(i + ". mezua1: " + to + " - "  +rows[i].izenaTalde + " - "  + rows[i].federazioaTalde + " - "  + rows[i].arbitraiaTalde);
//                      if(input.bidali){
                         emailService.send(to, subj, body);
                         for (var j = 0; j < 1000; j++) {}  // atseden denbora ADI ADI
//                      }   
                      nora++;
                      if(i == rows.length - 1){
                          nora = zenbat;
                      }
//                      }
                  }
                  if(nora == zenbat || (i == rows.length - 1 && (nondik >= rows.length - zenbat))){
                     nora++;
                     req.session.nondik = parseInt(i) + 1;
                     console.log("nondik: "+ rows.length + "-" + req.session.nondik);
                  }
                }
              }
              if(i == rows.length - 1 && (nondik >= rows.length - zenbat)){
                  to = "zarauzkoeskubaloia@gmail.com";                     // ADI kirolelkarteko emaila
                  subj = rows[i].dataPartidu+ "-ko emaitza eta arbitraiak sartzeko emailak bidalita ";
                  emailService.send(to, subj, body);
                  res.render('taldeakadmin.handlebars', {title : 'KirolElkarteak-Mezuak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
              } 
              else
                  res.redirect('/admin/kudeaketa');  

//              res.render ('taldeakadmin.handlebars', {title : 'KirolElkarteak-Mezuak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
       
            });
        }

        else if(input.mezumota == "ordgabe"){
//postgres               var query = connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde = ? and idKirolElkarteak=idtxapeltalde and balidatuta < 5 and balidatuta > 0',[id],function(err,rows)
              var query = req.connection.query('SELECT * FROM taldeak,txapelketa where "idtxapeltalde" = $1 and "idKirolElkarteak"="idtxapeltalde" and "balidatuta" < 5 and "balidatuta" > 0',[id],function(err,wrows)
              {

                if(err)
                  console.log("Error Selecting : %s ",err );
                rows = wrows.rows;     //postgres  
                var subj = req.session.txapelketaizena+ " txapelketa ordainketa egin mesedez!";
                var body = "<h2> Ordainketa egin mesedez! </h2>\n" + 
                              "<p>"+ req.session.txapelketaizena+ "</p> \n"+
                              "<h3> Sartu " +rows[0].prezioa+" kontu zenbaki honetan: "+rows[0].kontukorrontea+ "</h3>" ;
//               taldeak2 = mezuaknori(input.bidali,subj,body,rows);

               console.log("Taldeak2: "+JSON.stringify(taldeak2));

               res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:taldeak2, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
       
          });
        }

        else if(input.mezumota == "jokgabe"){

              req.connection.query('SELECT * FROM taldeak where idtxapeltalde = ? and balidatuta != "admin" and balidatuta > 0 and NOT EXISTS (SELECT * FROM jokalariak where idtaldeak=idtaldej) order by idtaldeak',[req.session.idKirolElkarteak],function(err,rows)     {
              if(err)
                console.log("Error Selecting : %s ",err );

              var subj = req.session.txapelketaizena+ " txapelketan jokalariak gehitu";
              var body = "<h2> Jokalariak sartzeko dituzue </h2>\n" + 
                              "<p>"+ req.session.txapelketaizena+ "</p> \n"+
                              "<h3> Sartu: http://" +hosta+" eta ondoren has ezazu saioa zure datuekin jokalariak gehitu ahal izateko</h3>" ;
//              taldeak2 = mezuaknori(input.bidali,subj,body,rows);

              console.log("Taldeak2: "+JSON.stringify(taldeak2));

              res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:taldeak2, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
       
             });
        }
        
//postgresConnect     });   
};

function emailakbidali(i, nondik, nora, zenbat, to, subj, body){

 if(i >= nondik && nora < zenbat){
   nora++;
   emailService.send(to, subj, body);

   console.log("emaila: "+ i + "-" + to );
   if(i == rows.length - 1){
        nora = zenbat;
   }
 }
 if(nora == zenbat || (i == rows.length - 1 && (nondik >= rows.length - zenbat))){
    nora++;
    req.session.nondik = parseInt(i) + 1;
    console.log("nondik: "+ rows.length + "-" + req.session.nondik);
 }
}

function mezuaktaldeari(req, bidali,subj,body,rows){
var to;
var nondik = 0, nora = 0;
var zenbat = 10;

    if (!req.session.nondik){ 
          req.session.nondik = 0;
    }
    nondik = req.session.nondik;
debugger;      
console.log("nondik: "+ nondik + "-nora " + nora + "-zenbat " + zenbat);
        for (var i in rows) { 
          if(i >= nondik && nora < zenbat){
            if (to != rows[i].emailard){
              to = rows[i].emailard;
              nora++;
              if (bidali){
                  emailService.send(to, subj, body);
              }
              console.log("emaila: "+ i + "-" + to + " - taldea: "+ i + "-" + rows[i].taldeizena);
              if(i == rows.length - 1){
                  nora = zenbat;
              }
            }
          }
          if(nora == zenbat || (i == rows.length - 1 && (nondik >= rows.length - zenbat))){
              nora++;
              req.session.nondik = parseInt(i) + 1;
              console.log("nondik: "+ rows.length + "-" + req.session.nondik);
          }
        }
        return rows;
}

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

exports.partiduemaitzaeguneratu = function(req,res){
    var admin = (req.path.slice(0,6) == "/admin");
//    var idEnkript = req.params.id;
    var emaitza = req.params.emaitza;
    var arbitraia = req.params.arbitraia;

    //ADI! partaideasortu-n aldatu balio hau aldatuz gero
    var idPartidua = req.params.id / 3456789;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
//postgres      connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, denboraldiak where idDenboraldiaPartidu=idDenboraldia and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idPartiduak = ?',[idPartidua],function(err,rows) {    
      req.connection.query('SELECT *,to_char("dataPartidu", \'YYYY-MM-DD\')AS "dataPartidu" FROM partiduak, mailak, taldeak, denboraldiak where "idDenboraldiaPartidu"="idDenboraldia" and "idTaldeakPartidu"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartiduak" = $1',[idPartidua],function(err,wrows) {
            
       if(err)
           console.log("Error Selecting : %s ",err );
       rows = wrows.rows;     //postgres
       console.log("mezua to: " + rows[0].arduradunEmailTalde + " - "  +rows[0].izenaTalde+ " - "  + emaitza + " - "  + arbitraia);
       if (rows.length != 0 && emaitza != "XX-YY" && ((rows[0].jardunaldiDataPartidu = rows[0].jardunaldiaIkusgai) || admin)){
         var data = {};
         if (arbitraia)
             data.arbitraiaPartidu = arbitraia; 
         if (emaitza) 
             data.emaitzaPartidu = emaitza; 
//postgres         connection.query("UPDATE partiduak set ? WHERE idPartiduak = ? ",[data, idPartidua], function(err, rowsu)
         req.connection.query('UPDATE partiduak set "arbitraiaPartidu"=$1,"emaitzaPartidu"=$2 WHERE idPartiduak = $3 ',[arbitraia, emaitza, idPartidua], function(err, rowsu)
          {
   
          if (err)
              console.log("Error Updating : %s ",err );
         
/*
          var to = rows[0].arduradunEmailTalde;
          var body = "<h2>"+ rows[0].etxekoaPartidu + " - " + rows[0].kanpokoaPartidu + "</p> \n" +
                     "<h2>Emaitza : "+ emaitza +"</h2>\n";
          if (arbitraia != 0)
            { 
              var subj = rows[0].dataPartidu+ "-ko emaitza :"+ emaitza +" eta arbitraia : "+ arbitraia;
                  body += "<h2>Arbitraia : "+ arbitraia+ "</h2>\n";
            }
          else 
            {  
              var subj = rows[0].dataPartidu+ "-ko emaitza : "+ emaitza;
            }
          body += "<p><h3> Ikusi emaitzak: http://zarauzkoeskubaloia.herokuapp.com eta aukeratu Emaitzak</h3></p>\n";

          body += "<p><h2> eskerrik asko! hAR eta EMan harreman</h2></p>\n";

          console.log("mezua to: " + to + " - "  +rows[0].izenaTalde);
          emailService.send(to, subj, body);
*/
          if (rows[0].federazioaTalde !=  0){
            
              var status = rows[0].izenaMaila+ " " +  rows[0].akronimoTalde + " \n " + rows[0].txapelketaPartidu + " \n " + rows[0].etxekoaPartidu +  "  " + emaitza + "  " + rows[0].kanpokoaPartidu + " \n http://zarauzkoeskubaloia.herokuapp.com/ \n #GipuzkoaEskubaloia \n #123Zarautz";

              twitter.post('statuses/update', { status: status }, function (err, data, response) { 
                  if (err) {
                      console.log(err);
                  } else {
                        console.log(rows[0].izenaTalde + " - "+data.text + ' txiotu da');
                  }
              });
           }

//           res.end();

            res.render('emaitzakeskerrak.handlebars', {title: "Emaitza Eskerrak", data:rows, emaitza:emaitza, arbitraia:arbitraia});

         });
       }
       else
         if (arbitraia == "ZZ.ZZ"){

           res.render('emaitzakarbitraiak.handlebars', {title: "Arbitraia Adibideak"});
         }
         else
          if (emaitza == "XX-YY"){

           res.render('emaitzakadibideak.handlebars', {title: "Emaitza Adibideak"});
          }
          else

//           res.end();
           res.sendStatus(404);
      });
//          connection.release();    
//postgresConnect    });
};