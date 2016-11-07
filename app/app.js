/**
 * Module dependencies.
 */
var express = require('express');
/**var routes = require('./routes');**/
var http = require('http');
var path = require('path');
var formidable = require('formidable');

var fs = require('fs');

var credentials = require('./credentials.js');
global.emailService = require('./lib/email.js')(credentials);
//global.funtzioak = require('./lib/funtzioak.js');

//load customers route
var taldeak = require('./routes/taldeak'); 
var kirolElkarteak = require('./routes/kirolElkarteak');
var partaideak = require('./routes/partaideak');
var kudeaketa = require('./routes/kudeaketa');
var denboraldiak = require('./routes/denboraldiak');
var app = express();
var connection  = require('express-myconnection'); 
var mysql = require('mysql');

var md = require('marked');

//var passport= require('./config/passport')(passport);

// all environments
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
// set up handlebars view engine
var handlebars = require('express3-handlebars').create({
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
  app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : 'root',
        port : 8889, //port mysql
        database:'kirolElkarteak'
    },'request')
 );
              console.log("localhost1" );
}
else{
  app.use(
    
    connection(mysql,{
        
        host: 'us-cdbr-iron-east-04.cleardb.net',
        user: 'b65e4830d842c6',
        password : 'ff86419e',
      //  port : 3306, //port mysql
        database:'heroku_3a7c26fa617acae'
    },'request')
 );
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
  //  static('/img/txaparrotan.png');
    next();
});

function authorize(req, res, next){
    if(req.session.partaidea) return next();
    res.redirect('/login');
}

function authorize2(req, res, next){
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

  req.session.jardunaldia= year + '-' + month + '-' + day;

  //return next();

  req.getConnection(function(err,connection){

    connection.query('SELECT idDenboraldia, deskribapenaDenb FROM denboraldiak where egoeraDenb=1 and idElkarteakDenb = ? order by deskribapenaDenb desc',[req.session.idKirolElkarteak],function(err,rowsdenb) {
          
        if(err)
              console.log("Error Selecting : %s ",err );

        //if (rowsdenb.length != 0){
          req.session.idDenboraldia=rowsdenb[0].idDenboraldia;
        //}

        connection.query('SELECT DISTINCT DATE_FORMAT(jardunaldiDataPartidu,"%Y-%m-%d") AS jardunaldiDataPartidu FROM partiduak where idElkarteakPartidu = ? and idDenboraldiaPartidu = ? order by jardunaldiDataPartidu desc',[req.session.idKirolElkarteak, req.session.idDenboraldia],function(err,rowsd) {
          
          if(err)
           console.log("Error Selecting : %s ",err );
          
          //if (rowsd.length !=0){
            if (req.session.jardunaldia > rowsd[0].jardunaldiDataPartidu){
              req.session.jardunaldia=rowsd[0].jardunaldiDataPartidu;
            }
          //}

           connection.query('SELECT * FROM atalak where zenbakiAtala>0 AND idElkarteakAtala = ? order by zenbakiAtala asc',[req.session.idKirolElkarteak],function(err,rowsatal) {
          
              if(err)
                console.log("Error Selecting : %s ",err );

                req.session.atalak=rowsatal;  


            return next();

           });
        });

      });
  });

}

