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
	document.getElementById("points").innerHTML = '<img src="https://oldschool.runescape.wiki/images/6/63/Coins_detail.png?404bc" class="coins"> ' + points;
}

var randomProperty = function(obj) {
	var keys = Object.keys(obj)
	return obj[keys[keys.length * Math.random() << 0]];
};

function levenshtein(a, b) {
	var t = [], u, i, j, m = a.length, n = b.length;
	if (!m) {
		return n;
	}
	if (!n) {
		return m;
	}
	for (j = 0; j <= n; j++) {
		t[j] = j;
	}
	for (i = 1; i <= m; i++) {
		for (u = [i], j = 1; j <= n; j++) {
			u[j] = a[i - 1] === b[j - 1] ? t[j - 1] : Math.min(t[j - 1], t[j], u[j - 1]) + 1;
		}
		t = u;
	}
	return u[n];
}

function start(firstTime) {
	load();
	if (!firstTime) {
		var inputText = document.getElementById("itemName").value.toLowerCase();
		var correctText = document.getElementById("item").className.replace(/%20/g, " ").toLowerCase();
		document.getElementById("itemName").value = "";
		if (levenshtein(inputText, correctText) <= 4) {
			points += 1;
			updatePointText();
			save();
			document.getElementById("resultText").innerHTML = "Correct!";
		} else {
			document.getElementById("resultText").innerHTML = "Answer: " + correctText;
		}
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
				setTimeout(function() {
					document.getElementById("item").src = $(data2).find(".item-description").find("img")[0].src;
					document.getElementById("resultText").innerHTML = "What is this item?";
				}, 2000);
			}
		});
	});
}

window.onload = function() {
	start(true);
	document.getElementById('mainForm').onsubmit = function(e) {
		e.preventDefault();
		start(false);
	};
}
