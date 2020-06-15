import axios from '@/lib/ajax'
import types from '@/store/constants/types'

export default {
    [types.GET_POWER_LIST] (context) {
        axios({
            method:'get',
            url:'rights/list'
        }).then(res => {
            if(res.meta.status === 200){
                context.commit(types.GET_POWER_LIST,res.data)
            }
        })
    }
}