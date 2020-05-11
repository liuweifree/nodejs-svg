var _ad_id='';
var openAd = function(){
    var obj={
        type:2
    }
    $.danmuAjax('/v1/api/admin/config/type', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            var paramSize=-1;
            if(data.data && data.data.paramList){
                paramSize = data.data.paramList.length;

                _ad_id = data.data.id;
            }

            var htmlStr = '<fieldset>';
            console.log(paramSize);
            for (var i = 0; i < 10; i++) {
                var pid ="";
                var position="";
                if( paramSize > i){
                    pid = data.data.paramList[i].pid;
                    position = data.data.paramList[i].position;
                }
                htmlStr += '<div class="control-group" style="margin-top:18px;">\n' +
                    '                                                <div style="margin-left: 20px;">\n' +
                    '                                                    <div>\n' +
                    '                                                        开关key:<input type="text" class="span3 adId"  value="'+pid+'" >\n' +
                    '                                                        开关值:<input type="text" class="span3 adPosition"  value="'+position+'">\n' +
                    '                                                    </div>\n' +
                    '                                                </div>' +
                    '                                            </div>';

            }
            htmlStr += '</fieldset><div class="form-actions">' +
                '<a class="btn btn-primary" id="saveParty" onclick="updateAd();">保存</a>\n' +
                '</div>';
            $('#edit-profile').html(htmlStr);
        }else{
            alert('查询失败');
        }
    }, function (data) {
        console.log(data);
    });

}

var updateAd = function(){

    var paramList = new Array();
    var adIdList = $('.adId');
    var adPosition = $('.adPosition');
    for(var i=0;i<adIdList.length;i++){
        if($(adIdList[i]).val() && '' != $(adIdList[i]).val()){
            var param = {};
            param.pid = $(adIdList[i]).val();
            param.position = $(adPosition[i]).val();
            paramList.push(param);
        }
    }
    var obj= {
        paramList:JSON.stringify(paramList),
        type:2,
        id:_ad_id
    }
    $.danmuAjax('/v1/api/admin/config/update', 'POST','json',obj, function (data) {
        if( data.result == 200){
            alert('保存成功');
        }else{
            if(data.result_msg){
                alert(data.result_msg);
            }else{
                alert('保存失败')
            }
        }
    }, function (data) {
        console.log(data);
    });
}

openAd();