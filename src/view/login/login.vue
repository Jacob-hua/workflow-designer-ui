import { userLogin } from '@/constant/index.js'
<template>
  <div class="background body"
       v-show="showHtml">
    <div class="box">
      <h2>登录</h2>
      <form method="post">
        <div class="inputbox">
          <input type="text"
                 name="username"
                 v-model="username"
                 required=""
                 oninvalid="setCustomValidity('请输入用户名');"
                 @keyup.enter="login">
          <label>Username</label>
        </div>

        <div class="inputbox">
          <input type="password"
                 name="password"
                 v-model="password"
                 required=""
                 oninvalid="setCustomValidity('请输入登陆密码');"
                 @keyup.enter="login">
          <label>Password</label>
        </div>

        <input type="button"
               value="submit"
               @click="login()">
      </form>
    </div>

  </div>
</template>

<script>
import CONSTANT from '@/constant'
import { userLogin } from '@/api/unit/api.js'
import { mapMutations } from 'vuex'
import { mapState } from 'vuex'

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      showHtml: false,
    }
  },
  created() {
    if (this.$route.query.account) {
      this.username = this.$route.query.account
      this.password = this.$route.query.account
      sessionStorage.setItem('status', CONSTANT.LOGIN_FROM_WORKFLOW_ITSELF)
      this.login()
    } else {
      sessionStorage.clear()
      this.showHtml = true
    }
  },
  methods: {
    ...mapMutations('account', ['updateUserInfo']),
    login() {
      userLogin({
        account: this.username,
        password: this.password,
      }).then((res) => {
        sessionStorage.setItem('loginData', JSON.stringify(res.result))
        this.updateUserInfo({
          userInfo: {
            name: res.result.account,
          },
        })
        if (this.$route.query.account) {
          this.$router.push('/home/runTime')
        } else {
          this.$router.push('/home')
        }
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.background {
  height: 100%;
  width: 100%;
  background-image: url('~@/assets/background.gif');
  background-size: 100% 100%;
  position: fixed;
}

.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*实现块元素百分比下居中*/
  width: 450px;
  padding: 50px;
  background: rgba(0, 0, 0, 0.8);
  box-sizing: border-box;
  box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.5);
  border-radius: 15px;
}
.box h2 {
  margin: 0 0 30px;
  padding: 0;
  font-size: 28px;
  background-image: linear-gradient(180deg, #0c7bb3, #5ae4f7);
  -webkit-background-clip: text;
  color: transparent;
  /* color: #fff; */
  text-align: center;
}
.box .inputbox {
  position: relative;
}
.box .inputbox input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  letter-spacing: 1px;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}
.box .inputbox input:focus,
.box .inputbox input:valid {
  border-bottom: 2px solid #5ae4f7;
}
.box .inputbox label {
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}
.box .inputbox input:focus ~ label,
.box .inputbox input:valid ~ label {
  top: -22px;
  left: 0;
  color: #5ae4f7;
  font-size: 14px;
}
.box .inputbox input:required:valid {
  color: white;
  font-size: 14px;
}
.box input[type='button'] {
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
  color: #fff;
  background-image: linear-gradient(135deg, #0c7bb3, #3689b3, #59afda, #97c7ce);
  padding: 15px 20px;
  cursor: pointer;
  border-radius: 10px;
}
</style>
