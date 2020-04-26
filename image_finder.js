function getItem()
{
	var items = document.querySelectorAll('hidden_elem');
	var max = 0;
	var returnItem = null;
	for( var i  = 0 ; i < items.length ; i++)
	{
		var item = items[i];
		if(item.naturalHeight > max) { max = item.naturalHeight; returnItem = item }
	}
	if(returnItem && returnItem.naturalHeight == returnItem.naturalWidth * 6)
	{		
        return (returnItem);
	}

    let regex = /\"?cubeImageURI\"?\:\"([\w|:\\|\/|\.|\?|\-|\=|&]*)\"[\w|:\\|\/|\.|\?|\-|\=|&|\"|,|\{|\}]*\"photoID\"\:\"(\d+)\"/g;
    const str = document.body.innerHTML;

    items = [];

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        let jsonItem = '{"url": "' + m[1] + '", "ID": "' + m[2] + '"}';
        items.push(JSON.parse(jsonItem));
    }    
	//failed again
    if (items.length === 0) 
    {
        regex = /cubeImageURI\:\"([\w|:\\|\/|\.|\?|\-|\=|&]*)\"/g;
        let m = regex.exec(str);
        if(!m) return (false);
        return true;
    }
    else
    {
        let desiredPic;
        
        items.forEach((item) =>
        {
            if(window.location.href.indexOf(item.ID) > -1)
                desiredPic = item;
        });
        if (!desiredPic) return (false);
        return (true);
    }
}
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) 
	{
		if(request.type == 'get_image')
		{
			var imag = getItem();
			var foundAt = window.location.href;
			if(imag)
				sendResponse({imageExists: true, "foundAt": foundAt});
			else
				sendResponse({imageExists: false, foundAt: 0});
		}
	}
);