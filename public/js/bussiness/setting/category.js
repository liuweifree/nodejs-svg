var tableUrl = '/v1/api/admin/tag/page';
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
        title: '标签名称',
        align: 'center',
        width:'30%',
        formatter: function (value, row) {
            if(null != row && null != row.tagMap){
                return row.tagMap.zh_CN;
            }else{
                return "";
            }
        }
    },
    {
        title: '程序标记',
        align: 'center',
        field: 'keyValue'
    },
    {
        title: '排序',
        align: 'center',
        field: 'sort'
    },
    {
        title: '创建时间',
        align: 'center',
        field: 'createTime',
        formatter: function (value, row) {
            if( null != row.createTime){
                return new Date(parseInt(row.createTime)).format('yyyy-MM-dd hh:mm:ss');
            }else{
                return "";
            }

        }
    },
    {
        field: '', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var btn;
            if(row.status==0){
                btn = '<a class="btn" onclick="updateTagStatus(\''+row.id+'\',1)">开启</a>';
            }else if(row.status==1){
                btn = '<a class="btn" onclick="updateTagStatus(\''+row.id+'\',0)">停用</a>';
            }
            return  '<a class="btn" onclick="openUpdateTag(\''+row.id+'\')">修改</a>'+btn+
            '<a class="btn" onclick="delCategory(\''+row.id+'\',\''+row.tagMap.zh_CN+'\')">删除</a>';
        },
        events: 'operateEvents'
    }

];
var quaryObject = {
    type:1,
    pageSize:20
};

var openPay = function(){
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);


var openAddCategory = function(){
    $('#myModalLabel').html('新建分类');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
        '<label class="control-label" style="width:65px">分类名称</label><div class="controls" style="margin-left:80px;">'+
        '中文：<input type="text" class="span4" id="zh-CN" maxlength="20" /><br>英文：<input type="text" class="span4" id="en-US" maxlength="20" /><br></div><br>'+
        '<label class="control-label" style="width:65px">程序标记</label><div class="controls" style="margin-left:60px;">'+
        '<input type="text" class="span4" id="keyValue"  maxlength="30" placeholder="给IOS使用,例如动物，c1"></div><br>'+
        '<label class="control-label" style="width:65px">排序</label><div class="controls" style="margin-left:60px;">'+
        '<input type="text" class="span4" id="sort"  maxlength="30" ></div><br>';
    htmlStr += '</div></div></form>';
    $('#modalBody').html(htmlStr);
    var footerHtml = '<button class="btn btn-primary" onclick="addCategory()" id="addVersion">保存</button>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');
}

var addCategory = function(){


    if( '' == $("#zh-CN").val() || '' == $("#en-US").val()){
        alert("分类名称不能为空");
        return;
    }
    if( '' ==  $("#keyValue").val()){
        alert("程序标记不能为空");
        return;
    }
    var tagMap = {
        zh_CN:$("#zh-CN").val(),
        en_US:$("#en-US").val()
    }
    var keyValue = $("#keyValue").val();
    var obj= {
        tagMap:tagMap,
        type:1,
        keyValue:keyValue,
        sort:$("#sort").val()
    }

    $.danmuAjax('/v1/api/admin/tag/save', 'POST','json',obj, function (data) {
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

var delCategory = function(id,category){
    if (confirm('确认要删除这个分类“' + category + '”吗？')) {
        $.danmuAjax('/v1/api/admin/tag/del?id='+id, 'GET','json',null, function (data) {
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

var openUpdateTag = function(id){
    var obj={
        id:id
    }
    $.danmuAjax('/v1/api/admin/tag/get', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            $('#myModalLabel').html('修改分类');
            var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
                '<label class="control-label" style="width:65px">分类名称</label><div class="controls" style="margin-left:80px;">'+
                '中文：<input type="text" class="span4" id="zh-CN" maxlength="20" value="'+data.data.tagMap.zh_CN+'" /><br>英文：<input type="text" class="span4" id="en-US" maxlength="20" value="'+data.data.tagMap.en_US+'"/><br></div><br>'+
                '<label class="control-label" style="width:65px">程序标记</label><div class="controls" style="margin-left:60px;">'+
                '<input type="text" class="span4" id="keyValue"  maxlength="30" placeholder="给IOS使用,例如动物，c1" value="'+data.data.keyValue+'" disabled></div><br>'+
                '<label class="control-label" style="width:65px">排序</label><div class="controls" style="margin-left:60px;">'+
                '<input type="text" class="span4" id="sort"  maxlength="30" value="'+data.data.sort+'"></div><br>';
            htmlStr += '</div></div></form>';
            $('#modalBody').html(htmlStr);
            var footerHtml = '<button class="btn btn-primary" onclick="updateTag(\''+id+'\')" >保存</button>';
            $('#modalFooter').html(footerHtml);
            $('#myModal').modal('show');
        }else{
            alert('查询失败');
        }
    }, function (data) {
        console.log(data);
    });

}

var updateTag = function(id){

    if( '' == $("#zh-CN").val() || '' == $("#en-US").val()){
        alert("分类名称不能为空");
        return;
    }
    var tagMap = {
        zh_CN:$("#zh-CN").val(),
        en_US:$("#en-US").val()
    }
    var keyValue = $("#keyValue").val();
    var obj= {
        id:id,
        tagMap:tagMap,
        type:2,
        color: $("#color").val(),
        sort:$("#sort").val()
    }

    $.danmuAjax('/v1/api/admin/tag/update', 'POST','json',obj, function (data) {
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

var updateTagStatus = function(id,status){

    var obj= {
        id:id,
        status:status
    }

    $.danmuAjax('/v1/api/admin/tag/update', 'POST','json',obj, function (data) {
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
