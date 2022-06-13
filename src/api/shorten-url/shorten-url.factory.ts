import { Response } from "express";
import { CreateLink, GetLinkBySlug } from "../../db/firebase";

export const generateShortCode = async (getLinkBySlug: GetLinkBySlug) => {
  let foundUniqueShortcode = false;
  while (!foundUniqueShortcode) {
    const shortCode = Math.random().toString(16).slice(2, 8);
    const link = await getLinkBySlug(shortCode);
    if (!link) {
      foundUniqueShortcode = true;
      return shortCode;
    }
  }
};

export const shortenUrlFactory =
  ({
    createLink,
    getLinkBySlug,
  }: {
    createLink: CreateLink;
    getLinkBySlug: GetLinkBySlug;
  }) =>
  async ({
    url,
    shortcode,
    res,
  }: {
    url: string;
    shortcode?: string;
    res: Response;
  }) => {
    if (shortcode) {
      const link = await getLinkBySlug(shortcode);
      if (link) {
        return res.status(409).send("Shortcode already in use");
      }
    }

    const usedShortCode = shortcode ?? (await generateShortCode(getLinkBySlug));
    const link = await createLink(usedShortCode!, url);
    if (link.id) {
      return res
        .json({
          url,
          shortcode: usedShortCode,
        })
        .status(201);
    }
    return res.status(500).send("Internal Server Error");
  };
