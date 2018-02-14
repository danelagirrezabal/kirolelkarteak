module.exports = {
cookieSecret: 'your cookie secret goes here',
gmail: {
	user: 'kirolelkarteak@gmail.com',
	password: 'adminelkarteak',
},
twitter: {
	consumer_key: 'HGlJgf90C64u3Z9TXOlKOAoxe',
	consumer_secret: 'YTkLulDJ1qjl4mZjFvJIsO3eunkx7ZU87MYm8fsFebJHZMEvGZ',
	access_token: '203467804-k5rOlskADqUaNljL3gIR6mFE8GEcOrWc4PbF6ICQ',
	access_token_secret: 'kXilp8jL7ztMhEsmt4yTKeaO0xQYKE9R7Afd0wZSMeM69',
//screen_name: '',
	timeout_ms: 60*1000
},
dbdevelop: {
        host: 'localhost',
        user: 'root',
        password : 'joanaagi',                    //root
        port : 3306, //port mysql                   //8889 
        database: 'heroku_3a7c26fa617acae'      //kirolElkarteak
},
dbproduction: {
        host: 'us-cdbr-iron-east-04.cleardb.net',
        user: 'b65e4830d842c6',
        password : 'ff86419e',
      //  port : 3306, //port mysql
        database:'heroku_3a7c26fa617acae'
}

};