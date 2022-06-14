import { getUrlAndIncrementCountFactory } from "./get-url.factory";

const getUrlBySlugAndIncrementCountMock = jest.fn();

describe("getUrlAndIncrementCountFactory test", () => {
  it("should return url", async () => {
    getUrlBySlugAndIncrementCountMock.mockResolvedValue("https://example.com");
    const url = await getUrlAndIncrementCountFactory({
      getUrlBySlugAndIncrementCount: getUrlBySlugAndIncrementCountMock,
    })("test");
    expect(url).toEqual("https://example.com");
  });

  it("should return undefined", async () => {
    getUrlBySlugAndIncrementCountMock.mockResolvedValue(undefined);
    const url = await getUrlAndIncrementCountFactory({
      getUrlBySlugAndIncrementCount: getUrlBySlugAndIncrementCountMock,
    })("test");
    expect(url).toEqual(undefined);
  });

  it("should catch error and return undefined", async () => {
    getUrlBySlugAndIncrementCountMock.mockRejectedValue(new Error("test"));
    const url = await getUrlAndIncrementCountFactory({
      getUrlBySlugAndIncrementCount: getUrlBySlugAndIncrementCountMock,
    })("test");
    expect(url).toEqual(undefined);
  });
});
