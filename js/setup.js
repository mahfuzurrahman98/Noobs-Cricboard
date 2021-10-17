let matchDetailsSetup = () => {
	console.log("init");
	// initialization
	localStorage.clear();

	let title = document.querySelector("#matchTitle").value;
	let teamOne = document.querySelector("#teamOne").value;
	let teamTwo = document.querySelector("#teamTwo").value;
	let venue = document.querySelector("#venue").value;
	let startTime = document.querySelector("#startTime").value;

	match = {
		title: title.trim(),
		teams: [teamOne.trim(), teamTwo.trim()],
		venue: venue.trim(),
		startTime: startTime.trim(),
	};

	localStorage.setItem("match", JSON.stringify(match));
	view("toss.html", setDomToss);
};

let setDomToss = () => {
	let match = JSON.parse(localStorage.getItem("match"));

	let teams = `<option value="${match.teams[0]}">${match.teams[0]}</option>
               <option value="${match.teams[1]}">${match.teams[1]}</option>`;
	document.querySelector("#teamNames").innerHTML = teams;

	let overOptions = "";
	for (let i = 1; i <= 50; i++) {
		overOptions += `<option value="${i}">${i}</option>`;
		document.querySelector("#overs").innerHTML = overOptions;
	}

	let playerOptions = "";
	for (let i = 3; i <= 11; i++) {
		playerOptions += `<option value="${i}">${i}</option>`;
		document.querySelector("#players").innerHTML = playerOptions;
	}
};

let setDomLineUp = () => {
	let match = JSON.parse(localStorage.getItem("match"));

	let playerNameOption1 = `<p class="mt-3 h4 text-center text-success">${match.teams[0]}</p>`;
	for (let i = 0; i < match.noOfPlayers; i++) {
		playerNameOption1 += `<input type="text" id="team1-${
			i + 1
		}" class="form-control"><br>`;
	}

	let playerNameOption2 = `<p class="mt-3 h4 text-center text-success">${match.teams[1]}</p>`;
	for (let i = 0; i < match.noOfPlayers; i++) {
		playerNameOption2 += `<input type="text" id="team2-${
			i + 1
		}" class="form-control"><br>`;
	}

	document.querySelector("#teamOnePlayers").innerHTML = playerNameOption1;
	document.querySelector("#teamTwoPlayers").innerHTML = playerNameOption2;
};

let tossOverAndPlay = () => {
	let match = JSON.parse(localStorage.getItem("match"));

	let tossWonBy = document.querySelector("#teamNames").value;
	let tossDecision = document.querySelector("#tossDecision").value;
	match.tossWonBy = tossWonBy;

	if (tossWonBy == match.teams[0]) {
		tossLostBy = match.teams[1];
	} else {
		tossLostBy = match.teams[0];
	}

	if (tossDecision == "bat") {
		match.batting = tossWonBy;
		match.fielding = tossLostBy;
	} else {
		match.batting = tossLostBy;
		match.fielding = tossWonBy;
	}
	match.noOfOvers = document.querySelector("#overs").value;
	match.noOfPlayers = document.querySelector("#players").value;

	localStorage.setItem("match", JSON.stringify(match));
	view("lineup.html", setDomLineUp);
};

let setDomOpeners = () => {
	let match = JSON.parse(localStorage.getItem("match"));

	// Opener batsman
	let track = match.batting == match.teams[0] ? 0 : 1;
	let elevenOneOption = "";
	match.teamLineUp[track].forEach((e) => {
		elevenOneOption += `<option value="${e.name}">${e.name}</option>`;
	});
	document.querySelector("#onStrike").innerHTML = elevenOneOption;
	document.querySelector("#nonStrike").innerHTML = elevenOneOption;

	// Bowler on-strike
	elevenOneOption = "";
	match.teamLineUp[1 - track].forEach((e) => {
		elevenOneOption += `<option value="${e.name}">${e.name}</option>`;
	});
	document.querySelector("#onStrikeBowler").innerHTML = elevenOneOption;
};

let lineUpSetup = () => {
	let match = JSON.parse(localStorage.getItem("match"));

	match.teamLineUp = [[], []];
	match.teamScoreboard = [[], []];

	for (let i = 0; i < match.noOfPlayers; i++) {
		match.teamLineUp[0].push({
			name: document.querySelector(`#team1-${i + 1}`).value,
			hasBatted: false,
			gotOut: false,
			gotRetiredHurt: false,
			runScored: 0,
			ballFaced: 0,
			ballDotted: 0,
			fourHitted: 0,
			sixHitted: 0,
			hasBowled: false,
			ballBowled: 0,
			runGiven: 0,
			dotGiven: 0,
			maidenGiven: 0,
			fourConsidered: 0,
			sixConsidered: 0,
			wideGiven: 0,
			noBallGiven: 0,
			wicketTaken: 0,
		});

		match.teamLineUp[1].push({
			name: document.querySelector(`#team2-${i + 1}`).value,
			hasBatted: false,
			gotOut: false,
			gotRetiredHurt: false,
			runScored: 0,
			ballFaced: 0,
			ballDotted: 0,
			fourHitted: 0,
			sixHitted: 0,
			hasBowled: false,
			ballBowled: 0,
			runGiven: 0,
			dotGiven: 0,
			maidenGiven: 0,
			fourConsidered: 0,
			sixConsidered: 0,
			wideGiven: 0,
			noBallGiven: 0,
			wicketTaken: 0,
		});
	}

	match.teamScoreboard[0] = match.teamScoreboard[1] = {
		runsFromBat: 0,
		runsFromExtras: 0,
		totalRunScored: 0,
		retiredHurt: 0,
		wicketFall: 0,
		ballsPlayed: 0,
		curOver: [],
	};
	match.runningInnings = 0;

	localStorage.setItem("match", JSON.stringify(match));
	view("openers.html", setDomOpeners);
};

let setOpeners = () => {
	let match = JSON.parse(localStorage.getItem("match"));

	let onStrikeBatsman = document.querySelector("#onStrike").value;
	let nonStrikeBatsman = document.querySelector("#nonStrike").value;
	let onStrikeBowler = document.querySelector("#onStrikeBowler").value;

	match.onStrikeBatsman = onStrikeBatsman;
	match.nonStrikeBatsman = nonStrikeBatsman;
	match.onStrikeBowler = onStrikeBowler;

	localStorage.setItem("match", JSON.stringify(match));
	view("play.html", loadScore);
	setTimeout(() => {
		if (
			document
				.querySelectorAll(".score-counter")[0]
				.classList.contains("d-none")
		) {
			for (yy of document.querySelectorAll(".score-counter")) {
				yy.classList.remove("d-none");
			}
		}
	}, 1000);
};

let showHideRuns = () => {
	document.querySelector("#fiveRun").classList.toggle("d-none");
	document.querySelector("#sevenRun").classList.toggle("d-none");
	document.querySelector("#eightRun").classList.toggle("d-none");
};
