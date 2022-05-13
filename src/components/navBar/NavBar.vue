<template>
  <div class="bar">
    <div class="button">
      <button class="history" @click="returnPage">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button class="history" @click="forwardPage">
        <i class="el-icon-arrow-right"></i>
      </button>
    </div>
    <!-- 根据是否登录展示用户信息 -->
    <div class="user" v-if="!isLogin">
      <button class="login-btn" @click="login">登录/注册</button>
    </div>
    <div class="user info" v-else>
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>主页</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  name: "NavBar",
  data() {
    return {
    };
  },
  methods: {
    ...mapActions({
      logout: 'logout',
    }),
    //返回上一页
    returnPage() {
      this.$router.back();
    },
    //前进到下一页
    forwardPage() {
      this.$router.forward();
    },
    //登录
    login() {
      this.$router.push("/login");
    },
    handleCommand(command) {
      switch (command) {
        case "logout":
          this.logout();
          // this.$router.go(0);
          break;

        default:
          break;
      }
    },
  },
  computed: {
    userInfo(){
      return this.$store.state.userInfo;
    },
    isLogin(){
      return this.$store.state.isLogin;
    }
  },
};
</script>
<style >
/* bar弹性布局 */
.bar {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
/* el-button */
.history {
  margin: 0 5px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  color: gray;
  border: none;
  border-radius: 50%;
  background-color: #EBEEF5;
  /* background-color: #DCDFE6; */
  cursor: pointer;
}
.history:hover {
  color: #409EFF;
  background-color: #ECF5FF;
}
.login-btn {
  height: 40px;
  width: 80px;
  border-radius: 50px;
  border-color: white;
  border: none;
  color: black;
  background-color: #EBEEF5;
  /* background-color: #DCDFE6; */
  cursor: pointer;
}
.login-btn:hover {
  color: #409EFF;
}
.el-dropdown-link {
  /* color: black; */
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 30px;
  width: 80px;
  border-radius: 15px;
  background-color: #EBEEF5;
  color: #303133;
  cursor: pointer;
}
.info:hover {
  background-color: #ECF5FF;
}
.info:hover span{
  color: #409EFF;
}
</style>