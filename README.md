# np-validator
Basic function for form validator based on Javascript

How to used

```bash

$('#form-cotiza').np_validator({
		prevent: true, // Disable default form send action
		params: {
			txt_name: {
				required: true,
				regex: /^[a-zA-Z\s]+$/
			}
		},
		good: function() {
			console.log('okay');
		}
	});
```