function authorizePartaide(req, res, next){
    if(req.session.idPartaide) return next();
    res.redirect('/kirolElkarteak');
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

//app.get('/', authorize2, kirolElkarteak.berriakikusi);
app.get('/', authorize2, kirolElkarteak.edukiakikusi);
//app.get('/', kirolElkarteak.edukiakikusi);
app.get('/taldeak', taldeak.taldeakikusipartaide);
 

app.get('/partaidemail/:emaila', partaideak.partaidemail);
app.get('/partaideak', authorize2, partaideak.ikusi);

app.get('/izenematea', partaideak.partaideakgehitu);

app.post('/partaideakgehitu', authorize2, partaideak.partaideakgehitu);
app.post('/partaideaksortu', partaideak.sortu);
app.get('/partaideakbalidatu/:id', partaideak.balidatu);
app.get('/partaideakezabatu/:idPartaideak', authorizePartaide, partaideak.ezabatu);
app.get('/partaideakeditatu/:idPartaideak', authorizePartaide, partaideak.editatu);
app.post('/partaideakaldatu/:idPartaideak', authorizePartaide, partaideak.aldatu);

app.get('/admin/bazkideak', adminonartua, partaideak.bazkideakikusi);
app.get('/admin/bazkideaksortu/:idPartaideak', adminonartua, partaideak.bazkideaksortu);
app.get('/admin/bazkideakezabatu/:idPartaideak', adminonartua, partaideak.bazkideakezabatu);
app.get('/admin/bazkideakeditatu/:idPartaideak', adminonartua, partaideak.bazkideakeditatu);
app.post('/admin/bazkideakaldatu/:idPartaideak', adminonartua, partaideak.bazkideakaldatu);

app.get('/login', authorize2, function(req, res){
    res.render('login.handlebars', {title : 'KirolElkarteak-Login',partaidea: req.session.partaidea});
});
app.post('/login', partaideak.login);
app.get('/logout', function(req, res){
  console.log('Serving request for url [GET] ' + req.session.idtalde);
  req.session.idDenboraldia = undefined;
  req.session.partaidea = undefined;
  req.session.jardunaldia = undefined;

  res.redirect('/');
});
app.get('/forgot', function(req, res){
    res.render('forgot.handlebars', {title : 'KirolElkarteak-Forgot'});
});
app.post('/forgot', partaideak.forgot);
app.get('/reset/:idPartaideak', function(req, res){
    res.render('reset.handlebars', {title : 'KirolElkarteak-Reset', partaidea: req.session.partaidea, idPartaideak: req.params.idPartaideak});
});
app.post('/reset/:idPartaideak', partaideak.reset);
app.get('/arauak', function(req, res){
    res.render('arauak.handlebars', {title : 'KirolElkarteak-Arauak', partaidea: req.session.partaidea});
});

app.get('/kontaktua', function(req, res){
    res.render('kontaktua.handlebars', {title : 'kirolElkarteak-Kontaktua', partaidea: req.session.partaidea, aditestua: "Kontaktua", atalak: req.session.atalak});
});
app.post('/kontaktuabidali',kirolElkarteak.kontaktuabidali); 

app.get('/sailkapenak', kudeaketa.sailkapenak);
app.get('/admin/sailkapenak', adminonartua, kudeaketa.sailkapenakadmin);

app.get('/admin/kirolElkarteak',adminKirolElkarteaonartua, function(req, res){
    res.render('kirolElkarteaksortu.handlebars', {title : 'kirol elkarteak sortu'});
});
app.post('/kirolElkarteaksortu', adminKirolElkarteaonartua, kirolElkarteak.sortu);
app.get('/kirolElkarteakeditatu', adminonartua, authorize2,kirolElkarteak.editatu);
app.post('/kirolElkarteakaldatu/:idKirolElkarteak', adminonartua, kirolElkarteak.aldatu);

app.get('/kirolElkarteak', kirolElkarteak.aukeratzeko);
app.post('/kirolElkarteakaukeratu', kirolElkarteak.aukeratu);

app.get('/argazkiak', kirolElkarteak.argazkiakikusi);
app.get('/admin/argazkiak', adminonartua,function(req, res){
    res.render('argazkiakigo.handlebars', {title : 'KirolElkarteak-Argazkiak igo', idKirolElkarteak: req.session.idKirolElkarteak, partaidea: req.session.partaidea});
});    
app.post('/argazkiakigo/:idKirolElkarteak', adminonartua,kirolElkarteak.argazkiakigo);

app.get('/admin/mantenimentu', adminonartua, kirolElkarteak.mantenimentu);

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
    res.render('mailaksortu.handlebars', {title : 'Txaparrotan-Mailak gehitu', partaidea: req.session.partaidea});
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
app.get('/admin/edukiakezabatu/:idEdukiak', adminonartua, kirolElkarteak.edukiakezabatu);
app.get('/admin/edukiakeditatu/:idEdukiak', adminonartua, kirolElkarteak.edukiakeditatu);
app.post('/admin/edukiakaldatu/:idEdukiak', adminonartua, kirolElkarteak.edukiakaldatu);

app.get('/edukiak/:idAtalak', kirolElkarteak.edukiakikusi);

app.get('/admin/atalak', adminonartua, kirolElkarteak.atalakbilatu);
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
    res.render('azpiAtalaksortu.handlebars', {title : 'KirolElkarteak-AzpiAtalak gehitu', partaidea: req.session.partaidea, idAtalak: req.params.idAtalak});
});
app.get('/admin/azpiAtalakezabatu/:idAzpiAtalak', adminonartua, kirolElkarteak.azpiAtalakezabatu);
app.get('/admin/azpiAtalakeditatu/:idAzpiAtalak', adminonartua, kirolElkarteak.azpiAtalakeditatu);
app.post('/admin/azpiAtalakaldatu/:idAzpiAtalak', adminonartua, kirolElkarteak.azpiAtalakaldatu);

app.get('/admin/agiriak', adminonartua, kirolElkarteak.agiriakbilatu);
app.get('/agiriak', authorize2, kirolElkarteak.agiriakbilatupartaide);
app.post('/admin/agiriaksortu', adminonartua, kirolElkarteak.agiriaksortu);
app.post('/admin/agiriakigo', adminonartua, kirolElkarteak.agiriakigo);
app.post('/admin/agiriakgehitu', adminonartua, function(req, res){
    res.render('agiriakigo.handlebars', {title : 'KirolElkarteak-Agiriak gehitu', partaidea: req.session.partaidea});
});
app.get('/admin/agiriakezabatu/:idAgiriak', adminonartua, kirolElkarteak.agiriakezabatu);
app.get('/admin/agiriakeditatu/:idAgiriak', adminonartua, kirolElkarteak.agiriakeditatu);
app.post('/admin/agiriakaldatu/:idAgiriak', adminonartua, kirolElkarteak.agiriakaldatu);
app.post('/admin/agiriakaldatufitxategi/:idAgiriak', adminonartua, kirolElkarteak.agiriakaldatufitxategi);

