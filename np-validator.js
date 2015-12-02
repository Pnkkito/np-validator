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

    	console.log(s);

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
				// Verify if the object exists
				if (document.getElementsByName($p[i]).length == 0) break;
		
				var eName 	= $p[i]; 
				var ele 	= document.getElementsByName(eName);
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
				if ('required' in eParam && !eValue) hError = true; 
				
				// Regular Expresion
				if ('regex' in eParam && !eParam.regex.test(eValue)) has_error = true; 

				// Length Equal
				if ('equalTo' in eParam && eValue.length != eParam.equalTo) has_error = true; 

				if ('is_email' in eParam && !eRegex.test(eValue)) has_error = true; 

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
    		
    		// End validator
    		if (nroErrors > 0 || s.prevent == true)
    		{
    			e.preventDefault();

    			s.bad.call();
    		}

    		if (nroErrors == 0)
    		{
    			s.good.call();		
    		}
			
    	});
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
		before: function(){},
		bad: function(){},
		good: function(){},
		after: function(){}
	};
 
}(jQuery));