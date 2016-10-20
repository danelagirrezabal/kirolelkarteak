/*
 * GET customers listing.
 */
var bcrypt = require('bcrypt-nodejs');

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var VALID_TEL_REGEX = /^[0-9-()+]{3,20}/;
var VALID_DNI_REGEX = /^\d{8}[a-zA-Z]{1}$/;
 

 exports.login = function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));

  if(!req.body.emailaard.match(VALID_EMAIL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid name email address.' });
    req.session.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emaila ez da zuzena',
    };
    return res.redirect(303, '/login');
  }
  debugger;
  console.log(req.body.emailaard);
  if(req.body.emailaard == "admin@kirolelkarteak.eus") {
    req.session.erabiltzaile = "admin@kirolelkarteak.eus";
    req.session.partaidea = "admin@kirolelkarteak.eus";
    return res.redirect(303, '/admin/kirolElkarteak');
  }

  var taldea; 
  req.getConnection(function(err,connection){
       //PASAHITZA ENKRIPTATU GABE
     //connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde = idtxapelketa and emailard = ? and pasahitza = ? and (balidatuta = 1 or balidatuta = "admin") and idtaldeak = ? ',
     // [req.body.emailaard,req.body.pasahitza, req.body.sTaldeak],function(err,rows)     {
      //if(err || rows.length == 0){


      //PASAHITZA ENKRIPTATUTA    
      connection.query('SELECT * FROM elkarteak,partaideak where idElkarteak = idElkarteakPart and emailPart = ? and  (balidatutaPart >= 1 or balidatutaPart = "admin") and idPartaideak = ? ',
      [req.body.emailaard,req.body.sPartaideak],function(err,rows)     {
        if(err || rows.length == 0 || !(bcrypt.compareSync(req.body.pasahitza, rows[0].pasahitzaPart))){

          if(err)
            console.log("Error Selecting : %s ",err );
          if(req.xhr) return res.json({ error: 'Invalid name email address.' });
             req.session.flash = {
             type: 'danger',
             intro: 'Adi!',
             message: 'Emaila, partaidea edo pasahitza ez da zuzena.',
          };
          return res.redirect(303, '/login');
  
        }
        else if(rows[0].balidatutaPart == "admin"){
            req.session.idKirolElkarteak = rows[0].idElkarteak;
            req.session.izenaElk = rows[0].izenaElk;
            req.session.idPartaide = rows[0].idPartaideak; 
            req.session.izenaPart = rows[0].izenaPart;
            req.session.erabiltzaile = rows[0].balidatutaPart;
            req.session.partaidea = "Admin " + rows[0].izenaPart + " " + rows[0].abizena1Part;
            //req.session.idDenboraldia = "2";
            //req.session.idgrupo = rows[0].idgrupot;
            return res.redirect(303, '/kirolElkarteakeditatu');
        }
        else {
         req.session.idKirolElkarteak = rows[0].idElkarteak;
          req.session.izenaElk = rows[0].izenaElk;
          req.session.idPartaide = rows[0].idPartaideak; 
         req.session.izenaPart = rows[0].izenaPart;
         req.session.erabiltzaile = rows[0].balidatutaPart;
         req.session.partaidea = rows[0].izenaPart + " " + rows[0].abizena1Part;
         //req.session.idgrupo = rows[0].idgrupot;

       if(req.xhr) return res.json({ success: true });
           req.session.flash = {
           type: 'success',
           intro: 'Ongi-etorri!',
           message: 'Zure datuak ikusi ditzakezu',
        };

      /*if(req.path == "/taldeak"){
        return res.redirect('/jokalariak');
      }
      else if(req.path == "/sailkapenak"){
        return res.redirect('/jokalariak');
      }
       */
        return res.redirect('/');
       
        //res.render('jokalariak.handlebars', {title : 'Txaparrotan-Taldea', taldeak:taldea} );

        }
        

                           
         });
       
    });
 
};

exports.ikusi = function(req, res){

  var id=req.session.idKirolElkarteak;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM partaideak WHERE idElkarteakPart=?',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        res.render('partaideak.handlebars', {title : 'KirolElkarteak-Partaideak', data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
        //res.render('partaideak.handlebars', {title : 'KirolElkarteak-Partaideak', data:rows, taldeizena: req.session.taldeizena} );               
         });
       
    });
  
};

