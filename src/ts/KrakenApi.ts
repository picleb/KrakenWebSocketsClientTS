import { TextWriter } from './TextWriter.js';

class KrakenApi{
	private socket: WebSocket;
	private socketUri: string = 'wss://beta-ws.kraken.com';
	private terminal: TextWriter;
	private jsonDestinationContainer: HTMLElement = undefined;
	private allowedCommands: Array<string> = ["ping", "subscribe", "unsubscribe"];

	constructor(writer: TextWriter, jsonDestinationId: string) {
		console.log('KrakenAPI instanciated');
		this.terminal = writer;
		this.jsonDestinationContainer = document.getElementById(jsonDestinationId);
	}

	private addEventsListener(self: KrakenApi): void {
		this.socket.addEventListener('open', function () {
			self.terminal.writeHtml('WebSockets connection opened');
		});

		this.socket.addEventListener('message', function (event) {
			console.log('Message from server ', event.data);
			self.terminal.writeJson(event.data);
			self.addResult(event.data);
		});

		this.socket.addEventListener('close', function () {
			self.terminal.writeHtml('WebSockets connection closed');
		});

		this.socket.addEventListener('error', function (event) {
			console.log('WebSocket Error:  ', event);
		});
	}

	public submitCommand(form: HTMLElement) {
		let command: string = null;
		event.preventDefault();
		let input = <HTMLInputElement>form.querySelector('input[type="text"]');
		command = input.value;
		this.terminal.writeHtml(command);

		if(this.allowedCommands.indexOf(command) >= 0) {
			this.sendMessage(command);
		}
		else if(command == 'open' || command == 'connect') {
			this.openSocket();
		}
		else if(command == 'close' || command == 'disconnect') {
			this.closeSocket();
		}
		else {
			this.terminal.writeHtml("This command is invalid. But let's send it all the same...", 0);
			this.sendMessage(command);
		}
		input.value = '';

	}

	private sendMessage(message: string) {
		if(!this.socket || this.socket.readyState != 1) {
			this.terminal.writeHtml('The socket is not open ! Try "open" or "connect" first.', 0);
			return;
		}

		let command = {"event":message};
		let jsonMessage = JSON.stringify(command);
		this.terminal.writeHtml('Sending command...');
		this.addResult(jsonMessage);
		this.socket.send(jsonMessage);
	}

	public openSocket() {
		this.terminal.writeHtml('Connecting to Kraken Websockets API...');
		this.socket = new WebSocket(this.socketUri);
		this.addEventsListener(this);
	}

	public checkSocketOpen(): boolean {
		let socketState: boolean = false;
		if(this.socket && this.socket.readyState == 1)
			socketState = true;
		else
			this.terminal.writeHtml('The socket is not open ! Try "open" or "connect" first.', 0);
		return socketState;
	}

	public closeSocket(): void {
		if(this.checkSocketOpen()) {
			this.terminal.writeHtml('Disconnecting...');
			this.socket.close();
		}
	}

	private addResult(text: string) {
		this.jsonDestinationContainer.insertAdjacentHTML('afterbegin', '<pre>' + text + '</pre>');
	}
}

export { KrakenApi };