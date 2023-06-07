function fillValues(array, coords){
	let xy1 = coords[0];
	let xy2 = coords[1];
	for (let y = xy1[1]; y <= xy2[1]; y++){
		for (let x = xy1[0]; x <= xy2[0]; x++){
			array[x][y] = true;
		}
	}
	return array;
}

function closestValue(value, list){
	list.sort((a,b) => -(value-a)-(value-b))
	return list[0];
}

const clockChars = {
	EN: [
		["I","T","L","I","S","A","S","T","H","P","M","A"],
		["A","C","F","I","F","T","E","E","N","D","C","O"],
		["T","W","E","N","T","Y","F","I","V","E","X","W"],
		["T","H","I","R","T","Y","F","T","E","N","O","S"],
		["M","I","N","U","T","E","S","E","T","O","U","R"],
		["P","A","S","T","O","R","U","F","O","U","R","T"],
		["S","E","V","E","N","X","T","W","E","L","V","E"],
		["N","I","N","E","F","I","V","E","C","T","W","O"],
		["E","I","G","H","T","F","E","L","E","V","E","N"],
		["S","I","X","T","H","R","E","E","O","N","E","G"],
		["T","E","N","S","E","Z","O'","C","L","O","C","K"]
	],
	DE: [
		["E","S","K","I","S","T","L","F","Ü","N","F"],
		["Z","E","H","N","Z","W","A","N","Z","I","G"],
		["D","R","E","I","V","I","E","R","T","E","L"],
		["T","G","N","A","C","H","V","O","R","J","M"],
		["H","A","L","B","Q","Z","W","Ö","L","F","P"],
		["Z","W","E","I","N","S","I","E","B","E","N"],
		["K","D","R","E","I","R","H","F","Ü","N","F"],
		["E","L","F","N","E","U","N","V","I","E","R"],
		["W","A","C","H","T","Z","E","H","N","R","S"],
		["B","S","E","C","H","S","F","M","U","H","R"]
	]
}

