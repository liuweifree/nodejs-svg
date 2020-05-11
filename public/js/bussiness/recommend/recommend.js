var tableUrl = '/v1/api/admin/recommendlist/page';
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

var columnsArray = [
    {
        title: 'ID',
        align: 'center',
        field: 'id'
    },
    {
        title: '名称',
        align: 'center',
        field: 'name'
    },
    {
        title: '类型',
        align: 'center',
        field: 'type',
        formatter: function (value, row, index) {
            if(row.type==0){
                return '推荐列表';
            }else if(row.type==1){
                return '每日列表';
            }
        }
    },
    {
        title: '生效时间',
        align: 'center',
        field: 'effectiveTime',
        formatter: function (value, row, index) {
            return new Date(parseInt(row.effectiveTime)).format('yyyy-MM-dd');
        }
    },
    {
        title: '创建时间',
        align: 'center',
        field: 'createTime',
        formatter: function (value, row, index) {
            return new Date(parseInt(row.createTime)).format('yyyy-MM-dd hh:mm:ss');
        }
    },
    {
        field: '', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var btn = '<a class="btn" onclick="openUpdateRecommend(\''+row.id+'\')">修改</a>';
            if( row.status == 0){
                btn += '<a class="btn" onclick="updateStatus(\''+row.id+'\',1)">启用</a>';
            }else{
                btn += '<a class="btn" onclick="updateStatus(\''+row.id+'\',0)">停用</a>';
            }
            btn += '<a class="btn" target="_blank" href="/recommendData?id='+row.id+'&name='+row.name+'">编辑数据</a>';
            btn += '<a class="btn" onclick="delRecommend(\''+row.id+'\',\''+row.name+'\')">删除</a>';
            return btn;
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageNumber:1,
    pageSize:20
};


//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);

var openAddRecommend = function(){
    $('#myModalLabel').html('新建列表');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div id="createRecommend" class="control-group" style="margin-top: 18px;">'+
        '<label class="control-label" style="width:65px">名称</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="name" maxlength="20" /></div><br>'+
        '<label class="control-label" style="width:65px">类型</label><div class="controls" style="margin-left:80px;">'+
        '<select id="recommendType" onchange="changeRecommendType()"><option value="0">推荐列表</option><option value="1">每日列表</option></select></div><br>'+
        '<label class="control-label" style="width:65px">生效时间</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="effectiveTime" maxlength="20" placeholder="2020-04-29" /></div><br>'+
        '<label id="newUserlabel" class="control-label" style="width:65px">新老用户</label><div id="newUserdiv" class="controls" style="margin-left:80px;">'+
        '<select id="newUser"><option value="0">新用户</option><option value="1">老用户</option></select></div>';

    htmlStr += '</div></div></form>';
    $('#modalBody').html(htmlStr);
    var footerHtml = '<button class="btn btn-primary" onclick="addRecommend()">保存</button>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');
}

var changeRecommendType = function(){
    var recommendType = $('#recommendType').val();

    if(recommendType == 1){
       // var html = $('#createRecommend').html();
        $('#newUserlabel').remove();
        $('#newUserdiv').remove();
        var html = '<label id="intervallabel" class="control-label" style="width:65px">每日间隔</label><div id="intervaldiv" class="controls" style="margin-left:80px;">'+
            '<input type="text" class="span4" id="intervalTime" maxlength="20" placeholder="秒数" /></div>';
        $('#createRecommend').append(html);
    }else if( recommendType == 0){
        $('#intervallabel').remove();
        $('#intervaldiv').remove();
        var html = '<label id="newUserlabel" class="control-label" style="width:65px">新老用户</label><div id="newUserdiv" class="controls" style="margin-left:80px;">'+
            '<select id="newUser"><option value="0">新用户</option><option value="1">老用户</option></select></div>';
        $('#createRecommend').append(html);

    }
}



