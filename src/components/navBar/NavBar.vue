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
    <div class="user">
      <button class="login" @click="login">登录/注册</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "NavBar",
  data() {
    return {};
  },
  methods: {
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
      // this.$router.push("/login");
    },
  },
  computed: {},
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
  width: 50px;
  font-size: 20px;
  color: gray;
  border: none;
  border-radius: 5px;
  background-color: #070707;
  cursor: pointer;
}
.history:hover {
  color: white;
}
.login {
  height: 40px;
  width: 80px;
  border-radius: 50px;
  border-color: white ;
  border: none;
  color: #858585 ;
  cursor: pointer;
}
.login:hover {
  color: black ;
}
</style>