# np-validator
Basic function for form validator based on Javascript

How to used

NpValidator({
				form: '#form_contact', // Form object, it will use jQuery object
				params: {
					txt_name : {
						required: true,
						regex: /^[a-zA-Z]+$/
					}
				}, 
				prevent: true,  // Disable default form send action
				success: function(){
					console.log('okay');
				}
			});