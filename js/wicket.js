let dismiss = (x) => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	let batsmanId = match.teamLineUp[track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBatsman
	);
	let bowlerId = match.teamLineUp[1 - track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBowler
	);

	// batting team scoreboard
	match.teamScoreboard[track].ballsPlayed++;
	match.teamScoreboard[track].wicketFall++;
	match.teamScoreboard[track].curOver.push("W");

	// batsman profile
	match.teamLineUp[track][batsmanId].hasBatted = true;
	match.teamLineUp[track][batsmanId].ballFaced++;
	match.teamLineUp[track][batsmanId].gotOut = true;

	// bowler profile
	match.teamLineUp[1 - track][bowlerId].hasBowled = true;
	match.teamLineUp[1 - track][bowlerId].ballBowled++;
	match.teamLineUp[1 - track][bowlerId].dotGiven++;
	match.teamLineUp[1 - track][bowlerId].wicketTaken++;

	match.lastBatsman = match.onStrikeBatsman;

	if (x == "bowled") {
		match.lastWicketFallMessage = `Last batsman: <b>${match.onStrikeBatsman}</b> b <b>${match.onStrikeBowler}</b>`;
	} else if (x == "lbw") {
		match.lastWicketFallMessage = `Last batsman: <b>${match.onStrikeBatsman}</b> lbw <b>${match.onStrikeBowler}</b>`;
	} else {
		match.lastWicketFallMessage = `Last batsman: <b>${match.onStrikeBatsman}</b> hit-wicket b <b>${match.onStrikeBowler}</b>`;
	}

	localStorage.setItem("match", JSON.stringify(match));
	newBatsman();
};

