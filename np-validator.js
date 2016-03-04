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

    	// Email regular expresion
    	var eRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    	// General Settings
    	var s = $.extend( {}, $.fn.np_validator.defaults, options );
    	// Current Form
    	var $f = this;
    	var fReady = false;
    	// User Params
    	var $p = [];
    	// Tab Index
    	var tabIndex = null; 
    	// Back Params
    	var bp = {
    		is_valid : false,
    		setTabIndex: function(tab_index) { 
    			if (/^[0-9]+$/.test(tab_index)) tabIndex = tab_index;
    			
    			if (!fReady) init_submit();
    			fReady = true;
    		}
    	};

    	if (s.params == null)
    	{
    		console.log('No params configured');
    		return false;
    	}

    	for (var pIndex in s.params) $p.push(pIndex); 	 

    	var init_submit = function() {
    		$f.on('submit', function(e){
	    		var nroErrors = 0;

	    		//console.log('submit');

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
					var go_eval = true;

					if ('tab_index' in eParam && /^[0-9]+$/.test(eParam.tab_index) && eParam.tab_index != tabIndex)
					{
						go_eval = false;
					}

					// Required
					if (go_eval == true && ('required' in eParam) && eParam.required == true && !eValue) hError = true; 
					
					// Regular Expresion
					if (go_eval && eValue && ('regex' in eParam) && !eParam.regex.test(eValue)) hError = true; 

					// Length Equal
					if (go_eval && eValue && ('equalTo' in eParam) && eValue.length != eParam.equalTo) hError = true; 

					if (go_eval && eValue && ('is_email' in eParam) && !eRegex.test(eValue)) hError = true; 

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

	    		// Set Valid Callback
	    		bp.is_valid = (nroErrors == 0 ? true: false);
	    	});
    	};
	    
	    // First init submit
	   	if (s.load_init) init_submit();

		// Keypress Suport
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

		if (s.auto_send) $f.submit();

		return bp;
    };

	$.fn.np_validator.defaults = {
		load_init:true,
	    params: null,
		trim: true,
		prevent: false,
		error_class: 'error',
		error_style: 'border:1px solid #CE1316;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #CE1316;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #CE1316',
		error_style_enable: false,
		ajax_send: false,
		ajax_url: '',
		limitOnKey: false,
		tab_enable: false,
		tab_index: null,
		auto_send: false,
		before: function(){},
		bad: function(){},
		good: function(){},
		after: function(){}
	};
 
}(jQuery));