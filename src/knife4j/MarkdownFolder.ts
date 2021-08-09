import MarkdownTag from '@/knife4j/MarkdownTag'
import MenuInstance from '@/knife4j/MenuInstance'
import MarkdownFile from '@/knife4j/MarkdownFile'
import ld from 'lodash'

export default class MarkdownFolder extends MenuInstance {
  constructor (groupName: string, groupId: string, mdTag: MarkdownTag) {
    super()
    this.groupId = groupId
    this.groupName = groupName
    this.key = mdTag.id
    this.name = mdTag.name
    this.path = `${groupName}-${mdTag.id.substr(0, 10)}-omd`
  }

  addFile (mdFile: MarkdownFile) {
    const inst = new MenuInstance()
    ld.merge(inst, {
      groupName: this.groupName,
      groupId: this.groupId,
      key: mdFile.id,
      component: 'OtherMarkdown',
      name: mdFile.title,
      path: mdFile.id
    })
    this.children.push(inst)
  }
}
