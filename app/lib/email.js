var nodemailer = require('nodemailer');

module.exports = function(credentials){
	//var mailTransport = nodemailer.createTransport('SMTP',{            ADI bertsioa!!
	var mailTransport = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: credentials.gmail.user,
			pass: credentials.gmail.password,
		}
	});

	var from = '"Kirol Elkarteak" <kirolelkarteak@gmail.com>';
	var errorRecipient = 'kirolelkarteak@gmail.com';
	console.log("kirolelkarteak@gmail.com");

	return {
		send: function(to, subj, body){
		    mailTransport.sendMail({
		        from: from,
		        to: to,
		        subject: subj,
		        //text: body
		        html: body,
		        generateTextFromHtml: true
		    }, function(err){
		        if(err) console.error('Unable to send email: ' + err);
		    });
		},

		emailError: function(message, filename, exception){
			var body = '<h1>Kirol Elkarteak Site Error</h1>' +
				'message:<br><pre>' + message + '</pre><br>';
			if(exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
			if(filename) body += 'filename:<br><pre>' + filename + '</pre><br>';
		    mailTransport.sendMail({
		        from: from,
		        to: errorRecipient,
		        subject: 'Kirol Elkarteak Site Error',
		        html: body,
		        generateTextFromHtml: true
		    }, function(err){
		        if(err) console.error('Unable to send email: ' + err);
		    });
		},
	};
};