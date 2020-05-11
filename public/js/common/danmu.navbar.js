var drawNavbar = function(){
    var htmlStr = '<li><a href="/resource"><i class="icon-gamepad"></i><span>资源管理</span> </a> </li>';
        htmlStr += '<li><a href="/recommend"><i class="icon-list-alt"></i><span>列表管理</span> </a> </li>';
        htmlStr += '<li><a href="/activity"><i class="icon-camera"></i><span>活动和banner</span> </a> </li>';
        htmlStr +=  '<li><a href="/adminmanager"><i class="icon-bold"></i><span>管理员管理</span></a></li>';
        htmlStr +=  '<li><a href="/background"><i class="icon-bold"></i><span>背景图管理</span></a></li>';
        htmlStr +=  '<li><a href="/template"><i class="icon-bold"></i><span>模版管理</span></a></li>';
        htmlStr += '<li><a href="/order"><i class="icon-font"></i><span>支付管理</span> </a> </li>';
        htmlStr += '<li><a href="/user"><i class="icon-user"></i><span>用户管理</span> </a></li>';
        htmlStr += '<li class="dropdown"><a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> <i class="icon-long-arrow-down"></i><span>配置管理</span> <b class="caret"></b></a>';
        htmlStr += '<ul class="dropdown-menu">';
        htmlStr +=  '<li><a href="/setting/tag">标签管理</a></li>';
        htmlStr += '<li><a href="/setting/category">分类管理</a></li>';
        htmlStr += '<li><a href="/setting/ad">广告位管理</a></li>';
        htmlStr += '<li><a href="/setting/switch">开关管理</a></li>';
        htmlStr += '<li><a href="/setting/product">产品折扣管理</a></li>';
        htmlStr +=  '</ul></li>';

        $('.mainnav').html(htmlStr);

}

