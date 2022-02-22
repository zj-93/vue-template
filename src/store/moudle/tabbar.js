const tabBar = {
    state: {
        moreMenuList: ['Form'],
        barList: []
    },
    mutations: {
        SET_BAR_LIST(state, data) {
            state.barList = data;
        },
        ADD_BAR_LIST: (state, content) => {
            // 不允许重复，每个标签只允许存在一个
            // let ind = state.barList.findIndex(el => el.key === content.key)
            // if(ind == -1) {
            //     state.barList.push(content)
            // }
            // sessionStorage.setItem("tabbar", JSON.stringify(state.barList));
            // 每个标签都可以重复打开多个
            if(state.moreMenuList.includes(content.key)) {
                state.barList.push(content)
            } else {
                let ind = state.barList.findIndex(el => el.key === content.key)
                if(ind == -1) {
                    state.barList.push(content)
                }
            }
            sessionStorage.setItem("tabbar", JSON.stringify(state.barList));
        },
        DEL_BAR_LIST: (state, index) => {
            state.barList.splice(index, 1)
            sessionStorage.setItem("tabbar", JSON.stringify(state.barList));
        }
    },
    actions: {
        addBarList({
            commit
        },  content) {
            commit('ADD_BAR_LIST', content)
        },
        delBarList({
            commit
        },  index) {
            commit('DEL_BAR_LIST', index)
        },
    }
}

export default tabBar