let stumpedOut = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	let batsmanId = match.teamLineUp[track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBatsman
	);
	let bowlerId = match.teamLineUp[1 - track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBowler
	);

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
		}</b> st <b>${document.querySelector("#stumpedByOption").value}</b> b <b>${
			match.onStrikeBowler
		}</b>`;

		// batting team scoreboard
		match.teamScoreboard[track].ballsPlayed++;
		match.teamScoreboard[track].wicketFall++;
		match.teamScoreboard[track].curOver.push("W");

		// batsman profile
		match.teamLineUp[track][batsmanId].hasBowled = true;
		match.teamLineUp[track][batsmanId].ballFaced++;
		match.teamLineUp[track][batsmanId].gotOut = true;

		// bowler profile
		match.teamLineUp[1 - track][bowlerId].hasBowled = true;
		match.teamLineUp[1 - track][bowlerId].ballBowled++;
		match.teamLineUp[1 - track][bowlerId].dotGiven++;
		match.teamLineUp[1 - track][bowlerId].wicketTaken++;

		match.lastBatsman = match.onStrikeBatsman;

		localStorage.setItem("match", JSON.stringify(match));
		newBatsman();
	});
};

let caughtOut = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	let bowlerId = match.teamLineUp[1 - track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBowler
	);

	new bootstrap.Modal(document.querySelector("#caught-out")).show();

	let elevenOption = "";
	elevenOption += `<option value="${match.onStrikeBatsman}">${match.onStrikeBatsman}</option>`;
	elevenOption += `<option value="${match.nonStrikeBatsman}">${match.nonStrikeBatsman}</option>`;
	document.querySelector("#whoGotOutOption_c").innerHTML = elevenOption;

	elevenOption = "";
	match.teamLineUp[1 - track].forEach((e) => {
		elevenOption += `<option value="${e.name}">${e.name}</option>`;
	});
	document.querySelector("#caughtByOption").innerHTML = elevenOption;

	document.querySelector("#caughtBy").addEventListener("click", () => {
		let whoGotOut = document.querySelector("#whoGotOutOption_c").value;
		let batsmanId = match.teamLineUp[track].findIndex(
			(playerObj) => playerObj.name == whoGotOut
		);
		match.lastBatsman = document.querySelector("#whoGotOutOption_c").value;

		if (
			document.querySelector("#caughtByOption").value == match.onStrikeBowler
		) {
			match.lastWicketFallMessage = `Last batsman: <b>${match.lastBatsman}</b> c & b <b>${match.onStrikeBowler}</b>`;
		} else {
			match.lastWicketFallMessage = `Last batsman: <b>${
				match.lastBatsman
			}</b> c <b>${document.querySelector("#caughtByOption").value}</b> b <b>${
				match.onStrikeBowler
			}</b>`;
		}

		// batting team scoreboard
		match.teamScoreboard[track].ballsPlayed++;
		match.teamScoreboard[track].wicketFall++;
		match.teamScoreboard[track].curOver.push("W");

		// batsman profile
		match.teamLineUp[track][batsmanId].hasBatted = true;
		match.teamLineUp[track][batsmanId].ballFaced++;
		match.teamLineUp[track][batsmanId].gotOut = true;

		// bowler profile
		match.teamLineUp[1 - track][bowlerId].hasBowled = true;
		match.teamLineUp[1 - track][bowlerId].ballBowled++;
		match.teamLineUp[1 - track][bowlerId].dotGiven++;
		match.teamLineUp[1 - track][bowlerId].wicketTaken++;

		if (match.teamScoreboard[track].wicketFall + 1 == match.noOfPlayers) {
			// all out
			localStorage.setItem("match", JSON.stringify(match));
			loadScore();
			overCompletionCheck();
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
				if (whoGotOut == match.onStrikeBatsman) {
					match.onStrikeBatsman = document.querySelector("#newBatsman").value;
				} else {
					match.nonStrikeBatsman = document.querySelector("#newBatsman").value;
				}

				if (isOverCompleted()) {
					match.lastBowler = match.onStrikeBowler;
					match.onStrikeBowler = "";
				}
				localStorage.setItem("match", JSON.stringify(match));
				loadScore();
				overCompletionCheck();
			});
		}
	});
};

let runOut = () => {
	// still not completed
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	let bowlerId = match.teamLineUp[1 - track].findIndex(
		(playerObj) => playerObj.name == match.onStrikeBowler
	);

	new bootstrap.Modal(document.querySelector("#run-out")).show();

	let elevenOption = "";
	elevenOption += `<option value="${match.onStrikeBatsman}">${match.onStrikeBatsman}</option>`;
	elevenOption += `<option value="${match.nonStrikeBatsman}">${match.nonStrikeBatsman}</option>`;
	document.querySelector("#whoGotOutOption_r").innerHTML = elevenOption;

	elevenOption = "";
	match.teamLineUp[1 - track].forEach((e) => {
		elevenOption += `<option value="${e.name}">${e.name}</option>`;
	});
	document.querySelector("#runOutByOption").innerHTML = elevenOption;

	document.querySelector("#runOutBy").addEventListener("click", () => {
		let batsmanId = match.teamLineUp[track].findIndex(
			(playerObj) =>
				playerObj.name == document.querySelector("#whoGotOutOption_r").value
		);
		match.lastBatsman = document.querySelector("#whoGotOutOption_r").value;

		match.lastWicketFallMessage = `Last batsman: <b>${
			match.lastBatsman
		}</b> run out (<b>${document.querySelector("#runOutByOption").value}</b>)`;

		// batting team scoreboard
		match.teamScoreboard[track].ballsPlayed++;
		match.teamScoreboard[track].wicketFall++;
		match.teamScoreboard[track].curOver.push("W");

		// batsman profile
		match.teamLineUp[track][batsmanId].ballFaced++;
		match.teamLineUp[track][batsmanId].gotOut = true;

		// bowler profile
		match.teamLineUp[1 - track][bowlerId].ballBowled++;
		match.teamLineUp[1 - track][bowlerId].dotGiven++;

		if (match.teamScoreboard[track].wicketFall + 1 == match.noOfPlayers) {
			// all out
			localStorage.setItem("match", JSON.stringify(match));
			loadScore();
			overCompletionCheck();
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
				overCompletionCheck();
			});
		}
	});
};