"use strict";

const https = require("https");

const token  = process.env.WA_API_TOKEN;
const userid = process.env.WA_USER_ID;
const host   = process.env.WA_API_HOST;

const options = {
    host: host,
    headers: {
        'x-token': token,
        'x-user-uuid': userid
    }
};

function getFeedItems(beforeId) {
    let path = '/api/feed?limit=100';
    if (beforeId) {
        path += `&beforeId=${ beforeId }`;
    }
    options.path = path;

    return new Promise((resolve, reject) => {
        var data = "";
        var req = https.request(options, (res) => {
            res.on('data', (d) => {
                data += d;
            });

            res.on('end', () => {
                var feed = JSON.parse(data);
                resolve(feed);
            });
        });
        req.end();

        req.on('error', (e) => {
            reject(e);
        });
    });
}

module.exports = {
    getFeedItems
};
