/*
 * cjh 2018/4/23
 */

var Util = {};

Util.install = function(Vue, options){
	
	Vue.prototype.$alertMsg = function(tips){
		alert(tips)
	}
}

module.exports = Util;
