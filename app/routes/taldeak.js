var bcrypt = require('bcrypt-nodejs');

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var VALID_TEL_REGEX = /^[0-9-()+]{3,20}/;
var VALID_DNI_REGEX = /^\d{8}[a-zA-Z]{1}$/;

//TALDEAK 

exports.taldeakbilatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres      connection.query('SELECT * FROM taldeak, denboraldiak, mailak, partaideak where idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldiaTalde= ? and idElkarteakTalde = ? order by zenbakiMaila desc, izenaTalde asc',[idDenboraldia,id],function(err,rows) {
     req.connection.query('SELECT * FROM taldeak, denboraldiak, mailak, partaideak where "idMailak"="idMailaTalde" and "idArduradunTalde"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldiaTalde"= $1 and "idElkarteakTalde" = $2 order by "zenbakiMaila" desc, "izenaTalde" asc',[idDenboraldia,id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        rows = wrows.rows;     //postgres 
//postgres      connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
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


         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldeakadmin.handlebars',{title: "Taldeak", data:rows, denboraldiak: rowsdenb, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       
      });
        });   
//postgresConnect  });
};

exports.taldeakbilatudenboraldiarekin = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.params.idDenboraldia;
  req.session.idDenboraldia = idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM taldeak, denboraldiak, mailak, partaideak where idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldiaTalde= ? and idElkarteakTalde = ? order by zenbakiMaila desc, izenaTalde asc',[idDenboraldia,id],function(err,rows) {
     req.connection.query('SELECT * FROM taldeak, denboraldiak, mailak, partaideak where "idMailak"="idMailaTalde" and "idArduradunTalde"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldiaTalde"= $1 and "idElkarteakTalde" = $2 order by "zenbakiMaila" desc, "izenaTalde" asc',[idDenboraldia,id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        rows = wrows.rows;     //postgres 
//postgres         connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
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


         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldeakadmin.handlebars',{title: "Taldeak", data:rows, denboraldiak: rowsdenb, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       
      });
        });   
//postgresConnect  });
};

exports.taldeakikusipartaide = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM taldeak, denboraldiak, mailak, partaideak where federazioaTalde != 9 and idMailak=idMailaTalde and idArduradunTalde=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldiaTalde= ? and idElkarteakTalde = ? order by zenbakiMaila, izenaTalde asc',[idDenboraldia,id],function(err,rows) {
     req.connection.query('SELECT * FROM taldeak, denboraldiak, mailak, partaideak where "federazioaTalde" != 9 and "idMailak"="idMailaTalde" and "idArduradunTalde"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldiaTalde"= $1 and "idElkarteakTalde" = $2 order by "zenbakiMaila", "izenaTalde" asc',[idDenboraldia,id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres          
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldeakpartaide.handlebars',{title: "Taldeak", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});                       
      });   
//postgresConnect  });
};

exports.taldeakgehitu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM mailak where idElkarteakMaila = ? order by zenbakiMaila asc',[id],function(err,rowsm) {
     req.connection.query('SELECT * FROM mailak where "idElkarteakMaila" = $1 order by "zenbakiMaila" asc',[id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsm = wrows.rows;     //postgres 
//postgres        connection.query('SELECT * FROM partaideak where idElkarteakPart = ? order by izenaPart asc',[id],function(err,rowsp) {
        req.connection.query('SELECT * FROM partaideak where "idElkarteakPart" = $1 order by "izenaPart" asc',[id],function(err,wrows) {
            if(err)
             console.log("Error Selecting : %s ",err );
            rowsp = wrows.rows;     //postgres 
//postgres            connection.query('SELECT * FROM denboraldiak where idElkarteakDenb = ? order by idDenboraldia asc',[id],function(err,rowsd) {
            req.connection.query('SELECT * FROM denboraldiak where "idElkarteakDenb" = $1 order by "idDenboraldia asc',[id],function(err,wrows) {
               if(err)
                console.log("Error Selecting : %s ",err );
              rowsd = wrows.rows;     //postgres          
         //console.log("Berriak:" +JSON.stringify(rows));
      res.render('taldeaksortu.handlebars', {title : 'KirolElkarteak-Taldeak gehitu', mailak:rowsm, arduradunak:rowsp, denboraldiak:rowsd, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
      }); 
      });  
          });  
//postgresConnect  });
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

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            izenaTalde    : input.izenaTalde,
            idMailaTalde   : input.idMailaTalde,
            akronimoTalde : input.akronimoTalde,
            arduradunEmailTalde : input.arduradunEmailTalde,
            idArduradunTalde : input.idArduradunTalde,
            urlSailkapenTalde: input.urlSailkapenTalde,
            federazioaTalde : input.federazioaTalde,
            idDenboraldiaTalde : input.idDenboraldiaTalde,
            idElkarteakTalde : id
            //idDenboraldiaEkintza : idDenboraldia
        };
        
  
        var query = req.connection.query("INSERT INTO taldeak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/admin/taldeak');
        });
        
       // console.log(query.sql); 
    
//postgresConnect    });
};

exports.taldeakezabatu = function(req,res){
          
     var id = req.session.idKirolElkarteak;
     //var idDenboraldia = req.session.idDenboraldia;
     var idTaldeak = req.params.idTaldeak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres 
//postgres        connection.query("DELETE FROM taldeak WHERE idElkarteakTalde = ? and idTaldeak = ?",[id, idTaldeak], function(err, rows)
        req.connection.query('DELETE FROM taldeak WHERE "idElkarteakTalde" = $1 and "idTaldeak" = $2',[id, idTaldeak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/taldeak');
             
        });
        
//postgresConnect     });
};

