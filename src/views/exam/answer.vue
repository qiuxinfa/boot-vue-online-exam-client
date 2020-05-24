<!--考生答题界面-->
<template>
  <div id="answer">
    <!--顶部信息栏-->
     <div class="top">
       <ul class="item">
         <li><i class="iconfont icon-menufold icon20" ref="toggle" @click="slider_flag = !slider_flag"></i></li>
         <li>欢迎admin参加 {{examData.examDesc}} 考试</li>
<!--         <li @click="flag = !flag">
           <i class="iconfont icon-user icon20"></i>
           <div class="msg"  v-if="flag" @click="flag = !flag">
             <p>姓名：{{userInfo.name}}</p>
             <p>准考证号:  {{userInfo.id}}</p>
           </div>
         </li> -->
         <li><i class="iconfont icon-arrLeft icon20"></i></li>
       </ul>
     </div>
     <div class="flexarea">
        <!--左边题目编号区-->
        <transition name="slider-fade">
          <div class="left" v-if="slider_flag">
            <ul class="l-top">
              <li>
                <a href="javascript:;"></a>
                <span>当前</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>未答</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>已答</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>标记</span>
              </li>
            </ul>
            <div class="l-bottom">
			  <div class="item">
			    <p>填空题部分</p>
			    <ul>
			      <li v-for="(item, index1) in topic[0]" :key="index1">
			        <a href="javascript:;" @click="fill(index1)" :class="{'border': index == index1 && currentType == 0,'bg': fillAnswer[index1][3] != 0}"><span :class="{'mark': topic[0][index1].isMark == true}"></span>{{index1+1}}</a>
			      </li>
			    </ul>
			  </div>
			  <div class="item">
			    <p>判断题部分</p>
			    <ul>
			      <li v-for="(list, index2) in topic[1]" :key="index2">
			        <a href="javascript:;" @click="judge(index2)" :class="{'border': index == index2 && currentType == 1,'bg': bg_flag && topic[1][index2].isClick == true}"><span :class="{'mark': topic[1][index2].isMark == true}"></span>{{topicCount[0]+index2+1}}</a>
			      </li>
			    </ul>
			  </div>
        <div class="item">
          <p>单选题部分</p>
          <ul>
            <li v-for="(list, index3) in topic[2]" :key="index3">
              <a href="javascript:;"
                @click="change(index3)"
                :class="{'border': index == index3 && currentType == 2,'bg': bg_flag && topic[2][index3].isClick == true}">
                <span :class="{'mark': topic[2][index3].isMark == true}"></span>
                {{topicCount[0]+topicCount[1]+index3+1}}
              </a>
            </li>
          </ul>
        </div>
         <div class="item">
           <p>多选题部分</p>
           <ul>
             <li v-for="(list, index4) in topic[3]" :key="index4">
               <a href="javascript:;"
                 @click="multiChange(index4)"
                 :class="{'border': index == index4 && currentType == 3,'bg': bg_flag && topic[3][index4].isClick == true}">
                 <span :class="{'mark': topic[3][index4].isMark == true}"></span>
                 {{topicCount[0]+topicCount[1]+topicCount[2]+index4+1}}
               </a>
             </li>
           </ul>
         </div>

              <div class="final" @click="commit()">结束考试</div>
            </div>
          </div>
        </transition>
        <!--右边选择答题区-->
        <transition name="slider-fade">
        <div class="right">
          <div class="title">
            <p>{{title}}</p>
            <i class="iconfont icon-right auto-right"></i>
            <span>全卷共{{topicCount[0] + topicCount[1] + topicCount[2]}}题  <i class="iconfont icon-time"></i>倒计时：<b>{{time}}</b>分钟</span>
          </div>
          <div class="content">
            <p class="topic"><span class="number">{{number}}</span>{{showQuestion}}</p>
            <div class="fill" v-if="currentType == 0">
              <div v-for="(item,currentIndex) in part" :key="currentIndex">
                <el-input placeholder="请填在此处"
                  v-model="fillAnswer[index][currentIndex]"
                  clearable
                  @clear="clearFillAnswer"
                  @blur="fillBG">
                </el-input>
              </div>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li> <el-tag type="success">正确姿势：</el-tag><span class="right">{{topic[0][index].questionAnswer}}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{topic[0][index].questionExplain == null ? '暂无解析': topic[0][index].questionExplain}}</li>
                </ul>
              </div>
            </div>
            <div class="judge" v-if="currentType == 1">
              <el-radio-group v-model="judgeAnswer[index]" @change="getJudgeLabel">
                <el-radio :label="answerT">T</el-radio>
                <el-radio :label="answerF">F</el-radio>
              </el-radio-group>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li> <el-tag type="success">正确姿势：</el-tag><span class="right">{{topic[1][index].questionAnswer}}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{topic[1][index].questionExplain == null ? '暂无解析': topic[1][index].questionExplain}}</li>
                </ul>
              </div>
            </div>
            <div v-if="currentType == 2">
              <el-radio-group v-model="radio[index]" @change="getChangeLabel" >
                <el-radio :label="answerA">A. {{showAnswer.choiceA}}</el-radio>
                <el-radio :label="answerB">B. {{showAnswer.choiceB}}</el-radio>
                <el-radio :label="answerC">C. {{showAnswer.choiceC}}</el-radio>
                <el-radio :label="answerD">D. {{showAnswer.choiceD}}</el-radio>
              </el-radio-group>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li> <el-tag type="success">正确姿势：</el-tag><span class="right">{{reduceAnswer.rightAnswer}}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{reduceAnswer.questionExplain == null ? '暂无解析': reduceAnswer.questionExplain}}</li>
                </ul>
              </div>
            </div>
             <div v-if="currentType == 3">
               <el-checkbox-group v-model="multi[index]" @change="changeMulti" >
                 <el-checkbox :label="answerA">A. {{showAnswer.choiceA}}</el-checkbox>
                 <el-checkbox :label="answerB">B. {{showAnswer.choiceB}}</el-checkbox>
                 <el-checkbox :label="answerC">C. {{showAnswer.choiceC}}</el-checkbox>
                 <el-checkbox :label="answerD">D. {{showAnswer.choiceD}}</el-checkbox>
               </el-checkbox-group>
               <div class="analysis" v-if="isPractice">
                 <ul>
                   <li> <el-tag type="success">正确姿势：</el-tag><span class="right">{{reduceAnswer.rightAnswer}}</span></li>
                   <li><el-tag>题目解析：</el-tag></li>
                   <li>{{reduceAnswer.questionExplain == null ? '暂无解析': reduceAnswer.questionExplain}}</li>
                 </ul>
               </div>
             </div>

          </div>
          <div class="operation">
            <ul class="end">
              <li @click="previous()"><i class="iconfont icon-previous"></i><span>上一题</span></li>
              <li @click="mark()"><i class="iconfont icon-mark-o"></i><span>标记</span></li>
              <li @click="next()"><span>下一题</span><i class="iconfont icon-next"></i></li>
            </ul>
          </div>
        </div>
        </transition>
     </div>
  </div>
