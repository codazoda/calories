// Functions to run when the document loads
window.onload = function() {
	// Initialize
	init();
}

// Initialize
function init() {
	// Load a user using the QuickUser class
	user = new QuickUser();
	// Setup todays date
	var myDay = new Date();
	var today = (myDay.getMonth()+1) + "/" + myDay.getDate() + "/" + myDay.getFullYear();
	var todayNum = (myDay.getFullYear()*10000) + ((myDay.getMonth()+1)*100) + myDay.getDate();
	var lastWeekNum = todayNum - 7;
	// If this is the first run
	if (user.get("first") === undefined) {
		user.set("first", today);
		user.set("shared", todayNum);
	}
	// If it's old, set it to blank
	if (user.get("today") != today) {
		// Roll 7-day history data
		rollHistory();
		// Reset everything
		user.set("today", today);
		user.set("total", 0);
		user.set("log", "");
	}
	// If history values are undefined, set them to zero
	if(user.get("day1") == undefined) user.set("day1", 0);
	if(user.get("day2") == undefined) user.set("day2", 0);
	if(user.get("day3") == undefined) user.set("day3", 0);
	if(user.get("day4") == undefined) user.set("day4", 0);
	if(user.get("day5") == undefined) user.set("day5", 0);
	if(user.get("day6") == undefined) user.set("day6", 0);
	if(user.get("day7") == undefined) user.set("day7", 0);
	// Update the page
	updatePage();
	// Hide the help on secondary hits
	showHelp();
	// Clear the iPhone URL header
	setTimeout("clearUrl();", 100);
	// Setup some actions
	setupEvents();
}

// Roll the history for the last 7 days
function rollHistory() {
	user.set("day7", user.get("day6"));
	user.set("day6", user.get("day5"));
	user.set("day5", user.get("day4"));
	user.set("day4", user.get("day3"));
	user.set("day3", user.get("day2"));
	user.set("day2", user.get("day1"));
	user.set("day1", user.get("total"));
}

// Function to update the page based on the current user data
function updatePage() {
	// Update the total on the page
	document.getElementById("pgTotal").innerHTML = user.get("total");
	// Update the total from yesterdays page
	document.getElementById("pgYesterday").innerHTML = user.get("day1");
	// Update the user id on the page
	document.getElementById("pgUserId").innerHTML = user.get("id");
	// Update the report on the page
	document.getElementById("pgCols").innerHTML = "<table>\n" + user.get("log") + "\n<table>\n";
	// Hide the help
	hideHelp();
	// Scroll the URL off the iPhone
	clearUrl();
	// Remove focus
	document.getElementById("calInput").blur();
	// Clear the input
	document.getElementById("calInput").value = '';
}

function setupEvents() {
	document.getElementById("calInput").onkeyup = function(e) {
		if (e.keyCode == 13) {
			//submitForm();
			document.getElementById("calInput").blur();
		}
		// Fix non numeric values
		removeNonNum(this);
	};
	document.getElementById("addButton").onclick = hideAddButton;
	document.getElementById("calInput").onblur = submitForm;
}

function hideAddButton() {
	document.getElementById("addButton").style.display = "none";
	document.getElementById("calBox").style.display = "";
	document.getElementById("calInput").focus();
}

function showAddButton() {
	document.getElementById("addButton").style.display = "";
	document.getElementById("calBox").style.display = "none";
}

// Function to show the help if this is not the first hit
function showHelp() {
	if (user.get("log") == "") {
		// Show the help div
		document.getElementById("help").style.display = "block";
		// Move the bookmark div
		setTimeout(function () {
		}, 300);
	}
}

// Function to hide the help
function hideHelp() {
	if (user.get("log") != "") {
		document.getElementById("help").style.display = "none";
	}
}

// Function to clear the URL header on iPhone
function clearUrl() {
	window.scrollTo(0, 1);
}

// Function to submit the form
function submitForm() {
	// Grab a pointer to the element	
	var calInput = document.getElementById("calInput");
	// Grab the input
	var raw = calInput.value;
	// Evaluate it (allows 5+5)
	var num = Math.round(eval(raw));
	// Parse the value
	if (isNaN(parseInt(num)) === true) {
		var theValue = 0;
	} else {
		var theValue = num;
	}
	// If the input is not zero
	if (theValue != 0) {
		// Add to the user total
		user.set("total", user.get("total") + theValue);
		// Add to the user info
		user.set("log", "<tr><td>" + date('h:ia') + "</td><td style='text-align: right;'>" + theValue + "</td></tr>\n" + user.get("log") + "\n");
		// Update the page
		updatePage();
	}
	showAddButton();
}

// Function to submit the search and clear its value
function clearSearch() {
	field = document.getElementById('searchText');
	field.value = '';
	field.style.color = 'black';
}