exports.taldeakeditatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM taldeak WHERE idElkarteakTalde = ? and idTaldeak= ?',[id,idTaldeak],function(err,rows)
     req.connection.query('SELECT * FROM taldeak WHERE "idElkarteakTalde" = $1 and "idTaldeak"= $2',[id,idTaldeak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres 
//postgres              connection.query('SELECT * FROM mailak where idElkarteakMaila = ? order by zenbakiMaila asc',[id],function(err,rowsm) {
              req.connection.query('SELECT * FROM mailak where "idElkarteakMaila" = $1 order by "zenbakiMaila" asc',[id],function(err,wrows) {
            
                if(err)
                  console.log("Error Selecting : %s ",err );
                rowsm = wrows.rows;     //postgres                 
                for(var i in rowsm ){
                  if(rows[0].idMailaTalde == rowsm[i].idMailak){
                    izenaMaila = rowsm[i].izenaMaila;
                    rowsm[i].aukeratua = true;
                  }
                  else
                    rowsm[i].aukeratua = false;
                }

                rows[0].mailak = rowsm;
//postgres                connection.query('SELECT * FROM partaideak where idElkarteakPart = ? order by abizena1Part, abizena2Part, izenaPart',[id],function(err,rowsp) {
                req.connection.query('SELECT * FROM partaideak where "idElkarteakPart" = $1 order by "abizena1Part", "abizena2Part", "izenaPart"',[id],function(err,wrows) {
                  if(err)
                    console.log("Error Selecting : %s ",err );
                  rowsp = wrows.rows;     //postgres 
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
//postgres                  connection.query('SELECT * FROM denboraldiak where idElkarteakDenb = ? order by idDenboraldia asc',[id],function(err,rowse) {
                  req.connection.query('SELECT * FROM denboraldiak where "idElkarteakDenb" = $1 order by "idDenboraldia" asc',[id],function(err,wrows) {
                    if(err)
                      console.log("Error Selecting : %s ",err );
                    rowse = wrows.rows;     //postgres                    
                    for(var i in rowse ){
                      if(rows[0].idDenboraldiaTalde == rowse[i].idDenboraldia){
                        rowse[i].aukeratua = true;
                      }
                      else
                        rowse[i].aukeratua = false;
                    } 

                    rows[0].denboraldiak = rowse;

            res.render('taldeakeditatu.handlebars', {page_title:"Taldeak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                  });
                });
            });
                 
//postgresConnect    }); 
};


exports.taldeakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idDenboraldia = req.session.idDenboraldia;
    var idTaldeak = req.params.idTaldeak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            
            izenaTalde    : input.izenaTalde,
            idMailaTalde   : input.idMailaTalde,
            akronimoTalde : input.akronimoTalde,
            arduradunEmailTalde : input.arduradunEmailTalde,
            idArduradunTalde : input.idArduradunTalde,
            urlSailkapenTalde: input.urlSailkapenTalde,
            federazioaTalde : input.federazioaTalde,
            idDenboraldiaTalde : input.idDenboraldiaTalde,
            arbitraiaTalde : input.arbitraiaTalde
        };
        
        req.connection.query("UPDATE taldeak set ? WHERE idElkarteakTalde = ? and idTaldeak = ?",[data,id, idTaldeak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/taldeak');
          
        });
    
//postgresConnect    });
};


exports.taldeakkopiatusortu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var i//postgresConnectdDenboraldia = req.session.idDenboraldia;
  var idDenboraldiNondik = 2;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
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

          res.render('taldeakkopiatu.handlebars', {page_title:"Taldeak kopiatu", denboraldiak:rowsdenb, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});

          });
//postgresConnect  });
};    

exports.taldeakkopiatuegin = function(req, res){
  var id = req.session.idKirolElkarteak;
  var input = JSON.parse(JSON.stringify(req.body));
  var idDenboraldia = req.session.idDenboraldia;
  var idDenboraldiaNondik = input.idDenboraldiaNondik;
  var idDenboraldiaNora = input.idDenboraldiaNora;

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
 
//postgres     connection.query('SELECT * FROM taldeak where idElkarteakTalde = ? and idDenboraldiaTalde = ?',[id, idDenboraldiaNondik],function(err,rowstaldeak) {
     req.connection.query('SELECT * FROM taldeak where "idElkarteakTalde" = $1 and "idDenboraldiaTalde" = $2',[id, idDenboraldiaNondik],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rowstaldeak = wrows.rows;     //postgres          
         //console.log("Berriak:" +JSON.stringify(rows));
        
      for(var i in rowstaldeak ){

        var data = {
            
            izenaTalde    : rowstaldeak[i].izenaTalde,
            idMailaTalde   : rowstaldeak[i].idMailaTalde,
            akronimoTalde : rowstaldeak[i].akronimoTalde,
            arduradunEmailTalde : rowstaldeak[i].arduradunEmailTalde,
            idArduradunTalde : rowstaldeak[i].idArduradunTalde,
            urlSailkapenTalde: rowstaldeak[i].urlSailkapenTalde,
            idDenboraldiaTalde : idDenboraldiaNora,
            idElkarteakTalde : id
            //idDenboraldiaEkintza : idDenboraldia
        };
        
  
        var query = req.connection.query("INSERT INTO taldeak set ?",[data], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );

          //res.redirect('/admin/taldeak');
        });

      }
      res.redirect('/admin/taldeak');
        
       // console.log(query.sql); 
    
    });
//postgresConnect});

};


//TALDEKIDEAK

