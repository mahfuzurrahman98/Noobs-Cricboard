let getVerdict = () => {
	// returns one of four three integers
	// 1 = first innings running
	// 2 = first innings ends
	// 3 = second innings running
	// 4 = second innings ends
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;
	let firstInningsOver = false;
	match.verdictFlag = 1;
	// first innings
	if (match.runningInnings == 0) {
		let prevMsg = "";
		if (
			// if all out
			match.noOfPlayers ==
			match.teamScoreboard[track].wicketFall + 1
		) {
			firstInningsOver = true;
			prevMsg = `All out<br>${match.lastWicketFallMessage}`;
		} else if (
			// if over is completed
			match.noOfOvers * 6 ==
			match.teamScoreboard[track].ballsPlayed
		) {
			firstInningsOver = true;
			prevMsg = `${match.noOfOvers} over is completed<br>`;
		}
		if (firstInningsOver) {
			match.verdictFlag = 2;
			new bootstrap.Modal(
				document.querySelector("#second-innings-modal")
			).show();
			document.querySelector(
				"#second-innings-message"
			).innerHTML = `${prevMsg}<br>${match.batting} - ${
				match.teamScoreboard[track].totalRunScored
			}/${match.teamScoreboard[track].wicketFall}<br>${match.fielding} Needs ${
				match.teamScoreboard[track].totalRunScored + 1
			} runs to win from ${match.noOfOvers} overs at ${(
				(match.teamScoreboard[track].totalRunScored + 1) /
				match.noOfOvers
			).toFixed(2)} RPO`;

			document.querySelector("#proceed").addEventListener("click", () => {
				console.log("procedd clicked");
				match.runningInnings = 1;
				[match.batting, match.fielding] = [match.fielding, match.batting];
				match.onStrikeBatsman = "";
				match.nonStrikeBatsman = "";
				match.onStrikeBowler = "";
				localStorage.setItem("match", JSON.stringify(match));
				for (yy of document.querySelectorAll(".score-counter")) {
					yy.classList.add("d-none");
				}
				view("openers.html", setDomOpeners);
			});
		}
	}

	// second innings
	else {
		match.verdictFlag = 3;
		console.log("second");
		// match running = wickets in hand and balls remaining
		// match ended = all out or ball is over
		// match results with wickets in hand and balls remaining
		let runsNeeded =
			match.teamScoreboard[1 - track].totalRunScored -
			match.teamScoreboard[track].totalRunScored +
			1;
		let remBowls =
			match.noOfOvers * 6 - match.teamScoreboard[track].ballsPlayed;
		if (
			match.teamScoreboard[track].totalRunScored ==
			match.teamScoreboard[1 - track].totalRunScored
		) {
			// score level, 2 possibilities either score level if match running or match tied if match ended
			if (
				match.teamScoreboard[track].wicketFall + 1 < match.noOfPlayers &&
				remBowls > 0
			) {
				//match running
				match.verdict = `Score is level, needs 1 run to win from ${parseInt(
					remBowls / 6
				)}.${parseInt(remBowls % 6)} overs at a rate of ${(
					(runsNeeded / remBowls) *
					6
				).toFixed(2)} per over.`;
			} else if (
				match.teamScoreboard[track].wicketFall + 1 == match.noOfPlayers ||
				remBowls == 0
			) {
				// All out or balls over
				match.verdictFlag = 4;
				match.verdict = "Match tied";
				for (yy of document.querySelectorAll(".score-counter")) {
					yy.classList.add("d-none");
				}
			}
		} else if (
			match.teamScoreboard[track].totalRunScored <
			match.teamScoreboard[1 - track].totalRunScored
		) {
			// runs needed, two possibilities, either lose or to fillup target
			if (
				match.teamScoreboard[track].wicketFall + 1 == match.noOfPlayers ||
				remBowls == 0
			) {
				match.verdictFlag = 4;
				match.verdict = `${match.fielding} won by ${runsNeeded - 1} runs`;
				for (yy of document.querySelectorAll(".score-counter")) {
					yy.classList.add("d-none");
				}
			} else if (
				match.teamScoreboard[track].wicketFall + 1 < match.noOfPlayers &&
				remBowls > 0
			) {
				match.verdict = `Needs ${runsNeeded} runs to win from ${parseInt(
					remBowls / 6
				)}.${parseInt(remBowls % 6)} overs at a rate of ${(
					(runsNeeded / remBowls) *
					6
				).toFixed(2)} per over.`;
			}
		} else if (
			match.teamScoreboard[track].totalRunScored >
			match.teamScoreboard[1 - track].totalRunScored
		) {
			// team batting second wins
			match.verdictFlag = 4;
			match.verdict = `${match.batting} won by ${
				match.noOfPlayers - 1 - match.teamScoreboard[track].wicketFall
			} wickets with ${remBowls} balls remaining.`;
			for (yy of document.querySelectorAll(".score-counter")) {
				yy.classList.add("d-none");
			}
		}
		document.querySelector("#verdict").innerHTML = match.verdict;
	}
	localStorage.setItem("match", JSON.stringify(match));
};

