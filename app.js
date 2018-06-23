var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require( 'fs' );
const aws = require( 'aws-sdk' );
var app = express();
const keys = require( './config/keys' );

var AWS = require('aws-sdk');
AWS.config.update(
	{
		accessKeyId: keys.accessKeyId,
		secretAccessKey: keys.secretAccessKey,
	}
);
var s3 = new AWS.S3();

app.set('view engine', 'jade');


app.get( '/file/:folder/:filename', ( req, res ) => {
	res.send({
		path: req.params.folder + "/" + req.params.filename
	})
	
	/*
	s3.getObject(
		{ Bucket: "codebase1210", Key: "array/" },
		function (error, data) {
			if (error != null) {
				res.send({
					msg: error
				})
			} else {
				
				res.send({
					msg: data.Body.toString()
				})
				// do something with data.Body
			}
		}
	);
	
	*/
});

app.get( '/array', ( req, res ) => {

	let files = [];
	var params = { Bucket: "codebase1210"  };
	s3.listObjects(params, function(err, data) {
		if (err) return console.error(err);

		// data.Contents is the array of objects within the bucket
		let allContents = data.Contents;
		for( let i=0; i<allContents.length; i++ ){
			if( allContents[i]["Key"].toString().includes( 'array' )){
				let currentFile = allContents[i]["Key"].split("/");
				if( currentFile[ currentFile.length - 1].length > 1 ){
					files.push( currentFile[ currentFile.length - 1 ]);
				}
			}
		}

		res.send({
			data: files
		});
	});
});

app.get( '*', ( req, res ) => {
	res.red( path.resolve( __dirname, 'client', 'build', 'index.html' ));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

if( process.env.NODE_ENV === 'production' ){
	//Express will serve up production  assets like out main,js file
	app.use( express.static( 'client/build' ));
	
	//Express will serve the index.html file if diesnot recognize the route
	const path = require( 'path' );
	app.get( '*', ( req, res ) => {
		res.sendFile( path.resolve( __dirname, 'client', 'build', 'index.html' ));
	});
}

const PORT = process.env.PORT || 5000;
app.listen( PORT );
