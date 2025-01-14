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
//  console.log(req.body.emailaard);
  if(req.body.emailaard == "admin@kirolelkarteak.eus") {
    req.session.erabiltzaile = "admin@kirolelkarteak.eus";
    req.session.partaidea = "admin@kirolelkarteak.eus";
    return res.redirect(303, '/admin/kirolElkarteak');
  }

  var taldea; 
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
       //PASAHITZA ENKRIPTATU GABE
     //connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde = idtxapelketa and emailard = ? and pasahitza = ? and (balidatuta = 1 or balidatuta = "admin") and idtaldeak = ? ',
     // [req.body.emailaard,req.body.pasahitza, req.body.sTaldeak],function(err,rows)     {
      //if(err || rows.length == 0){


      //PASAHITZA ENKRIPTATUTA    
//postgres      connection.query('SELECT * FROM elkarteak,partaideak where idElkarteak = idElkarteakPart and emailPart = ? and  (balidatutaPart >= 1 or balidatutaPart = "admin") and idPartaideak = ? ',
//postgres      [req.body.emailaard,req.body.sPartaideak],function(err,rows)     {
      req.connection.query('SELECT * FROM elkarteak,partaideak where "idElkarteak" = "idElkarteakPart" and "emailPart" = $1 and  ("balidatutaPart" = \'admin\' or "balidatutaPart" >= \'1\') and "idPartaideak" = $2 ',
      [req.body.emailaard,req.body.sPartaideak],function(err,wrows)     {
        rows =wrows.rows;       //postgres
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
            req.session.idPartaideak = rows[0].idPartaideak; 
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
          req.session.idPartaideak = rows[0].idPartaideak; 
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
//postgres          connection.query('SELECT * FROM taldeak where idArduradunTalde = ? and idElkarteakTalde = ?',[req.session.idPartaideak, req.session.idKirolElkarteak],function(err,rowstalde)     {
          req.connection.query('SELECT * FROM taldeak where "idArduradunTalde" = $1 and "idElkarteakTalde" = $2',[req.session.idPartaideak, req.session.idKirolElkarteak],function(err,wrows)     {
            
              if(err)
              console.log("Error Selecting : %s ",err );
              rowstalde =wrows.rows;       //postgres
              if (rowstalde.length!=0){
                  console.log("Arduraduna da! "+ rowstalde[0].idArduradunTalde);
                  req.session.arduraduna=rowstalde[0].idArduradunTalde;
              }


      /*if(req.path == "/taldeak"){
        return res.redirect('/jokalariak');
      }
      else if(req.path == "/sailkapenak"){
        return res.redirect('/jokalariak');
      }
       */
          return res.redirect('/');
       
        //res.render('jokalariak.handlebars', {title : 'Txaparrotan-Taldea', taldeak:taldea} );
          }); 
        
      }
        

                       
         });
       
//postgresConnect    });
 
};

exports.ikusi = function(req, res){

  var id=req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
    req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
      if(err)
          console.log("Error Selecting : %s ",err );
      rowsm =wrows.rows;       //postgres
/*              
      for(var i in rowsm ){
          if(req.body.idMotaPart == rowsm[i].idPartaideMotak){
              rowsm[i].aukeratua = true;
          }
          else
              rowsm[i].aukeratua = false;
      }
*/
//postgres      connection.query('SELECT *, DATE_FORMAT(jaiotzeDataPart,"%Y/%m/%d") AS jaiotzeDataPart FROM partaideMotak, partaideak LEFT JOIN bazkideak ON idPartaideak=idPartaideakBazk WHERE idMotaPart=idPartaideMotak and idElkarteakPart=? order by abizena1Part, abizena2Part, izenaPart',[id],function(err,rows)     {
      req.connection.query('SELECT *, to_char("jaiotzeDataPart", \'YYYY-MM-DD\') AS "jaiotzeDataPart" FROM partaideMotak, partaideak LEFT JOIN bazkideak ON "idPartaideak"="idPartaideakBazk" WHERE "idMotaPart"="idPartaideMotak" and "idElkarteakPart"=$1 order by "abizena1Part", "abizena2Part", "izenaPart"',[id],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows =wrows.rows;       //postgres
          for(var i in rows){
              if(rows[i].idBazkideak){
                rows[i].ezbazkidea = false;
              }
              else
                rows[i].ezbazkidea = true;
                
              if(rows[i].balidatutaPart == 0){
                rows[i].balidatuta = "EZ";
                rows[i].balidatutaNegrita = true;
              }else if (rows[i].balidatutaPart == 1){
//                rows[i].balidatuta = "BAI";
//                rows[i].balidatutaNegrita = true;
                rows[i].balidatuta = rows[i].deskribapenMota;
              }else if (rows[i].balidatutaPart == "admin" ){
                rows[i].balidatuta = "BAI - admin";
                rows[i].balidatutaNegrita = true;

              }
          }

        res.render('partaideak.handlebars', {title : 'KirolElkarteak-Partaideak', data:rows, motak:rowsm, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
        //res.render('partaideak.handlebars', {title : 'KirolElkarteak-Partaideak', data:rows, taldeizena: req.session.taldeizena} );               
         
       });
    });
//postgresConnect  });  
};

exports.ikusimotaz = function(req, res){

  var id=req.session.idKirolElkarteak;
  var idMotaPart = req.params.mota;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
    req.connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
      if(err)
          console.log("Error Selecting : %s ",err );
      rows =wrows.rows;       //postgres              
      for(var i in rowsm ){
          if(idMotaPart == rowsm[i].idPartaideMotak){
              rowsm[i].aukeratua = true;
          }
          else
              rowsm[i].aukeratua = false;
      }
 //postgres     connection.query('SELECT *, DATE_FORMAT(jaiotzeDataPart,"%Y/%m/%d") AS jaiotzeDataPart FROM partaideMotak, partaideak LEFT JOIN bazkideak ON idPartaideak=idPartaideakBazk WHERE idMotaPart=idPartaideMotak and idElkarteakPart=? and idMotaPart = ? order by abizena1Part, abizena2Part, izenaPart',[id,idMotaPart],function(err,rows)     {
      req.connection.query('SELECT *, to_char("jaiotzeDataPart", \'YYYY-MM-DD\') AS "jaiotzeDataPart" FROM partaideMotak, partaideak LEFT JOIN bazkideak ON "idPartaideak"="idPartaideakBazk" WHERE "idMotaPart"="idPartaideMotak" and "idElkarteakPart"=$1 and "idMotaPart" = $2 order by "abizena1Part", "abizena2Part", "izenaPart"',[id,idMotaPart],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows =wrows.rows;       //postgres
          for(var i in rows){
              if(rows[i].idBazkideak){
                rows[i].ezbazkidea = false;
              }
              else
                rows[i].ezbazkidea = true;
                
              if(rows[i].balidatutaPart == 0){
                rows[i].balidatuta = "EZ";
                rows[i].balidatutaNegrita = true;
              }else if (rows[i].balidatutaPart == 1){
//                rows[i].balidatuta = "BAI";
//                rows[i].balidatutaNegrita = true;
                rows[i].balidatuta = rows[i].deskribapenMota;
              }else if (rows[i].balidatutaPart == "admin" ){
                rows[i].balidatuta = "BAI - admin";
                rows[i].balidatutaNegrita = true;

              }
          }

        res.render('partaideak.handlebars', {title : 'KirolElkarteak-Partaideak', data:rows, motak:rowsm, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
        //res.render('partaideak.handlebars', {title : 'KirolElkarteak-Partaideak', data:rows, taldeizena: req.session.taldeizena} );               
         
       });
    });