</template>

<script>
import { getExamDetail,addExamRecord } from '@/api/exam'
import { getUserId } from '@/utils/auth'

export default {
  data() {
    return {
      answerA: 'A',
      answerB: 'B',
      answerC: 'C',
      answerD: 'D',
      answerT: 'T',
      answerF: 'F',
      isPractice: false,
      startTime: null, //考试开始时间
      endTime: null, //考试结束时间
      time: null, //考试持续时间
      reduceAnswer:[],  //vue官方不支持3层以上数据嵌套,如嵌套则会数据渲染出现问题,此变量直接接收3层嵌套时的数据。
      answerScore: 0, //答题总分数
      bg_flag: false, //已答标识符,已答改变背景色
      isFillClick: false, //选择题是否点击标识符
      slider_flag: true, //左侧显示隐藏标识符
      flag: false, //个人信息显示隐藏标识符
      currentType: 0, //当前题型类型   0--填空题  1--判断题  2--单选题  3--多选题
      radio: [], //保存考生所有选择题的选项
      multi: [], // 保存多选题答案，使用是二维数组，不然保存不了
      title: "请在横线处填写答案",
      index: 0, //全局index
      userInfo: { //用户信息
        name: null,
        id: null
      },
      topicCount: [],//每种类型题目的总数
      score: [],  //每种类型分数的总数
      examData: { //考试信息
      },
      topic: {}, //试卷信息
      showQuestion: [], //当前显示题目信息
      showAnswer: {}, //当前题目对应的答案选项
      number: 1, //题号
      part: null, //填空题的空格数量
      fillAnswer: [[]], //二维数组保存所有填空题答案
      judgeAnswer: [], //保存所有判断题答案
      topic1Answer: [],  //学生选择题作答编号,
      rightAnswer: '',
      singleScore: '',  //单选题分数
      multiScore: '',  //多选题分数
      judgeScore: '',  //判断题分数
      fillScore: '',  //填空题分数
      // singleList: [],  //单选题列表
      // multiList: [],  //多选题列表
      // judgeList: [],  //判断题列表
      // fillList: [],  //填空题列表
    }
  },
  created() {
    // this.getCookies()
    this.getExamData()
	  this.getTopicData()
    this.showTime()
  },

  methods: {
    getCookies() {  //获取cookie
      // this.userInfo.name = this.$cookies.get("cname")
      // this.userInfo.id = this.$cookies.get("cid")
    },
    calcuScore() { //计算答题分数

    },
  getExamData(){
		//根据考试安排ID，查询考试的相关信息
		let _this = this
		_this.startTime = new Date().getTime()
		_this.examData = _this.$route.query.exam   //考试安排
    _this.fillScore = _this.examData.fillScore
    _this.judgeScore = _this.examData.judgeScore
    _this.singleScore = _this.examData.singleScore
    _this.multiScore = _this.examData.multiScore
    _this.time = _this.examData.totalTime
	},
 getTopicData(){
		let exam = this.$route.query.exam; //试卷
		//查询试卷的详细信息
    getExamDetail(exam).then(response => {
      if (response.data.code === 200) {
         let dataMap = response.data.data
         this.topic = dataMap

        let reduceAnswer = this.topic[2][this.index]
        this.reduceAnswer = reduceAnswer
        //把每种题型数量及其分数
        this.topicCount.push(this.topic[0].length)
        this.topicCount.push(this.topic[1].length)
        this.topicCount.push(this.topic[2].length)
        this.topicCount.push(this.topic[3].length)
        this.score.push((this.topic[0].length - 0)*(this.fillScore - 0)) //把每种题型总分存入score
        this.score.push((this.topic[1].length - 0)*(this.judgeScore - 0)) //把每种题型总分存入score
        this.score.push((this.topic[2].length - 0)*(this.singleScore - 0)) //把每种题型总分存入score
        this.score.push((this.topic[3].length - 0)*(this.multiScore - 0)) //把每种题型总分存入score

        //记录判断题答案
        for(let i=0; i<this.topicCount[1];i++){
          this.judgeAnswer[i] = null
        }
        //记录单选题答案
        for(let i=0;i<this.topic[2].length;i++){
          this.topic1Answer[i] = null
        }
        //记录多选题答案
        for(let i=0;i<this.topic[3].length;i++){
          this.multi[i] = []
        }

        let len = this.topicCount[0]
        let father = []
        for(let i = 0; i < len; i++) { //根据填空题数量创建二维空数组存放每道题答案
        let children = [null,null,null,0]
        father.push(children)
        }
        this.fillAnswer = father
        let dataInit = this.topic[0]
        this.number = 1
        this.showQuestion = dataInit[0].questionContent
        this.showAnswer = dataInit[2]
        this.fill(0)
         debugger
      } else {
        this.message(true,response.data.msg,'error')
        this.topic = [[]]

      }
    })
	},
    // 多选题
    multiChange(index) {
       debugger
       this.index = index
       this.currentType = 3
       // 用以答案解析，后面再用
       // let reduceAnswer = this.topic[3][this.index]
       // this.reduceAnswer = reduceAnswer
       // this.isFillClick = true
       this.title = "请选择正确的选项"
       let Data = this.topic[3]
       this.showQuestion = Data[this.index].questionContent //获取题目信息
       this.showAnswer = Data[this.index]
       this.number = this.topicCount[0] + this.topicCount[1] + this.topicCount[2] + this.index + 1
    },

    //单选题
    change(index) {
       debugger
      this.index = index
      this.currentType = 2
      let reduceAnswer = this.topic[2][this.index]
      this.reduceAnswer = reduceAnswer
      this.isFillClick = true
      this.title = "请选择正确的选项"
      let Data = this.topic[2]
      this.showQuestion = Data[this.index].questionContent //获取题目信息
      this.showAnswer = Data[this.index]
      this.number = this.topicCount[0] + this.topicCount[1] + this.index + 1
    },

    fillBG() { //填空题已答题目 如果已答该题目,设置第四个元素为需要填空的个数
      debugger
      //只要填了一个空，就是答题了，没有作答，就是null或者空串
      if(this.fillAnswer[this.index][0] || this.fillAnswer[this.index][1] || this.fillAnswer[this.index][2]) {
        this.fillAnswer[this.index][3] = this.part
      }else{
        //没有作答
        this.fillAnswer[this.index][3] = 0
      }
    },

    // 填空题，清空答案时校验，主要是标记该题是否已答
    clearFillAnswer(){
      // 校验逻辑和失去焦点事件是一样的
      this.fillBG()
    },

    // 填空题
    fill(index) {
       debugger
      this.index = index
      this.currentType = 0
      this.title = "请在横线处填写答案"
      let Data = this.topic[0]
      this.showQuestion = Data[index].questionContent //获取题目信息
      let part= this.showQuestion.split("()").length -1 //根据题目中括号的数量确定填空横线数量
      this.part = part
      this.number = index + 1
    },

    // 判断题
    judge(index) {
       debugger
      this.index = index
		  this.currentType = 1
		  this.title = "请作出正确判断"
		  let Data = this.topic[1]
		  this.showQuestion = Data[index].questionContent //获取题目信息
		  this.number = this.topicCount[0]+ index + 1
    },
    //记录用户的多选题答案
    changeMulti(val){
       console.log("多选题选择了："+val)
       debugger
      this.multi[this.index] = val //保存作答选项

      if(val) {
        let data = this.topic[3]
        this.bg_flag = true
        data[this.index]["isClick"] = true
      }else{
        this.bg_flag = false
      }
    },

    getChangeLabel(val) { //获取选择题作答选项
      this.radio[this.index] = val //当前选择的序号
      if(val) {
        let data = this.topic[2]
        this.bg_flag = true
        data[this.index]["isClick"] = true
      }else{
        this.bg_flag = false
      }
      /* 保存学生答题选项 */
      this.topic1Answer[this.index] = val
    },
    getJudgeLabel(val) {  //获取判断题作答选项
      this.judgeAnswer[this.index] = val
      if(val) {
        let data = this.topic[1]
        this.bg_flag = true
        data[this.index]["isClick"] = true
      }else{
        this.bg_flag = false
      }
    },
    previous() { //上一题
      this.index --
      // 当前题号，从1开始
      this.number --
      debugger
      // 判断点了上一题之后，处于何种题型
      if(this.number >= 1 && this.number <= this.topicCount[0]){
        // 如果是判断题的第一题，点了上一题
        if(this.currentType == 1){
          // 更新为填空题的最后一题
          this.index = this.topicCount[0] - 1
        }
        // 更新题型，为填空题
        this.currentType = 0
      }else if(this.number > this.topicCount[0] && this.number <= (this.topicCount[0] + this.topicCount[1])){
        // 如果是单选题的第一题，点了上一题
        if(this.currentType == 2){
          // 更新为判断题的最后一题
          this.index = this.topicCount[1] - 1
        }
        // 判断题
        this.currentType = 1
      }else if(this.number > (this.topicCount[0] + this.topicCount[1]) && this.number <= (this.topicCount[0] + this.topicCount[1] + this.topicCount[2])){
        // 如果是多选题的第一题，点了上一题
        if(this.currentType == 3){
          // 更新为单选题的最后一题
          this.index = this.topicCount[2] - 1
        }
        // 单选题
        this.currentType = 2
      }else{
        // 如果是在填空题的第一题，点了上一题，则会进入多选题的最后一题
        if(this.number < 1){
          //则到了多选题的最后1题
          this.index = this.topicCount[3] - 1
          // 更新题号
          this.number = this.topicCount[0] + this.topicCount[1] + this.topicCount[2] + this.topicCount[3]
        }
        //多选题
        this.currentType = 3
      }
      switch(this.currentType) {
        case 0:
		      this.fill(this.index)
          break
        case 1:
          this.judge(this.index)
          break
        case 2:
          this.change(this.index)
          break
        case 3:
          this.multiChange(this.index)
          break
      }
    },
    next() { //下一题
      this.index ++
      // 当前题号，从1开始
      this.number ++
      debugger
       //如果是多选题的最后一题，点了下一题
      if(this.number > (this.topicCount[0] + this.topicCount[1] + this.topicCount[2] + this.topicCount[3])){
        //则到了填空题的第1题
        this.index = 0
        // 更新题号
        this.number = 1
      }
      // 判断点了下一题之后，处于何种题型
      if(this.number >= 1 && this.number <= this.topicCount[0]){
        // 填空题
        this.currentType = 0
      }else if(this.number > this.topicCount[0] && this.number <= (this.topicCount[0] + this.topicCount[1])){
        // 如果是填空的最后一题，点了下一题
        if(this.currentType == 0){
          // 更新为判断题的第一题
          this.index = 0
        }
        // 判断题
        this.currentType = 1
      }else if(this.number > (this.topicCount[0] + this.topicCount[1]) && this.number <= (this.topicCount[0] + this.topicCount[1] + this.topicCount[2])){
        // 如果是判断题的最后一题，点了下一题
        if(this.currentType == 1){
          // 更新为单选题的第一题
          this.index = 0
        }
        // 单选题
        this.currentType = 2
      }else{
        // 如果是单选题的最后一题，点了下一题
        if(this.currentType == 2){
          // 更新为多选题的第一题
          this.index = 0
        }
        //多选题
        this.currentType = 3
      }
      switch(this.currentType) {
        case 0:
		      this.fill(this.index)
          break
        case 1:
          this.judge(this.index)
          break
        case 2:
          this.change(this.index)
          break
        case 3:
          this.multiChange(this.index)
          break
      }
    },
    mark() { //标记功能
      switch(this.currentType) {
        case 0:
		  this.topic[0][this.index]["isMark"] = true //填空题标记
          break
        case 1:
          this.topic[1][this.index]["isMark"] = true //判断题标记
          break
        case 2:
          this.topic[2][this.index]["isMark"] = true //单选题标记
          break
        case 3:
          this.topic[3][this.index]["isMark"] = true //单选题标记
          break
      }
    },
    commit() {
      if(this.time != 0) {
          this.$confirm("考试结束时间未到,是否提前交卷","友情提示",{
            confirmButtonText: '立即交卷',
            cancelButtonText: '再检查一下',
            type: 'warning'
          }).then(() => {
            console.log("交卷")
            //计算考试用了多长时间
            this.endTime = new Date().getTime()
            //相差的毫秒数
            let ms = this.endTime - this.startTime
            //相差的分钟数
            let joinTimeCost = Math.round(ms/1000.0/60)

            //最终得分
            let finalScore = 0
              /**计算填空题总分 */
            let fillAnswer = this.fillAnswer  //填空题答案
            let joinAnswerFill =""  //拼接填空题答案，用于提交给后台记录
            fillAnswer.forEach((element,index) => {
              // 解析答案，用数组存储
              let answerArr = this.topic[0][index].questionAnswer.split(",");
              //如果答了题，element[3]不为0
              if(element[3] != 0 ){
                //如果3个空的填空题
                if(element[3] == 3){
                  let cnt = 0   // 正确的个数
                  if(element[0] == answerArr[0]) { //判断填空答案是否与数据库一致
                  //console.log("第一空正确")
                  cnt++
                  }
                  if(element[1] == answerArr[1]) { //判断填空答案是否与数据库一致
                  //console.log("第二空正确")
                  cnt++
                  }
                  if(element[2] == answerArr[2]) { //判断填空答案是否与数据库一致
                  //console.log("第三空正确")
                  cnt++
                  }
                  finalScore += (this.fillScore - 0)/3*cnt
                  //答题记录：题与题之间用*号分隔，同一个题的2个空之间用逗号分隔
                  joinAnswerFill += element[0] + "," + element[1] + "," + element[2] + "*"
                }else if(element[3] == 2){
                 //如果2个空的填空题
                  let cnt = 0   // 正确的个数
                  if(element[0] == answerArr[0]) { //判断填空答案是否与数据库一致
                 // console.log("第一空正确")
                  cnt++
                  }
                  if(element[1] == answerArr[1]) { //判断填空答案是否与数据库一致
                  //console.log("第二空正确")
                  cnt++
                  }
                  finalScore += (this.fillScore - 0)/2*cnt
                  //答题记录：题与题之间用*号分隔，同一个题的2个空之间用逗号分隔
                  joinAnswerFill += element[0] + "," + element[1] + "*"
                }else{
                 //如果1个空的填空题
                  if(element[0] == answerArr[0]) { //判断填空答案是否与数据库一致
                  //console.log("第一空正确")
                  finalScore += (this.fillScore - 0)
                  //答题记录：题与题之间用*号分隔，同一个题的2个空之间用逗号分隔
                  joinAnswerFill += element[0] + "*"
                  }
                }

              }else{
                //没有答题的也要记录下来，用问号表示没有作答
                //答题记录：题与题之间用*号分隔，同一个题的2个空之间用#号分隔
                joinAnswerFill += "?" + "*"
              }
            });
            //去掉最后一个星号
            joinAnswerFill=(joinAnswerFill.substring(joinAnswerFill.length-1)=='*')?joinAnswerFill.substring(0,joinAnswerFill.length-1):joinAnswerFill

              /** 计算判断题总分 */
            let topic3Answer = this.judgeAnswer
            let joinAnswerJudge = ""
            topic3Answer.forEach((element,index) => {
              let right = element
              if(!element){
                right = '?'
              }
               joinAnswerJudge += right + "*"
             // console.log("判断题：答案："+this.topic[1][index].questionAnswer+"  用户选择了 "+right)
                  if(right == this.topic[1][index].questionAnswer) { // 当前选项与正确答案对比
                      finalScore += (this.judgeScore - 0) // 计算总分数
                }
            })
            //去掉最后一个星号
            joinAnswerJudge=(joinAnswerJudge.substring(joinAnswerJudge.length-1)=='*')?joinAnswerJudge.substring(0,joinAnswerJudge.length-1):joinAnswerJudge

            /* 计算单选题总分 */
            let topic1Answer = this.topic1Answer
            let singleAnswer = "";
            topic1Answer.forEach((element,index) => {
              let right = element
              console.log("单选题element  "+element)
              if(!element){
                right = '?'
              }
              // 题与题之间用*号分隔
              singleAnswer += right +"*";
              //console.log("选择题：答案："+this.topic[2][index].questionAnswer+"  用户选择了 "+right)
              if(right == this.topic[2][index].questionAnswer) { // 当前选项与正确答案对比
                finalScore += (this.singleScore - 0)  // 计算总分数
              }
            })
            //去掉最后一个星号
            singleAnswer=(singleAnswer.substring(singleAnswer.length-1)=='*')?singleAnswer.substring(0,singleAnswer.length-1):singleAnswer

            /* 计算多选题总分 */
            let multiAnswer = this.multi
            let joinAnswerMulti = "";
            multiAnswer.forEach((element,index) => { //循环每道选择题根据选项计算分数
              let right = ''
              element = ""+element
              if(element.includes('A') || element.includes('B') || element.includes('C') || element.includes('D')){
                //这么做，主要是为了排序
                if(element.includes('A')){
                  right += 'A,'
                }
                if(element.includes('B')){
                  right += 'B,'
                }
                if(element.includes('C')){
                  right += 'C,'
                }
                if(element.includes('D')){
                  right += 'D'
                }
                //去掉最后一个逗号
                right=(right.substring(right.length-1)==',')?right.substring(0,right.length-1):right
              }else{
                right = '?'
              }
              // 题目之间用星号隔开
              joinAnswerMulti += right + "*";
             // console.log("多选题题：答案："+this.topic[3][index].questionAnswer+"  用户选择了 "+right)
                if(right == this.topic[3][index].questionAnswer) { // 当前选项与正确答案对比
                  finalScore += (this.multiScore - 0)  // 计算总分数
                }

            })
        //去掉最后一个星号
        joinAnswerMulti=(joinAnswerMulti.substring(joinAnswerMulti.length-1)=='*')?joinAnswerMulti.substring(0,joinAnswerMulti.length-1):joinAnswerMulti

        // 计算考试分数等级
        let joinLevel = 1
        let totalScore = this.examData.totalScore * 1.0
        if(finalScore / totalScore >= 0.9){
          //占比90%以上为优秀
          joinLevel = 1
        }else if(finalScore / totalScore >= 0.8){
          //占比80%以上为良好
          joinLevel = 2
        }else if(finalScore / totalScore >= 0.7){
          //占比70%以上为中等
          joinLevel = 3
        }else if(finalScore / totalScore >= 0.6){
          //占比60%以上为及格
          joinLevel = 4
        }else{
          //不及格
          joinLevel = 5
        }

        //提交考试记录到后台
        let data = {
          examId: this.examData.id, //考试安排ID
          userId: getUserId(),
          finishTime: Date.now(),
          costTime: joinTimeCost, //考试实际用的时间，单位是分钟
          finalScore: finalScore,  //考试总分
          resultLevel: joinLevel,
          fillAnswer:  joinAnswerFill,   //考生填空题答案
          judgeAnswer: joinAnswerJudge,   //考生判断题答案
          singleAnswer: singleAnswer,   //考生单选题答案
          multiAnswer: joinAnswerMulti   //考生多选题答案
        }
        addExamRecord(data).then(response => {
          debugger
          if (response.data.code === 200) {
        		this.message(true,response.data.msg,'success')
            //回到考试记录列表页面
            this.$router.push({path:'/exam/record/list'})
          } else {
            this.message(true,response.data.msg,'error')
          }
        })

      }).catch(() => {
            console.log("继续答题")
        })
    }
  },

    showTime() { //倒计时
      setInterval(() => {
        this.time -= 1
        if(this.time == 10) {
          this.$message({
            showClose: true,
            type: 'error',
            message: '注意,考试时间还剩10分钟！！！'
          })
          if(this.time == 0) {
			this.commit()
            this.$message({
              showClose: true,
              type: 'error',
              message: '时间已到，请停止答题！！！'
            })
          }
        }
      },1000 * 60)
    },

	message(ifshow,msg,type) {
		this.$message({
			showClose: ifshow,
			message: msg,
			type: type
		})
	}
  }
  // ,
  // computed:mapState(["isPractice"])
}
</script>

