var _work_changed = false;

var editor = monaco.editor.create(document.getElementById('container'), {
  language: 'python',
  theme: 'vs-dark',
  value: 'print("加载中")',
  acceptSuggestionOnCommitCharacter: true, // 接受关于提交字符的建议
  acceptSuggestionOnEnter: 'on', // 接受输入建议 "on" | "off" | "smart"
  autoClosingBrackets: 'always', // 是否自动添加结束括号(包括中括号) "always" | "languageDefined" | "beforeWhitespace" | "never"
  autoClosingDelete: 'always', // 是否自动删除结束括号(包括中括号) "always" | "never" | "auto"
  autoClosingOvertype: 'always', // 是否关闭改写 即使用insert模式时是覆盖后面的文字还是不覆盖后面的文字 "always" | "never" | "auto"
  autoClosingQuotes: 'always', // 是否自动添加结束的单引号 双引号 "always" | "languageDefined" | "beforeWhitespace" | "never"
  autoIndent: 'always', // 控制编辑器在用户键入、粘贴、移动或缩进行时是否应自动调整缩进
  automaticLayout: true, // 自动布局
  codeLens: true, // 是否显示codeLens 通过 CodeLens，你可以在专注于工作的同时了解代码所发生的情况 – 而无需离开编辑器。 可以查找代码引用、代码更改、关联的 Bug、工作项、代码评审和单元测试。
  comments: {
    ignoreEmptyLines: true, // 插入行注释时忽略空行。默认为真。
    insertSpace: true // 在行注释标记之后和块注释标记内插入一个空格。默认为真。
  }, // 注释配置
  contextmenu: true, // 启用上下文菜单

  folding: true, // 是否启用代码折叠
  links: true, // 是否点击链接
  readOnly: false, // 是否为只读模式
});


