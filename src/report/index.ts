import chalk from "chalk"

export class Reporter {
  errorCount: number
  warningCount: number
  recommendationCount: number

  constructor() {
    this.errorCount = 0
    this.warningCount = 0
    this.recommendationCount = 0
  }

  error(...args: any[]) {
    this.errorCount++
    console.log(chalk.red(`Error:`, ...args))
  }

  warn(...args: any[]) {
    this.warningCount++
    console.log(chalk.yellow(`Warning:`, ...args))
  }

  recommend(...args: any[]) {
    this.recommendationCount++
    console.log(chalk.green(`Recommendation:`, ...args))
  }
}