<style lang="scss">
.iconfont.icon-time {
  color: #2776df;
  margin: 0px 6px 0px 20px;
}
.analysis {
  margin-top: 20px;
  .right {
    color: #2776df;
    font-size: 18px;
    border: 1px solid #2776df;
    padding: 0px 6px;
    border-radius: 4px;
    margin-left: 20px;
  }
  ul li:nth-child(2) {
    margin: 20px 0px;
  }
  ul li:nth-child(3) {
    padding: 10px;
    background-color: #d3c6c9;
    border-radius: 4px;
  }
}
.analysis span:nth-child(1) {
  font-size: 18px;
}
.mark {
  position: absolute;
  width: 4px;
  height: 4px;
  content: "";
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 22px;
}
.border {
  position: relative;
  border: 1px solid #FF90AA !important;
}
.bg {
  background-color: #5188b8 !important;
}
.fill .el-input {
  display: inline-flex;
  width: 150px;
  margin-left: 20px;
  .el-input__inner {
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
  }
}
/* slider过渡效果 */
.slider-fade-enter-active {
  transition: all .3s ease;
}
.slider-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slider-fade-enter, .slider-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.operation .end li:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(39, 118, 223);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #fff;
}
.operation .end li {
  cursor: pointer;
  margin: 0 100px;
}
.operation {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 0px;
  margin-right: 10px;
}
.operation .end {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(39, 118, 223);
}
.content .number {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: rgb(39, 118, 223);
  border-radius: 4px;
  margin-right: 4px;
}
.content {
  padding: 0px 20px;
}
.content .topic {
  padding: 20px 0px;
  padding-top: 30px;
}
.right .content {
  background-color: #fff;
  margin: 10px;
  margin-left: 0px;
  height: 470px;
}
.content .el-radio-group label {
  color: #000;
  margin: 5px 0px;
}
.content .el-radio-group {
  display: flex;
  flex-direction:column;
}
.right .title p {
  margin-left: 20px;
}
.flexarea {
  display: flex;
}
.flexarea .right {
  flex: 1;
}
.auto-right {
  margin-left: auto;
  color: #2776df;
  margin-right: 10px;
}
.right .title {
  margin-right: 10px;
  padding-right: 30px;
  display: flex;
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
}
.clearfix {
  clear: both;
}
.l-bottom .final {
  cursor: pointer;
  display: inline-block;
  text-align: center;
 background-color: rgb(39, 118, 223);
  width: 240px;
  margin: 20px 0px 20px 10px;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  margin-top: 22px;
}
#answer .left .item {
  padding: 0px;
  font-size: 16px;
}
.l-bottom {
  border-radius: 4px;
  background-color: #fff;
}
.l-bottom .item p {
  margin-bottom: 15px;
  margin-top: 10px;
  color: #000;
  margin-left: 10px;
  letter-spacing: 2px;
}
.l-bottom .item li {
  width: 15%;
  margin-left: 5px;
  margin-bottom: 10px;
}
.l-bottom .item {
  display: flex;
  flex-direction: column;
}
.l-bottom .item ul {
  width: 100%;
  margin-bottom: -8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.l-bottom .item ul li a {
  position: relative;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #eee;
  text-align: center;
  color: #000;
  font-size: 16px;
}
.left .l-top {
  display: flex;
  justify-content: space-around;
  padding: 16px 0px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}
.left {
  width: 260px;
  height: 100%;
  margin: 10px 10px 0px 10px;
}
.left .l-top li:nth-child(2) a {
  border: 1px solid #eee;
}
.left .l-top li:nth-child(3) a {
  background-color: #5188b8;
  border: none;
}
.left .l-top li:nth-child(4) a {
  position: relative;
  border: 1px solid #eee;
}
.left .l-top li:nth-child(4) a::before {
  width: 4px;
  height: 4px;
  content: " ";
  position: absolute;
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 16px;
}
.left .l-top li {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.left .l-top li a {
  display: inline-block;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #FF90AA;
}
#answer .top {
  background-color: rgb(39, 118, 223);
}
#answer .item {
  color: #fff;
  display: flex;
  padding: 20px;
  font-size: 20px;
}
#answer .top .item li:nth-child(1) {
  margin-right: 10px;
}
#answer .top .item li:nth-child(3) {
  position: relative;
  margin-left: auto;
}
#answer {
  padding-bottom: 30px;
}
.icon20 {
  font-size: 20px;
  font-weight: bold;
}
.item .msg {
  padding: 10px 15px;
  border-radius: 4px;
  top: 47px;
  right: -30px;
  color: #6c757d;
  position: absolute;
  border: 1px solid rgba(0,0,0,.15);
  background-color: #fff;
}
.item .msg p {
  font-size: 16px;
  width: 200px;
  text-align: left;
}
</style>
