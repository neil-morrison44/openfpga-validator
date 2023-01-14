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
Recommendation: it's easier for users to install what they want when each zip contains 1 core
Error: Assets/plat/instance.json invalid: 

https://www.analogue.co/developer/docs/core-definition-files/core-json

Error: instance.core_select.select Required
Error: instance.variant_select.select Expected boolean, received string
Error: instance.core_select.id Number must be greater than or equal to 0
Error: instance.data_slots.1.id Invalid input
Exit code 21
"
`)
})