let loadScore = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	let batsmanId1 = match.teamLineUp[track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBatsman
	);
	let batsmanId2 = match.teamLineUp[track].findIndex(
		(playerObj) => playerObj.name == match.nonStrikeBatsman
	);
	let bowlerId = match.teamLineUp[1 - track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBowler
	);

	let batsman1 = match.teamLineUp[track][batsmanId1];
	match.teamLineUp[track][batsmanId1].hasBatted = true;
	match.teamLineUp[track][batsmanId2].hasBatted = true;
	let batsmanOneStrikeRate = (
		(batsman1.runScored * 100) /
		batsman1.ballFaced
	).toFixed(2);
	if (batsman1.ballFaced == 0) {
		batsmanOneStrikeRate = 0.0;
	}

	let displaybatsman1 = `<td>${batsman1.name}*</td>
    <td>${batsman1.runScored}</td>
    <td>${batsman1.ballFaced}</td>
    <td>${batsman1.ballDotted}</td>
    <td>${batsman1.fourHitted}</td>
    <td>${batsman1.sixHitted}</td>
    <td>${batsmanOneStrikeRate}</td>`;

	let batsman2 = match.teamLineUp[track][batsmanId2];
	match.teamLineUp[track][batsmanId2].hasBatted = true;
	let batsmanTwoStrikeRate = (
		(batsman2.runScored * 100) /
		batsman2.ballFaced
	).toFixed(2);
	if (batsman2.ballFaced == 0) {
		batsmanTwoStrikeRate = 0.0;
	}

	let displaybatsman2 = `<td>${batsman2.name}</td>
    <td>${batsman2.runScored}</td>
    <td>${batsman2.ballFaced}</td>
    <td>${batsman2.ballDotted}</td>
    <td>${batsman2.fourHitted}</td>
    <td>${batsman2.sixHitted}</td>
    <td>${batsmanTwoStrikeRate}</td>`;

	let bowler = match.teamLineUp[1 - track][bowlerId];
	match.teamLineUp[1 - track][bowlerId].hasBowled = true;

	let bowler_economy = ((bowler.runGiven * 6) / bowler.ballBowled).toFixed(2);
	if (bowler.ballBowled == 0) {
		bowler_economy = "0.00";
	}
	let displayBowler = `<td>${bowler.name}</td>
			<td>${parseInt(bowler.ballBowled / 6)}.${bowler.ballBowled % 6}</td>
			<td>${bowler.runGiven}</td>
			<td>${bowler.maidenGiven}</td>
			<td>${bowler.wicketTaken}</td>
			<td>${bowler_economy}</td>
			<td>${bowler.dotGiven}</td>
			<td>${bowler.fourConsidered}</td>
			<td>${bowler.sixConsidered}</td>
			<td>${bowler.wideGiven}</td>
			<td>${bowler.noBallGiven}</td>`;

	document.querySelector("#teamName").innerHTML = `${match.batting} - `;
	document.querySelector(
		"#scoreAndWicket"
	).innerHTML = `${match.teamScoreboard[track].totalRunScored} / ${match.teamScoreboard[track].wicketFall}`;
	document.querySelector("#showOver").innerHTML = `Overs: ${parseInt(
		match.teamScoreboard[track].ballsPlayed / 6
	)}.${match.teamScoreboard[track].ballsPlayed % 6}`;

	document.querySelector("#batsman1").innerHTML = displaybatsman1;
	document.querySelector("#batsman2").innerHTML = displaybatsman2;
	document.querySelector("#bowler").innerHTML = displayBowler;

	document.querySelector("#over").innerHTML = "";
	for (let j of match.teamScoreboard[track].curOver) {
		let newBowl = document.createElement("span");
		newBowl.classList.add(
			"display-5",
			"btn",
			"btn-lg",
			"btn-outline-secondary",
			"fw-bold",
			"rounded-circle",
			"mx-1"
		);
		newBowl.innerText = j;
		document.querySelector("#over").appendChild(newBowl);
	}

	getVerdict();
	match = JSON.parse(localStorage.getItem("match"));
};

