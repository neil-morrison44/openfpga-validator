import chalk from "chalk"

export class Reporter {
  errorCount: number
  warningCount: number
  recommendationCount: number

  chalk: boolean

  constructor(options?: { chalk?: boolean }) {
    this.errorCount = 0
    this.warningCount = 0
    this.recommendationCount = 0

    if (options?.chalk === false) {
      this.chalk = false
    } else {
      this.chalk = true
    }
  }

  error(...args: any[]) {
    this.errorCount++
    if (this.chalk) {
      console.log(chalk.red(`Error:`, ...args))
    } else {
      console.log(`Error:`, ...args)
    }
  }

  warn(...args: any[]) {
    this.warningCount++
    if (this.chalk) {
      console.log(chalk.yellow(`Warning:`, ...args))
    } else {
      console.log(`Warning:`, ...args)
    }
  }

  recommend(...args: any[]) {
    this.recommendationCount++
    console.log(`Recommendation:`, ...args)
  }
}