//postgresConnect  });  
};

/*exports.bilatu = function(req, res){
  req.getConnection(function(err,connection){
     
     var id= '16';  
     connection.query('SELECT * FROM jokalariak,taldeak where idtaldej= ? and idtaldej=idtaldeak',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        console.log(rows);
        res.render('datuak.handlebars', {title : 'Txaparrotan-Datuak', data:rows, taldeak:rows[0], jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
                           
      });
       
    });
  
};*/

exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers-Node.js"});
};
exports.editatu = function(req, res){
   //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idPartaideak = req.params.idPartaideak;
  var generoa = [{izena: "Neska", balioa: "N"}, {izena: "Mutila", balioa: "M"}];
  var admin = (req.path.slice(0,24) == "/admin/partaideakeditatu");
   
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *, DATE_FORMAT(jaiotzeDataPart,"%Y/%m/%d") AS jaiotzeDataPart  FROM partaideak WHERE idPartaideak = ?',[idPartaideak],function(err,rows)
     req.connection.query('SELECT *, to_char("jaiotzeDataPart", \'YYYY-MM-DD\') AS "jaiotzeDataPart" FROM partaideak WHERE "idPartaideak" = $1',[idPartaideak],function(err,wrows)
        {
          if(err)
                console.log("Error Selecting : %s ",err );
          rows =wrows.rows;       //postgres
//postgres          connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
          req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
            
            if(err)
                  console.log("Error Selecting : %s ",err );
            rowsm =wrows.rows;       //postgres              
            if (rows.length == 0){
                res.redirect('/');
            }else{
                for(var i in rowsm ){
                  if(rows[0].idMotaPart == rowsm[i].idPartaideMotak){
                    deskribapenMota = rowsm[i].deskribapenMota;
                    rowsm[i].aukeratua = true;
                  }
                  else
                    rowsm[i].aukeratua = false;
                }

                rows[0].motak = rowsm;    
//postgres            connection.query('SELECT * FROM ordaintzekoErak where idElkarteakOrdaintzekoErak = ? order by idOrdaintzekoErak asc',[id],function(err,rowso) {
            req.connection.query('SELECT * FROM ordaintzekoErak where "idElkarteakOrdaintzekoErak" = $1 order by "idOrdaintzekoErak" asc',[id],function(err,wrows) {
            
              if(err)
                console.log("Error Selecting : %s ",err );
              rowso =wrows.rows;       //postgres
          
            if (rows.length == 0){
              res.redirect('/');
            }else{
              for(var i in rowso ){
                  if(rows[0].idOrdaintzekoEraPart == rowso[i].idOrdaintzekoErak){
                    rowso[i].aukeratua = true;
                  }
                  else
                    rowso[i].aukeratua = false;
              }

              rows[0].ordaintzekoErak = rowso;

              for(var i in generoa ){
                  if(rows[0].sexuaPart == generoa[i].balioa){
                    generoa[i].aukeratua = true;
                  }
                  else
                    generoa[i].aukeratua = false;
                }

              rows[0].generoa = generoa;

              rows[0].ezadmin = !admin;


            res.render('partaideakeditatu.handlebars', {page_title:"Partaidea aldatu",data:rows, partaidea: req.session.partaidea});
            } 
           });  
          }              
         });
        });
//postgresConnect    }); 
};

exports.historiala = function(req, res){
   //var id = req.params.id;
  var id = req.session.idKirolElkarteak;
  var idPartaideak = req.params.idPartaideak;
  var generoa = [{izena: "Neska", balioa: "N"}, {izena: "Mutila", balioa: "M"}];
  var admin = (req.path.slice(0,25) == "/admin/partaidehistoriala");

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT *, DATE_FORMAT(jaiotzeDataPart,"%Y/%m/%d") AS jaiotzeDataPart  FROM partaideak WHERE idPartaideak = ?',[idPartaideak],function(err,rows)
    req.connection.query('SELECT *, to_char("jaiotzeDataPart", \'YYYY-MM-DD\') AS "jaiotzeDataPart"  FROM partaideak WHERE "idPartaideak" = $1',[idPartaideak],function(err,wrows)
        {
          if(err)
                console.log("Error Selecting : %s ",err );
          rows =wrows.rows;       //postgres
//postgres     connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idDenboraldiaTalde = idDenboraldia and idPartaideak = idArduradunTalde and idTaldeakKide = idTaldeak and idPartaideakKide = ? and idElkarteakTalde = ? order by deskribapenaDenb desc, zenbakiMota',[idPartaideak,id],function(err,rowsk) {
     req.connection.query('SELECT *,to_char("jaiotzeDataPart", \'YYYY-MM-DD\') AS "jaiotzeDataPart" FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idDenboraldiaTalde" = "idDenboraldia" and "idPartaideak" = "idArduradunTalde" and "idTaldeakKide" = "idTaldeak" and "idPartaideakKide" = $1 and "idElkarteakTalde" = $2 order by "deskribapenaDenb" desc, "zenbakiMota"',[idPartaideak,id],function(err,wrows) {
      if(err)
           console.log("Error Selecting : %s ",err );
      rowsk =wrows.rows;       //postgres
      rows[0].historialkide = rowsk;
//postgres      connection.query('SELECT *, DATE_FORMAT(dataBazk,"%Y/%m/%d") AS dataBazk FROM bazkideak, ordaintzekoErak, partaideMotak, denboraldiak WHERE idMotaBazk=idPartaideMotak and idOrdaintzekoEraBazk=idOrdaintzekoErak and idDenboraldiaBazk = idDenboraldia and idElkarteakBazkide=? and idPartaideakBazk = ? order by idDenboraldiaBazk desc, idBazkideak',[id, idPartaideak],function(err,rowsb)     {
      req.connection.query('SELECT *, to_char("dataBazk", \'YYYY-MM-DD\') AS "dataBazk" FROM bazkideak, ordaintzekoErak, partaideMotak, denboraldiak WHERE "idMotaBazk"="idPartaideMotak" and "idOrdaintzekoEraBazk"="idOrdaintzekoErak" and "idDenboraldiaBazk" = "idDenboraldia" and "idElkarteakBazkide"=$1 and "idPartaideakBazk" = $2 order by "idDenboraldiaBazk" desc, "idBazkideak"',[id, idPartaideak],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsb =wrows.rows;       //postgres
        rows[0].historialbazkide = rowsb;    
  
        rows[0].ezadmin = !admin;

        res.render('partaidehistoriala.handlebars', {page_title:"Partaide Historiala",data:rows, partaidea: req.session.partaidea});
      });  
     });
    });
