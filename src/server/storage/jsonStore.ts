import { promises as fs } from 'fs'
import path from 'path'

const baseDir = process.env.DATA_DIR || path.join(process.cwd(), 'data')

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

export async function readJSON<T>(file: string, fallback: T): Promise<T> {
  const full = path.join(baseDir, file)
  try {
    const buf = await fs.readFile(full, 'utf8')
    return JSON.parse(buf) as T
  } catch {
    return fallback
  }
}

export async function writeJSON<T>(file: string, data: T): Promise<void> {
  const full = path.join(baseDir, file)
  await ensureDir(path.dirname(full))
  await fs.writeFile(full, JSON.stringify(data, null, 2), 'utf8')
}