const getActivated = {
	EN: function (hours, minutes){
		// Empty array (11,12)
		let activated = Array.from({length: 11}, _ => new Array(12).fill(false));
		let values = {
			"it": [[0,0],[0,1]],
			"is": [[0,3],[0,4]],
			"minutes": [[4,0],[4,6]],
			"to": [[4,8],[4,9]],
			"past": [[5,0],[5,3]],
			"oclock": [[10,6],[10,11]],

			"pre_5": [[2,6],[2,9]],
			"pre_10": [[3,7],[3,9]],
			"pre_15": [[1,2],[1,8]],
			"pre_20": [[2,0],[2,5]],
			"pre_30": [[3,0],[3,5]],

			"suf_1": [[9,8],[9,10]],
			"suf_2": [[7,9],[7,11]],
			"suf_3": [[9,3],[9,7]],
			"suf_4": [[5,7],[5,10]],
			"suf_5": [[7,4],[7,7]],
			"suf_6": [[9,0],[9,2]],
			"suf_7": [[6,0],[6,4]],
			"suf_8": [[8,0],[8,4]],
			"suf_9": [[7,0],[7,3]],
			"suf_10": [[10,0],[10,2]],
			"suf_11": [[8,6],[8,11]],
			"suf_12": [[6,6],[6,11]]
		};

		activated = fillValues(activated, values.it);
		activated = fillValues(activated, values.is);
		activated = fillValues(activated, values.oclock);

		// Minutes (rounded to nearest multiple of 5)
		minutes = closestValue(minutes, [0, 5, 10, 15, 20, 30, 40, 45, 50, 55])
		if (minutes){
			activated = fillValues(activated, values.minutes);

			let past = minutes <= 30;
			if (!past){
				minutes = 60 - minutes;
				hours += 1;
			}

			activated = fillValues(activated, past ? values.past : values.to);
			activated = fillValues(activated, values[`pre_${minutes}`]);
		}

		// Hour
		hours %= 12;
		if (hours == 0) hours = 12;
		activated = fillValues(activated, values[`suf_${hours}`])

		return activated;
	},
	DE: function (hours, minutes){
		// Empty array (10,11)
		let activated = Array.from({length: 10}, _ => new Array(11).fill(false));
		let values = {
			"es": [[0,0],[0,1]],
			"ist": [[0,3],[0,5]],
			"vor": [[3,6],[3,8]],
			"nach": [[3,2],[3,5]],
			"halb": [[4,0],[4,3]],
			"uhr": [[9,8],[9,10]],

			"pre_5": [[0,7],[0,10]],
			"pre_10": [[1,0],[1,3]],
			"pre_15": [[2,4],[2,10]],
			"pre_20": [[1,4],[1,10]],

			"suf_1": [[5,2],[5,4]],
			"suf_1_1": [[5,2],[5,5]],
			"suf_2": [[5,0],[5,3]],
			"suf_3": [[6,1],[6,4]],
			"suf_4": [[7,7],[7,10]],
			"suf_5": [[6,7],[6,10]],
			"suf_6": [[9,1],[9,5]],
			"suf_7": [[5,5],[5,10]],
			"suf_8": [[9,1],[9,4]],
			"suf_9": [[7,3],[7,6]],
			"suf_10": [[8,5],[8,8]],
			"suf_11": [[7,0],[7,2]],
			"suf_12": [[4,5],[4,9]]
		};

		activated = fillValues(activated, values.es);
		activated = fillValues(activated, values.ist);

		// Minutes (rounded to nearest multiple of 5)
		minutes = closestValue(minutes, [0, 5, 10, 15, 20, 30, 40, 45, 50, 55]);
		if (minutes){
			if (minutes < 30){
				activated = fillValues(activated, values.nach);
				activated = fillValues(activated, values[`pre_${minutes}`]);
			} else if (minutes == 30){
				activated = fillValues(activated, values.halb);
				hours -= 1;
			} else if (minutes > 30){
				activated = fillValues(activated, values.vor);
				minutes = 60 - minutes;
				hours += 1;
				activated = fillValues(activated, values[`pre_${minutes}`]);
			}
		} else {
			activated = fillValues(activated, values.uhr);
		}

		// Hour
		hours %= 12;
		if (hours == 0) hours = 12;

		// "Es ist Fünf nach eins", not "Es ist Fünf nach ein"
		if (hours != 1) activated = fillValues(activated, values[`suf_${hours}`])
		else activated = fillValues(activated, values[`suf_1_1`])

		return activated;
	}
}

let width;
let height;
let currentChars;

function initialize(language, settings){

	currentChars = clockChars[language];
	height = currentChars.length;
	width = currentChars[0].length;

	let clockTable = document.getElementById("clock");
	clockTable.style.gridTemplateRows = `repeat(${height}, ${100/height}%)`;
	clockTable.style.gridTemplateColumns = `repeat(${width}, ${100/width}%)`;
	
	for (let y = 0; y < height; y++){
		for (let x = 0; x < width; x++){
			
			let cell = document.createElement("div");
			cell.classList.add("cell");
			cell.classList.add("inactive");
			cell.id = `${y}_${x}`;
			cell.innerHTML = `<span>${currentChars[y][x]}</span>`;

			cell.style.gridArea = `${y+1} / ${x+1} / ${y+1} / ${x+1}`;
			
			if (settings.clockAlwaysSquare) cell.style.aspectRatio = `${height} / ${width}`;

			clockTable.appendChild(cell);
			
		}
	}

}

function update(language){
	let func = getActivated[language];
	let date = new Date();
	let activated = func(date.getHours(), date.getMinutes());
	for (let y = 0; y < activated.length; y++){
		for (let x = 0; x < activated[0].length; x++){

			let cell = activated[y][x];
			let cellElement = document.getElementById(`${y}_${x}`);
			cellElement.classList.remove("active");
			cellElement.classList.remove("inactive");

			cellElement.classList.add(cell ? "active" : "inactive")

		}
	}
}

function updateResize(){
	let clockTable = document.getElementById("clock");
	clockTable.style.fontSize = `${clockTable.clientHeight/height*0.65}px`;
}

let param = new URLSearchParams(window.location.search).get("language");
if (!param){
	window.location.search += "?language=DE";
}

const language = param || "DE";

initialize(language, {
	clockAlwaysSquare: true
});

window.addEventListener("resize", updateResize);
updateResize();

update(language);
setInterval(() => { update(language); }, 1000/2);