exports.taldekideakikusi = function(req,res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var mota = req.params.mota;
var taldeak = []; 
var taldea = {};
var jokalariak = []; 
var j;
var t = 0;
var vTalde , kolore;
var date = new Date();
var ordaintzekoa = 0, ordaindutakoa = 0;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
    req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
      if(err)
          console.log("Error Selecting : %s ",err ); 
      rowsm = wrows.rows;     //postgres 
      for(var i in rowsm ){
            if(mota == rowsm[i].idPartaideMotak){
              rowsm[i].aukeratua = true;
            }
            else
               rowsm[i].aukeratua = false;
      }          
//postgres      connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak LEFT JOIN bazkideak ON idPartaideak=idPartaideakBazk where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldia= ? and idElkarteakTalde = ? order by zenbakiMaila desc, izenaTalde asc, zenbakiMota, abizena1Part, abizena2Part, izenaPart',[idDenboraldia,id],function(err,rows) {
      req.connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak LEFT JOIN bazkideak ON "idPartaideak"="idPartaideakBazk" where "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartaideakKide"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldia"= $1 and "idElkarteakTalde" = $2 order by "zenbakiMaila" desc, "izenaTalde" asc, "zenbakiMota", "abizena1Part", "abizena2Part", "izenaPart"',[idDenboraldia,id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
        for (var i in rows) {

          if(rows[i].idBazkideak || rows[i].zenbakiMaila < 5){     // < 5 kadete, infantil, alebin BAZKIDE EZ
                rows[i].ezbazkidea = false;
          }
          else
                rows[i].ezbazkidea = true;

          if(rows[i].ordaindutaKide == rows[i].ordaintzekoKide){
                rows[i].ezordaindua = false;
          }
          else
                rows[i].ezordaindua = true;

          if(vTalde != rows[i].idTaldeak){
            if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldea.ordaintzekoa = ordaintzekoa; 
              taldea.ordaindutakoa = ordaindutakoa;
              taldeak[t] = taldea;
              t++;
            }
            vTalde = rows[i].idTaldeak;
            jokalariak = []; 
            j=0;
/*            
            if(rows[i].sortzedata != null){
            data = rows[i].sortzedata;
            rows[i].sortzedata= data.getFullYear() + "-"+ (data.getMonth() +1) +"-"+ data.getDate()+" "+data.getHours()+":"+data.getMinutes();
          }
*/          
            taldea = {
                  idtaldeak  : rows[i].idTaldeak,
                  izenaMaila  : rows[i].izenaMaila,
                  akronimoMaila  : rows[i].akronimoMaila,
                  izenaTalde    : rows[i].izenaTalde,
                  arduradunEmailTalde   : rows[i].arduradunEmailTalde,
                  akronimoTalde : rows[i].akronimoTalde
               };
               
          }
          if (rows[i].ordaintzekoKide > 0 && rows[i].ordaindutaKide < rows[i].ordaintzekoKide)
                kolore = "#FF0000";
          else 
              if (rows[i].ordaintzekoKide > 0 && rows[i].ordaindutaKide >= rows[i].ordaintzekoKide)
                kolore = "#0000FF";
              else  
                kolore = "#000000";
          if (!mota || (mota && (mota == rows[i].idMotaKide)))
          {
            jokalariak[j] = {
                  idtaldeak  : rows[i].idTaldeak,
                  idTaldekideak : rows[i].idTaldekideak,
                  materialaKide    : rows[i].materialaKide,
                  ordainduKide   : rows[i].ordainduKide,
                  ordaintzekoKide  : rows[i].ordaintzekoKide, 
                  ordaindutaKide  : rows[i].ordaindutaKide,
                  kamixetaZenbKide : rows[i].kamixetaZenbKide,
                  idMotaKide : rows[i].idMotaKide,
                  idTaldeakKide : rows[i].idTaldeak,
                  idPartaideakKide: rows[i].idPartaideakKide,
                  bazkideZenbKide : rows[i].bazkideZenbKide,
                  nanPart : rows[i].nanPart,
                  izenaPart : rows[i].izenaPart,
                  abizena1Part : rows[i].abizena1Part,
                  abizena2Part : rows[i].abizena2Part,
                  jaiotzeDataPart : rows[i].jaiotzeDataPart,
                  deskribapenMota : rows[i].deskribapenMota,
                  ezordaindua : rows[i].ezordaindua,
                  ezbazkidea : rows[i].ezbazkidea,
                  kolore : kolore
               };
            j++;

            ordaintzekoa += rows[i].ordaintzekoKide; 
            ordaindutakoa += rows[i].ordaindutaKide;
          }
        }
        if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldea.ordaintzekoa = ordaintzekoa; 
              taldea.ordaindutakoa = ordaindutakoa;
              taldeak[t] = taldea;
              t++;
        }

        res.render('taldekideakikusi.handlebars',{title: "Taldekideak ikusi", data:taldeak, motak:rowsm, ordaintzekoa:ordaintzekoa, ordaindutakoa:ordaindutakoa, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       
      }); 
    });   
//    });
//postgresConnect  });
}

exports.urtebetetzeak = function(req,res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var mota = req.params.mota;
var taldeak = []; 
var taldea = {};
var jokalariak = []; 
var j;
var t = 0;
var vTalde , kolore;
Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}
var today = new Date();
var weekNumber = today.getWeek();
//console.log(weekNumber);
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres      connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldia= ? and idElkarteakTalde = ? order by zenbakiMaila desc, izenaTalde asc, zenbakiMota, abizena1Part, abizena2Part, izenaPart',[idDenboraldia,id],function(err,rows) {
      req.connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartaideakKide"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldia"= $1 and "idElkarteakTalde" = $2 order by "zenbakiMaila" desc, "izenaTalde" asc, "zenbakiMota", "abizena1Part", "abizena2Part", "izenaPart"',[idDenboraldia,id],function(err,wrows) {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
        for (var i in rows) {

         var date = new Date(rows[i].jaiotzeDataPart);
         if(weekNumber == date.getWeek()){

          if(vTalde != rows[i].idTaldeak){
            if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldeak[t] = taldea;
              t++;
            }
            vTalde = rows[i].idTaldeak;
            jokalariak = []; 
            j=0;
/*            
            if(rows[i].sortzedata != null){
            data = rows[i].sortzedata;
            rows[i].sortzedata= data.getFullYear() + "-"+ (data.getMonth() +1) +"-"+ data.getDate()+" "+data.getHours()+":"+data.getMinutes();
          }
*/          
            taldea = {
                  idtaldeak  : rows[i].idTaldeak,
                  izenaMaila  : rows[i].izenaMaila,
                  akronimoMaila  : rows[i].akronimoMaila,
                  izenaTalde    : rows[i].izenaTalde,
                  arduradunEmailTalde   : rows[i].arduradunEmailTalde,
                  akronimoTalde : rows[i].akronimoTalde
               };
               
          }
          if (rows[i].ordaintzekoKide > 0 && rows[i].ordaindutaKide < rows[i].ordaintzekoKide)
                kolore = "#FF0000";
          else 
              if (rows[i].ordaintzekoKide > 0 && rows[i].ordaindutaKide >= rows[i].ordaintzekoKide)
                kolore = "#0000FF";
              else  
                kolore = "#000000";
          if (!mota || (mota && (mota == rows[i].idMotaKide)))
          {
            jokalariak[j] = {
                  idtaldeak  : rows[i].idTaldeak,
                  idTaldekideak : rows[i].idTaldekideak,
                  izenaPart : rows[i].izenaPart,
                  abizena1Part : rows[i].abizena1Part,
                  abizena2Part : rows[i].abizena2Part,
                  jaiotzeDataPart : rows[i].jaiotzeDataPart,
                  jaiotzeEguna : date.getDate(),
                  deskribapenMota : rows[i].deskribapenMota,
                  kolore : kolore
               };
            j++;

          }
         } 
        }
        if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldeak[t] = taldea;
              t++;
        }

        res.render('urtebetetzeak.handlebars',{title: "Urtebetetzeak ikusi", data:taldeak, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       
      }); 
//postgresConnect    });   
}

function getNumberOfWeek() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

