class KrakenApi {
    constructor(writer, jsonDestinationId) {
        this.socketUri = 'wss://beta-ws.kraken.com';
        this.jsonDestinationContainer = undefined;
        this.allowedCommands = ["ping", "subscribe", "unsubscribe"];
        console.log('KrakenAPI instanciated');
        this.terminal = writer;
        this.jsonDestinationContainer = document.getElementById(jsonDestinationId);
    }
    addEventsListener(self) {
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
    submitCommand(form) {
        let command = null;
        event.preventDefault();
        let input = form.querySelector('input[type="text"]');
        command = input.value;
        this.terminal.writeHtml(command);
        if (this.allowedCommands.indexOf(command) >= 0) {
            this.sendMessage(command);
        }
        else if (command == 'open' || command == 'connect') {
            this.openSocket();
        }
        else if (command == 'close' || command == 'disconnect') {
            this.closeSocket();
        }
        else {
            this.terminal.writeHtml("This command is invalid. But let's send it all the same...", 0);
            this.sendMessage(command);
        }
        input.value = '';
    }
    sendMessage(message) {
        if (!this.socket || this.socket.readyState != 1) {
            this.terminal.writeHtml('The socket is not open ! Try "open" or "connect" first.', 0);
            return;
        }
        let command = { "event": message };
        let jsonMessage = JSON.stringify(command);
        this.terminal.writeHtml('Sending command...');
        this.addResult(jsonMessage);
        this.socket.send(jsonMessage);
    }
    openSocket() {
        this.terminal.writeHtml('Connecting to Kraken Websockets API...');
        this.socket = new WebSocket(this.socketUri);
        this.addEventsListener(this);
    }
    checkSocketOpen() {
        let socketState = false;
        if (this.socket && this.socket.readyState == 1)
            socketState = true;
        else
            this.terminal.writeHtml('The socket is not open ! Try "open" or "connect" first.', 0);
        return socketState;
    }
    closeSocket() {
        if (this.checkSocketOpen()) {
            this.terminal.writeHtml('Disconnecting...');
            this.socket.close();
        }
    }
    addResult(text) {
        this.jsonDestinationContainer.insertAdjacentHTML('afterbegin', '<pre>' + text + '</pre>');
    }
}
export { KrakenApi };
