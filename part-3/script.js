var CRUD_ACTION = {
	// IN MEMORY STATE VARIABEL
	datas: [],
	dataEdited: {},
	isEditingState: false,

	// GETTER - SETTER
	getDatas: function(){
		return CRUD_ACTION.datas;
	},

	setDatas: function(datas){
		return CRUD_ACTION.datas = datas;
	},

	getDataEdited: function(){
		return CRUD_ACTION.dataEdited;
	},

	setDataEdited: function(dataEdited){
		return CRUD_ACTION.dataEdited = dataEdited;
	},

	getStateView: function(){
		return CRUD_ACTION.isEditingState;
	},

	setStateView: function(isEditingState){
		return CRUD_ACTION.isEditingState = isEditingState;
	},

	// UI INTERACTION
	showFormEditing: function(){
		CRUD_ACTION.resetFormEditing();

		$('.table').hide();
		$('.form__section').show();
	},

	hideFormEditing: function(){
		CRUD_ACTION.setStateView(false);
		CRUD_ACTION.resetFormEditing();

		$('.form__section').hide();
		$('.table').show();
	},

	resetFormEditing: function(){
		$('#input-name').val("");
		$('#input-email').val("");
		$('#input-address').val("");
		$('#input-gender-1').prop('checked', true);

		CRUD_ACTION.setDataEdited(null);
	},

	fillFormEditing: function(idWillShow){
		CRUD_ACTION.setStateView(true);
		CRUD_ACTION.showFormEditing();		

		// filter by array that have match id
		var datashow = jQuery.grep(CRUD_ACTION.getDatas(), function(objElement) {
		  return objElement.id === idWillShow;
		});

		if(datashow.length > 0){
			var data  = datashow[0];
			$('#input-name').val(data.name);
			$('#input-email').val(data.email);
			$('#input-address').val(data.address);

			if(data.gender === 1) $('#input-gender-1').prop('checked', true);
			else $('#input-gender-2').prop('checked', true);

			CRUD_ACTION.setDataEdited(data);
		}

		
		return datashow;
	},

	confimDelete: function(id, name){		
		swal({
		  title: "Are you sure?",
		  text: "Do you want to delete data '" + name + "'?",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes, delete it!",
		  closeOnConfirm: false
		},
		function(){
			var datashow = jQuery.grep(CRUD_ACTION.getDatas(), function(objElement) {
			  return objElement.id !== id;
			});
			CRUD_ACTION.insertListToView(datashow, true);
		  	swal("Deleted!", "Your data has been deleted.", "success");
		});	
	},

	insertListToView: function(array, isUpdateStorage){
		$('.table__body').html('');	
		if(array){			
			for(var i=0; i<array.length; i++){
				var data = array[i];
				var genderDisplay = data.gender === 1 ? "Male" : "Female";
				var template = 	'<tr data-id="'+ data.id +'">'+
								'	<td>'+ (i+1) +'</td>'+
								'	<td>'+ data.name +'</td>'+
								'	<td>'+ genderDisplay +'</td>'+
								'	<td>'+ data.email +'</td>'+
								'	<td>'+ data.address +'</td>'+
								'	<td>'+
								'		<button class="button button--radius button--blue" onclick="CRUD_ACTION.fillFormEditing(' + '\'' + data.id+ '\'' + ')">Edit</button>'+
								'		<button class="button button--radius button--blue" onclick="CRUD_ACTION.confimDelete(' + '\'' + data.id+ '\'' + ', ' + '\'' + data.name+ '\'' + ')">Delete</button>'+
								'	</td>'+
								'</tr>';

				$('.table__body').append(template);				
			}
			
			CRUD_ACTION.setDatas(array);
			if(isUpdateStorage && isUpdateStorage === true){
				localStorage.setItem('data-dummy', JSON.stringify(listObj));
			}			

		}
	},

	addDataToList: function(data){
		if(data){
			var datas = CRUD_ACTION.getDatas();
			datas.push(data);
			CRUD_ACTION.setDatas(datas);
			localStorage.setItem('data-dummy', JSON.stringify(datas));

			var genderDisplay = data.gender === 1 ? "Male" : "Female";
			var template = 	'<tr data-id="'+ data.id +'">'+
							'	<td>'+ (datas.length) +'</td>'+
							'	<td>'+ data.name +'</td>'+
							'	<td>'+ genderDisplay +'</td>'+
							'	<td>'+ data.email +'</td>'+
							'	<td>'+ data.address +'</td>'+
							'	<td>'+
							'		<button class="button button--radius button--blue" onclick="CRUD_ACTION.fillFormEditing(' + '\'' + data.id+ '\'' + ')">Edit</button>'+
							'		<button class="button button--radius button--blue" onclick="CRUD_ACTION.confimDelete(' + '\'' + data.id+ '\'' + ', ' + '\'' + data.name+ '\'' + ')">Delete</button>'+
							'	</td>'+
							'</tr>';

			$('.table__body').append(template);	
			
		}
	},

	updateDataInList: function(data){
		if(data){
			var datas = CRUD_ACTION.getDatas();
			var dataTemp = [];
			for(var i=0; i<datas.length; i++){
				var dataItem = datas[i];
				if(dataItem.id === datas.id){
					dataItem = data;
				}

				dataTemp.push(dataItem);
			}

			CRUD_ACTION.insertListToView(dataTemp);			
		}
	},

	// REQUEST - RESPONSE	
	initialData: function(){
		if(localStorage){
			if(localStorage.getItem('data-dummy') !== null){

				var dataStore = localStorage.getItem('data-dummy');
				var objParse = null;
				try{
					objParse = JSON.parse(dataStore);
					CRUD_ACTION.insertListToView(objParse, false);
				}catch(err){}

			}else{

				// Fake get method
				$.get( "../json/dummy-data.json", function( data ) {
				  	CRUD_ACTION.insertListToView(data.resultData.data, true);
				});
				
			}
		}
	},

	doSubmitFunction: function(event){
		event.preventDefault();

		if(CRUD_ACTION.getStateView()){
			// do update data
			var gender = $('#input-gender-1').is(":checked") === true ? 1 : 2;

			var data = CRUD_ACTION.getDataEdited();
			data.name = $('#input-name').val();
			data.gender = gender;
			data.email = $('#input-email').val();
			data.address = $('#input-address').val();

			CRUD_ACTION.updateDataInList(data);

		}else{
			// do insert data
			var gender = $('#input-gender-1').is(":checked") === true ? 1 : 2;

			var data = {					
				"id": "dummy-id-" + new Date().getTime(),
				"name": $('#input-name').val(),
				"gender": gender,
				"email": $('#input-email').val(),
				"address": $('#input-address').val()
			}

			CRUD_ACTION.addDataToList(data);


		}
		swal("Submitted!", "Your data has been saved.", "success");

		CRUD_ACTION.hideFormEditing();
	}
}

$(document).ready(function () {   

});

$(window).on('load', function(){   
	// hide form when state false 
	if(!CRUD_ACTION.getStateView()){
		$('.form__section').hide();
	}
	// get initial data
	CRUD_ACTION.initialData();
});