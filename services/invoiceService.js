var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var CONSTS = require('../constants');
var https = require('https');
var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');

// const baseUrl = `${path.resolve()}/temp/`;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'mosdev0429@gmail.com',
        clientId: '559892362120-ss647ftje2377jbmjklb80f0hgdg56vh.apps.googleusercontent.com',
        clientSecret: 'Qfa_m23TLtXJFOjGhI3PzCGJ',
        refreshToken: "1/HT50OY0h1wSYOfAPWBht1kNIv7jJwSqn9YyTv5Rs6lg",
        accessToken: "ya29.GlujBWCBkt9hWCBCKjUAipRUBAON-uO_Zch9y9mq1jeu-uzh7q_uqKw2oINMyzSawIGeXP1J9pMkC6pqzUrV6vMOkwgMozX7BkpecKoZh4y4rcmthE2oJjMtKsvX",
        expires: 1484314697598
    },
    tls: {
        rejectUnauthorized: false
    }
});

function generateInvoice(invoice, filename, success, error) {
    var postData = JSON.stringify(invoice);
    var options = {
        hostname  : "invoice-generator.com",
        port      : 443,
        path      : "/",
        method    : "POST",
        headers   : {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
        }
    };

    var file = fs.createWriteStream('./temp/'+filename);
    var bufferArr = [];
    var base64String = 'data:application/pdf;base64,';
    var req = https.request(options, function(res) {
        res.on('data', function(chunk) {
            file.write(chunk);
            bufferArr.push(chunk);
        }).on('end', function() {
            file.end();
            if (typeof success === 'function') {
                var arrayBuffer = Buffer.concat(bufferArr);
                base64String = base64String + arrayBuffer.toString('base64');
                success(base64String);
            }
        });
    });
    req.write(postData);
    req.end();

    if (typeof error === 'function') {
        req.on('error', error);
    }
}

module.exports.generate = function(data){
    const invoice = data;
    return new Promise(function(resolve, reject){
        generateInvoice(invoice, 'invoice.pdf', function(base64String) {
            resolve(base64String);
            storeInvoice(invoice)
        }, function(error) {
            console.error(error);
            reject(err);
        });
    })
}

module.exports.send = function(data){
    const invoice = data.invoice;
    const user = data.user;
    return new Promise(function(resolve, reject){
        generateInvoice(invoice, 'invoice.pdf', function(base64String) {
            storeUser(invoice, user);
            var mailOptions = {
                from: user.from,
                to: user.to,
                subject: `invoice from ${invoice.from}`,
                // text: 'This is invoice text',
                html: `<p>${user.message}</p>`,
                attachments:[{
                    filename: 'invoice.pdf',
                    path: base64String
                }]
            };
            transporter.sendMail(mailOptions, (err, info)=>{
                if(err) reject(err)
                resolve(info)
            })
        }, function(error) {
            console.error(error);
            reject(err);
        });
    })
}

function storeInvoice(invoice){
    MongoClient.connect(CONSTS.MONGODB_URL, function(err, client) {
        if (err) throw(err);
        var db =client.db(CONSTS.DB_NAME);
        db.collection("invoice").insertOne(invoice, function(err, result) {
            if (err) throw(err);            
            client.close();
        });
    });
}

function storeUser(invoice, user){
    MongoClient.connect(CONSTS.MONGODB_URL, function(err, client) {
        if (err) throw(err);
        var db =client.db(CONSTS.DB_NAME);
        db.collection("invoice").insertOne(invoice, function(err, result) {
            if (err) throw(err);
            user.invoiceId = result.insertedId;
            db.collection("user").insertOne(user, function(err, result) {
                if (err) throw(err);
            });
            client.close();
        });
    });
}