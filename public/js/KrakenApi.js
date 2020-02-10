class KrakenApi {
    constructor(writer, jsonDestinationId) {
        this.socketUri = 'wss://beta-ws.kraken.com';
        this.jsonDestinationContainer = undefined;
        this.allowedCommands = ["ping", "subscribe", "unsubscribe", "addOrder", "cancelOrder"];
        console.log('KrakenAPI instanciated');
        this.terminal = writer;
        this.jsonDestinationContainer = document.getElementById(jsonDestinationId);
    }
    addEventsListener(self) {
        this.socket.addEventListener('open', function () {
            self.terminal.writeHtml('WebSockets connection opened');
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
    messageReceived(data) {
        console.log('Message from server: ', data);
        this.terminal.writeJson(data);
        this.addResult(data, 'server');
    }
    sendMessage(message) {
        if (!this.socket || this.socket.readyState != 1) {
            this.terminal.writeHtml('The socket is not open !', 0);
            return;
        }
        let command = { "event": message };
        let jsonMessage = JSON.stringify(command);
        this.terminal.writeHtml('Sending command...');
        this.addResult(jsonMessage, 'client');
        this.socket.send(jsonMessage);
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
            this.terminal.writeHtml("This command is invalid. But let's try it all the same...");
            this.sendMessage(command);
        }
        input.value = '';
    }
    openSocket() {
        if (this.checkSocketOpen()) {
            this.terminal.writeHtml('The socket is already open you potato.');
        }
        else {
            this.terminal.writeHtml('Connecting to Kraken Websockets API...');
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
            this.terminal.writeHtml('Disconnecting...');
            this.socket.close();
        }
        else {
            this.terminal.writeHtml('The socket is not open !', 0);
        }
    }
    addResult(text, sender) {
        text = JSON.parse(text);
        text = JSON.stringify(text, null, 2);
        this.jsonDestinationContainer.insertAdjacentHTML('afterbegin', '<pre onclick="this.classList.toggle(`open`);" class="result-' + sender + '">' + text + '</pre>');
    }
}
export { KrakenApi };
