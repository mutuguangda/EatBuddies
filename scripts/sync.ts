import { getNotionData, transformNotionData } from '../lib/notion'
import { writeFileSync } from 'fs';
// import { NotionToMarkdown } from "notion-to-md";
import dayjs from 'dayjs'
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
})

main()

async function main() {
  const { response ,isSync } = await getNotionData()
  if (isSync) {
    return
  }
  const data = await transformNotionData(response)
  writeFileSync(path.resolve(__dirname, "../data/index.json"), JSON.stringify({
    ...data,
    syncTime: dayjs().valueOf()
  }, null, 2))
}
