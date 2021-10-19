let noBallModal = () => {
	// init
	document.querySelector("#runsTaken_nb").value = 0;
	document.querySelector("#nb_runs_from_div").classList.add("d-none");
	document.querySelector("#isRunOut").checked = false;
	document.querySelector("#nb_who_got_out_div").classList.add("d-none");
	document.querySelector("#nb_on_which_end_div").classList.add("d-none");
	document.querySelector("#nb_run_out_by").classList.add("d-none");

	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;
	new bootstrap.Modal(document.querySelector("#no-ball")).show();
	document
		.querySelector("#runsTaken_nb")
		.addEventListener("change", function () {
			if (this.value > 0) {
				document.querySelector("#nb_runs_from_div").classList.remove("d-none");
			} else {
				document.querySelector("#nb_runs_from_div").classList.add("d-none");
			}
		});

	document.querySelector("#isRunOut").addEventListener("change", function () {
		if (this.checked) {
			document.querySelector("#nb_who_got_out_div").classList.remove("d-none");
			document.querySelector("#nb_on_which_end_div").classList.remove("d-none");
			document.querySelector("#nb_run_out_by").classList.remove("d-none");

			let elevenOption = "";
			elevenOption += `<option value="${match.onStrikeBatsman}">${match.onStrikeBatsman}</option>`;
			elevenOption += `<option value="${match.nonStrikeBatsman}">${match.nonStrikeBatsman}</option>`;
			document.querySelector("#whoGotOutOption_nb").innerHTML = elevenOption;

			elevenOption = "";
			match.teamLineUp[1 - track].forEach((e) => {
				elevenOption += `<option value="${e.name}">${e.name}</option>`;
			});
			document.querySelector("#runOutByOption_nb").innerHTML = elevenOption;
		} else {
			document.querySelector("#nb_who_got_out_div").classList.add("d-none");
			document.querySelector("#nb_on_which_end_div").classList.add("d-none");
			document.querySelector("#nb_run_out_by").classList.add("d-none");
		}
	});
};

let noBall = () => {
	let match = JSON.parse(localStorage.getItem("match"));
	let track = match.batting == match.teams[0] ? 0 : 1;

	let runTaken = parseInt(document.querySelector("#runsTaken_nb").value);
	let runFrom = document.querySelector("#runsFrom_nb").value;

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

		match.lastBatsman = document.querySelector("#whoGotOutOption_nb").value;
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
					if (document.querySelector("#onWhichEnd_nb").value == "bowlerEnd") {
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
					if (document.querySelector("#onWhichEnd_nb").value == "keeperEnd") {
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
