<template>
  <div class="app-container">

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="填空题" name="first"></el-tab-pane>
        <el-tab-pane label="判断题" name="second"></el-tab-pane>
        <el-tab-pane label="单选题" name="third"></el-tab-pane>
        <el-tab-pane label="多选题" name="fourth"></el-tab-pane>
      </el-tabs>

    <el-form :inline="true" :model="filters" class="demo-form-inline">
          <el-form-item label="题目内容">
            <el-input v-model="filters.keyword" placeholder="输入题目内容查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="handelAdd">新增题目</el-button>
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
          <template slot-scope="scope">
              <span>{{(startPage - 1) * pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column label="题目内容"  align="center" show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"  align="center">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column label="难度等级" align="center">
        <template slot-scope="scope">
          {{ scope.row.level }}
        </template>
      </el-table-column>
      <el-table-column
            align="center"
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary" icon="el-icon-view"
                @click="handleView(scope.row.id)">查看题目</el-button>
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
               <el-form-item label="头像"   prop="photoUrl">
               <el-upload
                   class="avatar-uploader"
                   action="xxx"
                   :show-file-list="false"
                   :on-success="handleAvatarSuccess"
                   :before-upload="beforeAvatarUpload">
                   <img v-if="ruleForm.photoUrl" :src="ruleForm.photoUrl" class="avatar">
                   <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                 </el-upload>
               </el-form-item>
                </el-form-item>
                  <el-form-item label="角色" prop="role">
                    <el-select v-model="ruleForm.roleName" filterable placeholder="请选择">
                      <el-option
                        v-for="item in roles"
                        :key="item.name"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                   </el-select>
                  </el-form-item>
                  <el-form-item label="是否启用">
                    <el-switch
                      v-model="ruleForm.enable"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="activeValue"
                      :inactive-value="inactiveValue">
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
import { getFillList,getJudgeList,getSingleList,getMultiList } from '@/api/question'
import { getUserId } from '@/utils/auth'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      filters: {
      	keyword: ''
      },
      activeName: 'first',
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
        id: '',
      	username: '',
      	password: '123456',  //默认密码
      	// pass2: '',
      	email: '',
      	enable: 1,
        photoUrl: '',
      	roleName: ''
      },
      //新增or编辑弹框标题(根据点击的新增or编辑按钮显示不同的标题)
      titleMap: {
          add:'新增',
          view: "查看",
          edit: "修改"
      },
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
        content: this.filters.keyword
      }
      let doQuery = getFillList
      if(this.activeName == 'second'){
        doQuery = getJudgeList
      }else if(this.activeName == 'third'){
        doQuery = getSingleList
      }else if(this.activeName == 'fourth'){
        doQuery = getMultiList
      }
      doQuery(params).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(err =>{
        this.listLoading = false
      })
    },

    queryData(){
      this.fetchData()
    },
    //切换标签页
    handleClick(tab, event) {
      this.fetchData()
      // debugger
      // console.log("tab =="+tab+ " event =="+event)
    },
    //查看题目详情
    handleView(recordId){
     // this.$router.push({path: '/exam/record/viewAnswer', query: {recordId: recordId,isPractice: true}})
    },
    //添加
    handelAdd() {
      this.currentType = 'add'
      //显示弹框
      this.dialogFormVisible = true;
     },
     //编辑
    handleEdit(obj) {
      this.currentType = 'edit'
      this.ruleForm = obj
      //显示弹框
      this.dialogFormVisible = true;
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
    }


  }
}
</script>
