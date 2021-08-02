window.baidu = {};
var searchq = "";
baidu.sug = function(e) {
    var d = e.s;
    searchq = e.q;
    var a = $("#searchTips");
    a.empty();
    if (d.length > 0) {
        var c = "";
        for (var b = 0; b < d.length; b++) {
            c += '<div class="sa" hidefocus="ture" >' + d[b] + "</div>";
        }
        a.append(c);
        $(".sa").bind("click",
        function() {
            $("#baiduv").val($(this).text());
            $("#baiduform").trigger("submit");
        });
        $(".sa").bind("mouseenter",
        function() {
            $("div.ahover").removeClass("ahover");
            $(this).addClass("ahover");
        });
        $(".sa").bind("mouseleave",
        function() {
            $(this).removeClass("ahover");
        });
        a.show();
    } else {
        a.hide();
    }
};
window.googlesug = {};
googlesug.sug = function(e) {
    var d = e[1];
    searchq = e[0];
    var a = $("#searchTips");
    a.empty();
    if (d.length > 0) {
        var c = "";
        for (var b = 0; b < d.length; b++) {
            c += '<div class="sa"  hidefocus="ture" >' + d[b][0] + "</div>";
        }
        a.append(c);
        $(".sa").bind("click",
        function() {
            $("#googlev").val($(this).text());
            $("#googleform").trigger("submit");
        });
        $(".sa").bind("mouseenter",
        function() {
            $("div.ahover").removeClass("ahover");
            $(this).addClass("ahover");
        });
        $(".sa").bind("mouseleave",
        function() {
            $(this).removeClass("ahover");
        });
        a.show();
    } else {
        a.hide();
    }
};
var bingAppId = "40DAAD1B3D23153FC67B83DF5F5652A470266FDC";
function bingDetectCallback(b) {
    if (b == "") {
        $("#app_translate_result").html("翻译服务暂不可用，请重试");
        return;
    }
    if ($("#app_translate_text").val() != "") {
        var e = $("#app_translate_text").val();
        var a = (b == "en" ? "en": "zh-CHS");
        var d = (b == "zh-CHS" ? "en": "zh-CHS");
        var c = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=bingTranslateCallbak&appId=" + encodeURIComponent(bingAppId) + "&from=" + a + "&to=" + d + "&text=" + e;
        request(c);
    }
}
function bingTranslateCallbak(a) {
    if ($("#app_translate_text").val() != "") {
        $("#app_translate_result").html(a);
    } else {
        $("#app_translate_result").text("");
    }
}
function request(a) {
    var b = document.createElement("script");
    b.src = a;
    document.getElementsByTagName("head")[0].appendChild(b);
}
function bingTranslate(b) {
    var a = "http://api.microsofttranslator.com/V2/Ajax.svc/Detect?oncomplete=bingDetectCallback&appId=" + encodeURIComponent(bingAppId) + "&text=" + b;
    request(a);
}
var app_sort = "";
var delApp = "";
var weatherIntervalId = "";
var newsIntervalId = "";
var city;
var loadWeather = false;
var notesArray = new Array();
var groupsort = "";
var gArray = new Array();
var bookmarkArray = new Array();
var oldSort = "";
var updateBSrot = "";
var editGroupId = 0;
var delGroupId = 0;
var editBookmarkId = 0;
var oldBookmarkUrl = "";
var oldBookmarkName = "";
var oldGroupName = "";
var intervalTime_group = 2000;
var hasUpdate_group = false;
var intervalTime_bookmark = 1000;
var hasUpdate_bookmark = false;
var hasUpdate_bookmark_gid = new Array();
var addLabelBtnFlag = true;
var _groupsort;
var _groupArray = new Object();
var _bookmarkArray = new Object();
var _gCount = 0;
var _bCount = 0;
$(document).ready(function() {
    if ($.cookie("layout_type") == null) {
        $.cookie("layout_type", "1", {
            expires: 365,
            path: "/"
        });
    }
    if ($.cookie("layout_type") == "1") {
        $("#btn-define").addClass("define-cur");
        $("#gAddBtn").addClass("btn-s1");
        $("#gAddBtn").removeClass("hidden");
    } else {
        if ($.cookie("layout_type") == "2") {
            $("#btn-list").addClass("list-cur");
            $("#gAddBtn").addClass("btn-s1");
            $("#gAddBtn").removeClass("hidden");
        } else {
            if ($.cookie("layout_type") == "4") {
                $("#btn-time").addClass("time-cur");
                $("#gAddBtn").addClass("hidden");
                $("#gAddBtn").removeClass("btn-s1");
            } else {
                if ($.cookie("layout_type") == "3") {
                    $("#btn-hot").addClass("hot-cur");
                    $("#gAddBtn").addClass("hidden");
                    $("#gAddBtn").removeClass("btn-s1");
                }
            }
        }
    }
    if ($.cookie("show_app") == null) {
        $.cookie("show_app", "1", {
            expires: 365,
            path: "/"
        });
    }
    if ($.cookie("show_app") == "1") {
        $(".content")[0].id = "";
        $("#btn-show-app").addClass("show-app-cur");
    } else {
        $(".content")[0].id = "single";
        $("#btn-hide-app").addClass("hide-app-cur");
    }
    $(".svalue").focus(function() {
        $(".search-box").addClass("search-box-focus");
    });
    $(".svalue").focusout(function() {
        $(".search-box").removeClass("search-box-focus");
    });
    $(".svalue").focus();
    window.onbeforeunload = function() {
        if (hasUpdate_group) {
            A();
            alert("有未保存数据，正在更新，请稍等几秒再点击确定，谢谢！");
        }
        if (hasUpdate_bookmark) {
            k();
            alert("有未保存数据，正在更新，请稍等几秒再点击确定，谢谢！");
        }
    };
    function A() {
        if (hasUpdate_group) {
            if (_groupsort != oldSort) {
                oldSort = _groupsort;
                h(_groupsort);
            }
            hasUpdate_group = false;
        }
    }
    function k() {
        if (hasUpdate_bookmark) {
            if (updateBSrot != "") {
                d(updateBSrot);
                hasUpdate_bookmark_gid.length = 0;
                updateBSrot = "";
            }
            hasUpdate_bookmark = false;
        }
    }
    function h(Y) {
        $.ajax({
            type: "POST",
            url: $("#projpath").val()+"/other.do?opeaCode=EditModeSorts",
            dataType: "json",
            data: {
                sort: Y
            },
            success: function(Z, aa) {
                if (Z.r == -99) {
                    noSession();
                }
            },
            error: function(aa, ab, Z) {}
        });
    }
    function Q() {
        $(".column").sortable({
            connectWith: ".column",
            handle: "div.labelHead",
            placeholder: "placeHolder",
            update: function(Z, aa) {
                var Y = "";
                $(".labelLayout > li").each(function() {
                    Y += "|" + this.id;
                    $("#" + this.id + " > .labelBox").each(function() {
                        Y += "," + parseInt(this.id);
                    });
                });
                Y = Y.substr(1, Y.length);
                if (Y != oldSort) {
                    _groupsort = Y;
                }
                if (!hasUpdate_group) {
                    hasUpdate_group = true;
                    setTimeout(A, intervalTime_group);
                }
            }
        });
    }
    function e(Z, Y) {
        $.ajax({
            type: "POST",
            url: $("#projpath").val()+"/other.do?opeaCode=EditModeSorts",
            dataType: "json",
            data: {
                gid: Z,
                sort: Y
            },
            success: function(aa, ab) {
                if (aa.r == -99) {
                    noSession();
                }
            },
            error: function(ab, ac, aa) {}
        });
    }
    function d(Y) {
        $.ajax({
            type: "POST",
            url: $("#projpath").val()+"/other.do?opeaCode=EditSorts",
            dataType: "json",
            data: {
                sort: Y
            },
            success: function(Z, aa) {
                if (Z.r == -99) {
                    noSession();
                }
            },
            error: function(aa, ab, Z) {}
        });
    }
    function H() {
        $(".labelContent").sortable("destroy");
        $(".labelContent").sortable({
            placeholder: "selectLight",
            items: "li",
            cancel: "input,li>#editLabel,#addLabel",
            connectWith: ".labelContent",
            update: function(ac, ad) {
                var ab = 0;
                if (ad.sender == null) {
                    ab = ad.item.parent().parent()[0].id;
                } else {
                    ab = ad.sender.parent()[0].id;
                }
                if ($("#" + ab + "ul").find("li").length < 1) {
                    $("#" + ab + "ul").append('<li class="emptyli hidden"></li>');
                } else {
                    $("#" + ab + "ul").find(".emptyli").remove();
                }
                var aa = "";
                if (hasUpdate_bookmark_gid.length > 0) {
                    var Y = true;
                    Y = (jQuery.inArray(ab, hasUpdate_bookmark_gid) == -1);
                    if (Y) {
                        hasUpdate_bookmark_gid.push(ab);
                    }
                } else {
                    hasUpdate_bookmark_gid.push(ab);
                }
                for (var Z = 0; Z < hasUpdate_bookmark_gid.length; Z++) {
                    aa += parseInt(hasUpdate_bookmark_gid[Z]) + "|";
                    var ae = "";
                    $("#" + hasUpdate_bookmark_gid[Z] + " li.bitem").each(function() {
                        ae += parseInt(this.id) + ",";
                    });
                    ae = ae.substr(0, ae.length - 1);
                    aa += ae + "#";
                    _groupArray[parseInt(hasUpdate_bookmark_gid[Z])].sort = ae;
                }
                updateBSrot = aa.substr(0, aa.length - 1);
                if (!hasUpdate_bookmark) {
                    hasUpdate_bookmark = true;
                    window.setTimeout(k, intervalTime_bookmark);
                }
            }
        });
    }
    function O() {
        var Y = $(this);
        S();
        W();
        i();
        editBookmarkId = parseInt(Y[0].id);
        editGroupId = parseInt($("#" + editBookmarkId + "b").parent()[0].id);
        var aa = $("#editLabel");
        if (!aa.hasClass("hidden")) {
            aa.next().removeClass("hidden");
        }
        $("#" + editBookmarkId + "b").prepend(aa);
        var Z = $("#" + editBookmarkId + "a");
        oldBookmarkName = Z.text();
        oldBookmarkUrl = Z.attr("href");
        oldBookmarkMemo = _bookmarkArray[editBookmarkId].m;
        $("#labelName").val(oldBookmarkName).removeClass("watermarkClass");
        $("#labelValue").val(oldBookmarkUrl);
        if (oldBookmarkMemo != "") {
            $("#labelMemo").val(oldBookmarkMemo).removeClass("watermarkClass");
        } else {
            $("#labelMemo").val("备注(最多50个字符)");
            if (!$("#labelMemo").hasClass("watermarkClass")) {
                $("#labelMemo").addClass("watermarkClass");
            }
        }
        $("#" + editBookmarkId + "bl").addClass("hidden");
        aa.removeClass("hidden");
        $("#labelValue").trigger("focus");
    }
    function u() {
        var Y = $("#editLabel");
        if (!Y.hasClass("hidden")) {
            Y.next().removeClass("hidden");
            Y.addClass("hidden");
            $("#labelValueInput").removeClass("input-txt-error");
            $("#labelNameInput").removeClass("input-txt-error");
            $("#labelMemoInput").removeClass("input-txt-error");
            $("#editLabelErrorTips").hide();
            Y.parent().trigger("mouseout");
            $("body").append(Y);
            oldBookmarkName = "";
            oldBookmarkUrl = "";
            oldBookmarkMemo = "";
        }
    }
    function g() {
        var Y = $(this);
        S();
        u();
        i();
        editBookmarkId = 0;
        editGroupId = parseInt(Y[0].id);
        var Z = $("#addLabel");
        if (!Z.hasClass("hidden")) {
            $("#" + parseInt(Z.parent().parent()[0].id) + "ga").removeClass("hidden").show();
        }
        $("#" + editGroupId + "gul").append($("<li></li>").append(Z));
        $("#alabelName").watermark({
            text: "名称",
            type: "keypress"
        });
        $("#alabelValue").watermark({
            text: "http://",
            type: "keypress"
        });
        $("#alabelMemo").watermark({
            text: "备注(最多50个字符)",
            type: "keypress"
        });
        $("#" + editGroupId + "ga").addClass("hidden").hide();
        Z.removeClass("hidden");
        $("#alabelValue").trigger("focus");
        return false;
    }
    function s() {
        if (addLabelBtnFlag) {
            if (hasUpdate_group) {
                A();
            }
            if (hasUpdate_bookmark) {
                k();
            }
            var ab = $.trim($("#alabelValue").val());
            var Y = $.trim($("#alabelName").val());
            var ac = $.trim($("#alabelMemo").val());
            if ($("#alabelMemo").hasClass("watermarkClass") && ac == "备注(最多50个字符)") {
                ac = "";
            }
            if (ab != "" && (!$("#alabelValue").hasClass("watermarkClass")) && Y != "" && (!$("#alabelName").hasClass("watermarkClass"))) {
                var aa = "";
                var Z = "";
                var aa = checkUrl(ab);
                if (aa != "") {
                    aa = aa.toString().split("|");
                    Z = aa[0];
                    aa = aa[1];
                }
                if (aa != "") {
                    $("#addLabelBtn").addClass("btn-s1-disabled");
                    $("#addLabelClose").addClass("btn-s2-disabled");
                    $("#addLoading").removeClass("hidden");
                    addLabelBtnFlag = false;
                    $.ajax({
                        type: "POST",
                        timeout: 10000,
                        url: $("#projpath").val()+"/other.do?opeaCode=AddFav",
                        dataType: "json",
                        data: {
                            gid: editGroupId,
                            bid: editBookmarkId,
                            name: Y,
                            val: Z,
                            domain: aa,
                            type: 1,
                            memo: ac
                        },
                        success: function(ag, ah) {
                            var ae = null;
                            addLabelBtnFlag = true;
                            $("#addLabelBtn").removeClass("btn-s1-disabled");
                            $("#addLabelClose").removeClass("btn-s2-disabled");
                            $("#addLoading").addClass("hidden");
                            if (ag.r == 1) {
                                var af = '<li class="bitem" id="' + ag.id + 'b"><div class="textLabel" id="' + ag.id + 'bl"><span  id="' + ag.id + 'bd" title="删除书签" class="delRecIcon"></span><span  id="' + ag.id + 'be" title="编辑书签" class="modRecIcon"></span><span id="' + ag.id + 'icon" class="favIcon defaultIcon" ></span><div class="bookmarkLabel"><a class="bma" id="' + ag.id + 'a" target="_blank" href="' + Z + '" title="' + ((ac != "") ? "[" + ac + "] ": "") + Y + '">' + Y + "</a></div></div></li>";
                                $("#" + editGroupId + "g").find(".emptyli").remove();
                                $("#" + editGroupId + "g").find("ul").append(af);
                                var ad = new Object();
                                ad.i = ag.id;
                                ad.g = editGroupId;
                                ad.h = 0;
                                ad.a = (new Date()).format("yyyy-mm-dd HH:MM:ss");
                                ad.t = Y;
                                ad.u = Z;
                                ad.d = aa;
                                ad.m = ac;
                                _bookmarkArray[ag.id] = ad;
                                _bCount++;
                                if (_groupArray[editGroupId].sort == "") {
                                    _groupArray[editGroupId].sort = ag.id;
                                } else {
                                    _groupArray[editGroupId].sort = _groupArray[editGroupId].sort + "," + ag.id;
                                }
                                W();
                                var aj = $("#" + ag.id + "icon");
                                //alert("add---------"+ag.hosts);
                                aj.css({
                                    background: "url(http://" + ag.hosts + "/favicon.ico) no-repeat",
                                    "background-size":"contain"
                                });    
                            } else {
                                if (ag.r == -99) {
                                    noSession();
                                } else {
                                    if (ag.r == -98) {
                                        $("#addLabelErrorTips").text("书签已存在").show();
                                    } else {
                                        if (ag.r == -404) {
                                            $.cookie("qGroup", "", {
                                                expires: -1,
                                                path: "/"
                                            });
                                            $.cookie("qGroupV", 0, {
                                                expires: -1,
                                                path: "/"
                                            });
                                            $("#saveFail").text("数据不同步,重新加载").fadeIn("slow");
                                            setTimeout(function() {
                                                $("#saveFail").fadeOut("slow");
                                                window.location = "/";
                                            },
                                            2000);
                                        } else {
                                            $("#addLabelErrorTips").text("添加失败").show();
                                        }
                                    }
                                }
                            }
                        },
                        error: function(ae, af, ad) {
                            addLabelBtnFlag = true;
                            $("#addLabelBtn").removeClass("btn-s1-disabled");
                            $("#addLabelClose").removeClass("btn-s2-disabled");
                            $("#addLoading").addClass("hidden");
                            showError("");
                        }
                    });
                } else {
                    $("#alabelValueInput").addClass("input-txt-error");
                    $("#addLabelErrorTips").text("网址格式错误").show();
                }
            } else {
                if ((ab === "http://" && $("#alabelValue").hasClass("watermarkClass")) || ab == "") {
                    $("#alabelValueInput").addClass("input-txt-error");
                    $("#addLabelErrorTips").text("网址必填").show();
                    return;
                }
                if (ab != "") {
                    if (checkUrl(ab) == "") {
                        $("#alabelValueInput").addClass("input-txt-error");
                        $("#addLabelErrorTips").text("网址格式错误").show();
                        return;
                    }
                }
                if ((Y === "名称" && $("#alabelName").hasClass("watermarkClass")) || Y == "") {
                    $("#alabelNameInput").addClass("input-txt-error");
                    $("#addLabelErrorTips").text("名称必填").show();
                    return;
                }
            }
        }
    }
    function W() {
        var Y = $("#addLabel");
        if (!Y.hasClass("hidden")) {
            $("#" + parseInt(Y.parent().parent()[0].id) + "ga").removeClass("hidden").show();
            Y.addClass("hidden");
            $("#alabelValueInput").removeClass("input-txt-error");
            $("#alabelNameInput").removeClass("input-txt-error");
            $("#addLabelErrorTips").hide();
            Y.unwrap();
            $("body").append(Y);
        }
    }
    var x = true;
    function E() {
        if (x) {
            if (hasUpdate_group) {
                A();
            }
            if (hasUpdate_bookmark) {
                k();
            }
            $("#gAddBtn").addClass("btn-s1-disabled");
            x = false;
            $.ajax({
                type: "POST",
                timeout: 10000,
                url: $("#projpath").val()+"/other.do?opeaCode=AddMode",
                dataType: "json",
                data: {
                    gname: "默认分类"
                },
                success: function(ac, ad) {
                    var Z = null;
                    x = true;
                    $("#gAddBtn").removeClass("btn-s1-disabled");
                    if (ac.r == 1) {
                        var aa = "";
                        var ab = ac.gname;
                        _gCount++;
                        var Y = new Object();
                        Y.name = ab;
                        Y.id = ac.gid;
                        Y.sort = "";
                        _groupArray[Y.id] = Y;
                        _groupsort = _groupsort.replace("c1", "c1," + ac.gid);
                        if ($.cookie("layout_type") == "1") {
                            aa = '<div class="labelBox highlight" id="' + ac.gid + 'g"><div class="labelHead"><div class="labelHeadDefault" id="' + ac.gid + 'gh"></span><span id="' + ac.gid + 'gd" class="delRecIcon" title="删除分类"></span><span id="' + ac.gid + 'ge" class="modRecIcon" title="编辑分类名称"></span><span title="收起分类" class="upIcon" id="' + ac.gid + 'gu"></span><span title="展开分类" class="downIcon hidden" id="' + ac.gid + 'gw"></span><h4 id="' + ac.gid + 'gt">' + ab + '</h4></div></div><div id="' + ac.gid + 'gdiv"><ul class="labelContent" id="' + ac.gid + 'gul" ></ul><a id="' + ac.gid + 'ga" href="javascript:;" onclick="return false" hidefocus="ture" class="allBmBbtn iconBgImages"></a></div></div>';
                            $("#labelLayout #c1").prepend(aa);
                            setTimeout(function() {
                                $("#" + ac.gid + "g").removeClass("highlight");
                            },
                            5000);
                            H();
                        } else {
                            if ($.cookie("layout_type") == "2") {
                                aa = '<li><a class="catalog_a cur" id="' + ac.gid + 'g" href="#">' + ab + "</a></li>";
                                $(".catalog_a").removeClass("cur");
                                $(".bmark-list").addClass("hidden");
                                $("#catalogul").prepend(aa);
                                aa = '<div id="' + ac.gid + 'gDiv" class="bmark-list"><div class="hd"><span class="delRecIcon" title="删除分类" id="' + ac.gid + 'gd"></span><span class="modRecIcon" title="编辑分类" id="' + ac.gid + 'ge"></span><h3 id="' + ac.gid + 'h3">' + ab + '</h3></div><div class="bd"><ul class="bmark-list-ul" id="' + ac.gid + 'gul"><li class="emptyli"><div class="init">还没有任何书签，立即<a href="#" id="emptyAdd">添加</a></div></li></ul></div></div>';
                                $("#catalog").append(aa);
                                $("#gCount").html(_gCount);
                            }
                        }
                        $.cookie("qGroup", ab, {
                            expires: 365,
                            path: "/"
                        });
                        $.cookie("qGroupV", ac.gid, {
                            expires: 365,
                            path: "/"
                        });
                        $("#groupDiv").addClass("hidden");
                        $("#groupSuccess").removeClass("hidden");
                        setTimeout(function() {
                            $("#groupDiv").removeClass("hidden");
                            $("#groupSuccess").addClass("hidden");
                        },
                        800);
                    } else {
                        showError("添加失败");
                    }
                },
                error: function(Z, aa, Y) {
                    x = true;
                    $("#gAddBtn").removeClass("btn-s1-disabled");
                    showError("");
                }
            });
        }
        return false;
    }
    var l = true;
    function v() {
        if (l) {
            if (hasUpdate_group) {
                A();
            }
            if (hasUpdate_bookmark) {
                k();
            }
            var af = $.trim($("#qValue").val());
            var ad = $.trim($("#qName").val());
            var ag = $.trim($("#qMemo").val());
            if ($("#qMemo").hasClass("watermarkClass") && ag == "最多50个字符") {
                ag = "";
            }
            var ac = $("#qId").val();
            var ae = $("#qGroupV").val();
            var Z = $.trim($("#qGroup").val());
            if (Z != "" && customLen(Z) <= 20 && af != "" && ad != "" && customLen(ag) <= 50) {
                if (ae == "") {
                    for (var ab = 0; ab < gArray.length; ab++) {
                        if (gArray[ab].text === Z) {
                            ae = gArray[ab].value;
                            break;
                        }
                    }
                }
                if (ae == "") {
                    ae = 0;
                }
                var aa = "";
                var Y = "";
                var aa = checkUrl(af);
                if (aa != "") {
                    aa = aa.toString().split("|");
                    Y = aa[0];
                    aa = aa[1];
                }
                if (aa != "") {
                    $("#qBtn").addClass("btn-s1-disabled");
                    $("#qCancle").addClass("btn-s2-disabled");
                    $("#qLoading").removeClass("hidden");
                    l = false;
                    $.ajax({
                        type: "POST",
                        timeout: 10000,
                        url: $("#projpath").val()+"/other.do?opeaCode=EditFavList",
                        dataType: "json",
                        data: {
                            gid: ae,
                            gname: Z,
                            name: ad,
                            val: Y,
                            domain: aa,
                            bid: ac,
                            type: 1,
                            memo: ag
                        },
                        success: function(am, aj) {
                            var aq = null;
                            l = true;
                            $("#qBtn").removeClass("btn-s1-disabled");
                            $("#qCancle").removeClass("btn-s2-disabled");
                            $("#qLoading").addClass("hidden");
                            if (am.r == 1) {
                                var an = "";
                                if (ae != am.result.gid) {
                                    _gCount++;
                                    var al = new Object();
                                    al.name = Z;
                                    al.id = am.result.gid;
                                    al.sort = "";
                                    _groupArray[al.id] = al;
                                    _groupsort = _groupsort.replace("c1", "c1," + am.result.gid);
                                    if ($.cookie("layout_type") == "1") {
                                        an = '<div class="labelBox highlight" id="' + am.result.gid + 'g"><div class="labelHead"><div class="labelHeadDefault" id="' + am.result.gid + 'gh"></span><span id="' + am.result.gid + 'gd" class="delRecIcon" title="删除分类"></span><span id="' + am.result.gid + 'ge" class="modRecIcon" title="编辑分类名称"></span><span title="收起分类" class="upIcon" id="' + am.result.gid + 'gu"></span><span title="展开分类" class="downIcon hidden" id="' + am.result.gid + 'gw"></span><h4 id="' + am.result.gid + 'gt">' + Z + '</h4></div></div><div id="' + am.result.gid + 'gdiv"><ul class="labelContent" id="' + am.result.gid + 'gul" ></ul><a id="' + am.result.gid + 'ga" href="javascript:;" onclick="return false" hidefocus="ture" class="allBmBbtn iconBgImages"></a></div></div>';
                                        $("#labelLayout #c1").prepend(an);
                                        setTimeout(function() {
                                            $("#" + am.result.gid + "g").removeClass("highlight");
                                        },
                                        5000);
                                        H();
                                    } else {
                                        if ($.cookie("layout_type") == "2") {
                                            an = '<li><a class="catalog_a cur" id="' + am.result.gid + 'g" href="#">' + Z + "</a></li>";
                                            $(".catalog_a").removeClass("cur");
                                            $(".bmark-list").addClass("hidden");
                                            $("#catalogul").prepend(an);
                                            an = '<div id="' + am.result.gid + 'gDiv" class="bmark-list"><div class="hd"><span class="delRecIcon" title="删除分类" id="' + am.result.gid + 'gd"></span><span class="modRecIcon" title="编辑分类" id="' + am.result.gid + 'ge"></span><h3 id="' + am.result.gid + 'h3">' + Z + '</h3></div><div class="bd"><ul class="bmark-list-ul" id="' + am.result.gid + 'gul"></ul></div></div>';
                                            $("#catalog").append(an);
                                            $("#gCount").html(_gCount);
                                        }
                                    }
                                } else {
                                    if ($.cookie("layout_type") == "1") {
                                        $("#" + am.result.gid + "g").find(".emptyli").remove();
                                    } else {
                                        if ($.cookie("layout_type") == "2") {
                                            $("#" + am.result.gid + "gul>.emptyli").remove();
                                            $(".catalog_a").removeClass("cur");
                                            $(".bmark-list").addClass("hidden");
                                            $("#" + am.result.gid + "gDiv").removeClass("hidden");
                                            $("#" + am.result.gid + "g").addClass("cur");
                                        }
                                    }
                                }
                                if ($.cookie("layout_type") == "1") {
                                    an = '<li class="bitem" id="' + am.result.id + 'b"><div class="textLabel"  id="' + am.result.id + 'bl"><span  id="' + am.result.id + 'bd" title="删除书签" class="delRecIcon"></span><span  id="' + am.result.id + 'be" title="编辑书签" class="modRecIcon"></span><span id="' + am.result.id + 'sh" class="shareRecIcon" title="分享书签"></span><span id="' + am.result.id + 'icon" class="favIcon defaultIcon" ></span><div class="bookmarkLabel"><a class="bma" id="' + am.result.id + 'a" target="_blank" href="' + Y + '" title="' + ((ag != "") ? "[" + ag + "] ": "") + ad + '">' + ad + "</a></div></div></li>";
                                    $("#" + am.result.gid + "g").find("ul").append(an);
                                    if (_groupArray[am.result.gid].sort == "") {
                                        _groupArray[am.result.gid].sort = am.result.id + "";
                                    } else {
                                        _groupArray[am.result.gid].sort += "," + am.result.id;
                                    }
                                    _bCount++;
                                } else {
                                    if ($.cookie("layout_type") == "2") {
                                        if (ac != "0") {
                                            if (am.result.oldgid != am.result.gid) {
                                                $("#" + ac + "b").remove();
                                                if ($("#" + am.result.oldgid + "gul").find("li").length < 1) {
                                                    $("#" + am.result.oldgid + "gul").append('<li class="emptyli"><div class="init">还没有任何书签，立即<a href="#" id="emptyAdd">添加</a></div></li>');
                                                }
                                                an = '<li id="' + am.result.id + 'b"><div class="bmark-main" id="' + am.result.id + 'bl"><span id="' + am.result.id + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + am.result.id + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + am.result.id + 'icon" class="favIcon defaultIcon"></span><div class="bmark-name"><a  class="bma" id="' + am.result.id + 'a" target="_blank" href="' + Y + '">' + ad + "</a></div></div>";
                                                if (ag != "") {
                                                    an += '<p class="bmark-mark">备注：<span>' + ag + "</span></p>";
                                                }
                                                an += '<p class="bmark-url">' + Y + '</p><div id="s' + am.result.id + '" class="area-share hidden"><span>分享到</span><a href="#" title="新浪微博" class="btn-sina btn-sina1"></a><a href="#" title="腾讯微博" class="btn-t-qq btn-t-qq1"></a><a href="#" title="qq空间" class="btn-qzone btn-qzone1"></a></div></li>';
                                                $("#" + am.result.gid + "gul").append(an);
                                                if (_groupArray[am.result.oldgid] != null) {
                                                    var ah = _groupArray[am.result.oldgid].sort.replace("," + am.result.id, "");
                                                    ah = ah.replace(am.result.id + ",", "");
                                                    _groupArray[am.result.oldgid].sort = ah;
                                                    _groupArray[am.result.gid].sort += "," + am.result.id;
                                                }
                                            } else {
                                                an = '<div class="bmark-main" id="' + am.result.id + 'bl"><span id="' + am.result.id + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + am.result.id + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + am.result.id + 'icon" class="favIcon defaultIcon"></span><div class="bmark-name"><a  class="bma" id="' + am.result.id + 'a" target="_blank" href="' + Y + '">' + ad + "</a></div></div>";
                                                if (ag != "") {
                                                    an += '<p class="bmark-mark">备注：<span>' + ag + "</span></p>";
                                                }
                                                an += '<p class="bmark-url">' + Y + '</p><div id="s' + am.result.id + '" class="area-share hidden"><span>分享到</span><a href="#" title="新浪微博" class="btn-sina btn-sina1"></a><a href="#" title="腾讯微博" class="btn-t-qq btn-t-qq1"></a><a href="#" title="qq空间" class="btn-qzone btn-qzone1"></a></div>';
                                                $("#" + ac + "b").html(an);
                                            }
                                        } else {
                                            _bCount++;
                                            $("#bCount").html(_bCount);
                                            an = '<li id="' + am.result.id + 'b"><div class="bmark-main" id="' + am.result.id + 'bl"><span id="' + am.result.id + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + am.result.id + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + am.result.id + 'icon" class="favIcon defaultIcon"></span><div class="bmark-name"><a  class="bma" id="' + am.result.id + 'a" target="_blank" href="' + Y + '">' + ad + "</a></div></div>";
                                            if (ag != "") {
                                                an += '<p class="bmark-mark">备注：<span>' + ag + "</span></p>";
                                            }
                                            an += '<p class="bmark-url">' + Y + '</p><div id="s' + am.result.id + '" class="area-share hidden"><span>分享到</span><a href="#" title="新浪微博" class="btn-sina btn-sina1"></a><a href="#" title="腾讯微博" class="btn-t-qq btn-t-qq1"></a><a href="#" title="qq空间" class="btn-qzone btn-qzone1"></a></div></li>';
                                            $("#" + am.result.gid + "gul").append(an);
                                            if (_groupArray[am.result.gid].sort == "") {
                                                _groupArray[am.result.gid].sort = am.result.id + "";
                                            } else {
                                                _groupArray[am.result.gid].sort += "," + am.result.id;
                                            }
                                        }
                                    } else {
                                        if ($.cookie("layout_type") == "3") {
                                            if (ac != "0") {
                                                if (am.result.oldgid != am.result.gid) {
                                                    if (_groupArray[am.result.oldgid] != null) {
                                                        var ah = _groupArray[am.result.oldgid].sort.replace("," + am.result.id, "");
                                                        ah = ah.replace(am.result.id + ",", "");
                                                        _groupArray[am.result.oldgid].sort = ah;
                                                        _groupArray[am.result.gid].sort += "," + am.result.id;
                                                    }
                                                } else {}
                                                an = '<div class="textLabel" id="' + am.result.id + 'bl"><span id="' + am.result.id + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + am.result.id + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + am.result.id + 'sh" class="shareRecIcon" title="分享书签"></span><span id="' + am.result.id + 'icon" class="favIcon defaultIcon"></span><div class="bookmarkLabel"><a  class="bma" id="' + am.result.id + 'a" target="_blank" href="' + Y + '" title="' + ((ag != "") ? "[" + ag + "] ": "") + ad + '">' + ad + "</a></div></div>";
                                                $("#" + ac + "b").html(an);
                                            } else {
                                                _bCount++;
                                                an = '<li class="bitem" id="' + am.result.id + 'b"><div class="textLabel" id="' + am.result.id + 'bl"><span id="' + am.result.id + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + am.result.id + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + am.result.id + 'sh" class="shareRecIcon" title="分享书签"></span><span id="' + am.result.id + 'icon" class="favIcon defaultIcon"></span><div class="bookmarkLabel"><a  class="bma" id="' + am.result.id + 'a" target="_blank" href="' + Y + '" title="' + ((ag != "") ? "[" + ag + "] ": "") + ad + '">' + ad + "</a></div></div></li>";
                                                if ($("#group6").length == 1) {
                                                    $("#group6").append(an);
                                                } else {
                                                    var ai = '<div class="item"><div class="hd"><h3>从未使用<span class="hot hot-s6"></span></h3></div><div class="bd"><ul id="group6"  class="bmark-list-ul">' + an + "</ul></div></div>";
                                                    $("#hotbox").html(ai);
                                                }
                                                if (_groupArray[am.result.gid].sort == "") {
                                                    _groupArray[am.result.gid].sort = am.result.id + "";
                                                } else {
                                                    _groupArray[am.result.gid].sort += "," + am.result.id;
                                                }
                                            }
                                        } else {
                                            if ($.cookie("layout_type") == "4") {
                                                if (ac != "0") {
                                                    if (am.result.oldgid != am.result.gid) {
                                                        if (_groupArray[am.result.oldgid] != null) {
                                                            var ah = _groupArray[am.result.oldgid].sort.replace("," + am.result.id, "");
                                                            ah = ah.replace(am.result.id + ",", "");
                                                            _groupArray[am.result.oldgid].sort = ah;
                                                            _groupArray[am.result.gid].sort += "," + am.result.id;
                                                        }
                                                    } else {}
                                                    an = '<div class="textLabel" id="' + am.result.id + 'bl"><span id="' + am.result.id + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + am.result.id + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + am.result.id + 'sh" class="shareRecIcon" title="分享书签"></span><span id="' + am.result.id + 'icon" class="favIcon defaultIcon"></span><div class="bookmarkLabel"><a  class="bma" id="' + am.result.id + 'a" target="_blank" href="' + Y + '" title="' + ((ag != "") ? "[" + ag + "] ": "") + ad + '">' + ad + "</a></div></div>";
                                                    $("#" + ac + "b").html(an);
                                                } else {
                                                    _bCount++;
                                                    an = '<li class="bitem" id="' + am.result.id + 'b"><div class="textLabel" id="' + am.result.id + 'bl"><span id="' + am.result.id + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + am.result.id + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + am.result.id + 'sh" class="shareRecIcon" title="分享书签"></span><span id="' + am.result.id + 'icon" class="favIcon defaultIcon"></span><div class="bookmarkLabel"><a  class="bma" id="' + am.result.id + 'a" target="_blank" href="' + Y + '" title="' + ad + '">' + ad + "</a></div></div></li>";
                                                    if ($("#firstMonth").length == 1) {
                                                        $("#firstMonth").prepend(an);
                                                        $("#firstMonthTotal").html("[" + $("#firstMonth").find(".bitem").length + "]");
                                                    } else {
                                                        var ao = new Date();
                                                        var ak = ao.format("mmmm");
                                                        var ai = '<div class="item"><div class="hd"><h3>今月 ' + ak + '<span id="firstMonthTotal" class="total">[1]</span></h3></div><div class="bd"><ul class="bmark-list-ul"  id="firstMonth">' + an + "</ul></div></div>";
                                                        $("#timebox").prepend(ai);
                                                    }
                                                    if (_groupArray[am.result.gid].sort == "") {
                                                        _groupArray[am.result.gid].sort = am.result.id + "";
                                                    } else {
                                                        _groupArray[am.result.gid].sort += "," + am.result.id;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                var ap = new Object();
                                ap.i = am.result.id;
                                ap.g = am.result.gid;
                                ap.h = 0;
                                ap.a = (new Date()).format("yyyy-mm-dd HH:MM:ss");
                                ap.t = ad;
                                ap.u = Y;
                                ap.d = aa;
                                ap.m = ag;
                                _bookmarkArray[am.result.id] = ap;
                                $.cookie("qGroup", Z, {
                                    expires: 365,
                                    path: "/"
                                });
                                $.cookie("qGroupV", am.result.gid, {
                                    expires: 365,
                                    path: "/"
                                });
                                $("#groupDiv").addClass("hidden");
                                $("#groupSuccess").removeClass("hidden");
                                setTimeout(T, 800);
                                var at = $("#" + am.result.id + "icon");
                                at.css({
                                	background: "url(http://" + am.hosts + "/favicon.ico) no-repeat",
                                    "background-size":"contain"
                                });
                            } else {
                                if (am.r == -99) {
                                    noSession();
                                } else {
                                    if (am.r == -98) {
                                        j("#qValueLabel", "#qValueError", "已存在");
                                    } else {
                                        if (am.r == -404) {
                                            $.cookie("qGroup", "", {
                                                expires: -1,
                                                path: "/"
                                            });
                                            $.cookie("qGroupV", 0, {
                                                expires: -1,
                                                path: "/"
                                            });
                                            $("#saveFail").text("数据不同步,重新加载").fadeIn("slow");
                                            setTimeout(function() {
                                                $("#saveFail").fadeOut("slow");
                                                window.location = "/";
                                            },
                                            2000);
                                        } else {
                                            showError("添加失败");
                                        }
                                    }
                                }
                            }
                        },
                        error: function(ai, aj, ah) {
                            l = true;
                            $("#qBtn").removeClass("btn-s1-disabled");
                            $("#qCancle").removeClass("btn-s2-disabled");
                            $("#qLoading").addClass("hidden");
                            showError("");
                        }
                    });
                } else {
                    j("#qValueLabel", "#qValueError", "格式错误");
                }
            } else {
                if (af === "http://" || af == "") {
                    j("#qValueLabel", "#qValueError", "必填");
                }
                if (af != "") {
                    if (checkUrl(af) == "") {
                        j("#qValueLabel", "#qValueError", "格式错误");
                    }
                }
            }
            if (ad == "") {
                j("#qNameLabel", "#qNameError", "必填");
            }
            if (Z == "") {
                j("#qGroupLabel", "#qGroupError", "必填");
                $("#qNewGroup").addClass("hidden");
            } else {
                if (customLen(Z) > 20) {
                    j("#qGroupLabel", "#qGroupError", "字符超长");
                    $("#qNewGroup").addClass("hidden");
                }
            }
            if (customLen(ag) > 50) {
                j("#qMemoLabel", "#qMemoError", "字符超长");
            }
        }
        return false;
    }
    function j(Z, aa, Y) {
        if (!$(Z).hasClass("input-txt-error")) {
            $(Z).addClass("input-txt-error");
        }
        if ($(aa).hasClass("hidden")) {
            $(aa).text(Y).removeClass("hidden");
        }
    }
    function U(Y, Z) {
        if ($(Y).hasClass("input-txt-error")) {
            $(Y).removeClass("input-txt-error");
        }
        if (!$(Z).hasClass("hidden")) {
            $(Z).addClass("hidden");
        }
    }
    function T() {
        if (!$("#qAddArea").hasClass("hidden")) {
            $("#qValue").val("");
            $("#qName").val("");
            U("#qValueLabel", "#qValueError");
            U("#qNameLabel", "#qNameError");
            U("#qGroupLabel", "#qGroupError");
            U("#qMemoLabel", "#qMemoError");
            $("#qGroup").trigger("hideList");
            $("#qAddArea").addClass("hidden");
            $("#groupDiv").removeClass("hidden");
            $("#groupSuccess").addClass("hidden");
            $("#qGroupLabel").removeClass("input-txt-focus");
            $("#qNameLabel").removeClass("input-txt-focus");
            $("#qValueLabel").removeClass("input-txt-focus");
        }
    }
    var I = true;
    function n() {
        if (I) {
            var ab = $.trim($("#labelValue").val());
            var Y = $.trim($("#labelName").val());
            var ac = $.trim($("#labelMemo").val());
            if ($("#labelMemo").hasClass("watermarkClass") && ac == "备注(最多50个字符)") {
                ac = "";
            }
            if (ab == oldBookmarkUrl && Y == oldBookmarkName && ac == oldBookmarkMemo) {
                u();
                return;
            }
            if (ab != "" && (!$("#labelValue").hasClass("watermarkClass")) && Y != "" && (!$("#labelName").hasClass("watermarkClass"))) {
                var aa = "";
                var Z = "";
                var aa = checkUrl(ab);
                if (aa != "") {
                    aa = aa.toString().split("|");
                    Z = aa[0];
                    aa = aa[1];
                }
                if (aa != "") {
                    $("#editLabelBtn").addClass("btn-s1-disabled");
                    $("#editLabelClose").addClass("btn-s2-disabled");
                    $("#editLoading").removeClass("hidden");
                    I = false;
                    $.ajax({
                        type: "POST",
                        timeout: 30000,
                        url: $("#projpath").val()+"/other.do?opeaCode=EditFav",
                        dataType: "json",
                        data: {
                            gid: editGroupId,
                            bid: editBookmarkId,
                            name: Y,
                            val: Z,
                            domain: aa,
                            memo: ac
                        },
                        success: function(ae, af) {
                            var ad = null;
                            I = true;
                            $("#editLabelBtn").removeClass("btn-s1-disabled");
                            $("#editLabelClose").removeClass("btn-s2-disabled");
                            $("#editLoading").addClass("hidden");
                            if (ae.r == 1) {
                                if (editBookmarkId != 0) {
                                    ad = $("#" + editBookmarkId + "a");
                                    ad.text(Y);
                                    ad.attr("href", Z);
                                    if (ac != "") {
                                        ad.attr("title", "[" + ac + "] " + Y);
                                    }
                                    _bookmarkArray[editBookmarkId].t = Y;
                                    _bookmarkArray[editBookmarkId].u = Z;
                                    _bookmarkArray[editBookmarkId].d = aa;
                                    _bookmarkArray[editBookmarkId].m = ac;
                                } else {}
                                u();
                                var ah = $("#" + ae.id + "icon");
                                //alert("edit---------"+ae.hosts);
                                ah.css({
                                    background: "url(http://" + ae.hosts + "/favicon.ico) no-repeat",
                                    "background-size":"contain"
                                });
                            } else {
                                if (ae.r == -99) {
                                    noSession();
                                } else {
                                    if (ae.r == -404) {
                                        $.cookie("qGroup", "", {
                                            expires: -1,
                                            path: "/"
                                        });
                                        $.cookie("qGroupV", 0, {
                                            expires: -1,
                                            path: "/"
                                        });
                                        $("#saveFail").text("数据不同步,重新加载").fadeIn("slow");
                                        setTimeout(function() {
                                            $("#saveFail").fadeOut("slow");
                                            window.location = "/";
                                        },
                                        2000);
                                    } else {
                                        $("#editLabelErrorTips").text("修改失败").show();
                                    }
                                }
                            }
                        },
                        error: function(ae, af, ad) {
                            I = true;
                            $("#editLabelBtn").removeClass("btn-s1-disabled");
                            $("#editLabelClose").removeClass("btn-s2-disabled");
                            $("#editLoading").addClass("hidden");
                            showError("");
                        }
                    });
                } else {
                    $("#labelValueInput").addClass("input-txt-error");
                    $("#editLabelErrorTips").text("网址格式不对").show();
                }
            } else {
                if ((ab === "http://" && $("#labelValue").hasClass("watermarkClass")) || ab == "") {
                    $("#labelValueInput").addClass("input-txt-error");
                    $("#editLabelErrorTips").text("网址必填").show();
                    return;
                }
                if (ab != "") {
                    if (checkUrl(ab) == "") {
                        $("#labelValueInput").addClass("input-txt-error");
                        $("#editLabelErrorTips").text("网址格式不对").show();
                        return;
                    }
                }
                if ((Y === "名称" && $("#labelName").hasClass("watermarkClass")) || Y == "") {
                    $("#labelNameInput").addClass("input-txt-error");
                    $("#editLabelErrorTips").text("名称必填").show();
                    return;
                }
            }
        }
        return false;
    }
    function G(Y) {
        if ($(Y).hasClass("input-txt-error")) {
            $(Y).removeClass("input-txt-error");
            $("#editLabelErrorTips").hide();
        }
    }
    function p() {
        var Y = $(this);
        Y = Y.parent();
        u();
        W();
        i();
        var aa = $("#editGroup");
        $("#editGroup").removeClass("errorTips");
        $("#groupErrorTips").hide();
        if (!aa.hasClass("hidden")) {
            aa.next().removeClass("hidden");
        }
        editGroupId = parseInt(Y[0].id);
        Y.parent().prepend(aa);
        var Z = $("#" + editGroupId + "gt");
        oldGroupName = Z.text();
        $("#groupValue").val(oldGroupName);
        Y.addClass("hidden");
        aa.removeClass("hidden");
        $("#groupValue").focus();
        return false;
    }
    function S() {
        var Y = $("#editGroup");
        if (!Y.hasClass("hidden")) {
            Y.next().removeClass("hidden");
            Y.addClass("hidden");
            $("body").append(Y);
            editGroupId = 0;
            oldGroupName = "";
        }
        return false;
    }
    $("#editGroupClose").live("click", S);
    function X(Y) {
        if ($.cookie("layout_type") == "1") {
            var Z = "";
            var aa = "";
            $("#" + Y + "gd").hide();
            $("#" + Y + "ge").hide();
            if ($("#" + Y + "g").find("#editLabel").length > 0) {
                u();
            }
            if ($("#" + Y + "g").find("#addLabel").length > 0) {
                W();
            }
            if ($("#" + Y + "g").find("#shareDiv").length > 0) {
                i();
            }
            if (hasUpdate_group) {
                A();
            }
            if (hasUpdate_bookmark) {
                k();
            }
            $.ajax({
                type: "POST",
                timeout: 20000,
                url: $("#projpath").val()+"/other.do?opeaCode=DelMode",
                dataType: "json",
                data: {
                    id: Y
                },
                success: function(ad, ae) {
                    if (ad.r == 1) {
                        $("#" + Y + "g").remove();
                        _groupsort = _groupsort.replace("," + Y, "");
                        var ac = _groupArray[Y].sort.toString().split(",");
                        for (var ab = 0; ab < ac.length; ab++) {
                            _bookmarkArray[ac[ab]] = null;
                            _bCount--;
                        }
                        _groupArray[Y] = null;
                        _gCount--;
                        if ($.cookie("qGroupV") == Y) {
                            $.cookie("qGroup", "", {
                                expires: -1,
                                path: "/"
                            });
                            $.cookie("qGroupV", 0, {
                                expires: -1,
                                path: "/"
                            });
                        }
                    } else {
                        $("#" + Y + "gd").removeAttr("style");
                        $("#" + Y + "ge").removeAttr("style");
                        if (ad.r == -99) {
                            noSession();
                        } else {
                            showError("分类删除失败");
                        }
                    }
                },
                error: function(ac, ad, ab) {
                    $("#" + Y + "gd").removeAttr("style");
                    $("#" + Y + "ge").removeAttr("style");
                    showError("");
                }
            });
        } else {
            if ($.cookie("layout_type") == "2") {
                $.ajax({
                    type: "POST",
                    timeout: 20000,
                    url: $("#projpath").val()+"/other.do?opeaCode=DelMode",
                    dataType: "json",
                    data: {
                        id: Y
                    },
                    success: function(ae, af) {
                        if (ae.r == 1) {
                            $("#" + Y + "gDiv").remove();
                            $("#" + Y + "g").parent().remove();
                            var ad = $("#catalogul li:first-child a");
                            ad.addClass("cur");
                            $("#" + ad[0].id + "Div").removeClass("hidden");
                            _groupsort = _groupsort.replace("," + Y, "");
                            var ac = _groupArray[Y].sort.toString().split(",");
                            for (var ab = 0; ab < ac.length; ab++) {
                                _bookmarkArray[ac[ab]] = null;
                                _bCount--;
                            }
                            _groupArray[Y] = null;
                            _gCount--;
                            $("#bCount").html(_bCount);
                            $("#gCount").html(_gCount);
                            if ($.cookie("qGroupV") == Y) {
                                $.cookie("qGroup", "", {
                                    expires: -1,
                                    path: "/"
                                });
                                $.cookie("qGroupV", 0, {
                                    expires: -1,
                                    path: "/"
                                });
                            }
                        } else {
                            $("#" + Y + "gd").removeAttr("style");
                            $("#" + Y + "ge").removeAttr("style");
                            if (ae.r == -99) {
                                noSession();
                            } else {
                                showError("分类删除失败");
                            }
                        }
                    },
                    error: function(ac, ad, ab) {
                        $("#" + Y + "gd").removeAttr("style");
                        $("#" + Y + "ge").removeAttr("style");
                        showError("");
                    }
                });
            }
        }
    }
    function M() {
        var Y = $(this);
        var aa = parseInt(Y[0].id);
        //if(aa<100){
        //	alert("不可删除常用收藏！");
        //	return false;
        //}
        var Z = $(document).height();
        if ($(".labelLayout").find(".labelBox").length <= 1) {
            $("#coverDiv2").height(Z);
            $("#noDelText").text("必须保留至少一个分类！");
            $("#noDelClassfyAlert").removeClass("hidden");
            return false;
        }
        if ($("#" + aa + "g").find(".textLabel").length > 0) {
            $("#coverDiv").height(Z);
            $("#confirmDelClassfy").removeClass("hidden");
            delGroupId = aa;
        } else {
            X(aa);
        }
        return false;
    }
    function m() {
        if (!$("#searchList1").is(":hidden")) {
            $("#searchList1").slideUp("fast");
        }
        if ($("#app_notes_content textarea").hasClass("focusStyle")) {
            $("#app_notes_content textarea").removeClass("focusStyle");
            $("#app_notes_del").hide();
        }
        if (!$("#qList").is(":hidden")) {
            if ($("a.classfy-list-hover").length > 0) {
                $("a.classfy-list-hover").removeClass("classfy-list-hover");
            }
            $("#qList").hide();
        }
        if (!$("#searchTips").is(":hidden")) {
            $("#searchTips").empty();
            $("#searchTips").hide();
        }
        if (!$("#yijeetips").is(":hidden")) {
            $("#yijeetips").empty();
            $("#yijeetips").hide();
        }
        if (!$("#shareDiv").is(":hidden")) {
            $("#shareDiv").slideUp("fast");
        }
    }
    function w(Y) {
        /*$.ajax({
            type: "POST",
            url: "profile/hit",
            data: {
                id: Y
            },
            success: function(Z, aa) {
                if (Z == -99) {
                    noSession();
                }
            },
            error: function(aa, ab, Z) {}
        });*/
    }
    function C(Z) {
        try {
            if ($.cookie("layout_type") == "1") {
                $("#btn-define").removeClass("define-cur");
            } else {
                if ($.cookie("layout_type") == "2") {
                    $("#btn-list").removeClass("list-cur");
                } else {
                    if ($.cookie("layout_type") == "4") {
                        $("#btn-time").removeClass("time-cur");
                    } else {
                        if ($.cookie("layout_type") == "3") {
                            $("#btn-hot").removeClass("hot-cur");
                        }
                    }
                }
            }
            $.cookie("layout_type", Z, {
                expires: 365,
                path: "/"
            });
            /*if ($("#preCount").length > 0) {
                $("#preCount").remove();
                var Y = (new Date()).format("yyyymmdd");
                $.cookie("isshowcount", Y, {
                    expires: 1,
                    path: "/"
                });
            }*/
            u();
            W();
            i();
            N(0);
            return false;
        } catch(aa) {}
    }
    function z(Y) {
        $.cookie("show_app", Y, {
            expires: 365,
            path: "/"
        });
    }
    function a() {
        if (!$("#editCatalog").hasClass("hidden")) {
            $("#gValue2").val("");
            if ($("#gValueLabel2").hasClass("input-txt-error")) {
                $("#gValueLabel2").removeClass("input-txt-error");
                $("#gValueError2").addClass("hidden");
            }
            $("#editCatalog").addClass("hidden");
        }
    }
    function i() {
        var Y = $("#shareDiv");
        if (!Y.is(":hidden")) {
            Y.slideUp("fast");
        }
        $("body").append(Y);
    }
    function R() {
        if ($(document).scrollTop() > 0) {
            if ($(window).width() > 1024) {
                $("#gotop").removeClass("hidden").css("left", parseInt(($(window).width() - 980) / 2 + 982));
            }
        } else {
            if (!$("#gotop").hasClass("hidden")) {
                $("#gotop").addClass("hidden");
            }
        }
    }
    function r() {
        $("#appArea").sortable("destroy");
        $("#appArea").sortable({
            connectWith: "#appArea",
            handle: "div.appHead",
            placeholder: "appHolder",
            update: function(Z, aa) {
                var Y = "";
                $("#appArea > .appBox").each(function() {
                    Y += "," + this.id.split("_")[1];
                });
                Y = Y.substr(1, Y.length);
                /*$.ajax({
                    type: "POST",
                    timeout: 20000,
                    url: "profile/updateAppSort",
                    dataType: "json",
                    data: {
                        sort: Y
                    },
                    success: function(ab, ac) {
                        if (ab.r == -99) {
                            noSession();
                        } else {
                            if (ab.r == -1) {
                                showError("应用更新失败");
                            }
                        }
                    },
                    error: function(ac, ad, ab) {
                        showError("");
                    }
                });*/
            }
        });
        $(".appArea").disableSelection();
    }
    function t() {
        $.ajax({
            type: "POST",
            url: "app/getTuans",
            dataType: "json",
            data: {
                p: tuan_city
            },
            success: function(ab, ad) {
                try {
                    if (ab.r == 1) {
                        var Y = $("<ul></ul>");
                        for (var aa = 0; aa < ab.tuans.length; aa++) {
                            Y.prepend('<li><a class="tuanlink" href="' + ab.tuans[aa].url + '" target="_blank">' + ab.tuans[aa].title + "</a><p>结束时间：" + ab.tuans[aa].etime + "</p></li>");
                        }
                        $("#app_tuan_content").empty();
                        $("#app_tuan_content").prepend(Y);
                        $("#app_tuan_loading").addClass("hidden");
                        $("#app_tuan_error").addClass("hidden");
                        $("#app_tuan_content").removeClass("hidden");
                        $("#app_tuan_set").addClass("hidden");
                    } else {
                        if (ab.r == -99) {
                            noSession();
                        } else {
                            $("#app_tuan_loading").addClass("hidden");
                            $("#app_tuan_error").addClass("hidden");
                            $("#app_tuan_set").removeClass("hidden");
                        }
                    }
                    var Z = $(document).height();
                    $("#coverDiv3").height(Z);
                } catch(ac) {
                    $("#app_tuan_loading").addClass("hidden");
                    $("#app_tuan_set").addClass("hidden");
                    $("#app_tuan_error").removeClass("hidden");
                }
            },
            error: function(Z, aa, Y) {
                showError("");
            }
        });
    }
    function L() {
        $.ajax({
            type: "POST",
            url: "app/tuan",
            dataType: "json",
            success: function(Z, ab) {
                try {
                    if (Z.r == 1) {
                        tuan_city = Z.city;
                        t();
                    } else {
                        if (Z.r == -99) {
                            noSession();
                        } else {
                            $("#app_tuan_loading").addClass("hidden");
                            $("#app_tuan_error").addClass("hidden");
                            $("#app_tuan_set").removeClass("hidden");
                        }
                    }
                    var Y = $(document).height();
                    $("#coverDiv3").height(Y);
                } catch(aa) {
                    $("#app_tuan_loading").addClass("hidden");
                    $("#app_tuan_set").addClass("hidden");
                    $("#app_tuan_error").removeClass("hidden");
                }
            },
            error: function(Z, aa, Y) {
                showError("");
            }
        });
    }
    function P() {
        $("#app_notes_add").hide();
        $("#app_notes_del").hide();
        $.ajax({
            type: "POST",
            url: "app/notes",
            dataType: "json",
            success: function(ab, ac) {
                if (ab.r == 1) {
                    var Y = $("<ul></ul>");
                    for (var aa = 0; aa < ab.notes.length; aa++) {
                        notesArray[ab.notes[aa].id] = ab.notes[aa].content;
                        Y.prepend('<li><textarea id="app_notes_' + ab.notes[aa].id + '">' + ab.notes[aa].content + "</textarea></li>");
                    }
                    $("#app_notes_content").prepend(Y);
                    $(".notesBtnArea").removeClass("hidden");
                    $("#app_notes_loading").addClass("hidden");
                    if (ab.notes.length < 10) {
                        $("#app_notes_add").show();
                    }
                    var Z = $(document).height();
                    $("#coverDiv3").height(Z);
                } else {
                    if (ab.r == -99) {
                        noSession();
                    } else {
                        $("#app_notes_add").trigger("click");
                        $("#app_notes_add").show();
                        $("#app_tuan_loading").addClass("hidden");
                    }
                }
                $("#app_notes_content textarea").elastic();
            },
            error: function(Z, aa, Y) {}
        });
    }
    function D() {
        $.ajax({
            type: "POST",
            url: "app/getNewsData",
            dataType: "json",
            data: {
                rss: rss
            },
            success: function(aa, Z) {
                try {
                    if (aa.r == 1) {
                        var Y = $("#app_news_content_ul");
                        Y.empty();
                        for (var ab = 0; ab < aa.feed.length; ab++) {
                            var ae = aa.feed[ab];
                            var ac = (ae.description.length > 50) ? (ae.description.substr(0, 50) + "...") : ae.description;
                            var af = '<li><a class="newslink" href="' + ae.link + '" target="_blank">' + ae.title + "</a><p>" + $.trim(ac) + "</p></li>";
                            Y.append(af);
                            $("#app_news_loading").addClass("hidden");
                            $("#app_news_error").addClass("hidden");
                            $("#app_news_content").removeClass("hidden");
                            $("#app_news_set").addClass("hidden");
                            var ag = $(document).height();
                            $("#coverDiv3").height(ag);
                        }
                    } else {
                        if (aa.r == -99) {
                            noSession();
                        } else {
                            $("#app_news_loading").addClass("hidden");
                            $("#app_news_error").addClass("hidden");
                            $("#app_news_set").removeClass("hidden");
                        }
                    }
                    var ag = $(document).height();
                    $("#coverDiv3").height(ag);
                } catch(ad) {
                    $("#app_news_loading").addClass("hidden");
                    $("#app_news_set").addClass("hidden");
                    $("#app_news_error").removeClass("hidden");
                }
            },
            error: function(Z, aa, Y) {
                showError("");
            }
        });
    }
    function V() {
        $.ajax({
            type: "POST",
            url: "app/news",
            dataType: "json",
            success: function(Z, ab) {
                try {
                    if (Z.r == 1) {
                        rss = Z.rss;
                        D();
                        newsIntervalId = window.setInterval(D, 1800000);
                    } else {
                        if (Z.r == -99) {
                            noSession();
                        } else {
                            $("#app_news_loading").addClass("hidden");
                            $("#app_news_error").addClass("hidden");
                            $("#app_news_set").removeClass("hidden");
                        }
                    }
                    var Y = $(document).height();
                    $("#coverDiv3").height(Y);
                } catch(aa) {
                    $("#app_news_loading").addClass("hidden");
                    $("#app_news_set").addClass("hidden");
                    $("#app_news_error").removeClass("hidden");
                }
            },
            error: function(Z, aa, Y) {
                showError("");
            }
        });
    }
    function K() {
        $.ajax({
            type: "POST",
            url: "app/weather",
            dataType: "json",
            success: function(Z, ab) {
                try {
                    if (Z.r == 1) {
                        city = Z.city;
                        Z = Z.data;
                        loadWeather = true;
                        $("#app_weather_now_img").attr("src", "http://cache.soso.com/zdq/wea/" + Z.future["bwea_0_icon"]);
                        $("#app_weather_now_img").attr("title", Z.future["wea_0"]);
                        $("#app_weather_now_temp").text(Z.real["temperature"] + "°C");
                        $("#app_weather_city").text(city);
                        $("#app_weather_now_condition").text("当前：" + Z.future["wea_0"]);
                        $("#app_weather_now_humidity").text("");
                        $("#app_weather_day_week_0").text("今天");
                        $("#app_weather_img_0").attr("src", "http://cache.soso.com/zdq/wea/" + Z.future["bwea_0_icon"]);
                        $("#app_weather_img_0").attr("title", Z.future["wea_0"]);
                        $("#app_weather_temp_0").text(Z.future["tmin_0"] + "° ~ " + Z.future["tmax_0"] + "°");
                        $("#app_weather_day_week_1").text("明天");
                        $("#app_weather_img_1").attr("src", "http://cache.soso.com/zdq/wea/" + Z.future["bwea_1_icon"]);
                        $("#app_weather_img_1").attr("title", Z.future["wea_1"]);
                        $("#app_weather_temp_1").text(Z.future["tmin_1"] + "° ~ " + Z.future["tmax_1"] + "°");
                        $("#app_weather_day_week_2").text("后天");
                        $("#app_weather_img_2").attr("src", "http://cache.soso.com/zdq/wea/" + Z.future["bwea_2_icon"]);
                        $("#app_weather_img_2").attr("title", Z.future["wea_2"]);
                        $("#app_weather_temp_2").text(Z.future["tmin_2"] + "° ~ " + Z.future["tmax_2"] + "°");
                        $("#app_weather_loading").addClass("hidden");
                        $("#app_weather_error").addClass("hidden");
                        $("#app_weather_refresh").addClass("hidden");
                        $("#app_weather_content").removeClass("hidden");
                        $("#app_weather_set").addClass("hidden");
                        if (weatherIntervalId == "") {
                            weatherIntervalId = window.setInterval(K, 7200000);
                        }
                    } else {
                        if (Z.r == -1) {
                            loadWeather = false;
                            $("#app_weather_loading").addClass("hidden");
                            $("#app_weather_error").addClass("hidden");
                            $("#app_weather_refresh").addClass("hidden");
                            $("#app_weather_set").removeClass("hidden");
                        } else {
                            if (Z.r == -2) {
                                city = Z.city;
                                loadWeather = false;
                                $("#app_weather_loading").addClass("hidden");
                                $("#app_weather_set").addClass("hidden");
                                $("#app_weather_error").removeClass("hidden");
                                $("#app_weather_refresh").removeClass("hidden");
                            } else {
                                if (Z.r == -99) {
                                    noSession();
                                }
                            }
                        }
                    }
                    var Y = $(document).height();
                    $("#coverDiv3").height(Y);
                } catch(aa) {
                    $("#app_weather_loading").addClass("hidden");
                    $("#app_weather_set").addClass("hidden");
                    $("#app_weather_error").removeClass("hidden");
                    $("#app_weather_refresh").removeClass("hidden");
                }
            },
            error: function(Z, aa, Y) {
                $("#app_weather_loading").addClass("hidden");
                $("#app_weather_set").addClass("hidden");
                $("#app_weather_error").removeClass("hidden");
                $("#app_weather_refresh").removeClass("hidden");
            }
        });
    }
    function y(Z) {
        $("#appStore_" + Z).addClass("hasAddSub");
        switch (Z) {
        case "tuan":
            if (typeof($("#app_tuan")) != "undefined") {
                tuan_city = "";
                $("#app_tuan_return").click(function() {
                    $("#app_tuan_set").addClass("hidden");
                    $("#app_tuan_return").addClass("hidden");
                    $("#app_tuan_content").removeClass("hidden");
                });
                $("#app_tuan_edit").click(function() {
                    $("#app_tuan_content").addClass("hidden");
                    $("#app_tuan_error").addClass("hidden");
                    $("#app_tuan_set").removeClass("hidden");
                    if (tuan_city != "") {
                        $("#app_tuan_return").show();
                        $("#app_tuan_city_select").attr("value", tuan_city);
                    }
                });
                $("#app_tuan_btn").click(function() {
                    $("#app_tuan_set").addClass("hidden");
                    $("#app_tuan_error").addClass("hidden");
                    $("#app_tuan_loading").removeClass("hidden");
                    $.ajax({
                        type: "POST",
                        url: "app/tuanSet",
                        dataType: "json",
                        data: {
                            p: $("#app_tuan_city_select").val()
                        },
                        success: function(aa, ab) {
                            if (aa.r == 1) {
                                tuan_city = $("#app_tuan_city_select").val();
                                t();
                            } else {
                                if (aa.r == -99) {
                                    noSession();
                                } else {
                                    $("#app_tuan_loading").addClass("hidden");
                                    $("#app_tuan_set").addClass("hidden");
                                    $("#app_tuan_error").show();
                                }
                            }
                        },
                        error: function(ab, ac, aa) {
                            $("#app_tuan_loading").addClass("hidden");
                            $("#app_tuan_set").addClass("hidden");
                            $("#app_tuan_error").removeClass("hidden");
                            showError("");
                        }
                    });
                });
                $("#app_tuan_set").addClass("hidden");
                $("#app_tuan_error").addClass("hidden");
                $("#app_tuan_loading").removeClass("hidden");
                var Y = $(document).height();
                $("#coverDiv3").height(Y);
                setTimeout(L, 10);
            }
            break;
        case "notes":
            if (typeof($("#app_notes")) != "undefined") {
                $("#app_notes_content textarea").die("click");
                $("#app_notes_content textarea").live("click",
                function() {
                    $("#app_notes_content textarea").removeClass("focusStyle");
                    if ($("#app_notes_content textarea").length > 1) {
                        $("#app_notes_del").show();
                    }
                    $(this).addClass("focusStyle");
                    return false;
                });
                $("#app_notes_content textarea").die("focus");
                $("#app_notes_content textarea").live("focus",
                function() {
                    $(this).trigger("click");
                });
                $("#app_notes_content textarea").die("focusout");
                $("#app_notes_content textarea").live("focusout",
                function() {
                    var aa = $(this)[0].id.split("_")[2];
                    var ab = $(this).val();
                    if (notesArray[aa] != ab) {
                        $.ajax({
                            type: "POST",
                            url: "app/updateNotes",
                            dataType: "json",
                            data: {
                                id: aa,
                                c: ab
                            },
                            success: function(ac, ad) {
                                if (ac.r == 1) {
                                    notesArray[aa] = ab;
                                } else {
                                    if (ac.r == -99) {
                                        noSession();
                                    } else {
                                        showError("便签更新失败");
                                    }
                                }
                            },
                            error: function(ad, ae, ac) {
                                showError("");
                            }
                        });
                    }
                });
                $("#app_notes_add").click(function() {
                    $.ajax({
                        type: "POST",
                        url: "app/addNotes",
                        dataType: "json",
                        success: function(ad, af) {
                            if (ad.r == 1) {
                                notesArray[ad.id] = "";
                                var ae = $("#app_notes_content:has(ul)").length;
                                if (ae == 0) {
                                    $("#app_notes_content").prepend("<ul></ul>");
                                }
                                var aa = $('<textarea id="app_notes_' + ad.id + '"></textarea>');
                                var ac = $("<li></li>").append(aa);
                                $("#app_notes_content > ul").append(ac);
                                aa.elastic();
                                if ($("#app_notes_content textarea").length >= 10) {
                                    $("#app_notes_add").hide();
                                }
                                $("#app_notes_" + ad.id).focus();
                                var ab = $(document).height();
                                $("#coverDiv3").height(ab);
                            } else {
                                if (ad.r == -99) {
                                    noSession();
                                } else {
                                    showError("便签添加失败");
                                }
                            }
                        },
                        error: function(ab, ac, aa) {
                            showError("");
                        }
                    });
                });
                $("#app_notes_del").click(function() {
                    $("#app_notes_content textarea").each(function() {
                        if ($(this).hasClass("focusStyle")) {
                            var aa = $(this)[0].id.split("_")[2];
                            $.ajax({
                                type: "POST",
                                url: "app/delNotes",
                                dataType: "json",
                                data: {
                                    id: parseInt(aa)
                                },
                                success: function(ab, ac) {
                                    if (ab.r == 1) {
                                        $("#app_notes_" + aa).parent().remove();
                                        delete notesArray[aa];
                                        if ($("#app_notes_content textarea").length < 10) {
                                            $("#app_notes_add").show();
                                        }
                                    } else {
                                        if (ab.r == -99) {
                                            noSession();
                                        } else {
                                            showError("便签删除失败");
                                        }
                                    }
                                },
                                error: function(ac, ad, ab) {
                                    showError("");
                                }
                            });
                        }
                    });
                });
                var Y = $(document).height();
                $("#coverDiv3").height(Y);
                setTimeout(P, 10);
            }
            break;
        case "news":
            if (typeof($("#app_news")) != "undefined") {
                rss = "";
                $("#app_news_return").click(function() {
                    $("#app_news_set").addClass("hidden");
                    $("#app_news_return").addClass("hidden");
                    $("#app_news_content").removeClass("hidden");
                });
                $("#app_news_edit").click(function() {
                    $("#app_news_content").addClass("hidden");
                    $("#app_news_error").addClass("hidden");
                    $("#app_news_set").removeClass("hidden");
                    if (rss != "") {
                        $("#app_news_return").show();
                        $("#app_news_rss_select").attr("value", rss);
                    }
                });
                $("#app_news_btn").click(function() {
                    $("#app_news_set").addClass("hidden");
                    $("#app_news_error").addClass("hidden");
                    $("#app_news_loading").removeClass("hidden");
                    $.ajax({
                        type: "POST",
                        url: "app/newsSet",
                        dataType: "json",
                        data: {
                            p: $("#app_news_rss_select").val()
                        },
                        success: function(aa, ab) {
                            if (aa.r == 1) {
                                rss = $("#app_news_rss_select").val();
                                D();
                                if (newsIntervalId == "") {
                                    newsIntervalId = window.setInterval(D, 600000);
                                }
                            } else {
                                if (aa.r == -99) {
                                    noSession();
                                } else {
                                    $("#app_news_loading").addClass("hidden");
                                    $("#app_news_set").addClass("hidden");
                                    $("#app_news_error").show();
                                }
                            }
                        },
                        error: function(ab, ac, aa) {
                            $("#app_news_loading").addClass("hidden");
                            $("#app_news_set").addClass("hidden");
                            $("#app_news_error").removeClass("hidden");
                            showError("");
                        }
                    });
                });
                $("#app_news_set").addClass("hidden");
                $("#app_news_error").addClass("hidden");
                $("#app_news_loading").removeClass("hidden");
                var Y = $(document).height();
                $("#coverDiv3").height(Y);
                setTimeout(V, 10);
            }
            break;
        case "translate":
            if (typeof($("#app_translate")) != "undefined") {
                $("#app_translate_text").elastic();
                $("#app_translate_text").focusin(function() {
                    $(this).addClass("foucsStyle");
                });
                $("#app_translate_text").focusout(function() {
                    $(this).removeClass("foucsStyle");
                });
                $("#app_translate_text").watermark({
                    text: "请输入需要翻译的文字。"
                });
                $("#app_translate_text").keyup(function() {
                    var aa = $(this).val();
                    if (aa != "") {
                        bingTranslate(aa);
                    } else {
                        $("#app_translate_result").text("");
                    }
                });
                var Y = $(document).height();
                $("#coverDiv3").height(Y);
            }
            break;
        case "weather":
            if (typeof($("#app_weather")) != "undefined") {
                city = "";
                $("#app_weather_return").click(function() {
                    $("#app_weather_set").addClass("hidden");
                    $("#app_weather_return").addClass("hidden");
                    $("#app_weather_content").removeClass("hidden");
                });
                $("#app_weather_refresh").live("click",
                function() {
                    $("#app_weather_set").addClass("hidden");
                    $("#app_weather_error").addClass("hidden");
                    $("#app_weather_refresh").addClass("hidden");
                    $("#app_weather_loading").removeClass("hidden");
                    K();
                });
                $("#app_weather_edit").click(function() {
                    $("#app_weather_content").addClass("hidden");
                    $("#app_weather_error").addClass("hidden");
                    $("#app_weather_refresh").addClass("hidden");
                    $("#app_weather_set").removeClass("hidden");
                    if (city != "") {
                        if (loadWeather == true) {
                            $("#app_weather_return").show();
                        }
                        $("#app_weather_city_select").attr("value", city);
                    }
                });
                $("#app_weather_btn").click(function() {
                    $("#app_weather_set").addClass("hidden");
                    $("#app_weather_error").addClass("hidden");
                    $("#app_weather_refresh").addClass("hidden");
                    $("#app_weather_loading").removeClass("hidden");
                    $.ajax({
                        type: "POST",
                        url: "app/weather_set",
                        dataType: "json",
                        data: {
                            p: $("#app_weather_city_select").val()
                        },
                        success: function(aa, ab) {
                            if (aa.r == 1) {
                                K();
                            } else {
                                if (aa.r == -99) {
                                    noSession();
                                } else {
                                    $("#app_weather_loading").addClass("hidden");
                                    $("#app_weather_set").addClass("hidden");
                                    $("#app_weather_error").removeClass("hidden");
                                    $("#app_weather_refresh").removeClass("hidden");
                                }
                            }
                        },
                        error: function(ab, ac, aa) {
                            $("#app_weather_loading").addClass("hidden");
                            $("#app_weather_set").addClass("hidden");
                            $("#app_weather_error").removeClass("hidden");
                            $("#app_weather_refresh").removeClass("hidden");
                            showError("");
                        }
                    });
                });
                $("#app_weather_set").addClass("hidden");
                $("#app_weather_error").addClass("hidden");
                $("#app_weather_refresh").addClass("hidden");
                $("#app_weather_loading").removeClass("hidden");
                var Y = $(document).height();
                $("#coverDiv3").height(Y);
                setTimeout(K, 10);
            }
            break;
        default:
        }
    }
    function f(Z) {
        app_sort = Z;
        $(".appHead").live("mouseenter",
        function() {
            $(this).addClass("mHover");
        });
        $(".appHead").live("mouseleave",
        function() {
            $(this).removeClass("mHover");
        });
        $("#appArea .appHead .delRecIcon").live("click",
        function() {
            if ($("#appArea").find(".appBox").length <= 1) {
                var ac = $(document).height();
                $("#coverDiv2").height(ac);
                $("#noDelText").text("必须保留至少一个应用！");
                $("#noDelClassfyAlert").removeClass("hidden");
                return;
            }
            delApp = $(this)[0].id.split("_")[1];
            $("#closeTempInfo").hide();
            var ac = $(document).height();
            $("#coverDiv4").height(ac);
            $("#confirmCloseApp").removeClass("hidden");
            return false;
        });
        $("#app_ad_close").live("click",
        function() {
            $("#adBox").addClass("hidden");
            $.cookie("ad", "close", {
                expires: 100,
                path: "/"
            });
            return false;
        });
        r();
        $("#aAddbtn").live("click",
        function() {
            var ac = $(document).height();
            $("#coverDiv3").height(ac);
            $("#addAppWin").removeClass("hidden");
            return false;
        });
        $("#addAppClose").live("click",
        function() {
            $("#addAppWin").addClass("hidden");
            return false;
        });
        $("#cancelCloseApp,#cancelCloseApp1").click(function() {
            delApp = "";
            $("#confirmCloseApp").addClass("hidden");
            return false;
        });
        $("#sureCloseApp").click(function() {
            $.ajax({
                type: "POST",
                timeout: 10000,
                url: "app/close",
                dataType: "json",
                data: {
                    n: delApp
                },
                success: function(ac, ad) {
                    if (ac.r == 1) {
                        $("#app_" + delApp).remove();
                        $("#appStore_" + delApp).removeClass("hasAddSub");
                        $("#js_" + delApp).remove();
                        switch (aa[Y]) {
                        case "news":
                            window.clearInterval(newsIntervalId);
                            break;
                        case "weather":
                            window.clearInterval(weatherIntervalId);
                            break;
                        }
                    } else {
                        if (ac.r == -99) {
                            noSession();
                        } else {
                            showError("应用关闭失败");
                        }
                    }
                },
                error: function(ad, ae, ac) {
                    delApp = "";
                    showError("");
                }
            });
            $("#confirmCloseApp").addClass("hidden");
            return false;
        });
        var ab = true;
        $(".startAppBtn").live("click",
        function() {
            if (ab) {
                ab = false;
                var ac = $(this)[0].id.split("_")[1];
                $.ajax({
                    type: "POST",
                    timeout: 10000,
                    url: "app/open",
                    dataType: "json",
                    data: {
                        n: ac
                    },
                    success: function(ad, ae) {
                        ab = true;
                        if (ad.r == 1) {
                            $("#appArea").append(ad.appHtml);
                            $("#btn-show-app").trigger("click");
                            y(ac);
                            r();
                        } else {
                            if (ad.r == -99) {
                                noSession();
                            } else {
                                showError("应用添加失败");
                            }
                        }
                    },
                    error: function(ae, af, ad) {
                        ab = true;
                        showError("");
                    }
                });
            }
        });
        if (app_sort != "") {
            var aa = app_sort.toString().split(",");
            for (var Y = 0; Y < aa.length; Y++) {
                y(aa[Y]);
            }
        }
    }
    function F(ae) {
        var aa = $.cookie("grouphidden") == null ? "": $.cookie("grouphidden");
        var af = false;
        if (aa.indexOf(ae + ",") > -1) {
            af = true;
        }
        var ad = "";
        var Z = _groupArray[ae].name;
        ad += '<div class="labelBox ' + (af ? "miniBox": "") + '" id="' + ae + 'g"><div class="labelHead"><div class="labelHeadDefault " id="' + ae + 'gh"><span id="' + ae + 'gd" class="delRecIcon" title="删除分类"></span><span id="' + ae + 'ge" class="modRecIcon" title="编辑分类名称"></span><span title="收起分类" class="upIcon ' + (af ? "hidden": "") + '" id="' + ae + 'gu"></span><span title="展开分类" class="downIcon ' + (af ? "": "hidden") + '" id="' + ae + 'gw"></span><h4 id="' + ae + 'gt">' + Z + '</h4></div></div><div id="' + ae + 'gdiv" ' + (af ? 'style="display:none";': "") + '><ul class="labelContent" id="' + ae + 'gul" >';
        if (_groupArray[ae].sort == "") {
            ad += '<li class="emptyli hidden"></li>';
        } else {
            var Y = _groupArray[ae].sort.toString().split(",");
            for (var ac = 0; ac < Y.length; ac++) {
                var ab = _bookmarkArray[Y[ac]];
                if (ab != null) {
                    var ag = '<li class="bitem" id="' + ab.i + 'b"><div class="textLabel" id="' + ab.i + 'bl"><span id="' + ab.i + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + ab.i + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + ab.i + 'icon" class="favIcon defaultIcon" ';
                    if (ab.p == "1") {
                    	//alert("模块！");
                    	ag += 'style="background:url(http://' + ab.d + '/favicon.ico) no-repeat;background-size:contain;"';
                        //ag += 'style="background:url(/'+(window.location+'').split('/')[3]+'/css/bgimages/default.ico,http://' + ab.d + '/favicon.ico) no-repeat;"';
                    }
                    ag += '></span><div class="bookmarkLabel"><a  class="bma" id="' + ab.i + 'a" target="_blank" href="' + ab.u + '" title="' + ((ab.m != "") ? "[" + ab.m + "] ": "") + ab.t + '">' + ab.t + "</a></div></div></li>";
                    ad += ag;
                }
            }
        }
        ad += '</ul><a id="' + ae + 'ga" href="javascript:;"  onclick="return false" hidefocus="ture" class="allBmBbtn iconBgImages"></a></div></div>';
        return ad;
    }
    function o(ac) {
        var ab = '<div id="' + ac + 'gDiv" class="bmark-list hidden"><div class="hd"><span class="delRecIcon" title="删除分类" id="' + ac + 'gd"></span><span class="modRecIcon" title="编辑分类" id="' + ac + 'ge"></span><h3 id="' + ac + 'h3">' + _groupArray[ac].name + '</h3></div><div class="bd"><ul class="bmark-list-ul" id="' + ac + 'gul">';
        if (_groupArray[ac].sort == "") {
            ab += '<li class="emptyli"><div class="init">还没有任何书签，立即<a href="#" id="emptyAdd">添加</a></div></li>';
        } else {
            var Z = _groupArray[ac].sort.toString().split(",");
            for (var aa = 0; aa < Z.length; aa++) {
                var Y = _bookmarkArray[Z[aa]];
                if (Y != null) {
                    var ad = '<li id="' + Y.i + 'b"><div class="bmark-main" id="' + Y.i + 'bl"><span id="' + Y.i + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + Y.i + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + Y.i + 'icon" class="favIcon defaultIcon" ';
                    if (Y.p == "1") {
                    	//alert("列表!");
                        ad += 'style="background:url(http://' + Y.d + '/favicon.ico) no-repeat;background-size:contain;"';
                    }
                    ad += '></span><div class="bmark-name"><a  class="bma" id="' + Y.i + 'a" target="_blank" href="' + Y.u + '">' + Y.t + "</a></div></div>";
                    if (Y.m != "") {
                        ad += '<p class="bmark-mark">备注：<span>' + Y.m + "</span></p>";
                    }
                    ad += '<p class="bmark-url">' + Y.u + '</p><div id="s' + Y.i + '" class="area-share hidden"><span>分享到</span><a href="#" title="新浪微博" class="btn-sina btn-sina1"></a><a href="#" title="腾讯微博" class="btn-t-qq btn-t-qq1"></a><a href="#" title="qq空间" class="btn-qzone btn-qzone1"></a></div></li>';
                    ab += ad;
                }
            }
        }
        ab += "</ul></div></div>";
        return ab;
    }
    function q(aj) {
        var ah = '<div id="hotbox" class="box-s1 layout-s1">';
        var al = 0;
        var ag = new Array();
        var an = 0;
        for (var ak in _bookmarkArray) {
            var am = _bookmarkArray[ak];
            if (am != null) {
                ag[al++] = am;
                an += parseInt(am.h);
            }
        }
        ag.sort(function(ar, aq) {
            return aq.h - ar.h;
        });
        var ad = ag.length > 0 ? ag[0].h: 0;
        var af = "";
        var ae = "";
        var ac = "";
        var ab = "";
        var aa = "";
        var Z = "";
        var ai = 0;
        for (var al = 0; al < ag.length; al++) {
            var Y = '<li class="bitem" id="' + ag[al].i + 'b"><div class="textLabel" id="' + ag[al].i + 'bl"><span id="' + ag[al].i + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + ag[al].i + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + ag[al].i + 'sh" class="shareRecIcon" title="分享书签"></span><span id="' + ag[al].i + 'icon" class="favIcon defaultIcon" ';
            if (ag[al].p == "1") {
            	alert("未知1！");
                Y += 'style="background:url(http://' + ag[al].d + '/favicon.ico) no-repeat;"';
            }
            Y += '></span><div class="bookmarkLabel"><a  class="bma" id="' + ag[al].i + 'a" target="_blank" href="' + ag[al].u + '" title="' + ((ag[al].m != "") ? "[" + ag[al].m + "] ": "") + ag[al].t + '">' + ag[al].t + "</a></div></div></li>";
            if (ag[al].h > 0) {
                if (al < 12) {
                    af += Y;
                } else {
                    if (al < 24) {
                        ae += Y;
                    } else {
                        if (al < 36) {
                            ac += Y;
                        } else {
                            if (al < 48) {
                                ab += Y;
                            } else {
                                if (al < 60) {
                                    aa += Y;
                                }
                            }
                        }
                    }
                }
            } else {
                Z += Y;
                ai++;
            }
        }
        if (af != "") {
            var ap = '<div class="item"><div class="hd"><h3>热度<span class="hot hot-s1"></span></h3></div><div class="bd"><ul class="bmark-list-ul">' + af + "</ul></div></div>";
            af = ap;
        }
        if (ae != "") {
            var ap = '<div class="item"><div class="hd"><h3>热度<span class="hot hot-s2"></span></h3></div><div class="bd"><ul class="bmark-list-ul">' + ae + "</ul></div></div>";
            ae = ap;
        }
        if (ac != "") {
            var ap = '<div class="item"><div class="hd"><h3>热度<span class="hot hot-s3"></span></h3></div><div class="bd"><ul class="bmark-list-ul">' + ac + "</ul></div></div>";
            ac = ap;
        }
        if (ab != "") {
            var ap = '<div class="item"><div class="hd"><h3>热度<span class="hot hot-s4"></span></h3></div><div class="bd"><ul class="bmark-list-ul">' + ab + "</ul></div></div>";
            ab = ap;
        }
        if (aa != "") {
            var ap = '<div class="item"><div class="hd"><h3>热度<span class="hot hot-s5"></span></h3></div><div class="bd"><ul class="bmark-list-ul">' + aa + "</ul></div></div>";
            aa = ap;
        }
        if (Z != "") {
            var ao = "";
            if (ai > 12) {
                ao = '<a class="more" href="#">查看更多</a><a class="simple" href="#">收起部分</a>';
            }
            var ap = '<div class="item ' + (ao != "" ? "hide-more": "") + '"><div class="hd"><h3>' + ao + '从未使用<span class="hot hot-s6"></span></h3></div><div class="bd"><ul id="group6"  class="bmark-list-ul">' + Z + "</ul></div></div>";
            Z = ap;
        }
        var ap = af + ae + ac + ab + aa + Z;
        if (ap == "") {
            ap = '<div class="init">还没有任何书签，立即<a href="#" id="emptyAdd">添加</a></div>';
        }
        ah += ap + "</div>";
        $("#main").fadeOut("fast",
        function() {
            $("#main").html(ah);
            $("#main").fadeIn("fast");
        });
    }
    function J(ag) {
        var ae = '<div id="timebox" class="box-s1 layout-s1">';
        var al = 0;
        var aa = new Array();
        var ao = 0;
        for (var ah in _bookmarkArray) {
            var an = _bookmarkArray[ah];
            if (an != null) {
                aa[al++] = an;
            }
        }
        aa.sort(function(au, at) {
            return at.i - au.i;
        });
        var ar = new Date();
        var Z = ar.format("mmmm");
        var ai = "";
        var aq = "";
        var ab = "";
        var aj = 0;
        var Y = "";
        var af = false;
        for (var al in aa) {
            var ak = new Date(Date.parse(aa[al].a.replace(/-/g, "/")));
            var ad = ak.format("mmmm");
            if (ad != ai) {
                if (aq != "") {
                    var ap = "";
                    if (aj > 12) {
                        ap = '<a class="more" href="#">查看更多</a><a class="simple" href="#">收起部分</a>';
                    }
                    if (af) {
                        af = false;
                        ab += '<div class="item ' + (ap != "" ? " hide-more": "") + '"><div class="hd"><h3>' + ap + Y + '<span id="firstMonthTotal" class="total">[' + aj + ']</span></h3></div><div class="bd"><ul class="bmark-list-ul" id="firstMonth">' + aq + "</ul></div></div>";
                    } else {
                        ab += '<div class="item ' + (ap != "" ? " hide-more": "") + '"><div class="hd"><h3>' + ap + Y + '<span class="total">[' + aj + ']</span></h3></div><div class="bd"><ul class="bmark-list-ul">' + aq + "</ul></div></div>";
                    }
                    aq = "";
                    aj = 0;
                }
                var ac = ak.format("m");
                var am = ak.format("yyyy");
                ai = ad;
                if (ad == Z) {
                    Y = "今月 " + ad;
                    af = true;
                } else {
                    if (aa[al].a == "2010-01-01 00:00:01") {
                        Y = "较早前";
                    } else {
                        Y = am + " " + ac + "月 " + ad;
                    }
                }
            }
            aj++;
            aq += '<li class="bitem" id="' + aa[al].i + 'b"><div class="textLabel" id="' + aa[al].i + 'bl"><span id="' + aa[al].i + 'bd" title="删除书签" class="delRecIcon"></span><span id="' + aa[al].i + 'be"  title="编辑书签" class="modRecIcon"></span><span id="' + aa[al].i + 'sh" class="shareRecIcon" title="分享书签"></span><span id="' + aa[al].i + 'icon" class="favIcon defaultIcon" ';
            if (aa[al].p == "1") {
            	alert("未知2！");
                aq += 'style="background:url(http://' + aa[al].d + '/favicon.ico) no-repeat;"';
            }
            aq += '></span><div class="bookmarkLabel"><a  class="bma" id="' + aa[al].i + 'a" target="_blank" href="' + aa[al].u + '" title="' + ((aa[al].m != "") ? "[" + aa[al].m + "] ": "") + aa[al].t + '">' + aa[al].t + "</a></div></div></li>";
        }
        var ap = "";
        if (aj > 12) {
            ap = '<a class="more" href="#">查看更多</a><a class="simple" href="#">收起部分</a>';
        }
        if (aa.length > 0) {
            if (af) {
                af = false;
                ab += '<div class="item' + (ap != "" ? " hide-more": "") + '"><div class="hd"><h3>' + ap + Y + '<span id="firstMonthTotal" class="total">[' + aj + ']</span></h3></div><div class="bd"><ul class="bmark-list-ul" id="firstMonth">' + aq + "</ul></div></div>";
            } else {
                ab += '<div class="item' + (ap != "" ? " hide-more": "") + '"><div class="hd"><h3>' + ap + Y + '<span class="total">[' + aj + ']</span></h3></div><div class="bd"><ul class="bmark-list-ul">' + aq + "</ul></div></div>";
            }
        } else {
            ab = '<div class="init">还没有任何书签，立即<a href="#" id="emptyAdd">添加</a></div>';
        }
        ae += ab + "</div>";
        $("#main").fadeOut("fast",
        function() {
            $("#main").html(ae);
            $("#main").fadeIn("fast");
        });
    }
    function B() {
        var Z = _groupsort.split("|");
        var af = new Array(Z.length);
        var Y = 0;
        var ac = '<div id="catalog" class="catalog box-s1"><div class="sum"><p>收藏书签数：<em id="bCount">' + _bCount + '</em>分类：<em id="gCount">' + _gCount + '</em></p></div><div class="classify"><div class="hd"><h3>我的分类</h3></div><div class="bd"><ul id="catalogul">';
        for (var ab = 0; ab < Z.length; ab++) {
            af[ab] = Z[ab].toString().split(",");
            if (af[ab].length > Y) {
                Y = af[ab].length;
            }
        }
        var aa = "";
        var ae = "";
        for (var ab = 1; ab < Y; ab++) {
            if (ab < af[0].length) {
                var ad = af[0][ab];
                if (_groupArray[ad] != null) {
                    if (ae == "") {
                        ae = ad;
                    }
                    ac += '<li><a class="catalog_a" id="' + ad + 'g" href="#">' + _groupArray[ad].name + "</a></li>";
                    aa += o(ad);
                }
            }
            if (ab < af[1].length) {
                var ad = af[1][ab];
                if (_groupArray[ad] != null) {
                    if (ae == "") {
                        ae = ad;
                    }
                    ac += '<li><a class="catalog_a" id="' + ad + 'g" href="#">' + _groupArray[ad].name + "</a></li>";
                    aa += o(ad);
                }
            }
            if (ab < af[2].length) {
                var ad = af[2][ab];
                if (_groupArray[ad] != null) {
                    if (ae == "") {
                        ae = ad;
                    }
                    ac += '<li><a class="catalog_a" id="' + ad + 'g" href="#">' + _groupArray[ad].name + "</a></li>";
                    aa += o(ad);
                }
            }
        }
        ac += "</ul></div></div>" + aa + "</div>";
        $("#main").fadeOut("fast",
        function() {
            $("#main").html(ac);
            if (ae != "") {
                $("#" + ae + "g").addClass("cur");
                $("#" + ae + "gDiv").removeClass("hidden");
            }
            $("#main").fadeIn("fast");
        });
    }
    function c() {
        var ab = '<ul class="labelLayout" id="labelLayout">';
        var Z = _groupsort.toString().split("|");
        var ac = new Array(Z.length);
        var Y = 0;
        for (var aa = 0; aa < Z.length; aa++) {
            ac[aa] = Z[aa].toString().split(",");
            if (ac[aa].length > Y) {
                Y = ac[aa].length;
            }
            ab += '<li class="column" id="' + ac[aa][0] + '"></li>';
        }
        ab += "</ul>";
        $("#main").fadeOut("fast",
        function() {
            $("#main").html(ab);
            for (var ad = 1; ad < Y; ad++) {
                if (ad < ac[0].length) {
                    var ae = ac[0][ad];
                    if (_groupArray[ae] != null) {
                        $("#c1").append(F(ae));
                    }
                }
                if (ad < ac[1].length) {
                    var ae = ac[1][ad];
                    if (_groupArray[ae] != null) {
                        $("#c2").append(F(ae));
                    }
                }
                if (ad < ac[2].length) {
                    var ae = ac[2][ad];
                    if (_groupArray[ae] != null) {
                        $("#c3").append(F(ae));
                    }
                }
            }
            $("#main").fadeIn("fast",
            function() {
                Q();
                H();
            });
        });
    }
    function N(aa) {
        var Z = $.cookie("layout_type");
        switch (Z) {
        case "1":
            c();
            break;
        case "2":
            B();
            break;
        case "3":
            q();
            break;
        case "4":
            J();
            break;
        default:
        }
        /*if (Z != "4" && aa > 0) {
            var Y = (new Date()).format("yyyymmdd");
            if ($.cookie("isshowcount") != null) {
                if ($.cookie("isshowcount") != Y) {
                    if (aa > 99) {
                        aa = "99+";
                    }
                    $(".set-layout").append('<div class="tips" id="preCount">' + aa + "</div>");
                }
            } else {
                if (aa > 99) {
                    aa = "99+";
                }
                $(".set-layout").append('<div class="tips" id="preCount">' + aa + "</div>");
            }
        }*/
    }
    $(".more").live("click",
    function() {
        $(this).parent().parent().parent().removeClass("hide-more");
        return false;
    });
    $(".simple").live("click",
    function() {
        $(this).parent().parent().parent().addClass("hide-more");
        return false;
    });
    $(".content")[0].id = "single";
    $.ajax({
        type: "GET",
        url: $("#projpath").val()+"/other.do?opeaCode=GetData",
        dataType: "json",
        success: function(ac, Z) {
            if (ac.r == -99) {} else {
                _groupsort = ac.gs;
                _gCount = ac.g.length;
                _bCount = ac.b.length;
                for (var ad = 0; ad < ac.g.length; ad++) {
                    _groupArray[ac.g[ad].id] = ac.g[ad];
                }
                var af = $.now();
                af = (af - 86400000 * 1);
                var aa = new Date(af);
                aa = aa.format("yyyy-mm-dd");
                var Y = 0;
                for (var ad = 0; ad < ac.b.length; ad++) {
                    _bookmarkArray[ac.b[ad].i] = ac.b[ad];
                    var ag = new Date(Date.parse(ac.b[ad].a.replace(/-/g, "/")));
                    ag = ag.format("yyyy-mm-dd");
                    if (aa == ag) {
                        Y++;
                    }
                }
                $(".sidebar").append('<div class="add-app"><a href="#" id="aAddbtn" hidefocus="ture" class="btn-add-app iconBgImages">添加应用</a></div>');
                $("#appArea").prepend(ac.ah);
                N(Y);
                $(".labelContent li").live("mouseenter",
                function() {
                    $(this).addClass("mHover");
                });
                $(".labelContent li").live("mouseleave",
                function() {
                    $(this).removeClass("mHover");
                });
                $(".labelContent li .delRecIcon").live("click",
                function() {
                    if (hasUpdate_group) {
                        A();
                    }
                    if (hasUpdate_bookmark) {
                        k();
                    }
                    var ah = $(this);
                    var ai = parseInt(ah[0].id);
                    if ($("#" + ai + "b").find("#shareDiv").length > 0) {
                        i();
                    }
                    //if(ai<1000){
                    //	alert("不可删除常用收藏！");
                    //	return false;
                    //}
                    $.ajax({
                        type: "POST",
                        url: $("#projpath").val()+"/other.do?opeaCode=DelFav",
                        dataType: "json",
                        data: {
                            bid: ai
                        },
                        success: function(al, am) {
                            if (al.r == 1) {
                                var ak = $("#" + ai + "b").parent()[0].id;
                                $("#" + ai + "b").remove();
                                var aj = parseInt(ak);
                                _groupArray[aj].sort = _groupArray[aj].sort.replace("," + ai, "");
                                _groupArray[aj].sort = _groupArray[aj].sort.replace(ai + ",", "");
                                _groupArray[aj].sort = _groupArray[aj].sort.replace(ai, "");
                                _bookmarkArray[ai] = null;
                                if ($("#" + ak).find("li").length < 1) {
                                    $("#" + ak).append('<li class="emptyli hidden"></li>');
                                }
                                _bCount--;
                            } else {
                                if (al.r == -99) {
                                    onSession();
                                } else {
                                    showError("书签删除失败");
                                }
                            }
                        },
                        error: function(ak, al, aj) {
                            showError("");
                        }
                    });
                });
                $(".labelContent li .textLabel").live("dblclick", O);
                $(".labelContent li .modRecIcon").live("click", O);
                $("#editLabelClose").bind("click",
                function() {
                    if (I) {
                        u();
                    }
                    return false;
                });
                $(".allBmBbtn").live("click", g);
                $("#addLabelBtn").live("click", s);
                $("#addLabelClose").live("click",
                function() {
                    if (addLabelBtnFlag) {
                        W();
                    }
                    return false;
                });
                $("#alabelValue").focus(function() {
                    $("#alabelValueInput").removeClass("input-txt-error");
                    $("#addLabelErrorTips").hide();
                    $("#alabelValueInput").addClass("input-txt-focus");
                });
                $("#alabelValue").focusout(function() {
                    $("#alabelValueInput").removeClass("input-txt-focus");
                });
                $("#alabelName").focus(function() {
                    $("#alabelNameInput").removeClass("input-txt-error");
                    $("#addLabelErrorTips").hide();
                    $("#alabelNameInput").addClass("input-txt-focus");
                });
                $("#alabelName").focusout(function() {
                    $("#alabelNameInput").removeClass("input-txt-focus");
                });
                $("#alabelMemo").focus(function() {
                    $("#alabelMemoInput").addClass("input-txt-focus");
                });
                $("#alabelMemo").focusout(function() {
                    $("#alabelMemoInput").removeClass("input-txt-focus");
                });
                $("#qValue").focus(function() {
                    $("#qValueLabel").addClass("input-txt-focus");
                    U("#qValueLabel", "#qValueError");
                });
                $("#qValue").focusout(function() {
                    $("#qValueLabel").removeClass("input-txt-focus");
                });
                $("#qName").focus(function() {
                    $("#qNameLabel").addClass("input-txt-focus");
                    U("#qNameLabel", "#qNameError");
                });
                $("#qName").focusout(function() {
                    $("#qNameLabel").removeClass("input-txt-focus");
                });
                $("#qMemo").focus(function() {
                    $("#qMemoLabel").addClass("input-txt-focus");
                    U("#qMemoLabel", "#qMemoError");
                });
                $("#qMemo").focusout(function() {
                    $("#qMemoLabel").removeClass("input-txt-focus");
                });
                $("#qGroup").focus(function() {
                    $("#qGroupLabel").addClass("input-txt-focus");
                    $("#qNewGroup").removeClass("hidden");
                    U("#qGroupLabel", "#qGroupError");
                });
                $("#qGroup").focusout(function() {
                    $("#qGroupLabel").removeClass("input-txt-focus");
                });
                $("#qBtn").bind("click", v);
                $("#qCancel,#qCancel1").bind("click",
                function() {
                    if (l) {
                        T();
                    }
                    return false;
                });
                $("#qValue, #qName").bind("keyup",
                function(ah) {
                    if (ah.keyCode == 13) {
                        $("#qBtn").trigger("click");
                        $("body").focus();
                    }
                });
                $("#qNewGroup").click(function() {
                    $("#qGroupV").val("");
                    $("#qGroup").val("").focus();
                    return false;
                });
                $("#qGroup").yijeeautocomplete({
                    valueE: "#qGroupV",
                    buttonE: "#qListPullDown",
                    resultE: "#qList",
                    valueField: "value",
                    textField: "text",
                    hoverCss: "classfy-list-hover",
                    scroll: true,
                    scrollHeight: 100,
                    submitBtn: "#qBtn",
                    trigger: "click"
                });
                $("#gAddBtn").bind("click", E);
                $("#qAddBtn").bind("click",
                function() {
                    if ($("#qAddArea").hasClass("hidden")) {
                        gArray.length = 0;
                        var aj = "";
                        var ak = "";
                        for (var ai in _groupArray) {
                            if (_groupArray[ai] != null) {
                                gArray.push({
                                    value: _groupArray[ai].id,
                                    text: _groupArray[ai].name
                                });
                            }
                        }
                        if ($.cookie("layout_type") != "2") {} else {
                            if ($.cookie("layout_type") == "2") {
                                $("#catalogul > li > .catalog_a").each(function() {
                                    if (aj == "" && $(this).hasClass("cur")) {
                                        aj = $(this).text();
                                        ak = parseInt($(this)[0].id);
                                    }
                                });
                            }
                        }
                        if (aj != "") {
                            $("#qGroup").val(aj);
                            $("#qGroupV").val(ak);
                        } else {
                            if ($.cookie("qGroup") != "" && $.cookie("qGroup") != null) {
                                $("#qGroup").val($.cookie("qGroup"));
                                $("#qGroupV").val($.cookie("qGroupV"));
                            } else {
                                $("#qGroup").val(gArray[0].text);
                                $("#qGroupV").val(gArray[0].value);
                            }
                        }
                        $("#qGroup").trigger("setOptions", {
                            data: gArray
                        });
                        var ah = $(document).height();
                        $("#coverDiv5").height(ah);
                        $("#qAddTitle").text("添加书签");
                        $("#qAddArea").removeClass("hidden");
                        $("#qNewGroup").removeClass("hidden");
                        $("#qId").val(0);
                        $("#qMemo").val("最多50个字符");
                        if (!$("#qMemo").hasClass("watermarkClass")) {
                            $("#qMemo").addClass("watermarkClass");
                        }
                        $("#qValue").focus();
                    } else {
                        T();
                    }
                    return false;
                });
                $("#labelName").watermark({
                    text: "名称",
                    type: "keypress"
                });
                $("#labelValue").watermark({
                    text: "http://",
                    type: "keypress"
                });
                $("#labelMemo").watermark({
                    text: "备注(最多50个字符)",
                    type: "keypress"
                });
                $("#qValue").watermark({
                    text: "http://"
                });
                $("#qMemo").watermark({
                    text: "最多50个字符"
                });
                $(".input-txt").hover(function() {
                    $(this).addClass("input-txt-hover");
                },
                function() {
                    $(this).removeClass("input-txt-hover");
                });
                $("#labelValue").focus(function() {
                    G("#labelValueInput");
                    $("#labelValueInput").addClass("input-txt-focus");
                });
                $("#labelValue").focusout(function() {
                    $("#labelValueInput").removeClass("input-txt-focus");
                });
                $("#labelName").focus(function() {
                    G("#labelNameInput");
                    $("#labelNameInput").addClass("input-txt-focus");
                });
                $("#labelName").focusout(function() {
                    $("#labelNameInput").removeClass("input-txt-focus");
                });
                $("#labelMemo").focus(function() {
                    $("#labelMemoInput").addClass("input-txt-focus");
                });
                $("#labelMemo").focusout(function() {
                    $("#labelMemoInput").removeClass("input-txt-focus");
                });
                $("#editLabelBtn").bind("click", n);
                $("#labelValue, #labelName,#labelMemo").bind("keyup",
                function(ah) {
                    if (ah.keyCode == 13) {
                        $("#editLabelBtn").trigger("click");
                        $("body").focus();
                    }
                });
                $("#alabelValue, #alabelName,#alabelMemo").bind("keyup",
                function(ah) {
                    if (ah.keyCode == 13) {
                        $("#addLabelBtn").trigger("click");
                        $("body").focus();
                    }
                });
                $(".labelHead").live("mouseenter",
                function() {
                    $(this).addClass("mHover");
                });
                $(".labelHead").live("mouseleave",
                function() {
                    $(this).removeClass("mHover");
                });
                $(".labelHeadDefault  .modRecIcon").live("click", p);
                $("#noDelClassfyBtn,#noDelClassfyBtn2").click(function() {
                    $("#noDelClassfyAlert").addClass("hidden");
                    return false;
                });
                $("#cancelDelClassfy,#cancelDelClassfy1").click(function() {
                    $("#confirmDelClassfy").addClass("hidden");
                    return false;
                });
                $("#sureDelClassfy").click(function() {
                    if (delGroupId != 0) {
                        X(delGroupId);
                        delGroupId = 0;
                    }
                    $("#confirmDelClassfy").addClass("hidden");
                    return false;
                });
                $(".labelHeadDefault  .delRecIcon").live("click", M);
                $(".labelHeadDefault  .upIcon").live("click",
                function() {
                    var ah = $(this);
                    var ai = parseInt(ah[0].id);
                    u();
                    W();
                    i();
                    $("#" + ai + "gdiv").slideUp("fast",
                    function() {
                        $("#" + ai + "g").addClass("miniBox");
                        var aj = $.cookie("grouphidden") == null ? "": $.cookie("grouphidden");
                        if (aj.indexOf(ai + ",") == -1) {
                            $.cookie("grouphidden", aj + ai + ",", {
                                expires: 365,
                                path: "/"
                            });
                        }
                    });
                    return false;
                });
                $(".labelHeadDefault  .downIcon").live("click",
                function() {
                    var ah = $(this);
                    var ai = parseInt(ah[0].id);
                    u();
                    W();
                    i();
                    $("#" + ai + "gdiv").slideDown("fast",
                    function() {
                        $("#" + ai + "g").removeClass("miniBox");
                        var aj = $.cookie("grouphidden") == null ? "": $.cookie("grouphidden");
                        if (aj.indexOf(ai + ",") > -1) {
                            $.cookie("grouphidden", aj.replace(ai + ",", ""), {
                                expires: 365,
                                path: "/"
                            });
                        }
                    });
                    return false;
                });
                $("#editGroupBtn").live("click",
                function() {
                    var ai = $.trim($("#groupValue").val());
                    if (ai == oldGroupName) {
                        S();
                        return;
                    }
                    if (ai != "" && customLen(ai) <= 20) {
                        $.ajax({
                            type: "POST",
                            timeout: 30000,
                            url: $("#projpath").val()+"/other.do?opeaCode=EditMode",
                            dataType: "json",
                            data: {
                                id: editGroupId,
                                name: ai
                            },
                            success: function(aj, ak) {
                                if (aj.r == 1) {
                                    $("#" + editGroupId + "gt").text(ai);
                                    S();
                                } else {
                                    if (aj.r == -99) {
                                        noSession();
                                    } else {
                                        showError("名称修改失败");
                                    }
                                }
                            },
                            error: function(ak, al, aj) {
                                showError("");
                            }
                        });
                    } else {
                        $("#editGroup").addClass("errorTips");
                        var ah = "";
                        if (ai == "") {
                            ah = "必填";
                        } else {
                            ah = "字符超长";
                        }
                        $("#groupErrorTips").text(ah).slideDown(function() {
                            $("#groupValue").focus();
                        });
                    }
                });
                $("#groupValue").live("keyup",
                function(ah) {
                    $("#editGroup").removeClass("errorTips");
                    $("#groupErrorTips").hide();
                    if (ah.keyCode == 13) {
                        $("#editGroupBtn").trigger("click");
                        $("body").focus();
                    }
                });
                $("body").click(function() {
                    m();
                });
                $("#searchTypeBtn").bind("click",
                function() {
                    if ($("#searchList1").is(":hidden")) {
                        $("#searchList1").slideDown("fast");
                    } else {
                        $("#searchList1").slideUp("fast");
                    }
                    if ($("#app_notes_content textarea").hasClass("focusStyle")) {
                        $("#app_notes_content textarea").removeClass("focusStyle");
                        $("#app_notes_del").hide();
                    }
                    return false;
                });
                $("#searchList1 div").bind("click",
                function() {
                    $("#searchList1").slideUp("fast");
                    var ah = $(this).children()[0].className;
                    if (ah != $("#searchIcon")[0].className) {
                        var ai = $("#searchIcon")[0].className.split(" ")[0];
                        ai = ai.substr(0, ai.length - 3);
                        $("#searchIcon").removeClass();
                        $("#searchIcon").addClass($(this).children()[0].className);
                        $("#f" + $(this)[0].id).removeClass("hidden");
                        $("#f" + $(this)[0].id + " .svalue").focus();
                        $("#f" + ai).addClass("hidden");
                        $("#f" + $(this)[0].id + " .svalue").val($("#f" + ai + " .svalue").val());
                        /*$.ajax({
                            type: "POST",
                            timeout: 10000,
                            url: "profile/updateSearchType",
                            dataType: "json",
                            data: {
                                st: $(this)[0].id
                            },
                            success: function(aj, ak) {
                                if (aj.r == -99) {
                                    noSession();
                                } else {
                                    if (aj.r == -1) {
                                        showError("修改失败");
                                    }
                                }
                            },
                            error: function(ak, al, aj) {
                                showError("");
                            }
                        });*/
                    }
                    return false;
                });
                $("#taobaoform,#sosoform,#xunleiform,#yijeeform").submit(function() {
                    var ah = $("#" + this.id + "v");
                    if (ah.val() == "" || this.action == "/") {
                        ah.focus();
                        return false;
                    }
                });
                $("#baiduv").yijeesearchsug({
                    form: "#baiduform",
                    resultDiv: "#searchTips",
                    hoverCss: "ahover",
                    type: "baidu"
                });
                $("#googlev").yijeesearchsug({
                    form: "#googleform",
                    resultDiv: "#searchTips",
                    hoverCss: "ahover",
                    type: "google"
                });
                $("#yijeeformv").yijeesearchsug({
                    form: "#yijeeform",
                    resultDiv: "#searchTips",
                    hoverCss: "ahover",
                    type: "kugou",
                    scrollHeight: 200
                });
                function ab(ai, ah) {
                    var aj = new RegExp("(^|\\?|&)" + ah + "=([^&]*)(\\s|&|$)", "i");
                    if (aj.test(ai)) {
                        return unescape(RegExp.$2.replace(/\+/g, " "));
                    }
                    return "";
                }
                /*$(".bma").live("click",
                function(ai) {
                    ai.stopPropagation();
                    var ak = parseInt($(this)[0].id);
                    var ah = $(this);
                    var aj = ah.attr("href");
                    setTimeout(function() {
                        var an = /g.click.taobao.com/g;
                        var al = aj.match(an);
                        if (al != null && al[0] == "g.click.taobao.com") {
                            var am = ab(aj, "hf");
                            if (am != null && am != "") {
                                aj = am;
                            }
                        }
                        ah.attr("href", aj);
                        w(ak);
                    },
                    500);
                    ah.attr("href", replaceCPS(aj));
                });*/
                /*$(".tuanlink").live("click",
                function(ai) {
                    ai.stopPropagation();
                    var ak = parseInt($(this)[0].id);
                    var ah = $(this);
                    var aj = ah.attr("href");
                    setTimeout(function() {
                        var an = /g.click.taobao.com/g;
                        var al = aj.match(an);
                        if (al != null && al[0] == "g.click.taobao.com") {
                            var am = ab(aj, "hf");
                            if (am != null && am != "") {
                                aj = am;
                            }
                        }
                        ah.attr("href", aj);
                        w(ak);
                    },
                    500);
                    ah.attr("href", replaceCPS(aj));
                });*/
                $(".catalog_a").live("click",
                function() {
                    $(".catalog_a").removeClass("cur");
                    $(".bmark-list").addClass("hidden");
                    $(this).addClass("cur");
                    $("#" + this.id + "Div").removeClass("hidden");
                    return false;
                });
                $(".hd").live("mouseenter",
                function() {
                    $(this).addClass("hover");
                });
                $(".hd").live("mouseleave",
                function() {
                    $(this).removeClass("hover");
                });
                $(".bmark-list-ul li").live("mouseenter",
                function() {
                    $(this).addClass("hover");
                });
                $(".bmark-list-ul li").live("mouseleave",
                function() {
                    $(this).removeClass("hover");
                });
                $("#shareWinClose").bind("click",
                function() {
                    $("#shareWin").addClass("hidden");
                    return false;
                });
                $(".bmark-list-ul li .shareRecIcon").live("click",
                function() {
                    if ($.cookie("layout_type") == 3 || $.cookie("layout_type") == 4) {
                        var ai = $(this).next().outerHTML() + $(this).next().next().outerHTML();
                        $("#shareWinA").html(ai);
                        var ah = $(document).height();
                        $("#coverDiv6").height(ah);
                        $("#shareWin").removeClass("hidden");
                    } else {
                        if ($(this).parent().parent().children(".area-share").length != 0) {
                            var aj = $(this).parent().parent().children(".area-share");
                            if (aj.is(":hidden")) {
                                aj.slideDown("fast");
                            } else {
                                aj.slideUp("fast");
                            }
                        }
                    }
                });
                $("#btn-define").click(function() {
                    if (!$(this).hasClass("define-cur")) {
                        $(this).addClass("define-cur");
                        $("#gAddBtn").addClass("btn-s1");
                        $("#gAddBtn").removeClass("hidden");
                        C(1);
                    }
                    return false;
                });
                $("#btn-list").click(function() {
                    if (!$(this).hasClass("list-cur")) {
                        if (hasUpdate_group) {
                            A();
                        }
                        if (hasUpdate_bookmark) {
                            k();
                        }
                        $(this).addClass("list-cur");
                        $("#gAddBtn").addClass("btn-s1");
                        $("#gAddBtn").removeClass("hidden");
                        C(2);
                    }
                    return false;
                });
                $("#btn-hot").click(function() {
                    if (!$(this).hasClass("hot-cur")) {
                        if (hasUpdate_group) {
                            A();
                        }
                        if (hasUpdate_bookmark) {
                            k();
                        }
                        $(this).addClass("hot-cur");
                        $("#gAddBtn").removeClass("btn-s1");
                        $("#gAddBtn").addClass("hidden");
                        C(3);
                    }
                    return false;
                });
                $("#btn-time").click(function() {
                    if (!$(this).hasClass("time-cur")) {
                        if (hasUpdate_group) {
                            A();
                        }
                        if (hasUpdate_bookmark) {
                            k();
                        }
                        $(this).addClass("time-cur");
                        $("#gAddBtn").removeClass("btn-s1");
                        $("#gAddBtn").addClass("hidden");
                        C(4);
                    }
                    return false;
                });
                $("#btn-show-app").click(function() {
                    if (!$(this).hasClass("show-app-cur")) {
                        $(this).addClass("show-app-cur");
                        $("#btn-hide-app").removeClass("hide-app-cur");
                        $(".content")[0].id = "";
                        z(1);
                    }
                    return false;
                });
                $("#btn-hide-app").click(function() {
                    if (!$(this).hasClass("hide-app-cur")) {
                        $(this).addClass("hide-app-cur");
                        $("#btn-show-app").removeClass("show-app-cur");
                        $(".content")[0].id = "single";
                        z(0);
                    }
                    return false;
                });
                $("#shareWin-sina").live("click",
                function() {
                    var ak = $("#shareWin").find(".bma");
                    var ai = parseInt(ak[0].id);
                    var am = encodeURI(ak.text());
                    var ah = encodeURIComponent("http://www.kugou.com/s?l=" + encodeURIComponent(ak.attr("href")) + "&t=" + am);
                    var al = "2175151211";
                    var aj = "http://service.t.sina.com.cn/share/share.php?url=" + ah + "&appkey=" + al + "&title=" + am + "&pic=&ralateUid=1732503082";
                    window.open(aj, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                    usersharehit(ai, 1);
                    return false;
                });
                $("#shareWin-tencent").live("click",
                function() {
                    var am = $("#shareWin").find(".bma");
                    var ak = parseInt(am[0].id);
                    var ao = encodeURI(am.text());
                    var aj = encodeURIComponent("http://www.kugou.com/s?l=" + encodeURIComponent(am.attr("href")));
                    var an = encodeURI("5da3f2448f3c49a590c83b3299fe2c67");
                    var ai = encodeURI("");
                    var ah = "http://www.kugou.com";
                    var al = "http://v.t.qq.com/share/share.php?title=" + ao + "&url=" + aj + "&appkey=" + an + "&site=" + ah + "&pic=" + ai;
                    window.open(al, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                    usersharehit(ak, 2);
                    return false;
                });
                $("#shareWin-qq").live("click",
                function() {
                    var am = $("#shareWin").find(".bma");
                    var ak = parseInt(am[0].id);
                    var ao = encodeURI(am.text());
                    var aj = encodeURIComponent("http://www.kugou.com/s?l=" + encodeURIComponent(am.attr("href")) + "&t=" + encodeURIComponent(customLen(am.text()) > 20 ? (am.text().substr(0, 20) + "...") : am.text()));
                    var an = encodeURI("5da3f2448f3c49a590c83b3299fe2c67");
                    var ai = encodeURI("");
                    var ah = "http://www.kugou.com";
                    var al = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + aj;
                    window.open(al, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                    usersharehit(ak, 3);
                    return false;
                });
                $(".btn-sina1").live("click",
                function() {
                    var ai = $(this).parent()[0].id.substr(1);
                    var ak = $("#" + ai + "a");
                    var am = encodeURI(ak.text());
                    var ah = encodeURIComponent("http://www.kugou.com/s?l=" + encodeURIComponent(ak.attr("href")) + "&t=" + am);
                    var al = "2175151211";
                    var aj = "http://service.t.sina.com.cn/share/share.php?url=" + ah + "&appkey=" + al + "&title=" + am + "&pic=&ralateUid=1732503082";
                    window.open(aj, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                    usersharehit(ai, 1);
                    return false;
                });
                $(".btn-t-qq1").live("click",
                function() {
                    var ak = $(this).parent()[0].id.substr(1);
                    var am = $("#" + ak + "a");
                    var ao = encodeURI(am.text());
                    var aj = encodeURIComponent("http://www.kugou.com/s?l=" + encodeURIComponent(am.attr("href")));
                    var an = encodeURI("5da3f2448f3c49a590c83b3299fe2c67");
                    var ai = encodeURI("");
                    var ah = "http://www.kugou.com";
                    var al = "http://v.t.qq.com/share/share.php?title=" + ao + "&url=" + aj + "&appkey=" + an + "&site=" + ah + "&pic=" + ai;
                    window.open(al, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                    usersharehit(ak, 2);
                    return false;
                });
                $(".btn-qzone1").live("click",
                function() {
                    var ak = $(this).parent()[0].id.substr(1);
                    var am = $("#" + ak + "a");
                    var ao = encodeURI(am.text());
                    var aj = encodeURIComponent("http://www.kugou.com/s?l=" + encodeURIComponent(am.attr("href")) + "&t=" + encodeURIComponent(customLen(am.text()) > 20 ? (am.text().substr(0, 20) + "...") : am.text()));
                    var an = encodeURI("5da3f2448f3c49a590c83b3299fe2c67");
                    var ai = encodeURI("");
                    var ah = "http://www.kugou.com";
                    var al = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + aj;
                    window.open(al, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                    usersharehit(ak, 3);
                    return false;
                });
                $(".btn-sina2").live("click",
                function() {
                    var an = $(this).parent().parent().parent()[0].id;
                    var ai = an.substr(0, an.length - 1);
                    var ak = $("#" + ai + "a");
                    var am = encodeURI(ak.text());
                    var ah = encodeURIComponent("http://www.kugou.com/s?l=" + encodeURIComponent(ak.attr("href")) + "&t=" + am);
                    var al = "2175151211";
                    var aj = "http://service.t.sina.com.cn/share/share.php?url=" + ah + "&appkey=" + al + "&title=" + am + "&pic=&ralateUid=1732503082";
                    window.open(aj, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                    usersharehit(ai, 1);
                    return false;
                });
                $(".btn-t-qq2").live("click",
                function() {
                    var aj = $(this).parent().parent().parent()[0].id;
                    var ak = aj.substr(0, aj.length - 1);
                    var ap = $("#" + ak + "a");
                    var ao = encodeURI(ap.text());
                    var ai = encodeURIComponent("http://www.kugou.com/s?l=" + encodeURIComponent(ap.attr("href")));
                    var ah = encodeURI("5da3f2448f3c49a590c83b3299fe2c67");
                    var al = encodeURI("");
                    var am = "http://www.kugou.com";
                    var an = "http://v.t.qq.com/share/share.php?title=" + ao + "&url=" + ai + "&appkey=" + ah + "&site=" + am + "&pic=" + al;
                    window.open(an, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                    usersharehit(ak, 2);
                    return false;
                });
                $(".btn-qzone2").live("click",
                function() {
                    var aj = $(this).parent().parent().parent()[0].id;
                    var ak = aj.substr(0, aj.length - 1);
                    var ap = $("#" + ak + "a");
                    var ao = encodeURI(ap.text());
                    var ai = encodeURIComponent("http://www.kugou.com/s?l=" + encodeURIComponent(ap.attr("href")) + "&t=" + encodeURIComponent(customLen(ap.text()) > 20 ? (ap.text().substr(0, 20) + "...") : ap.text()));
                    var ah = encodeURI("5da3f2448f3c49a590c83b3299fe2c67");
                    var al = encodeURI("");
                    var am = "http://www.kugou.com";
                    var an = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + ai;
                    window.open(an, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                    usersharehit(ak, 3);
                    return false;
                });
                $("#gValue2").focus(function() {
                    var ah = $("#gValueLabel2");
                    if (ah.hasClass("input-txt-error")) {
                        ah.removeClass("input-txt-error");
                        $("#gValueError2").addClass("hidden");
                    }
                    ah.addClass("input-txt-focus");
                });
                $("#gValue2").focusout(function() {
                    $("#gValueLabel2").removeClass("input-txt-focus");
                });
                $("#editGCancel,#editGCancel1").click(function() {
                    if (ae) {
                        a();
                    }
                    return false;
                });
                $("#gValue2").bind("keyup",
                function(ah) {
                    if (ah.keyCode == 13) {
                        $("#editGBtn").trigger("click");
                        $("body").focus();
                    }
                });
                var ae = true;
                $("#editGBtn").click(function() {
                    if (ae) {
                        ae = false;
                        var ai = $("#gValue2").val();
                        if (ai != "" && customLen(ai) <= 20) {
                            $("#gLoading2").removeClass("hidden");
                            $("#editGBtn").addClass("btn-s1-disabled");
                            $("#editGCancel").addClass("btn-s2-disabled");
                            $.ajax({
                                type: "POST",
                                timeout: 30000,
                                url: $("#projpath").val()+"/other.do?opeaCode=EditMode",
                                dataType: "json",
                                data: {
                                    id: editGroupId,
                                    name: ai
                                },
                                success: function(aj, ak) {
                                    ae = true;
                                    if (aj.r == 1) {
                                        $("#" + editGroupId + "g").text(ai);
                                        $("#" + editGroupId + "h3").text(ai);
                                    } else {
                                        if (aj.r == -99) {
                                            noSession();
                                        } else {
                                            showError("分类修改失败");
                                        }
                                    }
                                    $("#gLoading2").addClass("hidden");
                                    $("#editGBtn").removeClass("btn-s1-disabled");
                                    $("#editGCancel").removeClass("btn-s2-disabled");
                                    editGroupId = 0;
                                    a();
                                },
                                error: function(ak, al, aj) {
                                    ae = true;
                                    showError("");
                                    editGroupId = 0;
                                }
                            });
                        } else {
                            ae = true;
                            $("#gValueLabel2").addClass("input-txt-error");
                            var ah = "";
                            if (ai == "") {
                                ah = "必填";
                            } else {
                                ah = "字符超长";
                            }
                            $("#gValueError2").text(ah).removeClass("hidden");
                        }
                    }
                    return false;
                });
                $(".labelContent li .shareRecIcon").live("click",
                function(aj) {
                    var ah = $(this);
                    S();
                    W();
                    editBookmarkId = ah[0].id.substr(0, ah[0].id.length - 2);
                    var ak = $("#shareDiv");
                    if (!ak.is(":hidden")) {
                        ak.slideUp("fast",
                        function() {
                            if (editBookmarkId != ak.parent()[0].id.substr(0, ak.parent()[0].id.length - 1)) {
                                $("#" + editBookmarkId + "b").append(ak);
                                var al = $("#" + editBookmarkId + "a");
                                oldBookmarkName = al.text();
                                oldBookmarkUrl = al.attr("href");
                                oldBookmarkMemo = _bookmarkArray[editBookmarkId].m;
                                ak.slideDown("fast");
                            }
                        });
                    } else {
                        $("#" + editBookmarkId + "b").append(ak);
                        var ai = $("#" + editBookmarkId + "a");
                        oldBookmarkName = ai.text();
                        oldBookmarkUrl = ai.attr("href");
                        oldBookmarkMemo = _bookmarkArray[editBookmarkId].m;
                        ak.slideDown("fast");
                    }
                    return false;
                });
                $(".hd .modRecIcon").live("click",
                function() {
                    var ah = $(this);
                    var aj = parseInt(ah[0].id);
                    editGroupId = aj;
                    var ak = $("#" + aj + "g").text();
                    var ai = $(document).height();
                    $("#coverDiv7").height(ai);
                    $("#editCatalog").removeClass("hidden");
                    $("#gValue2").val(ak).focus();
                    $("#gValue2").setCursorPosition({
                        start: ak.length,
                        end: ak.length
                    });
                    return false;
                });
                $(".hd .delRecIcon").live("click",
                function() {
                    var ah = $(this);
                    var aj = parseInt(ah[0].id);
                    var ai = $(document).height();
                    if ($("#catalog").find(".catalog_a").length <= 1) {
                        $("#coverDiv2").height(ai);
                        $("#noDelText").text("必须保留至少一个分类！");
                        $("#noDelClassfyAlert").removeClass("hidden");
                        return false;
                    }
                    if ($("#" + aj + "gDiv").find(".bmark-main").length > 0) {
                        $("#coverDiv").height(ai);
                        $("#confirmDelClassfy").removeClass("hidden");
                        delGroupId = aj;
                    } else {
                        X(aj);
                    }
                    return false;
                });
                $(".bmark-list-ul li .modRecIcon").live("click",
                function() {
                    var ai = $(this);
                    var ak = parseInt(ai[0].id);
                    var am = _bookmarkArray[ak].g;
                    var ah = _groupArray[am].name;
                    var al = $("#" + ak + "a");
                    $("#qValue").val(al.attr("href"));
                    $("#qName").val(al.text());
                    $("#qId").val(ak);
                    $("#qMemo").val(_bookmarkArray[ak].m);
                    if (_bookmarkArray[ak].m == "") {
                        $("#qMemo").val("最多50个字符");
                        if (!$("#qMemo").hasClass("watermarkClass")) {
                            $("#qMemo").addClass("watermarkClass");
                        }
                    }
                    if ($("#qAddArea").hasClass("hidden")) {
                        gArray.length = 0;
                        for (var an in _groupArray) {
                            if (_groupArray[an] != null) {
                                gArray.push({
                                    value: _groupArray[an].id,
                                    text: _groupArray[an].name
                                });
                            }
                        }
                        $("#qGroup").val(ah);
                        $("#qGroupV").val(am);
                        $("#qGroup").trigger("setOptions", {
                            data: gArray
                        });
                        var aj = $(document).height();
                        $("#coverDiv5").height(aj);
                        $("#qAddTitle").text("修改书签");
                        $("#qAddArea").removeClass("hidden");
                        $("#qValue").focus();
                    } else {
                        T();
                    }
                    return false;
                });
                $(".bmark-list-ul li .delRecIcon").live("click",
                function() {
                    if (hasUpdate_group) {
                        A();
                    }
                    if (hasUpdate_bookmark) {
                        k();
                    }
                    var ah = $(this);
                    var ai = parseInt(ah[0].id);
                    $.ajax({
                        type: "POST",
                        url: $("#projpath").val()+"/other.do?opeaCode=DelFav",
                        dataType: "json",
                        data: {
                            bid: ai
                        },
                        success: function(an, ao) {
                            if (an.r == 1) {
                                var al = _bookmarkArray[ai].g;
                                var am = $("#" + ai + "b").parent();
                                var ak = $.cookie("layout_type");
                                $("#" + ai + "b").remove();
                                if (ak == "3" || ak == "4") {
                                    if (am.find(".bitem").length < 1) {
                                        am.parent().parent().remove();
                                    } else {
                                        if (ak == "4") {
                                            var aj = am.parent().parent().find(".total");
                                            aj.html("[" + am.find(".bitem").length + "]");
                                        }
                                    }
                                }
                                _groupArray[al].sort = _groupArray[al].sort.replace("," + ai, "");
                                _groupArray[al].sort = _groupArray[al].sort.replace(ai + ",", "");
                                _groupArray[al].sort = _groupArray[al].sort.replace(ai, "");
                                _bookmarkArray[ai] = null;
                                _bCount--;
                                if (ak == "2") {
                                    $("#bCount").html(_bCount);
                                }
                                if (ak == "2" && $("#" + al + "gul").find("li").length < 1) {
                                    $("#" + al + "gul").append('<li class="emptyli"><div class="init">还没有任何书签，立即<a href="#" id="emptyAdd">添加</a></div></li>');
                                }
                                if (ak == "3" && $("#hotbox").find(".item").length < 1) {
                                    $("#hotbox").append('<div class="init">还没有任何书签，立即<a href="#" id="emptyAdd">添加</a></div>');
                                }
                                if (ak == "4" && $("#timebox").find(".item").length < 1) {
                                    $("#timebox").append('<div class="init">还没有任何书签，立即<a href="#" id="emptyAdd">添加</a></div>');
                                }
                            } else {
                                if (an.r == -99) {
                                    onSession();
                                } else {
                                    showError("书签删除失败");
                                }
                            }
                        },
                        error: function(ak, al, aj) {
                            showError("");
                        }
                    });
                    return false;
                });
                $("#emptyAdd").live("click",
                function() {
                    $("#qAddBtn").trigger("click");
                    return false;
                });
                $("#gotop").click(function() {
                    $("html, body").animate({
                        scrollTop: 0
                    },
                    200);
                });
                $(window).bind("scroll",
                function() {
                    R();
                });
                $(window).resize(function() {
                    R();
                });
            }
            f(ac.as);
        },
        error: function(Z, aa, Y) {}
    });
    if ($("#guideWin").length > 0) {
        var b = $(document).height();
        $("#coverDiv99").height(b);
        $("#step1").click(function() {
            $(".step-1").hide();
            $(".step-2").show();
            return false;
        });
        $("#step2").click(function() {
            $(".step-2").hide();
            $(".step-3").show();
            return false;
        });
        $("#step3").click(function() {
            $(".step-3").hide();
            $(".step-4").show();
            return false;
        });
        $("#step4").click(function() {
            /*$("#guideWin").hide();
            $.ajax({
                type: "POST",
                url: "profile/updateTip",
                dataType: "json",
                data: {
                    tip: 1
                },
                success: function(Y, Z) {},
                error: function(Z, aa, Y) {}
            });*/
            return false;
        });
    }
    if ($("#profileSetHome").length > 0) {
        if ($.browser.msie) {
            $("#profileSetHome .inner").html('打开浏览器时总是显示本页，<a id="setIE" href="#">将易集设置成主页</a>');
            $("#setIE").click(function() {
                if (document.all) {
                    document.body.style.behavior = "url(#default#homepage)";
                    document.body.setHomePage("http://www.kugou.com");
                }
                return false;
            });
            $("#profileSetHome").removeClass("hidden");
        } else {
            if ($.browser.mozilla) {
                $("#profileSetHome .inner").html('<a href="#">将易集设置成主页</a>，请将此链接拖放到浏览器主页按钮。');
                $("#profileSetHome").removeClass("hidden");
            } else {
                $("#profileSetHome .inner").html("将易集设置成主页，请进入浏览器设置--选项设置易集为主页。");
                $("#profileSetHome").removeClass("hidden");
            }
        }
        $("#closeSetHome").click(function() {
            /*$("#profileSetHome").hide();
            $.ajax({
                type: "POST",
                url: "profile/updateTip",
                dataType: "json",
                data: {
                    tip: 2
                },
                success: function(Y, Z) {},
                error: function(Z, aa, Y) {}
            });*/
            return false;
        });
    }
});