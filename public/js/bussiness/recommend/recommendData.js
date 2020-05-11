Date.prototype.format = function(f){
    var o ={
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(f))f=f.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(f))f = f.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));return f
}

var getQueryVariable = function(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

var _recommendList = new Array();

var _recommendId;

var tableUrl = '/v1/api/admin/resource/page';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field:'icon',
        title: '资源图片',
        align: 'center',
        formatter: function (value, row, index) {
            if(null != row && null != row.icon){
                return '<img width="30%" src="'+_baseImageUrl+row.icon+'" />';
            }else{
                return "";
            }
        }

    },
    {
        field: 'name',
        title: '名称',
        align: 'center'
    },
    {
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var rindex = _recommendList.findIndex(function(item) {
                return item.id === row.id;
            });

            console.log('row.id:'+row.id+'  rindex:'+rindex);
            if( _recommendList.length==0 || rindex < 0){
                return '<div id="div_'+row.id+'"><a id="a_'+row.id+'" class="btn" onclick="addRecommendList(\''+row.id+'\',\''+_baseImageUrl+row.icon+'\',\''+row.name+'\')">添加</a></div>';
            }else{
                return '<div id="div_'+row.id+'"></div>';
            }
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};



var _basePageSize = 20;
var _pageNum = 1;

var addRecommendList = function(id,imageUrl,name){
    var itemObj ={
        id:id,
        imageUrl:imageUrl,
        name:name
    }
    _recommendList.push(itemObj);

    var length = _recommendList.length;
    if( length >1 &&(length-1) %_basePageSize ==0){
        $('#recommendList').html('');
        _pageNum ++;
        createPageHtml(_pageNum,_basePageSize,length);
    }
    if( name == 'null'){
        name = '';
    }
    var html = '<span id="span_'+id+'" style="border: solid 2px #f5f5f5;width:80%;float:left;">';
        html += '<img width="25%" src="'+imageUrl+'" />'+name;
        html +='&nbsp;&nbsp;<a id="up_'+id+'" onclick="upLi(\''+id+'\',\''+imageUrl+'\',\''+name+'\')">上</a>';
        html +='&nbsp;&nbsp;<a id="down_'+id+'" onclick="downLi(\''+id+'\',\''+imageUrl+'\',\''+name+'\')">下</a>';
        html +='&nbsp;&nbsp;<a onclick="delRecommendList(\''+id+'\',\''+imageUrl+'\',\''+name+'\')">删除</a>';
        html +='</span>';
    $('#recommendList').append(html);
    $('#a_'+id).remove();

}

var createPageHtml = function(pageNum,pageSize,total){
    $('#diyPagination').html('');
    var totalPageNum =parseInt((total + pageSize - 1)/pageSize) ;
    var nextPageNum = pageNum+1;
    var prePageNum = pageNum-1;
    var length = _recommendList.length;
    var pageHtml = '<span style="margin-left:10px;">第'+pageNum+'页</span>';
    if( pageNum == 1){
        if( pageNum*_basePageSize < length  ){
            pageHtml += '<a style="margin-left:10px;" onclick="gotoPage('+nextPageNum+')" href="javascript:void(0)">下一页»</a>';
        }
    }else if( pageNum == totalPageNum){
        pageHtml += '<a style="margin-left:10px;" onclick="gotoPage('+prePageNum+')" href="javascript:void(0)">上一页»</a>';
    }else if(pageNum < totalPageNum){
        pageHtml += '<a style="margin-left:10px;" onclick="gotoPage('+prePageNum+')" href="javascript:void(0)">«上一页</a>';
        pageHtml += '<a style="margin-left:10px;" onclick="gotoPage('+nextPageNum+')" href="javascript:void(0)">下一页»</a>';
    }
    pageHtml += '<a style="margin-left:10px;" onclick="gotoPageNum()">跳转</a><input type="text" id="danmuGoto" style="width:25px;">';
    pageHtml += '<span style="margin-left:10px;">共<span>'+totalPageNum+'</span>页</span>';
    $('#diyPagination').html(pageHtml);
}

