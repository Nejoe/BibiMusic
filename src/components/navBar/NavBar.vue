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
    <div v-if="!isLogin">
      <button class="login-btn" @click="login">登录/注册</button>
    </div>
    <div class="info" v-else>
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <el-avatar shape="circle" size="large" :src="'/api' + userInfo.avatar" fit="cover" style="padding-right:5px;">
          </el-avatar>
          {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="user">个人主页</el-dropdown-item>
          <el-dropdown-item command="manage" v-if="userInfo.is_admin === 1">管理端</el-dropdown-item>
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
      userData: {}
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
          break;
        case "manage":
          this.$router.push("/manage");
          break;
        case "user":
          this.$router.push({
            name: 'User',
            params: { id: this.userInfo.id },
          });
        default:
          break;
      }
    },
    getUserInfo() {
      this.$axios({
        url: "/user/getUserInfo",
        method: "get",
        params: {
          user_id: this.$route.params.id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          const newInfo = {
            id: res.data.obj[0].user_id,
            account: this.$store.state.userInfo.account,
            name: res.data.obj[0].user_name,
            is_admin: res.data.obj[0].is_admin,
            avatar: res.data.obj[0].avatar,
          }
          this.$store.commit('setUserInfo', newInfo);
        } else {
          this.$message.error(res.data.msg);
        }
      });

    },
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    isLogin() {
      return this.$store.state.isLogin;
    }
  },
  watch: {
    // 用户信息修改后会修改state中的是否刷新导航栏的状态
    '$store.state.isUserRefresh': function (newVal, oldVal) {
      if (newVal === true) {
        this.getUserInfo();
      }
      this.$store.state.isUserRefresh = false;
    }
  }
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
  display: flex;
  align-items: center;
}

.info {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  /* width: 300px; */
  /* height: 30px; */
  /* padding-left: 10px; */
  padding-right: 10px;
  border-radius: 50px;
  background-color: #EBEEF5;
  color: #303133;
  cursor: pointer;
}

.info:hover {
  background-color: #ECF5FF;
}

.info:hover span {
  color: #409EFF;
}
</style>