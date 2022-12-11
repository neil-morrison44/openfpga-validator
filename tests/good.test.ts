import { processZip } from "../src/index"

test("good.zip", async () => {
  let outputData = ""
  jest
    .spyOn(console, "log")
    .mockImplementation((...inputs) => (outputData += inputs.join(", ")))

  await processZip("./test_zips/good.zip", {
    failOnWarnings: false,
    failOnRecommendations: false,
  })

  expect(outputData).toMatchInlineSnapshot(`"Exit code 0"`)
})
