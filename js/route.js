let view = (url) => {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.send();
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState == 4) {
			document.querySelector("#main-container").innerHTML = xhr.responseText;
		}
	});
};

window.addEventListener("load", () => {
	if (localStorage.getItem("match") === null) {
		view("details.html");
	} else {
		match = JSON.parse(localStorage.getItem("match"));
		if (match.onStrikeBatsman) {
			view("play.html");
			setTimeout(() => {
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
			}, 500);
		} else if (match.teamLineUp) {
			view("openers.html");
			setTimeout(() => {
				console.log("openers loaded");
				setDomOpeners();
			}, 250);
		} else if (match.tossWonBy) {
			view("lineup.html");
			setTimeout(() => {
				console.log("linueup loaded");
				setDomLineUp();
			}, 250);
		} else if (match.title) {
			view("toss.html");
			setTimeout(() => {
				console.log("toss loaded");
				setDomToss();
			}, 250);
		}
	}
});
