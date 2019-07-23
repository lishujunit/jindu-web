<template>
	<div>
		<navbar></navbar>
		<div class="content">
			<router-view></router-view>
			
		</div>
	</div>
</template>
<script>
import {navbar} from './components'
export default{
	data(){
		return{

		}
	},
	components:{
		navbar,
		
	}
}
</script>
<style scoped>
.content{
	width: 90%;
	margin:10px auto;
	min-width: 1200px;
}
</style>