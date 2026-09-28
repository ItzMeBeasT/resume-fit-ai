import { PDFParse } from 'pdf-parse'

export async function readResume(buffer) {
  const parser = new PDFParse({ data: buffer })

  try {
    const { text } = await parser.getText()

    return text
      .replace(/\r\n?/g, '\n')
      .replace(/^\s*--\s*\d+\s+of\s+\d+\s*--\s*$/gm, '')
      .replace(/\n[\t ]*\n(?:[\t ]*\n)+/g, '\n\n')
      .trim()
  } finally {
    await parser.destroy()
  }
}
