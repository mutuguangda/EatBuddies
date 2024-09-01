import { writeFileSync } from "fs";
import { NotionAPI } from 'notion-client'

const api = new NotionAPI();

main()

async function main() {
  const response = await api.getPage('1641d10102034cedbfa739b91d4f8494')
  writeFileSync("response.json", JSON.stringify(response, null, 2));  
  const { block, collection } = response
  const data: any[] = []
  let collectionId: string, schema: Recordable
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
    data.push({
      id: key,
      ...Object.keys(properties).reduce((acc, key) => {
        const { name, type } = schema[key]
        if (type === 'file') {
          acc[(name as string).toLowerCase()] = properties[key].toString().split(',').pop()
        } else {
          acc[(name as string).toLowerCase()] = properties[key].toString()
        }
        return acc
      }, {} as Recordable)
    })
  })
  writeFileSync("data.json", JSON.stringify(data, null, 2));  
}
