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
      <el-table-column label="题目内容"  align="center" :show-overflow-tooltip="true">
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
            <el-form :model="ruleForm" status-icon ref="ruleForm" :inline="false" label-width="90px" class="demo-ruleForm">
                <el-form-item label="题目类型">
                  <el-select v-model="activeName" placeholder="请选择题型">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="题目" prop="questionContent" :rules="[{ required: true, message: '请输入题目'},{ min: 1, max: 200, message: '长度在 1 到 200 个字符'}]">
                  <el-input type="textarea" placeholder="输入题目,如:从计算机网络系统组成的角度看，计算机网络可以分为()和()。注意需要考生答题部分一定要用括号（英文半角）括起来。"
                      auto-complete="off" v-model="ruleForm.questionContent"></el-input>
                </el-form-item>
                <template v-if="activeName=='first'">
                  <el-form-item label="正确答案" prop="questionAnswer" :rules="[{ required: true, message: '请输入题目'},{ min: 1, max: 100, message: '长度在 1 到 100 个字符'}]">
                    <el-input  type="text" placeholder="每两个个空之间的答案用英文逗号分隔" auto-complete="off" v-model="ruleForm.questionAnswer"></el-input>
                  </el-form-item>
                </template>
                <template v-if="activeName == 'second'" >
                  <el-form-item label="正确答案" prop="questionAnswer" :rules="{ required: true, message: '请选择答案', trigger: 'change' }">
                    <el-select v-model="ruleForm.questionAnswer" filterable placeholder="请选择答案">
                      <el-option
                        v-for="item in judgeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                   </el-select>
                  </el-form-item>
                </template>
               <template v-if="activeName == 'third' || activeName == 'fourth'" >
                 <el-form-item label="选项A" prop="choiceA" :rules="[{ required: true, message: '请输入题目'},{ min: 1, max: 100, message: '长度在 1 到 100 个字符'}]">
                   <el-input  type="text" placeholder="输入选项内容" auto-complete="off" v-model="ruleForm.choiceA"></el-input>
                 </el-form-item>
                 <el-form-item label="选项B" prop="choiceB" :rules="[{ required: true, message: '请输入题目'},{ min: 1, max: 100, message: '长度在 1 到 100 个字符'}]">
                   <el-input  type="text" placeholder="输入选项内容" auto-complete="off" v-model="ruleForm.choiceB"></el-input>
                 </el-form-item>
                 <el-form-item label="选项C" prop="choiceC" :rules="[{ required: true, message: '请输入题目'},{ min: 1, max: 100, message: '长度在 1 到 100 个字符'}]">
                   <el-input  type="text" placeholder="输入选项内容" auto-complete="off" v-model="ruleForm.choiceC"></el-input>
                 </el-form-item>
                 <el-form-item label="选项D" prop="choiceD" :rules="[{ required: true, message: '请输入题目'},{ min: 1, max: 100, message: '长度在 1 到 100 个字符'}]">
                   <el-input  type="text" placeholder="输入选项内容" auto-complete="off" v-model="ruleForm.choiceD"></el-input>
                 </el-form-item>
               </template>
               <template v-if="activeName == 'third'">
                 <el-form-item  label="正确答案" prop="questionAnswer" :rules="{ required: true, message: '请选择答案', trigger: 'change' }">
                   <el-select v-model="ruleForm.questionAnswer" filterable placeholder="请选择答案">
                     <el-option
                       v-for="item in singleOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
                     </el-option>
                  </el-select>
                 </el-form-item>
               </template>
               <template v-if="activeName == 'fourth'">
                 <el-form-item  label="正确答案" prop="multi" :rules="{ required: true, message: '请选择答案', trigger: 'blur' }">
                   <el-select multiple v-model="ruleForm.multi" filterable placeholder="请选择答案">
                     <el-option
                       v-for="item in singleOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
                     </el-option>
                  </el-select>
                 </el-form-item>
               </template>
                <el-form-item label="题目难度" prop="questionLevel" :rules="[{ required: true, message: '请选择题目难度', trigger: 'change' }]">
                  <el-select v-model="ruleForm.questionLevel" filterable placeholder="请选择">
                    <el-option
                      v-for="item in levels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                 </el-select>
                </el-form-item>
                <el-form-item label="答案解析" prop="questionExplain" :rules="[{max: 200, message: '最多输入 200 个字符',trigger: 'blur' }]">
                  <el-input type="textarea" placeholder="解析答案,方便理解" auto-complete="off" v-model="ruleForm.questionExplain"></el-input>
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
import { getFillList,getJudgeList,getSingleList,getMultiList,addFill,addJudge,addSingle,addMulti } from '@/api/question'
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
      options: [
        {value:'first',label:'填空题'},
        {value:'second',label:'判断题'},
        {value:'third',label:'单选题'},
        {value:'fourth',label:'多选题'}
      ],
      judgeOptions: [
        {id: 'T',name: '正确'},
        {id: 'F',name: '错误'}
      ],
      singleOptions: [
       {id: 'A',name: 'A'},
       {id: 'B',name: 'B'},
       {id: 'C',name: 'C'},
       {id: 'D',name: 'D'}
      ],
      //题目难度等级，最好是到后台查数据字典，这里简单起见，没有这么做了
      levels: [
        {id: 1,name: '简单'},
        {id: 2,name: '中等'},
        {id: 3,name: '困难'}
      ],
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
      	questionContent: '',
      	questionAnswer: '',
      	questionLevel: '',
        questionExplain: '',
        multi: [],  //多选题选项答案，用数组临时存储
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: ''
      },
      // 表单验证
      // rules: {
      //   questionContent: [
      //     { required: true, message: '请输入题目'},
      //     { min: 1, max: 200, message: '长度在 1 到 200 个字符'}
      //   ],
      //   questionAnswer: [
      //     { required: true, message: '请输入题目的答案' },
      //     { min: 1, max: 100, message: '长度在 1 到 100 个字符'}
      //   ],
      //   questionLevel: [
      //     { required: true, message: '请选择题目难度', trigger: 'change' }
      //   ],
      //   questionExplain: [
      //     {max: 200, message: '最多输入 200 个字符'}
      //   ],
      // },

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

    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
      	if (valid) {
          // 新增
          if(this.currentType == 'add'){
              // debugger
              let doAdd = addFill
              if(this.activeName == 'second'){
                doAdd = addJudge
              }else if(this.activeName == 'third'){
                doAdd = addSingle
              }else if(this.activeName == 'fourth'){
               // console.log("多选题答案  "+this.multi)
               let answer = this.ruleForm.multi
               this.ruleForm.questionAnswer = answer.join(",")
               doAdd = addMulti
              }
              //这里主要是为了复用代码，没有分别写一个函数，通过这种方式，可以动态改变要调用的方法
              doAdd(this.ruleForm).then(response => {
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

          }else if(this.currentType == 'edit'){
           // this.doUpdate()
          }
      	} else {
      		this.$message({message: '表单有必填项没填',
      		      type: 'error'});
      		return false
      	}
      })

    },

    //添加填空题
    // addQuestion(){
    //    addFill(this.ruleForm).then(response => {
    //      let msg = "添加失败"
    //      let msgType = 'error'
    //      if(response.data.code == 200){
    //        msg = "添加成功"
    //        msgType = 'success'
    //      }
    //      this.$message({
    //                message: msg,
    //                type: msgType
    //              });
    //      // 关闭弹窗
    //      this.dialogFormVisible = false
    //      //刷新列表
    //      this.fetchData()
    //    }).catch(err =>{
    //      this.$message({
    //                message: '添加失败',
    //                type: 'error'
    //              });
    //    })
    // },
    //添加判断题
    // addJudgeQuestion(){
    //    addJudge(this.ruleForm).then(response => {
    //      let msg = "添加失败"
    //      let msgType = 'error'
    //      if(response.data.code == 200){
    //        msg = "添加成功"
    //        msgType = 'success'
    //      }
    //      this.$message({
    //                message: msg,
    //                type: msgType
    //              });
    //      // 关闭弹窗
    //      this.dialogFormVisible = false
    //      //刷新列表
    //      this.fetchData()
    //    }).catch(err =>{
    //      this.$message({
    //                message: '添加失败',
    //                type: 'error'
    //              });
    //    })
    // },
    // //添加单选题
    // addSingleQuestion(){
    //    addSingle(this.ruleForm).then(response => {
    //      let msg = "添加失败"
    //      let msgType = 'error'
    //      if(response.data.code == 200){
    //        msg = "添加成功"
    //        msgType = 'success'
    //      }
    //      this.$message({
    //                message: msg,
    //                type: msgType
    //              });
    //      // 关闭弹窗
    //      this.dialogFormVisible = false
    //      //刷新列表
    //      this.fetchData()
    //    }).catch(err =>{
    //      this.$message({
    //                message: '添加失败',
    //                type: 'error'
    //              });
    //    })
    // },
    // //添加多选题
    // addMultiQuestion(){
    //    addMulti(this.ruleForm).then(response => {
    //      let msg = "添加失败"
    //      let msgType = 'error'
    //      if(response.data.code == 200){
    //        msg = "添加成功"
    //        msgType = 'success'
    //      }
    //      this.$message({
    //                message: msg,
    //                type: msgType
    //              });
    //      // 关闭弹窗
    //      this.dialogFormVisible = false
    //      //刷新列表
    //      this.fetchData()
    //    }).catch(err =>{
    //      this.$message({
    //                message: '添加失败',
    //                type: 'error'
    //              });
    //    })
    // },
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