exports.bilatu = function(req, res){
  req.getConnection(function(err,connection){
     
     var id= '16';  
     connection.query('SELECT * FROM jokalariak,taldeak where idtaldej= ? and idtaldej=idtaldeak',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        console.log(rows);
        res.render('datuak.handlebars', {title : 'Txaparrotan-Datuak', data:rows, taldeak:rows[0], jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
                           
      });
       
    });
  
};

exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers-Node.js"});
};
exports.editatu = function(req, res){
   //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idPartaideak = req.params.idPartaideak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM partaideak WHERE idPartaideak = ?',[idPartaideak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
          
     
            res.render('partaideakeditatu.handlebars', {page_title:"Partaidea aldatu",data:rows, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};
/*Save the customer*/

exports.partaidemail = function(req, res){

  var id = req.params.emaila;
console.log("Elkartea:"+req.session.idKirolElkarteak);
console.log("Email:"+id);
  req.getConnection(function(err,connection){
       
     connection.query('SELECT idPartaideak, izenaPart FROM partaideak where (balidatutaPart = "admin" or balidatutaPart >= 1) and emailPart = ? and idElkarteakPart = ?',[id,req.session.idKirolElkarteak],function(err,rows)     
     
        {
            if(err)
                console.log("Error Selecting : %s ",err );

            //res.render('forgot.handlebars', {title : 'Txaparrotan-Forgot', emailaard : id, taldeak : rows });
            console.log("filak:"+JSON.stringify(rows));
            res.json(rows);

         });
                  
  }); 
};

/*exports.sortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    console.log("idKirolElkarteak:" + req.session.idKirolElkarteak);
    var id = req.session.idKirolElkarteak;

    req.getConnection(function (err, connection) {
        
       // console.log(query.sql); 
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(input.pasahitzaPart, salt);

          var data = { //Partaidearen datuak
            izenaPart    : input.izenaPart,
            abizena1Part : input.abizena1Part,
            abizena2Part : input.abizena2Part,
            bazkideZenbPart: input.bazkideZenbPart,
            helbideaPart: input.helbideaPart,
            postaKodeaPart : input.postaKodeaPart,
            nanPart : input.nanPart,
            herriaPart : input.herriaPart,
            telefonoaPart : input.telefonoaPart,
            emailPart : input.emailPart,
            idElkarteakPart : id,
            jaiotzeDataPart: input.jaiotzeDataPart,
            sexuaPart: input.sexuaPart,
            pasahitzaPart:   password_hash,  
            berezitasunakPart: input.berezitasunakPart,
            idOrdaintzekoEraPart: input.idOrdaintzekoEraPart,
            kontuZenbPart: input.kontuZenbPart,                  
            balidatutaPart : "0"
        };

        console.log(data);
        var query = connection.query("INSERT INTO partaideak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         else{
         var to = input.emailPart;
         var subj = "Kaixo " + input.izenaPart;
         var body = "Partaide izena: " +input.izenaPart+ "\n Emaila: " + input.emailPart + "\n Pasahitza: " + input.pasahitzaPart;
          emailService.send(to, subj, body);
        }
          //res.redirect('/taldeak');
          res.redirect(303, '/partaideak');
        }); 
         //res.redirect(303, '/admin/kirolElkarteak');
        });
    

};*/

exports.sortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    res.locals.flash = null;
    var now= new Date();

    console.log("idKirolElkarteak:" + req.session.idKirolElkarteak);
    var id = req.session.idKirolElkarteak;

    //Errore kontrolak
    if(!req.body.nanPart.match(VALID_DNI_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid DNI' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'NANa ez da zuzena',
    };
  }

    else if(!req.body.telefonoaPart.match(VALID_TEL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid telefono' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Telefonoa ez da zuzena',
    };
  }

  else if(!req.body.emailPart.match(VALID_EMAIL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emaila ez da zuzena',
    };
  }

  else if(req.body.pasahitzaPart != req.body.pasahitzaPart2) {
    if(req.xhr) return res.json({ error: 'Invalid password' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Pasahitzak ez dira berdinak',
    };
  }

  else if(req.body.emailPart != req.body.emailPart2) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emailak ez dira berdinak',
    };
  }

  req.getConnection(function (err, connection) {
   /*connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
      if(err)
        console.log("Error Selecting : %s ",err ); 

      for(var i in rowsm ){
          if(req.body.kategoria == rowsm[i].idmaila){
            mailaizena = rowsm[i].mailaizena;
            rowsm[i].aukeratua = true;
          }
          else
            rowsm[i].aukeratua = false;
      }*/
 
      if(res.locals.flash != null){

        //Erroreak badaude "local.flash" aldagaian gordeak, itzuli balioak errorearekin
         return res.render('partaideakgehitu.handlebars', {
            title : 'Partaideak-Izen-ematea',
             partaidea : req.session.partaidea,
            idKirolElkarteak : req.session.idKirolElkarteak,

            izenaPart    : req.body.izenaPart,
            abizena1Part : req.body.abizena1Part,
            abizena2Part : req.body.abizena2Part,
            bazkideZenbPart: req.body.bazkideZenbPart,
            helbideaPart: req.body.helbideaPart,
            postaKodeaPart : req.body.postaKodeaPart,
            nanPart : req.body.nanPart,
            herriaPart : req.body.herriaPart,
            telefonoaPart : req.body.telefonoaPart,
            emailPart : req.body.emailPart,
            //idElkarteakPart : id,
            jaiotzeDataPart: req.body.jaiotzeDataPart,
            //sexuaPart: req.body.sexuaPart,
            //pasahitzaPart:   password_hash,  
            //berezitasunakPart: req.body.berezitasunakPart,
            idOrdaintzekoEraPart: req.body.idOrdaintzekoEraPart,
            kontuZenbPart: req.body.kontuZenbPart                

          } );
      }

      connection.query('SELECT * FROM partaideak where idElkarteakPart= ? and nanPart = ?',[req.session.idKirolElkarteak, req.body.nanPart],function(err,rows)  {
            
        if(err || rows.length != 0){
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'NAN zenbaki horrekin partaide bat sortuta dago! Elkartearekin harremanetan jar zaitez.',
           };

           //NAN berdineko partaidea existitzen bada, errorea dago eta balioak itzuli formulategian
          return res.render('partaideakgehitu.handlebars', {
            title : 'Partaideak-Izen-ematea',
            partaidea : req.session.partaidea,
            idKirolElkarteak : req.session.idKirolElkarteak,

            izenaPart    : req.body.izenaPart,
            abizena1Part : req.body.abizena1Part,
            abizena2Part : req.body.abizena2Part,
            bazkideZenbPart: req.body.bazkideZenbPart,
            helbideaPart: req.body.helbideaPart,
            postaKodeaPart : req.body.postaKodeaPart,
            nanPart : req.body.nanPart,
            herriaPart : req.body.herriaPart,
            telefonoaPart : req.body.telefonoaPart,
            emailPart : req.body.emailPart,
            //idElkarteakPart : id,
            jaiotzeDataPart: req.body.jaiotzeDataPart,
            //sexuaPart: req.body.sexuaPart,
            //pasahitzaPart:   password_hash,  
            //berezitasunakPart: req.body.berezitasunakPart,
            idOrdaintzekoEraPart: req.body.idOrdaintzekoEraPart,
            kontuZenbPart: req.body.kontuZenbPart                

          } );
        }
        connection.query('SELECT * FROM elkarteak where idElkarteak = ?',[req.session.idKirolElkarteak],function(err,rowst){          
            
            if(err)
                console.log("Error inserting : %s ",err );
        // Generate password hash
            var salt = bcrypt.genSaltSync();
            var password_hash = bcrypt.hashSync(input.pasahitzaPart, salt);
            //var elkartea = rowst.izenaElk;
            console.log("Hau da elkartea: "+rowst[0].idElkarteak);
            console.log("Elkartea:" +JSON.stringify(rowst));
            //console.log("Hau da elkarte id: "+req.session.idKirolElkarteak);

          

             var data = { //Partaidearen datuak
              izenaPart    : input.izenaPart,
              abizena1Part : input.abizena1Part,
              abizena2Part : input.abizena2Part,
              bazkideZenbPart: input.bazkideZenbPart,
              helbideaPart: input.helbideaPart,
              postaKodeaPart : input.postaKodeaPart,
              nanPart : input.nanPart,
              herriaPart : input.herriaPart,
              telefonoaPart : input.telefonoaPart,
              emailPart : input.emailPart,
              idElkarteakPart : id,
              jaiotzeDataPart: input.jaiotzeDataPart,
              sexuaPart: input.sexuaPart,
              pasahitzaPart:   password_hash,  
              berezitasunakPart: input.berezitasunakPart,
              idOrdaintzekoEraPart: input.idOrdaintzekoEraPart,
              kontuZenbPart: input.kontuZenbPart,                  
              balidatutaPart : "0"
            };

            var query = connection.query("INSERT INTO partaideak set ? ",data, function(err, rows)
           {
  
            if (err)
              console.log("Error inserting : %s ",err );

        //Enkriptatu partaide zenbakia. Zenbaki hau aldatuz gero, partaidea balidatu ere aldatu!
         var partaideZenbakia= rows.insertId * 3456789;
         //var mailaizena;   
         var to = input.emailPart;
         var subj = "Ongi-etorri " + data.izenaPart +" "+ data.abizena1Part+ " " + data.abizena2Part;
         var hosta = req.hostname;
         if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
         }
         /*for(var i in rowsm ){
          if(data.kategoria == rowsm[i].idmaila){
            mailaizena = rowsm[i].mailaizena;
          }
         }*/

         //Partaidea sortzeko bidaliko den mezua BALIDAZIO LINKAREKIN
         var body = "<p>"+rowst[0].izenaElk+" elkartean partaidetza balidatu ahal izateko, </p>";
         body += "<h3> klik egin: http://"+hosta+"/partaideakbalidatu/" + partaideZenbakia+ ". </h3>";
         body += "<p> Ez bazaizu klikatzeko link moduan agertzen, kopiatu eta pegatu nabigatzailean. </p>";
         body += "<p>Ondoren, login egin ziurtatzeko dena ongi dagoela.</p>";
         body += "<p>Mila esker!</p>";
          req.session.idPartaideak = rows.insertId;
          emailService.send(to, subj, body);
          
          res.render('partaideakeskerrak.handlebars', {title: "Mila esker!", partaideizena:data.izenaPart, elkarteizena:rowst[0].izenaElk, emailPart:data.emailPart});
          });
        }); 
      });
    });
  //});
};