//postgresConnect  }); 
};

exports.partaidemail = function(req, res){

  var id = req.params.emaila;
// console.log("Elkartea:"+req.session.idKirolElkarteak);
// console.log("Email:"+id);
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT idPartaideak, izenaPart FROM partaideak where (balidatutaPart = "admin" or balidatutaPart >= 1) and emailPart = ? and idElkarteakPart = ?',[id,req.session.idKirolElkarteak],function(err,rows)     
      req.connection.query('SELECT "idPartaideak", "izenaPart" FROM partaideak where ("balidatutaPart" = \'admin\' or "balidatutaPart" >= \'1\') and "emailPart" = $1 and "idElkarteakPart" = $2',[id,req.session.idKirolElkarteak],function(err,wrows)     
     
        {
            if(err)
                console.log("Error Selecting : %s ",err );

            //res.render('forgot.handlebars', {title : 'Txaparrotan-Forgot', emailaard : id, taldeak : rows });
            rows = wrows.rows;     //postgres
//            console.log("filak:"+JSON.stringify(rows));
            if(rows.length != 0)
                console.log("Nor dabil : "+ rows[0].izenaPart);
            res.json(rows);

         });
                  
//postgresConnect  }); 
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
   var generoa = [{izena: "Neska", balioa: "N"}, {izena: "Mutila", balioa: "M"}];

    var now= new Date();

//    console.log("idKirolElkarteak:" + req.session.idKirolElkarteak);
    var id = req.session.idKirolElkarteak;
/*
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
*/
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
    req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
      if(err)
          console.log("Error Selecting : %s ",err );
      rowsm = wrows.rows;     //postgres              
      for(var i in rowsm ){
          if(req.body.idMotaPart == rowsm[i].idPartaideMotak){
              rowsm[i].aukeratua = true;
          }
          else
              rowsm[i].aukeratua = false;
      }
//postgres      connection.query('SELECT * FROM ordaintzekoErak where idElkarteakOrdaintzekoErak = ? order by idOrdaintzekoErak asc',[id],function(err,rowso) {
      req.connection.query('SELECT * FROM ordaintzekoErak where "idElkarteakOrdaintzekoErak" = $1 order by "idOrdaintzekoErak" asc',[id],function(err,wrows) {
           
        if(err)
           console.log("Error Selecting : %s ",err );
        rowso = wrows.rows;     //postgres
         for(var i in rowso ){
                  if(req.body.idOrdaintzekoEraPart == rowso[i].idOrdaintzekoErak){
                    rowso[i].aukeratua = true;
                  }
                  else
                    rowso[i].aukeratua = false;
          }

          for(var i in generoa ){
                  if(req.body.sexuaPart == generoa[i].balioa){
                    generoa[i].aukeratua = true;
                  }
                  else
                    generoa[i].aukeratua = false;
          }

 
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
            sexuaPart: req.body.sexuaPart,
            //pasahitzaPart:   password_hash,  
            berezitasunakPart: req.body.berezitasunakPart,
            idOrdaintzekoEraPart: req.body.idOrdaintzekoEraPart,
            kontuZenbPart: req.body.kontuZenbPart,
            kontuIbanPart: req.body.kontuIbanPart,
            ordaintzekoErak : rowso,
            motak : rowsm,
            generoa : generoa             

          } );
      }
//postgres      connection.query('SELECT * FROM partaideak where idElkarteakPart= ? and nanPart = ?',[req.session.idKirolElkarteak, req.body.nanPart],function(err,rows)  {
      req.connection.query('SELECT * FROM partaideak where "idElkarteakPart"= $1 and "nanPart" = $2',[req.session.idKirolElkarteak, req.body.nanPart],function(err,wrows)  {
        console.log("NAN : " + req.body.nanPart); 
        rows = wrows.rows;     //postgres           
        if(err || (rows.length != 0 && req.body.nanPart)){
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
            sexuaPart: req.body.sexuaPart,
            //pasahitzaPart:   password_hash,  
            berezitasunakPart: req.body.berezitasunakPart,
            idOrdaintzekoEraPart: req.body.idOrdaintzekoEraPart,
            kontuZenbPart: req.body.kontuZenbPart,
            kontuIbanPart: req.body.kontuIbanPart,
            ordaintzekoErak : rowso,
            motak : rowsm,
            generoa : generoa                  

          } );
        }
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ?',[req.session.idKirolElkarteak],function(err,rowst){          
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1',[req.session.idKirolElkarteak],function(err,wrows){          
            
            if(err)
                console.log("Error inserting : %s ",err );
            rowst = wrows.rows;     //postgres
        // Generate password hash
            var salt = bcrypt.genSaltSync();
            var password_hash = bcrypt.hashSync(input.pasahitzaPart, salt);
            //var elkartea = rowst.izenaElk;
//            console.log("Hau da elkartea: "+rowst[0].idElkarteak);
//            console.log("Elkartea:" +JSON.stringify(rowst));
            //console.log("Hau da elkarte id: "+req.session.idKirolElkarteak);

          

             var data = { //Partaidearen datuak
              idMotaPart : input.idMotaPart,
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
              kontuIbanPart: input.kontuIbanPart,                  
//ADI              balidatutaPart : "0"
              balidatutaPart : "1"
            };
//postgres         var query = req.connection.query("INSERT INTO partaideak set ? ",data, function(err, rows)
            var query = req.connection.query('INSERT INTO partaideak(idMotaPart,izenaPart,abizena1Part,abizena2Part,bazkideZenbPart,helbideaPart,postaKodeaPart,nanPart,herriaPart,telefonoaPart,emailPart,idElkarteakPart,jaiotzeDataPart,sexuaPart,pasahitzaPart,berezitasunakPart,idOrdaintzekoEraPart,kontuZenbPart,kontuIbanPart,balidatutaPart) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) ',[input.idMotaPart,input.izenaPart,input.abizena1Part,input.abizena2Part,input.bazkideZenbPart,input.helbideaPart,input.postaKodeaPart,input.nanPart,input.herriaPart,input.telefonoaPart,input.emailPart,id,input.jaiotzeDataPart,input.sexuaPart,password_hash,input.berezitasunakPart,input.idOrdaintzekoEraPart,input.kontuZenbPart,input.kontuIbanPart,"1"], function(err, rows)
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
/*
         //Partaidea sortzeko bidaliko den mezua BALIDAZIO LINKAREKIN
         var body = "<p>"+rowst[0].izenaElk+" elkartean partaidetza balidatu ahal izateko, </p>";
         body += "<h3> klik egin: http://"+hosta+"/partaideakbalidatu/" + partaideZenbakia+ ". </h3>";
         body += "<p> Ez bazaizu klikatzeko link moduan agertzen, kopiatu eta pegatu nabigatzailean. </p>";
         body += "<p>Ondoren, login egin ziurtatzeko dena ongi dagoela.</p>";
         body += "<p>Mila esker!</p>";
          req.session.idPartaideak = rows.insertId;
          emailService.send(to, subj, body);
         
          res.render('partaideakeskerrak.handlebars', {title: "Mila esker!", partaideizena:data.izenaPart, elkarteizena:rowst[0].izenaElk, emailPart:data.emailPart, atalak: req.session.atalak, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia,idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
*/ 
          res.redirect('/partaideak');
          });
        });
       }); 
      });
    });
