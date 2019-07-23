<template>
  <div class="auditAndCorrelation">
    <!-- <template v-if="tabViewBtnStatus">
      <customerData></customerData>
    </template>
    <template v-else>
      <dueDiligenceChecklist></dueDiligenceChecklist>
    </template> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import customerData from './components/customerData'
import dueDiligenceChecklist from './components/dueDiligenceChecklist'
export default {
  name: "auditAndCorrelation",
  components: {
    customerData,
    dueDiligenceChecklist
  },
  computed: {
			...mapState('dueDiligence', ['tabViewBtnStatus'])
  },
  data() {
    return {

    };
  },
  methods: {
    ...mapActions("dueDiligence", ['setTabViewBtn','setAttachmentName'])
  },
  created() {
    this.setTabViewBtn(true)//头部增加切换按钮
    this.setAttachmentName('尽调文件收集与处理')//抬头名字
  },
  mounted() {},
  beforeDestroy() {
    this.setTabViewBtn(false)
  }, 
};
</script>