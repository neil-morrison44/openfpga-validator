import { StreamZipAsync } from "node-stream-zip"
import { Reporter } from "./report"

export type CheckFn = (zip: StreamZipAsync, reporter: Reporter) => Promise<void>

export type CoreJSON = {
  core: {
    magic: "APF_VER_1"
    metadata: {
      platform_ids: string[]
      shortname: string
      description: string
      author: string
      url?: string
      version: string
      date_release: string
    }
    framework: {
      target_product: "Analogue Pocket"
      version_required: string
      sleep_supported: boolean
      chip32_vm?: string
      dock: {
        supported: boolean
        analog_output: boolean
      }
      hardware: {
        link_port: boolean
        cartridge_adapter: 0 | -1
      }
    }
    cores: { name: string; id: number | string; filename: string }[]
  }
}