//postgresConnect  });
  //});
};

exports.partaideakgehitu = function(req, res){ //Datu basetik conboBox-ak betetzeko
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var generoa = [{izena: "Neska", balioa: "N"}, {izena: "Mutila", balioa: "M"}];

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
    connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
      if(err)
           console.log("Error Selecting : %s ",err ); 
      rows = wrows.rows;     //postgres
      connection.query('SELECT * FROM ordaintzekoErak where idElkarteakOrdaintzekoErak = ? order by idOrdaintzekoErak asc',[id],function(err,rowso) {
        if(err)
          console.log("Error Selecting : %s ",err );
              //rows[0].generoa = generoa;
        rows = wrows.rows;     //postgres    
         //console.log("Berriak:" +JSON.stringify(rows));
        res.render('partaideakgehitu.handlebars', {title : 'KirolElkarteak-PartaideakGehitu', motak:rowsm, generoa:generoa, ordaintzekoErak: rowso, partaidea: req.session.partaidea});

      });    
    });
         
//postgresConnect  });
};
exports.aldatu = function(req,res){
    
//    var input = JSON.parse(JSON.stringify(req.body));
    res.locals.flash = null;
   var generoa = [{izena: "Neska", balioa: "N"}, {izena: "Mutila", balioa: "M"}];

    var now= new Date();

//    console.log("idKirolElkarteak:" + req.session.idKirolElkarteak);
    var id = req.session.idKirolElkarteak;

    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idPartaideak = req.params.idPartaideak;
//    res.locals.flash = null;
   var admin = (req.path.slice(0,6) == "/admin");
//  var generoa = [{izena: "Neska"}, {izena: "Mutila"}];    
/*
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
*/
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
    req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" =$1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
      if(err)
          console.log("Error Selecting : %s ",err );
      rowsm = wrows.rows;     //postgres             
      for(var i in rowsm ){
          if(req.body.idMotaPart == rowsm[i].idPartaideMotak){
              rowsm[i].aukeratua = true;
          }
          else
              rowsm[i].aukeratua = false;
      }
//postgres      connection.query('SELECT * FROM ordaintzekoErak where idElkarteakOrdaintzekoErak = ? order by idOrdaintzekoErak asc',[id],function(err,rowso) {
      req.connection.query('SELECT * FROM ordaintzekoErak where "idElkarteakOrdaintzekoErak" = $1 order by "idOrdaintzekoErak" asc',[id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
         rowso = wrows.rows;     //postgres
         for(var i in rowso ){
                  if(req.body.idOrdaintzekoEraPart == rowso[i].idOrdaintzekoErak){
                    rowso[i].aukeratua = true;
                  }
                  else
                    rowso[i].aukeratua = false;
          }

          for(var i in generoa ){
                  if(req.body.sexuaPart == generoa[i].balioa){
                    generoa[i].aukeratua = true;
                  }
                  else
                    generoa[i].aukeratua = false;
          }

 
      if(res.locals.flash != null){

        //Erroreak badaude "local.flash" aldagaian gordeak, itzuli balioak errorearekin
         return res.render('partaideakeditatu.handlebars', {
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
            sexuaPart: req.body.sexuaPart,
            //pasahitzaPart:   password_hash,  
            berezitasunakPart: req.body.berezitasunakPart,
            idOrdaintzekoEraPart: req.body.idOrdaintzekoEraPart,
            kontuZenbPart: req.body.kontuZenbPart,
            kontuIbanPart: req.body.kontuIbanPart,
            ordaintzekoErak : rowso,
            motak : rowsm,
            generoa : generoa             

          } );
      }
//postgres      connection.query('SELECT * FROM partaideak where idElkarteakPart= ? and nanPart = ?',[req.session.idKirolElkarteak, req.body.nanPart],function(err,rows)  {
      req.connection.query('SELECT * FROM partaideak where "idElkarteakPart"= $1 and "nanPart" = $2',[req.session.idKirolElkarteak, req.body.nanPart],function(err,wrows)  {
        console.log("NAN : " + req.body.nanPart); 
        rows = wrows.rows;     //postgres   
        if(err || (rows.length > 1 && req.body.nanPart)){       // rows.length != 0
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'NAN zenbaki horrekin partaide bat sortuta dago! Elkartearekin harremanetan jar zaitez.',
           };

           //NAN berdineko partaidea existitzen bada, errorea dago eta balioak itzuli formulategian
          return res.render('partaideakeditatu.handlebars', {
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
            sexuaPart: req.body.sexuaPart,
            //pasahitzaPart:   password_hash,  
            berezitasunakPart: req.body.berezitasunakPart,
            idOrdaintzekoEraPart: req.body.idOrdaintzekoEraPart,
            kontuZenbPart: req.body.kontuZenbPart,
            kontuIbanPart: req.body.kontuIbanPart,
            ordaintzekoErak : rowso,
            motak : rowsm,
            generoa : generoa                  

          } );
        }
//postgres        connection.query('SELECT * FROM elkarteak where idElkarteak = ?',[req.session.idKirolElkarteak],function(err,rowst){          
        req.connection.query('SELECT * FROM elkarteak where "idElkarteak" = $1',[req.session.idKirolElkarteak],function(err,wrows){          
            
            if(err)
                console.log("Error inserting : %s ",err );
            rowst = wrows.rows;     //postgres
        // Generate password hash
            var salt = bcrypt.genSaltSync();
            var password_hash = bcrypt.hashSync(input.pasahitzaPart, salt);
            //var elkartea = rowst.izenaElk;
//            console.log("Hau da elkartea: "+rowst[0].idElkarteak);
//            console.log("Elkartea:" +JSON.stringify(rowst));
            //console.log("Hau da elkarte id: "+req.session.idKirolElkarteak);

          

             var data = { //Partaidearen datuak
              idMotaPart : input.idMotaPart,
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
//              idElkarteakPart : id,
              jaiotzeDataPart: input.jaiotzeDataPart,
              sexuaPart: input.sexuaPart,
//              pasahitzaPart:   password_hash,  
              berezitasunakPart: input.berezitasunakPart,
              idOrdaintzekoEraPart: input.idOrdaintzekoEraPart,
              kontuZenbPart: input.kontuZenbPart, 
              kontuIbanPart: input.kontuIbanPart                 
//              balidatutaPart : "0"
            };
//postgres           connection.query("UPDATE partaideak set ? WHERE idPartaideak = ? ",[data,idPartaideak], function(err, rows)
           req.connection.query('UPDATE partaideak set "idMotaPart"=$1,"izenaPart"=$2,"abizena1Part"=$3,"abizena2Part"=$4,"bazkideZenbPart"=$5,"helbideaPart"=$6,"postaKodeaPart"=$7,"nanPart"=$8,"herriaPart"=$9,"telefonoaPart"=$10,"emailPart"=$11,"jaiotzeDataPart"=$12,"sexuaPart"=$13,"berezitasunakPart"=$14,"idOrdaintzekoEraPart"=$15,"kontuZenbPart"=$16,"kontuIbanPart"=$17 WHERE idPartaideak = $18 ',[input.idMotaPart,input.izenaPart,input.abizena1Part,input.abizena2Part,input.bazkideZenbPart,input.helbideaPart,input.postaKodeaPart,input.nanPart,input.herriaPart,input.telefonoaPart,input.emailPart,input.jaiotzeDataPart,input.sexuaPart,input.berezitasunakPart,input.idOrdaintzekoEraPart,input.kontuZenbPart,input.kontuIbanPart,idPartaideak], function(err, rows)

           {
  
            if (err)
              console.log("Error inserting : %s ",err );
       
            if (req.session.erabiltzaile=="admin")
               res.redirect('/partaideak');
            else
               res.redirect('/');
          });
        });
       }); 
      });
    });