var addRecommend = function(){

    if( '' == $("#name").val() ){
        alert("名称不能为空");
        return;
    }
    if( '' == $('#effectiveTime').val()){
        alert("生效时间不能为空");
        return;
    }
    var recommendType = $('#recommendType').val();
    if( recommendType == 1){
        if( '' == $('#intervalTime').val()){
            alert("每日间隔时间不能为空");
            return;
        }
    }
    var dateTime;
    if($('#effectiveTime')){
        var date = new Date($('#effectiveTime').val()+' 00:00:00');
        dateTime = date.getTime();
    }
    var obj= {
        name:$("#name").val(),
        effectiveTime:dateTime,
        intervalTime:$('#intervalTime').val(),
        type:recommendType,
        newUser:$('#newUser').val()
    }

    $.danmuAjax('/v1/api/admin/recommendlist/save', 'POST','json',obj, function (data) {
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

var delRecommend = function(id,name){
    if (confirm('确认要删除这个“' + name + '”吗？')) {
        $.danmuAjax('/v1/api/admin/recommendlist/del?id='+id, 'GET','json',null, function (data) {
            if (data.result == 200) {
                console.log(data);
                $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            }else{
                alert('删除失败')
            }
        }, function (data) {
            console.log(data);
        });
    }
}

var updateStatus = function(id,status){
    var obj= {
        id:id,
        status:status
    }

    $.danmuAjax('/v1/api/admin/recommendlist/update', 'POST','json',obj, function (data) {
        if( data.result == 200){
            $('#myModal').modal('hide');
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
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

var openUpdateRecommend = function(id){
    var obj={
        id:id
    }
    $.danmuAjax('/v1/api/admin/recommendlist/get', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            $('#myModalLabel').html('修改列表');
            var htmlStr = '<form id="edit-profile" class="form-horizontal"><div id="createRecommend" class="control-group" style="margin-top: 18px;">'+
                '<label class="control-label" style="width:65px">名称</label><div class="controls" style="margin-left:80px;">'+
                '<input type="text" class="span4" id="name" maxlength="20" value="'+data.data.name+'"/></div><br>'+
                '<label class="control-label" style="width:65px">类型</label><div class="controls" style="margin-left:80px;">';
                var typeSelect = '<select id="recommendType" onchange="changeRecommendType()">';
                if( data.data.type==0){
                    typeSelect += '<option value="0" selected>推荐列表</option><option value="1">每日列表</option>';
                }else if( data.data.type == 1){
                    typeSelect +='<option value="0">推荐列表</option><option value="1" selected>每日列表</option>';
                }
                typeSelect += '</select></div><br>';
            htmlStr += typeSelect;
            var date = new Date(parseInt(data.data.effectiveTime)).format('yyyy-MM-dd')
            htmlStr += '<label class="control-label" style="width:65px">生效时间</label><div class="controls" style="margin-left:80px;">'+
            '<input type="text" class="span4" id="effectiveTime" maxlength="20" value="'+date+'" /></div><br>';
            if(data.data.type == 1 ){
                htmlStr += '<label id="intervallabel" class="control-label" style="width:65px">每日间隔</label><div id="intervaldiv" class="controls" style="margin-left:80px;">'+
                '<input type="text" class="span4" id="intervalTime" maxlength="20" placeholder="秒数" value="'+data.data.intervalTime+'"/></div><br>';
            }else{
                htmlStr += '<label id="newUserlabel" class="control-label" style="width:65px">新老用户</label><div id="newUserdiv" class="controls" style="margin-left:80px;">'+
                    '<select id="newUser">' ;
                if( null == data.data.newUser || data.data.newUser == 0){
                    htmlStr += '<option value="0" selected>新用户</option><option value="1">老用户</option>';
                }else{
                    htmlStr += '<option value="0">新用户</option><option value="1" selected>老用户</option>';
                }
                htmlStr +=  '</select></div>';
            }
            htmlStr += '</div></div></form>';
            $('#modalBody').html(htmlStr);
            var footerHtml = '<button class="btn btn-primary" onclick="updateRecommend(\''+id+'\')">修改</button>';
            $('#modalFooter').html(footerHtml);
            $('#myModal').modal('show');
        }else{
            alert('查询失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var updateRecommend = function(id){
    if( '' == $("#name").val() ){
        alert("名称不能为空");
        return;
    }
    if( '' == $('#effectiveTime').val()){
        alert("生效时间不能为空");
        return;
    }
    var recommendType = $('#recommendType').val();
    if( recommendType == 1){
        if( '' == $('#intervalTime').val()){
            alert("每日间隔时间不能为空");
            return;
        }
    }
    var dateTime;
    if($('#effectiveTime')){
        var date = new Date($('#effectiveTime').val()+' 00:00:00');
        dateTime = date.getTime();
    }


    var obj= {
        id:id,
        name:$("#name").val(),
        effectiveTime:dateTime,
        intervalTime:$('#intervalTime').val(),
        type:recommendType,
        newUser:$('#newUser').val()
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
