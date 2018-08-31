# App Web Example based on BaaS SDK for Java

### 简介
1. 本项目为基于AngularJS的web应用示例工程。
2. 本项目调用的Restful APIs，可参考app-example 目录下的示例工程。

### 配置
##### 配置文件 
根目录下的config.js文件中，定义了Channel和Chaincode的相关信息。
```javascript
...
  apiBase: "//localhost:8080/api",
  channel: "mychannel1",
  chaincodeName: "example_go",
  chaincodeVersion: "1",
  chaincodePath: "github.com/example"
```
开发应用时，需配置以上信息。  
其中Channel和Chaincode的信息要与app-example下的src/main/resources/application.yml的定义保持一致。

### 使用
#### 编译
在项目根目录下，执行
```bash
npm install
```
或者使用cnpm，添加npm 参数 alias命令
```bash
alias cnpm="npm --registry=https://registry.npm.taobao.org \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npm.taobao.org/dist \
--userconfig=$HOME/.cnpmrc"
```
执行
```bash
cnpm install
```
#### 启动服务
```bash
npm start
```
#### Chaincode
在浏览器中输入http://localhost:3000，即可访问应用服务页面。
本项目所包含的租车应用，使用的是app-example中包含的rentalexample.go作为Chaincode。  
可执行租赁的起始时间和终止时间，以及查询账户余额的操作。
