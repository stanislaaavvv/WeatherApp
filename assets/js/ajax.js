/**
 * 
 */

var Ajax = {
	/**
	 * 
	 * @returns {XMLHttpRequest}
	 */
	createRequest: function() {
		var request;
		
		if (typeof XMLHttpRequest != 'undefined') {
			request = new XMLHttpRequest();
		} else if (typeof ActiveXObject != 'undefined') {
			request = new ActiveXObject('Microsoft.XMLHTTP');
		}
		
		if (typeof request == 'undefined') {
			throw new Error('Your browser does not support AJAX')
		}
		
		return request;
	},

	request: function(method, url, async, handler, params, username, password) {
		
		var xhr = this.createRequest();
		
		var params = this.parseParams(params);
		if (method == 'GET') {
			url = this.addParamsToUrl(url, params);
		}
		
		xhr.open(method, url, async, username, password);
		
		if (method == 'POST') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) {
				return;
			}
			
			if (xhr.status < 200) {
				return;
			}
			
			if (xhr.status > 300 && xhr.status != 304) {
				return;
			}
			
			handler(xhr.responseText);
		};
		
		var body = method == 'POST' ? params : null;
		xhr.send(body);
	},
	
	parseParams: function(params) {
		var result = [];
		
		for (var i in params) {
			var pair = encodeURIComponent(i) + '=' + encodeURIComponent(params[i]);
			result.push(pair);
		}
		
		return result.join('&');
	},
	
	addParamsToUrl: function(url, params) {
		if (url.indexOf('?') == -1) {
			return url + '?' + params;
		}
		
		if (url.charAt(url.length - 1) == '&') {
			return url + params;
		}
		
		return url + '&' + params;
	}
}