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
Error: Core folder Cores/AuthorName.AnotherCoreName should be Cores/undefined.undefined to match 
https://www.analogue.co/developer/docs/core-definition-files#folder-naming-convention
Error: missing Cores/AuthorName.coreName/snes_main_too_long_a_file_name_too_long.rev file 
https://www.analogue.co/developer/docs/core-definition-files/core-json#cores
Error: Cores/AuthorName.coreName/core.json invalid: 

https://www.analogue.co/developer/docs/core-definition-files/core-json

Error: core.magic Invalid literal value, expected "APF_VER_1"
Error: core.metadata.platform_ids Array must contain at most 4 element(s)
Error: core.metadata.shortname String must contain at most 31 character(s)
Error: core.metadata.description String must contain at most 63 character(s)
Error: core.metadata.url String must contain at most 63 character(s)
Error: core.metadata.version String must contain at most 31 character(s)
Error: core.metadata.date_release String must contain at most 10 character(s)
Error: core.framework.target_product Invalid literal value, expected "Analogue Pocket"
Error: core.framework.chip32_vm String must contain at most 15 character(s)
Error: core.cores.0.name String must contain at most 15 character(s)
Error: core.cores.0.filename String must contain at most 15 character(s)
Error: core.framework.hardware.cartridge_adapter Invalid input
Error: Cores/AuthorName.AnotherCoreName/core.json invalid: 

https://www.analogue.co/developer/docs/core-definition-files/core-json

Error: core Required
Recommendation: SemVer versioning is highly encouraged - \`not-semver-and-also-far-far-too-long\` in Cores/AuthorName.coreName/core.json 
https://www.analogue.co/developer/docs/core-definition-files/core-json#metadata
Recommendation: SemVer versioning is highly encouraged - \`undefined\` in Cores/AuthorName.AnotherCoreName/core.json 
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
Exit code 28
Recommendation: it's easier for users to install what they want when each zip contains 1 core
Exit code 16
"
`)
})