exports.taldekideakabizenez = function(req,res){
  req.session.path = req.path;
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//  var idTaldeak = req.params.idTaldeak;
var taldeak = []; 
var taldea = {};
var jokalariak = []; 
var j;
var t = 0, familiko = 1;
var abizena1Part, abizena2Part, helbideaPart;
var vabizena1Part, vabizena2Part, vhelbideaPart;
var date = new Date();
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
       
//postgres     connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldia= ? and idElkarteakTalde = ? order by abizena1Part, abizena2Part, izenaPart',[idDenboraldia,id],function(err,rows) {
     req.connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartaideakKide"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldia"= $1 and "idElkarteakTalde" = $2 order by "abizena1Part", "abizena2Part", "izenaPart"',[idDenboraldia,id],function(err,wrows) {

        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
        for (var i in rows) { 
          rows[i].familiko = " ";
          rows[i].bgkolore = "#FFFFFF";
          abizena1Part = rows[i].abizena1Part.toLowerCase();
          abizena2Part = rows[i].abizena2Part.toLowerCase();
          helbideaPart = rows[i].helbideaPart.toLowerCase();
          if(vabizena1Part == abizena1Part && vabizena2Part == abizena2Part){
              if(rows[i].ordaintzekoKide > 0){ 
                 familiko += 1;
              }
              rows[i].familiko = familiko;
              rows[i].kolore = "#FF8000";
              rows[i].bgkolore = "#FF8000";
          }    
          else {
            familiko = 1;
//            if (rows[i].ordaintzekoKide > 0 && rows[i].ordaindutaKide < rows[i].ordaintzekoKide){
//                rows[i].kolore = "#FF0000";
           if (rows[i].ordaintzekoKide > 0 && rows[i].kuotaDenb != rows[i].ordaintzekoKide)
                rows[i].kolore = "#0000FF";
           else
            if (rows[i].ordaintzekoKide == 0 && rows[i].idMotaKide == 4)  // ADI ADI  jokalari = 4 ?
                rows[i].kolore = "#006600";
            else
             if(vabizena1Part == abizena1Part || vabizena2Part == abizena2Part || vhelbideaPart == helbideaPart){
                rows[i].bgkolore = "#FF0000";
             }
             else 
//              if (rows[i].ordaintzekoKide > 0 && rows[i].ordaindutaKide >= rows[i].ordaintzekoKide)
//                rows[i].kolore = "#0000FF";
//              else  
                rows[i].kolore = "#000000"; 
          }
          vabizena1Part = abizena1Part;
          vabizena2Part = abizena2Part;
          vhelbideaPart = helbideaPart;
        }

        res.render('taldekideakabizenez.handlebars',{title: "Taldekideak abizenez", data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       
     });    
//    });
//postgresConnect  });
}

exports.familikoak = function(req,res){
  req.session.path = req.path;
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
//  var idTaldeak = req.params.idTaldeak;
var familikoak = []; 
var f = 0, familiko = 1;
var abizena1Part, abizena2Part, helbideaPart;
var vabizena1Part, vabizena2Part, vhelbideaPart, vidTaldekideak;
var date = new Date();
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
     
//postgres     connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldia= ? and idElkarteakTalde = ? order by abizena1Part, abizena2Part, izenaPart',[idDenboraldia,id],function(err,rows) {
     req.connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartaideakKide"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldia"= $1 and "idElkarteakTalde" = $2 order by "abizena1Part", "abizena2Part", "izenaPart"',[idDenboraldia,id],function(err,wrows) {

        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
        for (var i in rows) {
           abizena1Part = rows[i].abizena1Part.toLowerCase();
           abizena2Part = rows[i].abizena2Part.toLowerCase();
           helbideaPart = rows[i].helbideaPart.toLowerCase(); 
           if(vabizena1Part == abizena1Part && vabizena2Part == abizena2Part){
              if(rows[i].ordaintzekoKide == rows[i].kuotaDenb){       // ADI  > 0
                 familiko += 1;
                 if(vidTaldekideak != 0)
                 {
                  familikoak[f] = vidTaldekideak;
                  f++;
                 }
              }
          }    
          else 
          {
            if(vidTaldekideak != 0 && familiko != 1)
             {
                familikoak[f] = vidTaldekideak;
                f++;
             }
            familiko = 1;
          }
          vabizena1Part = abizena1Part;
          vabizena2Part = abizena2Part;
          vhelbideaPart = helbideaPart;
          if(rows[i].ordaintzekoKide == rows[i].kuotaDenb)       // ADI  > 0
              vidTaldekideak = rows[i].idTaldekideak;
          else
              vidTaldekideak = 0;  
        }
        console.log("familikoak:" +JSON.stringify(familikoak));
        for (var k = 0; k < f; k++){
          vidTaldekideak = familikoak[k];
          var data = {
            ordaintzekoKide   : req.body.ordainduBerria
          };
        
          req.connection.query("UPDATE taldekideak set ? WHERE idElkarteakKide = ? and idTaldekideak = ?",[data,id, vidTaldekideak], function(err, rows)
          {
            if (err)
              console.log("Error Updating : %s ",err );
          });
        }
        res.redirect('/admin/taldekideakabizenez');
     });    
//    });
//postgresConnect  });
}

exports.taldekideakbilatu = function(req, res){
  req.session.path = req.path;
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  var j = 0 ;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM taldeak, mailak, denboraldiak where idMailaTalde=idMailak and idDenboraldiaTalde = idDenboraldia and  idTaldeak = ? and idElkarteakTalde = ?',[idTaldeak,id],function(err,rowst) {
    req.connection.query('SELECT * FROM taldeak, mailak, denboraldiak where "idMailaTalde"="idMailak" and "idDenboraldiaTalde" = "idDenboraldia" and  "idTaldeak" = $1 and "idElkarteakTalde" = $2',[idTaldeak,id],function(err,wrows) {
     if(err)
           console.log("Error Selecting : %s ",err );
     rowst = wrows.rows;     //postgres        
//postgres     connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldia= ? and idTaldeakKide = ? and idElkarteakTalde = ? order by zenbakiMota, abizena1Part, abizena2Part, izenaPart',[idDenboraldia,idTaldeak,id],function(err,rows) {
     req.connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartaideakKide"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldia"= $ and "idTaldeakKide" = $1 and "idElkarteakTalde" = $2 order by "zenbakiMota", "abizena1Part", "abizena2Part", "izenaPart"',[idDenboraldia,idTaldeak,id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres          
         //console.log("Berriak:" +JSON.stringify(rows));

/*
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
*/

var argazkiak = [];

          for (var i in rows){
              j++;
              rows[i].zenbatgarren = j;
              if (rows[i].ordaintzekoKide > 0 && rows[i].ordaindutaKide < rows[i].ordaintzekoKide)

                rows[i].kolore = "#FF0000";
              else  
                rows[i].kolore = "#000000";
          };
          res.render('taldekideakadmin.handlebars',{title: "Taldekideak", idTaldeak: idTaldeak, irudiak:argazkiak, data:rows, talde:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       

      });   
    });
//postgresConnect  });
};

