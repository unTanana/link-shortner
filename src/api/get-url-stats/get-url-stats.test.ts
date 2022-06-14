import { getUrlStatsFactory } from "./get-url-stats.factory";

const getUrlStatsMock = jest.fn();
const mockResult = {
  redirectCount: 2,
  lastSeenDate: new Date().toISOString(),
  startDate: new Date().toISOString(),
};

describe("getUrlStatsFactory test", () => {
  it("should return result stats", async () => {
    getUrlStatsMock.mockResolvedValue(mockResult);
    const stats = await getUrlStatsFactory({
      getUrlStats: getUrlStatsMock,
    })("test");
    expect(stats).toMatchObject(mockResult);
  });

  it("should return undefined", async () => {
    getUrlStatsMock.mockResolvedValue(undefined);
    const url = await getUrlStatsFactory({
      getUrlStats: getUrlStatsMock,
    })("test");
    expect(url).toEqual(undefined);
  });

  it("should catch error and return undefined", async () => {
    getUrlStatsMock.mockRejectedValue(new Error("test"));
    const url = await getUrlStatsFactory({
      getUrlStats: getUrlStatsMock,
    })("test");
    expect(url).toEqual(undefined);
  });
});
