//变量声明
var count = 0;
var ajaxcount = 0;
var listnumber = 0;

function none() {
    //傻逼遮罩层
    let i = 3;
    let sbtn=$("<button id='skip'>Skip</button>");
    sbtn.appendTo("#MyDiv");
    $("#skip").click(function(){
        document.getElementById("fade").style.display = "none";
        document.getElementById("MyDiv").style.display = "none";
    });
   
}

function initButton() {
    // 避免在首页初始化按钮的时候始终初始化失败造成死循环
    if ($("#navTab > div.navTab-panel.tabsPageContent.layoutBox > div:nth-child(2) > div > div > div:nth-child(1)").html() !== null) {
        // 如果抢课按钮还没有被初始化，执行初始化进程
        if ($("#fuck-jwc").attr("exist") !== "exist") {

            // 初始化抢课按钮
            var btn = $("<li><a class='add' id='fuck-jwc' exist='exist' target='ajax'><span>我选好课了，开始一键抢课</span></a></li>");
            btn.appendTo("#jbsxBox > div:nth-child(3) > div.j-resizeGrid.panelContent > div:nth-child(1) > ul");

            // 添加按钮样式
            btn.hover(function () {
                $(this).addClass("hover");
            }, function () {
                $(this).removeClass("hover");
            });

            // 绑定按钮点击事件
            btn.click(function () {
                fuckJWC();
            });

        }
    }
}

function fuckJWC() { //干傻逼教务处
    //注册正则表达式
    var infoRegExp = /[a-zA-Z0-9\-\.]{4,32}/g;
    var info = $("#jbsxBox > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > ul > li:nth-child(1) > a").attr("href").match(infoRegExp);
    console.log(info);
    var url = info[0];
    //如果没有选择课程
    if ($("tr.selected").attr("rel") === undefined) {
        alert("请选择课程");
    } else {
        var postdata = {
            "xnxq": info[2],
            "kcdm": info[4],
            "jxjhh": info[6],
            "addid": $("tr.selected").attr("rel"),
            "keyindo": info[10],
            "-": parseInt(new Date().getTime() / 1000),
        }
        var coursename = $("tr.selected > td:nth-child(2) > div:nth-child(1) > a").attr("title");
        //console.log(coursename);
        //console.log(postdata);
        //HERE WE GO
        sendData(url, postdata, coursename);
    }

}
none();
setInterval(function () {
    console.log("第" + count++ + "次尝试注入工具栏");
    initButton();
}, 1000)

function sendData(obj, post, name) {
    var Interval = setInterval(function () {
        console.log(obj);
        ajaxcount++;
        //发送请求
        $.ajax({
            type: "POST",
            url: "/Course/" + obj,
            data: post,
            dataType: "json",
            success: function (data) {
                //statucode:200 成功
                //300 失败
                //301 傻逼土豆服务器又挂了
                console.log(data);
                if (data["statusCode"] === "300") {
                    console.log(name + "选课失败 因为" + data["message"]);
                } else if (data["statusCode"] === "301") {
                    console.log(name + "选课失败 因为" + data["message"]);
                    console.log("建议刷新后重试");
                }

            },
            error: function (data) { //教务处回调不规范or涉及跨域
                alert("恭喜，" + name + "抢课成功!Donate me plz!");
                clearInterval(Interval);
            }
        })
    }, 1000)
}