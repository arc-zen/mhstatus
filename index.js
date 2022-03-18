#! /usr/bin/env node
// https://api.minehut.com/server/${args[0]}?byName=true
// >> https://api.bennydoesstuff.me/
// https://api.ashcon.app/mojang/v2/user/${n}
// https://playerdb.co/

import fetch from "node-fetch";
import chalk from "chalk";
import boxen from "boxen";
import config from "./config.js";
import clui from "clui";
import * as helper from "./helper.js";
import { credits } from "./credits.js";
// let goes here
let last_online = false;
let timed = false;
let short = false;
let connected_servers = new Array();
let connected_server_statuses = new Array();
let init_time = new String();
let desc = new String();
let cs /*, pl */ = new String();
const args = process.argv.slice(2);
const spinner = new clui.Spinner("", config.spinner_type[helper.random_integer(0, config.spinner_type.length - 1)]);
spinner.start();
spinner.message("retrieving data...");
if (args[0] == undefined || !args[0]) {
	console.log(chalk.red.bold("(mhstatus || mhs || mh) [server] [options]"));
	console.log(chalk.red.bold("\nOptions:"));
	console.log(chalk.cyan.bold(config.help_msg));
	process.exit();
} else if (args.includes("--debug") || args.includes("--d") || args.includes("-d") == true) {
	console.log("version: " + chalk.cyan.bold(config.version));
	console.log("args: " + chalk.cyan.bold(args.join(", ")));
	process.exit();
} else if (args.includes("credits") == true) {
	credits();
	process.exit();
} else if (args.includes("--spin2win") == true) {
	helper.syncSetTimeout(() => {
		spinner.stop();
		process.exit();
	}, 5000);
} else if ((args.includes("--time") || args.includes("-time") || args.includes("-t")) == true) {
	if (args[1] != undefined || args[1]) {
		timed = true;
		init_time = new Date().getTime();
	} else {
		console.log(chalk.red("-t requires a server argument"));
	}
} else if ((args.includes("--version") || args.includes("--v") || args.includes("-v")) == true) {
	console.log(chalk.cyan.bold(config.version));
	process.exit();
} else if ((args.includes("--short") || args.includes("--s") || args.includes("-s")) == true) {
	if (args[1] != undefined || args[1]) {
		short = true;
	} else {
		console.log(chalk.red("-s requires a server argument"));
	}
}
// --api goes here
if (args[0].includes("-") == true) {
	console.log(chalk.red("server argument cannot contain -"));
	console.log(chalk.grey.italic("did you just try to input an option as a server name?"));
	process.exit();
}
const resp = await fetch(`https://api.minehut.com/server/${args[0]}?byName=true`)
	.then((response) => response.json())
	.then(spinner.message("formatting data..."));
