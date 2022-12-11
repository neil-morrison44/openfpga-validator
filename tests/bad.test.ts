import { processZip } from "../src/index"

test("bad.zip", async () => {
  let outputData = ""
  const storeLog = (inputs) => (outputData += inputs)
  jest
    .spyOn(console, "log")
    .mockImplementation((inputs) => (outputData += `${inputs}\n\n`))

  await processZip("./test_zips/bad.zip", {
    failOnWarnings: false,
    failOnRecommendations: false,
  })

  expect(outputData).toMatchInlineSnapshot(`
"[31mError: Unparsable JSON file: this_isnt.json SyntaxError: Unexpected token h in JSON at position 1[39m

[31mError: Core folder Cores/AuthorName.coreName should be Cores/SomeoneElse.very very very very very long short name to match [39m
[31mhttps://www.analogue.co/developer/docs/core-definition-files#folder-naming-convention[39m

[31mError: Missing / incorrect \`core.magic\` in Cores/AuthorName.coreName/core.json [39m
[31mhttps://www.analogue.co/developer/docs/core-definition-files/core-json#json-definition[39m

[31mError: framework.target_product must be set to "Analogue Pocket" in Cores/AuthorName.coreName/core.json [39m
[31mhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework[39m

[31mError: missing / incorrect hardware.cartridge_adapter in Cores/AuthorName.coreName/core.json [39m
[31mhttps://www.analogue.co/developer/docs/core-definition-files/core-json#hardware[39m

[31mError: param shortname too long (40 > 31) in Cores/AuthorName.coreName/core.json [39m
[31mhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores[39m

[31mError: param description too long (92 > 63) in Cores/AuthorName.coreName/core.json [39m
[31mhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores[39m

[31mError: param url too long (94 > 63) in Cores/AuthorName.coreName/core.json [39m
[31mhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores[39m

[31mError: param version too long (36 > 31) in Cores/AuthorName.coreName/core.json [39m
[31mhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores[39m

[31mError: param date_release too long (19 > 10) in Cores/AuthorName.coreName/core.json [39m
[31mhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores[39m

[32mRecommendation: SemVer versioning is highly encouraged - \`not-semver-and-also-far-far-too-long\` in Cores/AuthorName.coreName/core.json [39m
[32mhttps://www.analogue.co/developer/docs/core-definition-files/core-json#metadata[39m

[31mError: Specified platform nonsense_1 is missing, Platforms/nonsense_1.json should exist [39m
[31m https://www.analogue.co/developer/docs/platform-metadata#platform.json[39m

[32mRecommendation: nonsense_1 is missing an image [39m
[32m https://www.analogue.co/developer/docs/platform-metadata#platform-image[39m

[31mError: Specified platform nonsense_2 is missing, Platforms/nonsense_2.json should exist [39m
[31m https://www.analogue.co/developer/docs/platform-metadata#platform.json[39m

[32mRecommendation: nonsense_2 is missing an image [39m
[32m https://www.analogue.co/developer/docs/platform-metadata#platform-image[39m

[31mError: Specified platform nonsense_3 is missing, Platforms/nonsense_3.json should exist [39m
[31m https://www.analogue.co/developer/docs/platform-metadata#platform.json[39m

[32mRecommendation: nonsense_3 is missing an image [39m
[32m https://www.analogue.co/developer/docs/platform-metadata#platform-image[39m

[31mError: Specified platform nonsense_4 is missing, Platforms/nonsense_4.json should exist [39m
[31m https://www.analogue.co/developer/docs/platform-metadata#platform.json[39m

[32mRecommendation: nonsense_4 is missing an image [39m
[32m https://www.analogue.co/developer/docs/platform-metadata#platform-image[39m

[31mError: Specified platform nonsense_5 is missing, Platforms/nonsense_5.json should exist [39m
[31m https://www.analogue.co/developer/docs/platform-metadata#platform.json[39m

[32mRecommendation: nonsense_5 is missing an image [39m
[32m https://www.analogue.co/developer/docs/platform-metadata#platform-image[39m

[31mError: Specified platform nonsense_6 is missing, Platforms/nonsense_6.json should exist [39m
[31m https://www.analogue.co/developer/docs/platform-metadata#platform.json[39m

[32mRecommendation: nonsense_6 is missing an image [39m
[32m https://www.analogue.co/developer/docs/platform-metadata#platform-image[39m

[31mError: Specified platform nonsense_7 is missing, Platforms/nonsense_7.json should exist [39m
[31m https://www.analogue.co/developer/docs/platform-metadata#platform.json[39m

[32mRecommendation: nonsense_7 is missing an image [39m
[32m https://www.analogue.co/developer/docs/platform-metadata#platform-image[39m

[31mError: Specified platform nonsense_8 is missing, Platforms/nonsense_8.json should exist [39m
[31m https://www.analogue.co/developer/docs/platform-metadata#platform.json[39m

[32mRecommendation: nonsense_8 is missing an image [39m
[32m https://www.analogue.co/developer/docs/platform-metadata#platform-image[39m

[31mError: Specified platform nonsense_9 is missing, Platforms/nonsense_9.json should exist [39m
[31m https://www.analogue.co/developer/docs/platform-metadata#platform.json[39m

[32mRecommendation: nonsense_9 is missing an image [39m
[32m https://www.analogue.co/developer/docs/platform-metadata#platform-image[39m

Exit code 19

"
`)
})