//postgresConnect  });
  //});
};
exports.aldatu2 = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idKirolElkarteak;
    var idPartaideak = req.params.idPartaideak;
//    res.locals.flash = null;
   var admin = (req.path.slice(0,6) == "/admin");
  var generoa = [{izena: "Neska"}, {izena: "Mutila"}];

debugger;
    //Errore kontrolak
/*  if(!req.body.nanPart.match(VALID_DNI_REGEX)) {
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

  /*else if(req.body.pasahitzaPart != req.body.pasahitzaPart2) {
    if(req.xhr) return res.json({ error: 'Invalid password' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Pasahitzak ez dira berdinak',
    };
  }*/
/*
  else if(req.body.emailPart != req.body.emailPart2) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emailak ez dira berdinak',
    };
  }
 */ 
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//        if(err)
//           console.log("Error Selecting : %s ",err );
 req.connection.query('SELECT * FROM ordaintzekoErak where idElkarteakOrdaintzekoErak = ? order by idOrdaintzekoErak asc',[id],function(err,rowso) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

         for(var i in rowso ){
                  if(req.body.idOrdaintzekoEraPart == rowso[i].idOrdaintzekoErak){
                    rowso[i].aukeratua = true;
                  }
                  else
                    rowso[i].aukeratua = false;
          }

          for(var i in generoa ){
                  if(req.body.sexuaPart == generoa[i].balioa){
                    generoa[i].aukeratua = true;
                  }
                  else
                    generoa[i].aukeratua = false;
          }


    req.connection.query('SELECT * FROM elkarteak,partaideak where idElkarteak = idElkarteakPart and idPartaideak = ? ',
      [idPartaideak],function(err,rows)     {
        if(err || rows.length == 0 || !(bcrypt.compareSync(req.body.pasahitzaPart, rows[0].pasahitzaPart))){

          if(err)
            console.log("Error Selecting : %s ",err );

          if(req.xhr) return res.json({ error: 'Invalid password.' });
             res.locals.flash = {
             type: 'danger',
             intro: 'Adi!',
             message: 'Pasahitza ez da zuzena. Aldaketak egin ahal izateko zure erabiltzaileari dagokion pasahitza idatzi.',
          };

        };


      var data = [{
            idMotaPart : req.body.idMotaPart,
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
            sexuaPart: req.body.sexuaPart,
            //pasahitzaPart:   password_hash,  
            //berezitasunakPart: req.body.berezitasunakPart,
            idOrdaintzekoEraPart: req.body.idOrdaintzekoEraPart,
            kontuZenbPart: req.body.kontuZenbPart,
            ezadmin : !admin,
            ordaintzekoErak : rowso,
            generoa : generoa,
            idPartaideak : idPartaideak


      }];
  


      if(res.locals.flash != null){

        //Erroreak badaude "local.flash" aldagaian gordeak, itzuli balioak errorearekin
         return res.render('partaideakeditatu.handlebars', {
            title : 'Partaideak-Editatu',
            idKirolElkarteak : req.session.idKirolElkarteak, 
            data : data,
            partaidea: req.session.partaidea         

          } );
      }


    
    
        
        var data2 = {
            idMotaPart : input.idMotaPart,
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
            jaiotzeDataPart: input.jaiotzeDataPart,
            sexuaPart: input.sexuaPart,
            //pasahitzaPart:   password_hash,  
            berezitasunakPart: input.berezitasunakPart,
            idOrdaintzekoEraPart: input.idOrdaintzekoEraPart,
            kontuZenbPart: input.kontuZenbPart                
            
        
        };
        
        req.connection.query("UPDATE partaideak set ? WHERE idPartaideak = ? ",[data2,idPartaideak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
         if (req.session.erabiltzaile=="admin")
          res.redirect('/partaideak');
         else
          res.redirect('/');
          
        });

      });
    
    });  
//postgresConnect  });
 };


exports.balidatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var idEnkript = req.params.id;

    //ADI! partaideasortu-n aldatu balio hau aldatuz gero
    var id = idEnkript / 3456789;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            balidatutaPart    : 1
        
        };
//postgres        connection.query("UPDATE partaideak set ? WHERE idPartaideak = ? and balidatutaPart = 0" ,[data,id], function(err, rows)
        req.connection.query('UPDATE partaideak set "balidatutaPart"=$1 WHERE idPartaideak = $2 and balidatutaPart = $3' ,[1,id,0], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/login');
          
        });
    
//postgresConnect    });
};

exports.ezabatu = function(req,res){
          
     //var id = req.params.id;
     //var id = req.session.idKirolElkarteak;
     var idPartaideak = req.params.idPartaideak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres 
//postgres        connection.query("DELETE FROM partaideak  WHERE idPartaideak = ?",[idPartaideak], function(err, rows)
        req.connection.query('DELETE FROM partaideak  WHERE "idPartaideak" = $1',[idPartaideak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/partaideak');
             
        });
        
//postgresConnect     });
};

