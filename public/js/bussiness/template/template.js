var tableUrl = '/v1/api/admin/template/page';
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
        title: '内容',
        align: 'center',
        field: 'content',
        formatter: function (value, row, index) {
            return row.content.replace(/</g,'&lt;');
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
            return '<a class="btn" onclick="delTemplate(\''+row.id+'\',\''+row.name+'\')">删除</a>';
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

var openAddTemplate = function(){
    $('#myModalLabel').html('新建模版');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
        '<label class="control-label" style="width:65px">名称</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="name" maxlength="20" /></div><br>'+
        '<label class="control-label" style="width:65px">内容</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="content" /></div><br>';

    htmlStr += '</div></div></form>';
    $('#modalBody').html(htmlStr);
    var footerHtml = '<button class="btn btn-primary" onclick="addTemplate()">保存</button>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');
}



var addTemplate = function(){

    if( '' == $("#name").val() ){
        alert("名称不能为空");
        return;
    }
    if( '' == $('#content').val()){
        alert("内容不能为空");
        return;
    }
    var obj= {
        name:$("#name").val(),
        content:$('#content').val()
    }

    $.danmuAjax('/v1/api/admin/template/save', 'POST','json',obj, function (data) {
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

var delTemplate = function(id,name){
    if (confirm('确认要删除这个“' + name + '”吗？')) {
        $.danmuAjax('/v1/api/admin/template/del?id='+id, 'GET','json',null, function (data) {
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