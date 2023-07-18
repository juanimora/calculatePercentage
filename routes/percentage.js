const express = require('express');
const router = express.Router();

// Define el endpoint para calcular porcentaje
router.post('/', (req, res) => {
    const number = parseFloat(req.body.number);
    const percentage = parseFloat(req.body.percentage);
  
    // Validacion 
    if (isNaN(number) || isNaN(percentage)) {
      return res.status(400).json({ error: 'Number and percentage should be valid decimal numbers.' });
    }
  
    // Calcula porcentaje
    const result = (number * percentage) / 100;
  
    // Envia el porcentaje calculado como result
    res.json({ result });
  });

  module.exports = router;