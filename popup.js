let lastTimeout = 0;
function sendMessage(msg, hideUI)
{
	if(hideUI)
	{
		document.getElementById('view').style.display='none';	
		document.getElementById('no-view').style.display='block';	
		document.getElementById('no-view').innerHTML = '<h3>' + msg + '</h3>';
	}
	else
	{
		document.getElementById('view').style.display='block';	
		document.getElementById('no-view').style.display='none';	
		
		var msnr = document.getElementById('messenger');
		msnr.className='animated shown';
		msnr.innerHTML = msg;
		if(lastTimeout) clearTimeout(lastTimeout);
		lastTimeout = setTimeout(function()
		{
			document.getElementById('messenger').className='animated hidden';
		}, 6000);
	}
}
	document.addEventListener('DOMContentLoaded', function() {

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {type: 'get_image'}, function(response) {
			if(response != null && response.imageExists && tabs[0].url.indexOf('photo') > -1)
			{	
				sendMessage('&nbsp;', false);		
			}
			else 
			{
				sendMessage('Não foi possível detectar nenhuma foto 360', true);
				console.log(response);
			}
		  });
		});
		
	var listener = function(el)
	{	
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {type: 'get_image'}, function(response) {
			if(response != null && response.imageExists && tabs[0].url.indexOf('photo') > -1)
			{	
				sendMessage('Working on it..', false);
				
				// in case content script is not loaded
				var timeout = setTimeout(function()
				{			
					chrome.tabs.executeScript(tabs[0].id, {file: "image_processor.js"}, function(){					
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
							  chrome.tabs.sendMessage(tabs[0].id, {type: el.toElement.id}, function(response) {				  
								});
							});					
						});					
				}, 3000);
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				  chrome.tabs.sendMessage(tabs[0].id, {type: el.toElement.id}, function(response) {				  
					if(response && response.handled) clearTimeout(timeout);
				  });
				});				
			}
			else 
			{
				sendMessage('Não foi possível detectar nenhuma foto 360', true);
				console.log('55');
			}
		  });
		});
	};
	var equi = document.getElementById('equi');
	var cube = document.getElementById('cube');	
	
	equi.addEventListener('click', listener);
	cube.addEventListener('click', listener);
	
	
		chrome.runtime.onMessage.addListener(function (msg, sender) {
		// First, validate the message's structure
		  if (msg.from === 'news')
		  {
			if(msg.subject != "END_NOW")
				sendMessage(msg.subject, false);
			else
				window.close();
		  }
		});
	});