$(function(){
  var socket;
  var $priUser; //目标用户

  $('.login-btn').click(function(){
     socket = io();
      var userName =$.trim($('.login-name').val());
      if(userName==""){
        return;
      }else{
        //返回发送者的消息
        socket.on('system',function(data){
             $('.chat-text').val('');
            var msg ="<p class='self-content-rt'>"+"<span class='con-rt' >"+data.name+" ("+data.chatTime+") "+"</span>"+"<br><span class='content'>"+data.chatCon+"</span></p>";
            $('.chat-con').append(msg);
        })
        //登录
        socket.emit('login',userName);
        //显示匿名登录信息
        socket.on('loginback',function(data){
          $('#overlay').hide();
          $('.chat').show();
          $('.login').hide();
          $('.user-list').show();
          $('.user-list ul').empty();
          var msg=[];
          for(key in data){
              msg.push("<li>"+key+"</li>");
          }
          $('.user-list ul').append(msg);
        })
        //在线人数
        socket.on('num',function(data){
          $('.num').text(data);
        })
        //判断是私聊还是群聊
        $('.user-list').on('click','li',function(){
             $(this).toggleClass('active');
             if($(this).hasClass('active')){
              $(this).siblings().removeClass('active');
             }
              $priUser = $(this).text();
          })
        //发送消息
        $('.sending-btn').click(function(){
          //发送时间
           var date = new Date(),
                  hours = date.getHours(),
                  minutes = date.getMinutes(),
                  second = date.getSeconds(),
                  time = hours+":"+minutes+":"+second,
                  text  =$.trim($('.chat-text').val()),
                  chatMsg = {
                    chatTime:time,
                    chatCon:text
                  };
                  if(text==""){
                    alert('内容不能为空');
                    return;
                  }
            if($('.user-list li').hasClass('active')){
                  //私聊消息
                  chatMsg.priUser=$priUser;
                  socket.emit('private message',chatMsg);
                   $('.chat-text').val('');
             }else{
                  //群聊消息
                  socket.emit('message',chatMsg)  
                }
            })
        //接收群聊的消息
        socket.on('msgback',function(data){
            $('.chat-text').val('');
            var msg ="<p class='self-content-lt'>"+"<span class='con-lt'>"+data.name+" ("+data.chatTime+") "+"</span>"+"<br><span class='content'>"+data.chatCon+"</span></p>";

            $('.chat-con').append(msg);
          });
        //接收私聊消息
        socket.on('pri message',function(data){
            var msg ="<p class='self-content-lt'><span class='ft-red'>[私聊]</span>"+data.name+"("+data.chatTime+") "+"</span>"+"<br><span class='content'>"+data.chatCon+"</span></p>";
            $('.chat-con').append(msg);
          })
      }
  })

 /*
  *遮罩层
  */
  var $overlayHeight = $(document).height();
  var $overlayWidth = $(document).width();
  var $overlay = $('#overlay');
  $overlay.css({ 'width': $overlayWidth + 'px', 'height': $overlayHeight + 'px' });
})


