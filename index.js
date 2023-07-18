// importar dependencias requeridas
const express = require('express');
const bodyParser = require('body-parser');

// Routes
const percentageRoute = require("./routes/percentage");
const dateDifferenceRoute = require("./routes/dateDifference");
const paymentDifferenceRoute = require("./routes/paymentDifference");

// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerDocumentation = require('./helper/documentation');

// Crear aplicacion express
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/percentage", percentageRoute);
app.use("/dateDifference", dateDifferenceRoute);
app.use("/paymentDifference", paymentDifferenceRoute);

app.use("/documentations", swaggerUI.serve);
app.use("/documentations", swaggerUI.setup(swaggerDocumentation));

// Start the server
app.listen(3000, () => {
  console.log('Calculator API is running on port 3000');
});
