/**
 * NpValidator.js  
 * Basic function for form validator based on Javascript
 * 
 * Author: Esteban Rodriguez (erodriguez.develop@gmail.com)
 * date: 19-11-2015
 * @version 1.0.1
 */


function NpValidator(config_params) {
	var email_regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	//
	var $form 	= null;
	var count 	= 0;
	var param_index = []; 
	var var_default = {
			form: '',
			params : null,
			trim: true,
			prevent : false,
			error_class: 'error',
			success: function(){}
		};
	//
	if ('form' in config_params) var_default.form = config_params.form;
	if ('params' in config_params) var_default.params = config_params.params;
	if ('trim' in config_params) var_default.trim = config_params.trim;
	if ('prevent' in config_params) var_default.prevent = config_params.prevent;
	if ('error_class' in config_params) var_default.error_class = config_params.error_class;
	if ('success' in config_params) var_default.success = config_params.success;

	if (!var_default.form) return false; 

	$form = $(var_default.form);

	if (var_default.params != null)
	{
		for (var _index in var_default.params) param_index.push(_index); 	
	}

	$form.on('submit', function(e){
		
		if (param_index.length > 0)
		{
			var total_error = 0;

			for (var i = 0; i < param_index.length; i++) 
			{
				var tmp_name 			= param_index[ i ];
				var tmp_params 			= var_default.params[ tmp_name ];
				var tmp_params_index 	= [];
				var $tmp_item 			= $('#'+tmp_name);
				var tmp_item_value 		= $tmp_item.val();
				var has_error 			= false;

				// Clean
				if (var_default.trim)
				{ 	
					tmp_item_value = tmp_item_value.replace(/^\s+|\s+$/g, '');	
				}

				// Required
				if ('required' in tmp_params && !tmp_item_value)
				{
					has_error = true; 
				}

				// Regular Expresion
				if ('regex' in tmp_params && !tmp_params.regex.test(tmp_item_value))
				{
					has_error = true; 
				}

				// Length Equal
				if ('equalTo' in tmp_params && tmp_item_value.length != tmp_params.equalTo)
				{
					has_error = true; 
				} 

				if ('is_email' in tmp_params && !email_regex.test(tmp_item_value))
				{
					has_error = true; 
				}

				// Error or Success class
				$tmp_item[ (has_error ? 'addClass': 'removeClass') ](var_default.error_class);

				// Error Add counter
				if (has_error) total_error++;
			};	

			if (total_error > 0) return false;
			if (var_default.prevent == true) e.preventDefault();

			var_default.success();
		}  
	}); 
}