exports.partaideakkargatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM taldeak,mailak where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by idMailaTalde asc',[id,idDenboraldia],function(err,rowst) {
     req.connection.query('SELECT * FROM taldeak,mailak where "idMailak"="idMailaTalde" and "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2 order by "idMailaTalde" asc',[id,idDenboraldia],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rowst = wrows.rows;     //postgres 

            res.render('partaideakkargatu.handlebars', {title : 'KirolElkarteak-Partaideak kargatu', taldeak:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
         
      });  
           
//postgresConnect  });
};

exports.partaideakkargatuegin = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var now= new Date();
    var partaideak = input.partaideakCSV.split("\n"); //CSV-a zatitu lerroka (partiduka)
    var partaidea = [];
    var idTaldeakPartaide, OrdaintzekoEraPart;
    var kanpoPosizio, etxePosizio, partaideanoiz, aOrdua, vEguna, vBukaera;
//    var vEguna = new Date(); 
//    var vBukaera = new Date();
    var ordua = input.hasierakoordua;

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM elkarteak, denboraldiak where idElkarteakDenb = idElkarteak and idDenboraldia = ?',[idDenboraldia],function(err,rowst){          
     req.connection.query('SELECT * FROM elkarteak, denboraldiak where "idElkarteakDenb" = "idElkarteak" and "idDenboraldia" = $1',[idDenboraldia],function(err,wrows){          
            
      if(err)
         console.log("Error inserting : %s ",err );
      rowst = wrows.rows;     //postgres 
      for (var i in partaideak){ //Partidu bakoitzeko datuak atera, ","-kin banatuta daudelako split erabiliz
          partaidea = partaideak[i].split(";");
          console.log(partaideak[i]);
//debugger;
//      connection.query('SELECT * FROM partaideak where idElkarteakPart= ? and nanPart = ?',[req.session.idKirolElkarteak, req.body.nanPart],function(err,rows)  {
//       if(err || rows.length != 0){

        // Generate password hash
          var salt = bcrypt.genSaltSync();
          var password_hash = bcrypt.hashSync(partaidea[14], salt);

          var data = {
            izenaPart : partaidea[0],
            abizena1Part : partaidea[1],
            abizena2Part : partaidea[2],
            nanPart : partaidea[3],     
            bazkideZenbPart : partaidea[4],
            jaiotzeDataPart : partaidea[5],
            helbideaPart : partaidea[6],              
            telefonoaPart : partaidea[7],
            herriaPart : partaidea[8],
            postaKodeaPart : partaidea[9],
            emailPart : partaidea[10],
            kontuZenbPart : partaidea[11],
            idOrdaintzekoEraPart : partaidea[12],
            idElkarteakPart : id,
            balidatutaPart : partaidea[13],
            pasahitzaPart : password_hash,          //partaidea[14],
            sexuaPart : partaidea[15],
            berezitasunakPart : partaidea[16],
            idMotaPart : partaidea[17] 
          };

//postgres         var query = req.connection.query("INSERT INTO partaideak set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO partaideak("izenaPart","abizena1Part","abizena2Part","nanPart","bazkideZenbPart","jaiotzeDataPart","helbideaPart","telefonoaPart","herriaPart","postaKodeaPart","emailPart","kontuZenbPart","idOrdaintzekoEraPart","idElkarteakPart","balidatutaPart","pasahitzaPart","sexuaPart","berezitasunakPart","idMotaPart") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) ',[partaidea[0],partaidea[1],partaidea[2],partaidea[3],partaidea[4],partaidea[5],partaidea[6],partaidea[7],partaidea[8],partaidea[9],partaidea[10],partaidea[11],partaidea[12],id,partaidea[13],password_hash,partaidea[15],partaidea[16],partaidea[17]], function(err, rows)
        {
         if (err)
              console.log("Error inserting : %s ",err );

         if (input.idTaldeakPartaide != "")
              idTaldeakPartaide = input.idTaldeakPartaide;
         else
              idTaldeakPartaide = partaidea[18];

         if (idTaldeakPartaide != "")

          {  
           var data = {
//            materialaKide    : partaidea[17],
//            ordainduKide   : partaidea[18],
            ordaintzekoKide   : rowst[0].kuotaDenb,
//            kamixetaZenbKide : partaidea[19],
            idMotaKide : partaidea[17],
            idTaldeakKide : idTaldeakPartaide, // input.idTaldeakPartaide,   // partaidea[21],
            idPartaideakKide: rows.insertId,
//            bazkideZenbKide : partaidea[22],
            idElkarteakKide : id
           };
       
//postgres           var query = req.connection.query("INSERT INTO taldekideak set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO taldekideak ("ordaintzekoKide","idMotaKide","idTaldeakKide","idPartaideakKide","idElkarteakKide") VALUES ($1,$2,$3,$4,$5)',[rowst[0].kuotaDenb,partaidea[17],idTaldeakPartaide,rows.insertId,id], function(err, rows)

             {
  
              if (err)
               console.log("Error inserting : %s ",err );
           });
          }
/*
          else  
              if (partaidea[18] != "")
               {
                if (partaidea[18] != "K/K")
                    OrdaintzekoEraPart = 3;
                else  
                    OrdaintzekoEraPart = 4;
                var data = { 

                 idDenboraldiaBazk : idDenboraldia,
                 idPartaideakBazk: idPartaideak,
                 ordainduBazk: partaidea[18],                               //"EZ",
                 idOrdaintzekoEraBazk: OrdaintzekoEraPart,
                 idElkarteakBazkide: id
                };

                var query = connection.query("INSERT INTO bazkideak set ? ",data, function(err, rows)
                {
  
                 if (err)
                    console.log("Error inserting : %s ",err );
                });
              }       
*/      
        }); 
      }
      res.redirect('/admin/partaideak');
     });
//postgresConnect    });
};

// BAZKIDEAK

exports.bazkideakikusi = function(req, res){

  var id=req.session.idKirolElkarteak;
  req.session.idDenboraldia = req.params.idDenboraldia;
  var idDenboraldia = req.params.idDenboraldia;
  var idDenboraldiaSesioa = idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *, DATE_FORMAT(dataBazk,"%Y/%m/%d") AS dataBazk FROM bazkideak, partaideak, ordaintzekoErak, partaideMotak WHERE idMotaBazk=idPartaideMotak and idOrdaintzekoEraBazk=idOrdaintzekoErak and idPartaideakBazk=idPartaideak and idElkarteakBazkide=? and idDenboraldiaBazk = ? order by bazkideZenbPart, abizena1Part, abizena2Part, izenaPart',[id, idDenboraldia],function(err,rows)     {
     req.connection.query('SELECT *, to_char("dataBazk", \'YYYY-MM-DD\') AS "dataBazk" FROM bazkideak, partaideak, ordaintzekoErak, partaideMotak WHERE "idMotaBazk"="idPartaideMotak" and "idOrdaintzekoEraBazk"="idOrdaintzekoErak" and "idPartaideakBazk"="idPartaideak" and "idElkarteakBazkide"=$1 and "idDenboraldiaBazk" = $2 order by "bazkideZenbPart", "abizena1Part", "abizena2Part", "izenaPart"',[id, idDenboraldia],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
//postgres        connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
        req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
          if(err)
          console.log("Error Selecting : %s ",err );
          rowsm = wrows.rows;     //postgres 
//postgres          connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
          req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsdenb = wrows.rows;     //postgres 
            for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
            }
        
        res.render('bazkideak.handlebars', {title : 'KirolElkarteak-Bazkideak', data:rows, motak:rowsm, denboraldiak:rowsdenb, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
        //res.render('partaideak.handlebars', {title : 'KirolElkarteak-Partaideak', data:rows, taldeizena: req.session.taldeizena} );               
          });
        });       
    });

