const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const PDFDocument = require("pdfkit");

// Función para calcular los días transcurridos
function calcularDiasTranscurridos(fechaInicio, fechaFin) {
	const fechaInicioObj = new Date(fechaInicio);
	const fechaFinObj = new Date(fechaFin);
	const diferenciaMs = fechaFinObj - fechaInicioObj;
	return Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
}

// Función para calcular el monto total a pagar según los días transcurridos
function calcularMontoTotal(montoBase, diasTranscurridos) {
	let porcentajeAdicional = 0;

	if (diasTranscurridos > 10 && diasTranscurridos <= 30) {
		porcentajeAdicional = (diasTranscurridos - 10) * 0.01; // 1% por cada día después del día 10
	} else if (diasTranscurridos > 30) {
		const porcentajeAdicionalHasta30Dias = 0.1 + 0.01 * 20; // 1% por cada día entre el 11 y el 30
		const porcentajeAdicionalDespuesDe30Dias = 0.02 * (diasTranscurridos - 30); // 2% por cada día después del día 30
		porcentajeAdicional =
			porcentajeAdicionalHasta30Dias + porcentajeAdicionalDespuesDe30Dias;
	}

	// Redondear el porcentaje adicional a 2 decimales
	porcentajeAdicional = parseFloat(porcentajeAdicional.toFixed(2));

	return montoBase * (1 + porcentajeAdicional);
}

// Ruta para el endpoint POST
router.post("/", (req, res) => {
	const { fechaInicio, fechaFin, montoBase } = req.body;

	if (!fechaInicio || !fechaFin || !montoBase) {
		return res
			.status(400)
			.json({ error: "Debes proporcionar las fechas y el monto a pagar." });
	}

	const diasTranscurridos = calcularDiasTranscurridos(fechaInicio, fechaFin);
	const montoTotal = calcularMontoTotal(
		parseFloat(montoBase),
		diasTranscurridos
	);

	let mensaje = "";

	if (diasTranscurridos > 30) {
		mensaje = "En mora";
	} else if (diasTranscurridos > 10 && diasTranscurridos <= 30) {
		mensaje = "Pago fuera de término";
	} else {
		mensaje = "Pago en término";
	}

	res.json({ fechaInicio, fechaFin, diasTranscurridos, montoTotal, mensaje });
});

//////////////////////////////////////

module.exports = router;
