

exports.sailkapenak = function (req,res){ 
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak, mailak, partaideak where federazioaTalde != 9 and idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idDenboraldiaTalde = ? and idElkarteakTalde = ? order by zenbakiMaila desc, izenaTalde asc',[idDenboraldia,id],function(err,rows) {
            
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
       
     connection.query('SELECT * FROM taldeak, mailak, partaideak where federazioaTalde != 9 and idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idDenboraldiaTalde= ? and idElkarteakTalde = ? order by zenbakiMaila desc, izenaTalde asc',[idDenboraldia,id],function(err,rows) {
            
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
       
     connection.query('SELECT *, count(*) as taldeakguztira FROM taldeak, mailak where idMailaTalde = idMailak and idElkarteakTalde = ? and idDenboraldiaTalde = ? group by idMailak order by zenbakiMaila asc',[id,idDenboraldia],function(err,rows) {
            
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
  var kideakguztira = 0, jokalariakguztira = 0, entrenatzaileakguztira = 0, laguntzaileakguztira = 0;
  var guztirao = {}, guztira = [0,0,0,0,0,0,0], guztirak = [];
  var mailao = {}, maila = [[]], mailaizena = [], mailak = [];
  var neskamutilao = {}, neskamutila = [[]], neskamutilak = [];
  var generoa = [{izena: "Neska", balioa: "N"}, {izena: "Mutila", balioa: "M"}];
  var k = 0, n = 0;
 
//var maila = new Array(10); 
for (var i = 0; i <= 9; i++) {
   maila[i] = new Array(6); 
   for (var j = 0; j <= 6; j++) {
      maila[i][j] = 0;
//      console.log("i j maila:" +i +j+maila[i][j]);
   }
}
for (var i = 0; i <= 2; i++) {
   neskamutila[i] = new Array(6); 
   for (var j = 0; j <= 7; j++) {     /// adiadi 5
      neskamutila[i][j] = 0;
//      console.log("i j maila:" +i +j+maila[i][j]);
   }
}
//  console.log("maila:" +JSON.stringify(maila)); 
  
  req.getConnection(function(err,connection){
//    connection.query('SELECT *, count(*) as kideak, sum(case when zenbakiMota = 1 then 1 else 0 end) as jokalariak, sum(case when zenbakiMota = 2 then 1 else 0 end) as entrenatzaileak, sum(case when zenbakiMota = 3 then 1 else 0 end) as laguntzaileak FROM taldeak, taldekideak, mailak, partaidemotak where idMailak = idMailaTalde and idTaldeak = idTaldeakKide and idMotaKide = idPartaideMotak and idElkarteakTalde = ? and idDenboraldiaTalde = ? group by generoMaila order by generoMaila desc ',[id,idDenboraldia],function(err,rowsg) {
//     if(err)
//         console.log("Error Selecting : %s ",err );       
     connection.query('SELECT *, sum(ordaintzekoKide) as ordaintzekoa, sum(ordaindutaKide) as ordaindutakoa, count(*) as kideak, sum(case when zenbakiMota = 1 then 1 else 0 end) as jokalariak, sum(case when zenbakiMota = 2 then 1 else 0 end) as entrenatzaileak, sum(case when zenbakiMota = 3 then 1 else 0 end) as laguntzaileak FROM taldeak, taldekideak, mailak, partaidemotak where idMailak = idMailaTalde and idTaldeak = idTaldeakKide and idMotaKide = idPartaideMotak and idElkarteakTalde = ? and idDenboraldiaTalde = ? group by idTaldeak order by zenbakiMaila,akronimoTalde ',[id,idDenboraldia],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

         for(var i in rows){
//          kideakguztira += rows[i].kideak;
//          jokalariakguztira += rows[i].jokalariak;
//          entrenatzaileakguztira += rows[i].entrenatzaileak;
//          laguntzaileakguztira += rows[i].laguntzaileak;
            guztira[0] += rows[i].kideak;
            guztira[1] += rows[i].jokalariak;
            guztira[2] += rows[i].entrenatzaileak;
            guztira[3] += rows[i].laguntzaileak;
            guztira[4] += 1;                               // taldekopurua
            guztira[5] += rows[i].ordaintzekoa;
            guztira[6] += rows[i].ordaindutakoa;
            k = rows[i].zenbakiMaila;               //ADI ADI  - 1;
            mailaizena[k] = rows[i].izenaMaila;
            maila[k][0] += rows[i].kideak;
            maila[k][1] += rows[i].jokalariak;
            maila[k][2] += rows[i].entrenatzaileak;
            maila[k][3] += rows[i].laguntzaileak;
            maila[k][4] += 1;
            maila[k][5] += rows[i].ordaintzekoa;
            maila[k][6] += rows[i].ordaindutakoa;
            if(rows[i].generoMaila == generoa[0].balioa)
              n = 0;
            else
              n = 1;
            neskamutila[n][0] += rows[i].kideak;
            neskamutila[n][1] += rows[i].jokalariak;
            neskamutila[n][2] += rows[i].entrenatzaileak;
            neskamutila[n][3] += rows[i].laguntzaileak;
            neskamutila[n][4] += 1;
            neskamutila[n][5] += rows[i].ordaintzekoa;
            neskamutila[n][6] += rows[i].ordaindutakoa;
         }
         guztirao.kideak = guztira[0];
         guztirao.jokalariak = guztira[1];
         guztirao.entrenatzaileak = guztira[2]; 
         guztirao.laguntzaileak = guztira[3]; 
         guztirao.taldeak = guztira[4];
         guztirao.ordaintzekoa = guztira[5]; 
         guztirao.ordaindutakoa = guztira[6];
         guztirak[0] = guztirao; 
//         console.log("mailaizena:" +JSON.stringify(mailaizena));
//         console.log("maila:" +JSON.stringify(maila));
         for(var k = 0;k <= 9;k++){

           mailao = {
            mailaizena : mailaizena[k],
            kideak : maila[k][0],
            jokalariak : maila[k][1],
            entrenatzaileak : maila[k][2], 
            laguntzaileak : maila[k][3],
            taldeak : maila[k][4],
            ordaintzekoa : maila[k][5], 
            ordaindutakoa : maila[k][6] 
           };
//           console.log("mailao:" +JSON.stringify(mailao));

           mailak[k] = mailao;     
         }
//         console.log("mailak:" +JSON.stringify(mailak));
         for(var n = 0;n <= 1;n++){
           neskamutilao = {
            genero : generoa[n].izena,
            kideak : neskamutila[n][0],
            jokalariak : neskamutila[n][1],
            entrenatzaileak : neskamutila[n][2], 
            laguntzaileak : neskamutila[n][3],
            taldeak : neskamutila[n][4],
            ordaintzekoa : neskamutila[n][5], 
            ordaindutakoa : neskamutila[n][6] 
           };
           neskamutilak[n] = neskamutilao;     
         }
      res.render('jokalarikopurua.handlebars', {title : 'KirolElkarteak- Kide kopuruak', guztirak: guztirak,mailak: mailak, neskamutilak: neskamutilak,taldeak:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
   
    });  
         
  });
};

exports.jokalariakurteka = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var kideakguztira = 0, jokalariakguztira = 0, entrenatzaileakguztira = 0, laguntzaileakguztira = 0;
  var guztirao = {}, guztira = [0,0,0,0,0,0,0], guztirak = [];
  var mailao = {}, maila = [[]], mailaizena = [], mailak = [];
  var neskamutilao = {}, neskamutila = [[]], neskamutilak = [];
  var generoa = [{izena: "Neska", balioa: "N"}, {izena: "Mutila", balioa: "M"}];
  var k = 0, n = 0;
 
//var maila = new Array(10); 
for (var i = 0; i <= 9; i++) {
   maila[i] = new Array(6); 
   for (var j = 0; j <= 6; j++) {
      maila[i][j] = 0;
//      console.log("i j maila:" +i +j+maila[i][j]);
   }
}
for (var i = 0; i <= 2; i++) {
   neskamutila[i] = new Array(6); 
   for (var j = 0; j <= 7; j++) {     /// adiadi 5
      neskamutila[i][j] = 0;
//      console.log("i j maila:" +i +j+maila[i][j]);
   }
}
//  console.log("maila:" +JSON.stringify(maila)); 
  
  req.getConnection(function(err,connection){
//    connection.query('SELECT *, count(*) as kideak, sum(case when zenbakiMota = 1 then 1 else 0 end) as jokalariak, sum(case when zenbakiMota = 2 then 1 else 0 end) as entrenatzaileak, sum(case when zenbakiMota = 3 then 1 else 0 end) as laguntzaileak FROM taldeak, taldekideak, mailak, partaidemotak where idMailak = idMailaTalde and idTaldeak = idTaldeakKide and idMotaKide = idPartaideMotak and idElkarteakTalde = ? and idDenboraldiaTalde = ? group by generoMaila order by generoMaila desc ',[id,idDenboraldia],function(err,rowsg) {
//     if(err)
//         console.log("Error Selecting : %s ",err );       
     connection.query('SELECT *, sum(ordaintzekoKide) as ordaintzekoa, sum(ordaindutaKide) as ordaindutakoa, count(*) as kideak, sum(case when zenbakiMota = 1 then 1 else 0 end) as jokalariak, sum(case when zenbakiMota = 2 then 1 else 0 end) as entrenatzaileak, sum(case when zenbakiMota = 3 then 1 else 0 end) as laguntzaileak FROM taldeak, taldekideak, mailak, partaidemotak where idMailak = idMailaTalde and idTaldeak = idTaldeakKide and idMotaKide = idPartaideMotak and idElkarteakTalde = ? and idDenboraldiaTalde = ? group by idTaldeak order by zenbakiMaila,akronimoTalde ',[id,idDenboraldia],function(err,rows) {
//SELECT *, count(*) as kideak, sum(case when zenbakiMota = 1 then 1 else 0 end) as jokalariak FROM taldeak, taldekideak, mailak, partaidemotak, partaideak, denboraldiak where idMailak = idMailaTalde and idTaldeak = idTaldeakKide and idPartaideak = idPartaideakKide and idMotaKide = idPartaideMotak and idElkarteakTalde = 14 and idDenboraldiaTalde = idDenboraldia group by deskribapenaDenb,akronimoMaila order by deskribapenaDenb,zenbakiMaila,akronimoMaila
            
        if(err)
           console.log("Error Selecting : %s ",err );

         for(var i in rows){
//          kideakguztira += rows[i].kideak;
//          jokalariakguztira += rows[i].jokalariak;
//          entrenatzaileakguztira += rows[i].entrenatzaileak;
//          laguntzaileakguztira += rows[i].laguntzaileak;
            guztira[0] += rows[i].kideak;
            guztira[1] += rows[i].jokalariak;
            guztira[2] += rows[i].entrenatzaileak;
            guztira[3] += rows[i].laguntzaileak;
            guztira[4] += 1;                               // taldekopurua
            guztira[5] += rows[i].ordaintzekoa;
            guztira[6] += rows[i].ordaindutakoa;
            k = rows[i].zenbakiMaila;               //ADI ADI  - 1;
            mailaizena[k] = rows[i].izenaMaila;
            maila[k][0] += rows[i].kideak;
            maila[k][1] += rows[i].jokalariak;
            maila[k][2] += rows[i].entrenatzaileak;
            maila[k][3] += rows[i].laguntzaileak;
            maila[k][4] += 1;
            maila[k][5] += rows[i].ordaintzekoa;
            maila[k][6] += rows[i].ordaindutakoa;
            if(rows[i].generoMaila == generoa[0].balioa)
              n = 0;
            else
              n = 1;
            neskamutila[n][0] += rows[i].kideak;
            neskamutila[n][1] += rows[i].jokalariak;
            neskamutila[n][2] += rows[i].entrenatzaileak;
            neskamutila[n][3] += rows[i].laguntzaileak;
            neskamutila[n][4] += 1;
            neskamutila[n][5] += rows[i].ordaintzekoa;
            neskamutila[n][6] += rows[i].ordaindutakoa;
         }
         guztirao.kideak = guztira[0];
         guztirao.jokalariak = guztira[1];
         guztirao.entrenatzaileak = guztira[2]; 
         guztirao.laguntzaileak = guztira[3]; 
         guztirao.taldeak = guztira[4];
         guztirao.ordaintzekoa = guztira[5]; 
         guztirao.ordaindutakoa = guztira[6];
         guztirak[0] = guztirao; 
//         console.log("mailaizena:" +JSON.stringify(mailaizena));
//         console.log("maila:" +JSON.stringify(maila));
         for(var k = 0;k <= 9;k++){

           mailao = {
            mailaizena : mailaizena[k],
            kideak : maila[k][0],
            jokalariak : maila[k][1],
            entrenatzaileak : maila[k][2], 
            laguntzaileak : maila[k][3],
            taldeak : maila[k][4],
            ordaintzekoa : maila[k][5], 
            ordaindutakoa : maila[k][6] 
           };
//           console.log("mailao:" +JSON.stringify(mailao));

           mailak[k] = mailao;     
         }
//         console.log("mailak:" +JSON.stringify(mailak));
         for(var n = 0;n <= 1;n++){
           neskamutilao = {
            genero : generoa[n].izena,
            kideak : neskamutila[n][0],
            jokalariak : neskamutila[n][1],
            entrenatzaileak : neskamutila[n][2], 
            laguntzaileak : neskamutila[n][3],
            taldeak : neskamutila[n][4],
            ordaintzekoa : neskamutila[n][5], 
            ordaindutakoa : neskamutila[n][6] 
           };
           neskamutilak[n] = neskamutilao;     
         }
      res.render('jokalariakurteka.handlebars', {title : 'Jokalariak urteka', guztirak: guztirak,mailak: mailak, neskamutilak: neskamutilak,taldeak:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
   
    });  
         
  });
};

exports.kudeaketamenu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak;
    if (!req.session.nondik){ 
          req.session.nondik = 0;
    }
  req.getConnection(function (err, connection) {
      if (err)
              console.log("Error connection : %s ",err ); 
      connection.query('SELECT idmailak, izenamaila FROM mailak where idElkarteakMaila = ? ',[id],function(err,rows)  {
        if (err)
                console.log("Error query : %s ",err ); 
//        console.log("mailak : " + JSON.stringify(rows)); 

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

            connection.query('SELECT * FROM taldeak, mailak  where idMailak=idMailaTalde and idElkarteakTalde = ? and idDenboraldiaTalde = ? order by zenbakiMaila desc, izenaTalde asc',[id, idDenboraldia],function(err,rowstalde) {
          
              if(err)
                console.log("Error Selecting : %s ",err );

              for(var i in rowstalde ){
                if(idTaldeak == rowstalde[i].idTaldeak){
                    idTaldeak = rowstalde[i].idTaldeak;
                    rowstalde[i].aukeratua = true;
                  }
                  else
                    rowstalde[i].aukeratua = false;
              }

          res.render('kudeaketa.handlebars', {title : 'KirolElkarteko kudeaketa', mailak:rows, taldeak:rowstalde, denboraldiak:rowsdenb, jardunaldiak:rowsd, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna, nondik:req.session.nondik});                       
            });
          }); 
        });
      });   
  });  
};

exports.arbitraiak = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var jasotakoatotala = 0, arbitraiatotala = 0;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT *, sum(diruaPartidu) as diruaguztira, sum(arbitraiaPartidu) as arbitraiaguztira FROM taldeak, mailak, partiduak where (diruaPartidu != 0 or arbitraiaPartidu != 0 or arbitraiaTalde = 1) and idTaldeak = idTaldeakPartidu and idMailaTalde = idMailak and idElkarteakTalde = ? and idDenboraldiaTalde = ? group by idTaldeak order by idMailaTalde asc, akronimoTalde asc',[id,idDenboraldia],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

 
         for(var i in rows){
            if((rows[i].diruaguztira - rows[i].arbitraiaguztira) <= 50 && rows[i].diruaguztira != 0)
                rows[i].kolore = "#FF0000";
            else
                rows[i].kolore = "#000000";
            jasotakoatotala += rows[i].diruaguztira;
            arbitraiatotala += rows[i].arbitraiaguztira;
            rows[i].arbitraiaguztira = parseFloat(rows[i].arbitraiaguztira).toFixed(2);
            rows[i].diruaguztira = parseFloat(rows[i].diruaguztira).toFixed(2);
         }
         arbitraiatotala = parseFloat(arbitraiatotala).toFixed(2); 
         jasotakoatotala = parseFloat(jasotakoatotala).toFixed(2);        
         //console.log("Berriak:" +JSON.stringify(rows));
      res.render('arbitraiak.handlebars', {title : 'KirolElkarteak-Arbitraiak', arbitraiatotala: arbitraiatotala, jasotakoatotala: jasotakoatotala,taldeak:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
   
    });  
         
  });
};





