<template>
	<div>
		<main-function-left-menu v-if=" type == 1 " class="left-menu-box" :activeNav='activeNav' :partyNature="partyNature"></main-function-left-menu>
		<party-member-left-menu v-if=" type == 2 " class="left-menu-box" :activeNav='activeNav'></party-member-left-menu>
		<staff-and-workers-left-menu v-if=" type == 3 " class="left-menu-box" :activeNav='activeNav'></staff-and-workers-left-menu>
	</div>
</template>
<script>
	import MainFunctionLeftMenu from '../views/mainFunction/components/LeftMenu'
	import PartyMemberLeftMenu from '../views/partyMember/components/LeftMenu'
	import StaffAndWorkersLeftMenu from '../views/staffAndWorkers/components/LeftMenu'
	export default {
		props: {
      activeNav: null,
      partyNature: null,
    },
		components: {
			MainFunctionLeftMenu,
			PartyMemberLeftMenu,
			StaffAndWorkersLeftMenu
		},
		data(){
			return {
				type: null,
			}
		},
		watch: {
			$route(){ 
				this.isLoadMenu();
			},
			'partyNature'(newValue,oldValue){ 
				// console.log(newValue,oldValue)
				// this.type = newValue;
			},
		},
		created(){   
			this.isLoadMenu();
		},
		mounted(){
		},
		methods:{ 
			isLoadMenu(){   
				if(this.$route.path.indexOf('/mainfunction') != -1){ //党委
					this.type = 1;
				}else if(this.$route.path.indexOf('/partymember') != -1){ //党员
					this.type = 2;
				}else if(this.$route.path.indexOf('/staffandworkers') != -1){ //职工
					this.type = 3;
				}
			}
		},
	}

</script>