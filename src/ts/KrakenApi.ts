import { TextWriter } from './TextWriter.js';

class KrakenApi{
	private socket: WebSocket;
	private socketUri: string = 'wss://beta-ws.kraken.com';
	private terminal: TextWriter;
	private jsonDestinationContainer: HTMLElement = undefined;
	private allowedCommands: Array<string> = ["ping", "subscribe", "unsubscribe", "addOrder", "cancelOrder"];

	constructor(writer: TextWriter, jsonDestinationId: string) {
		console.log('KrakenAPI instanciated');
		this.terminal = writer;
		this.jsonDestinationContainer = document.getElementById(jsonDestinationId);
	}

	private addEventsListener(self: KrakenApi): void {
		this.socket.addEventListener('open', function () {
			self.terminal.writeHtml('WebSockets connection opened');
			self.terminal.writeJson(`{
				"binaryType": "${self.socket.binaryType}",
				"bufferedAmount": "${self.socket.bufferedAmount}",
				"extensions ": "${self.socket.extensions}",
				"protocol": "${self.socket.protocol}",
				"readyState": "${self.socket.readyState}",
				"url": "${self.socket.url}"
			}`);
		});

		this.socket.addEventListener('message', function (event) {
			self.messageReceived(event.data);
		});

		this.socket.addEventListener('close', function () {
			self.terminal.writeHtml('WebSockets connection closed');
		});

		this.socket.addEventListener('error', function (event) {
			console.log('WebSocket Error:  ', event);
			self.terminal.writeHtml('WebSocket Error', 0);
			self.terminal.writeJson(event);
		});
	}

	private messageReceived(data: any) {
		console.log('Message from server: ', data);
		this.terminal.writeJson(data);
		this.addResult(data, 'server');
	}

	private sendMessage(message: string): void {
		if(!this.socket || this.socket.readyState != 1) {
			this.terminal.writeHtml('The socket is not open !', 0);
			return;
		}

		let command = {"event":message};
		let jsonMessage: string = JSON.stringify(command);
		this.terminal.writeHtml('Sending command...');
		this.addResult(jsonMessage, 'client');
		this.socket.send(jsonMessage);
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
			this.terminal.writeHtml("This command is invalid. But let's try it all the same...");
			this.sendMessage(command);
		}
		input.value = '';

	}

	public openSocket(): void {
		if(this.checkSocketOpen()) {
			this.terminal.writeHtml('The socket is already open you potato.');
		}
		else{
			this.terminal.writeHtml('Connecting to Kraken Websockets API...');
			this.socket = new WebSocket(this.socketUri);
			this.addEventsListener(this);
		}
		
	}

	public checkSocketOpen(): boolean {
		let socketState: boolean = false;
		if(this.socket && this.socket.readyState == 1)
			socketState = true;

		return socketState;
	}

	public closeSocket(): void {
		if(this.checkSocketOpen()) {
			this.terminal.writeHtml('Disconnecting...');
			this.socket.close();
		}
		else{
			this.terminal.writeHtml('The socket is not open !', 0);
		}
	}

	private addResult(text: string, sender: string) {
		text = JSON.parse(text);
		text = JSON.stringify(text, null, 2);

		this.jsonDestinationContainer.insertAdjacentHTML('afterbegin', '<pre onclick="this.classList.toggle(`open`);" class="result-' + sender + '">' + text + '</pre>');
	}
}

export { KrakenApi };