import { Response } from "express";
import { shortenUrlFactory } from "./shorten-url.factory";

const createLinkMock = jest.fn();
const getLinkBySlugMock = jest.fn();

// hack to get around the fact that you can chain functions in response
const mockInnerResponse = {
  status: jest.fn(),
  send: jest.fn(),
  json: jest.fn(),
};

const mockRes = {
  status: jest.fn().mockReturnValue(mockInnerResponse),
  send: jest.fn().mockReturnValue(mockInnerResponse),
  json: jest.fn().mockReturnValue(mockInnerResponse),
} as unknown as Response;

describe("shortenUrlFactory test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 409 if link exists", async () => {
    getLinkBySlugMock.mockResolvedValue({ id: "foundLinkId" });
    await shortenUrlFactory({
      createLink: createLinkMock,
      getLinkBySlug: getLinkBySlugMock,
    })({
      url: "https://example.com",
      shortcode: "test",
      res: mockRes,
    });
    expect(mockRes.status).toBeCalledWith(409);
    expect(mockInnerResponse.send).toBeCalledWith("Shortcode already in use");
  });

  it("should create link with given short code", async () => {
    getLinkBySlugMock.mockResolvedValue(undefined);
    createLinkMock.mockResolvedValue({ id: "createdLinkId" });

    await shortenUrlFactory({
      createLink: createLinkMock,
      getLinkBySlug: getLinkBySlugMock,
    })({
      url: "https://example.com",
      shortcode: "test12",
      res: mockRes,
    });
    expect(mockRes.json).toBeCalledWith({
      url: "https://example.com",
      shortcode: "test12",
    });
    expect(mockInnerResponse.status).toBeCalledWith(201);
  });

  it("should create link with new short code", async () => {
    getLinkBySlugMock.mockResolvedValue(undefined);
    createLinkMock.mockResolvedValue({ id: "createdLinkId" });

    await shortenUrlFactory({
      createLink: createLinkMock,
      getLinkBySlug: getLinkBySlugMock,
    })({
      url: "https://example.com",
      res: mockRes,
    });
    expect(mockRes.json).toBeCalledWith({
      url: "https://example.com",
      shortcode: expect.any(String),
    });
    expect(mockInnerResponse.status).toBeCalledWith(201);
  });

  it("should return 500 when a link is not created", async () => {
    getLinkBySlugMock.mockResolvedValue(undefined);
    createLinkMock.mockResolvedValue({});

    await shortenUrlFactory({
      createLink: createLinkMock,
      getLinkBySlug: getLinkBySlugMock,
    })({
      url: "https://example.com",
      res: mockRes,
    });
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockInnerResponse.send).toBeCalledWith("Internal Server Error");
  });
});
