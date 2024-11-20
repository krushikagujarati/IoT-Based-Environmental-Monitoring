const express = require('express');
const dataSourcesRoute = require('./dataSources');
const streamRoute = require('./stream');
//const anomalyStreamRoute = require('./streamAnomaly');

const router = express.Router();

// Use individual routes
router.use('/data-sources', dataSourcesRoute);
router.use('/stream', streamRoute);
//router.use('/stream-anomaly', anomalyStreamRoute);

module.exports = router;
