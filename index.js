/*
 * cjh 2018/4/23
 */

var Util = {};

Util.install = function(Vue, options){

	//处理url
	const curl = url => {
		if(url.indexOf("http://") == -1)
			return api_url + url;
		else
			return url;
	}
	
	//ajax 对象
	const ajaxObject = function() {
		var xmlHttp;
		try {
			xmlHttp = new XMLHttpRequest();
		} catch(e) {
			try {
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				try {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {
					alert("您的浏览器不支持AJAX！");
					return false;
				}
			}
		}
		return xmlHttp;
	}
	
	//http请求
	Vue.prototype.$ajax = function(url, data, fnSucceed, fnFail, method = 'POST'){
		var ajaxData = ajaxObject();
		if(!navigator.onLine){
			fnFail('Network disconnection!')
			return;
		}
		ajaxData.timeout = 6000;  
		ajaxData.ontimeout = function(event){  
			console.log('Request timeout!')
		} 
		if(!url){
			return;
		}
		if(url.indexOf('up.qiniu.com')!=-1){
			ajaxData.open(method, curl(url));
		}else{
			ajaxData.open(method, curl(url), true);
			ajaxData.setRequestHeader("Content-Type", "application/json");
			ajaxData.withCredentials = false; 
		}
		ajaxData.onreadystatechange = function() {
			if(ajaxData.readyState == 4) {
				let statusCode = ajaxData.status;
				if(statusCode == 200) {
					fnSucceed(ajaxData.response);
				} else {
					switch (statusCode){
						case 400:
							//400错误，返回response
							fnFail(ajaxData.response)
							break;
						case 401:
							//401错误，返回状态码401，用户名或者密码不对，token过期
							fnFail(ajaxData.status)
							break;
						case 403:
							//403错误
							fnFail(ajaxData.response)
							break;
						case 404:
							//404错误
							console.log('当前接口不存在!')
							break;
						case 405:
							//405错误
							console.log('接口请求方式有误!')
							break;
						case 500:
		                    //提示开发人员
		                    console.log('服务器错误!')
		                    break;
						case 504:
		                    //提示开发人员
		                    console.log('服务器超时!')
		                    break;
						default:
							fnFail("HTTP请求错误！错误码：" + ajaxData.status);
							break;
					}
				}
			}
		}
		ajaxData.send(data);
	}
	
}

module.exports = Util;



