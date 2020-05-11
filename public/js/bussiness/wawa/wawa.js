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
var _allCategory = new Array();
var _allTag = new Array();

var tableUrl = '/v1/api/admin/resource/page';
var columnsArray = [
    {
        title: 'ID',
        align: 'center',
        field:'id',
    },
    {
        field:'icon',
        title: '资源图片',
        align: 'center',
        width:'15%',
        formatter: function (value, row, index) {
            if(null != row && null != row.icon){
                return '<img width="50%" src="'+_baseImageUrl+row.icon+'" />';
            }else{
                return "";
            }
        }

    },
    {
        field: 'name',
        title: '名称',
        align: 'center',
        formatter: function (value, row, index) {
            if(row.name){
                return '<a onclick="openName(\''+row.id+'\',\''+row.name+'\')">'+row.name+'</a>';
            }else{
                return '<a class="btn" onclick="openName(\''+row.id+'\',\'\')">添加</a>';;
            }
        }
    },
    {
        field: 'category',
        title: '分类',
        align: 'center',
        width:'25%',
        formatter: function(value, row, index){
            return createTagHtml(row.id,1,row.category);
        }
    },
    {
        field: 'tag',
        title: '标签',
        align: 'center',
        formatter: function(value, row, index){
            return createTagHtml(row.id,2,row.tag);
        }
    },
    {
        field: 'scoreMap',
        title: '打分',
        align: 'center',
        formatter: function(value, row, index){
            if( null != row.scoreMap){
                return '新：<input id="newScore_'+row.id+'" style="width: 20px;" value="'+row.scoreMap.newScore+'">老：<input id="oldScore_'+row.id+'" style="width: 20px;" value="'+row.scoreMap.oldScore+'"><a onclick="updateASort(\''+row.id+'\')">保存</a>';
            }else{
                return '新：<input id="newScore_'+row.id+'" style="width: 20px;" value="">老：<input id="oldScore_'+row.id+'"  style="width: 20px;" value=""><a onclick="updateASort(\''+row.id+'\')">保存</a>';
            }

        }
    },
    {
        field:'showTime',
        title: '展示时间',
        align: 'center',
        formatter: function (value, row, index) {
            if(row.showTime){
                var dd = new Date(parseInt(row.showTime)).format('yyyy-MM-dd');
                return '<a onclick="opeShowTime(\''+row.id+'\',\''+dd+'\')">'+dd+'</a>';
            }else{
                return '<a class="btn" onclick="opeShowTime(\''+row.id+'\',\'\')">添加</a>';
            }
        }
    },
    {
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var btn;
            if( row.status == 0){
                btn = '<a class="btn" onclick="updateResourceStatus(\''+row.id+'\',3)">测试</a>';
            }else if(row.status == 3){
                btn = '<a class="btn" onclick="updateResourceStatus(\''+row.id+'\',1)">正式</a>';
            }else if(row.status == 1){
                btn = '<a class="btn" onclick="updateResourceStatus(\''+row.id+'\',0)">停用</a>';
            }
            if( row.scoreMap == null){
                row.scoreMap = {newScore:"",oldScore:""}
            }

            btn += '<a class="btn" onclick="preview( \''+row.id+'\', \''+row.svgUrl+'\')">预览</a>';
            return btn+'<a class="btn" onclick="delResource(\''+row.id+'\')">删除</a>';
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};



var updateResourceStatus = function(id,status){
    var obj = {
        id:id,
        status:status
    }
    $.danmuAjax('/v1/api/admin/resource/update', 'POST','json',obj, function (data) {
      if (data.result == 200) {
          console.log(data);
          $.initTable('tableList', columnsArray, quaryObject, tableUrl);
          alert('更新成功')
      }else{
         alert('更新失败')
      }
    }, function (data) {
        console.log(data);
    });
}

var delResource = function(id){
    var obj = {
        id:id
    }
    if (confirm('确认要删除资源“' + id + '”吗？')) {
        $.danmuAjax('/v1/api/admin/resource/del', 'GET','json',obj, function (data) {
          if (data.result == 200) {
              console.log(data);
              $('#myModal').modal('hide');
              $.initTable('tableList', columnsArray, quaryObject, tableUrl);
              alert('删除成功')
          }else{
             alert('删除s失败')
          }
        }, function (data) {
            console.log(data);
        });
    }

}
var updateASort = function(id){

    var scoreMap = { newScore:$('#newScore_'+id).val(),oldScore:$('#oldScore_'+id).val()}
    var obj = {
        id:id,
        scoreMap:scoreMap
    }
    $.danmuAjax('/v1/api/admin/resource/update', 'POST','json',obj, function (data) {
        if (data.result == 200) {
            console.log(data);
            alert('更新成功')
        }else{
            alert('更新失败')
        }
    }, function (data) {
        console.log(data);
    });
}

var initAllTag = function(){
    $.danmuAjax('/v1/api/admin/tag/all', 'GET','json',null, function (data) {
        if( data.result == 200){
            for(var i=0;i<data.data.length;i++){
                if(data.data[i].type ==1){
                    _allCategory.push(data.data[i]);
                }else if(data.data[i].type == 2){
                    _allTag.push(data.data[i]);
                }

            }
            //加载表格数据
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
        }
    }, function (data) {
        console.log(data);
    });
}

var selectATag = function(id,type,tagId){
    var obj = {
        id:id,
        tagId:tagId,
        type:type
    }
    $.danmuAjax('/v1/api/admin/resource/addTag', 'GET','json',obj, function (data) {
        if (data.result == 200) {
            if( type == 1){
                refreshTagHtml(id,type,data.data.category);
            }else if(type ==2){
                refreshTagHtml(id,type,data.data.tag);
            }

        }else{
            alert('添加失败')
        }
    }, function (data) {
        console.log(data);
    });

}

var delATag = function(id,type,tagId){
    var obj = {
        id:id,
        type:type,
        category:tagId
    }

    $.danmuAjax('/v1/api/admin/resource/delTag', 'GET','json',obj, function (data) {
        if (data.result == 200) {
            if( type == 1){
                refreshTagHtml(id,type,data.data.category);
            }else if(type ==2){
                refreshTagHtml(id,type,data.data.tag);
            }

        }else{
            alert('删除失败')
        }
    }, function (data) {
        console.log(data);
    });
}

var refreshTagHtml = function(id,type,select){
    var html = '';
    var hasSelect = '';
    if( type ==1){
        for( var i=0;i<_allCategory.length;i++){
            hasSelect = '';
            if( null != select){

                for( var j=0;j<select.length;j++){

                    if( select[j]==_allCategory[i].keyValue ){
                        hasSelect='style="color:red"';
                    }
                }
            }
            if( hasSelect == ''){
                html+='<a '+hasSelect+' onclick="selectATag(\''+id+'\',\''+type+'\',\''+_allCategory[i].keyValue+'\')">'+ _allCategory[i].tagMap.zh_CN+'</a>&nbsp;&nbsp;';
            }else{
                html+='<a '+hasSelect+' onclick="delATag(\''+id+'\',\''+type+'\',\''+_allCategory[i].keyValue+'\')">'+ _allCategory[i].tagMap.zh_CN+'</a>&nbsp;&nbsp;';
            }

        }
        $('#categoryDiv_'+id).html(html);
    }else if(type ==2){
        for( var i=0;i<_allTag.length;i++){
            hasSelect = '';
            if( null != select){
                if( select == _allTag[i].keyValue){
                    hasSelect='style="color:red"';
                }
            }
            if( hasSelect == ''){
                html+='<a '+hasSelect+' onclick="selectATag(\''+id+'\',\''+type+'\',\''+_allTag[i].keyValue+'\')">'+ _allTag[i].tagMap.zh_CN+'</a>&nbsp;&nbsp;';
            }else{
                html+='<a '+hasSelect+' onclick="delATag(\''+id+'\',\''+type+'\',\''+_allTag[i].keyValue+'\')">'+ _allTag[i].tagMap.zh_CN+'</a>&nbsp;&nbsp;';
            }
        }
        $('#tagDiv_'+id).html(html);
    }

}

var createTagHtml = function(id,type,select){
    var html = '';
    var hasSelect = '';
    if( type ==1){
        html = '<div id="categoryDiv_'+id+'">';
        for( var i=0;i<_allCategory.length;i++){
            hasSelect = '';
            if( null != select){

                for( var j=0;j<select.length;j++){

                    if( select[j]==_allCategory[i].keyValue ){
                        hasSelect='style="color:red"';
                    }
                }
            }
            if( hasSelect == ''){
                html+='<a '+hasSelect+' onclick="selectATag(\''+id+'\',\''+type+'\',\''+_allCategory[i].keyValue+'\')">'+ _allCategory[i].tagMap.zh_CN+'</a>&nbsp;&nbsp;';
            }else{
                html+='<a '+hasSelect+' onclick="delATag(\''+id+'\',\''+type+'\',\''+_allCategory[i].keyValue+'\')">'+ _allCategory[i].tagMap.zh_CN+'</a>&nbsp;&nbsp;';
            }

        }
        html += '</div>';
    }else if(type ==2){
        html = '<div id="tagDiv_'+id+'">';
        for( var i=0;i<_allTag.length;i++){
            hasSelect = '';
            if( null != select){
                if( select == _allTag[i].keyValue){
                    hasSelect='style="color:red"';
                }
            }
            if( hasSelect == ''){
                html+='<a '+hasSelect+' onclick="selectATag(\''+id+'\',\''+type+'\',\''+_allTag[i].keyValue+'\')">'+ _allTag[i].tagMap.zh_CN+'</a>&nbsp;&nbsp;';
            }else{
                html+='<a '+hasSelect+' onclick="delATag(\''+id+'\',\''+type+'\',\''+_allTag[i].keyValue+'\')">'+ _allTag[i].tagMap.zh_CN+'</a>&nbsp;&nbsp;';
            }
        }
        html += '</div>';
    }

    return html;

}

var openSelectTag = function(id,type){
    var obj = {
        id:id
    }
    $.danmuAjax('/v1/api/admin/resource/get', 'GET','json',obj, function (data) {
        if (data.result == 200) {
            $('#modalBody').html('<table id="addressTableList" class="table table-striped" table-height="360"></table>');
            var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
            $('#modalFooter').html(buttonHtml);
            $('#myModal').modal('show');
            if( type == 1){
                $('#myModalLabel').html('选择分类')
            }else{
                $('#myModalLabel').html('选择标签')
            }

            var prizeTableUrl = '/v1/api/admin/tag/page';
            var prizeQueryObject = {
                pageSize: 6,
                type:type,
                resourceId:id
            }
            var prizeColumnsArray =[
                {
                    title: '名称',
                    align: 'center',
                    formatter: function (value, row) {
                        if(null != row && null != row.tagMap){
                            return row.tagMap.zh_CN;
                        }else{
                            return "";
                        }
                    }
                },
                {
                    field: '',
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {

                        if( type ==1){
                            var categorys = data.data.category;
                            if( null == categorys){
                                return '<a class="btn" onclick="selectTag(\''+id+'\',\''+type+'\',\''+row.keyValue+'\')">选择</a>';
                            }
                            var isHas = false;
                            for(var i=0;i<categorys.length;i++){
                                if(categorys[i] == row.keyValue){
                                    isHas = true;
                                }

                            }
                            if(isHas){
                                return '<a class="btn" onclick="delTag(\''+id+'\',\''+type+'\',\''+row.tagMap.zh_CN+'\',\''+row.keyValue+'\')">删除</a>';
                            }else{
                                return '<a class="btn" onclick="selectTag(\''+id+'\',\''+type+'\',\''+row.keyValue+'\')">选择</a>';
                            }


                        }else{
                            var tagId = data.data.tag;
                            if( row.keyValue == tagId){
                                return '<a class="btn" onclick="delTag(\''+id+'\',\''+type+'\',\''+row.tagMap.zh_CN+'\',\''+row.keyValue+'\')">删除</a>';
                            }else{
                                return '<a class="btn" onclick="selectTag(\''+id+'\',\''+type+'\',\''+row.keyValue+'\')">选择</a>';
                            }
                        }
                    }
                }
            ];
            var tableSuccess = function(){
                $('#modalBody').find('.pull-left').remove();
            }
            $.initTable('addressTableList', prizeColumnsArray, prizeQueryObject, prizeTableUrl,tableSuccess);
        }else{
            alert('删除s失败')
        }
    }, function (data) {
        console.log(data);
    });



}

var delTag = function(id,type,name,tagId){
    var obj = {
        id:id,
        type:type,
        category:tagId
    }
    if (confirm('确认要删除“' + name + '”吗？')) {
        $.danmuAjax('/v1/api/admin/resource/delTag', 'GET','json',obj, function (data) {
            if (data.result == 200) {
                console.log(data);
                if( type == 1){
                    openSelectTag(id,type,data.data.category);
                }else{
                    openSelectTag(id,type,data.data.tag);
                }

            }else{
                alert('删除失败')
            }
        }, function (data) {
            console.log(data);
        });
    }
}

var selectTag = function(id,type,tagId){
    var obj = {
        id:id,
        tagId:tagId,
        type:type
    }
    $.danmuAjax('/v1/api/admin/resource/addTag', 'GET','json',obj, function (data) {
        if (data.result == 200) {

            openSelectTag(id,type,tagId);
        }else{
            alert('添加失败')
        }
    }, function (data) {
        console.log(data);
    });

}

var openName = function(id,name){
    $('#myModalLabel').html('资源名称' );
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
        '<label class="control-label" style="width:65px">资源名称</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="recourceName" maxlength="20" value="'+name+'"/><br>';
    htmlStr += '</div></div></form>';
    $('#modalBody').html(htmlStr);
    var footerHtml = '<button class="btn btn-primary" onclick="updateName(\''+id+'\')" id="updateName">保存</button>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');

}


