const mongoose = require("mongoose");
const  Url  = require("../../schema/UrlSchema");
const db = require("./database");

const urlData = {
  origUrl: "https://dashboard.render.com/web/srv-ci6fr86nqqlclfqbjvu0/env",
  customId: "render",
};

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});


describe("Url model", () => {
  it("create url in database with required fields successfully", async () => {
    const validUrl = new Url(urlData);
    const savedUrl = await validUrl.save();
   
    expect(savedUrl._id).toBeDefined();
    expect(savedUrl.clicks).toBeDefined();
    expect(savedUrl.clicker).toBeDefined();
    expect(savedUrl.origUrl).toBe(urlData.origUrl);

  
  
  });
})