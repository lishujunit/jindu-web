<template>
      <div>
            <router-view></router-view>
      </div>
</template>
<script>

export default {
      watch: {
            '$parent.back'() {
this.$router.go(-1)

            }
      }
}
</script>

