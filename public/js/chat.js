(function () {
  var socketNode = (function () {
    var socket, //socket.io
        $overlayHeight = $(document).height(),//浏览器高度
        $overlayWidth = $(document).width(),//浏览器宽度
        $overlay = $('#overlay');//遮罩
    return {
      login: function () {
        socket = io();
        $('.login-btn').click(function () {
          var userName = $.trim($('.login-name').val());
          if (userName != "") {
            socket.emit('login', userName);
            socketNode.loginBack(); //返回信息
            socketNode.lineNmber();//在线人数
          }
        })
      },
      loginBack: function () {
        //返回发送者的消息
        socket.on('system', function (data) {
          $('.chat-text').val('');
          var msg = "<p class='self-content-rt'>" + "<span class='con-rt' >" + data.name + " (" + data.chatTime + ") " + "</span>" + "<br><span class='content'>" + data.chatCon + "</span></p>";
          $('.chat-con').append(msg);
        })
        socket.on('loginback', function (data) {
          $('#overlay').hide();
          $('.chat').show();
          $('.login').hide();
          $('.user-list').show();
          $('.user-list ul').empty();
          var msg = [];
          for (key in data) {
            msg.push("<li>" + key + "</li>");
          }
          $('.user-list ul').append(msg);
        })
      },
      lineNmber: function () {
        socket.on('num', function (data) {
          $('.num').text(data);
        })
      },
      gOrp: function () {
        //判断是私聊还是群聊
        $('.user-list').on('click', 'li', function () {
          $(this).toggleClass('active');
          if ($(this).hasClass('active')) {
            $(this).siblings().removeClass('active');
          }
          $priUser = $(this).text();
        })
      },
      sendMessage: function () {
        //发送消息
        $('.sending-btn').click(function () {
          //发送时间
          var date = new Date(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            second = date.getSeconds(),
            time = hours + ":" + minutes + ":" + second,
            text = $.trim($('.chat-text').val()),
            chatMsg = {
              chatTime: time,
              chatCon: text
            };
          if (text == "") {
            alert('内容不能为空');
            return;
          }
          if ($('.user-list li').hasClass('active')) {
            //私聊消息
            chatMsg.priUser = $priUser;
            socket.emit('private message', chatMsg);
            $('.chat-text').val('');
            alert(chatMsg)
          } else {
            //群聊消息
            socket.emit('message', chatMsg);
          }
        })
        socketNode.backMessage();
      },
      backMessage: function () {
        //接收群聊的消息
        socket.on('msgback', function (data) {
          $('.chat-text').val('');
          var msg = "<p class='self-content-lt'>" + "<span class='con-lt'>" + data.name + " (" + data.chatTime + ") " + "</span>" + "<br><span class='content'>" + data.chatCon + "</span></p>";
          $('.chat-con').append(msg);
        });
        //接收私聊消息
        socket.on('pri message', function (data) {
          var msg = "<p class='self-content-lt'><span class='ft-red'>[私聊]</span>" + data.name + "(" + data.chatTime + ") " + "</span>" + "<br><span class='content'>" + data.chatCon + "</span></p>";
          $('.chat-con').append(msg);
        })
      },
      overlay: function () {
        $overlay.css({ 'width': $overlayWidth + 'px', 'height': $overlayHeight + 'px' });
      },
      init: function () {
        socketNode.login(); //登录信息
        socketNode.gOrp(); //判断私聊或者群聊
        socketNode.sendMessage();//发送接收消息
        socketNode.overlay();//遮罩
      }
    }
  })()
  socketNode.init();//初始化
})()
