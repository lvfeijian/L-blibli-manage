<template>
    <div>
        <el-button type='primary' @click='addRoles'>添加角色</el-button>
        <el-table
            :data="rolelist"
            @selection-change="handleSelectionChange"
            style="width: 100%"
            border
            stripe>
            <!-- 展开列 -->
            <el-table-column type='expand'>
                <template slot-scope='scope'>
                    <el-row v-for="(item1,index1) in scope.row.children" class="all" :class='{one:index1==0}'>
                        <el-col :span="6">
                            <el-tag type='primary' class="manage">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="18" >
                            <el-row  v-for="(item2,index2) in item1.children" :class="{list:index2!=0}">
                                <el-col :span='6'>
                                    <el-tag type='primary'>{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span='18'>
                                    <el-tag
                                        type='success'
                                        v-for='(item3,index3) in item2.children'
                                        closable
                                        @close='handleClose(scope.row,item3)'>
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <!-- 添加多选 -->
            <!-- <el-table-column
                type="selection"
                width="55">
            </el-table-column> -->
            <el-table-column 
                type='index'
                label='序号'>
            </el-table-column>
            <el-table-column
                prop="id"
                label="id"
                width="180">
            </el-table-column>
            <el-table-column
                prop="roleName"
                label="角色名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="roleDesc"
                label="角色描述"
                width="180">
            </el-table-column>
            <el-table-column label='操作'>
                <template slot-scope='scope'>
                    <!-- {{scope.row.children}} -->
                    <el-button type='primary' icon='el-icon-edit'>编辑</el-button>
                    <el-button type='danger' icon='el-icon-delete'>删除</el-button>
                    <el-button type='warning' icon='el-icon-setting' @click='doAssignRoles(scope.row)'>分配角色</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加角色对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="dialogVisible"
            width="30%">
            <div v-for='item in multipleSelection'>
                {{item.id}}
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="assignRoles"
            width="50%">
            <el-tree
                :data="assignRolesData"
                :props="assignRolesProps"
                default-expand-all
                show-checkbox
                node-key='id'
                :default-checked-keys="defKeys"
                ref='treeRef'>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="assignRoles = false">取 消</el-button>
                <el-button type="primary" @click="editAssignRoles">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import { createNamespacedHelpers } from 'vuex'
    const nameSpaced = ns.ORCHARD + '/'
    const thisMapState = createNamespacedHelpers(nameSpaced).mapState
    export default{
        name:'Orchard',
        computed: {
            ...thisMapState(['rolelist','assignRolesData'])
        },
        data() {
            return {
                multipleSelection: [],//选中的多选框的数据
                dialogVisible:false,//角色列表提示框显示隐藏
                assignRoles:false,//分配权限提示框显示隐藏
                assignRolesProps:{
                    label:'authName',
                    children:"children"
                },
                defKeys:[],//分配角色三级权限选中的id
                roleId:''
            }
        },
        created() {
            this.$store.dispatch(nameSpaced + types.GET_ROLE_LIST)
        },
        methods: {
            //当多选框变化时触发
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            
            //展示添加角色页面
            addRoles() {
                this.dialogVisible = true
            },

            //点击删除按钮，弹出删除确定框
            handleClose (role, rightId) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(res => {
                    this.$store.dispatch(nameSpaced + types.DEL_ROLES_POWER,{role,rightId,"this":this})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });      
                })
            },

            //点击分配权限，显示分配权限列表
            doAssignRoles (role) {
                this.roleId = role.id
                this.defKeys = []
                this.getDefKeys(role,this.defKeys)
                this.assignRoles = true
                this.$store.dispatch(nameSpaced + types.GET_ASSIGN_ROLES)
            },

            //通过递归获取角色下面的三级权限的id,并保存到defkeys数组中
            getDefKeys (node, arr) {
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getDefKeys(item,arr)
                })
            },

            //修改分配权限数据
            editAssignRoles () {
                let keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const keyStr = keys.join(',')
                this.$store.dispatch(nameSpaced + types.EDIT_ASSIGN_ROLES,{keyStr:keyStr,roleId:this.roleId})
                this.assignRoles = false
            }

        },
        updated() {
        },
    }
</script>

<style lang="scss">
.all{
    &.one{
        border-top: 1px solid #ccc;
    }
    border-bottom: 1px solid #ccc;
    .manage{
        margin: 8px;
    }
    .list{
        border-top: 1px solid #ccc;
    }
}
</style>