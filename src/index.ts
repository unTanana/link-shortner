import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { firestoreDb } from "./db/firebase";

const app: Express = express();
const port = process.env.PORT;

//health-check
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Ok");
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