// Function to add the word "calories" to the search value
function updateSearch() {
	field = document.getElementById('searchText');
	field.value = field.value + ' carbs';
	return true;
}

// Remove non alphanumeric characters from a string
function removeNonNum(e) {
	e.value = e.value.replace(/[^\-\+\(\)\.\*\/0-9]+/g,'');
}

// PHP like date function (from www.phpjs.org)
function date ( format, timestamp ) {
	// http://kevin.vanzonneveld.net
	// +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
	// +      parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: MeEtc (http://yass.meetcweb.com)
	// +   improved by: Brad Touesnard
	// +   improved by: Tim Wiel
	// +   improved by: Bryan Elliott
	// +   improved by: Brett Zamir (http://brett-zamir.me)
	// +   improved by: David Randall
	// +      input by: Brett Zamir (http://brett-zamir.me)
	// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: Brett Zamir (http://brett-zamir.me)
	// +   improved by: Brett Zamir (http://brett-zamir.me)
	// +  derived from: gettimeofday
	// +      input by: majak
	// +   bugfixed by: majak
	// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// %        note 1: Uses global: php_js to store the default timezone
	// *     example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
	// *     returns 1: '09:09:40 m is month'
	// *     example 2: date('F j, Y, g:i a', 1062462400);
	// *     returns 2: 'September 2, 2003, 2:26 am'
	// *     example 3: date('Y W o', 1062462400);
	// *     returns 3: '2003 36 2003'
	// *     example 4: x = date('Y m d', (new Date()).getTime()/1000); // 2009 01 09
	// *     example 4: (x+'').length == 10
	// *     returns 4: true
	// *     example 5: date('W', 1104534000);
	// *     returns 5: '53'

	var that = this;
	var jsdate=(
		(typeof(timestamp) == 'undefined') ? new Date() : // Not provided
		(typeof(timestamp) == 'number') ? new Date(timestamp*1000) : // UNIX timestamp
		new Date(timestamp) // Javascript Date()
	); // , tal=[]
	var pad = function (n, c){
		if ( (n = n + "").length < c ) {
		    return new Array(++c - n.length).join("0") + n;
		} else {
		    return n;
		}
	};
	var _dst = function (t) {
		// Calculate Daylight Saving Time (derived from gettimeofday() code)
		var dst=0;
		var jan1 = new Date(t.getFullYear(), 0, 1, 0, 0, 0, 0);  // jan 1st
		var june1 = new Date(t.getFullYear(), 6, 1, 0, 0, 0, 0); // june 1st
		var temp = jan1.toUTCString();
		var jan2 = new Date(temp.slice(0, temp.lastIndexOf(' ')-1));
		temp = june1.toUTCString();
		var june2 = new Date(temp.slice(0, temp.lastIndexOf(' ')-1));
		var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
		var daylight_time_offset = (june1 - june2) / (1000 * 60 * 60);
 
		if (std_time_offset === daylight_time_offset) {
		    dst = 0; // daylight savings time is NOT observed
		} else {
		    // positive is southern, negative is northern hemisphere
		    var hemisphere = std_time_offset - daylight_time_offset;
		    if (hemisphere >= 0) {
		        std_time_offset = daylight_time_offset;
		    }
		    dst = 1; // daylight savings time is observed
		}
		return dst;
	};
	var ret = '';
	var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday",
		"Thursday", "Friday", "Saturday"];
	var txt_ordin = {1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st"};
	var txt_months =  ["", "January", "February", "March", "April",
		"May", "June", "July", "August", "September", "October", "November",
		"December"];
 
	var f = {
		// Day
		    d: function (){
		        return pad(f.j(), 2);
		    },
		    D: function (){
		        var t = f.l();
		        return t.substr(0,3);
		    },
		    j: function (){
		        return jsdate.getDate();
		    },
		    l: function (){
		        return txt_weekdays[f.w()];
		    },
		    N: function (){
		        //return f.w() + 1;
		        return f.w() ? f.w() : 7;
		    },
		    S: function (){
		        return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';
		    },
		    w: function (){
		        return jsdate.getDay();
		    },
		    z: function (){
		        return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0;
		    },
 
		// Week
		    W: function (){
 
		        var a = f.z(), b = 364 + f.L() - a;
		        var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
 
		        if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
		            return 1;
		        } 
		        if (a <= 2 && nd >= 4 && a >= (6 - nd)){
		            nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
		            return that.date("W", Math.round(nd2.getTime()/1000));
		        }
		        
		        var w = (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
 
		        return (w ? w : 53);
		    },
 
		// Month
		    F: function (){
		        return txt_months[f.n()];
		    },
		    m: function (){
		        return pad(f.n(), 2);
		    },
		    M: function (){
		        var t = f.F();
		        return t.substr(0,3);
		    },
		    n: function (){
		        return jsdate.getMonth() + 1;
		    },
		    t: function (){
		        var n;
		        if ( (n = jsdate.getMonth() + 1) == 2 ){
		            return 28 + f.L();
		        }
		        if ( n & 1 && n < 8 || !(n & 1) && n > 7 ){
		            return 31;
		        }
		        return 30;
		    },
 
		// Year
		    L: function (){
		        var y = f.Y();
		        return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0;
		    },
		    o: function (){
		        if (f.n() === 12 && f.W() === 1) {
		            return jsdate.getFullYear()+1;
		        }
		        if (f.n() === 1 && f.W() >= 52) {
		            return jsdate.getFullYear()-1;
		        }
		        return jsdate.getFullYear();
		    },
		    Y: function (){
		        return jsdate.getFullYear();
		    },
		    y: function (){
		        return (jsdate.getFullYear() + "").slice(2);
		    },
 
		// Time
		    a: function (){
		        return jsdate.getHours() > 11 ? "pm" : "am";
		    },
		    A: function (){
		        return f.a().toUpperCase();
		    },
		    B: function (){
		        // peter paul koch:
		        var off = (jsdate.getTimezoneOffset() + 60)*60;
		        var theSeconds = (jsdate.getHours() * 3600) +
		                         (jsdate.getMinutes() * 60) +
		                          jsdate.getSeconds() + off;
		        var beat = Math.floor(theSeconds/86.4);
		        if (beat > 1000) {
		            beat -= 1000;
		        }
		        if (beat < 0) {
		            beat += 1000;
		        }
		        if ((String(beat)).length == 1) {
		            beat = "00"+beat;
		        }
		        if ((String(beat)).length == 2) {
		            beat = "0"+beat;
		        }
		        return beat;
		    },
		    g: function (){
		        return jsdate.getHours() % 12 || 12;
		    },
		    G: function (){
		        return jsdate.getHours();
		    },
		    h: function (){
		        return pad(f.g(), 2);
		    },
		    H: function (){
		        return pad(jsdate.getHours(), 2);
		    },
		    i: function (){
		        return pad(jsdate.getMinutes(), 2);
		    },
		    s: function (){
		        return pad(jsdate.getSeconds(), 2);
		    },
		    u: function (){
		        return pad(jsdate.getMilliseconds()*1000, 6);
		    },
 
		// Timezone
		    e: function () {
/*                var abbr='', i=0;
		        if (this.php_js && this.php_js.default_timezone) {
		            return this.php_js.default_timezone;
		        }
		        if (!tal.length) {
		            tal = this.timezone_abbreviations_list();
		        }
		        for (abbr in tal) {
		            for (i=0; i < tal[abbr].length; i++) {
		                if (tal[abbr][i].offset === -jsdate.getTimezoneOffset()*60) {
		                    return tal[abbr][i].timezone_id;
		                }
		            }
		        }
*/
		        return 'UTC';
		    },
		    I: function (){
		        return _dst(jsdate);
		    },
		    O: function (){
		       var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
		       t = (jsdate.getTimezoneOffset() > 0) ? "-"+t : "+"+t;
		       return t;
		    },
		    P: function (){
		        var O = f.O();
		        return (O.substr(0, 3) + ":" + O.substr(3, 2));
		    },
		    T: function () {
/*                var abbr='', i=0;
		        if (!tal.length) {
		            tal = that.timezone_abbreviations_list();
		        }
		        if (this.php_js && this.php_js.default_timezone) {
		            for (abbr in tal) {
		                for (i=0; i < tal[abbr].length; i++) {
		                    if (tal[abbr][i].timezone_id === this.php_js.default_timezone) {
		                        return abbr.toUpperCase();
		                    }
		                }
		            }
		        }
		        for (abbr in tal) {
		            for (i=0; i < tal[abbr].length; i++) {
		                if (tal[abbr][i].offset === -jsdate.getTimezoneOffset()*60) {
		                    return abbr.toUpperCase();
		                }
		            }
		        }
*/
		        return 'UTC';
		    },
		    Z: function (){
		       return -jsdate.getTimezoneOffset()*60;
		    },
 
		// Full Date/Time
		    c: function (){
		        return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P();
		    },
		    r: function (){
		        return f.D()+', '+f.d()+' '+f.M()+' '+f.Y()+' '+f.H()+':'+f.i()+':'+f.s()+' '+f.O();
		    },
		    U: function (){
		        return Math.round(jsdate.getTime()/1000);
		    }
	};
 
	return format.replace(/[\\]?([a-zA-Z])/g, function (t, s){
		if ( t!=s ){
		    // escaped
		    ret = s;
		} else if (f[s]){
		    // a date function exists
		    ret = f[s]();
		} else {
		    // nothing special
		    ret = s;
		}
		return ret;
	});
}

