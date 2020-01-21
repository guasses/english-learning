const express = require('express');
const app = express();
const server = require('http').createServer(app);
const fs = require('fs');
const bodyParser = require('body-parser');
const BaseModel = require('./js/base_model.js');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

server.listen(80,()=>{
    console.log('端口80已运行web服务!');
});
app.use(express.static('public'));

var baseModel = new BaseModel();

app.post('/select-head',urlencodedParser,(req,res,next)=>{
    let user_id = req.body.user_id;
    baseModel.modify('users',{id:user_id},{head_name:req.body.select_head_name},(result)=>{
        if(result){
            console.log('修改头像成功！');
        }
    });
    res.end(req.body.select_head_name);
});