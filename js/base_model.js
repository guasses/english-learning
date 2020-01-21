/**
 * @type class BaseModel
 * @author guasses
 * @time 2019-07-02
 * @desc desc base.model.js by Node.js开发实战详解，mysql数据库CRUD接口
 */
const util = require('util'),
    fs = require('fs'),
    mysql = require('mysql');

var pool;

module.exports = function(){
    __constructor();
    /*数据查询接口*/
    this.findOneById = function(tableName,id,callback){};
    /*数据插入接口*/
    this.insert = function(tableName,rowInfo,callback){};
    /*数据修改接口*/
    this.modify = function(tableName,id,rowInfo,callback){};
    /*数据删除接口*/
    this.remove = function(table,id,callback){};
    /*数据条件查询接口*/
    this.find = function(tableName,whereJson,orderByJson,limitArr,fieldsArr,callback){};
    /**
     * @desc BaseModel类构造函数，连接数据库
     */
    function query(sql,arr,callback){
        pool.getConnection(function(err,connection){
            if(err){
                throw err;
                return;
            }
            console.log("数据库连接成功！");
            connection.query(sql,arr,function(error,results,fields){
                connection.release();
                if(error){
                    console.log("数据库查询失败！");
                    callback(false);
                    throw error;
                }
                callback && callback(results,fields);
            });
        });
    }
    function __constructor(){
        var dbConfig = getJsonFromFile('config.json','db');
        var client = {};
        client.host = dbConfig['host'];
        client.port = dbConfig['port'];
        client.user = dbConfig['user'];
        client.password = dbConfig['password'];
        client.database = dbConfig['dbName'];
        //创建mysql连接
        pool = mysql.createPool(client);
        /*dbClient = mysql.createConnection(client);
        dbClient.connect();*/
        /*query('USE ' + dbConfig['dbName'],function(err,results){
            if(err || results == undefined){
                console.log('数据库连接错误：' + err.message);
                dbClient.end();
            }else{
                console.log('选择数据库成功！');
            }
        })*/
    }
    /**
     * @desc 向数据库插入数据
     * @param tableName string
     * @param rowInfo json
     * @param callback function
     * @return null
     */
    this.insert = function(tableName,rowInfo,callback){
        query('INSERT INTO ' + tableName + ' SET ?',rowInfo,function(results,fields){
            //if(err) throw err;
            callback(results.insertId);
        });
    }
    /**
     * @desc 根据主键id值查询数据库的一条记录
     * @param tableName string
     * @param idJson id
     * @param callback function
     * @return null
     */
    this.findOneById = function(tableName,idJson,callback){
        query('SELECT * FROM ' + tableName + ' WHERE ?',idJson,function(result,fields){
            /*if(err){
                console.log('获取数据错误：' + err.message);
                callback(false);
                dbClient.end();
            }else{*/
                //console.log(result);
                if(result){
                    callback(result.pop());
                }else{
                    callback(result);
                }
        });
    }
    /**
     * @desc 修改数据库的一条数据
     * @param tableName string
     * @param idJson json
     * @param rowInfo json
     * @param callback function
     * @return null
     */
    this.modify = function(tableName,idJson,rowInfo,callback){
        query('UPDATE ' + tableName + ' SET ? WHERE ?',[rowInfo,idJson],
            function(result,fields){
                /*if(err){
                    console.log('修改数据错误：' + err.message);
                    callback(false);
                }else{*/
                    callback(result);
            });
    }
    /**
     * @desc 删除数据库的一条数据
     * @param tableName string
     * @param idJson json
     * @param callback function
     * @return null
     */
    this.remove = function(tableName,idJson,callback){
        query('DELETE from ' + tableName + ' where ?',idJson,function(results,fields){
            /*if(err){
                console.log("删除数据错误：" + err.message);
                callback(false);
            }else{*/
                callback(true);
        });
    }
    /**
     * @desc 条件查询数'据
     * @param tableName string
     * @param whereJson json desc 查找的条件 var whereJson = {
     * 'and':[{'key':'book_name','opts':'=','value':'"nodejs book"'},
     * {'key':'author','opts':'=','value':'"danhuang"'}],
     * 'or':[{'key':'book_id','opts':'<','value':10}]
     * };
     * @param orderByJson json desc 排序 var orderByJson = {'key':'book_name','type':'desc/sec'};
     * @param limitArr array desc 数据偏移，以及数据返回数量 var limitArr = [0,10];
     * @param fieldsArr array desc 返回那些字段 var fieldsArr = ['book_name','author'];
     * @param callback function
     * @return null
     */
    this.find = function(tableName,whereJson,orderByJson,limitArr,fieldsArr,callback){
        var andWhere = whereJson['and'],
            orWhere = whereJson['or'],
            andArr = [],
            orArr = [];
        for(var i=0; i<andWhere.length; i++){
            andArr.push(andWhere[i]['key']+andWhere[i]['opts']+
            andWhere[i]['value']);
        }
        for(var i=0; i<orWhere.length; i++){
            orArr.push(orWhere[i]['key'] + orWhere[i]['opts'] +
            orWhere[i]['value']);
        }
        //判断条件是否存在，如果存在则转换相应的添加语句
        var filedsStr = fieldsArr.length > 0 ? fieldsArr.join(',') : '*',
            andStr = andArr.length > 0 ? andArr.join(' and ') : '',
            orStr = orArr.length > 0 ? ' or ' + orArr.join(' or ') : '',
            limitStr = limitArr.length > 0 ? ' limit ' + limitArr.join(',') : '',
            orderStr = orderByJson ? ' order by ' + orderByJson['key'] + 
            ' ' + orderByJson['type'] : '';
        var sql = '';
        if(andArr.length == 0 && orArr.length == 0){
            sql = 'SELECT ' + filedsStr + ' FROM ' + tableName + orderStr + limitStr;
        }else{
            sql = 'SELECT ' + filedsStr + ' FROM ' + tableName + ' where ' +
            andStr + orStr + orderStr + limitStr;
        }
        //console.log(sql);
        query(sql,[],function(results,fields){
            /*if(err){
                console.log('获取数据错误：' + err.message);
                callback(false);
            }else{*/
                console.log('数据查询成功！');
                callback(results);
        });
    }
    /**
     * @desc desc查询数据库数据表总条数
     * @param tableName string
     * @param callback function
     */
    this.totalCount = function(tableName,callback){
        query('select count(id) from ' + tableName,[],function(results,fields){
            for(let x in results[0]){
                console.log("数据库查询总条数成功！共"+results[0][x]+"条数据！")
                callback(results[0][x]);
            }
        });
    }
    /**
     * @desc 查询数据库特定数值总共有多少条数据
     * @param tableName string
     * @param type string
     * @param callback function
     */
    this.count = function(tableName,type,callback){
        query('SELECT count(case when '+ type +' then 1 else null end) from ' + tableName,[],function(results,fields){
            for(let x in results[0]){
                console.log("数据库查询"+type+"条数成功！共"+results[0][x]+"条数据！")
                callback(results[0][x]);
            }
        });
    }
}

function getJsonFromFile(fileName,key){
    var configJson = {};
    try{
        var str = fs.readFileSync(fileName,'utf8');
        configJson = JSON.parse(str);
    }catch(e){
        util.debug("JSON parse fails");
    }
    return configJson[key];
}