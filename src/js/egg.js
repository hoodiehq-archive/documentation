'use strict';

//window.hello = new hello || {};

var hello =  {
	you	: function (){
	  	var name = prompt('What is your name', name);
	  	var msg = 'Hello ' + name + '! Hoodie loves you...'
	  	return msg;
	}
};