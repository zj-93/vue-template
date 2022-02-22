<template>
  <div class="bg_box">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="login-ruleForm"
      hide-required-asterisk
      :show-message="false"
    >
      <el-form-item label="" prop="userName" class="username">
        <el-input
          v-model="ruleForm.userName"
          type="text"
          placeholder="请输入登录账号"
        ></el-input>
        <!-- <input type="text" v-model="ruleForm.username"> -->
      </el-form-item>
      <el-form-item label="" prop="passWord">
        <el-input
          v-model="ruleForm.passWord"
          type="password"
          autocomplete="off"
          placeholder="请输入登录密码"
        ></el-input>
      </el-form-item>
      <el-form-item class="subBtn">
        <el-button type="primary" @click="submitForm('ruleForm')">進 入</el-button>
        <el-button type="primary" @click="submitSign('ruleForm')">注 册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { signUp, signIn } from '@/api/login'

export default {
  name: "",
  components: {},
  data() {
    return {
      ruleForm: {
        userName: "",
        passWord: "",
      },
      rules: {
        userName: { required: true, message: '请输入用户名', trigger: 'blur' },
        passWord: { required: true, message: '请输入密码', trigger: 'blur' },
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      let params = {
        ...this.ruleForm
      }
      this.$store.dispatch('Login', params).then(res => {
        this.$router.push({name: 'Home'})
      })
      
    },
    submitSign() {
      let params = {
        ...this.ruleForm
      }
      signUp(params)
    }
  },
};
</script>

<style scoped lang="less">
.bg_box {
  height: 100%;
  width: 100%;
  background-image: url("@/image/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  .login-ruleForm {
    width: 400px;
    opacity: 0.6;
    transition: 1s;
    transform: rotate(13deg);
    margin-top: 190px;
    position: relative;
    margin-left: -40px;
    &:hover {
      opacity: 1;
    }
    ::v-deep .el-form-item__label {
      color: #fff;
    }
    .subBtn {
      ::v-deep .el-form-item__content {
        position: absolute;
        right: -110px;
        top: 0;
        .el-button {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
}
</style>
