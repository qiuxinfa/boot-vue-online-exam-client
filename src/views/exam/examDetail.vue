// 点击试卷后的缩略信息
<template>
  <div id="msg">
    <div class="title">
      <span>试卷详情</span>
    </div>
    <div class="wrapper">
      <ul class="top">
        <li class="example">{{examData.examDesc}}</li>
<!--        <li><i class="iconfont icon-pen-"></i></li>
        <li><i class="iconfont icon-share"></i></li> -->
        <li class="right"><el-button type="primary" @click="toAnswer(examData)">开始答题</el-button></li>
      </ul>
<!--     <ul class="bottom">
        <li class="right"><el-button @click="toAnswer(examId)">开始答题</el-button></li>
      </ul> -->
<!--      <ul class="info">
        <li @click="dialogVisible = true"><a href="javascript:;"><i class="iconfont icon-info"></i>考生须知</a></li>
      </ul> -->
    </div>
   <div class="content">
      <el-collapse v-model="activeName" >
        <el-collapse-item class="header" name="0">
          <template slot="title" class="stitle" >
            <div class="title">
              <!-- <span>{{totalScore}}</span><i class="header-icon el-icon-info"></i> -->
              <span class="time">总分：{{examData.totalScore}}  分  /  时间 {{examData.totalTime}} 分钟</span>
              <!-- <el-button type="primary" size="small">点击查看试题详情</el-button> -->
            </div>
          </template>
          <div class="titlei" v-if="fillCnt != 0">填空题 (共{{fillCnt}}题， 每题{{examData.fillScore}}分)</div>
          <div class="titlei" v-if="judgeCnt != 0">判断题 (共{{judgeCnt}}题， 每题{{examData.judgeScore}}分)</div>
          <div class="titlei" v-if="singleCnt != 0">单选题 (共{{singleCnt}}题， 每题{{examData.singleScore}}分)</div>
          <div class="titlei" v-if="multiCnt != 0">多选题 (共{{multiCnt}}题， 每题{{examData.multiScore}}分)</div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--考生须知对话框-->
    <el-dialog
      title="考生须知"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{examDesc}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import http from '../../utils/http'
export default {
  data() {
    return {
      dialogVisible: false, //对话框属性
      activeName: '0',  //默认打开序号
      examData: {},  //考试安排
      singleCnt: '', //单选题数量
      multiCnt: '', //多选题数量
      judgeCnt: '', //判断题数量
      fillCnt: ''  //填空题数量
    }
  },
  mounted() {
    this.getExamData()
	// this.getTopicData()
  },
  methods: {
	 getExamData(){
		let _this = this
		let exam = _this.$route.query.exam;   //考试安排
    _this.examData = exam
    //解析每种类型题目的数量
    _this.singleCnt = (exam.singleIds == null || exam.singleIds=='') ? 0 : (exam.singleIds.split(',')).length
    _this.multiCnt = (exam.multiIds == null || exam.multiIds=='') ? 0 : (exam.multiIds.split(',')).length
    _this.judgeCnt = (exam.judgeIds == null || exam.judgeIds=='') ? 0 : (exam.judgeIds.split(',')).length
    _this.fillCnt = (exam.fillIds == null || exam.fillIds=='') ? 0 : (exam.fillIds.split(',')).length
	},
  toAnswer(exam) {
      this.$router.push({path: '/exam/answer', query: {exam: exam,isPractice: false}})
      // this.$router.push({path:"exam/answer",query:{exam: exam}})
  }
  }

}
</script>

<style lang="scss" scoped>
.bottom {
  .right{
    .el-button{
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
}
.right {
  margin-left: auto;
}
.inner .contenti .question {
  margin-left: 40px;
  color: #9a9a9a;
  font-size: 14px;
}
.content .inner .titlei {
  margin-left: 20px;
  font-size: 16px;
  color: #88949b;
  font-weight: bold;
}
.content .title .time {
  font-size: 16px;
  margin-left: 420px;
  color: #999;
}
.content .stitle {
  background-color: #0195ff;
}
.content .title span {
  margin-right: 10px;
}
#msg .content .title {
  font-size: 20px;
  margin: 0px;
  display: flex;
  align-items: center;
}
.content {
  margin-top: 20px;
  background-color: #fff;
}
.content .header {
  padding: 10px 30px;
}
.wrapper .info {
  margin: 20px 0px 0px 20px;
  border-top: 1px solid #eee;
  padding: 20px 0px 10px 0px;
}
.wrapper .info a {
  color: #88949b;
  font-size: 14px;
}
.wrapper .info a:hover {
  color: #0195ff;
}
.wrapper .bottom .btn {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #88949b;
  border-radius: 4px;
}
.wrapper .bottom {
  display: flex;
  margin-left: 20px;
  color: #999;
  font-size: 14px;
  align-items: center;
}
.wrapper .bottom li {
  margin-right: 14px;
}
#msg {
  background-color: #eee;
  width: 980px;
  margin: 0 auto;
}
#msg .title {
  margin: 20px;
}
#msg .wrapper {
  background-color: #fff;
  padding: 10px;
}
.wrapper .top {
  display: flex;
  margin: 20px;
  align-items: center;
}
.wrapper .top .right {
  margin-left: auto;
}
.wrapper .top .example {
  color: #333;
  font-size: 22px;
  font-weight: 700;
}
.wrapper .top li i {
  margin-left: 20px;
  color: #88949b;
}
.wrapper .right .count {
  margin-right: 60px;
  color: #fff;
  padding: 4px 10px;
  background-color: #88949b;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #88949b;
}
.wrapper .right .score {
  position: absolute;
  left: 53px;
  top: -5px;
  padding: 1px 12px;
  font-size: 20px;
  color: #88949b;
  border: 1px dashed #88949b;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-weight: bold;
}
.wrapper .right div {
  position: relative;
}
</style>
