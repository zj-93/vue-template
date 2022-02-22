import router from '@/router/index.js'

const menu = {
    state: {
        menuList: []
    },
    mutations: {
        SET_MENU_LIST: (state, content) => {
            state.menuList = content
        }
    },
    actions: {
        setDeptList({
            dispatch,
            commit
        }) {
            return new Promise((resolve, reject) => {
                const opts = router.options.routes
                let temp = []
                opts.forEach(elm => {
                    if (elm.name != 'Login' && !elm.hidden) {
                        if (elm.children && elm.children.length) {
                            dispatch('menuHandle', elm.children).then(res => {
                                elm.children = res
                                temp.push(elm)
                            })
                        } else {
                            temp.push(elm)
                        }
                    }
                })
                commit('SET_MENU_LIST', temp)
                resolve(temp)
            })
        },
        menuHandle({
            dispatch,
            commit
        }, item) {
            return new Promise((resolve, reject) => {
                let temp = []
                item.forEach(elm => {
                    if (!elm.hidden) {
                        if (elm.children && elm.children.length) {
                            dispatch('menuHandle', elm.children).then(res => {
                                elm.children = res
                                temp.push(elm)
                            })
                        } else {
                            temp.push(elm)
                        }
                    }
                })
                resolve(temp)
            })
        }

    }
}

export default menu