exports.partaideakgehitu = function(req, res){ //Datu basetik conboBox-ak betetzeko
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM ordaintzekoErak where idElkarteakOrdaintzekoErak = ? order by idOrdaintzekoErak asc',[id],function(err,rowso) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

         
         //console.log("Berriak:" +JSON.stringify(rows));
      res.render('partaideakgehitu.handlebars', {title : 'KirolElkarteak-PartaideakGehitu', ordaintzekoErak: rowso, partaidea: req.session.partaidea});

      });  
         
  });
};
exports.aldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idPartaideak = req.params.idPartaideak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaPart    : input.izenaPart,
            abizena1Part : input.abizena1Part,
            abizena2Part : input.abizena2Part,
            bazkideZenbPart: input.bazkideZenbPart,
            nanPart : input.nanPart,
            helbideaPart: input.helbideaPart,
            postaKodeaPart : input.postaKodeaPart,
            herriaPart : input.herriaPart,
            telefonoaPart : input.telefonoaPart,
            emailPart : input.emailPart,
            idElkarteakPart : id,
            jaiotzeDataPart: input.jaiotzeDataPart,
            sexuaPart: input.sexuaPart,
            //pasahitzaPart:   password_hash,  
            berezitasunakPart: input.berezitasunakPart,
            idOrdaintzekoEraPart: input.idOrdaintzekoEraPart,
            kontuZenbPart: input.kontuZenbPart,                  
            balidatutaPart : "0"
        
        };
        
        connection.query("UPDATE partaideak set ? WHERE idPartaideak = ? ",[data,idPartaideak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/partaideak');
          
        });
    
    });
};

