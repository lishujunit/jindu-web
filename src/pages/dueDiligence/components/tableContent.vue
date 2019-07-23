<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;margin:20px 0;"
      border
      :span-method="arraySpanMethod"
      @selection-change="checkedChange"
      :row-class-name="tableRowClassName"
      cell-class-name="tableCell"
    >
      <el-table-column align="center" type="selection" width="50" v-if="tableSelectionBool"></el-table-column>
      <el-table-column align="center" prop="attribute" label="尽调属性" min-width="80"></el-table-column>
      <el-table-column align="center" prop="content" label="尽职调查内容" min-width="200">
        <template slot-scope="scope">
          <div :style="scope.row.attribute%1 !== 0?'text-align: left;':'text-align: center;'">
            <span v-if="scope.row.attribute%1 !== 0||!scope.row.id">{{scope.row.content}}</span>
            <h4 v-else>{{scope.row.attribute}}、{{scope.row.content}}</h4>
          </div>
        </template>
      </el-table-column>
      <slot name="appendix">附件</slot>
      <el-table-column align="center" prop="inforMation" label="答疑人联系方式" min-width="150">
        <template slot-scope="scope">
          <div v-if="opFirst" @click="changeThisContent(scope.row)" style="cursor: pointer" :class="!scope.row.answerName&&!scope.row.answerPhone&&!scope.row.answerMail?'haveHeight':''">
            <p>{{scope.row.answerName}}</p>
            <p>{{scope.row.answerPhone}}</p>
            <p>{{scope.row.answerMail}}</p>
          </div>
          <div v-else>
            <span>{{scope.row.inforMation}}</span>
          </div>
        </template>
      </el-table-column>
      <slot name="tailing">尾部</slot>
    </el-table>
  </div>
</template>

<script>
import { truncate } from 'fs';
export default {
  name: "",
  components: {},
  props: {
    tableData: {type: Array,default() {return [];}},//表格数据
    tableSelectionBool:{type:Boolean,default:true},//是否有多选框
    // selectDisable:{type:Array,default(){return [];}},//需要禁用多选框的匹配数组
    needColNum:{type:Number,default:7},//表格需要多少列（占一行需要的数据）
    unqualifiedStatue:{type:String,default:'10000'},//不合格的状态值
    opFirst:{type:Boolean,default:false}//是否是第一步或第二步进来的大标题有操作按钮
  },
  watch:{
    tableData:function(val,oldval){
      this.getSpanArr(val);
    }
  },
  data() {
    return {
      spanArr: [],//占一行还是不占一行的数组
      contentSpanArr: [],//暂时没有用上，占一行内容数组
      colArr: [],//占一列的位置数组
      checkedDataArr: [],//多选框的ID数组集合
      
      
    };
  },
  methods: {
    //大标题占一行
    getSpanArr(data) {
      this.spanArr = [];
      data.forEach((item, index) => {
        //判断是否是数字ID 
        if (item.attribute%1 === 0) {
          this.spanArr.push(7);
          this.colArr.push(0,0, 7, 0, 0, 0, 0);
        } else {
          this.spanArr.push(1);
          this.colArr.push(1,1, 1, 1, 1, 1, 1);
        }
      });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(column);
      if (row.attribute%1 == 0||!row.id) {
        if(column.label=="尽职调查内容"){
          return {
            rowspan: 1,
            colspan: this.needColNum
          };
        }else if((column.label=="操作"||column.label=="状态")&&this.opFirst){
          if(row.noData){
            return {
              rowspan: 2,
              colspan: 1
            };
          }else{
            return {
              rowspan: 1,
              colspan: 1
            };
          }
        }else if(column.type=="selection"&&row.attribute%1 == 0){
          if(row.noData&&row.id&&this.opFirst){
            return {
              rowspan: 2,
              colspan: 1
            };
          }else if(!row.noData&&row.id&&this.opFirst){
            return {
              rowspan: 1,
              colspan: 1
            };
          }else{
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }else{
          return {
            rowspan: 0,
            colspan: 0
          };
        }

      } else {
        return false;
      }
    },
    //获取多选的ID
    checkedChange(val) {
      if(this.tableSelectionBool){
        this.checkedDataArr =[]
        val.forEach(item => {
          if(item.id){
            this.checkedDataArr.push(item.id)
          }
        });
        this.$emit('checkedChange',this.checkedDataArr)
        }
    },
    //有不合格的行数的样式
    tableRowClassName({row}){
      // console.log(this.unqualifiedStatue);
      // console.log(row.status);
      if(row.status===this.unqualifiedStatue){
        return 'warnResult'
      }else{
        return ''
      }
    },
    //禁用某个多选框
    // selectable(row,index){
    //   if(this.selectDisable.indexOf(row.status)!==-1||this.selectDisable.indexOf(row.releaseStatus)!==-1){
    //     return false
    //   }else{
    //     return true
    //   }
    // },
    //修改联系人按钮
    changeThisContent(row){
      if(this.opFirst){
        this.$emit('changeThisContent',row)
      }
    },
  },
  created() {
    this.getSpanArr(this.tableData);
  }
};
</script>
<style lang='scss' scoped>
 .tableCell div{
    white-space: pre-line;
  }
  .haveHeight{
    height:4.4em;
  }
</style>
<style lang='scss'>
  .el-table tr.warnResult {
    background: #FFC;
    position: relative;
    td {
      border-bottom-color: #EC395A;
      border-top: 1px solid #EC395A;

      &:first-child {
        border-left: 1px solid #EC395A;
      }

      &:last-child {
        border-right: 1px solid #EC395A;
      }
    }
}
</style>
