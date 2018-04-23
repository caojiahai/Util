/*
 * cjh 2018/4/23
 */

var Util = {};

Util.install = function(Vue, options){
	
	Util.prototype.$alertMsg = function(tips){
		alert(tips)
		return Vue.prototype.$alertMsg(tips)
	}
}

module.exports = Util;
