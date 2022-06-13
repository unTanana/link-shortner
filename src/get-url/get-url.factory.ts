import { GetUrlBySlug } from "../db/firebase";

export const getUrlFactory =
  ({ getUrlBySlug }: { getUrlBySlug: GetUrlBySlug }) =>
  async (slug: string): Promise<string | undefined> => {
    try {
      const url = await getUrlBySlug(slug);
      return url;
    } catch (e) {
      console.error(e);
      return;
    }
  };