var gotoPage = function(pageNum){
    var startIndex = (pageNum-1 ) * _basePageSize;
    var stopIndex = (pageNum * _basePageSize)-1;
    if( stopIndex > _recommendList.length-1){
        stopIndex = _recommendList.length-1;
    }
    $('#recommendList').html('');
    for(var i=startIndex;i<=stopIndex;i++){
       var item =  _recommendList[i];
       if( item){
           var html = '<span id="span_'+item.id+'" style="border: solid 2px #f5f5f5;width:80%;float:left;">';
           html += '<img width="25%" src="'+item.imageUrl+'" />'+item.name;
           html +='&nbsp;&nbsp;<a id="up_'+item.id+'" onclick="upLi(\''+item.id+'\',\''+item.imageUrl+'\',\''+item.name+'\')">上</a>';
           html +='&nbsp;&nbsp;<a id="down_'+item.id+'" onclick="downLi(\''+item.id+'\',\''+item.imageUrl+'\',\''+item.name+'\')">下</a>';
           html +='&nbsp;&nbsp;<a onclick="delRecommendList(\''+item.id+'\',\''+item.imageUrl+'\',\''+item.name+'\')">删除</a>';
           html +='</span>';
           $('#recommendList').append(html);
       }
    }
    createPageHtml(pageNum,_basePageSize,_recommendList.length);
}

var gotoPageNum = function(){
    var pageNum = $('#danmuGoto').val();
    var totalPageNum =parseInt((_recommendList.length + _basePageSize - 1)/_basePageSize) ;
    if( pageNum> totalPageNum){
        alert('没有这个页');
        return;
    }
    gotoPage(pageNum);
}

var delRecommendList = function(id,imageUrl,name){
    $('#span_'+id).remove();
    $('#div_'+id).html('<a id="a_'+id+'" class="btn" onclick="addRecommendList(\''+id+'\',\''+imageUrl+'\',\''+name+'\')">添加</a>');
    var index = _recommendList.findIndex(function(item) {
        return item.id === id;
    });
    _recommendList.splice(index, 1);
    console.log(JSON.stringify(_recommendList))

    var length = _recommendList.length;
    console.log(_pageNum * _basePageSize +'=========='+length)
    if( _pageNum * _basePageSize > length){
        _pageNum--;
        if( _pageNum == 0){
            _pageNum =1;
        }
        gotoPage(_pageNum);
    }else{
        gotoPage(_pageNum);
    }

}

var upLi = function(id,imageUrl,name){
    $('#span_'+id).insertBefore($('#span_'+id).prev());
    var index = _recommendList.findIndex(function(item) {
        return item.id === id;
    });
    if( index > 0){
        _recommendList[index] = _recommendList.splice(index-1, 1, _recommendList[index])[0];
        if( index % _basePageSize ==0){
            gotoPage(_pageNum);
        }
    }

}


var downLi = function(id,imageUrl,name){
    $('#span_'+id).insertAfter($('#span_'+id).next());
    var index = _recommendList.findIndex(function(item) {
        return item.id === id;
    });
    if( index < _recommendList.length){
        _recommendList[index] = _recommendList.splice(index+1, 1, _recommendList[index])[0];
        if( (index+1 ) % _basePageSize ==0  ){
            gotoPage(_pageNum);
        }
    }

}

var updateRecommend = function(){

    var length = _recommendList.length;
    var idList = new Array();
    for(var i=0;i<length;i++){
        idList.push(_recommendList[i].id);
    }

    var obj= {
        id:_recommendId,
        resourceIdList:idList.toString()
    }

    $.danmuAjax('/v1/api/admin/recommendlist/update', 'POST','json',obj, function (data) {
        if( data.result == 200){
            $('#myModal').modal('hide');
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            fileUrl = "";
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

var initRecommendList = function(){
    var name = getQueryVariable('name');
    _recommendId = getQueryVariable('id');
    $('#recommendListName').html(decodeURI(name));

    var obj={
        id:_recommendId
    }
    $.danmuAjax('/v1/api/admin/recommendlist/get', 'GET','json',obj, function (data) {
        if(data.result == 200) {

            if( null == data.data.resourceIdList){
                $.initTable('tableList', columnsArray, quaryObject, tableUrl);
                return;
            }

            var ril = new Array();
            for(var i=0;i<data.data.resourceIdList.length;i++){
                ril.push(data.data.resourceIdList[i]);
            }
            var robj={
                resourceIdList:ril.toString()
            }
            $.danmuAjax('/v1/api/admin/resource/idList', 'POST','json',robj, function (data) {
                for(var i=0;i<data.data.length;i++){
                    if( data.data[i] != null){
                        var itemObj ={

                            id:data.data[i].id,
                            imageUrl:_baseImageUrl+data.data[i].icon,
                            name:data.data[i].name
                        }
                        _recommendList.push(itemObj);
                    }

                }

                //加载表格数据
                $.initTable('tableList', columnsArray, quaryObject, tableUrl);
                gotoPage(1);

            }, function (data) {
                console.log(data);
            });

        }else{
            alert('获取资源失败');
        }

    }, function (data) {
        console.log(data);
    });
}

var findByName = function(){
    tableUrl = '/v1/api/admin/resource/pageNameLike'
    quaryObject.name = $('#searchName').val()
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}


initRecommendList();