app.get('/admin/denboraldiak', adminonartua, denboraldiak.denboraldiakbilatu);
app.post('/admin/denboraldiaksortu', adminonartua, denboraldiak.denboraldiaksortu);
app.post('/admin/denboraldiakgehitu', adminonartua, function(req, res){
    res.render('denboraldiaksortu.handlebars', {title : 'KirolElkarteak-Denboraldiak gehitu', partaidea: req.session.partaidea});
});
app.get('/admin/denboraldiakezabatu/:idDenboraldia', adminonartua, denboraldiak.denboraldiakezabatu);
app.get('/admin/denboraldiakeditatu/:idDenboraldia', adminonartua, denboraldiak.denboraldiakeditatu);
app.post('/admin/denboraldiakaldatu/:idDenboraldia', adminonartua, denboraldiak.denboraldiakaldatu);

app.get('/admin/partiduak', adminonartua, denboraldiak.partiduakbilatu);
app.get('/partiduak', denboraldiak.partiduakbilatupartaide);
app.get('/admin/jardunaldikopartiduak/:jardunaldia', denboraldiak.jardunaldikopartiduakbilatu);
app.get('/jardunaldikopartiduakpartaide/:jardunaldia', denboraldiak.jardunaldikopartiduakbilatupartaide);
app.post('/admin/partiduaksortu', adminonartua, denboraldiak.partiduaksortu);
app.get('/admin/partiduakgehitu', adminonartua, denboraldiak.partiduakgehitu);
//app.post('/admin/partiduakgehitu', adminonartua, function(req, res){
//    res.render('partiduaksortu.handlebars', {title : 'KirolElkarteak-Partiduak gehitu', taldeizena: req.session.taldeizena});
//});
app.get('/admin/partiduakezabatu/:idPartiduak', adminonartua, denboraldiak.partiduakezabatu);
app.get('/admin/partiduakeditatu/:idPartiduak', adminonartua, denboraldiak.partiduakeditatu);
app.post('/admin/partiduakaldatu/:idPartiduak', adminonartua, denboraldiak.partiduakaldatu);

app.get('/admin/partiduakkargatu', adminonartua, denboraldiak.partiduakkargatu);
app.post('/admin/partiduakkargatuegin', adminonartua, denboraldiak.partiduakkargatuegin);

app.get('/admin/partiduordutegiak/:idDenboraldia/:jardunaldia',adminonartua,authorize2, denboraldiak.partiduordutegiak);

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
app.post('/admin/taldeaksortu', adminonartua, taldeak.taldeaksortu);
app.get('/admin/taldeakgehitu', adminonartua, taldeak.taldeakgehitu);
app.get('/admin/taldeakezabatu/:idTaldeak', adminonartua, taldeak.taldeakezabatu);
app.get('/admin/taldeakeditatu/:idTaldeak', adminonartua, taldeak.taldeakeditatu);
app.post('/admin/taldeakaldatu/:idTaldeak', adminonartua, taldeak.taldeakaldatu);

app.get('/admin/taldekideak/:idTaldeak', adminonartua, taldeak.taldekideakbilatu);
app.get('/taldekideak/:idTaldeak', taldeak.taldekideakbilatupartaideargazkiekin);
app.post('/admin/taldekideaksortu/:idTaldeak', adminonartua, taldeak.taldekideaksortu);
app.get('/admin/taldekideakgehitu/:idTaldeak', adminonartua, taldeak.taldekideakgehitu);
app.get('/admin/taldekideakezabatu/:idTaldeak/:idTaldekideak', adminonartua, taldeak.taldekideakezabatu);
app.get('/admin/taldekideakeditatu/:idTaldekideak', adminonartua, taldeak.taldekideakeditatu);
app.post('/admin/taldekideakaldatu/:idTaldeak/:idTaldekideak', adminonartua, taldeak.taldekideakaldatu);

app.get('/admin/taldeargazkia/:idTaldeak', adminonartua, function(req, res){
    res.render('taldeargazkia.handlebars', {title : 'KirolElkarteak-Talde argazkia', idTaldeak: req.params.idTaldeak, partaidea: req.session.partaidea});
});
app.post('/admin/taldeargazkiaigo/:idTaldeak', adminonartua, taldeak.taldeargazkiaigo);

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

app.get('/admin/partaideakezabatu/:idPartaideak', authorizePartaide, partaideak.ezabatu);
app.get('/admin/partaideakeditatu/:idPartaideak', authorizePartaide, partaideak.editatu);
app.post('/admin/partaideakaldatu/:idPartaideak', authorizePartaide, partaideak.aldatu);

app.get('/emaitzak', denboraldiak.emaitzakikusi);
app.get('/jardunaldikoemaitzak/:jardunaldia', denboraldiak.jardunaldikoemaitzakikusi);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


