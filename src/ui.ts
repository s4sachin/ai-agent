import ora from 'ora'
import type { AIMessage } from '../types'

export const showLoader = (text: string) => {
  const spinner = ora({
    text,
    color: 'cyan',
  }).start()

  return {
    stop: () => spinner.stop(),
    succeed: (text?: string) => spinner.succeed(text),
    fail: (text?: string) => spinner.fail(text),
    update: (text: string) => (spinner.text = text),
  }
}

export const logMessage = (message: AIMessage) => {
  const roleColors = {
    user: '\x1b[36m', // cyan
    model: '\x1b[32m', // green
  }

  const reset = '\x1b[0m'
  const role = message.role
  const color = roleColors[role as keyof typeof roleColors] || '\x1b[37m' // default to white

  // Don't log function messages
  if (role === 'function') {
    return
  }

  // Log user messages
  if (role === 'user') {
    console.log(`\n${color}[USER]${reset}`)
    const textPart = message.parts.find(p => 'text' in p) as { text?: string } | undefined
    const text = textPart?.text || ''
    console.log(`${text}\n`)
    return
  }

  // Log model messages
  if (role === 'model') {
    console.log(`\n${color}[MODEL]${reset}`)

    // Check for function calls
    const functionCalls = message.parts.filter(p => 'functionCall' in p)
    if (functionCalls.length > 0) {
      functionCalls.forEach((part) => {
        if ('functionCall' in part && part.functionCall) {
          console.log(`Function: ${part.functionCall.name}\n`)
        }
      })
      return
    }

    // Otherwise log text content
    const textPart = message.parts.find(p => 'text' in p) as { text?: string } | undefined
    const text = textPart?.text || ''
    if (text) {
      console.log(`${text}\n`)
    }
  }
}
