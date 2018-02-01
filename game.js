var points = 0;

function save() {
	var save = {
		points: points
	}
	localStorage.setItem("save",JSON.stringify(save));
}

function load() {
	var savegame = JSON.parse(localStorage.getItem("save"));
	if (savegame) {
		if (typeof savegame.points !== "undefined") {
			points = savegame.points;
		}
	}
	updatePointText();
}

function updatePointText() {
	document.getElementById("points").innerHTML = "Points: " + points;
}

var randomProperty = function(obj) {
	var keys = Object.keys(obj)
	return obj[keys[keys.length * Math.random() << 0]];
};

function start() {
	load();
	var inputText = document.getElementById("itemName").value.toLowerCase();
	var correctText = document.getElementById("item").className.replace(/%20/g, " ").toLowerCase();
	if (inputText == correctText) {
		console.log(correctText);
		points += 1;
		updatePointText();
		save();
	}
	$.ajax({
	    url: "https://cors-anywhere.herokuapp.com/http://rsbuddy.com/exchange/summary.json"
	}).done(function(data) {
		var property = randomProperty(data);
		var name = property.name;
		var id = property.id;
		document.getElementById("item").className = name;
		$.ajax({
		    url: "https://cors-anywhere.herokuapp.com/http://services.runescape.com/m=itemdb_oldschool/viewitem?obj=" + id,
		    success: function (data2) {
			document.getElementById("item").src = $(data2).find(".item-description").find("img")[0].src;
		    }
		});
	});
}

document.getElementById('mainForm').onsubmit = function(e) {
    e.preventDefault();
    start();
};
