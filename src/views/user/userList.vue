<template>
  <div class="app-container">
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
      <el-table-column label="用户名">
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
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
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
      listLoading: true
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
        username: ''
      }
      getUserList(params).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(err =>{
        this.listLoading = false
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