exports.taldekideakbilatupartaide = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM taldeak, mailak where idMailaTalde=idMailak and idTaldeak = ? and idElkarteakTalde = ?',[idTaldeak,id],function(err,rowst) {
    req.connection.query('SELECT * FROM taldeak, mailak where "idMailaTalde"="idMailak" and "idTaldeak" = $1 and "idElkarteakTalde" = $2',[idTaldeak,id],function(err,wrows) {
     if(err)
           console.log("Error Selecting : %s ",err );
     rowst = wrows.rows;     //postgres       
//postgres     connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldia= ? and idTaldeakKide = ? and idElkarteakTalde = ? order by noiztikDenb desc',[idDenboraldia,idTaldeak,id],function(err,rows) {
     req.connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartaideakKide"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldia"= $1 and "idTaldeakKide" = $2 and "idElkarteakTalde" = $3 order by "noiztikDenb" desc',[idDenboraldia,idTaldeak,id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldekideakpartaide.handlebars',{title: "Taldekideak", data:rows, talde:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});                       
      });   
    });
//postgresConnect  });
};


exports.taldekideakbilatupartaideargazkiekin = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  var arduradun = false;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM taldeak, mailak where idMailaTalde=idMailak and idTaldeak = ? and idElkarteakTalde = ?',[idTaldeak,id],function(err,rowst) {
    req.connection.query('SELECT * FROM taldeak, mailak where "idMailaTalde"="idMailak" and "idTaldeak" = $1 and "idElkarteakTalde" = $2',[idTaldeak,id],function(err,wrows) {
     if(err)
           console.log("Error Selecting : %s ",err );
     rowst = wrows.rows;     //postgres 
     if (rowst.length == 0){
           res.redirect('/taldeak/');
     }else{            
//postgres      connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldia= ? and idTaldeakKide = ? and idElkarteakTalde = ? order by noiztikDenb desc',[idDenboraldia,idTaldeak,id],function(err,rows) {
      req.connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartaideakKide"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldia"= $1 and "idTaldeakKide" = $2 and "idElkarteakTalde" = $3 order by "noiztikDenb" desc',[idDenboraldia,idTaldeak,id],function(err,wrows) {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
/*
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
*/

var argazkiak = [];

            if (rows.length != 0){
                for(var i in rows ){
                  if(req.session.arduraduna == rows[i].idArduradunTalde){
                    rows[i].arduraduna = true;
                    //arduradun.talde = true;
                    arduradun = true;
                  }else{
                    rows[i].arduraduna = false;
                    //arduradun.talde = false
                    arduradun = false;
                  }
                }
            }else{
                if(req.session.arduraduna == rowst[0].idArduradunTalde){
                    arduradun = true;
                }
            }



            
            //arduradun.idTaldeak = idTaldeak;

            //console.log("taldea: " +arduradun.idTaldeak);
            //console.log("taldea: " + idTaldeak);
         
         //console.log("Berriak:" +JSON.stringify(rows));
          res.render('taldekideakpartaide.handlebars',{title: "Taldekideak", idTaldeak:idTaldeak, arduradun:arduradun, data:rows, irudiak:argazkiak, talde:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});                       
//      });
    });
   }
  });
//postgresConnect});
};

exports.taldekideakgehitu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  var admin=(req.path.slice(0,18) == "/admin/taldekideak");
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
     req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
            
      if(err)
           console.log("Error Selecting : %s ",err );
      rowsm = wrows.rows;     //postgres 
//postgres      connection.query('SELECT * FROM taldeak, mailak, denboraldiak where idMailaTalde=idMailak and idDenboraldiaTalde=idDenboraldia and idTaldeak = ? and idElkarteakTalde = ?',[idTaldeak,id],function(err,rowst) {
      req.connection.query('SELECT * FROM taldeak, mailak, denboraldiak where "idMailaTalde"="idMailak" and "idDenboraldiaTalde"="idDenboraldia" and "idTaldeak" = $1 and "idElkarteakTalde" = $2',[idTaldeak,id],function(err,wrows) {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowst = wrows.rows;     //postgres 
//postgres        connection.query('SELECT * FROM partaideak where idElkarteakPart = ? and balidatutaPart != ? order by abizena1Part, abizena2Part, izenaPart',[id, "admin"],function(err,rowsp) {
        req.connection.query('SELECT * FROM partaideak where "idElkarteakPart" = $1 and "balidatutaPart" != $2 order by "abizena1Part", "abizena2Part", "izenaPart"',[id, "admin"],function(err,wrows) {
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsp = wrows.rows;     //postgres          
         //console.log("Berriak:" +JSON.stringify(rows));
      res.render('taldekideaksortu.handlebars', {title : 'KirolElkarteak-Taldeak gehitu', motak:rowsm, talde:rowst, partaideak:rowsp, idTaldeak:idTaldeak, menuadmin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, partaidea: req.session.partaidea, atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
      }); 
     });  
    });    
//postgresConnect  });
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

//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            materialaKide    : input.materialaKide,
//            ordainduKide   : input.ordainduKide,
            ordaintzekoKide   : input.ordaintzekoKide,
            ordaindutaKide   : input.ordaindutaKide,
            kamixetaZenbKide : input.kamixetaZenbKide,
            idMotaKide : input.idMotaKide,
            idTaldeakKide : idTaldeak,
            idPartaideakKide: input.idPartaideakKide,
            bazkideZenbKide : input.bazkideZenbKide,
            idElkarteakKide : id
        };
 
        var query = req.connection.query("INSERT INTO taldekideak set ? ",data, function(err, rows)
        {
  
            if (err)
              console.log("Error inserting : %s ",err );

            if (req.session.arduraduna){
              res.redirect('/taldekideak/'+idTaldeak);
            }else{
              res.redirect('/admin/taldekideak/'+idTaldeak);
            }
         
        });
        
       // console.log(query.sql); 
    
//postgresConnect    });
};

exports.taldekideakezabatu = function(req,res){
          
     var id = req.session.idKirolElkarteak;
     var idTaldeak = req.params.idTaldeak;
     var idTaldekideak = req.params.idTaldekideak;

//postgres  req.getConnection(function(err,connection){
//postgresConnect     req.connection.connect(function(err,connection){                //postgres 
//postgres        connection.query("DELETE FROM taldekideak WHERE idElkarteakKide = ? and idTaldekideak = ?",[id, idTaldekideak], function(err, rows)
        req.connection.query('DELETE FROM taldekideak WHERE "idElkarteakKide" = $1 and "idTaldekideak" = $2',[id, idTaldekideak], function(err, rows)
        {
            if(err)
                 console.log("Error deleting : %s ",err );

            if (req.session.arduraduna){
              res.redirect('/taldekideak/'+idTaldeak);
            }else{
              res.redirect('/admin/taldekideak/'+idTaldeak);
            }
        });
//postgresConnect     });
};

