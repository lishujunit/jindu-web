<template>
  <div>
    <audit>
      <template v-slot:header>
        <el-table-column
          align="center"
          prop="name"
          label="姓名"
          width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="position"
          label="职务"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="idCard"
          label="身份证号"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </template>
    </audit>
  </div>
</template>

<script>
import audit from "@/components/interview/audit";
export default {
  components: {
    audit
  }
};
</script>
