var fs   = require('fs');
var url  = require("url");            //解析GET请求
var http = require("http");            //提供web服务
var auth = require('basic-auth');
var query = require("querystring");    //解析POST请求
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
mongoose.connect('mongodb://TIC:ThisIsTIC@localhost/TIC');//连接数据库 username:TIC password:ThisIsTIC
var TestSchema = new Schema({
    data       : {type : String}
});
var model_name = coll_name = 'data';
mongoose.model(model_name, TestSchema, coll_name);
var DATA  = mongoose.model(model_name, coll_name);
//服务
var server = function(request,response){
    console.log(request.url);
    //如果GET请求获得结果页
    if(request.url=="/receiver"&&request.method=="GET"){
        response.writeHead(200,{"Content-Type":"text/json","Access-Control-Allow-Origin":"*"});//CORS
        DATA.find({},function(err,result){
            if(err){
                return response.end('get result error');
            }
            if(result.length){
                response.write('{\r\n"receiver":[\r\n');
                for (var i=0;i<result.length;i++){
                    if(i==result.length-1){
                        response.end(String(result[i].data)+"]\r\n}");
                    }
                    else{
                        response.write(String(result[i].data)+",\r\n");
                    }
                }
            }
            else{
                response.end();
            }
        })
    }
    //定义路由 : view 查看结果页面
    else if(request.url=="/view"&&request.method=="GET"){
        var credentials = auth(request);
        if (!credentials || credentials.name !== '0x_Jin' || credentials.pass !== 'wooyun') {
            response.writeHead(401,{'WWW-Authenticate':'Basic realm="0x_Jin"'});
            response.end('Access denied');
        }
        else {
            response.writeHead(200,{"Content-Type":"text/html"});
            //读取资源文件夹中的get.html 并返回给客户端
            fs.readFile('./res/get.html',{encoding:"utf-8"},function(err,data){
                if(err){
                    return response.end('loading html fail');
                }
                response.end(data);
            })
        }

    }

    //定义路由 : 如果请求的是css/js资源 则读取请求路径中的资源路径 读取资源并返回给客户端
    else if(request.url.split('.').pop()=="js"||request.url.split('.').pop()=="css"&&request.method=="GET"){
        //检测路径中 是否包含../
        if(request.url.indexOf("../")>0&&request.url.indexOf("\\")>0){
            response.writeHead(200,{"Content-Type":"text/html"});
            response.end("hack?");
        }
        if(request.url.split('.').pop()=="js"){
            response.writeHead(200,{"Content-Type":"text/javascript"});
        }
        else if(request.url.split('.').pop()=="css"){
            response.writeHead(200,{"Content-Type":"text/css"});
        }
        fs.readFile("./res"+request.url,{encoding:"utf-8"},function(err,data){
            if(err){
                return response.end('loading file fail');
            }
            response.end(data);
        })
    }

    //定义路由 : 如果请求的其他页面 则把请求的参数跟客户端信息都存储到mongodb
    else if(request.url!="/favicon.ico"&&request.url!="/receiver"){
        var time = new Date();
        response.writeHead(200,{"Content-Type":"text/json","Access-Control-Allow-Origin":"*"});
        if(request.method == "GET"){
            var params = [];
            var data  = new DATA();
            params = url.parse(request.url,true).query;
            var params_result = {header:{}};
            params_result.header.useragent=request.headers['user-agent'];
            params_result.header.referer=request.headers.referer;
            params_result.header.proxyip=request.headers['x-forwarded-for'];
            params_result.header.srcip=getClientIp(request);
            params_result.time=time.getFullYear()+"/"+(time.getMonth()+1)+"/"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
            params_result.request=params;
            data.data = JSON.stringify(params_result);
            data.save(function(err) {
                if (err) {
                    response.write('error');
                    return response.end();
                }
                console.log('GET save success');
                response.end('success');
            });
            //console.log(data.);
        }
        else if(request.method == "POST"){
            var postdata = "";
            request.addListener("data",function(postchunk){
                postdata += postchunk;
            })
            //POST结束输出结果
            request.addListener("end",function(){
                var params = query.parse(postdata);
                var data  = new DATA();
                var params_result = {header:{}};
                params_result.header.useragent=request.headers['user-agent'];
                params_result.header.referer=request.headers.referer;
                params_result.header.proxyip=request.headers['x-forwarded-for'];
                params_result.header.srcip=getClientIp(request);
                params_result.time=time.getFullYear()+"/"+(time.getMonth()+1)+"/"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
                params_result.request=params;
                data.data = JSON.stringify(params_result);
                console.log(params);
                console.log(data.data);
                data.save(function(err) {
                    if (err) {
                        return response.end('error');
                    }
                    console.log('POST save success');
                    response.end('success');
                });
            })
        }
    }

    else{
        response.end();
    }
}

//返回源IP函数
function getClientIp(req) {
    return req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
};

//开启服务在127.0.0.1:8080
http.createServer(server).listen(8080);
console.log("Server start!");