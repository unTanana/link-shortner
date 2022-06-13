import { GetUrlStats } from "../../db/firebase";

export const getUrlStatsFactory =
  ({ getUrlStats }: { getUrlStats: GetUrlStats }) =>
  async (shortcode: string) => {
    try {
      const urlStats = await getUrlStats(shortcode);
      return urlStats;
    } catch (e) {
      console.error(e);
      return;
    }
  };
