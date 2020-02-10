# Kraken WebSockets beta API client in TypeScript
A simple interface to connect to a WebSocket in the broswer and send basic commands without server authentication.

Just for fun and learning purposes.

You can see it in action [on the project's GitHub page](https://picleb.github.io/KrakenWebSocketsClientTS/public).

## Technologies used
- NPM as package manager
- Grunt as task runner
- TypeScript as JavaScript superset
- Sass as CSS pre-processor
- WebSockets API as HTML5 feature

## Developer's informations
Run `npm install` to install development dependencies
Run `grunt dev` to launch grunt with the watch task
Run `grunt prod` to build assets for production use (minify CSS and JS) - You'll have to edit the index.html file as the .min files are not linked in there.

TypeScript documentation: https://www.typescriptlang.org/docs/home.html
Kraken WebSockets API documentation: https://docs.kraken.com/websockets-beta
MDN documentation for the WebSocket Web API: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
