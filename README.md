# Kraken WebSockets beta API client in TypeScript
A simple interface to connect to a WebSocket in the broswer and send basic commands without server authentication.

Just for fun and learning purposes.

You can see it in action [on the project's GitHub page](https://picleb.github.io/KrakenWebSocketsClientTS/public).

## Technologies used
- NPM as package manager
- Grunt as task runner
- TypeScript as JavaScript superset
- Sass as CSS pre-processor
- Webpack for handling JavaScript's uglifying.
- WebSockets API as HTML5 feature

## Developer's informations
Run `npm install` to install development dependencies
Run `grunt dev` to launch grunt with the watch task (watch for TypeScript and Sass changes)
Run `grunt prod` to build assets for production use (and minify CSS)
Run `npx webpack` to build JavaScript for production

TypeScript documentation: https://www.typescriptlang.org/docs/home.html
Kraken WebSockets API documentation: https://docs.kraken.com/websockets-beta
MDN documentation for the WebSocket Web API: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
