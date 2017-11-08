<template>
<div id="content">
  <div class="login">
	<input type="text" class="login-name" placeholder="请输入昵称" />
	<button class="login-btn">登录</button>
</div>
<div class="chat">
<h1 class="chat-h1"></h1>
<div class="user-chat">
	<div class="chat-num">在线人数：<span class="num">0</span></div>
	<div class="chat-con-wrap">
		<div class="chat-con">
		</div>
		<div class="control">
			<input type="text" class="chat-text" placeholder="请输入内容" />
			<button class="sending-btn">发送</button>
		</div>
	</div>
</div>
<div class="user-list">
	<h3 class="user-list-h3">用户列表</h3>
	<ul class="user-name">
	</ul>
</div>
</div>
<div id="overlay">
</div>
</div>
</template>
<script src="./jquery-1.12.4.min.js" ></script>
<script src="./chat.js" ></script>
<script src="/socket.io/socket.io.js"></script>
<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 @import './chat.css';
 @import './reset.css';
</style>
