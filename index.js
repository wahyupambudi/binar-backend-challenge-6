require("dotenv").config();

const express = require("express");
const app = express();
const router = require("./route/routes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
// const swaggerDef = require("./helper/swagger_template.helper");

const port = process.env.PORT || 3000;


// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Implementation Swagger to Backend Challenge 5",
//       version: "1.0.0",
//       description: "API MyBank for Users, Accounts, Transactions",
//     },
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "apiKey",
//           in: "header",
//           name: "Authorization",
//           // scheme: 'bearer',
//           // bearerFormat: 'JWT',
//           description: "Input your Token for Get Access",
//         },
//       },
//     },
//     servers: [
//       {
//         url: "http://localhost:8080",
//       },
//       {
//         url: "http://localhost:3000",
//       },
//     ],
//   },
//   apis: [
//     "./routes/auth.route.js",
//     "./routes/user.route.js",
//     "./routes/account.route.js",
//     "./routes/transaction.route.js",
//   ],
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static("media/images"));
app.use("/", router);
// app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`service running on port ${port}`)
})