//postgresConnect  });
  
};

exports.bazkideakikusimotaz = function(req, res){

  var id=req.session.idKirolElkarteak;
  var idDenboraldia = req.params.idDenboraldia;
  var idMotaBazk = req.params.mota;
  req.session.idDenboraldia = idDenboraldia;
  var idDenboraldiaSesioa = idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *, DATE_FORMAT(dataBazk,"%Y/%m/%d") AS dataBazk FROM bazkideak, partaideak, ordaintzekoErak, partaideMotak WHERE idMotaBazk=idPartaideMotak and idOrdaintzekoEraBazk=idOrdaintzekoErak and idPartaideakBazk=idPartaideak and idElkarteakBazkide=? and idDenboraldiaBazk = ? and idMotaBazk = ? order by bazkideZenbPart, abizena1Part, abizena2Part, izenaPart',[id, idDenboraldia, idMotaBazk],function(err,rows)     {
     req.connection.query('SELECT *, to_char("dataBazk", \'YYYY-MM-DD\') AS "dataBazk" FROM bazkideak, partaideak, ordaintzekoErak, partaideMotak WHERE "idMotaBazk"="idPartaideMotak" and "idOrdaintzekoEraBazk"="idOrdaintzekoErak" and "idPartaideakBazk"="idPartaideak" and "idElkarteakBazkide"=$1 and "idDenboraldiaBazk" = $2 and "idMotaBazk" = $3 order by "bazkideZenbPart", "abizena1Part", "abizena2Part", "izenaPart"',[id, idDenboraldia, idMotaBazk],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
//postgres        connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
        req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
          if(err)
            console.log("Error Selecting : %s ",err );
          rowsm = wrows.rows;     //postgres 
          for(var i in rowsm ){
            if(idMotaBazk == rowsm[i].idPartaideMotak){
              rowsm[i].aukeratua = true;
            }
            else
               rowsm[i].aukeratua = false;
          }
//postgres          connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
          req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
          
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsdenb = wrows.rows;     //postgres 
            for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
            }
        
        res.render('bazkideak.handlebars', {title : 'KirolElkarteak-Bazkideak', data:rows, motak:rowsm, denboraldiak:rowsdenb, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea} );
        //res.render('partaideak.handlebars', {title : 'KirolElkarteak-Partaideak', data:rows, taldeizena: req.session.taldeizena} );               
          });
        });       
    });

//postgresConnect  });
  
};

exports.bazkideakikusiegoerarekin = function(req, res){

  var id=req.session.idKirolElkarteak;
  var idDenboraldia = req.params.idDenboraldia;
  var idMotaBazk = req.params.mota;
  var egoera = req.params.egoera;
  req.session.idDenboraldia = idDenboraldia;
  //var idDenboraldia = req.session.idDenboraldia;
  var idDenboraldiaSesioa = idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT *, DATE_FORMAT(dataBazk,"%Y/%m/%d") AS dataBazk FROM bazkideak, partaideak, ordaintzekoErak, partaideMotak WHERE idMotaBazk=idPartaideMotak and idOrdaintzekoEraBazk=idOrdaintzekoErak and idPartaideakBazk=idPartaideak and idElkarteakBazkide=? and idDenboraldiaBazk = ? and idMotaBazk = ? and egoeraBazk = ? order by bazkideZenbPart, abizena1Part, abizena2Part, izenaPart',[id, idDenboraldia, idMotaBazk, egoera],function(err,rows)     {
     req.connection.query('SELECT *, to_char("dataBazk", \'YYYY-MM-DD\') AS "dataBazk" FROM bazkideak, partaideak, ordaintzekoErak, partaideMotak WHERE "idMotaBazk"="idPartaideMotak" and "idOrdaintzekoEraBazk"="idOrdaintzekoErak" and "idPartaideakBazk"="idPartaideak" and "idElkarteakBazkide=$1 and "idDenboraldiaBazk" = $2 and "idMotaBazk" = $3 and "egoeraBazk" = $4 order by "bazkideZenbPart", "abizena1Part", "abizena2Part", "izenaPart"',[id, idDenboraldia, idMotaBazk, egoera],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
//postgres        connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
        req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
          if(err)
            console.log("Error Selecting : %s ",err );
          rowsm = wrows.rows;     //postgres               
          for(var i in rowsm ){
            if(idMotaBazk == rowsm[i].idPartaideMotak){
              rowsm[i].aukeratua = true;
            }
            else
               rowsm[i].aukeratua = false;
          }
//postgres          connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
          req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsdenb = wrows.rows;     //postgres 
            for(var i in rowsdenb ){
                if(req.session.idDenboraldia == rowsdenb[i].idDenboraldia){
                    rowsdenb[i].aukeratua = true;
                  }
                  else
                    rowsdenb[i].aukeratua = false;
            }
        
        res.render('bazkideak.handlebars', {title : 'KirolElkarteak-Bazkideak', data:rows, motak:rowsm, denboraldiak:rowsdenb, egoera:egoera, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, mota: idMotaBazk} );
        //res.render('partaideak.handlebars', {title : 'KirolElkarteak-Partaideak', data:rows, taldeizena: req.session.taldeizena} );               
          });
        });       
    });
//postgresConnect  });
};

exports.bazkideaksortu = function(req,res){
    var id=req.session.idKirolElkarteak;
    var idDenboraldia =req.session.idDenboraldia;
    var idPartaideak = req.params.idPartaideak;
    var now= new Date();
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 

//postgres       var query = connection.query("SELECT * FROM partaideak where idElkarteakPart = ? and idPartaideak = ?",[id, idPartaideak], function(err, rows){
      var query = req.connection.query('SELECT * FROM partaideak where "idElkarteakPart" = $1 and "idPartaideak" = $2',[id, idPartaideak], function(err, wrows){
  
            if (err)
              console.log("Error inserting : %s ",err );
            rows = wrows.rows;     //postgres 
        var data = { 
              idMotaBazk: rows[0].idMotaPart,
              idDenboraldiaBazk : idDenboraldia,
              idPartaideakBazk: idPartaideak,
              ordainduBazk: "EZ",
              idOrdaintzekoEraBazk: rows[0].idOrdaintzekoEraPart,
              idElkarteakBazkide: id,
              dataBazk : now
            };
//postgres            var query = req.connection.query("INSERT INTO bazkideak set ? ",data, function(err, rows)
          var query = req.connection.query('INSERT INTO bazkideak ("idMotaBazk","idDenboraldiaBazk","idPartaideakBazk","ordainduBazk","idOrdaintzekoEraBazk","idElkarteakBazkide","dataBazk") VALUES ($1,$2,$3,$4,$5,$6,$7)',[rows[0].idMotaPart,idDenboraldia,idPartaideak,"EZ",rows[0].idOrdaintzekoEraPart,id,now], function(err, rows)
           {
  
            if (err)
              console.log("Error inserting : %s ",err );

            res.redirect('/partaideak');

       

          });
        });
//postgresConnect    });    

  };