/////////////////////////////////////////////////////////////////////////////////

exports.kamisetak = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
var taldeak = [];
var taldea = {};
var t=0,k=1;
var n11 = 0;
var n12 = 0;
var s = 0;
var m = 0;
var l = 0;
var xl = 0;
var xxl = 0;
var totala = 0;
var vTalde;
  req.getConnection(function(err,connection){
      
     connection.query('SELECT *,DATE_FORMAT(dataPartidu,"%Y/%m/%d") AS dataPartidu FROM partiduak, mailak, taldeak, lekuak where idLekuak=idLekuakPartidu and idTaldeakPartidu=idTaldeak and idMailak=idMailaTalde and idElkarteakPartidu = ? and idDenboraldiaPartidu = ? and jardunaldiDataPartidu >= ? and jardunaldiDataPartidu <= ? order by zenbakiMaila asc, izenaTalde asc',[id, idDenboraldia, jardunaldia, jardunaldia],function(err,rows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        for (var i in rows) { 
          if(vTalde != rows[i].idtaldeak){
            if(vTalde !=null){
              taldea.n11 = n11;
              taldea.n12 = n12;
              taldea.s = s;
              taldea.m = m;
              taldea.l = l;
              taldea.xl = xl;
              taldea.xxl = xxl;
              totala = n11 + n12 + s + m + l + xl + xxl;
              taldea.totala = totala;
              if (k % 10 == 0){
                taldea.jauzi = 1;
              }
              else{
                taldea.jauzi = 0;
              }
              // Inprimitzeko Imprimir -> Guardar PDF -> Margenes mínimos

              //console.log("k:" +k+ " jauzi: "+taldea.jauzi);
              k++;
              taldeak[t] = taldea;
              t++;
              n11 = 0;
              n12 = 0;
              s = 0;
              m = 0;
              l = 0;
              xl = 0;
              xxl = 0;
            }
            vTalde = rows[i].idtaldeak;
       
            taldea = {

                  idtaldeak  : rows[i].idtaldeak,
                  taldeizena    : rows[i].taldeizena,
                  akronimoa    : rows[i].akronimoa,
                  herria    : rows[i].herria,
                  izenaard    : rows[i].izenaard,
                  telefonoard    : rows[i].telefonoard,
                  balidatuta : rows[i].balidatuta,
                  i : t
               };
               
          }
            if(rows[i].kamisetaneurria == '9-10'){ 
              n11 ++;             
            }
            if(rows[i].kamisetaneurria == '11-12'){
              n12 ++;             
            }
            if(rows[i].kamisetaneurria == 'S'){
              s ++;             
            }
            if(rows[i].kamisetaneurria == 'M'){
              m ++;             
            }
            if(rows[i].kamisetaneurria == 'L'){
              l ++;             
            }
            if(rows[i].kamisetaneurria == 'XL'){
              xl ++;             
            }
            if(rows[i].kamisetaneurria == 'XXL'){
             xxl ++;             
            }
          
        }
        if(vTalde !=null){
              taldea.n11 = n11;
              taldea.n12 = n12;
              taldea.s = s;
              taldea.m = m;
              taldea.l = l;
              taldea.xl = xl;
              taldea.xxl = xxl;
              totala = n11 + n12 + s + m + l + xl + xxl;
              taldea.totala = totala;
              taldeak[t] = taldea;
              t++;
            }
        
        res.render('kamisetak.handlebars', {title : 'Txaparrotan-Kamiseten orriak', data2:taldeak, taldeizena: req.session.txapelketaizena, layout: null });
         });
       
    });
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



