<template>
  <div>
    <relation>
      <template v-slot:header>
        <el-table-column
          align="center"
          prop="name"
          label="名称"
          width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="position"
          label="业务伙伴类型"
          width="120"
          :show-overflow-tooltip="true"
        ></el-table-column>
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
    </relation>
  </div>
</template>

<script>
import relation from "@/components/interview/relation";
export default {
  components: {
    relation
  }
};
</script>
