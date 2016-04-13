const http = require("http");
const fs   = require("fs");
const url  = require("url");
const auth = require('basic-auth');

const index     = fs.readFileSync("src/index.html");
const js        = fs.readFileSync("src/script.js");
const feedQuery = require("./feed");

//Lets define a port we want to listen to
const PORT = process.env.WA_PORT || 8080;
const USER = process.env.WA_ADMIN_USER;
const PW = process.env.WA_ADMIN_PW;

function checkCredentials(req, res) {
    const credentials = auth(req);

    if (!credentials ||
        credentials.name !== USER ||
        credentials.pass !== PW) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="example"')
        res.end('Access denied')
        return false;
    }

    return true;
}

//We need a function which handles requests and send response
function handleRequest(req, res){
    console.log(`${req.connection.remoteAddress} - ${req.url}`);

    if (!checkCredentials(req, res)) {
        return;
    }

    if (req.url.startsWith("/feed")) {
        const parts = url.parse(req.url, true);

        feedQuery.getFeedItems(parts.query.beforeId)
            .then(events => {
                res.end(JSON.stringify(events));
            })
            .catch(err => {
                res.end(err);
            });
    } else if (req.url === "/whappu") {
        res.end(index);
    } else if (req.url === "/script.js") {
        res.end(js);
    } else {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("404 Not Found\n");
        res.end();
    }
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
