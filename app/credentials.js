module.exports = {
cookieSecret: 'your cookie secret goes here',
gmail: {
	user: 'kirolelkarteak@gmail.com',
	password: 'adminkirolelkarteak',
},
twitterzkeskubaloia: {
	consumer_key: 'zIhdpQAYKfAozabYKtt3ssw4f',
	consumer_secret: 'SO9oIH7X7D2OKKsX2yMqdhVupSjugkeWNkt2SRmVMdOWEWY3iU',
	access_token: '2227335151-jvY83BAwPcAX4S3hZ4YvwHKkkUD2DPBqxYWwLzg',
	access_token_secret: 'lKLbYzfVE34yGBr09aKLlCGGzOMTnD6ezZeqw0DeUoe23',
//screen_name: '',
	timeout_ms: 60*1000
},
//twittereskubaloiaZKE: {
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
        port : 3306, //portmysql                   //8889 
        database: 'heroku_73bb959756e3c82'      //kirolElkarteak  'heroku_3a7c26fa617acae' 'heroku_73bb959756e3c82'
},
pgdevelop: {
        host: 'localhost',
        user: 'postgres',
        password : 'pxab570416p',                    //root
        port : 5432, //portpostgres                   // 
        database: 'probatzen',      //'kirolelkarteak'  'heroku_'
//        max: 10, // Limita a 10 conexiones simultáneas
        idleTimeoutMillis: 30000 // Cierra conexiones inactivas después de 30 segundos

},
dbproduction: {
//        host: 'us-cluster-east-01.k8s.cleardb.net',
//        user: 'b900c630a65f0c',
//        password : '8b68512656cdcf3',                   //'ff86419e'
      //  port : 3306, //port mysql
//        database:'heroku_73bb959756e3c82''heroku_3a7c26fa617acae'

        host: 'ce0lkuo944ch99.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
        user: 'u58r4mfv13b0b6',
        password : 'p585efce010d4b1d476e468deb01a0d25ac6dd4326c48aaf2c7ab1c6965de2f6d',                   //'ff86419e'
      //  port : 5432, //port postgres
        database:'dcnba9s42cng59'
}
};