import express, { Express, json, Request, Response } from "express";
import dotenv from "dotenv";
import { getUrlAndIncrementCountFactory } from "./api/get-url/get-url.factory";
import { getUrlStatsFactory } from "./api/get-url-stats/get-url-stats.factory";
import {
  getUrlBySlugAndIncrementCount,
  getUrlStats,
  getLinkBySlug,
  createLink,
} from "./db/firebase";
import { shortenUrlFactory } from "./api/shorten-url/shorten-url.factory";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(json());
//health-check
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Ok");
});

app.get("/:shortcode", async (req: Request, res: Response) => {
  const shortcode = req.params.shortcode;
  if (!shortcode) {
    res.status(400).send("Bad Request");
  }

  const fullUrl = await getUrlAndIncrementCountFactory({
    getUrlBySlugAndIncrementCount,
  })(shortcode);

  if (fullUrl) {
    if (fullUrl.startsWith("http")) {
      return res.redirect(fullUrl);
    }
    return res.redirect(`https://${fullUrl}`);
  }

  res.status(404).send("Not Found");
});

app.get("/:shortcode/stats", async (req: Request, res: Response) => {
  const shortcode = req.params.shortcode;
  if (!shortcode) {
    res.status(400).send("Bad Request");
  }
  const urlStats = await getUrlStatsFactory({ getUrlStats })(shortcode);

  if (!urlStats) {
    res.status(404).send("Not Found");
  }

  return res.json(urlStats);
});

app.post("/shorten", async (req: Request, res: Response) => {
  const url = req.body.url;
  console.log("url:", url);
  if (!url) {
    return res.status(400).send("Bad Request");
  }

  const shortcode = req.body.shortcode;
  if (shortcode && !shortcode.match(/^[a-zA-Z0-9]{6}$/)) {
    return res.status(422).send("Shortcode doesn't meet criteria");
  }

  return await shortenUrlFactory({
    getLinkBySlug,
    createLink,
  })({
    url,
    shortcode,
    res,
  });
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