exports.taldekideakeditatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldekideak = req.params.idTaldekideak;
  var baiez = [{ordainduKide:"Bai"}, {ordainduKide:"Ez"}];
  var admin=(req.path.slice(0,18) == "/admin/taldekideak");
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres     connection.query('SELECT * FROM taldekideak WHERE idElkarteakKide = ? and idTaldekideak= ?',[id,idTaldekideak],function(err,rows)
     req.connection.query('SELECT * FROM taldekideak WHERE "idElkarteakKide" = $1 and "idTaldekideak"= $2',[id,idTaldekideak],function(err,wrows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres 
//postgres            connection.query('SELECT * FROM partaideMotak where idElkarteakPartaideMotak = ? order by zenbakiMota, idPartaideMotak asc',[id],function(err,rowsm) {
            req.connection.query('SELECT * FROM partaideMotak where "idElkarteakPartaideMotak" = $1 order by "zenbakiMota", "idPartaideMotak" asc',[id],function(err,wrows) {
            
              if(err)
                  console.log("Error Selecting : %s ",err );
              rowsm = wrows.rows;     //postgres               
              if (rows.length == 0){
                res.redirect('/');
              }else{
                for(var i in rowsm ){
                  if(rows[0].idMotaKide == rowsm[i].idPartaideMotak){
                    deskribapenMota = rowsm[i].deskribapenMota;
                    rowsm[i].aukeratua = true;
                  }
                  else
                    rowsm[i].aukeratua = false;
                }

                rows[0].motak = rowsm;
//postgres                connection.query('SELECT * FROM partaideak where idElkarteakPart = ? order by abizena1Part, abizena2Part, izenaPart',[id],function(err,rowsp) {
                req.connection.query('SELECT * FROM partaideak where "idElkarteakPart" = $1 order by "abizena1Part", "abizena2Part", "izenaPart"',[id],function(err,wrows) {
                  if(err)
                    console.log("Error Selecting : %s ",err );
                  rowsp = wrows.rows;     //postgres 
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

                  rows[0].arduraduna = req.session.arduraduna;

                res.render('taldekideakeditatu.handlebars', {page_title:"Taldekideak aldatu",data:rows, menuadmin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
              
                  });
               } 
                });
            });
//postgresConnect    }); 
};


exports.taldekideakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idKirolElkarteak;
    var idTaldekideak = req.params.idTaldekideak;
    var idTaldeak = req.params.idTaldeak;
    
//postgres  req.getConnection(function(err,connection){
//postgresConnect    req.connection.connect(function(err,connection){                //postgres 
        
        var data = {
            materialaKide    : input.materialaKide,
//            ordainduKide   : input.ordainduKide,
            ordaintzekoKide   : input.ordaintzekoKide,
            ordaindutaKide   : input.ordaindutaKide,
            kamixetaZenbKide : input.kamixetaZenbKide,
            idMotaKide : input.idMotaKide,
            idPartaideakKide: input.idPartaideakKide,
            bazkideZenbKide : input.bazkideZenbKide,
        };
        
        req.connection.query("UPDATE taldekideak set ? WHERE idElkarteakKide = ? and idTaldekideak = ?",[data,id, idTaldekideak], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
         if (req.session.arduraduna)
            res.redirect('/taldekideak/'+idTaldeak);
         else
          console.log("Path: " + req.session.path);
          if (req.session.path.slice(0,26) == "/admin/taldekideakabizenez")
            res.redirect('/admin/taldekideakabizenez');
          else
            res.redirect('/admin/taldekideak/'+idTaldeak);
        });
    
//postgresConnect    });
};

exports.taldekideakkopiatu = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idTaldeak = req.params.idTaldeak;
  var idDenboraldia = req.params.idDenboraldia;
  var idTaldeakopiatu = req.params.idTaldeakopiatu;
//  req.session.jardunaldia = jardunaldia;
//  req.session.idDenboraldia = idDenboraldia;
  var admin=(req.path.slice(0,24) == "/admin/partiduakmailazka");
  var jardunaldiaIkusgai;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres   connection.query('SELECT * FROM taldeak, mailak where idMailaTalde=idMailak and idTaldeak = ? and idElkarteakTalde = ?',[idTaldeak,id],function(err,rowst) {
   req.connection.query('SELECT * FROM taldeak, mailak where "idMailaTalde"="idMailak" and "idTaldeak" = $1 and "idElkarteakTalde" = $2',[idTaldeak,id],function(err,wrows) {

     if(err)
           console.log("Error Selecting : %s ",err );         
     rowst = wrows.rows;     //postgres 
//     console.log("generotaldea : " + rowst[0].generoMaila + "-" + rowst[0].izenaMaila); 
//postgres     connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldia= ? and idElkarteakTalde = ?  and generoMaila = ? order by zenbakiMaila desc, izenaTalde, abizena1Part, abizena2Part, izenaPart',[idDenboraldia,id,rowst[0].generoMaila],function(err,rows) {            
     req.connection.query('SELECT * FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartaideakKide"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldia"= $1 and "idElkarteakTalde" = $2 and "generoMaila" = $3 order by "zenbakiMaila" desc, "izenaTalde", "abizena1Part", "abizena2Part", "izenaPart"',[idDenboraldia,id,rowst[0].generoMaila],function(err,wrows) {            

        if(err)
           console.log("Error Selecting : %s ",err );         
        rows = wrows.rows;     //postgres 
//postgres            connection.query('SELECT idDenboraldia, deskribapenaDenb, jardunaldiaIkusgai FROM denboraldiak where idElkarteakDenb = ? order by deskribapenaDenb desc',[id],function(err,rowsdenb) {
            req.connection.query('SELECT "idDenboraldia", "deskribapenaDenb", "jardunaldiaIkusgai" FROM denboraldiak where "idElkarteakDenb" = $1 order by "deskribapenaDenb" desc',[id],function(err,wrows) {
          
             if(err)
                console.log("Error Selecting : %s ",err );
            rowsdenb = wrows.rows;     //postgres 
             for(var i in rowsdenb ){
                if(idDenboraldia == rowsdenb[i].idDenboraldia){
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
                if (rows[i].jardunaldiDataPartidu <= jardunaldiaIkusgai){
                    rows[i].jardunaldiaIkusgai = true;
                    rows[i].egunaTexto = egunatextobihurtu(rows[i].dataPartidu);
                }else{
                    rows[i].jardunaldiaIkusgai = false;
                }
              }

          res.render('taldekideakkopiatu.handlebars',{title: "Taldekideak Kopiatu", data:rows, talde:rowst, denboraldiak:rowsdenb, taldeak:rowstalde, menuadmin:admin, jardunaldia: req.session.jardunaldia, idDenboraldia: idDenboraldia, idTaldeak: idTaldeak, idTaldeakopiatu: idTaldeakopiatu, atalak: req.session.atalak, partaidea: req.session.partaidea, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});

             });
          });                  
      }); 
   });
//postgresConnect  });
};

