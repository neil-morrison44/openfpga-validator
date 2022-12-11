import { processZip } from "../src/index"

test("bad.zip", async () => {
  let outputData = ""
  jest
    .spyOn(console, "log")
    .mockImplementation((...inputs) => (outputData += `${inputs.join(" ")}\n`))

  await processZip("./test_zips/bad.zip", {
    failOnWarnings: false,
    failOnRecommendations: false,
  })

  expect(outputData).toMatchInlineSnapshot(`
"Error: Unparsable JSON file: this_isnt.json SyntaxError: Unexpected token h in JSON at position 1
Error: Core folder Cores/AuthorName.coreName should be Cores/SomeoneElse.very very very very very long short name to match 
https://www.analogue.co/developer/docs/core-definition-files#folder-naming-convention
Error: Missing / incorrect \`core.magic\` in Cores/AuthorName.coreName/core.json 
https://www.analogue.co/developer/docs/core-definition-files/core-json#json-definition
Error: framework.target_product must be set to "Analogue Pocket" in Cores/AuthorName.coreName/core.json 
https://www.analogue.co/developer/docs/core-definition-files/core-json#framework
Error: missing / incorrect hardware.cartridge_adapter in Cores/AuthorName.coreName/core.json 
https://www.analogue.co/developer/docs/core-definition-files/core-json#hardware
Error: param shortname too long (40 > 31) in Cores/AuthorName.coreName/core.json 
https://www.analogue.co/developer/docs/core-definition-files/core-json#cores
Error: param description too long (92 > 63) in Cores/AuthorName.coreName/core.json 
https://www.analogue.co/developer/docs/core-definition-files/core-json#cores
Error: param url too long (94 > 63) in Cores/AuthorName.coreName/core.json 
https://www.analogue.co/developer/docs/core-definition-files/core-json#cores
Error: param version too long (36 > 31) in Cores/AuthorName.coreName/core.json 
https://www.analogue.co/developer/docs/core-definition-files/core-json#cores
Error: param date_release too long (19 > 10) in Cores/AuthorName.coreName/core.json 
https://www.analogue.co/developer/docs/core-definition-files/core-json#cores
Recommendation: SemVer versioning is highly encouraged - \`not-semver-and-also-far-far-too-long\` in Cores/AuthorName.coreName/core.json 
https://www.analogue.co/developer/docs/core-definition-files/core-json#metadata
Error: Specified platform nonsense_1 is missing, Platforms/nonsense_1.json should exist 
 https://www.analogue.co/developer/docs/platform-metadata#platform.json
Recommendation: nonsense_1 is missing an image 
 https://www.analogue.co/developer/docs/platform-metadata#platform-image
Error: Specified platform nonsense_2 is missing, Platforms/nonsense_2.json should exist 
 https://www.analogue.co/developer/docs/platform-metadata#platform.json
Recommendation: nonsense_2 is missing an image 
 https://www.analogue.co/developer/docs/platform-metadata#platform-image
Error: Specified platform nonsense_3 is missing, Platforms/nonsense_3.json should exist 
 https://www.analogue.co/developer/docs/platform-metadata#platform.json
Recommendation: nonsense_3 is missing an image 
 https://www.analogue.co/developer/docs/platform-metadata#platform-image
Error: Specified platform nonsense_4 is missing, Platforms/nonsense_4.json should exist 
 https://www.analogue.co/developer/docs/platform-metadata#platform.json
Recommendation: nonsense_4 is missing an image 
 https://www.analogue.co/developer/docs/platform-metadata#platform-image
Error: Specified platform nonsense_5 is missing, Platforms/nonsense_5.json should exist 
 https://www.analogue.co/developer/docs/platform-metadata#platform.json
Recommendation: nonsense_5 is missing an image 
 https://www.analogue.co/developer/docs/platform-metadata#platform-image
Error: Specified platform nonsense_6 is missing, Platforms/nonsense_6.json should exist 
 https://www.analogue.co/developer/docs/platform-metadata#platform.json
Recommendation: nonsense_6 is missing an image 
 https://www.analogue.co/developer/docs/platform-metadata#platform-image
Error: Specified platform nonsense_7 is missing, Platforms/nonsense_7.json should exist 
 https://www.analogue.co/developer/docs/platform-metadata#platform.json
Recommendation: nonsense_7 is missing an image 
 https://www.analogue.co/developer/docs/platform-metadata#platform-image
Error: Specified platform nonsense_8 is missing, Platforms/nonsense_8.json should exist 
 https://www.analogue.co/developer/docs/platform-metadata#platform.json
Recommendation: nonsense_8 is missing an image 
 https://www.analogue.co/developer/docs/platform-metadata#platform-image
Error: Specified platform nonsense_9 is missing, Platforms/nonsense_9.json should exist 
 https://www.analogue.co/developer/docs/platform-metadata#platform.json
Recommendation: nonsense_9 is missing an image 
 https://www.analogue.co/developer/docs/platform-metadata#platform-image
Exit code 19
"
`)
})
