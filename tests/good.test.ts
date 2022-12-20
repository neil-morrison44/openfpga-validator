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

  expect(outputData).toMatchInlineSnapshot(`"Error:, No Cores found in zip!Exit code 1"`)
})
