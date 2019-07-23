<template>
  <div>
    <executive>
      <template v-slot:header>
        <el-table-column
          align="center"
          prop="name"
          label="监管部门名称"
          width="150"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="interviewedName"
          label="受访人姓名"
          width="100"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="interviewedPosition"
          label="受访人职务"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </template>
    </executive>
  </div>
</template>

<script>
import executive from "@/components/interview/executive";
export default {
  components: {
    executive
  }
};
</script>
