export default {
	version: "0.0.2 March 10 2022",
	spinner_type: [
		["◜", "◠", "◝", "◞", "◡", "◟"],
		["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"],
		["=----", "-=---", "--=--", "---=-", "----="],
		["=----", "-=---", "--=--", "---=-", "----=", "---=-", "--=--", "-=---", "=----"],
		["▁", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃"],
		["┤", "┘", "┴", "└", "├", "┌", "┬", "┐"],
	],
	help_msg: `
	--credits || --c 
	> displays credits

	--time || --t
	> times and displays the time used to call apis, etc.

	--version || --v
	> displays version
	
	--short || --s
	> shows more vital information; omitting lesser needed ones

	// --api
	// > specifies which api to translate uuids to usernames with
	// see below
	3/14/2022 - Unaware if this has affected earlier dates:
	somehow, somebody did something to the minehut api and now half the data from the api is not valid or is gone.
	gone, as in those keys and values don't exist anymore
	for now, i've rolled out a patch that cuts off these values, but it is significantly shorter.
	the biggest change? probably the fact that you can't read player names anymore.
	sorry for this!
	`,
};
