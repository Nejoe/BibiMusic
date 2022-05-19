<template>
  <div class="login-main">
    <div class="login-form" ref="mainForm">
      <!-- <div class="login-item">
        <h1>登录</h1>
      </div> -->
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="登录" name="login">
          <el-form
            id="loginForm"
            :model="loginRuleForm"
            status-icon
            :rules="loginRules"
            ref="loginRuleForm"
            label-width="50px"
            label-position="top"
          >
            <el-form-item label="登录账号" prop="account">
              <el-input v-model="loginRuleForm.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="loginRuleForm.password"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('loginRuleForm')"
                >登录</el-button
              >
              <el-button @click="resetForm('loginRuleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <el-form
            id="registerForm"
            :model="registerRuleForm"
            status-icon
            :rules="registerRules"
            ref="registerRuleForm"
            label-width="50px"
            label-position="top"
          >
            <el-form-item label="昵称" prop="name">
              <el-input v-model="registerRuleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="登录账号" prop="account">
              <el-input v-model="registerRuleForm.account"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="registerRuleForm.password"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
              <el-input
                type="password"
                v-model="registerRuleForm.checkPassword"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('registerRuleForm')"
                >注册</el-button
              >
              <el-button @click="resetForm('registerRuleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    // 用户名规则
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      } else if (value.length < 2) {
        return callback(new Error("用户名长度不能小于2位"));
      } else if (value.length > 12) {
        return callback(new Error("用户名长度不能大于12位"));
      } else if (!/^[\u4E00-\u9FA5\w]+$/.test(value)) {
        //用户名只能是中文、数字、字母、下划线组成
        return callback(new Error("用户名只能是中文、数字、字母、下划线组成"));
      } else {
        callback();
      }
    };
    // 账号规则
    const checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return callback(new Error("账号只能是数字、字母、下划线组成"));
      } else if (value.length < 3) {
        return callback(new Error("账号长度不能小于3位"));
      } else if (value.length > 12) {
        return callback(new Error("账号长度不能大于12位"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      }
      callback();
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerRuleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      activeName: "login",
      loginRuleForm: {
        password: "",
        account: "",
      },
      loginRules: {
        account: [{ validator: checkAccount, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
      registerRuleForm: {
        name: "",
        account: "",
        password: "",
        checkPassword: "",
      },
      registerRules: {
        name: [{ validator: checkName, trigger: "blur" }],
        account: [{ validator: checkAccount, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPassword: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    ...mapActions({
      login: "login",
    }),
    handleClick(tab, event) {
      if (tab.name === "register") {
        this.$refs.mainForm.style.height = "600px";
      } else if (tab.name === "login") {
        this.$refs.mainForm.style.height = "400px";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && formName === "loginRuleForm") {
          // 通过vuex提交登录
          this.login(this.loginRuleForm);
          // 延时跳转
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            if (this.$store.state.isLogin) {
              this.$message({
                message: '登录成功',
                type: "success",
              });
              this.$router.push("/");
            } else {
              this.$message({
                message: '账号或密码错误',
                type: "error",
              });
            }
          }, 100);
        } else if (valid && formName === "registerRuleForm") {
          // 发送axios注册
          console.log(this.registerRuleForm);
          this.$axios({
            method: "post",
            url: "/user/register",
            data: this.registerRuleForm,
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
              this.$router.go(0);
            } else{
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          });
        } else {
          // this.$message.error("表单验证失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  watch: {
  },
  mounted() {
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
.login-main {
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: #c6e2ff;
  background-image: url("../../assets/images/background.jpg");
  background-size: cover;
}
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 500px;
  height: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 6px rgba(0, 0, 0, 0.06);
  border-radius: 4%;
  background-color: rgba(255, 255, 255, 0.6);
  /* transition: all 0.2s ease-in-out; */
}
#loginForm,
#registerForm {
  margin: 0 auto;
  width: 70%;
  align-self: center;
}
.login-item {
  align-self: center;
}
</style>