/*
 * cjh 2018/4/23
 */

var Util = {};

Util.install = function(Vue, options) {

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
	Vue.prototype.$ajax = function(url, data, fnSucceed, fnFail, method = 'POST') {
		var ajaxData = ajaxObject();
		if(!navigator.onLine) {
			fnFail('Network disconnection!')
			return;
		}
		ajaxData.timeout = 10000;
		ajaxData.ontimeout = function(event) {
			fnFail('Request timeout!')
			return;
		}
		if(!url) {
			return;
		}
		if(url.indexOf('up.qiniu.com') != -1) {
			ajaxData.open(method, curl(url));
		} else {
			ajaxData.open(method, curl(url), true);
			ajaxData.setRequestHeader("Content-Type", "application/json");
			ajaxData.withCredentials = false;
		}
		ajaxData.onreadystatechange = function() {
			if(ajaxData.readyState == 4) {
				if(ajaxData.status == 200) {
					fnSucceed(ajaxData.response);
				} else {
					fnFail(ajaxData);
				}
			}
		}
		ajaxData.send(data);
	}

	//正则校验手机号
	Vue.prototype.$isTel = function(tips) {
		var pattern = /^(13[0-9]|14[57]|15[012356789]|17[013678]|18[0-9]|199)\d{8}$/;
		return pattern.test(str);
	}

	//通过正则校验6位数字，例如验证码
	Vue.prototype.$isCode = function(tips) {
		var reg = /^\d{6}$/;
		return reg.test(str)
	}

}

module.exports = Util;