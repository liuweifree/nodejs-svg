var tableUrl = '/v1/api/admin/activity/page';


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
        title: '图片',
        align: 'center',
        width:'30%',
        formatter: function (value, row) {
            if(null != row && null != row.imgUrl){
                return '<img width="50%" src="'+_baseImageUrl+'/'+row.imgUrl+'" />';
            }else{
                return "";
            }
        }
    },
    {
        title: '标题',
        align: 'center',
        field: 'title'
    },
    {
        title: '描述',
        align: 'center',
        field: 'desc'
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
                btn = '<a class="btn" onclick="updateActivityStatus(\''+row.id+'\',1)">上线</a>';
            }else if(row.status==1){
                btn = '<a class="btn" onclick="updateActivityStatus(\''+row.id+'\',0)">下线</a>';
            }
            return  '<a class="btn" onclick="openUpdateActivity(\''+row.id+'\')">修改</a>'+btn+
                '<a class="btn" onclick="delActivity(\''+row.id+'\',\''+row.title+'\')">删除</a>';
        },
        events: 'operateEvents'
    }

];
var quaryObject = {
    pageSize:20
};


//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);


var openAddActivity = function(){
    $('#myModalLabel').html('新建活动或banner');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
        '<label class="control-label" style="width:65px">标题</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="title" maxlength="20" /></div><br>'+
        '<label class="control-label" style="width:65px">描述</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="desc"  maxlength="100" ></div><br>'+
        '<label class="control-label" style="width:65px">排序</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="sort"  maxlength="30" ></div><br>'+
        '<label class="control-label" style="width:65px">deeplink</label><div class="controls" style="margin-left:80px;">'+
        '<input type="text" class="span4" id="protocol"   ></div><br>'+
        '<label class="control-label" style="width:65px">类型</label><div class="controls" style="margin-left:80px;">'+
        '<select id="type"><option value="0">banner</option><option value="1">活动</option></select></div><br>'+
        '<label class="control-label" style="width:65px">图片</label><div class="controls" style="margin-left:80px;">'+
        '<input type="file"  id="photo" value="" /><button type="button" class="btn btn-primary" onclick="uploadFile()">上传</button></div><br>'+
        '<label class="control-label" style="width:65px">语言</label><div class="controls" style="margin-left:80px;">'+
        '<select id="language"><option value="zh_CN">中文</option><option value="en_US">英文</option></select></div><br>';
    htmlStr += '</div></div></form>';
    $('#modalBody').html(htmlStr);
    var footerHtml = '<button class="btn btn-primary" onclick="addActivity()" id="addActivity">保存</button>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');
}

var fileUrl = "";

var uploadFile = function(){
    var formData = new FormData();
    formData.append("Filedata",$("#photo")[0].files[0]);
    $.ajax({
        url:'/v1/api/admin/activity/upload', /*接口域名地址*/
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

var addActivity = function(){

    if( '' == $("#title").val() ){
        alert("标题不能为空");
        return;
    }
    if( '' ==  $("#desc").val()){
        alert("描述不能为空");
        return;
    }
    if( '' == fileUrl){
        alert("图片不能为空");
        return;
    }
    var obj= {
        title:$("#title").val(),
        desc:$("#desc").val(),
        sort:$("#sort").val(),
        type:$("#type").val(),
        language:$("#language").val(),
        imgUrl:fileUrl,
        protocol:$('#protocol').val()
    }

    $.danmuAjax('/v1/api/admin/activity/save', 'POST','json',obj, function (data) {
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

var delActivity = function(id,title){
    if (confirm('确认要删除这个“' + title + '”吗？')) {
        $.danmuAjax('/v1/api/admin/activity/del?id='+id, 'GET','json',null, function (data) {
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

var openUpdateActivity = function(id){
    var obj={
        id:id
    }
    $.danmuAjax('/v1/api/admin/activity/get', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            $('#myModalLabel').html('修改分类');
            var protocol = data.data.protocol;
            if( null == protocol){
                protocol='';
            }
            var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
                '<label class="control-label" style="width:65px">标题</label><div class="controls" style="margin-left:80px;">'+
                '<input type="text" class="span4" id="title" maxlength="20" value="'+data.data.title+'" /></div><br>'+
                '<label class="control-label" style="width:65px">描述</label><div class="controls" style="margin-left:80px;">'+
                '<input type="text" class="span4" id="desc"  maxlength="100" value="'+data.data.desc+'" /></div><br>'+
                '<label class="control-label" style="width:65px">排序</label><div class="controls" style="margin-left:80px;">'+
                '<input type="text" class="span4" id="sort"  maxlength="30"  value="'+data.data.sort+'"></div><br>'+
                '<label class="control-label" style="width:65px">deeplink</label><div class="controls" style="margin-left:80px;">'+
                '<input type="text" class="span4" id="protocol"  value="'+protocol+'" ></div><br>'+
                '<label class="control-label" style="width:65px">类型</label><div class="controls" style="margin-left:80px;">';
                var typeSelect = '<select id="type">';
                if( data.data.type == 0){
                    typeSelect += '<option value="0" selected>banner</option><option value="1">活动</option>';
                }else{
                    typeSelect += '<option value="0" >banner</option><option value="1" selected>活动</option>';
                }
                typeSelect += '</select></div><br>';
                htmlStr += typeSelect;

            htmlStr += '<label class="control-label" style="width:65px">图片</label><div class="controls" style="margin-left:80px;">'+
                '<div><img id= "imgShow" src="'+_baseImageUrl+'/'+data.data.imgUrl+'" width="30%"/></div>'+
                '<input type="file"  id="photo" value="123123123.jpg" /><button type="button" class="btn btn-primary" onclick="uploadFile()">上传</button></div><br>'+
                '<label class="control-label" style="width:65px">语言</label><div class="controls" style="margin-left:80px;">';

            var languageSelect ='<select id="language">';
            if( data.data.language == 'zh_CN'){
                languageSelect+= '<option value="zh_CN" selected>中文</option><option value="en_US">英文</option>';
            }else{
                languageSelect+= '<option value="zh_CN">中文</option><option value="en_US" selected>英文</option>';
            }
            languageSelect+= '</select></div><br>';
            htmlStr += languageSelect;
            htmlStr += '</div></div></form>';
            $('#modalBody').html(htmlStr);
            var footerHtml = '<button class="btn btn-primary" onclick="updateActivity(\''+id+'\')" id="addActivity">保存</button>';
            $('#modalFooter').html(footerHtml);
            $('#myModal').modal('show');
        }else{
            alert('查询失败');
        }
    }, function (data) {
        console.log(data);
    });

}

var updateActivity = function(id){

    if( '' == $("#title").val() ){
        alert("标题不能为空");
        return;
    }
    if( '' ==  $("#desc").val()){
        alert("描述不能为空");
        return;
    }
    var obj= {
        id:id,
        title:$("#title").val(),
        desc:$("#desc").val(),
        sort:$("#sort").val(),
        type:$("#type").val(),
        language:$("#language").val(),
        imgUrl:fileUrl,
        protocol:$("#protocol").val()
    }

    $.danmuAjax('/v1/api/admin/activity/update', 'POST','json',obj, function (data) {
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

var updateActivityStatus = function(id,status){

    var obj= {
        id:id,
        status:status
    }

    $.danmuAjax('/v1/api/admin/activity/update', 'POST','json',obj, function (data) {
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

var sortByType = function(){
    quaryObject.type =  $('#sortValue').val()
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}
