let view = (url, fun, params) => {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.send();
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState == 4) {
			document.querySelector("#main-container").innerHTML = xhr.responseText;
			fun(params);
		}
	});
};

let loadScoreBoardModified = () => {
	let match = JSON.parse(localStorage.getItem("match"));

	document.querySelector("#teamOneCard").classList.remove("d-none");
	document.querySelector("#teamTwoCard").classList.remove("d-none");

	document.querySelector("#teamOneName").innerHTML = match.teams[0].substring(
		0,
		10
	);
	document.querySelector("#teamTwoName").innerHTML = match.teams[1].substring(
		0,
		10
	);

	let options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	let date_time = new Date(match.startTime);
	date_time = date_time.toLocaleDateString("en-US", options);
	document.querySelector(
		"#toss-win"
	).innerHTML = `${match.tossWonBy}, chose to ${match.tossDecision} | `;

	let ii = match.runningInnings == 0 ? "1st" : "2nd";
	document.querySelector(
		"#innings-indicator"
	).innerHTML = `${ii} innings running`;
	document.querySelector(
		"#match-heading"
	).innerHTML = `${match.title} <span class="text-dark fw-bold">|</span> ${date_time} <span class="text-dark fw-bold">|</span> ${match.teams[0]} vs ${match.teams[1]} <span class="text-dark fw-bold">|</span> ${match.venue}`;

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

let runningMatch = () => {
	if (localStorage.getItem("match") === null) {
		view("details.html", () => {});
	} else {
		match = JSON.parse(localStorage.getItem("match"));
		if (match.onStrikeBatsman) {
			view("play.html", loadScoreBoardModified);
		} else if (match.teamLineUp) {
			view("openers.html", setDomOpeners);
		} else if (match.tossWonBy) {
			view("lineup.html", setDomLineUp);
		} else if (match.title) {
			view("toss.html", setDomToss);
		}
	}
};

let teamFullCard = (track) => {
	view("team_full_card.html", teamFullCardFun, track);
};

window.addEventListener("load", () => {
	runningMatch();
});
