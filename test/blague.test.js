const blague = require("../commands/blague.js");
const BlaguesAPI = require("blagues-api");
require("dotenv").config();

describe("blague", () => {
  it("params verification", () => {
    expect(blague.data.name).toBe("blague");
  });

  it("all choices work", () => {
    blague.data.options
      .find((e) => e.name === "type")
      ?.choices?.forEach((e) => {
        const type = e.value;

        const blagues = new BlaguesAPI(process.env.BLAGUES_TOKEN);

        return blagues
          .randomCategorized(blagues.categories[type])
          .then((data) => {
            expect(data.type).toBe(e.value.toLowerCase());
          });
      });
  });
});
