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
  console.time("Get Url time");
  const shortcode = req.params.shortcode;
  if (!shortcode) {
    res.status(400).send("Bad Request");
    console.timeEnd("Get Url time");
    return;
  }

  const fullUrl = await getUrlAndIncrementCountFactory({
    getUrlBySlugAndIncrementCount,
  })(shortcode);

  if (fullUrl) {
    if (fullUrl.startsWith("http")) {
      res.redirect(fullUrl);
      console.timeEnd("Get Url time");
      return;
    }
    res.redirect(`https://${fullUrl}`);
    console.timeEnd("Get Url time");
    return;
  }

  res.status(404).send("Not Found");
  console.timeEnd("Get Url time");
  return;
});

app.get("/:shortcode/stats", async (req: Request, res: Response) => {
  console.time("Stats time");
  const shortcode = req.params.shortcode;
  if (!shortcode) {
    res.status(400).send("Bad Request");
    console.timeEnd("Stats time");
    return;
  }

  const urlStats = await getUrlStatsFactory({ getUrlStats })(shortcode);

  if (!urlStats) {
    res.status(404).send("Not Found");
    console.timeEnd("Stats time");
    return;
  }

  res.json(urlStats);
  console.timeEnd("Stats time");
  return;
});

app.post("/shorten", async (req: Request, res: Response) => {
  console.time("Shorten time");
  const url = req.body.url;
  console.log("url:", url);
  if (!url) {
    res.status(400).send("Bad Request");
    console.timeEnd("Shorten time");
    return;
  }

  const shortcode = req.body.shortcode;
  if (shortcode && !shortcode.match(/^[0-9a-zA-Z_]{4,}$/)) {
    res.status(422).send("Shortcode doesn't meet criteria");
    console.timeEnd("Shorten time");
    return;
  }

  await shortenUrlFactory({
    getLinkBySlug,
    createLink,
  })({
    url,
    shortcode,
    res,
  });
  console.timeEnd("Shorten time");
  return;
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
