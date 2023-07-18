const express = require("express");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const qrcode = require("qrcode");
const router = express.Router();

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
	const arancel = montoTotal - parseFloat(montoBase);

	let mensaje = "";

	if (diasTranscurridos > 30) {
		mensaje = "En mora";
	} else if (diasTranscurridos > 10 && diasTranscurridos <= 30) {
		mensaje = "Pago fuera de término";
	} else {
		mensaje = "Pago en término";
	}

	// Contenido personalizado para la declaración jurada
	const contenidoDeclaracion = `Esta es una declaracion jurada en la que dejo constancia que he pagado el monto total con sus intereses correspondientes de $${montoTotal} el día ${fechaInicio} y que la fecha de fin de pago es ${fechaFin}.`;

	// Generar el contenido para el código QR
	const contenidoQR = `Constancia de que se pago $${montoTotal}`;

	// Generar el código QR
	qrcode.toDataURL(contenidoQR, (err, url) => {
		if (err) {
			console.error("Error al generar el código QR:", err);
			return;
		}

		// Crear un nuevo documento PDF
		const doc = new PDFDocument();

		// Escribir el contenido del PDF
		doc.fontSize(20).text("Declaración Jurada", { align: "center" });
		doc.moveDown();
		doc.fontSize(14).text(contenidoDeclaracion);
		doc.moveDown();
		doc.fontSize(14).text(`Días transcurridos: ${diasTranscurridos}`);
		doc.fontSize(14).text(`Monto base: $${montoBase}`);
		doc.fontSize(14).text(`Monto total: $${montoTotal}`);
		doc.moveDown();
		doc.fontSize(14).text("Código QR de validación:");
		// Insertar el código QR en el PDF
		doc.image(url, { fit: [100, 100], align: "center", valign: "center" });

		// Definir el nombre del archivo y enviarlo como respuesta para su descarga
		const nombreArchivo = "declaracion_jurada.pdf";
		res.setHeader(
			"Content-disposition",
			`attachment; filename=${nombreArchivo}`
		);
		res.setHeader("Content-type", "application/pdf");
		doc.pipe(res);
		doc.end();
	});
});

//////////////////////////////////////

module.exports = router;
