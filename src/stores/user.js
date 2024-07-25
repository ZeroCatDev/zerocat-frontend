import { jwtDecode } from "jwt-decode"
import { ref } from "vue"

var token = ref(null)
var user = ref({})
var islogin = ref(false)

const loaduser = () => {
  if (localStorage.getItem("token")) {
    token.value = localStorage.getItem("token")
    user.value = jwtDecode(token.value)
    islogin.value = true
  } else {
    islogin.value = false
    user.value = {}
  }
  console.log("用户登录信息----------")
  console.log("token:" + token.value)
  console.log(user.value)
  console.log("是否登录:" + islogin.value)
}

loaduser()

export const localuser = { token, user, islogin, loaduser }