exports.balidatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var idEnkript = req.params.id;

    //ADI! partaideasortu-n aldatu balio hau aldatuz gero
    var id = idEnkript / 3456789;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            balidatutaPart    : 1
        
        };
        
        connection.query("UPDATE partaideak set ? WHERE idPartaideak = ? and balidatutaPart = 0" ,[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/login');
          
        });
    
    });
};

exports.ezabatu = function(req,res){
          
     //var id = req.params.id;
     //var id = req.session.idKirolElkarteak;
     var idPartaideak = req.params.idPartaideak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM partaideak  WHERE idPartaideak = ?",[idPartaideak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/partaideak');
             
        });
        
     });
};


// BAZKIDEAK

exports.bazkideakikusi = function(req, res){

  var id=req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idDenboraldiaSesioa = idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM bazkideak, partaideak, ordaintzekoErak WHERE idOrdaintzekoEraBazk=idOrdaintzekoErak and idPartaideakBazk=idPartaideak and idElkarteakBazkide=?',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );

         connection.query('SELECT * FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsd) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
        
        res.render('bazkideak.handlebars', {title : 'KirolElkarteak-Bazkideak', data:rows, denboraldiak:rowsd, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
        //res.render('partaideak.handlebars', {title : 'KirolElkarteak-Partaideak', data:rows, taldeizena: req.session.taldeizena} );               
         });
       
    });

  });
  
};

