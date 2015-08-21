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
如果你不想使用这个账号密码,可以更改为其他的.但是请同时修改TIC.js中的这段代码.  
mongoose.connect('mongodb://TIC:ThisIsTIC@localhost/TIC');
```
  
  
3.进入TIC目录,启动TIC.js (iojs TIC.js) , 程序会运行在本地的8080端口
```
如果需要修改端口,可以找到下面这段代码,把8080修改成你想要变更的端口.  
http.createServer(server).listen(8080);
```
  
  
4.本程序提供了结果查看页,路径为: /view , 为了安全性加上了基础认证. 默认基础认证 username:0x_Jin , password:wooyun
```
你可以在TIC.js中找到下面这段代码修改为你想要变更的账号密码.
if (!credentials || credentials.name !== '0x_Jin' || credentials.pass !== 'wooyun')
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
```

  
