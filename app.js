var express=require("express")
var http=require("http")
var fs=require("fs")
var mime=require("mime")

var app=express();
app.use( require('cookie-parser')())

app.use('/',function(req,res){
	var url=__dirname + require("url").parse(req.url).pathname
	console.log(url)
	if(!fs.existsSync(url)) fileNotExists()
	else {
		var file=fs.readFileSync(url).toString()
		if (url.match(/\.js$/))
			runJS()
		else
			showStatic()
	}

	function fileNotExists(){
		res.write('File Not Exists!')
		res.end();
	}

	function runJS(){
		res.contentType('text/html')
		replaceConsole()
		replaceEcho()
		run()
	}
	function replaceEcho(){
		file=file.replace(/{{((.|\n|\r)*?)}}/ig,function (all,$1){
		    var data=$1
		    data=data.replace(/\\/g,'\\\\')
		    data=data.replace(/\r\n/g,'\\r\\n')
		    data='\r\n console.log(\'' +data +  '\')\r\n'
		    return data
		})
	}
	function replaceConsole(){
		file='console.log=function (x) {res.write(x + \'\\r\\n\')};' + file
	}
	function run(){
		try{
			eval(file)
		}
		catch(e){
			res.write(e.toString())
			res.end();
		}
	}
	function showStatic(){
		res.contentType( mime.lookup(file))
		res.write(file)
		res.end();
	}
})

http.createServer(app).listen(80,'64.34.182.103')