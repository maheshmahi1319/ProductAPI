import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
// import * as productCRUD from './product-crud';
import * as productCRUD from "./product-crud-mongo";
const Alpaca = require("@alpacahq/alpaca-trade-api");
dotenv.config();

if (!process.env.PORT) {
  console.log(`Error to get ports`);
  process.exit(1);
}

const uri: string = "mongodb://127.0.0.1:27017/codeindepth";

mongoose.connect(uri, (err: any) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`Connecting to MONGO`);
  }
});

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(cors({
  origin:'http://localhost:4200'
}));
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const authorisedRoute = express.Router();
app.use("/api", (req, res) => {
  alpaca
  .getAggregates("AAPL", "minute", "2019-12-10", "2020-01-20")
  .then((response: any) => {
    console.log(response);
    res.send(response);
  });
});

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");

  next();
});
//cid =7d6036e3240a48436a28e5a9131a342c
//cs = e4b0d4d9652974e53adfe9838ac052d9bc4dad82
// Send message for default URL
authorisedRoute.get("/", (req, res) =>
  res.send("Welcome to default response of Product API")
);

authorisedRoute.get("/products", (req, res) => {
  alpaca
  .getAggregates("AAPL", "minute", "2019-04-10", "2020-04-20")
  .then((response: any) => {
    console.log(response);
  });
});
authorisedRoute.post("/products", productCRUD.createProduct);
authorisedRoute.post("/updateproduct", productCRUD.updateroduct);
authorisedRoute.post("/deleteproduct", productCRUD.deleteproduct);
const alpaca = new Alpaca({
  keyId: "PK1DV1GK8FGH4KQQ3HEC",
  secretKey: "VMmQ9Y7VIJ9ktjsQ0CKBH6XWt9x8hGgstnoeKz0t",
  paper: true,
  usePolygon: false,
});
// alpaca.lastTrade("AAPL").then((response: any) => {
//   console.log(response);
// });
// const stock = "AAPL";
app.get("/api/", (req, res) => {

}