let newBatsman = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	if (match.teamScoreboard[track].wicketFall + 1 == match.noOfPlayers) {
		// all out
		localStorage.setItem("match", JSON.stringify(match));
		loadScore();
	} else {
		new bootstrap.Modal(document.querySelector("#new-batsman")).show();
		document.querySelector("#batting-modal-message").innerHTML =
			match.lastWicketFallMessage;

		elevenOption = "";
		match.teamLineUp[track].forEach((e) => {
			if (
				!e.gotOut &&
				e.name != match.onStrikeBatsman &&
				e.name != match.nonStrikeBatsman
			) {
				elevenOption += `<option value="${e.name}">${e.name}</option>`;
			}
		});
		document.querySelector("#newBatsman").innerHTML = elevenOption;

		document.querySelector("#setnewBatsman").addEventListener("click", () => {
			match.onStrikeBatsman = document.querySelector("#newBatsman").value;

			localStorage.setItem("match", JSON.stringify(match));
			loadScore();
		});
	}
};

let newBowler = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.fielding == match.teams[0] ? 0 : 1;

	new bootstrap.Modal(document.querySelector("#new-bowler")).show();
	match.lastBowler = match.onStrikeBowler;

	let elevenOneOption = "";
	match.teamLineUp[track].forEach((e) => {
		if (e.name != match.lastBowler) {
			elevenOneOption += `<option value="${e.name}">${e.name}</option>`;
		}
	});

	document.querySelector("#newBowler").innerHTML = elevenOneOption;
	document.querySelector("#setNewBowler").addEventListener("click", () => {
		match.onStrikeBowler = document.querySelector("#newBowler").value;
		localStorage.setItem("match", JSON.stringify(match));
		loadScore();
	});
};

let checkMaiden = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	let curOver = match.teamScoreboard[track].curOver;
	if (curOver.length == 6) {
		for (let i of curOver) {
			if (
				i.includes("1") ||
				i.includes("2") ||
				i.includes("3") ||
				i.includes("4")
			) {
				return false;
			} else if (
				i.includes("5") ||
				i.includes("6") ||
				i.includes("7") ||
				i.includes("8")
			) {
				return false;
			} else if (i.includes("Wd") || i.includes("Nb")) {
				return false;
			}
		}
		return true;
	}
};

let overCompletionCheck = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	// if over is completed
	if (
		match.teamScoreboard[track].ballsPlayed % 6 == 0 &&
		match.teamScoreboard[track].ballsPlayed > 0
	) {
		let bowlerId = match.teamLineUp[1 - track].findIndex(
			(playerObj) => playerObj.name == match.onStrikeBowler
		);
		// check maiden
		if (checkMaiden()) {
			match.teamLineUp[1 - track][bowlerId].maidenGiven++;
		}
		// rotate strike
		[match.onStrikeBatsman, match.nonStrikeBatsman] = [
			match.nonStrikeBatsman,
			match.onStrikeBatsman,
		];
		match.teamScoreboard[track].curOver = [];
		localStorage.setItem("match", JSON.stringify(match));
		// get a new bowler
		if (match.verdictFlag % 2 == 1) {
			console.log("overcc");
			newBowler();
		}
	}
};
