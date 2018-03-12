const fs = require("fs");
const path = require("path");

/*---------------------------
Walking through the directory tree recursively with an option to apply a filter
---------------------------*/
function recursiveReaddir (dir, filter) {
	fs.readdir(dir, (err, list) => {
		if (err){
			console.error(err);
			return;
		}
		list.forEach ((file) => {
			file = path.resolve(dir, file);
			fs.stat(file, (err, stat) => {
				if (err) {
					console.error(err);
					return;
				}
				if (stat.isDirectory()) {
					recursiveReaddir(path.resolve(dir, file), filter);
				} else {
					if (typeof filter === "function") {
						filter(file);	
					}
				}
			});
		});
	});
}

/*---------------------------
Matches a file extension and then looks for content using RegEx
---------------------------*/
function search (file) {
	if (path.extname(file) == ext) {
		fs.readFile(file, (err, content) => {
			if (err) {
				console.error(err);
				return;
			}
			if (regex.test(content)) {
				console.log(file);
			}
		});
	}
}

const ext = "."+process.argv[2]; //Gets user input
const phrase = process.argv[3]; //Gets user input
let regex = new RegExp ("\\b"+phrase+"\\b"); 	//if we want only the whole phrases. to allow partials use:
//let regex = new RegExp (phrase);
if (!ext || !phrase || process.argv[4]) { //make sure we got both values and only these values from the user
	console.error(`Please use the following format:
	node search.js <extension> <phrase>
Both arguments are required. No other arguments allowed.`);
} else {
	recursiveReaddir(__dirname, search);
}