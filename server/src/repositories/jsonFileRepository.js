// server/src/repositories/jsonFileRepository.js
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.resolve(__dirname, '../data')

export class JsonFileRepository {
  constructor(fileName, fallback) {
    this.filePath = path.join(dataDir, fileName)
    this.fallback = fallback
  }

  async read() {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8')
      return JSON.parse(raw)
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.write(this.fallback)
        return this.fallback
      }
      throw error
    }
  }

  async write(data) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true })
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2))
    return data
  }
}
