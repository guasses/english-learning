const request = require('request');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const fs = require('fs');
var path = require("path");
const bodyParser = require('body-parser');
const BaseModel = require('./js/base_model.js');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

server.listen(8080,()=>{
    console.log('端口8080已运行web服务!');
});
var baseModel = new BaseModel();
app.post('/word',urlencodedParser,function(req,res){
    //console.log(req.body);
    let word = req.body.word;
    let explains = req.body.explains;
    let audioUrl = req.body.audioUrl;
    var filename = audioUrl.match(/q=.+&voice/);
    //console.log(filename);
    var stream = fs.createWriteStream("./public/audio/"+filename+".mp3");
    request(audioUrl).pipe(stream).on("close",function(err){
        console.log("文件["+filename+"]下载完毕");
    });
    baseModel.findOneById('word',{'word':word},function(result){
        console.log()
        if(result){
            res.end("2");
        }else{
            var t1 = Date.now();
            baseModel.insert('word',{'word':word,'explains':explains,'audioUrl':filename,'time':t1},function(result){
                if(result){
                    res.end("1");
                }
            });
        }
    });
});
app.use(express.static('public'));

app.post('/select-head',urlencodedParser,(req,res,next)=>{
    let user_id = req.body.user_id;
    baseModel.modify('users',{id:user_id},{head_name:req.body.select_head_name},(result)=>{
        if(result){
            console.log('修改头像成功！');
        }
    });
    res.end(req.body.select_head_name);
});