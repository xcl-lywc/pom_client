import axios from 'axios';
import Vue from 'vue';
const $vue = new Vue()

let request = {
	/**
	 * axios请求方法
	 * @param {String} method 请求方式
	 * @param {String} url 请求地址
	 * @param {Object} params 请求参数
	 * @param {Object} success 请求成功回调函数
	 * @param {Object} fail 请求失败回调函数
	 * @param {String} message 提示信息
	 * @param {String} responseType 返回的数据类型
	 */
	requestAxios(method,url, params,success,fail,message,responseType) {
		let self = this;
		axios[method](url,params).then(function (response){
	    	if(response.data.meta.code === 401){
	    		$vue.$message({message: '未登录，将跳转到登录页面!!', type: 'warning', duration: 1500});
	    		setTimeout(function(){
	    			window.location.href = '/#/login';
	    		},1510);
	    	}else{
		    	success(response);
		    }
		}).catch(function (error) {
		    fail(error);
		});
	},
	/**
	 * ajax请求方法
	 * @param {String} method 请求方式
	 * @param {String} url 请求地址
	 * @param {Object} params 请求参数
	 * @param {Object} success 请求成功回调函数
	 * @param {Object} fail 请求失败回调函数
	 * @param {Object} contentType 请求后台参数的数据格式
	 * @param {Object} dataType 返回数据格式
	 * @param {boolean} async true为异步，false为同步
	 * @param {String} message 提示信息
	 * @param {String} responseType 返回的数据类型
	 */
	requestAjax(method,url, params, success, fail, contentType, dataType, async, message,responseType) {
		$.ajax({
			type:method,
			url:url,
			async: async || false,
			data: params || {},
			dataType: dataType || 'json',
			contentType: contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
			success:function(response){
		    	if(response.meta.code === 401){
		    		$vue.$message({message: '未登录，将跳转到登录页面!!', type: 'warning', duration: 1500});
		    		setTimeout(function(){
		    			window.location.href = '/#/login';
		    		}, 1510);
		    	}else{
			    	success(response)
			    }
			},
			error:function(error){
				fail(error)
			}
		})
	}
};

export{ request };
