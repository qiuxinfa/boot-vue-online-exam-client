<template>
  <div class="app-container">

    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="filters.keyword" placeholder="输入用户名查询"></el-input>
      </el-form-item>
<!--      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="handelAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center">
          <template scope="scope">
              <span>{{(startPage - 1) * pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登陆时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.lastLoginTime">{{scope.row.lastLoginTime | dateFormat}}</span>
          <span v-else>尚未登录</span>
        </template>
      </el-table-column>
      <el-table-column label="允许登陆" align="center">
			      <template slot-scope="scope">
							<el-switch
							  @change="switchChange(scope.row.enable,scope.row.id)"
							  v-model="scope.row.enable"
							  active-color="#13ce66"
							  inactive-color="#ff4949"
								:active-value="activeValue"
                :inactive-value="inactiveValue">
							</el-switch>
			 </template>
      </el-table-column>
      <el-table-column
            align="center"
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary" icon="el-icon-edit"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger" icon="el-icon-delete"
                @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
      </el-table-column>
    </el-table>

    <el-col>
    		<div class="block" style="float: right;margin-right: 10px;margin-top: 10px;">
    			<el-pagination
    				@size-change="handleSizeChange"
    				@current-change="handleCurrentChange"
    				:current-page="startPage"
    				:page-sizes="pageSizes"
    				:page-size="pageSize"
    				layout="total, sizes, prev, pager, next, jumper"
    				:total="total">
    			</el-pagination>
    	 </div>
    </el-col>

    <!-- 　　新增和编辑 弹框 -->
    <el-dialog
        :title="titleMap[currentType]"
        :visible.sync="dialogFormVisible" >
          <div style="width:80%;margin: 0 auto">
            <el-form :model="ruleForm" status-icon :rules="rules"  ref="ruleForm" :inline="false" label-width="90px" class="demo-ruleForm">
                <el-form-item label="用户名"   prop="username">
                  <el-input type="text" placeholder="用户名" auto-complete="off" v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input type="text" placeholder="邮箱" auto-complete="off" v-model="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass1">
                  <el-input type="password" placeholder="密码以字母开头，长度在6~18之间，只能包含字符、数字和下划线" auto-complete="off" v-model="ruleForm.pass1"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="pass2">
               <el-input type="password" placeholder="确认密码" auto-complete="off"  v-model="ruleForm.pass2"></el-input>
                </el-form-item>
                  <el-form-item label="角色" prop="role">
                    <el-select v-model="ruleForm.role" filterable placeholder="请选择">
                      <el-option
                        v-for="item in roles"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                   </el-select>
                  </el-form-item>
                  <el-form-item label="是否启用">
                    <el-switch
                      v-model="ruleForm.switchValue"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                  </el-form-item>
              </el-form>
           </div>
           <div slot="footer" class="dialog-footer">
             <el-button @click="dialogFormVisible = false">取 消</el-button>
             <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
           </div>
   </el-dialog>


  </div>
</template>

<script>
import { getUserList,addUser,updateUser,deleteUser } from '@/api/user'
import { getUserId } from '@/utils/auth'
import { formatDate } from '@/utils/date'


export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    dateFormat(time){
      return formatDate(new Date(time),'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    // 检测两次密码是否一致
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback();
      }
    }

    return {
      filters: {
      	keyword: ''
      },
      activeValue: 1,
      inactiveValue: 0,
      listLoading: false, // 加载等待
      pageSizes: [6, 10, 20, 40],
      startPage: 1,
      pageSize: 6,
      total: 0,
      list: null,
      listLoading: true,
      currentType: 'add',  //新增、查看、编辑公用一个弹窗，当前弹框类型，'add','view','edit'，默认为新增
      dialogFormVisible:false,
      ruleForm: {
      	username: '',
      	pass1: '',
      	pass2: '',
      	email: '',
      	switchValue: true,
      	role: ''
      },
      // 表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名'},
          { min: 2, max: 10, message: '长度在 5 到 12 个字符'}
        ],
        email: [
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '请输入正确的邮箱地址' }
        ],
        pass1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {validator: 'regexp', pattern: /^[a-zA-Z]\w{5,17}$/, message: '密码格式不正确', trigger: 'change,blur'}
        ],
        pass2: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
      },
     //新增or编辑弹框标题(根据点击的新增or编辑按钮显示不同的标题)
     titleMap: {
         add:'新增',
         view: "查看信息",
         edit: "修改信息"
     },
     //新增和编辑弹框标题
     dialogStatus: ""

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      let params = {
        startPage: this.startPage,
        pageSize: this.pageSize,
        username: this.filters.keyword
      }
      getUserList(params).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(err =>{
        this.listLoading = false
      })
    },

    //查询
    queryData(){
      this.fetchData()
    },
    
    // 表单提交
    submitForm(formName) {
    	this.$refs[formName].validate((valid) => {
    		if (valid) {
    			this.addUser()
    		} else {
    			console.log('error submit!!');
    			return false
    		}
    	})
    },
     //新增
    handelAdd() {
      this.currentType = 'add'
      //显示弹框
      this.dialogFormVisible = true;
     },
     //编辑
    handleEdit(obj) {
      this.currentType = 'edit'
      //显示弹框
      this.dialogFormVisible = true;
     },
    // 删除
    handleDelete(id){
      let params = {
        id: id
      }
      deleteUser(params).then(response => {
        let msg = "删除失败"
        let msgType = 'error'
        if(response.data.code == 200){
          msg = "删除成功"
          msgType = 'success'
        }
        this.$message({
                  message: msg,
                  type: msgType
                });
        //刷新列表
        this.fetchData()
      }).catch(err =>{
        this.$message({
                  message: '删除失败',
                  type: 'error'
                });
      })
    },
    // 每页大小改变时触发
    handleSizeChange (val) {
    	this.pageSize = val
    	this.fetchData()
    },
    // 当前页码改变时触发
    handleCurrentChange (val) {
    	this.startPage = val
    	this.fetchData()
    },
    //修改用户状态
    switchChange(status,id) {
      let params = {
        enable: status,
        id: id
      }
      updateUser(params).then(response => {
        let msg = status == 1 ? "已允许用户登录" : "已禁止用户登录"
        this.$message({
                  message: msg,
                  type: 'success'
                });
        //刷新列表
        this.fetchData()
      }).catch(err =>{
        this.$message({
                  message: '修改用户状态失败',
                  type: 'error'
                });
      })
    },


  }
}
</script>
