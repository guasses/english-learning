$(function(e){
    var $t = $('#t');
    $.post('wordList',{date:"new"},function(data){
        let t = JSON.parse(data);
        t.forEach(e => {
            $t.append("<ul class='list-group' id='list'><li class='list-group-item'>"+
                "<h4 class='list-group-item-heading'>"+e['word']+"</h4><div class='audioControl'>"+
                "<div class='play'><span id='play' class='glyphicon glyphicon-volume-up'></span>"+
                "</div></div><p class='list-group-item-text'>"+e['explains']+"</p><span class='none'>"+
                e['audioUrl']+"</span></li></ul>");
        });
    });
});


/*<ul class="list-group" id="list">
                    <li class="list-group-item">
                        <h4 class="list-group-item-heading">List group item heading</h4>
                        <div class="audioControl">
                            <div class="play">
                                <span id="play" class="glyphicon glyphicon-volume-up"></span>
                            </div>
                        </div>
                        <p class="list-group-item-text">11111111</p>  
                        <span class="none"></span>   
                    </li>
                </ul>*/