function id2tag(id) {
	id = id * 1
	var tagChar = ["0", "2", "8", "9", "P", "Y", "L", "Q", "G", "R", "J", "C", "U", "V"]

	var hashtag = []

	while (id > 0) {
		hashtag.unshift(tagChar[id % tagChar.length])
		id = Math.floor(id / tagChar.length)
	}

	return "#" + hashtag.join("")
}

function tag2id(hashtag) {
	var tagChar = ["0", "2", "8", "9", "P", "Y", "L", "Q", "G", "R", "J", "C", "U", "V"]


	var tagArray = hashtag.toUpperCase().split("")
	if (tagArray[0] == "#") {
		tagArray.shift()
	}
	var id = 0
	for (var i = 0; i < tagArray.length; i++) {
		var character = tagArray[i]
		var charIndex = tagChar.indexOf(character)
		if (charIndex == -1) {
			console.error(`Invalid Tag! Tags can only contain the following characters: ${tagChar.join(", ")}`);
			process.exit(1)
		}
		id *= tagChar.length
		id += charIndex
	}
	return id
}


function hl2id(hl) {
	if (typeof hl == "string") {
		hl2idl = hl.split("-")
	}
	var id = 0;
	id += parseInt(hl[0])
	id += Math.floor(hl[1] * 256) // << 8

	return id;
}

function id2hl(hashtag) {
	var id;
	if (typeof hashtag == "string") {
		id = tag2id(hashtag)
	} else {
		id = hashtag
	}
	var highLow = []
	highLow[0] = (id % 256)
	highLow[1] = ((id - highLow[0]) >> 8)

	return highLow
}

// everything below this is a wrapper for the above functions
// if you want to use this with your own code there's no need for anything below this line
// also READ THE LICENSE

console.log("")
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var isInt = false; // `INT` stands for `INTeractive`, obviously
if (process.argv[2]) {
	doThings(process.argv[2], process.argv[3])
} else {
	process.stdout.write("Syntax: <type> <input>\n> ")
	isInt = true
	rl.on('line', (input) => {
		doThings(...input.split(" "))
		process.stdout.write("> ")
	});
}

function doThings(type, input) {
	// Uncomment for timer
	// var s = new Date().getTime();
	switch (type) {
		case "tag":case "tag2id":case "tag2hl":
			if (!input) {
				console.error("No tag specified!")
				if (!isInt) {
					process.exit()
				} else {
					return;
				}
			}
			var gid = tag2id(input)
			console.log("ID:    " + gid)
			console.log("HL ID: " + id2hl(gid).join("-"))
			break;
		case "hl":case "hl2id":case "hl2tag":
			if (!input) {
				console.error("No HL ID specified!")
				if (!isInt) {
					process.exit()
				} else {
					return;
				}
			}
			var gid = hl2id(input.split("-"))
			console.log("Tag:    " + id2tag(gid))
			console.log("ID:     " + gid)
			break;
		case "id":case "id2hl":case "id2tag":
			if (!input) {
				console.error("No HL ID specified!")
				if (!isInt) {
					process.exit()
				} else {
					return;
				}
			}
			console.log("Tag:    " + id2tag(parseInt(input)))
			console.log("HL ID:  " + id2hl(parseInt(input)).join("-"))
			break;
		case "help":
			console.log("Usage: `node tag_id_tool <type> <tag/id>`\nValid input types: hl/id/tag\nExample: `node tag_id_tool tag #2pp`\nTag-ID tool also supports stdin")
			return;
		case "exit":
			process.exit();
			return;
		case "":
			return;
		default:
			console.log("Usage: `node tag-id-tool <args> <tag/id>`\nValid args: hl/id/tag")
			return;
	}
	// Uncomment for timer
	// console.log("Took",new Date().getTime() - s,"ms")
}
