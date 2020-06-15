<template>
    <div>
        <el-table :data="power">
            <el-table-column type='index' label='#'>
            </el-table-column>
            <el-table-column prop='authName' label='权限名称'>
            </el-table-column>
            <el-table-column prop='path' label='路径'>
            </el-table-column>
            <el-table-column prop='level' label='权限等级'>
                <template slot-scope='scope'>
                    <el-tag v-if="scope.row.level==0">一级</el-tag>
                    <el-tag v-else-if="scope.row.level==1" type='success'>二级</el-tag>
                    <el-tag v-else-if="scope.row.level==2" type='primary'>三级</el-tag>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
import types from '@/store/constants/types'
import ns from '@/store/constants/ns.js'
import { createNamespacedHelpers } from 'vuex'
const nameSpaced = ns.MASSIF+'/'
const thisMapState = createNamespacedHelpers(nameSpaced).mapState

export default{
    name:"Massif",
    computed:{
        ...thisMapState(['power'])
    },
    created() {
        this.$store.dispatch(nameSpaced + types.GET_POWER_LIST)
    },
}
</script>
<style lang="scss">
</style>