exports.bazkideaksortu = function(req,res){
    var id=req.session.idKirolElkarteak;
    var idDenboraldia =req.session.idDenboraldia;
    var idPartaideak = req.params.idPartaideak;
    req.getConnection(function(err,connection){

        var data = { //Partaidearen datuak
              /*izenaPart    : input.izenaPart,
              abizena1Part : input.abizena1Part,
              abizena2Part : input.abizena2Part,
              bazkideZenbPart: input.bazkideZenbPart,
              helbideaPart: input.helbideaPart,
              postaKodeaPart : input.postaKodeaPart,
              nanPart : input.nanPart,
              herriaPart : input.herriaPart,
              telefonoaPart : input.telefonoaPart,
              emailPart : input.emailPart,
              idElkarteakPart : id,
              jaiotzeDataPart: input.jaiotzeDataPart,
              sexuaPart: input.sexuaPart,
              pasahitzaPart:   password_hash,  
              berezitasunakPart: input.berezitasunakPart,
              idOrdaintzekoEraPart: input.idOrdaintzekoEraPart,
              kontuZenbPart: input.kontuZenbPart,                  
              balidatutaPart : "0"*/

              idDenboraldiaBazk : idDenboraldia,
              idPartaideakBazk: idPartaideak,
              ordainduBazk: "BAI",
              idOrdaintzekoEraBazk: 2,
              idElkarteakBazkide: id
            };

            var query = connection.query("INSERT INTO bazkideak set ? ",data, function(err, rows)
           {
  
            if (err)
              console.log("Error inserting : %s ",err );
          });
    });    

  };

exports.bazkideakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idPartaideak = req.params.idPartaideak;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenaPart    : input.izenaPart,
            abizena1Part : input.abizena1Part,
            abizena2Part : input.abizena2Part,
            bazkideZenbPart: input.bazkideZenbPart,
            nanPart : input.nanPart,
            helbideaPart: input.helbideaPart,
            postaKodeaPart : input.postaKodeaPart,
            herriaPart : input.herriaPart,
            telefonoaPart : input.telefonoaPart,
            emailPart : input.emailPart,
            idElkarteakPart : id,
            jaiotzeDataPart: input.jaiotzeDataPart,
            sexuaPart: input.sexuaPart,
            //pasahitzaPart:   password_hash,  
            berezitasunakPart: input.berezitasunakPart,
            idOrdaintzekoEraPart: input.idOrdaintzekoEraPart,
            kontuZenbPart: input.kontuZenbPart,                  
            balidatutaPart : "0"
        
        };
        
        connection.query("UPDATE partaideak set ? WHERE idPartaideak = ? ",[data,idPartaideak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/partaideak');
          
        });
    
    });
};

exports.bazkideakeditatu = function(req, res){

  var id = req.session.idKirolElkarteak;
  var idPartaideak = req.params.idPartaideak;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM partaideak WHERE idPartaideak = ?',[idPartaideak],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
          
     
            res.render('partaideakeditatu.handlebars', {page_title:"Partaidea aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
    }); 
};

exports.bazkideakezabatu = function(req,res){
          
     //var id = req.session.idKirolElkarteak;
     var idPartaideak = req.params.idPartaideak;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM partaideak  WHERE idPartaideak = ?",[idPartaideak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/partaideak');
             
        });
        
     });
};

exports.forgot = function(req,res){

    //ADI! reset-en aldatu balio hau aldatuz gero
    var idEnkript = req.body.sPartaideak * 2345678;

    var hosta = req.hostname; 
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }
    var input = JSON.parse(JSON.stringify(req.body));
    var to = input.emailaard;
    var subj ="Pasahitza ahaztu al duzu?";
    var body = "<h2>Klik egin http://"+hosta+"/reset/" + idEnkript +"</h2>";
    body += "<h2>eta pasahitza berria bi aldiz sartu</h2>";
    
    emailService.send(to, subj, body);

    res.redirect('/login');
    };

exports.reset = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var idEnkript = req.params.idPartaideak;

    //ADI! forgot-en aldatu balio hau aldatuz gero
    var id = idEnkript / 2345678;

    if(input.pasahitza != input.pasahitza2){
      res.redirect('/reset/' +id);
    }
    
    else{
    req.getConnection(function (err, connection) {

         // Generate password hash
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(input.pasahitza, salt);

        var data = {
            
            pasahitzaPart    :  password_hash     //input.pasahitza 
        
        };
        
        connection.query("UPDATE partaideak set ? WHERE idPartaideak = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/login');
          
        });
    
    });
  }
};
