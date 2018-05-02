
var express = require('express');
var router = express.Router();
var InvoiceService = require('../../services/invoiceService');

router.post('/generate', function (req, res, next) {
    InvoiceService.generate(req.body).then(function (data) {
        res.status(200).send(data)
    }).catch(function (err) {
        res.status(505).send(err);
    });
});

router.post('/send', function (req, res, next) {
    InvoiceService.send(req.body).then(function (data) {
        res.status(200).send(data)
    }).catch(function (err) {
        res.status(505).send(err);
    });
});

module.exports = router;