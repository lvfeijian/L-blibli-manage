import actions from './actions'
import mutations from './mutations'

export default{
    namespaced:true,
    state:{
        rolelist:[],//所有角色用户列表数据
        assignRolesData:[],//所有分配权限的数据
    },
    actions,
    mutations
}