var updateName = function(id){
    var obj = {
        id:id,
        name:$('#recourceName').val()
    }
    $.danmuAjax('/v1/api/admin/resource/update', 'POST','json',obj, function (data) {
        if (data.result == 200) {
            console.log(data);
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            $('#myModal').modal('hide');
            alert('更新成功')
        }else{
            alert('更新失败')
        }
    }, function (data) {
        console.log(data);
    });
}


var opeShowTime = function(id,showTime){
    $('#myModalLabel').html('资源名称' );
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
        '<label class="control-label" style="width:65px">显示日期</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="showTime" maxlength="20" value="'+showTime+'"/><br>';
    htmlStr += '</div></div></form>';
    $('#modalBody').html(htmlStr);
    var footerHtml = '<button class="btn btn-primary" onclick="updateShowTime(\''+id+'\')" id="updateShowTime">保存</button>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');

}

var updateShowTime = function(id){

    var date = new Date($('#showTime').val()+' 00:00:01');
    var obj = {
        id:id,
        showTime:date.getTime()
    }
    $.danmuAjax('/v1/api/admin/resource/update', 'POST','json',obj, function (data) {
        if (data.result == 200) {
            console.log(data);
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            $('#myModal').modal('hide');
            alert('更新成功')
        }else{
            alert('更新失败')
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

var openSort = function(id,newScore,oldScore){

    $('#myModalLabel').html('排序' );
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
        '<label class="control-label" style="width:65px">新用户分数</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="newScore" maxlength="20" value="'+newScore+'"/><br></div>'+
        '<label class="control-label" style="width:65px">老用户分数</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="oldScore" maxlength="20" value="'+oldScore+'"/><br>';
    htmlStr += '</div></div></form>';
    $('#modalBody').html(htmlStr);
    var footerHtml = '<button class="btn btn-primary" onclick="updateSort(\''+id+'\')" id="updateName">保存</button>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');
}

var updateSort = function(id){

    var scoreMap = { newScore:$('#newScore').val(),oldScore:$('#oldScore').val()}
    var obj = {
        id:id,
        scoreMap:scoreMap
    }
    $.danmuAjax('/v1/api/admin/resource/update', 'POST','json',obj, function (data) {
        if (data.result == 200) {
            console.log(data);
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            $('#myModal').modal('hide');
            alert('更新成功')
        }else{
            alert('更新失败')
        }
    }, function (data) {
        console.log(data);
    });
}

var sortByType = function(){

    quaryObject.type =  $('#sortValue').val()
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}

var svgg;
var sObject;
var _svgUrl;

var preview = function(id,svgUrl){
    _svgUrl = svgUrl;
    $('#myModalLabel').html('预览' );
    var htmlStr = '<div id="svgDiv"><embed id="svgObject" src="'+svgUrl+'" type="image/svg+xml"/></div>';
    htmlStr += '<div><select id="effect" onchange="changeEffect()"><option value="0">无效果</option><option value="1">变色模版</option><option value="2">背景图</option></select></div>';
    htmlStr += '<div id="otherDiv"></div>';
    $('#modalBody').html(htmlStr);
    var footerHtml = '<button class="btn btn-primary" onclick="createIcon(\''+id+'\')" id="updateName">生成图片</button>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');
    sObject = document.getElementById("svgObject");
    sObject.addEventListener("load",function() {
        svgg = sObject.getSVGDocument();
    })
}


var createIcon = function(id){
    var effectVal = $('#effect').val();
    if(effectVal ==0 ){
        alert('不能生成图片');
        return;
    }
    if( $('#backgroundSelect') && $('#backgroundSelect').val() ==-1){
        alert('不能生成图片');
        return;
    }
    if( $('#templateSelect') && $('#templateSelect').val() == -1){
        alert('不能生成图片');
        return;
    }

    var svghtml = svgg.documentElement.innerHTML;
    var resultsvghtml = '<svg xmlns="http://www.w3.org/2000/svg" height="320.0" version="1.1" width="320.0" xmlns:xlink="http://www.w3.org/1999/xlink">'+svghtml+'</svg>';
    var obj = {
        id:id,
        svgStr:resultsvghtml
    }
    $.danmuAjax('/v1/api/admin/resource/createIcon', 'POST','json',obj, function (data) {
        if (data.result == 200) {
            console.log(data);
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            alert('更新成功')
        }else{
            alert('更新失败')
        }
    }, function (data) {
        console.log(data);
    });

}


var changeEffect = function(){
    var effectVal = $('#effect').val();
    $('#svgDiv').html('<embed id="svgObject" src="'+_svgUrl+'" type="image/svg+xml"/>');
    sObject = document.getElementById("svgObject");
    sObject.addEventListener("load",function() {
        svgg = sObject.getSVGDocument();
    })
    if( effectVal == 1){
        templateList();
    }else if( effectVal == 2){
        backgroundImage();
    }else if(effectVal == 0){
        $('#otherDiv').html('');
    }


}

var radialGradient = function(){
    var gobject = svgg.querySelectorAll("g");
    var defs = svgg.querySelector("defs");
    var rect = svgg.querySelector("rect");
    for( var q=0;q<gobject.length;q++) {
        gobject[q].setAttribute("fill", "white");
    }
    var rg = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
    rg.setAttribute("id","grad1");
    rg.setAttribute("cx","50%");
    rg.setAttribute("cv","50%");
    rg.setAttribute("r","50%");
    rg.setAttribute("fx","50%");
    rg.setAttribute("fy","20%");
    var stop0 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop0.setAttribute("offset","0%");
    stop0.setAttribute("style","stop-color:rgb(148,92,217);stop-opacity:1");
    rg.appendChild(stop0);
    var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset","50%");
    stop1.setAttribute("style","stop-color:rgb(230,115,196);stop-opacity:1");
    rg.appendChild(stop1);
    var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset","100%");
    stop2.setAttribute("style","stop-color:rgb(254,234,147);stop-opacity:1");
    rg.appendChild(stop2);
    defs.appendChild(rg);
    //defs.innerHTML = "";
    rect.setAttribute("fill","url(#grad1)");
}

var backgroundImage = function(){
    $.danmuAjax('/v1/api/admin/background/list', 'GET','json',null, function (data) {
        if(data.result == 200) {
            if(data.data ){
                var htmlStr = '<select id="backgroundSelect" onchange="backgroundSelectFun()">';
                htmlStr += '<option value="-1">无背景图</option>';
                for(var i=0;i<data.data.length;i++){
                    htmlStr += '<option value="'+data.data[i].imageUrl+'">'+data.data[i].name+'</option>';
                }
                htmlStr += '</select><span id="randomDiv"></span>';
                $('#otherDiv').html(htmlStr);
            }
        }
    }, function (data) {
        console.log(data);
    });

}


var backgroundSelectFun = function() {
    var svggTemp = null;
    var bgIndex = $('#backgroundSelect').val();
    if( bgIndex == -1){
        $('#svgDiv').html('<embed id="svgObject" src="'+_svgUrl+'" type="image/svg+xml"/>');
        sObject = document.getElementById("svgObject");
        sObject.addEventListener("load",function() {
            svgg = sObject.getSVGDocument();
        })
        $('#randomDiv').html('');
    }else{
        $('#randomDiv').html('<button type="button" class="btn btn-primary" onclick="randomFun()">随机</button>');
        svggTemp = svgg;
        svggTemp.documentElement.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
        var imageUrl = $('#backgroundSelect').val();
        if (imageUrl != 0) {
            var gobject = svggTemp.querySelectorAll("g");
            var defs = svggTemp.querySelector("defs");
            if(svggTemp.querySelector("rect")){
                svggTemp.querySelector("rect").remove();
            }
            if(svggTemp.querySelector("image")){
                svggTemp.querySelector("image").remove();
            }
            //rect.setAttribute("fill-opacity","0.3");
            for( var q=0;q<gobject.length;q++) {
                gobject[q].setAttribute("fill", "white");
                var num=Math.floor(Math.random()*10+1);
                if( num <2){
                    gobject[q].setAttribute("fill-opacity", "0.3");
                }

            }
            var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
            image.setAttribute("xlink:href", _baseImageBgUrl+'/'+imageUrl);
            image.setAttribute("width", "100%");
            image.setAttribute("height", "100%");
            svggTemp.documentElement.insertBefore(image,defs);
            var html = '<svg xmlns="http://www.w3.org/2000/svg" height="320.0" version="1.1" width="320.0" xmlns:xlink="http://www.w3.org/1999/xlink">';
            $('#svgDiv').html(html+svggTemp.documentElement.innerHTML+'</svg>');
        }
    }

}

var randomFun = function(){
    $('#svgDiv').html('<embed id="svgObject" src="'+_svgUrl+'" type="image/svg+xml"/>');
    sObject = document.getElementById("svgObject");
    sObject.addEventListener("load",function() {
        svgg = sObject.getSVGDocument();
        svgg.documentElement.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
        var imageUrl = $('#backgroundSelect').val();
        if (imageUrl != 0) {
            var gobject = svgg.querySelectorAll("g");
            var defs = svgg.querySelector("defs");
            if(svgg.querySelector("rect")){
                svgg.querySelector("rect").remove();
            }
            if(svgg.querySelector("image")){
                svgg.querySelector("image").remove();
            }
            //rect.setAttribute("fill-opacity","0.3");
            for( var q=0;q<gobject.length;q++) {
                gobject[q].setAttribute("fill", "white");
                var num=Math.floor(Math.random()*10+1);
                if( num <2){
                    gobject[q].setAttribute("fill-opacity", "0.3");
                }

            }
            var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
            image.setAttribute("xlink:href", _baseImageBgUrl+'/'+imageUrl);
            image.setAttribute("width", "100%");
            image.setAttribute("height", "100%");
            svgg.documentElement.insertBefore(image,defs);
            var html = '<svg xmlns="http://www.w3.org/2000/svg" height="320.0" version="1.1" width="320.0" xmlns:xlink="http://www.w3.org/1999/xlink">';
            $('#svgDiv').html(html+svgg.documentElement.innerHTML+'</svg>');
        }
    })
}

var templates = new Array()
var templateList = function(){
    $.danmuAjax('/v1/api/admin/template/list', 'GET','json',null, function (data) {
        if(data.result == 200) {
            if(data.data ){
                var htmlStr = '<select id="templateSelect" onchange="changeTemplate()">';
                htmlStr += '<option value="-1">无模版</option>';
                for(var i=0;i<data.data.length;i++){
                    htmlStr += '<option value="'+i+'">'+data.data[i].name+'</option>';
                    templates[i] = data.data[i].content;
                }
                htmlStr += '</select>';

                $('#otherDiv').html(htmlStr);
            }
        }
    }, function (data) {
        console.log(data);
    });

}

var changeTemplate = function(){
    var gobject = svgg.querySelectorAll("g");
    var defs = svgg.querySelector("defs");
    var rect = svgg.querySelector("rect");
    var templateIndex = $('#templateSelect').val();
    if( templateIndex == -1){
        $('#svgDiv').html('<embed id="svgObject" src="'+_svgUrl+'" type="image/svg+xml"/>');
        sObject = document.getElementById("svgObject");
        sObject.addEventListener("load",function() {
            svgg = sObject.getSVGDocument();
        })
    }else{
        for( var q=0;q<gobject.length;q++) {
            gobject[q].setAttribute("fill", "white");
        }
        defs.innerHTML = templates[templateIndex];
        rect.setAttribute("fill","url(#grad1)");
    }
}

initAllTag();
