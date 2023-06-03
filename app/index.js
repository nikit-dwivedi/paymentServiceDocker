require('dotenv').config()
var fs = require('fs');
const app = require('./app')
const https = require('https');
const http = require('http')


var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

let credentials = {key: privateKey, cert: certificate};

const server = http.createServer(app)
const port = process.env.PORT

const secureServer = https.createServer(credentials,app);

secureServer.listen(7008, () => {
    console.log(`Secure server listening at 7008`);
})

server.listen(port, () => {
    console.log(`Server listening on port ${port} `);
})