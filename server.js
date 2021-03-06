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
            let t = Date.now();
            let t1 = new Date(parseInt(t));
            let Y = t1.getFullYear();
            let M = "0"+(t1.getMonth()+1);
            let D = t1.getDate();
            let t2 = ""+Y+M+D;
            baseModel.insert('word',{'word':word,'explains':explains,'audioUrl':filename,'time':t2},function(result){
                if(result){
                    res.end("1");
                }
            });
        }
    });
});
app.post("/wordList",urlencodedParser,function(req,res){
    let date = req.body.date;
    if(date == "new"){
        var whereJson = {
        'and':[],
        'or':[]
        };
        var orderByJson = {'key':'time','type':'desc'};
        var limitArr = [0,1];
        var fieldsArr = ['time'];
        baseModel.find('word',whereJson,orderByJson,limitArr,fieldsArr,function(data){
            let t1 = data[0]['time'];
            let w = {'and':[{'key':'time','opts':'=','value':t1}],'or':[]};
            var o = {'key':'id','type':'desc'};
            baseModel.find('word',w,o,[],[],function(d){
                res.end(JSON.stringify(d));
            });
        });
    }else{

    }
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