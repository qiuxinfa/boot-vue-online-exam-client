<template>
  <div class="app-container">

    <el-form :inline="true" :model="filters" class="demo-form-inline">
          <el-form-item label="试卷名称">
            <el-input v-model="filters.keyword" placeholder="输入试卷名称查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="handelAdd">随机组卷</el-button>
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
      <el-table-column label="试卷名称"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试卷总分"  align="center">
        <template slot-scope="scope">
          {{ scope.row.totalScore }}
        </template>
      </el-table-column>
      <el-table-column label="考试总时间(分钟)" align="center">
        <template slot-scope="scope">
          {{ scope.row.totalTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
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
                @click="handleView(scope.row.id)">查看试卷详情</el-button>
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
            <el-form :model="ruleForm" status-icon :rules="rules"  ref="ruleForm" :inline="false" label-width="100px" class="demo-ruleForm">
              <el-row>
                <el-col span="12">
                  <el-form-item label="试卷名称" prop="name">
                    <el-input type="text" placeholder="试卷名称" auto-complete="off" v-model="ruleForm.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="考试总时间" prop="totalTime">
                    <el-input type="number" placeholder="单位为分钟" auto-complete="off" v-model="ruleForm.totalTime"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="填空题数量" prop="fillNumber">
                    <el-input type="number" placeholder="填空题数量" auto-complete="off" v-model="ruleForm.fillNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="填空题分数" prop="fillScore">
                    <el-input type="number" @blur="fillScoreChange" placeholder="单题的分数" auto-complete="off" v-model="ruleForm.fillScore"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="判断题数量" prop="judgeNumber">
                    <el-input type="number" placeholder="判断题数量" auto-complete="off" v-model="ruleForm.judgeNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="判断题分数" prop="judgeScore">
                    <el-input type="number" placeholder="单题的分数" auto-complete="off" v-model="ruleForm.judgeScore"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="单选题数量"   prop="singleNumber">
                    <el-input type="number" placeholder="单选题数量" auto-complete="off" v-model="ruleForm.singleNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="单选题分数" prop="singleScore" >
                    <el-input type="number" placeholder="单题的分数" auto-complete="off" v-model="ruleForm.singleScore"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="多选题数量" prop="multiNumber" >
                    <el-input type="number" placeholder="多选题数量" auto-complete="off" v-model="ruleForm.multiNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="多选题分数" prop="multiScore" >
                    <el-input type="number" placeholder="单题的分数" auto-complete="off" v-model="ruleForm.multiScore"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="试卷描述"   prop="examDesc">
                <el-input type="textarea" placeholder="试卷描述" auto-complete="off" v-model="ruleForm.examDesc"></el-input>
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
import { getPaperList,addPaper } from '@/api/paper'
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
    //校验数字
    let validcodeNumber=(rule,value,callback)=>{
        let reg=/^(0|[1-9][0-9]*)$/
        if(!reg.test(value)){callback(new Error('只能填非负整数'))
        }else{
            callback()
        }
    };
    //校验分数
    let validcodeScore=(rule,value,callback)=>{
        let reg=/^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/
        if(!reg.test(value)){callback(new Error('分数必须是大于等于0'))
        }else{
            callback()
        }
    };
    return {
      filters: {
      	keyword: ''
      },
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
       	name: '',
        examDesc: '',
       	fillNumber: '',
       	judgeNumber: '',
       	singleNumber: '',
        multiNumber: '',
        fillScore: '',
        judgeScore: '',
        singleScore: '',
        multiScore: '',
        totalTime: ''
       },
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入试卷名称'}
        ],
        fillNumber: [
           { required: true, message: '请输入填空题数量', trigger: 'blur' },
            {validator:validcodeNumber, trigger: 'blur'}
        ],
        judgeNumber: [
           { required: true, message: '请输入填空题数量', trigger: 'blur' },
            {validator:validcodeNumber, trigger: 'blur'}
        ],
        singleNumber: [
           { required: true, message: '请输入填空题数量', trigger: 'blur' },
            {validator:validcodeNumber, trigger: 'blur'}
        ],
        multiNumber: [
           { required: true, message: '请输入填空题数量', trigger: 'blur' },
           {validator:validcodeNumber, trigger: 'blur'}
        ],
        fillScore: [
           { required: true, message: '请输入分数', trigger: 'blur' },
           {validator: validcodeScore ,trigger: 'blur'}
        ],
        judgeScore: [
           { required: true, message: '请输入分数', trigger: 'blur' },
           {validator: validcodeScore ,trigger: 'blur'}
        ],
        singleScore: [
           { required: true, message: '请输入分数', trigger: 'blur' },
           {validator: validcodeScore ,trigger: 'blur'}
        ],
        multiScore: [
           { required: true, message: '请输入分数', trigger: 'blur' },
           {validator: validcodeScore ,trigger: 'blur'}
        ],
        totalTime: [
           { required: true, message: '试卷总时间不能为空', trigger: 'blur' },
            {validator:validcodeNumber, trigger: 'blur'}
        ],
      },

      //新增or编辑弹框标题(根据点击的新增or编辑按钮显示不同的标题)
      titleMap: {
          add:'随机组卷',
          view: "查看信息",
          edit: "修改信息"
      },
      roles: [], //角色列表

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
        userId: getUserId(),
        name: this.filters.keyword
      }
      getPaperList(params).then(response => {
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
    // 表单提交
    submitForm(formName) {
    	this.$refs[formName].validate((valid) => {
    		if (valid) {
    			if(this.currentType == 'add'){
            this.doAdd()
          }else if(this.currentType == 'edit'){
            this.doUpdate()
          }
    		} else {
    			console.log('error submit!!');
    			return false
    		}
    	})
    },

    fillScoreChange(val){
      if(val > 10){
      this.$message({
                message: '分数不能大于 10 aa',
                type: 'error'
              });
      }
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
      this.ruleForm = obj
      //显示弹框
      this.dialogFormVisible = true;
     },
     // 执行添加
    doAdd(){
       // let params = {
       //   id: id,

       // }
       addPaper(this.ruleForm).then(response => {
         let msg = "添加失败"
         let msgType = 'error'
         if(response.data.code == 200){
           msg = "添加成功"
           msgType = 'success'
         }
         this.$message({
                   message: msg,
                   type: msgType
                 });
         // 关闭弹窗
         this.dialogFormVisible = false
         //刷新列表
         this.fetchData()
       }).catch(err =>{
         this.$message({
                   message: '添加失败',
                   type: 'error'
                 });
       })
     },
    //查看试卷详情
    handleView(recordId){
    //   this.$router.push({path: '/exam/record/viewAnswer', query: {recordId: recordId,isPractice: true}})
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