exports.bazkideegoerakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia =req.session.idDenboraldia;
    var idMotaBazk = req.params.mota;
    var egoera = req.params.egoera;
    var now = new(Date);

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {

            egoeraBazk : input.egoeraBerria,
            dataBazk : now
        };
//postgres        connection.query("UPDATE bazkideak set ? WHERE idElkarteakBazkide = ? and idDenboraldiaBazk = ? and idMotaBazk = ? and egoeraBazk = ? ",[data, id, idDenboraldia, idMotaBazk, egoera], function(err, rows)
        req.connection.query('UPDATE bazkideak set "egoeraBazk"=$1,"dataBazk"=$2 WHERE "idElkarteakBazkide" = $3 and "idDenboraldiaBazk" = $4 and "idMotaBazk" = $5 and "egoeraBazk" = $6 ',[input.egoeraBerria, now, id, idDenboraldia, idMotaBazk, egoera], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/bazkideak/'+ idDenboraldia + '/' + idMotaBazk + '/' + input.egoeraBerria);
          
        });
    
//postgresConnect   });
};

exports.bazkideakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idBazkideak = req.params.idBazkideak;
    var idDenboraldia = req.session.idDenboraldia;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            idMotaBazk: input.idMotaBazk,
            idOrdaintzekoEraBazk: input.idOrdaintzekoEraBazk,
            ordainduBazk : input.ordainduBazk,
            egoeraBazk : input.egoeraBazk,
            dataBazk : input.dataBazk,
            berezitasunBazk : input.berezitasunBazk
        };
//postgres        connection.query("UPDATE bazkideak set ? WHERE idElkarteakBazkide = ? and idBazkideak = ? ",[data,id, idBazkideak], function(err, rows)
        req.connection.query('UPDATE bazkideak set "idMotaBazk"=$1,"idOrdaintzekoEraBazk"=$2,"ordainduBazk"=$3,"egoeraBazk"=$4,"dataBazk"=$5,"berezitasunBazk"=$6 WHERE "idElkarteakBazkide" = $7 and "idBazkideak" = $8 ',[input.idMotaBazk,input.idOrdaintzekoEraBazk,input.ordainduBazk,input.egoeraBazk,input.dataBazk,input.berezitasunBazk,id, idBazkideak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/bazkideak/' + idDenboraldia);
          
        });
    
//postgresConnect    });
};

exports.bazkideakeditatu = function(req, res){

  var id = req.session.idKirolElkarteak;
  var idBazkideak = req.params.idBazkideak;
  var baiez = [{izena: "BAI"}, {izena: "EZ"}];
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM partaideak, bazkideak WHERE idPartaideak=idPartaideakBazk and idElkarteakBazkide = ? and idBazkideak = ?',[id, idBazkideak],function(err,rows)
     req.connection.query('SELECT * FROM partaideak, bazkideak WHERE "idPartaideak"="idPartaideakBazk" and "idElkarteakBazkide" = $1 and "idBazkideak" = $2',[id, idBazkideak],function(err,wrows)
     {
      if(err)
          console.log("Error Selecting : %s ",err );
      rows = wrows.rows;     //postgres 
//postgres      connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
      req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
            
        if(err)
            console.log("Error Selecting : %s ",err );
        rowsm = wrows.rows;     //postgres               
        if (rows.length == 0){
                res.redirect('/');
        }else{
                for(var i in rowsm ){
                  if(rows[0].idMotaBazk == rowsm[i].idPartaideMotak){
                    deskribapenMota = rowsm[i].deskribapenMota;
                    rowsm[i].aukeratua = true;
                  }
                  else
                    rowsm[i].aukeratua = false;
                }

                rows[0].motak = rowsm;  
//postgres        connection.query('SELECT * FROM ordaintzekoErak where idElkarteakOrdaintzekoErak = ? order by idOrdaintzekoErak asc',[id],function(err,rowso) {
        req.connection.query('SELECT * FROM ordaintzekoErak where "idElkarteakOrdaintzekoErak" = $1 order by "idOrdaintzekoErak" asc',[id],function(err,wrows) {
            
         if(err)
           console.log("Error Selecting : %s ",err );
         rowso = wrows.rows;     //postgres 
         for(var i in rowso ){
                  if(rows[0].idOrdaintzekoEraBazk == rowso[i].idOrdaintzekoErak){
                    rowso[i].aukeratua = true;
                  }
                  else
                    rowso[i].aukeratua = false;
                }

              rows[0].ordaintzekoErak = rowso;

         for(var i in baiez ){
                  if(rows[0].ordainduBazk == baiez[i].izena){
                    baiez[i].aukeratua = true;
                  }
                  else
                    baiez[i].aukeratua = false;
                }

              rows[0].ordainduta = baiez;
          
     
            res.render('bazkideakeditatu.handlebars', {page_title:"Bazkidea aldatu", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
         });                           
        }
       });
      });          
//postgresConnect    }); 
};

exports.bazkideakezabatu = function(req,res){
          
     var id = req.session.idKirolElkarteak;
     var idBazkideak = req.params.idBazkideak;
     var idDenboraldia = req.session.idDenboraldia;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres 
//postgres        connection.query("DELETE FROM bazkideak  WHERE idBazkideak = ? and idElkarteakBazkide",[idBazkideak, id], function(err, rows)
        req.connection.query('DELETE FROM bazkideak  WHERE "idBazkideak" = $1 and "idElkarteakBazkide"',[idBazkideak, id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/bazkideak/' + idDenboraldia);
             
        });
        
//postgresConnect     });
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
      res.redirect('/reset/' + idEnkript);
    }
    
    else{
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 

         // Generate password hash
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(input.pasahitza, salt);

        var data = {
            
            pasahitzaPart    :  password_hash     //input.pasahitza 
        
        };
//postgres        connection.query("UPDATE partaideak set ? WHERE idPartaideak = ? ",[data,id], function(err, rows)        
        req.connection.query('UPDATE partaideak set "pasahitzaPart"=$1 WHERE "idPartaideak" = $2 ',[password_hash,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/login');
          
        });
    
//postgresConnect    });
  }
};
