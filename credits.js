import figlet from "figlet";
function credits() {
	console.log(`
	${figlet.textSync("mhstatus")}

	tools used:
	- node.js + npm
	- node-fetch
	- chalk + gradient-string
	- boxen
	- figlet
    - fs

	- stackoverflow

	apis used:
	- https://api.bennydoesstuff.me/
	- https://playerdb.co/
	- https://api.ashcon.app/mojang/v2/user/

	contributors (indirectly and directly):
	- arczen#7561
	- fearofawhackplanet 
    > (https://stackoverflow.com/users/207752/fearofawhackplanet, answered a stack overflow question on approximate time differences)
    >> https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time/6109105#6109105
    
	thanks a bunch for using my (terribly written) tool!
	made with love by arczen#7561
	`)
	);
}
export { credits };
