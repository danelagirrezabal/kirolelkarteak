/**
 * Module dependencies.
 */
var express = require('express');
/**var routes = require('./routes');**/
var http = require('http');
var path = require('path');
var formidable = require('formidable');

var fs = require('fs');

var credentials = require('./credentials.js');    // ADI    var

global.emailService = require('./lib/email.js')(credentials);
//global.funtzioak = require('./lib/funtzioak.js');

//load customers route
var taldeak = require('./routes/taldeak'); 
var kirolElkarteak = require('./routes/kirolElkarteak');
var partaideak = require('./routes/partaideak');
var kudeaketa = require('./routes/kudeaketa');
var denboraldiak = require('./routes/denboraldiak');
var app = express();
// postgres var connection  = require('express-myconnection'); 
// postgres   var mysql = require('mysql');

// postgresvar pg = require('pg');        // postgres
// postgresconst pool = require('./db');  // postgres
const {Pool} = require('pg');        // postgres
//postgresConnect const { Client } = require('pg');       //postgresConnect

var md = require('marked');

//var passport= require('./config/passport')(passport);

// all environments
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
// set up handlebars view engine
//var handlebars = require('express3-handlebars').create({
var handlebars = require('express-handlebars').create({

    defaultLayout:'main',
    layoutsDir: "app/views/layouts/",
    partialsDir: "app/views/partials/",
    //extname: '.hbs',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        static: function(name) {
            return require('./lib/static.js').map(name);
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(require('body-parser')); DEPRECATED
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(require('express-session')()); DEPRECATED
//app.use(require('cookie-parser')(credentials.cookieSecret)); DEPRECATED
var session = require('express-session');
app.use(session({
  secret: credentials.cookieSecret,
  resave: false,
  saveUninitialized: true
}));
// development only
/*if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}*/
/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/
console.log("environment " + process.env.NODE_ENV);
//if ('development' == app.get('env')) {
if (process.env.NODE_ENV != 'production'){
// postgres  app.use(
// postgres    connection(mysql, credentials.dbdevelop,'pool') 
// postgres );
   const connection = new Pool (credentials.pgdevelop)   //postgresConnect
//postgresConnect   const connection = new Client (credentials.pgdevelop)   // postgres

   app.use(function(req, res, next){
     req.connection = connection;
     next();
   });
              console.log("localhost1" );
}
else{
//mysql  app.use(
//mysql    connection(mysql, credentials.dbproduction,'pool') 
//mysql );
/*//mysql
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
*/    
   const connection = new Pool (credentials.dbproduction)   //postgresConnect

   app.use(function(req, res, next){
     req.connection = connection;
     next();
   });
              console.log("herokuBerria" );
}
  

// flash message middleware
app.use(function(req, res, next){
    // if there's a flash message, transfer
    // it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

// set 'showTests' context property if the querystring contains test=1
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && 
        req.query.test === '1';
    next();
});

/*app.use(function(req, res, next){
    res.locals.idtalde = req.session.idtalde;
    //delete req.session.idtalde;
    next();
}); */


// middleware to handle logo image easter eggs
var static = require('./lib/static.js').map;
app.use(function(req, res, next){
    //var now = new Date();
   // res.locals.logoImage = now.getMonth()==11 && now.getDate()==19 ?
   // static('/img/kirolElkarteak.jpg') :
  //  static('/img/kirolElkarteak.png');
  res.locals.logoImage = static('/img/ZarauzkoKirolElkartea.jpg');
   //  :
    next();
});

function authorize(req, res, next){
    if(req.session.partaidea) return next();
    res.redirect('/login');
}

function authorize2(req, res, next){
  /*req.session.jardunaldia = jardunaldia;
  req.session.idDenboraldia = idDenboraldia;
  req.session.idKirolElkarteak = idKirolElkarteak;
  req.session.atalak = atalak;

  console.log("AUTHORIZE2: "+req.session.jardunaldia + "----" +  req.session.idDenboraldia + "------" + req.session.atalak + "----" + req.session.idKirolElkarteak);

return next();*/
  req.session.idKirolElkarteak=14;
 //req.session.atalak=[{"idAtalak":3,"izenaAtala":'GAUR EGUN',"zenbakiAtala":'1',"idElkarteakAtala":14}];  

  //if(req.session.idKirolElkarteak) return next();
  //  res.redirect('/kirolElkarteak');
  //req.session.idDenboraldia=2;

  //Jardunaldia zein den jakiteko eguneko data jakin
  var today = new Date();
  today.setHours(0,0,0,0);
  while (today.getDay() != 0){
    today.setDate(today.getDate()+1);
  }
  var day = ('0' + today.getDate()).slice(-2);
  var month = ('0' + (today.getMonth() + 1)).slice(-2);
  var year = today.getFullYear();

  var atalak, adminatalak, iatal = 0, iadminatal = 0;

//debugger;

  req.session.jardunaldia= year + '-' + month + '-' + day;

  //return next();
//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){    ////postgresConnect           //postgres

//    connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where egoeraDenb=1 and idElkarteakDenb = ? order by deskribapenaDenb desc',[req.session.idKirolElkarteak],function(err,rowsdenb) {
//postgresConnect    connection.query('SELECT * FROM denboraldiak where "idElkarteakDenb" = $1 order by "egoeraDenb" desc, "deskribapenaDenb" desc',[req.session.idKirolElkarteak],function(err,wrows) {          
    req.connection.query('SELECT * FROM denboraldiak where "idElkarteakDenb" = $1 order by "egoeraDenb" desc, "deskribapenaDenb" desc',[req.session.idKirolElkarteak],function(err,wrows) {          

        if(err)
              console.log("Error Selecting : %s ",err );

        //if (rowsdenb.length != 0){

             rowsdenb = wrows.rows;     //postgres
//postgres             console.log(rowsdenb);   //postgres
             req.session.idDenboraldia=rowsdenb[0].idDenboraldia;   //postgres  .rows
             console.log(req.session.idDenboraldia);
//          req.session.jardunaldia= '2017-09-09';
//          if (rowsdenb[0].jardunaldiaIkusgai != null) 
//        {
              today = new Date(rowsdenb[0].jardunaldiaIkusgai);   //postgres  .rows
              day = ('0' + today.getDate()).slice(-2);
              month = ('0' + (today.getMonth() + 1)).slice(-2);
              year = today.getFullYear();
              req.session.jardunaldia= year + '-' + month + '-' + day;
//        } 
        //}
//postgres        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[req.session.idKirolElkarteak, req.session.idDenboraldia],function(err,rowsd) {
//postgresConnect         connection.query('SELECT DISTINCT to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') as "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[req.session.idKirolElkarteak, req.session.idDenboraldia],function(err,wrows) {
        req.connection.query('SELECT DISTINCT to_char("jardunaldiDataPartidu", \'YYYY-MM-DD\') as "jardunaldiDataPartidu" FROM partiduak where "idElkarteakPartidu" = $1 and "idDenboraldiaPartidu" = $2 order by "jardunaldiDataPartidu" desc',[req.session.idKirolElkarteak, req.session.idDenboraldia],function(err,wrows) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsd = wrows.rows;     //postgres
//postgres          console.log(rowsd);     //postgres
          if (rowsd.length !=0){
            if (req.session.jardunaldia > rowsd[0].jardunaldiDataPartidu){    //postgres  .rows
              req.session.jardunaldia=rowsd[0].jardunaldiDataPartidu;         //postgres  .rows
            }
          }
//postgres           connection.query('SELECT * FROM atalak where zenbakiAtala > 0 AND zenbakiAtala <= 10 AND idElkarteakAtala = ? order by zenbakiAtala asc',[req.session.idKirolElkarteak],function(err,rowsatal) {
//postgresConnect           connection.query('SELECT * FROM atalak where "zenbakiAtala" <= \'10\' AND "idElkarteakAtala" = $1 order by "zenbakiAtala" asc',[req.session.idKirolElkarteak],function(err,wrows) {
           req.connection.query('SELECT * FROM atalak where "zenbakiAtala" <= \'10\' AND "idElkarteakAtala" = $1 order by "zenbakiAtala" asc',[req.session.idKirolElkarteak],function(err,wrows) {
            if(err)
                console.log("Error Selecting : %s ",err );
              rowsatal = wrows.rows;     //postgres
//postgres              console.log(rowsatal);    //postgres    .rows
//postgres            connection.query('SELECT * FROM atalak where zenbakiAtala > 10 AND idElkarteakAtala = ? order by zenbakiAtala asc',[req.session.idKirolElkarteak],function(err,rowsadminatalak) {
//postgresConnection            connection.query('SELECT * FROM atalak where "zenbakiAtala" > \'10\' AND "idElkarteakAtala" = $1 order by "zenbakiAtala" asc',[req.session.idKirolElkarteak],function(err,wrows) {
            req.connection.query('SELECT * FROM atalak where "zenbakiAtala" > \'10\' AND "idElkarteakAtala" = $1 order by "zenbakiAtala" asc',[req.session.idKirolElkarteak],function(err,wrows) {
              if(err)
                console.log("Error Selecting : %s ",err );
              rowsadminatalak = wrows.rows;     //postgres
//postgres               console.log(rowsadminatalak);   //postgres    .rows
              req.session.atalak = rowsatal;         // atalak;  
              req.session.adminatalak = rowsadminatalak;
//postgres              req.session.atalak = rowsatal.rows;         // atalak;  //postgres
//postgres              req.session.adminatalak = rowsadminatalak.rows;         //postgres 

//postgresConnection              connection.end();    //postgres

              return next();
            });
           });
        });

      });

               // connection.end({ timeout: 60000 });
       
//postgresConnect  }); //postgresConnect

}

function authorizePartaide(req, res, next){
    if(req.session.idPartaideak) return next();
    res.redirect('/login');
}

function authorizeBerePartaide(req, res, next){
    if(req.session.idPartaideak == req.params.idPartaideak) return next();
    res.redirect('/');
}

function authorizeArduradun(req, res, next){
    if(req.session.arduraduna) return next();
    if(req.session.idPartaideak)
      res.redirect('/');
    else
      res.redirect('/login');
}

function adminonartua(req, res, next){
    if(req.session.erabiltzaile == "admin") return next();
    res.redirect('/login');
}
function adminKirolElkarteaonartua(req, res, next){
    if(req.session.erabiltzaile == "admin@kirolelkarteak.eus") return next();
    res.redirect('/login');
}


//Rutak


app.get('/', authorize2, kirolElkarteak.edukiakhasiera);
//app.get('/', kirolElkarteak.edukiakikusi);
app.get('/urtebetetzeak', authorize2, taldeak.urtebetetzeak);

app.get('/taldeak',authorize2, taldeak.taldeakikusipartaide);
 
app.get('/partaidemail/:emaila', partaideak.partaidemail);
app.get('/partaideak',adminonartua, authorize2, partaideak.ikusi);
app.get('/admin/partaideak',adminonartua, partaideak.ikusi);
app.get('/admin/partaideak/:mota',adminonartua, partaideak.ikusimotaz);
/*  ADI : login.hbs  izena-eman
app.get('/izenematea',authorize2, partaideak.partaideakgehitu);
*/  
//app.post('/partaideakgehitu', authorize2, partaideak.partaideakgehitu);
app.post('/partaideaksortu', partaideak.sortu);
app.get('/partaideakbalidatu/:id', partaideak.balidatu);
app.get('/partaideakezabatu/:idPartaideak', authorizeBerePartaide, partaideak.ezabatu);
app.get('/partaideakeditatu/:idPartaideak', authorizeBerePartaide, partaideak.editatu);
app.post('/partaideakaldatu/:idPartaideak', authorizeBerePartaide, partaideak.aldatu);

app.get('/admin/partaideakkargatu', adminonartua, partaideak.partaideakkargatu);
app.post('/admin/partaideakkargatuegin', adminonartua, partaideak.partaideakkargatuegin);

app.get('/admin/bazkideak/:idDenboraldia', adminonartua, partaideak.bazkideakikusi);
app.get('/admin/bazkideak/:idDenboraldia/:mota', adminonartua, partaideak.bazkideakikusimotaz);
app.get('/admin/bazkideak/:idDenboraldia/:mota/:egoera', adminonartua, partaideak.bazkideakikusiegoerarekin);
app.post('/admin/egoeraaldatu/:mota/:egoera', adminonartua, partaideak.bazkideegoerakaldatu);
app.get('/admin/bazkideaksortu/:idPartaideak', adminonartua, partaideak.bazkideaksortu);
app.get('/admin/bazkideakezabatu/:idBazkideak', adminonartua, partaideak.bazkideakezabatu);
app.get('/admin/bazkideakeditatu/:idBazkideak', adminonartua, partaideak.bazkideakeditatu);
app.post('/admin/bazkideakaldatu/:idBazkideak', adminonartua, partaideak.bazkideakaldatu);

app.get('/login', authorize2, function(req, res){
    res.render('login.handlebars', {title : 'KirolElkarteak-Login',partaidea: req.session.partaidea});
});

app.get('/lopd', authorize2, function(req, res){
    res.render('lopd.handlebars', {title : 'KirolElkarteak-lopd',});
});
app.post('/login', partaideak.login);
app.get('/logout', function(req, res){
  console.log('Logout : ' + req.session.idtalde);
  req.session.idDenboraldia = undefined;
  req.session.partaidea = undefined;
  req.session.jardunaldia = undefined;
  req.session.arduraduna = undefined;
  req.session.erabiltzaile = undefined;
  req.session.idPartaideak = undefined;

  res.redirect('/');
});
/*  ADI : login.hbs  pasahitza
app.get('/forgot', function(req, res){
    res.render('forgot.handlebars', {title : 'KirolElkarteak-Forgot'});
});
app.post('/forgot', partaideak.forgot);
*/
app.get('/reset/:idPartaideak', function(req, res){
    res.render('reset.handlebars', {title : 'KirolElkarteak-Reset', partaidea: req.session.partaidea, idPartaideak: req.params.idPartaideak});
});
app.post('/reset/:idPartaideak', partaideak.reset);
app.get('/arauak', function(req, res){
    res.render('arauak.handlebars', {title : 'KirolElkarteak-Arauak', partaidea: req.session.partaidea});
});
/*
app.get('/kontaktua', function(req, res){
    res.render('kontaktua.handlebars', {title : 'kirolElkarteak-Kontaktua', partaidea: req.session.partaidea, aditestua: "Kontaktua", atalak: req.session.atalak, idPartaideak:req.session.idPartaideak, arduraduna:req.session.arduraduna});
});
app.post('/kontaktuabidali',kirolElkarteak.kontaktuabidali); 
*/
app.get('/sailkapenak',authorize2, kudeaketa.sailkapenak);
app.get('/admin/sailkapenak', adminonartua, kudeaketa.sailkapenakadmin);
app.post('/admin/sailkapenakaldatu/:idTaldeak', adminonartua, kudeaketa.sailkapenakaldatu);


app.get('/admin/kirolElkarteak',adminKirolElkarteaonartua, function(req, res){
    res.render('kirolElkarteaksortu.handlebars', {title : 'kirol elkarteak sortu'});
});
app.post('/kirolElkarteaksortu', adminKirolElkarteaonartua, kirolElkarteak.sortu);
app.get('/kirolElkarteakeditatu', adminonartua, authorize2,kirolElkarteak.editatu);
app.post('/kirolElkarteakaldatu/:idKirolElkarteak', adminonartua, kirolElkarteak.aldatu);

app.get('/kirolElkarteak', kirolElkarteak.aukeratzeko);
app.post('/kirolElkarteakaukeratu', kirolElkarteak.aukeratu);

app.get('/argazkiak',authorize2, kirolElkarteak.argazkiakikusi);
app.get('/admin/argazkiak', adminonartua,function(req, res){
    res.render('argazkiakigo.handlebars', {title : 'KirolElkarteak-Argazkiak igo', idKirolElkarteak: req.session.idKirolElkarteak, partaidea: req.session.partaidea});
});    
app.post('/argazkiakigo/:idKirolElkarteak', adminonartua,kirolElkarteak.argazkiakigo);

app.get('/admin/mantenimentu', adminonartua, kirolElkarteak.mantenimentu);
app.get('/admin/mantenimentucsv', adminonartua,function(req, res){
    res.render('mantenimentucsv.handlebars', {title : 'Mantenimentu', idKirolElkarteak: req.session.idKirolElkarteak, partaidea: req.session.partaidea});
});
app.post('/admin/mantenimentuegin', adminonartua, kirolElkarteak.mantenimentuegin);

app.get('/admin/lekuak', adminonartua, kirolElkarteak.lekuakbilatu);
app.post('/admin/lekuaksortu', adminonartua, kirolElkarteak.lekuaksortu);
app.post('/admin/lekuakgehitu', adminonartua, function(req, res){
    res.render('lekuaksortu.handlebars', {title : 'KirolElkarteak-Lekua gehitu', partaidea: req.session.partaidea});
});
app.get('/admin/lekuakezabatu/:idLekuak', adminonartua, kirolElkarteak.lekuakezabatu);
app.get('/admin/lekuakeditatu/:idLekuak', adminonartua, kirolElkarteak.lekuakeditatu);
app.post('/admin/lekuakaldatu/:idLekuak', adminonartua, kirolElkarteak.lekuakaldatu);

app.get('/admin/mailak', adminonartua, kirolElkarteak.mailakbilatu);
app.post('/admin/mailaksortu', adminonartua, kirolElkarteak.mailaksortu);
app.post('/admin/mailakgehitu', adminonartua, function(req, res){
    res.render('mailaksortu.handlebars', {title : 'KirolElkarteak-Mailak gehitu', partaidea: req.session.partaidea});
});
app.get('/admin/mailakezabatu/:idMailak', adminonartua, kirolElkarteak.mailakezabatu);
app.get('/admin/mailakeditatu/:idMailak', adminonartua, kirolElkarteak.mailakeditatu);
app.post('/admin/mailakaldatu/:idMailak', adminonartua, kirolElkarteak.mailakaldatu);

app.post('/admin/mezuakbidali', adminonartua, kirolElkarteak.mezuakbidali);

app.get('/admin/berriak', adminonartua, kirolElkarteak.berriakbilatu);
app.post('/admin/berriaksortu', adminonartua, kirolElkarteak.berriaksortu);
app.post('/admin/berriakgehitu', adminonartua, function(req, res){
    res.render('berriaksortu.handlebars', {title : 'KirolElkarteak-Berriak gehitu', partaidea: req.session.partaidea});
});
app.get('/admin/berriakezabatu/:idBerriak', adminonartua, kirolElkarteak.berriakezabatu);
app.get('/admin/berriakeditatu/:idBerriak', adminonartua, kirolElkarteak.berriakeditatu);
app.post('/admin/berriakaldatu/:idBerriak', adminonartua, kirolElkarteak.berriakaldatu);

app.get('/admin/edukiak', adminonartua, kirolElkarteak.edukiakbilatu);
app.post('/admin/edukiaksortu/:idAzpiAtalak', adminonartua, kirolElkarteak.edukiaksortu);
app.post('/admin/edukiakgehitu/:idAzpiAtalak', adminonartua, function(req, res){
    res.render('edukiaksortu.handlebars', {title : 'KirolElkarteak-Edukiak gehitu', idAzpiAtalak:req.params.idAzpiAtalak, partaidea: req.session.partaidea});
});
app.get('/admin/edukiakgehituosorik', adminonartua, kirolElkarteak.edukiakosorikgehitu);
app.post('/admin/edukiakosoriksortu', adminonartua, kirolElkarteak.edukiakosoriksortu);
app.get('/admin/azpiatalaklortu/:atala', adminonartua, kirolElkarteak.edukietarakoazpiatalaklortu);


//app.post('/admin/edukiakgehituosorik', adminonartua, function(req, res){
//    res.render('edukiaksortuosorik.handlebars', {title : 'KirolElkarteak-Edukiak gehitu', idAzpiAtalak:req.params.idAzpiAtalak, partaidea: req.session.partaidea});
//});

app.get('/admin/edukiakezabatu/:idEdukiak', adminonartua, kirolElkarteak.edukiakezabatu);
app.get('/admin/edukiakeditatu/:idEdukiak', adminonartua, kirolElkarteak.edukiakeditatu);
app.post('/admin/edukiakaldatu/:idEdukiak', adminonartua, kirolElkarteak.edukiakaldatu);

app.get('/atalak/:idAtalak', authorize2, kirolElkarteak.atalakikusi);
app.get('/azpiatalak/:idAzpiAtalak', authorize2, kirolElkarteak.azpiatalakikusi);
app.get('/edukiak/:idEdukiak', authorize2, kirolElkarteak.edukiakikusi);

app.get('/admin/atalak', adminonartua, kirolElkarteak.atalakbilatu);
app.get('/admin/atalak/:idAtalak', adminonartua, kirolElkarteak.atalakikusi);
app.post('/admin/atalaksortu', adminonartua, kirolElkarteak.atalaksortu);
app.post('/admin/atalakgehitu', adminonartua, function(req, res){
    res.render('atalaksortu.handlebars', {title : 'KirolElkarteak-Atalak gehitu', partaidea: req.session.partaidea});
});
app.get('/admin/atalakezabatu/:idAtalak', adminonartua, kirolElkarteak.atalakezabatu);
app.get('/admin/atalakeditatu/:idAtalak', adminonartua, kirolElkarteak.atalakeditatu);
app.post('/admin/atalakaldatu/:idAtalak', adminonartua, kirolElkarteak.atalakaldatu);

app.get('/admin/azpiAtalak/:idAtalak', adminonartua, kirolElkarteak.azpiAtalakbilatu);
app.post('/admin/azpiAtalaksortu/:idAtalak', adminonartua, kirolElkarteak.azpiAtalaksortu);
app.post('/admin/azpiAtalakgehitu/:idAtalak', adminonartua, function(req, res){
    res.render('azpiatalaksortu.handlebars', {title : 'KirolElkarteak-AzpiAtalak gehitu', partaidea: req.session.partaidea, idAtalak: req.params.idAtalak});
});
app.get('/admin/azpiAtalakezabatu/:idAzpiAtalak', adminonartua, kirolElkarteak.azpiAtalakezabatu);
app.get('/admin/azpiAtalakeditatu/:idAzpiAtalak', adminonartua, kirolElkarteak.azpiAtalakeditatu);
app.post('/admin/azpiAtalakaldatu/:idAzpiAtalak', adminonartua, kirolElkarteak.azpiAtalakaldatu);

app.get('/admin/agiriak', adminonartua, kirolElkarteak.agiriakbilatu);
app.get('/agiriak', authorize2, kirolElkarteak.agiriakbilatupartaide);
app.post('/admin/agiriaksortu', adminonartua, kirolElkarteak.agiriaksortu);
app.post('/admin/agiriakigo', adminonartua, kirolElkarteak.agiriakigo);
app.post('/admin/agiriakgehitu', adminonartua, function(req, res){
//    res.render('agiriakigo.handlebars', {title : 'KirolElkarteak-Agiriak gehitu', partaidea: req.session.partaidea});
    res.render('agiriaksortu.handlebars', {title:"Agiriak Sortu"});

});
app.get('/admin/agiriakezabatu/:idAgiriak', adminonartua, kirolElkarteak.agiriakezabatu);
app.get('/admin/agiriakeditatu/:idAgiriak', adminonartua, kirolElkarteak.agiriakeditatu);
app.post('/admin/agiriakaldatu/:idAgiriak', adminonartua, kirolElkarteak.agiriakaldatu);
app.post('/admin/agiriakaldatufitxategi/:idAgiriak', adminonartua, kirolElkarteak.agiriakaldatufitxategi);

app.get('/admin/denboraldiak', adminonartua, denboraldiak.denboraldiakbilatu);
app.get('/admin/denboraldiakopiatu', adminonartua, denboraldiak.denboraldiakopiatu);
app.post('/admin/denboraldiaksortu', adminonartua, denboraldiak.denboraldiaksortu);
app.post('/admin/denboraldiakgehitu', adminonartua, function(req, res){
    res.render('denboraldiaksortu.handlebars', {title : 'KirolElkarteak-Denboraldiak gehitu', partaidea: req.session.partaidea});
});
app.get('/admin/denboraldiakezabatu/:idDenboraldia', adminonartua, denboraldiak.denboraldiakezabatu);
app.get('/admin/denboraldiakeditatu/:idDenboraldia', adminonartua, denboraldiak.denboraldiakeditatu);
app.post('/admin/denboraldiakaldatu/:idDenboraldia', adminonartua, denboraldiak.denboraldiakaldatu);

app.get('/admin/partiduak', adminonartua, denboraldiak.partiduakbilatu);
//app.get('/partiduak/:idDenboraldia',authorize2, denboraldiak.partiduakbilatupartaide);
app.get('/partiduaktaldeka',authorize2, denboraldiak.partiduakbilatutaldekapartaide);
app.get('/partiduaktaldeka/:idTaldeak',authorize2, denboraldiak.partiduakbilatutaldekapartaide);
app.get('/admin/partiduaktaldeka',adminonartua, denboraldiak.partiduakbilatutaldekapartaide);
app.get('/admin/partiduaktaldeka/:idTaldeak',adminonartua, denboraldiak.partiduakbilatutaldekapartaide);
app.get('/admin/jardunaldikopartiduak/:jardunaldia', denboraldiak.jardunaldikopartiduakbilatu);
//app.get('/jardunaldikopartiduakpartaide/:jardunaldia',authorize2, denboraldiak.jardunaldikopartiduakbilatupartaide);
app.get('/partiduak/:idDenboraldia/:jardunaldia',authorize2, denboraldiak.jardunaldikopartiduakbilatupartaide);
app.get('/admin/partiduakmailazka/:idDenboraldia/:jardunaldia',authorize2, denboraldiak.jardunaldikopartiduakbilatupartaide);
app.post('/admin/partiduaksortu', adminonartua, denboraldiak.partiduaksortu);
app.get('/admin/partiduakgehitu', adminonartua, denboraldiak.partiduakgehitu);

app.post('/partiduaksortu', authorizeArduradun, denboraldiak.partiduaksortu);
app.get('/partiduakgehitu',authorizeArduradun, denboraldiak.partiduakgehitu);

//app.post('/admin/partiduakgehitu', adminonartua, function(req, res){
//    res.render('partiduaksortu.handlebars', {title : 'KirolElkarteak-Partiduak gehitu', taldeizena: req.session.taldeizena});
//});
app.get('/admin/partiduakezabatu/:idPartiduak', adminonartua, denboraldiak.partiduakezabatu);
app.get('/admin/partiduakeditatu/:idPartiduak', adminonartua, denboraldiak.partiduakeditatu);
app.post('/admin/partiduakaldatu/:idPartiduak', adminonartua, denboraldiak.partiduakaldatu);

app.get('/admin/partiduakkargatu', adminonartua, denboraldiak.partiduakkargatu);
app.post('/admin/partiduakkargatuegin', adminonartua, denboraldiak.partiduakkargatuegin);

app.get('/admin/partiduordutegiak/:idDenboraldia/:jardunaldia',adminonartua,authorize2, denboraldiak.partiduordutegiak);
app.get('/admin/partiduordutegiak/:idDenboraldia',adminonartua,authorize2, denboraldiak.partiduordutegiak);
//app.get('/admin/partiduordutegiakgf/:idDenboraldia/:jardunaldia',adminonartua,authorize2, denboraldiak.partiduordutegiak);
//app.get('/admin/partiduordutegiakbus/:idDenboraldia/:jardunaldia',adminonartua,authorize2, denboraldiak.partiduordutegiak);
app.get('/partiduordutegiakgf/:idDenboraldia/:jardunaldia',authorize2, denboraldiak.partiduordutegiak);
app.get('/partiduordutegiakbus/:idDenboraldia/:jardunaldia',authorize2, denboraldiak.partiduordutegiak);
app.get('/admin/partiduordutegiaktrsf/:idDenboraldia/:jardunaldia',adminonartua,authorize2, denboraldiak.partiduordutegiak);
app.get('/admin/partiduatzeratuak/:idDenboraldia/',adminonartua,authorize2, denboraldiak.partiduatzeratuak);

app.get('/admin/jardunaldiaikusgai/:jardunaldia',adminonartua,authorize2, denboraldiak.jardunaldiaikusgai);

app.get('/partiduordutegiak/:idDenboraldia/:jardunaldia', authorize2, denboraldiak.partiduordutegiak);
app.get('/partiduordutegiak/:idDenboraldia', authorize2, denboraldiak.partiduordutegiak);

app.get('/admin/ekintzak', adminonartua, denboraldiak.ekintzakbilatu);
app.post('/admin/ekintzaksortu', adminonartua, denboraldiak.ekintzaksortu);
app.post('/admin/ekintzakgehitu', adminonartua, function(req, res){
    res.render('ekintzaksortu.handlebars', {title : 'KirolElkarteak-Ekintzak gehitu', partaidea: req.session.partaidea});
});
app.get('/admin/ekintzakezabatu/:idEkintzak', adminonartua, denboraldiak.ekintzakezabatu);
app.get('/admin/ekintzakeditatu/:idEkintzak', adminonartua, denboraldiak.ekintzakeditatu);
app.post('/admin/ekintzakaldatu/:idEkintzak', adminonartua, denboraldiak.ekintzakaldatu);

app.get('/admin/taldeak', adminonartua, taldeak.taldeakbilatu);
app.get('/admin/taldeak/:idDenboraldia', adminonartua, taldeak.taldeakbilatudenboraldiarekin);
app.post('/admin/taldeaksortu', adminonartua, taldeak.taldeaksortu);
app.get('/admin/taldeakgehitu', adminonartua, taldeak.taldeakgehitu);
app.get('/admin/taldeakezabatu/:idTaldeak', adminonartua, taldeak.taldeakezabatu);
app.get('/admin/taldeakeditatu/:idTaldeak', adminonartua, taldeak.taldeakeditatu);
app.post('/admin/taldeakaldatu/:idTaldeak', adminonartua, taldeak.taldeakaldatu);

app.get('/admin/taldeakkopiatu/', adminonartua, taldeak.taldeakkopiatusortu);
app.post('/admin/taldeakkopiatuegin/', adminonartua, taldeak.taldeakkopiatuegin);

app.get('/admin/taldekideakkopiatu/:idTaldeak/:idDenboraldia/:idTaldeakopiatu',adminonartua, taldeak.taldekideakkopiatu);
app.post('/admin/taldekideakkopiatuegin/:idTaldeak', adminonartua, taldeak.taldekideakkopiatuegin);
app.get('/admin/taldekidetxartelak/:idTaldeak', adminonartua, taldeak.taldekidetxartelak);
app.get('/admin/paperatutxartelak/:idTaldeak', adminonartua, taldeak.taldekidetxartelak);
app.get('/admin/taldekideakikusi/', adminonartua, taldeak.taldekideakikusi);
app.get('/admin/taldekideakikusi/:mota', adminonartua, taldeak.taldekideakikusi);
app.post('/admin/taldekideakordainduta', adminonartua, taldeak.taldekideakordainduta);
app.post('/admin/taldekideakbazkideegin', adminonartua, taldeak.taldekideakbazkideegin);
app.get('/admin/taldekideakabizenez/', adminonartua, taldeak.taldekideakabizenez);
app.post('/admin/familikoak', adminonartua, taldeak.familikoak);
app.get('/admin/taldekideak/:idTaldeak', adminonartua, taldeak.taldekideakbilatu);
app.get('/taldekideak/:idTaldeak', authorize2, taldeak.taldekideakbilatupartaideargazkiekin);
app.post('/admin/taldekideaksortu/:idTaldeak', adminonartua, taldeak.taldekideaksortu);
app.get('/admin/taldekideakgehitu/:idTaldeak', adminonartua, taldeak.taldekideakgehitu);
app.get('/admin/taldekideakezabatu/:idTaldeak/:idTaldekideak', adminonartua, taldeak.taldekideakezabatu);
app.get('/admin/taldekideakeditatu/:idTaldekideak', adminonartua, taldeak.taldekideakeditatu);
app.post('/admin/taldekideakaldatu/:idTaldeak/:idTaldekideak', adminonartua, taldeak.taldekideakaldatu);

app.get('/taldekideakeditatu/:idTaldekideak', authorizeArduradun, taldeak.taldekideakeditatu);
app.post('/taldekideakaldatu/:idTaldeak/:idTaldekideak', authorizeArduradun, taldeak.taldekideakaldatu);
app.get('/taldekideakezabatu/:idTaldeak/:idTaldekideak', authorizeArduradun, taldeak.taldekideakezabatu);
app.get('/taldekideakgehitu/:idTaldeak', authorizeArduradun, taldeak.taldekideakgehitu);
app.post('/taldekideaksortu/:idTaldeak', authorizeArduradun, taldeak.taldekideaksortu);


app.get('/admin/taldeargazkia/:idTaldeak', adminonartua, function(req, res){
    res.render('taldeargazkia.handlebars', {title : 'KirolElkarteak-Talde argazkia', idTaldeak: req.params.idTaldeak, partaidea: req.session.partaidea});
});
app.post('/admin/taldeargazkiaigo/:idTaldeak', adminonartua, taldeak.taldeargazkiaigo);


app.get('/admin/taldekopurua', adminonartua, kudeaketa.taldekopurua);
app.get('/admin/jokalarikopurua', adminonartua, kudeaketa.jokalarikopurua);
app.get('/admin/jokalariakurteka', adminonartua, kudeaketa.jokalariakurteka);

app.get('/admin/kudeaketa', adminonartua, kudeaketa.kudeaketamenu);

app.post('/admin/mezuakbidali', adminonartua, kirolElkarteak.mezuakbidali);
//app.post('/admin/arbitraiak', adminonartua, kudeaketa.arbitraiak);
app.get('/admin/arbitraiak', adminonartua, kudeaketa.arbitraiak);

app.post('/admin/partiduakreset', adminonartua, kudeaketa.partiduakreset);

app.get('/admin/partaidemotak', adminonartua, kirolElkarteak.partaidemotakbilatu);
app.post('/admin/partaidemotaksortu', adminonartua, kirolElkarteak.partaidemotaksortu);
app.post('/admin/partaidemotakgehitu', adminonartua, function(req, res){
    res.render('partaidemotaksortu.handlebars', {title : 'KirolElkarteak-Partaide motak gehitu', partaidea: req.session.partaidea});
});
app.get('/admin/partaidemotakezabatu/:idPartaideMotak', adminonartua, kirolElkarteak.partaidemotakezabatu);
app.get('/admin/partaidemotakeditatu/:idPartaideMotak', adminonartua, kirolElkarteak.partaidemotakeditatu);
app.post('/admin/partaidemotakaldatu/:idPartaideMotak', adminonartua, kirolElkarteak.partaidemotakaldatu);

app.get('/admin/ordaintzekoerak', adminonartua, kirolElkarteak.ordaintzekoerakbilatu);
app.post('/admin/ordaintzekoeraksortu', adminonartua, kirolElkarteak.ordaintzekoeraksortu);
app.post('/admin/ordaintzekoerakgehitu', adminonartua, function(req, res){
    res.render('ordaintzekoeraksortu.handlebars', {title : 'KirolElkarteak-Ordaintzeko erak gehitu', partaidea: req.session.partaidea});
});
app.get('/admin/ordaintzekoerakezabatu/:idOrdaintzekoErak', adminonartua, kirolElkarteak.ordaintzekoerakezabatu);
app.get('/admin/ordaintzekoerakeditatu/:idOrdaintzekoErak', adminonartua, kirolElkarteak.ordaintzekoerakeditatu);
app.post('/admin/ordaintzekoerakaldatu/:idOrdaintzekoErak', adminonartua, kirolElkarteak.ordaintzekoerakaldatu);

app.get('/admin/partaideakezabatu/:idPartaideak', adminonartua, partaideak.ezabatu);
app.get('/admin/partaideakeditatu/:idPartaideak', adminonartua, partaideak.editatu);
app.post('/admin/partaideakaldatu/:idPartaideak', adminonartua, partaideak.aldatu);
app.get('/admin/partaidehistoriala/:idPartaideak', adminonartua, partaideak.historiala);

//app.get('/emaitzak/', denboraldiak.emaitzakikusi);
//app.get('/jardunaldikoemaitzak/:jardunaldia', denboraldiak.jardunaldikoemaitzakikusi);
app.get('/partiduemaitzak/:idDenboraldia/:jardunaldia', authorize2, denboraldiak.partiduemaitzak);
app.get('/admin/partiduemaitzak/:idDenboraldia/:jardunaldia', adminonartua, authorize2, denboraldiak.partiduemaitzakadmin);

app.get('/admin/emaitzaksartu/:idPartidua', adminonartua, authorize2, denboraldiak.partiduemaitzaksartuadmin);
app.post('/admin/emaitzakgorde/:idPartidua', adminonartua, authorize2, denboraldiak.partiduemaitzakgordeadmin);
app.post('/admin/emaitzaktaldekagorde/:idPartidua', adminonartua, authorize2, denboraldiak.partiduemaitzakgordeadmin);

app.get('/emaitzaksartu/:idPartidua', authorizeArduradun, authorize2, denboraldiak.partiduemaitzaksartuadmin);
app.post('/emaitzakgorde/:idPartidua', authorizeArduradun, authorize2, denboraldiak.partiduemaitzakgordeadmin);

app.get('/emaitzabidali/:id/:emaitza', kirolElkarteak.partiduemaitzaeguneratu);
app.get('/emaitzabidali/:id/:emaitza/:arbitraia', kirolElkarteak.partiduemaitzaeguneratu);
app.get('/admin/emaitzabidali/:id/:emaitza/:arbitraia', kirolElkarteak.partiduemaitzaeguneratu);

app.get('/partiduemaitzaktalde/:idTaldeak', authorize2, denboraldiak.partiduemaitzaktalde);
app.get('/partiduemaitzaktalde/', authorize2, denboraldiak.partiduemaitzaktalde);

app.get('/admin/partiduemaitzaktalde/:idTaldeak', authorize2, denboraldiak.partiduemaitzaktalde);
app.get('/admin/partiduemaitzaktalde/', authorize2, denboraldiak.partiduemaitzaktalde);

app.get('/ekitaldiak/:idDenboraldia/:jardunaldia',authorize2, denboraldiak.ekitaldiakikusi);
app.get('/harmailak/:idEkitaldiak',authorize2, denboraldiak.harmailakikusi);

app.get('/admin/ekitaldiak/:idDenboraldia/:jardunaldia',adminonartua, denboraldiak.ekitaldiakikusi);
app.get('/admin/ekitaldiak', adminonartua, denboraldiak.ekitaldiakbilatu);
app.get('/admin/jardunaldikoekitaldiak/:jardunaldia', denboraldiak.jardunaldikoekitaldiakbilatu);
app.get('/admin/ekitaldiakpartidu/:idPartiduak', adminonartua, denboraldiak.ekitaldiakpartidu);
app.post('/admin/ekitaldiaksortu', adminonartua, denboraldiak.ekitaldiaksortu);
app.get('/admin/ekitaldiakgehitu', adminonartua, denboraldiak.ekitaldiakgehitu);

app.post('/ekitaldiaksortu', authorizeArduradun, denboraldiak.ekitaldiaksortu);
app.get('/ekitaldiakgehitu',authorizeArduradun, denboraldiak.ekitaldiakgehitu);

//app.post('/admin/partiduakgehitu', adminonartua, function(req, res){
//    res.render('partiduaksortu.handlebars', {title : 'KirolElkarteak-Partiduak gehitu', taldeizena: req.session.taldeizena});
//});
app.get('/admin/ekitaldiakezabatu/:idEkitaldiak', adminonartua, denboraldiak.ekitaldiakezabatu);
app.get('/admin/ekitaldiakeditatu/:idEkitaldiak', adminonartua, denboraldiak.ekitaldiakeditatu);
app.post('/admin/ekitaldiakaldatu/:idEkitaldiak', adminonartua, denboraldiak.ekitaldiakaldatu);

app.get('/admin/harmailak/:idEkitaldiak',adminonartua, denboraldiak.harmailakikusi);

app.get('/ikusleak/:idEkitaldiak', authorize2, denboraldiak.ikusleakikusi);
app.get('/admin/ikusleak/:idEkitaldiak', adminonartua, denboraldiak.ikusleakbilatu);
app.get('/admin/ikusleakekitaldi/:idEkitaldiak', adminonartua, denboraldiak.ikusleakekitaldi);
app.post('/admin/ikusleaksortu/:idEkitaldiak', adminonartua, denboraldiak.ikusleaksortu);
app.get('/admin/ikusleakgehitu', adminonartua, denboraldiak.ikusleakgehitu);

app.post('/ikusleaksortu/:idEkitaldiak', authorize2, denboraldiak.ikusleaksortu);
app.get('/ikusleakgehitu',authorizeArduradun, denboraldiak.ikusleakgehitu);
app.get('/sarrerakbalidatu/:ekitaldiZenbakia/:ikusleZenbakia', denboraldiak.sarrerakbalidatu);
app.get('/sarrerakikusi/:ekitaldiZenbakia/:ikusleZenbakia', denboraldiak.sarrerakikusi);

//app.post('/admin/partiduakgehitu', adminonartua, function(req, res){
//    res.render('partiduaksortu.handlebars', {title : 'KirolElkarteak-Partiduak gehitu', taldeizena: req.session.taldeizena});
//});
app.get('/admin/ikusleakezabatu/:idEkitaldiak/:idIkusleak', adminonartua, denboraldiak.ikusleakezabatu);
app.get('/admin/ikusleakeditatu/:idEkitaldiak/:idIkusleak', adminonartua, denboraldiak.ikusleakeditatu);
app.post('/admin/ikusleakaldatu/:idEkitaldiak/:idIkusleak', adminonartua, denboraldiak.ikusleakaldatu);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*if (process.env.NODE_ENV != 'production'){  
var cliente = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : 'root',
    port : 8889, //port mysql
    database:'5771113112b92f3'
});
            console.log("localhost2" );
}
else{
  var cliente = mysql.createConnection({
    host: '',
    user: '',
    password : '',
    //  port : 3306, 
    database:'kirolElkarteak'
});
              console.log("heroku2" );
}

 var idKirolElkarteak=14;

  var today = new Date();
  today.setHours(0,0,0,0);
  while (today.getDay() != 0){
    today.setDate(today.getDate()+1);
  }
  var day = ('0' + today.getDate()).slice(-2);
  var month = ('0' + (today.getMonth() + 1)).slice(-2);
  var year = today.getFullYear();
  var idDenboraldia;
  var atalak;

  var jardunaldia = year + '-' + month + '-' + day;

    cliente.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where egoeraDenb=1 and idElkarteakDenb = ? order by deskribapenaDenb desc',[idKirolElkarteak],function(err,rowsdenb) {
          
        if(err)
              console.log("Error Selecting : %s ",err );

        //if (rowsdenb.length != 0){
           idDenboraldia=rowsdenb[0].idDenboraldia;
        //}

        cliente.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[idKirolElkarteak, idDenboraldia],function(err,rowsd) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          
          if (rowsd.length !=0){
            if (jardunaldia > rowsd[0].jardunaldiDataPartidu){
              jardunaldia=rowsd[0].jardunaldiDataPartidu;
            }
          }

           cliente.query('SELECT * FROM atalak where zenbakiAtala>0 AND idElkarteakAtala = ? order by zenbakiAtala asc',[idKirolElkarteak],function(err,rowsatal) {
          
              if(err)
                console.log("Error Selecting : %s ",err );

               atalak=rowsatal;  

               console.log("JARDUNALDIA: "+jardunaldia + "----" +  idDenboraldia + "------" + atalak);
               cliente.end();

           });
        });

      });*/
