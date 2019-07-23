export default {
	setFirstFlag:(state,value) => {
		state.firstFlag=value;
		window.localStorage.setItem('firstFlag',value);
	},
    setActivateUserName:(state,value) => {
    	state.activate_userName=value;
    	window.localStorage.setItem('activate_userName',value);
    },
    setUserName:(state,value) => {
    	state.user_name=value;
    	window.localStorage.setItem('user_name',value);
    },
    setInviteCode:(state,value) => {
    	state.inviteCode=value;
    	window.localStorage.setItem('inviteCode',value);
    },
}