exports.taldekideakkopiatuegin = function(req, res){
  var id = req.session.idKirolElkarteak;
  var input = JSON.parse(JSON.stringify(req.body));
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  var taldekide = [], ordaintzeko = 0;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
    
//      console.log("Body:" +JSON.stringify(req.body));
//postgres    connection.query('SELECT * FROM denboraldiak where idElkarteakDenb = ? and idDenboraldia = ?',[id,idDenboraldia],function(err,rowsdenb) {
    req.connection.query('SELECT * FROM denboraldiak where "idElkarteakDenb" = $1 and "idDenboraldia" = $2',[id,idDenboraldia],function(err,wrows) {
          
      if(err)
          console.log("Error Selecting : %s ",err ); 
      rowsdenb = wrows.rows;     //postgres      
// ADI ADI idMotaKide  4  edo ?
      if(taldekide[1] == 4) 
          ordaintzeko = rowsdenb[0].kuotaDenb;
      else
          ordaintzeko = 0;
      for(var i in input.aukeratua ){
        taldekide = input.aukeratua[i].split("-");
// ADI- taldekideakkopiatu.handlebars : gehitu checkbox-en kopiatu nahi duguna        
//        console.log("input : " + i + "-" + input.aukeratua[i] + "-" + taldekide[0] + "-" + taldekide[1]);
        if(taldekide[1] == 4) 
          ordaintzeko = rowsdenb[0].kuotaDenb;
        else
          ordaintzeko = 0;
        var data = {
//            materialaKide    : input.materialaKide,
//            ordainduKide   : input.ordainduKide,
//            kamixetaZenbKide : input.kamixetaZenbKide,
            idMotaKide : taldekide[1],                                            // input.idMotaKide,
            idTaldeakKide : idTaldeak,
            idPartaideakKide:  taldekide[0],                                 // input.aukeratua[i],
            bazkideZenbKide : taldekide[2],
            idElkarteakKide : id,
            ordaintzekoKide: ordaintzeko
        };
        
  
        var query = req.connection.query("INSERT INTO taldekideak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
        });
       // console.log(query.sql); 
      }
      res.redirect('/admin/taldekideak/'+idTaldeak);
    });  
//postgresConnect  });
};

exports.taldekideakordainduta = function(req, res){
  var id = req.session.idKirolElkarteak;
  var input = JSON.parse(JSON.stringify(req.body));
  var idDenboraldia = req.session.idDenboraldia;
  var taldekide = [], ordaintzeko = 0;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
    
//      console.log("Body:" +JSON.stringify(req.body));
 
    for(var i in input.aukeratuo ){
      var  idTaldekideak = input.aukeratuo[i];                                           //  ADI   .split("-");
// ADI- taldekideakkopiatu.handlebars : gehitu checkbox-en kopiatu nahi duguna        
//        console.log("input : " + i + "-" + input.aukeratuo[i] + "-" + idTaldekideak);
//postgres      connection.query('SELECT * FROM taldekideak WHERE idElkarteakKide = ? and idTaldekideak= ?',[id,idTaldekideak],function(err,rows)
      req.connection.query('SELECT * FROM taldekideak WHERE "idElkarteakKide" = $1 and "idTaldekideak"= $2',[id,idTaldekideak],function(err,wrows)
      {
       
        if(err)
          console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres         
//        console.log("kide : " + i + "-" + rows[0].ordaintzekoKide + "-" + rows[0].idTaldekideak);
        var  idTaldekide = rows[0].idTaldekideak; 
        var data = {

            ordaindutaKide   : rows[0].ordaintzekoKide

        };
        
        connection.query("UPDATE taldekideak set ? WHERE idElkarteakKide = ? and idTaldekideak = ?",[data,id, idTaldekide], function(err, rows)
        { 
          if (err)
              console.log("Error updating : %s ",err );
        });
      });
    }

    for (var j = 0; j < 1000; j++) {}  // atseden denbora ADI ADI

    res.redirect('/admin/taldekideakikusi/');
//postgresConnect  });
};

exports.taldekideakbazkideegin = function(req, res){
  var id = req.session.idKirolElkarteak;
  var input = JSON.parse(JSON.stringify(req.body));
  var idDenboraldia = req.session.idDenboraldia;
  var taldekide = [], ordaintzeko = 0;
  var now= new Date();
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
    
//      console.log("Body:" +JSON.stringify(req.body));
 
    for(var i in input.aukeratub ){
      var  idTaldekideak = input.aukeratub[i];                                           //  ADI   .split("-");
// ADI- taldekideakkopiatu.handlebars : gehitu checkbox-en kopiatu nahi duguna        
//        console.log("input : " + i + "-" + input.aukeratub[i] + "-" + idTaldekideak);
//postgres      connection.query('SELECT * FROM taldekideak WHERE idElkarteakKide = ? and idTaldekideak= ?',[id,idTaldekideak],function(err,rows)
      req.connection.query('SELECT * FROM taldekideak WHERE "idElkarteakKide" = $1 and "idTaldekideak"= $2',[id,idTaldekideak],function(err,wrows)
      {
       
        if(err)
          console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres         
//        console.log("kide : " + i + "-" + rows[0].ordaintzekoKide + "-" + rows[0].idTaldekideak);
        var  idTaldekide = rows[0].idTaldekideak; 

        var data = { 
              idMotaBazk: rows[0].idMotaKide,
              idDenboraldiaBazk : idDenboraldia,
              idPartaideakBazk: rows[0].idPartaideakKide,
              ordainduBazk: "EZ",
              idOrdaintzekoEraBazk: 12,        // ADI ADI ADI  
              idElkarteakBazkide: id,
              dataBazk : now
            };

            var query = req.connection.query("INSERT INTO bazkideak set ? ",data, function(err, rows)
           {
  
            if (err)
              console.log("Error inserting : %s ",err );
           });
      });
    }

    for (var j = 0; j < 1000; j++) {}  // atseden denbora ADI ADI

    res.redirect('/admin/taldekideakikusi/');
//postgresConnect  });
};

