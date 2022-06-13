import { GetUrlBySlugAndIncrementCount } from "../../db/firebase";

export const getUrlAndIncrementCountFactory =
  ({
    getUrlBySlugAndIncrementCount,
  }: {
    getUrlBySlugAndIncrementCount: GetUrlBySlugAndIncrementCount;
  }) =>
  async (slug: string) => {
    try {
      const url = await getUrlBySlugAndIncrementCount(slug);
      return url;
    } catch (e) {
      console.error(e);
      return;
    }
  };
