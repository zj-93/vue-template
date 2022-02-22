import { signIn } from '@/api/login'
import { setToken } from '@/utils/auth'

const user = {
    state: {
        userInfo: {}
    },
    mutations: {
        SET_USER_INFO(state, data) {
            state.userInfo = data
        }
    },
    actions: {
        Login({
            commit
        }, content) {
            return new Promise((resolve, reject) => {
                signIn(content).then(res => {
                    if(res) {
                        commit('SET_USER_INFO', res.data)
                        sessionStorage.setItem('token', res.data.token)
                        resolve(res)
                    }
                })
            })
        },
        LoginOut({commit}, content) {

        }
    }
}

export default user