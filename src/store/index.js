import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有任务列表
    list: [],
    inputValue: '',
    nextId: 5,
    viewKey: 'all'
  },
  mutations: {
    initList (state, list) {
      state.list = list
    },
    // 为state中的inputValue重新赋值
    setInputValue (state, val) {
      state.inputValue = val
    },
    // 添加待办项目到列表中
    addItem (state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue,
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据id删除对应的任务事项
    removeItem (state, id) {
      // 根据id找到对应项的索引
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引删除事项
      if (i !== -1) state.list.splice(i, 1)
    },
    // 修改列表中的选中状态
    changeStatus (state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    // 清除未完成的任务
    clearUnDone (state) {
      state.list = state.list.filter(x => x.done === false)
    },
    changeViewKey (state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList (context) {
      axios.get('/list.json').then(({ data }) => {
        context.commit('initList', data)
      })
    }
  },
  getters: {
    // 统计未完成任务的条数
    unDoneLength (state) {
      return state.list.filter(x => x.done === false).length
    },
    // 根据用户选择返回对应的列表数据去展示
    infoList (state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'undone') {
        return state.list.filter(x => !x.done)
      }
      if (state.viewKey === 'done') {
        return state.list.filter(x => x.done)
      }
    }
  },
  modules: {}
})
