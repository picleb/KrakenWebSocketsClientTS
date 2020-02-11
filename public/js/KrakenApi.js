class KrakenApi {
    constructor(writer, jsonDestinationId) {
        this.socketUri = 'wss://beta-ws.kraken.com';
        this.allowedCommands = [
            'ping', 'subscribe', 'unsubscribe', 'addOrder', 'cancelOrder'
        ];
        this.terminal = writer;
        this.jsonDestinationContainer = document.getElementById(jsonDestinationId);
    }
    addEventsListener(self) {
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
    messageReceived(data) {
        this.terminal.writeJson(data);
        this.addResult(data, 'server');
    }
    sendMessage(message) {
        if (!this.socket || this.socket.readyState != 1) {
            this.terminal.write('The socket is not open !', 0);
            return;
        }
        const command = { event: message };
        const jsonMessage = JSON.stringify(command);
        this.terminal.write('Sending command...');
        this.addResult(jsonMessage, 'client');
        this.socket.send(jsonMessage);
    }
    submitCommand(form) {
        event.preventDefault();
        const input = form.querySelector('input[type="text"]');
        const command = input.value;
        this.terminal.write(command);
        if (this.allowedCommands.indexOf(command) >= 0) {
            this.sendMessage(command);
        }
        else if (command == 'open' || command == 'connect') {
            this.openSocket();
        }
        else if (command == 'close' || command == 'disconnect' || command == 'exit') {
            this.closeSocket();
        }
        else if (command == 'infos' || command == 'socketInfos') {
            this.terminal.writeJson(this.getConnectionInfos());
        }
        else {
            this.terminal.write('This command is invalid. But let\'s try it all the same...');
            this.sendMessage(command);
        }
        input.value = '';
    }
    openSocket() {
        if (this.checkSocketOpen()) {
            this.terminal.write('The socket is already open you potato.');
        }
        else {
            this.terminal.write('Connecting to Kraken Websockets API...');
            this.socket = new WebSocket(this.socketUri);
            this.addEventsListener(this);
        }
    }
    checkSocketOpen() {
        let socketState = false;
        if (this.socket && this.socket.readyState == 1)
            socketState = true;
        return socketState;
    }
    closeSocket() {
        if (this.checkSocketOpen()) {
            this.terminal.write('Disconnecting...');
            this.socket.close();
        }
        else {
            this.terminal.write('The socket is not open !', 0);
        }
    }
    getConnectionInfos() {
        let connectionInfos = '{"error": "Oops. Something bad happened :("}';
        if (this.socket) {
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
    addResult(text, sender) {
        let toWrite = JSON.parse(text);
        toWrite = JSON.stringify(toWrite, null, 2);
        this.jsonDestinationContainer.insertAdjacentHTML('afterbegin', `<pre onclick="this.classList.toggle('open');" class="result-${sender}">${toWrite}</pre>`);
    }
}
export { KrakenApi };
