# pingpong-api
A npm package for the Ping Pong API

## Getting Started
Create a new instance of PingPongAPI passing the configuration options and optional default request options:

```
var PingPongAPI = require('PingPongAPI');

var pingPongApi = new PingPongAPI({
    host: 'yourhost.com',
    port: 3000,
    protocol: 'http'
}, {
    auth: {
        user: 'user',
        pass: 'pass',
        sendImmediately: true
    }
});
```

The client must be created with a `host` or an error will be thrown.

## Using the client
Call `pingPongApi.createPlayer(options, callback)` with the following parameters:

```
@param {object} options The request options to pass with your api call
@param {function} callback A callback function. Will be sent the following params:
    @param {string} error An error
    @param {object} response The server response
    @param {object} body The body of the response
```

An example:

```
// Create a new player
pingPongApi.createPlayer({
    body: {
        name: 'Player Name',
        email: 'player@google.com',
        avatar: 'https://en.gravatar.com/userimage/58744548/cc57284537a0deaf9573c225331f672b.jpg',
        office: 'San Francisco',
        skill: null
    }
}, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response);
        }
    }
);
```

## Testing
### Unit tests
To run all unit tests within the package run:
```
npm test
```

### Code Style / Lint Checks
To run jshint and jscs checks within the package run:
```
npm run lint
```
