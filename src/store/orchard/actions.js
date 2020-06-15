import types from '@/store/constants/types'
import axios from '@/lib/ajax'
const that = this

export default {
    //获取所有角色列表的数据
    [types.GET_ROLE_LIST] (context) {
        axios({
            method:'get',
            url:'roles',
        }).then(res => {
            if(res.meta.status === 200){
                context.commit(types.GET_ROLE_LIST,res.data)
            }
        })
    },
    [types.DEL_ROLES_POWER] (context,payload) {
        axios({
            method:'delete',
            url:`roles/${payload.role.id}/rights/${payload.rightId.id}`
        }).then(res => {
            payload.this.$message({
                type: 'success',
                message: '删除成功!'
            });
            payload.role.children = res.data
        })
    },
    [types.GET_ASSIGN_ROLES] (context,payload) {
        axios({
            method:'get',
            url:'rights/tree'
        }).then(res => {
            if(res.meta.status === 200){
                context.commit(types.GET_ASSIGN_ROLES,res.data)
            }
        })
    },
    [types.EDIT_ASSIGN_ROLES] (context,payload) {
        axios({
            method:'post',
            url:`roles/${payload.roleId}/rights`,
            data:{rids:payload.keyStr}
        }).then(res => {
            if(res.meta.status === 200){
                context.dispatch(types.GET_ROLE_LIST)
            }
        })
    }
}