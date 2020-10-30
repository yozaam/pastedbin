var fs = require("fs");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

app.use('/static', express.static('public'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', function(req,res){
	if (!fs.existsSync('./static')){
	    fs.mkdirSync('./static');
	}
	if (!fs.existsSync('prev_id.txt')){
	    fs.writeFileSync('prev_id.txt','0',function(err){
			if (err) return console.error(err);
		});
	}
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/:id', function(req,res){
	res.sendFile(path.join(__dirname + '/static/'+req.params.id+'.txt'));
});

app.post('/', function(req, res){
   var paste = req.body.paste;
   fs.readFile('prev_id.txt',function(err,data){
   	if (err) return console.error(err);
   	var id = data.toString();
	console.log('writing ',paste,' to ',id+'.txt');
	fs.writeFile('./static/'+id+'.txt',paste , function(err) {
		if (err) return console.error(err);
	});
	res.setHeader('Content-type','text/html')
	res.end("<h1>your file is at <a href='https://pastedbin.herokuapp.com/'>https://pastedbin.herokuapp.com/"+id+'</a></h1>');
	// now update the id
	var next_id = parseInt(id) + 1 + '';
	console.log('writing ',next_id,'to the prev_id.txt');
	fs.writeFile('prev_id.txt',next_id,function(err){
		if (err) return console.error(err);
	});
   });
});
console.log('listening on port',80)
app.listen(80);