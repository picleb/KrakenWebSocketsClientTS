import { TextWriter } from './TextWriter.js';
import { KrakenApi } from './KrakenApi.js';

let terminal: TextWriter = null;
let kraken: KrakenApi = null;

function initialize(): void{
	terminal = new TextWriter(`terminal-text-container`);

	document.getElementById('terminal-form-command').addEventListener('submit', submitCommand);
}

function submitCommand(event): void {
	event.preventDefault();

	let input = event.srcElement.querySelector('input[type="text"]');

	if(kraken) {
		kraken.submitCommand(event.srcElement);
	}
	else if((input.value == 'hello' || input.value == 'Hello')) {
		kraken = new KrakenApi(terminal, 'websockets-results-container');
		terminal.writeHtml([
			`Hello there ! It's a pleasure to meet you ! Let's get down to business...`,
			`Kraken being a financial service, the public requests are pretty limited (even for public data, like OHLC data) so without authentication, we won't go too far. But the point is not to go crazy here. Just connect to a server, send a message and get a reply. And write some code. About that, you can check the code on the GitHub repository. If you want to go further, you have a small code base that should be easy to understand.`,
			`Made with TypeScript, Sass and HTML5, by Picleb, with love ❤️`,
			`Type a valid command to continue. Ex: "connect" to connect to the server.`
		]);
		input.value = '';
	}
}

window.onload = function() {
	initialize();
};


