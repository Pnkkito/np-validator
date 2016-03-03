/**
 * NpValidator.js  
 * Basic function for form validator based on Javascript
 * 
 * Author: Esteban Rodriguez (erodriguez.develop@gmail.com)
 * date: 19-11-2015
 * @version 2.0.1
 */

;(function($) {
 
    $.fn.np_validator = function(options) {

    	var eRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    	var s = $.extend( {}, $.fn.np_validator.defaults, options );
    	var $f = this;
    	var $p = [];

    	if (s.params == null)
    	{
    		console.log('No params configured');
    		return false;
    	}

    	for (var pIndex in s.params) $p.push(pIndex); 	

    	$f.on('submit', function(e){

    		var nroErrors = 0;

    		for (var i = 0; i < $p.length; i++) 
			{
				//Verify what method get element
				var get_by_id = ( 'get_by_id' in s.params[$p[i]] && s.params[$p[i]].get_by_id == true ? true: false);
				
				// Verify element exists
				if (document[ (get_by_id ? 'getElementById': 'getElementsByName') ]($p[i]).length == 0) break;
				
				// Params
				var eName 	= $p[i]; 
				var ele 	= (get_by_id ? document.getElementById(eName) : document.getElementsByName(eName));
				var eType 	= ele[0].nodeName;
				var eValue 	= $(ele).val();
				var eParam 	= s.params[eName];
				var hError 	= false;
 				
 				// Verify Valdiator Params
 				if (Object.keys(eParam).length == 0) break; 

				// Trim clean
				if (s.trim) eValue = eValue.replace(/^\s+|\s+$/g, '');

				//**** Validator  ****\\
				// Required
				if ('required' in eParam && eParam.required == true && !eValue) hError = true; 
				
				// Regular Expresion
				if (eValue && 'regex' in eParam && !eParam.regex.test(eValue)) hError = true; 

				// Length Equal
				if (eValue && 'equalTo' in eParam && eValue.length != eParam.equalTo) hError = true; 

				if (eValue && 'is_email' in eParam && !eRegex.test(eValue)) hError = true; 

				// On Error
				if (hError) nroErrors++;
				$(ele)[ (hError ? 'addClass': 'removeClass') ](s.error_class);

				if (hError && s.error_style_enable)
				{
					$(ele).attr('style', s.error_style);
				}
				else
				{
					$(ele).removeAttr('style');	
				}
			}
    		
    		// Detect prevent
    		if (s.prevent == true) e.preventDefault();
    		
    		// Call result function
    		s[ (nroErrors == 0 ? 'good': 'bad') ].call();	
    	});
	
		if (s.limitOnKey)
		{
			var dorks = {
				only_number : /^[0-9]+$/,
				only_string : /^[a-zA-Z]+$/,
				only_alpha_string : /^[a-zA-Zá-úÁ-Ú]+$/,
				only_alpha_string_ws : /^[a-zA-Zá-úÁ-Ú\s]+$/,
				only_address : /^[a-zA-Zá-úÁ-Ú0-9\s\-\_\,\.]+$/
			};

			for (var i = 0; i < $p.length; i++) 
			{
				// Verify if the object exists
				if (document.getElementsByName($p[i]).length == 0) break;
				
				var eName 	= $p[i]; 
				var $ele 	= $(document.getElementsByName(eName));	
				var eParam 	= s.params[eName];

				if ('key_dork' in eParam)
				{
					if (eParam.key_dork in dorks)
					{ 
						$ele.keypress(function(e){
							var nParam = s.params[ $(this).attr('name')];
							var dork_rg = dorks[ nParam.key_dork ];

							if (!dork_rg.test(String.fromCharCode(e.which)))
		    				{
		      					return false;
		    				}
						});
					}
				} 
			}
		}
    };

	$.fn.np_validator.defaults = {
	    params: null,
		trim: true,
		prevent: false,
		error_class: 'error',
		error_style: 'border:1px solid #CE1316;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #CE1316;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #CE1316',
		error_style_enable: false,
		ajax_send: false,
		ajax_url: '',
		limitOnKey: false,
		before: function(){},
		bad: function(){},
		good: function(){},
		after: function(){}
	};
 
}(jQuery));