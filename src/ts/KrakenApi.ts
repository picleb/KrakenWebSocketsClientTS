import { TextWriter } from './TextWriter.js';

class KrakenApi{
	private socket: WebSocket;						// The WebSocket element
	private socketUri: string = 'wss://beta-ws.kraken.com';	//URI Address to connect to
	private terminal: TextWriter;					//The TypeWriter class. Used like a console.log in this project
	private jsonDestinationContainer: HTMLElement;	//The HTMLElement in which we write any message sent or received
	private allowedCommands: Array<string> = [		//List of allowed commands by the server
		'ping', 'subscribe', 'unsubscribe', 'addOrder', 'cancelOrder'
	];

	/**
	 * KrakenApi's constructor. We set the TextWriter and the messages container
	 *
	 * @remarks
	 * You can use this function to write any kind of content. All chars are going to be wrapped in a <span>
	 *
	 * @param text - A string or array of strings to write in the page
	 * @param animationMultiplier - Allows yo to speed up or slow down the speed of the animation
	 * @returns a Promise
	 */
	constructor(writer: TextWriter, jsonDestinationId: string) {
		this.terminal = writer;
		this.jsonDestinationContainer = document.getElementById(jsonDestinationId);
	}

	/**
	 * Register the eventListeners for any event liked to the WebSocket
	 *
	 * @param self - The KrakenApi instance
	 */
	private addEventsListener(self: KrakenApi): void {
		this.socket.addEventListener('open', () => {
			self.terminal.write('WebSockets connection opened');
		});

		this.socket.addEventListener('message', event => {
			self.messageReceived(event.data);
		});

		this.socket.addEventListener('close', () => {
			self.terminal.write('WebSockets connection closed');
		});

		this.socket.addEventListener('error', event => {
			console.log('WebSocket Error:  ', event);
			self.terminal.write('WebSocket Error', 0);
			self.terminal.writeJson(event);
		});
	}

	/**
	 * Called when a message is received, will write the data in
	 * the terminal and JSon container in the html page
	 *
	 * @param data - the event.data received from the server
	 */
	private messageReceived(data: any): void {
		this.terminal.writeJson(data);
		this.addResult(data, 'server');
	}

	/**
	 * Insert message in a JSON element and send it through the socket
	 *
	 * @param message - The command typed by the user
	 */
	private sendMessage(message: string): void {
		if(!this.socket || this.socket.readyState != 1) {
			this.terminal.write('The socket is not open !', 0);
			return;
		}

		const command = {event:message};
		const jsonMessage: string = JSON.stringify(command);
		this.terminal.write('Sending command...');
		this.addResult(jsonMessage, 'client');
		this.socket.send(jsonMessage);
	}

	/**
	 * Called when the form containing the input command written by the user
	 * is submitted. We check the vailidity of the command and take action
	 *
	 * @param form - The HTML form submited by the user
	 */
	public submitCommand(form: HTMLElement): void {
		event.preventDefault();
		const input = <HTMLInputElement>form.querySelector('input[type="text"]');
		const command: string = input.value;

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
			this.terminal.write('This command is invalid. But let\'s try it all the same...');
			this.sendMessage(command);
		}

		input.value = '';
	}

	/**
	 * Open the socket connection
	 */
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

	/**
	 * Check if the socket is open
	 *
	 * @remarks
	 * Will only tell you if the socket is open (readyState == 1) or not (all other case)
	 *
	 * @returns true if the socket is open, false otherwise
	 */
	public checkSocketOpen(): boolean {
		let socketState: boolean = false;
		if(this.socket && this.socket.readyState == 1)
			socketState = true;

		return socketState;
	}

	/**
	 * Close the socket if there is one opened
	 */
	public closeSocket(): void {
		if(this.checkSocketOpen()) {
			this.terminal.write('Disconnecting...');
			this.socket.close();
		}
		else{
			this.terminal.write('The socket is not open !', 0);
		}
	}

	/**
	 * Gives various informations about the socket connection
	 *
	 * @returns a JSON formatted string containing the attributs of the socket element
	 */
	public getConnectionInfos(): string {
		let connectionInfos: string = '{"error": "Oops. Something bad happened :("}';
		if(this.socket) {
			connectionInfos = `{
				"binaryType": "${this.socket.binaryType}",
				"bufferedAmount": "${this.socket.bufferedAmount}",
				"extensions": "${this.socket.extensions}",
				"protocol": "${this.socket.protocol}",
				"readyState": "${this.socket.readyState}",
				"url": "${this.socket.url}"
			}`;
		}
		else {
			connectionInfos = '{"error": "The socket is undefined you potato. Did you open one ?"}';
		}

		return connectionInfos;
	}

	/**
	 * Write the result of a command sent or a message received in the HTML page
	 *
	 * @param text - A JSON string to write
	 * @param sender - "client" or "server" according to whom the message is from
	 */
	private addResult(text: string, sender: string): void {
		let toWrite = JSON.parse(text);
		toWrite = JSON.stringify(toWrite, null, 2);

		this.jsonDestinationContainer.insertAdjacentHTML('afterbegin', `<pre onclick="this.classList.toggle('open');" class="result-${sender}">${toWrite}</pre>`);
	}
}

export { KrakenApi };