//动态获取作品
function getWork(hashWorkId) {
  document.getElementById('pageprogress').innerHTML = '<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>';
  AjaxFn("/python/getWork", { id: hashWorkId }, function (r) {
    if ("ok" == r.status) {
      show_python_work(r.work);

        document.getElementById('pageprogress').innerHTML = '';

    } else {
      automsg(r.msg);
        document.getElementById('pageprogress').innerHTML = '';

    }
  });
}
!(function () {
  const hashMatch = window.location.hash.match(/#(\d+)/);
  const hashWorkId = hashMatch === null ? 0 : hashMatch[1];
  getWork(hashWorkId); //主动执行一次
})();

var _work_id = 0;
var _work_state = 0;
var _work_title = "";
var _work_info = "";
//用一个作品数据初始化界面
function show_python_work(work) {
  if (_work_changed) {
    layer.confirm(
      "作品有更新，是否放弃保存作品？",
      { title: "重要提示", shadeClose: true },
      function (index) {
        _work_changed = false;
        $("#save_work_box").hide();

        show_python_work(work);
        layer.close(index);
      }
    );

    return;
  }

  //清除各类状态
  run_clear(); //清除运行结果
  window.location.hash = work.id;
  $("#work_title_input").val(work.title);
  $("#work_info_input").val(work.description);
  window.editor.setValue(work.source); //设置作品源代码

  _work_id = work.id;
  _work_state = work.state;
  _work_title = work.description;
  _work_info = work.info;
  // 设置各按钮的状态
  if (isLogin != "false") {
    if (_work_id == 0) {
      $("#publish_work").hide();
      $("#revise_work").hide();
      $("#save_work").show();
    } else {
      if (work.authorid == localuser.userid) {
        if (_work_state == 0) {
          $("#publish-work-box").text("分享");
        } else {
          $("#publish-work-box").text("取消分享");
          $("#publish-work-box").prop("checked",true)
        }

        $("#publish_work").show();
        $("#save_work").show();
        $("#revise_work").hide();
      } else {
        $("#publish_work").hide();
        $("#save_work").hide();
        $("#revise_work").show();
      }
    }
  } else {
    $("#publish_work").hide();
    $("#revise_work").hide();
  }

  automsg({ buttonText: "关闭", message: "加载作品成功" });
}

//新建一个作品
function new_file() {
  getWork(0);
}

// 从电脑中上传
function open_file() {
  $("#files").click();
}
$("#files").change(function () {
  var n = document.getElementById("files").files[0];

  if (void 0 !== n) {
    // 判断文件类型是否为PY
    var reg = /.py$/;
    if (!reg.test(n.name)) {
      automsg({ buttonText: "关闭", message: "请选择一个 .py 文件" });
      return;
    }

    _work_title = n.name.substr(0, n.name.length - 3);

    var t = (n.name, n.size, new FileReader());
    t.readAsText(n),
      (t.onload = function () {
        show_python_work({
          id: 0,
          state: 0,
          title: _work_title,
          source: this.result,
        });
        document.getElementById("files").value = "";
      });
  }
});

// 保存到电脑
function save_file() {
  var t = $("#work_title_input").val();
  if (t.length == 0) {
    automsg({ buttonText: "关闭", message: "作品名称不能为空" });
    return;
  }

  _work_title = t;

  source = editor.getValue()

  var n = new File([source], _work_title + ".py", {
    type: "text/plain;charset=utf-8",
  });
  saveAs(n);
}

// 保存到云端
function save_work() {
  if (isLogin == "false") {
    automsg({ buttonText: "关闭", message: "请先登录！" });
    return;
  }

  var t = $("#work_title_input").val();
  var d = $("#work_info_input").val();
  if (t.length == 0) {
    automsg({ buttonText: "关闭", message: "作品名称不能为空" });
    return;
  }

  _work_title = t;
  _work_info = d;
  data = editor.getValue()
  AjaxFn(
    "/python/save",
    { id: _work_id, title: _work_title, description: _work_info, data: data },
    function (res) {
      automsg(res["msg"]);
      if ("ok" == res.status) {
        _work_changed = false;
        $("#save_work_box").hide();

        if (_work_id == 0) {
          window.location.hash = res.newid;
          _work_id = res.newid;
          $("#save_work_box").hide();
        }
        $("#publish_work").show();
      }
    }
  );
}

// 改编此作品
function revise_work() {
  if (isLogin == "false") {
    automsg({ buttonText: "关闭", message: "请先登录！" });
    return;
  }

  window.location.hash = 0; //设置为0号作品，即未保存的作品
  _work_id = 0;
  _work_changed = true; //设置为需要保存
  $("#publish_work").hide();
  $("#revise_work").hide();
  $("#save_work").show();

  automsg({ buttonText: "关闭", message: "操作成功" });
}

// 作品名称的变化
function work_title_changed() {
  if (!_work_changed) {
    _work_changed = true;
    $("#save_work_box").show();
  }
}

// 分享作品
function publish_work(s) {
  if (isLogin == "false") {
    automsg({ buttonText: "关闭", message: "请先登录！" });
    return;
  }

  if (_work_id == 0) {
    automsg({ buttonText: "关闭", message: "请先保存作品到云端！" });
    return;
  }

  AjaxFn("/python/publish", { id: _work_id, s: _work_state }, function (r) {
    automsg(r.msg);
    if ("ok" == r.status) {
      if (_work_state == 0) {
        _work_state = 1;
        $("#publish-work-box").text("取消分享");
        $("#publish-work-box").prop("checked",true)
      } else {
        _work_state = 0;
        $("#publish-work-box").text("分享");
      }
    }
  });
}

// 运行部分
function outf(H) {
  var t = document.getElementById("output")  ;
  t.innerHTML = t.innerHTML + H;
}
function builtinRead(n) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[n] === undefined)
    throw `File not found: '${n}'`;
  return Sk.builtinFiles.files[n];
}
// 代码模式运行
function run_it() {
  source = editor.getValue()

  var OP_Div = document.getElementById("output");
  OP_Div.innerHTML = "";
  Sk.pre = "output";
  Sk.configure({ output: outf, read: builtinRead });

  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {}))["target"] = "pythoncanvas";
  var draw_ = Sk.misceval.asyncToPromise(function () {
    f();
    return Sk.importMainWithBody("<stdin>", ![], source, !![]);
  });
  draw_.then(
    function (r) {},
    function (t) {
      alert(t.toString());
    }
  );
}

