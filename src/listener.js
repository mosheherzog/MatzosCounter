var App = {
	config: {},
	utils: {},
	events: {}
};

App.events.newData = new Event('newData');

// a function when keyboard pressed

App.utils.handleEvent = function (e) {
	console.log(e);
	var d = new Date();
	var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
	var time = d.getTime();

	//use e.code for when the keyboard is set to other language or caps lock
	var code = e.code.split("").pop();

	//send an ajax to the sever with the record
	App.utils.httpGetAsync('/record?key=' + code + '&time=' + time + '&date=' + date, function (x) {
		document.dispatchEvent(App.events.newData);
		console.log(x.response);
	});
	//play a sound when clicked
};

// a ajax function

App.utils.httpGetAsync = function (url, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) callback(xmlHttp);
	};
	xmlHttp.open("GET", url, true); // true for asynchronous
	xmlHttp.send(null);
};

// attach the event listener to the window
window.onload = function () {
	window.addEventListener('keydown', App.utils.handleEvent);
};
