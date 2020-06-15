import types from '@/store/constants/types'

export default {
    [types.GET_POWER_LIST] (state,payload) {
        state.power = payload
    }
}