// 清除运行结果
function run_clear() {
  document.getElementById("output").innerHTML = "";
  document.getElementById("pythoncanvas").innerHTML = "";
}

function f() {
  if (Sk.TurtleGraphics || Sk.TurtleGraphics == {}) {
    var o = document.getElementById("canvas_box");
    var w = o.offsetWidth; //宽度
    var h = o.offsetHeight; //高度
    $("#pythoncanvas").css("height", h + "px");

    Sk.TurtleGraphics.width = w;
    Sk.TurtleGraphics.height = h;

    var C1 = $("#pythoncanvas>canvas:eq(0)");
    C1 = u(C1, w, h);

    var C2 = $("#pythoncanvas>canvas:eq(1)");
    C2 = u(C2, w, h);
  }
}
function u(C, W, H) {
  if (C.length > 0) {
    var D = C[0].getContext("2d");
    DC_ = D.getImageData(0, 0, C[0].width, C[0].height);
    C.attr("height", H).attr("width", W);
    D.putImageData(DC_, 0, 0);
    return C;
  }
}

// 全屏运行部分
var not_all_screen = `
  <div class="layui-col-md4 layui-col-sm12 layui-col-xs12" style="padding: 0;">
  <div class="layui-row">
    <div class="layui-col-md12 layui-col-sm6 layui-col-xs12" style="padding: 0;">
      <div id="canvas_box" style="height:calc(50vh); background:url(png) no-repeat center;background-size: contain;background-size:auto 100%;">
        <div id="pythoncanvas"></div>
      </div>
    </div>

    <div class="layui-col-md12 layui-col-sm6 layui-col-xs12" style="padding: 0; margin:0;background-color: rgb(0, 0, 0);height:calc(50vh - 52px);">
      <textarea id="output" style="height: 100%;width: 100%;" disabled>终端打印输出区</textarea>
    </div>
  </div>
</div>
    `;
var all_screen = `
  <div class="layui-col-md12 layui-col-sm12 layui-col-xs12" style="padding: 0;">
  <div id="canvas_box" style="height:calc(100vh - 52px); background:url(png) no-repeat center;background-size: contain;background-size:auto 100%;">
    <div id="pythoncanvas"></div>
  </div>
</div>

<div class="layui-col-md12 layui-col-sm12 layui-col-xs12" style="padding: 0; margin:0;background-color: rgb(0, 0, 0);height:calc(100vh);">
  <textarea id="output" style="height: 100%;width: 100%;" disabled>终端打印输出区</textarea>
</div>
  `;
var _is_all_screen = false;
function all_Screen(obj) {
  if (_is_all_screen) {
    //已经是全屏，回到正常界面
    $(obj).text("全屏运行");
    $("#main_edit_box").html(not_all_screen);
    $(`#python_edit_box`).show();
  } else {
    $(obj).text("返回编辑界面");
    $("#main_edit_box").html(all_screen);
    $(`#python_edit_box`).hide();
  }

  _is_all_screen = !_is_all_screen;
}

// 从优秀作品、我的作品中打开一个作品
function openProject(id, index) {
  layer.close(index);
  window.open(`/python/edit#${id}`, "_self"); //
  getWork(id);
}

