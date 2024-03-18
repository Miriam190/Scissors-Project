
const  User  = require("../../schema/UserSchema");
const db = require("./database");

const userData = {
  username: "Lou",
  email: "lou@gmail.com",
  password: "Lou1234#",
  cPassword: "Lou1234#",
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

describe("User model", () => {
  it("create and save user successfully in the database", async () => {
    const validUser = new User(userData);
    // await validUser.setPassword(userData.password);
    const savedUser = await validUser.save();
 
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBeDefined();
    expect(savedUser.password).toEqual(expect.any(String));
    expect(savedUser.URLS).toBeDefined();
  
  });
})
