var fs=require("fs")
var mime=require("mime")
var express=require('express')

module.exports=function(options){
    options=options || {}
    //options.staticFolder || options.jssFolder || options.show404

    options.jssFolder=options.jssFolder || process.cwd();
    return function(req,res,next){
        console.log('asd');
        var _write=res.write
        var _end=res.end
        res.write=function(){
            var a=arguments;
            var str=''
            for(var i=0;i< a.length;a++){
                str+=a[i].toString() + '\t'
            }
            str=str.slice(0,-1);
            console.log(str);
            _write.call(res,str);
        }
        res.end=function(){
            res.write.apply(res,arguments)
            _end.call(res)
        }
        console.log(3);
        var url=process.cwd() + require("url").parse(req.url).pathname
        console.log(url)

        var jssFile=options.jssFolder +'/' + require("url").parse(req.url).pathname
        var staticFile=process.cwd() + options.staticFolder + '/' + require("url").parse(req.url).pathname
        if(fs.existsSync(jssFile) && (url.match(/\.jss$/))) {
            try{
                var y=require(url);
                uncache(url);
                y(req,res,next);
            }
            catch(asd){
                res.write(asd.message)
                console.log(asd.message)
                console.log(asd.stack)
                res.write(asd.stack)
                res.end()
            }
        }
        else if(options.staticFolder && fs.existsSync(staticFile)){
            // var file=fs.readFileSync(url).toString
            console.log(options.staticFolder)
                express.static(process.cwd() + '/' + options.staticFolder)(req,res)
        }
        else if(options.show404){
            fileNotExists();
        }
        else{
            if(next)
            next();
            else{
                fileNotExists
            };
        }
        function fileNotExists(){
                res.write('File Not Exists!')
                res.end();
        }

    }
}


uncache = function (moduleName) {
    // Run over the cache looking for the files
    // loaded by the specified module name
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });

    // Remove cached paths to the module.
    // Thanks to @bentael for pointing this out.
    Object.keys(module.constructor._pathCache).forEach(function(cacheKey)
    {
        if (cacheKey.indexOf(moduleName)>0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
};


searchCache = function (moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function run(mod) {
            // Go over each of the module's children and
            // run over it
            mod.children.forEach(function (child) {
                run(child);
            });

            // Call the specified callback providing the
            // found module
            callback(mod);
        })(mod);
    }
};/**
 * Created by Administrator on 07/07/15.
 */