// 优秀作品
function open_YX() {
  AjaxFn("/python/YxLibrary_count", {}, function (res) {
    if ("ok" != res.status) {
      automsg(res.msg);
      return;
    }

    var project_count = res.total / 16;

    layer.open({
      type: 1,
      title: "优秀作品",
      area: ["80%", "80%"],
      offset: ["10px", "10px"],
      shade: 0, // 点击遮罩区域，关闭弹层
      maxmin: true, // 允许全屏最小化
      fixed: true,
      content: `<div class="layui-fluid" style="margin: 20px auto;">
                        <div class="layui-row" id="lay_flow"></div>
                    </div>`,
      success: function (layero, index) {
        //流加载页面数据
        layui.flow.load({
          elem: "#lay_flow", //流加载容器
          scrollElem: ".layui-layer-content", //滚动条所在元素，一般不用填，此处只是演示需要。
          done: function (page, next) {
            //执行下一页的回调
            var lis = [];
            AjaxFn("/python/YxLibrary_data", { page: page }, function (res) {
              if ("ok" != res.status) {
                automsg(res.msg);
                return;
              }

              var data = res.data;
              for (var i = 0; i < data.length; i++) {
                p = data[i];
                content = `
<div class="mdui-card" style="margin:5px 0px 5px 0px;border-radius: 15px;">

 <div class="mdui-card-header" >
    <img class="mdui-card-header-avatar" src="${s3file}/user/${p.authorid}"/>
    <div class="mdui-card-header-title">${p.author_display_name}</div>
    <div class="mdui-card-header-subtitle">ZeroCat创作者</div>
  </div>
<div class="mdui-card-primary">
    <div class="mdui-card-primary-title">${p.title}</div>
    <div class="mdui-card-primary-subtitle">浏览量:${p.view_count},更新时间:${p.time}</div>
</div>


<div class="mdui-card-actions">
  <button class="mdui-btn mdui-ripple" onClick="openProject(${p.id}, ${index})" style="border-radius: 10px;">打开</button>
  <button class="mdui-btn mdui-btn-icon mdui-float-right" onclick='window.open("/python/edit#${p.id}")'>
  <i class="mdui-icon material-icons">open_in_new</i>
                   </button>
</div>
</div>
`;

                lis.push(content);
              }

              next(lis.join(""), page < project_count);
            });
          },
        });
      },
    });
  });
}

// 我的作品
function open_MY() {
  AjaxFn("/python/MyLibrary_count", {}, function (res) {
    if ("ok" != res.status) {
      automsg(res.msg);
      return;
    }

    var project_count = res.total / 16;

    layer.open({
      type: 1,
      title: "我的作品",
      area: ["40%", "80%"],
      offset: ["10px", "10px"],
      shade: 0, // 点击遮罩区域，关闭弹层
      maxmin: true, // 允许全屏最小化
      content: `<div class="layui-fluid" style="margin: 20px auto;">
                        <div class="mdui-row" id="lay_flow"></div>
                    </div>`,

      success: function (layero, index) {
        //流加载页面数据
        layui.flow.load({
          elem: "#lay_flow", //流加载容器
          scrollElem: ".layui-layer-content", //滚动条所在元素，一般不用填，此处只是演示需要。
          done: function (page, next) {
            //执行下一页的回调
            var lis = [];
            AjaxFn("/python/MyLibrary_data", { page: page }, function (res) {
              if ("ok" != res.status) {
                automsg(res.msg);
                return;
              }

              var data = res.data;
              for (var i = 0; i < data.length; i++) {
                p = data[i];
                t = new Date(p.time).toLocaleString();
                yfb = "";

                if (p.state == 1) {
                  yfb = '<span style="color:#F72">[已发布]</span>';
                } else if (p.state == 2) {
                  yfb = '<span style="color:#F72">[优秀作品]</span>';
                }

                content = `
<div class="mdui-card" style="margin:5px 0px 5px 0px;border-radius: 15px;">
  <div class="mdui-card-primary">
    <div class="mdui-card-primary-title">${p.title}</div>
    <div class="mdui-card-primary-subtitle">${yfb}最后更新:${p.time}</div>
  </div>
  <div class="mdui-card-actions">
    <button class="mdui-btn mdui-ripple" onClick="openProject(${p.id}, ${index})" style="border-radius: 10px;">打开</button>
    <button class="mdui-btn mdui-btn-icon mdui-float-right" onclick='window.open("/python/edit#${p.id}")'>
    <i class="mdui-icon material-icons">open_in_new</i>
    </button>
  </div>
</div>



                            `;

                lis.push(content);
              }

              next(lis.join(""), page < project_count);
            });
          },
        });
      },
    });
  });
}
window.onbeforeunload = function (e) {
  e = e || window.event;
  if (e) {
    e.returnValue = "网站没有自动保存您的修改哦~";
  }
  return "网站没有自动保存您的修改哦~";
};
