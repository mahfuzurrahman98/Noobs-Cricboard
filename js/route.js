let view = (url, fun) => {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.send();
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState == 4) {
			document.querySelector("#main-container").innerHTML = xhr.responseText;
			fun();
		}
	});
};

let loadScoreModified = () => {
	loadScore();
	if (
		!match.verdict ||
		(match.verdict &&
			!match.verdict.includes("won") &&
			!match.verdict.includes("tied"))
	) {
		for (yy of document.querySelectorAll(".score-counter")) {
			yy.classList.remove("d-none");
		}
	}
};

window.addEventListener("load", () => {
	if (localStorage.getItem("match") === null) {
		view("details.html", () => {});
	} else {
		match = JSON.parse(localStorage.getItem("match"));
		if (match.onStrikeBatsman) {
			view("play.html", loadScoreModified);
		} else if (match.teamLineUp) {
			view("openers.html", setDomOpeners);
		} else if (match.tossWonBy) {
			view("lineup.html", setDomLineUp);
		} else if (match.title) {
			view("toss.html", setDomToss);
		}
	}
});
