var isEditingState = false;

var CRUD_ACTION = {
	getStateView: function(){
		return isEditingState;
	},
	showFormEditing: function(){
		isEditingState = true;
		$('.form__section').show();
	},
	hideFormEditing: function(){
		isEditingState = false;
		$('.form__section').hide();
	},
	doSubmitFunction: function(event){

		return isEditingState;
	},
	doAddFunction: function(){

		return isEditingState;
	},
	doEditFunction: function(){

		return isEditingState;
	},
	doDeleteFunction: function(){

		return isEditingState;
	}
}

$(document).ready(function () {   
	// hide form when state false 
	if(!CRUD_ACTION.getStateView()){
		$('.form__section').hide();
	}
});

$(window).on('load', function(){   

});