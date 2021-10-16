// Possible events on a wide ball
// 1. simply a wide ball
// 2. bye runs due to missfield or boundary
// 3. batsman is stumped out, hit wicket
// 4. run out with or without runs

// Wide ball + stumped + hit-wicket
let wideAndWicket = () => {
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
	match.teamLineUp[track][batsmanId].gotOut = true;

	// bowler profile
	match.teamLineUp[1 - track][bowlerId].wideGiven++;
	match.teamLineUp[1 - track][bowlerId].wicketTaken++;

	match.lastBatsman = match.onStrikeBatsman;

	let whichOut;
	for (const rb of document.querySelectorAll('input[name="ww_rb"]')) {
		if (rb.checked) {
			whichOut = rb.value;
			break;
		}
	}
	console.log("whichOut:", whichOut);

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

// Wide ball + byes and/or run out
