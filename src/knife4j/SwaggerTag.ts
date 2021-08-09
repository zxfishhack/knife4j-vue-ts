import SwaggerApi from '@/knife4j/SwaggerApi'

export default class SwaggerTag {
  name = ''
  order = ''
  children: SwaggerApi[] = []
  description = ''
  hasNew = false
  hasChanged = false
}
