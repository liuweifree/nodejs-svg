var tableUrl = '/v1/api/admin/background/page';
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
        title: '图片',
        align: 'center',
        width:'15%',
        formatter: function (value, row, index) {
            if(null != row && null != row.imageUrl){
                return '<img width="50%" src="'+_baseImageBgUrl+row.imageUrl+'" />';
            }else{
                return "";
            }
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
            return '<a class="btn" onclick="delBackground(\''+row.id+'\',\''+row.name+'\')">删除</a>';
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

var openAddBackground = function(){
    $('#myModalLabel').html('新建背景图');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
        '<label class="control-label" style="width:65px">名称</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="name" maxlength="20" /></div><br>'+
        '<label class="control-label" style="width:65px">图片</label><div class="controls" style="margin-left:80px;">'+
        '<input type="file"  id="photo" value="" /><button type="button" class="btn btn-primary" onclick="uploadFile()">上传</button></div><br>';

    htmlStr += '</div></div></form>';
    $('#modalBody').html(htmlStr);
    var footerHtml = '<button class="btn btn-primary" onclick="addBackground()">保存</button>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');
}


var fileUrl = "";

var uploadFile = function(){
    var formData = new FormData();
    formData.append("Filedata",$("#photo")[0].files[0]);
    $.ajax({
        url:'/v1/api/admin/background/upload', /*接口域名地址*/
        type:'post',
        data: formData,
        contentType: false,
        processData: false,
        success:function(res){
            console.log(res);
            var resJson = $.parseJSON( res )
            if(resJson.result==200){
                alert('上传成功');
                fileUrl = resJson.data;
            }else{
                alert('上传失败');
            }
        }
    });
}

var addBackground = function(){

    if( '' == $("#name").val() ){
        alert("名称不能为空");
        return;
    }
    if( '' == fileUrl){
        alert("图片不能为空");
        return;
    }
    var obj= {
        name:$("#name").val(),
        imageUrl:fileUrl
    }

    $.danmuAjax('/v1/api/admin/background/save', 'POST','json',obj, function (data) {
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

var delBackground = function(id,name){
    if (confirm('确认要删除这个“' + name + '”吗？')) {
        $.danmuAjax('/v1/api/admin/background/del?id='+id, 'GET','json',null, function (data) {
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