"use server"

import { NotionAPI } from 'notion-client'
import { parsePageId } from 'notion-utils'
import * as dotenv from "dotenv";
import path from "path";
import dayjs from 'dayjs';
dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
});

const api = new NotionAPI();

export async function getNotionData() {
  const pageId = parsePageId(process.env.NOTION_DATABASE_URL)
  const response = await api.getPage(pageId)
  const { block, collection } = response
  const content: any[] = []
  let collectionId: string, schema: Recordable, categories: string[] = []
  Object.keys(block).forEach((key) => {
    const { 
      type, 
      parent_id,  
      properties = {}, 
    } = block[key].value
    if (type === 'collection_view') {
      // @ts-ignore Property 'collection_id' does not exist on type 'Block'
      collectionId = block[key].value.collection_id!
      schema = collection[collectionId!].value.schema
    }
    if (!schema || parent_id !== collectionId!) return
    content.push({
      id: key,
      ...Object.keys(properties).reduce((acc, key) => {
        const { name, type } = schema[key]
        if (type === 'file') {
          acc[(name as string).toLowerCase()] = properties[key].toString().split(',').pop()
        } else {
          if (name === 'Tags') {
            categories = schema[key].options.map((option: any) => option.value)
          }
          acc[(name as string).toLowerCase()] = properties[key].toString()
        }
        return acc
      }, {} as Recordable)
    })
  })
  return {
    categories,
    content,
    syncTime: dayjs().format()
  }
}
