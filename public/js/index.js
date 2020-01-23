$(function(){
    //$("#audioControl").hide();
    //$("#save").hide();
    var appKey = '7855455bc8c03449';
    var key = 'BNjvoaZgbB2hZTVicE5DnLs0frYGQB2W';
    var media = $('#media')[0];
    var word = "";
    var explains = "";
    var audioUrl = "";
    $("#translate").click(function(e){
        word = $("#world").val();
        //console.log(world);
        var salt = (new Date).getTime();
        var curTime = Math.round(new Date().getTime()/1000);
        var query = word;
        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
        var from = 'en';
        var to = 'zh-CHS';
        var str1 = appKey + truncate(query) + salt + curTime + key;
        //console.log(str1);
        var sign = sha256(str1);
        $.ajax({
            url: 'http://openapi.youdao.com/api',
            type: 'post',
            dataType: 'jsonp',
            data: {
                q: query,
                appKey: appKey,
                salt: salt,
                from: from,
                to: to,
                sign: sign,
                signType: "v3",
                curtime: curTime,
            },
            success: function (data) {
                //console.log(data);
                var explainsArray = data["basic"]["explains"];
                explains = explainsArray.join(" ");
                var tmp = explainsArray.join("<br>");
                audioUrl = data["speakUrl"];
                $('#media').html("<source src='"+audioUrl+"' type='audio/mpeg'>");
                media.load();
                $("#meaning").html("<p>"+tmp+"</p>");
                $("#audioControl").show();
                $("#save").show();
            }
        });
    });
    $("#save").click(function(e){
        $.post('word',{word:word,explains:explains,audioUrl:audioUrl},function(data){
            //console.log(data);
            if(data=="2"){
                alert("该单词数据库中已存在");
            }else if(data=="1"){
                console.log("插入成功！");
                //alert("插入成功！");
            }
        });
    });
    var audioTimer = null;
    //console.log(media);
    //绑定播放暂停控制
    $('.play').bind('click', function() {
        playAudio();
    }); 
    
    //播放暂停切换
    function playAudio() {
        if(media.paused) {
            play();
        } else {
            pause();
        }
    }
    
    //播放
    function play() {
        media.play();
    }
    
    //暂停
    function pause() {
        media.pause();
    }

});
function truncate(q){
    var len = q.length;
    if(len<=20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
}