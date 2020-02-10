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
			self.terminal.write('WebSockets connection opened');
		});

		this.socket.addEventListener('message', function (event) {
			self.messageReceived(event.data);
		});

		this.socket.addEventListener('close', function () {
			self.terminal.write('WebSockets connection closed');
		});

		this.socket.addEventListener('error', function (event) {
			console.log('WebSocket Error:  ', event);
			self.terminal.write('WebSocket Error', 0);
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
			this.terminal.write('The socket is not open !', 0);
			return;
		}

		let command = {"event":message};
		let jsonMessage: string = JSON.stringify(command);
		this.terminal.write('Sending command...');
		this.addResult(jsonMessage, 'client');
		this.socket.send(jsonMessage);
	}

	public submitCommand(form: HTMLElement) {
		let command: string = null;
		event.preventDefault();
		let input = <HTMLInputElement>form.querySelector('input[type="text"]');
		command = input.value;
		this.terminal.write(command);

		if(this.allowedCommands.indexOf(command) >= 0) {
			this.sendMessage(command);
		}
		else if(command == 'open' || command == 'connect') {
			this.openSocket();
		}
		else if(command == 'close' || command == 'disconnect' || command == 'exit') {
			this.closeSocket();
		}
		else if(command == 'infos' || command == 'socketInfos') {
			this.terminal.writeJson(this.getConnectionInfos());
		}
		else {
			this.terminal.write("This command is invalid. But let's try it all the same...");
			this.sendMessage(command);
		}
		input.value = '';

	}

	public openSocket(): void {
		if(this.checkSocketOpen()) {
			this.terminal.write('The socket is already open you potato.');
		}
		else{
			this.terminal.write('Connecting to Kraken Websockets API...');
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
			this.terminal.write('Disconnecting...');
			this.socket.close();
		}
		else{
			this.terminal.write('The socket is not open !', 0);
		}
	}

	public getConnectionInfos(): string {
		let connectionInfos: string = `{"error": "Oops. Something bad happened :("}`;
		if(this.socket) {
			connectionInfos = `{
				"binaryType": "${this.socket.binaryType}",
				"bufferedAmount": "${this.socket.bufferedAmount}",
				"extensions ": "${this.socket.extensions}",
				"protocol": "${this.socket.protocol}",
				"readyState": "${this.socket.readyState}",
				"url": "${this.socket.url}"
			}`;
		}
		else {
			connectionInfos = `{"error": "The socket is undefined you potato. Did you open one ?"}`;
		}

		return connectionInfos;
	}

	private addResult(text: string, sender: string) {
		text = JSON.parse(text);
		text = JSON.stringify(text, null, 2);

		this.jsonDestinationContainer.insertAdjacentHTML('afterbegin', '<pre onclick="this.classList.toggle(`open`);" class="result-' + sender + '">' + text + '</pre>');
	}
}

export { KrakenApi };