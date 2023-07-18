const express = require('express');
const moment = require('moment');
const router = express.Router();

router.post('/', (req, res) => {
  const { startDate, endDate } = req.body;

  // Validacion de input
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Both startDate and endDate are required.' });
  }

  // Calcula la diferencia en dias
  const startMoment = moment(startDate, 'YYYY-MM-DD');
  const endMoment = moment(endDate, 'YYYY-MM-DD');
  const diffInDays = endMoment.diff(startMoment, 'days');

  // Envia la differencia en dias como result
  res.json({ differenceInDays: diffInDays });
});

module.exports = router;


   