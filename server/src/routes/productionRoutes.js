const express = require('express');
const router = express.Router();
const { getProductionSummary, createProductionLog, getDowntimeLogs, updateDowntimeStatus, getMachines, addMachine, getProductionLines, addProductionLine } = require('../controllers/productionController');

// Endpoint Dashboard
router.get('/summary', getProductionSummary);

// Endpoint Input Data
router.post('/log', createProductionLog);

router.get('/downtime', getDowntimeLogs);
router.patch('/downtime/:id', updateDowntimeStatus);

router.get('/machines', getMachines);
router.post('/machines', addMachine);
router.get('/lines', getProductionLines);
router.post('/lines', addProductionLine);

module.exports = router;