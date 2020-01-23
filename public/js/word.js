$(function(e){
    var $t = $('#t');
    var media = $('#media')[0];
    $.post('wordList',{date:"new"},function(data){
        let t = JSON.parse(data);
        t.forEach(e => {
            $t.append("<ul class='list-group list'><li class='list-group-item'>"+
                "<h4 class='list-group-item-heading'>"+e['word']+"</h4><div class='audioControl'>"+
                "</div></div><p class='list-group-item-text'>"+e['explains']+"</p><span class='none'>"+
                e['audioUrl']+"</span></li></ul>");
        });
        $('.list-group-item').each(function(i){
            $(this).click(function(e){
                let t = $(this).find('.none').text();
                let audioUrl = "./audio/"+t+".mp3";
                $('#media').html("<source src='"+audioUrl+"' type='audio/mpeg'>");
                media.load();
                media.play();
            });
        });
    });
});

