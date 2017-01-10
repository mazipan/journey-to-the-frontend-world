var STATE = (function() {
  var datas= [];
  var dataEdited= {};
  var isEditingState= false;

  return {
	// GETTER - SETTER
	getDatas: function(){
		return STATE.datas;
	},

	setDatas: function(datas){
		return STATE.datas = datas;
	},

	getDataEdited: function(){
		return STATE.dataEdited;
	},

	setDataEdited: function(dataEdited){
		return STATE.dataEdited = dataEdited;
	},

	getStateView: function(){
		return STATE.isEditingState;
	},

	setStateView: function(isEditingState){
		return STATE.isEditingState = isEditingState;
	}
  };   
})();

var INTERACTION = (function() {

  return {
    // UI INTERACTION
	showFormEditing: function(){
		INTERACTION.resetFormEditing();

		$('.table').hide();
		$('.form__section').show();
	},

	hideFormEditing: function(){
		STATE.setStateView(false);
		INTERACTION.resetFormEditing();

		$('.form__section').hide();
		$('.table').show();
	},

	resetFormEditing: function(){
		$('#input-name').val("");
		$('#input-email').val("");
		$('#input-address').val("");
		$('#input-gender-1').prop('checked', true);

		STATE.setDataEdited(null);
	},

	fillFormEditing: function(idWillShow){
		STATE.setStateView(true);
		INTERACTION.showFormEditing();		

		// filter by array that have match id
		var datashow = jQuery.grep(STATE.getDatas(), function(objElement) {
		  return objElement.id === idWillShow;
		});

		if(datashow.length > 0){
			var data  = datashow[0];
			$('#input-name').val(data.name);
			$('#input-email').val(data.email);
			$('#input-address').val(data.address);

			if(data.gender === 1) $('#input-gender-1').prop('checked', true);
			else $('#input-gender-2').prop('checked', true);

			STATE.setDataEdited(data);
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
			var datashow = jQuery.grep(STATE.getDatas(), function(objElement) {
			  return objElement.id !== id;
			});
			INTERACTION.insertListToView(datashow, true);
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
								'		<button class="button button--radius button--blue" onclick="INTERACTION.fillFormEditing(' + '\'' + data.id+ '\'' + ')">Edit</button>'+
								'		<button class="button button--radius button--blue" onclick="INTERACTION.confimDelete(' + '\'' + data.id+ '\'' + ', ' + '\'' + data.name+ '\'' + ')">Delete</button>'+
								'	</td>'+
								'</tr>';

				$('.table__body').append(template);				
			}
			
			STATE.setDatas(array);
			if(isUpdateStorage && isUpdateStorage === true){
				try{
					localStorage.setItem('data-dummy', JSON.stringify(array));
				}catch(err){}
			}			

		}
	},

	addDataToList: function(data){
		if(data){
			var datas = STATE.getDatas();
			datas.push(data);
			STATE.setDatas(datas);
			
			try{					
				localStorage.setItem('data-dummy', JSON.stringify(datas));
			}catch(err){}

			var genderDisplay = data.gender === 1 ? "Male" : "Female";
			var template = 	'<tr data-id="'+ data.id +'">'+
							'	<td>'+ (datas.length) +'</td>'+
							'	<td>'+ data.name +'</td>'+
							'	<td>'+ genderDisplay +'</td>'+
							'	<td>'+ data.email +'</td>'+
							'	<td>'+ data.address +'</td>'+
							'	<td>'+
							'		<button class="button button--radius button--blue" onclick="INTERACTION.fillFormEditing(' + '\'' + data.id+ '\'' + ')">Edit</button>'+
							'		<button class="button button--radius button--blue" onclick="INTERACTION.confimDelete(' + '\'' + data.id+ '\'' + ', ' + '\'' + data.name+ '\'' + ')">Delete</button>'+
							'	</td>'+
							'</tr>';

			$('.table__body').append(template);	
			
		}
	},

	updateDataInList: function(data){
		if(data){
			var datas = STATE.getDatas();
			var dataTemp = [];
			for(var i=0; i<datas.length; i++){
				var dataItem = datas[i];
				if(dataItem.id === datas.id){
					dataItem = data;
				}

				dataTemp.push(dataItem);
			}

			INTERACTION.insertListToView(dataTemp);			
		}
	},

  };   
})();

var REQUST_RESPONSE = (function() {

  return {
  	// REQUEST - RESPONSE	
	initialData: function(){
		if(localStorage){
			if(localStorage.getItem('data-dummy') !== null){
				
				// read from localStorage
				try{
					var dataStore = localStorage.getItem('data-dummy');
					var objParse = null;
					objParse = JSON.parse(dataStore);
					INTERACTION.insertListToView(objParse, false);
				}catch(err){}

			}else{

				// Fake get method 
				// NOT WORK IN LOCAL
				$.get( "../json/dummy-data.json", function( data ) {
				  	INTERACTION.insertListToView(data.resultData.data, true);
				});

			}
		}
	},

	doSubmitFunction: function(event){
		event.preventDefault();

		if(STATE.getStateView()){
			// do update data
			var gender = $('#input-gender-1').is(":checked") === true ? 1 : 2;

			var data = STATE.getDataEdited();
			data.name = $('#input-name').val();
			data.gender = gender;
			data.email = $('#input-email').val();
			data.address = $('#input-address').val();

			INTERACTION.updateDataInList(data);

		}else{
			// do insert data
			var gender = $('#input-gender-1').is(":checked") === true ? 1 : 2;

			var data = {	
				// add random number as id 				
				"id": "dummy-id-" + new Date().getTime(),

				"name": $('#input-name').val(),
				"gender": gender,
				"email": $('#input-email').val(),
				"address": $('#input-address').val()
			}

			INTERACTION.addDataToList(data);


		}
		swal("Submitted!", "Your data has been saved.", "success");

		INTERACTION.hideFormEditing();
	}
  };   
})();

$(window).on('load', function(){   
	// hide form when state false 
	if(!STATE.getStateView()){
		$('.form__section').hide();
	}
	// get initial data
	REQUST_RESPONSE.initialData();
});