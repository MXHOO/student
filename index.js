var user = {};
var name = "";
//获取list数据
function getData() {
    var content = user;
    var userid = JSON.stringify(content);
    $.ajax({
        data: userid,
        url: "http://119.3.250.28:9002/searchall",
        type: "POST",
        success: function (data) {
            var list = JSON.parse(data);
            var html = ""
            for (var i = 0; i < list.length; i++) {
                html += "<div class='content col-xs-12'>" + list[i].data + "  " + list[i].info + "</div>";
            }
            $("#list").html(html);
        },
        error: function (err) {
            console.log("发生错误");
            console.log(err);
        }
    })
}
//获取userid
function getUserId() {
    var userid = {};
    var content = JSON.stringify({});
    $.ajax({
        data: content,
        url: "http://119.3.250.28:9002/getuserid",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        success: function (data) {
            userid = JSON.parse(data);
            user = userid;
        },
        error: function (err) {
            console.log(err);
        }
    })
}
$("#btn_list").click(function () {
    $("#title").html("报表")
    $("#img_video").attr("src", "./assets/video.svg");
    $("#img_list").attr("src", "./assets/active_list.svg");
    $("#video").hide();
    $("#btn").hide();
    $("#list").show();
    $("#fresh").show();
    // getData();
})
$("#btn_video").click(function () {
    $("#title").html("直播")
    $("#img_video").attr("src", "./assets/active_video.svg");
    $("#img_list").attr("src", "./assets/list.svg");
    $("#video").show();
    $("#btn").show();
    $("#fresh").hide();
    $("#list").hide();
})
$("#fresh").click(function(){
    getData();
})
window.onload = function () {
    // $("#list").hide();
    CHAT.init();
}
window.CHAT = {
    socket: null,
    init: function () {
        if (window.WebSocket) {
            CHAT.socket = new WebSocket(" ws://119.3.250.28:9002/user/main");
            CHAT.socket.onopen = function () {
                console.log("连接建立成功！")
                var w = {};
                w.type = 'user';
                w.url = 'main';
                var info = {};
                info.o = '1';
                w.info = info;
                var send_content = JSON.stringify(w);
                CHAT.socket.send(send_content);
            }
            CHAT.socket.onclose = function () {
                console.log("连接关闭...");
            }
            CHAT.socket.onerror = function () {
                console.log("发生错误...");
            }
            CHAT.socket.onmessage = function (e) {
                console.log("接收到数据" + e);
                url = "/userClickService/click";
                $("#fast").click(function () {
                    var f_type = "fast"
                    var f_info = "讲课速度稍快";
                    chat(url, user, f_info, f_type, "name");
                })
                $("#normal").click(function () {
                    var n_type = "normal";
                    var n_info = "讲课速度正常";
                    chat(url, user, n_info, n_type, name);
                })
                $("#slow").click(function () {
                    var s_type = "short"
                    var s_info = "讲课速度稍慢";
                    CHAT.chat(url, user, s_info, s_type, name);
                })
            }
        }
    },
    chat: function (url_s, userid_s, info_s, type_s, name_s) {//发送方法
        var w = {
            url: url_s,
            data: {
                userid: userid_s,
                info: info_s,
                type: type_s,
                name: name_s
            }
        };
        var send_content = JSON.stringify(w);
        CHAT.socket.send(send_content);//发送
    }
}