exports.taldekidetxartelak = function(req, res){
  var id = req.session.idKirolElkarteak;
  var idDenboraldia = req.session.idDenboraldia;
  var idTaldeak = req.params.idTaldeak;
  var zenbatgarren = 1;
  var paper=(req.path.slice(0,24) == "/admin/paperatutxartelak");
  var emailPart;
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres 
//postgres    connection.query('SELECT * FROM taldeak, mailak, denboraldiak where idMailaTalde=idMailak and idDenboraldiaTalde = idDenboraldia and  idTaldeak = ? and idElkarteakTalde = ?',[idTaldeak,id],function(err,rowst) {
    req.connection.query('SELECT * FROM taldeak, mailak, denboraldiak where "idMailaTalde"="idMailak" and "idDenboraldiaTalde" = "idDenboraldia" and  "idTaldeak" = $1 and "idElkarteakTalde" = $2',[idTaldeak,id],function(err,wrows) {
     if(err)
           console.log("Error Selecting : %s ",err );
     rowst = wrows.rows;     //postgres 
//postgres     connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where idMotaKide = 4 and idMotaKide=idPartaideMotak and idTaldeakKide=idTaldeak and idMailak=idMailaTalde and idPartaideakKide=idPartaideak and idDenboraldiaTalde = idDenboraldia and idDenboraldia= ? and idTaldeakKide = ? and idElkarteakTalde = ? order by zenbakiMota, abizena1Part, abizena2Part, izenaPart',[idDenboraldia,idTaldeak,id],function(err,rows) {
     req.connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM taldekideak, partaideMotak, taldeak, denboraldiak, mailak, partaideak where "idMotaKide" = 4 and "idMotaKide"="idPartaideMotak" and "idTaldeakKide"="idTaldeak" and "idMailak"="idMailaTalde" and "idPartaideakKide"="idPartaideak" and "idDenboraldiaTalde" = "idDenboraldia" and "idDenboraldia"= $1 and "idTaldeakKide" = $2 and "idElkarteakTalde" = $3 order by "zenbakiMota", "abizena1Part", "abizena2Part", "izenaPart"',[idDenboraldia,idTaldeak,id],function(err,wrows) {
      if(err)
           console.log("Error Selecting : %s ",err );
      rows = wrows.rows;     //postgres 
//postgres      connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM partaideak, ordaintzekoerak  where (bazkideZenbPart >  1 and bazkideZenbPart <  999999) and idOrdaintzekoEraPart = idOrdaintzekoEraK and idElkarteakPart = ? order by bazkideZenbPart, abizena1Part, abizena2Part, izenaPart',[id],function(err,rowsb) {
      req.connection.query('SELECT *,DATE_FORMAT(jaiotzeDataPart,"%Y-%m-%d") AS jaiotzeDataPart FROM partaideak, ordaintzekoerak  where ("bazkideZenbPart" >  1 and "bazkideZenbPart" <  999999) and "idOrdaintzekoEraPart" = "idOrdaintzekoEraK" and "idElkarteakPart" = $1 order by "bazkideZenbPart", "abizena1Part", "abizena2Part", "izenaPart"',[id],function(err,wrows) {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsb = wrows.rows;     //postgres 
        for(var i in rows){
          rows[i].paper = paper;
          if (paper){
              if (rows[i].nanPart != "")
                rows[i].nanPart = rows[i].nanPart.substr(0,3) + "****" + rows[i].nanPart.substr(7,9);
//              if (rows[i].telefonoaPart != "")
//                rows[i].telefonoaPart = rows[i].telefonoaPart.substr(0,3) + "****" + rows[i].telefonoaPart.substr(8,9);
              if (rows[i].emailPart != ""){
                console.log("email-1 : " + rows[i].emailPart);
                emailPart = rows[i].emailPart.split("@");
                rows[i].emailPart = emailPart[0].substr(0,3) + "****" + emailPart[0].substr(7,12) + "****" + emailPart[0].substr(16,20); // + emailPart[1];
                console.log("email-2 : " + rows[i].emailPart);
              }  
              if (rows[i].kontuZenbPart != ""){
//                console.log("k/K-1 : " + rows[i].kontuZenbPart);
                rows[i].kontuZenbPart = rows[i].kontuZenbPart.substr(0,10) + "******" + rows[i].kontuZenbPart.substr(16,20);
//                console.log("k/K-2 : " + rows[i].kontuZenbPart);
              }
          }
          rows[i].zenbatgarren = zenbatgarren;
          zenbatgarren += 1;
          for(var j in rowsb){
            if (parseInt(rowsb[j].bazkideZenbPart) == parseInt(rows[i].bazkideZenbKide)){
                 rows[i].btidPartaideak = rowsb[j].idPartaideak;
                 rows[i].btnanPart = rowsb[j].nanPart;
                 rows[i].btbazkideZenbPart = rowsb[j].bazkideZenbPart;
                 rows[i].btabizena1Part = rowsb[j].abizena1Part;
                 rows[i].btabizena2Part = rowsb[j].abizena2Part;
                 rows[i].btizenaPart = rowsb[j].izenaPart;
                 rows[i].btjaiotzeDataPart = rowsb[j].jaiotzeDataPart;
                 rows[i].bttelefonoaPart = rowsb[j].telefonoaPart;
                 rows[i].bthelbideaPart = rowsb[j].helbideaPart;
                 rows[i].btherriaPart = rowsb[j].herriaPart;
                 rows[i].btpostaKodeaPart = rowsb[j].postaKodeaPart;
                 rows[i].btemailPart = rowsb[j].emailPart;
                 rows[i].btdeskribapenaOrdainEra = rowsb[j].deskribapenaOrdainEra;
                 rows[i].btkontuZenbPart = rowsb[j].kontuZenbPart;
                 if (paper){
                    if (rows[i].btnanPart != "")
                      rows[i].btnanPart = rows[i].btnanPart.substr(0,3) + "****" + rows[i].btnanPart.substr(7,9);
                    if (rows[i].btemailPart != ""){
                      emailPart = rows[i].btemailPart.split("@");
                      rows[i].btemailPart = emailPart[0].substr(0,3) + "****" + emailPart[0].substr(7,12) + "****" + emailPart[0].substr(16,20); // + emailPart[1];
                    }  
                    if (rows[i].btkontuZenbPart != "")
                      rows[i].btkontuZenbPart = rows[i].btkontuZenbPart.substr(0,10) + "******" + rows[i].btkontuZenbPart.substr(16,20);

//                  rows[i].bttelefonoaPart = rowsb[j].telefonoaPart;

                 }   
   //               console.log("bazkide : " + i + " - " + rows[i].bazkideZenbKide + " - " + rowsb[j].bazkideZenbPart);
                 break;
            }
          }
        }  
        res.render('taldekidetxartelakadmin.handlebars',{title: "Taldekide Txartelak", idTaldeak: idTaldeak, data:rows, talde:rowst, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea, layout: null});                       
      });
     });   
    });
//postgresConnect  });
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

