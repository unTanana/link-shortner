import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getUrlFactory } from "./get-url/get-url.factory";
import { getUrlBySlug } from "./db/firebase";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

//health-check
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Ok");
});

app.get("/:shortcode", async (req: Request, res: Response) => {
  const shortcode = req.params.shortcode;
  if (!shortcode) {
    res.status(400).send("Bad Request");
  }

  const fullUrl = await getUrlFactory({ getUrlBySlug: getUrlBySlug })(
    shortcode
  );
  if (fullUrl) {
    if (fullUrl.startsWith("http")) {
      return res.redirect(fullUrl);
    }
    return res.redirect(`https://${fullUrl}`);
  }

  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
