let wideBallModal = () => {
	new bootstrap.Modal(document.querySelector("#wide-ball")).show();
	document.querySelector("#wide_byes").value = 0;
	document.querySelector("#wide_dismissal").value = "no-wicket";
};

let wideAndRun = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;
	let runTaken = parseInt(document.querySelector("#wide_byes").value);

	let batsmanId = match.teamLineUp[track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBatsman
	);
	let bowlerId = match.teamLineUp[1 - track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBowler
	);

	// batting team scoreboard
	match.teamScoreboard[track].totalRunScored++;
	match.teamScoreboard[track].runsFromExtras++;
	match.teamScoreboard[track].totalRunScored += runTaken;
	match.teamScoreboard[track].curOver.push(runTaken + "Wd");

	// batsman profile
	match.teamLineUp[track][batsmanId].hasBatted = true;

	// bowler profile
	match.teamLineUp[1 - track][bowlerId].wideGiven++;
	match.teamLineUp[1 - track][bowlerId].runGiven++;
	match.teamLineUp[1 - track][bowlerId].runGiven += runTaken;

	localStorage.setItem("match", JSON.stringify(match));
	loadScore();
};
let wideAndWicket = (whichOut) => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	let batsmanId = match.teamLineUp[track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBatsman
	);
	let bowlerId = match.teamLineUp[1 - track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBowler
	);

	// batting team scoreboard
	match.teamScoreboard[track].totalRunScored++;
	match.teamScoreboard[track].runsFromExtras++;
	match.teamScoreboard[track].wicketFall++;
	match.teamScoreboard[track].curOver.push("WdW");

	// batsman profile
	match.teamLineUp[track][batsmanId].hasBatted = true;
	match.teamLineUp[track][batsmanId].gotOut = true;

	// bowler profile
	match.teamLineUp[1 - track][bowlerId].wideGiven++;
	match.teamLineUp[1 - track][bowlerId].wicketTaken++;

	match.lastBatsman = match.onStrikeBatsman;

	if (whichOut == "stumping") {
		console.log("stumped out");
		new bootstrap.Modal(document.querySelector("#stumped-out")).show();
		let elevenOption = "";
		match.teamLineUp[1 - track].forEach((e) => {
			if (e.name != match.onStrikeBowler) {
				elevenOption += `<option value="${e.name}">${e.name}</option>`;
			}
		});

		document.querySelector("#stumpedByOption").innerHTML = elevenOption;
		document.querySelector("#stumpedBy").addEventListener("click", () => {
			match.lastWicketFallMessage = `Last batsman: <b>${
				match.onStrikeBatsman
			}</b> st <b>${
				document.querySelector("#stumpedByOption").value
			}</b> b <b>${match.onStrikeBowler}</b>`;
			localStorage.setItem("match", JSON.stringify(match));
			newBatsman();
		});
	} else {
		console.log("hit wicket");
		match.lastWicketFallMessage = `Last batsman: <b>${match.onStrikeBatsman}</b> hit wicket b <b>${match.onStrikeBowler}</b>`;
		localStorage.setItem("match", JSON.stringify(match));
		newBatsman();
	}
};

let wideBallRunOutModal = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;
	new bootstrap.Modal(document.querySelector("#wide-ball-run-out")).show();

	let elevenOption = "";
	elevenOption += `<option value="${match.onStrikeBatsman}">${match.onStrikeBatsman}</option>`;
	elevenOption += `<option value="${match.nonStrikeBatsman}">${match.nonStrikeBatsman}</option>`;
	document.querySelector("#whoGotOutOption_wr").innerHTML = elevenOption;

	elevenOption = "";
	match.teamLineUp[1 - track].forEach((e) => {
		elevenOption += `<option value="${e.name}">${e.name}</option>`;
	});
	document.querySelector("#runOutByOption_wr").innerHTML = elevenOption;
};

let wideAndRunOut = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	let runTaken = parseInt(document.querySelector("#runsTaken_wr").value);
	let runFrom = document.querySelector("#runsFrom_wr").value;

	let batsmanId = match.teamLineUp[track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBatsman
	);
	let bowlerId = match.teamLineUp[1 - track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBowler
	);
	// batting team scoreboard
	match.teamScoreboard[track].totalRunScored++;
	match.teamScoreboard[track].runsFromExtras++;
	// batsman profile
	match.teamLineUp[track][batsmanId].hasBatted = true;
	match.teamLineUp[track][batsmanId].ballFaced++;
	// bowler profile
	match.teamLineUp[1 - track][bowlerId].hasBowled = true;
	match.teamLineUp[1 - track][bowlerId].runGiven++;
	match.teamLineUp[1 - track][bowlerId].noBallGiven++;

	localStorage.setItem("match", JSON.stringify(match));
	loadScore();

	if (runTaken > 0) {
		console.log("taken", runTaken);
		// batting team scoreboard
		match.teamScoreboard[track].totalRunScored += runTaken;

		if (runFrom == "bat") {
			// batsman profile
			match.teamLineUp[track][batsmanId].runScored += runTaken;
		} else {
			// add to extra
			match.teamScoreboard[track].runsFromExtras++;
		}

		// bowler profile
		match.teamLineUp[1 - track][bowlerId].runGiven += runTaken;

		if (runTaken % 2 == 1) {
			[match.onStrikeBatsman, match.nonStrikeBatsman] = [
				match.nonStrikeBatsman,
				match.onStrikeBatsman,
			];
		}

		localStorage.setItem("match", JSON.stringify(match));
		loadScore();
	} else {
		console.log("not-taken", runTaken);
	}

	if (document.querySelector("#isRunOut").checked) {
		if (runTaken % 2 == 1) {
			[match.onStrikeBatsman, match.nonStrikeBatsman] = [
				match.nonStrikeBatsman,
				match.onStrikeBatsman,
			];
		}

		match.lastBatsman = document.querySelector("#whoGotOutOption_wr").value;
		console.log(match.lastBatsman);
		batsmanId = match.teamLineUp[track].findIndex(
			(playerObj) => playerObj.name == match.lastBatsman
		);

		// batting team scoreboard
		match.teamScoreboard[track].wicketFall++;
		// batsman profile
		match.teamLineUp[track][batsmanId].gotOut = true;

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
				if (match.lastBatsman == match.onStrikeBatsman) {
					if (document.querySelector("#onWhichEnd_wr").value == "bowlerEnd") {
						[match.onStrikeBatsman, match.nonStrikeBatsman] = [
							match.nonStrikeBatsman,
							match.onStrikeBatsman,
						];
						match.nonStrikeBatsman =
							document.querySelector("#newBatsman").value;
					} else {
						match.onStrikeBatsman = document.querySelector("#newBatsman").value;
					}
				} else {
					if (document.querySelector("#onWhichEnd_wr").value == "keeperEnd") {
						[match.onStrikeBatsman, match.nonStrikeBatsman] = [
							match.nonStrikeBatsman,
							match.onStrikeBatsman,
						];
						match.onStrikeBatsman = document.querySelector("#newBatsman").value;
					} else {
						match.nonStrikeBatsman =
							document.querySelector("#newBatsman").value;
					}
				}

				console.log("sut");
				localStorage.setItem("match", JSON.stringify(match));
				loadScore();
			});
		}
	}
};

let wideBall = () => {
	let wideDismissal = document.querySelector("#wide_dismissal").value;
	if (wideDismissal == "no-wicket") {
		wideAndRun();
	} else if (wideDismissal == "run-out") {
		console.log("wide-run-out");
		wideBallRunOutModal();
	} else {
		wideAndWicket(wideDismissal);
	}
};