if (resp.ok == false) {
	console.error("Server not found");
}
if (resp.server.connectedServers.length != 0) {
	let i = 1;
	for (const s of resp.server.connectedServers) {
		const sresp = await fetch(`https://api.minehut.com/server/${s}`)
			.then((response) => response.json())
			.then(spinner.message(`retrieving connected servers, ${i}/${resp.server.connectedServers.length}`))
			.then(i++);
		const server = sresp.server.name;
		const server_status = sresp.server.online;
		connected_servers.push(server);
		if (server_status == true) connected_server_statuses.push("online");
		else connected_server_statuses.push(`offline (${helper.timeDifference(new Date().getTime(), sresp.server.last_online)})`);
	}
}
// pl goes here
if (timed == true) {
	if (resp.server.playerCount == 0) {
		console.log(chalk.red.bold("cannot time a server with no players"));
		process.exit();
	}
	console.log(chalk.cyan.bold(`entire process took ${new Date().getTime() - init_time}ms`));
	// api times goes here
}
const relative_creation_date = helper.timeDifference(new Date().getTime(), resp.server.creation);
if (!resp.server.maxPlayers) resp.server.maxPlayers = "0";
if (resp.server.online == false) {
	last_online = "(" + helper.timeDifference(new Date().getTime(), resp.server.last_online) + ")";
} else {
	last_online = " ";
}
if (resp.server.rawPlan != "") {
	resp.server.rawPlan = "(" + resp.server.rawPlan + ")";
}
const online = resp.server.online ? chalk.green.bold("online") : chalk.red.bold("offline");
const visibility = resp.server.visibility ? chalk.green.bold("public") : chalk.red.bold("private");
const credits_per_day = Math.ceil(resp.server.credits_per_day);
let categories = resp.server.categories.join(", ");
if (resp.server.connectedServers.length != 0) {
	for (let c = 0; c < connected_servers.length; c++) {
		if (connected_server_statuses[c] == "online") {
			cs += `${chalk.blue.bold(">>")} ${connected_servers[c]} - ${chalk.green.bold(connected_server_statuses[c])}`;
			if (c != connected_servers.length - 1) cs += "\n";
		} else if (connected_server_statuses[c] == "offline") {
			cs += `${chalk.red.bold(">>")} ${connected_servers[c]} - ${chalk.red.bold(connected_server_statuses[c])}\n`;
			if (c != connected_servers.length - 1) cs += "\n";
		}
	}
}
if (resp.server.connectedServers.length == 0) cs = "none";
if (resp.server.categories.length == 0) categories = "none";
// properties go here
if (short == false) {
	desc = `
${online} ${chalk.grey.bold(last_online)}
${chalk.cyan.bold(resp.server.playerCount + "/" + resp.server.maxPlayers + " players")}

created on: ${chalk.blue.bold(new Date(resp.server.creation).toUTCString())}
${chalk.blue.bold(">>")} ${relative_creation_date}
server type: ${chalk.blue.bold(resp.server.server_version_type)}
server plan: ${chalk.blue.bold(resp.server.activeServerPlan)} ${chalk.cyan.bold(resp.server.rawPlan)}
categories: ${chalk.blue.bold(categories)}
credit cost: ${chalk.blue.bold(credits_per_day)} credits per day
connected servers: 
${cs}
`;
} else {
	desc = `
${online} ${chalk.grey.bold(last_online)}
${chalk.cyan.bold(resp.server.playerCount + "/" + resp.server.maxPlayers + " players")}
`;
}
spinner.stop();
console.log(
	boxen(desc, {
		title: `${chalk.cyan(resp.server.name_lower + ".minehut.gg")}`,
		titleAlignment: "left",
		borderStyle: "round",
	})
);
// pl:
// if (resp.server.playerCount !== 0) {
// 	if (api == "playerdb") {
// 		var spinner = new clui.Spinner("", ["◜", "◠", "◝", "◞", "◡", "◟"]);
// 		if (timed == false) spinner.start();
// 		for (const n of resp.server.players) {
// 			const nr = await fetch(`https://playerdb.co/api/player/minecraft/${n}`)
// 				.then((response) => response.json())
// 				.then(i++);
// 			if (nr.error == true) {
// 				pl = pl + "(bedrock player)";
// 			}
// 			const username = nr.data.player.username;
// 			if (i == 1) pl = username + "\n";
// 			else pl = pl + username + "\n";
// 			if (timed == true) {
// 				let time = new Date().getTime() - init_time;
// 				console.log(chalk[helper.random_chalk_color()].bold(`api call #${i} took ${time / 1000}s (${time}ms)`));
// 				a.push(time);
// 			}
// 			if (i == resp.server.playerCount && timed == false) {
// 				spinner.stop();
// 			}
// 		}
// 	} // else if (api == "ashcon") {
// 	// 	if (args.some((e) => regex.test(e)) == false) console.log(chalk.magenta.bold("using api ashcon"));
// 	// 	for (const n of resp.server.players) {
// 	// 		const onlineplayers = await fetch(`https://api.ashcon.app/mojang/v2/user/${n}`)
// 	// 			.then((response) => response.json())
// 	// 			.then(i++);
// 	// 		var username = onlineplayers.username;
// 	// 		if (onlineplayers.error == true) {
// 	// 			pl = pl + "(BEDROCK PLAYER)" + "\n";
// 	// 			bedrock = false;
// 	// 		} else pl = pl + username.replace(".", "(BEDROCK) ") + "\n";
// 	// 		if (timed == true) {
// 	// 			let now_time = new Date().getTime();
// 	// 			let time = now_time - init_time;
// 	// 			console.log(chalk[helper.random_chalk_color()].bold(`api call #${i} took ${time / 1000}s (${time}ms)`));
// 	// 			a.push(time);
// 	// 		}
// 	// 	}
// 	// }
// } else {
// 	pl = pl + "none lmfao";
// }

// properties
// const whitelist_status = resp.server["white-list"] ? chalk.green.bold("is whitelisted") : chalk.red.bold("is not whitelisted");
// const hardcore = resp.server.server_properties.hardcore ? chalk.bgRed("is hardcore") : chalk.red.bold("is not hardcore");
// const border = resp.server.server_properties["max-world-size"];
// const tick_speed = resp.server.server_properties["max-tick-time"];
// const world_name = resp.server.server_properties["level-name"];
// const spawn_game_mode = resp.server.server_properties.gamemode;

// --api
//} else if ((args.includes("--api") || args.includes("-api")) == true) {
// 	api = args[args.findIndex((value) => /-?-api/.test(value)) + 1];
// 	if (api == undefined || (api !== "ashcon" && api !== "playerdb")) {
// 		console.log(chalk.red("ashcon, playerdb (default, faster sometimes)"));
// 		process.exit();
// 	}
// }

// let
// let a = new Array();
// let api = "playerdb";
// let i = new Number();

// api times
// console.log(chalk.magenta.bold(`uuid to username api calls (total) took: ${a.reduce((previousValue, currentValue) => previousValue + currentValue, 0)}ms`));
// console.log(chalk.green.bold(`${i} api calls`));
