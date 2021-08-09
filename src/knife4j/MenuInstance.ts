import ld from 'lodash'
import md5 from "js-md5"
import SwaggerApi from "@/knife4j/SwaggerApi"
import KUtils from '@/core/utils'
export default class MenuInstance {
  groupName = ''
  groupId = ''
  key = ''
  name = ''
  i18n = 'other'
  icon = 'icon-APIwendang'
  path = ''
  component = ''
  tabName = ''
  num?:number
  menuClass = ''
  hasNew = false
  children: MenuInstance[] = []
  authority?:string
}

export function HomePage(groupName: string, groupId: string, name: string) {
  const inst = new MenuInstance()
  ld.merge(inst, {
    groupName: groupName,
    groupId: groupId,
    key: 'kmain',
    /* name: '主页', */
    name: name,
    i18n:'home',
    component: 'Main',
    icon: 'icon-home',
    path: 'home'
  })

  return inst
}

export function GlobalParam(groupName: string, groupId: string) {
  const inst = new MenuInstance()
  ld.merge(inst, {
    groupName: groupName,
    groupId: groupId,
    key: 'Authorize' + md5(groupName),
    name: 'Authorize',
    tabName: 'Authorize(' + groupName + ')',
    component: 'Authorize',
    icon: 'icon-authenticationsystem',
    path: 'Authorize/' + groupName,
  })

  return inst
}

export function SwaggerModel(groupName: string, groupId: string, swaggerModelName: string) {
  const inst = new MenuInstance()
  ld.merge(inst, {
    groupName: groupName,
    groupId: groupId,
    key: 'swaggerModel' + md5(groupName),
    //name: 'Swagger Models',
    name:swaggerModelName,
    component: 'SwaggerModels',
    tabName: swaggerModelName+'('+groupName+')',
    icon: 'icon-modeling',
    path: 'SwaggerModels/' + groupName,
  })
  return inst
}

export function DocumentManage(groupName: string, groupId: string, menu: any) {
  const inst = new MenuInstance()
  ld.merge(inst, {
    groupName: groupName,
    groupId: groupId,
    key: 'documentManager' + md5(groupName),
    i18n:'manager',
    /* name: '文档管理', */
    name: menu.manager, //inst.getI18n().menu.manager
    icon: 'icon-zdlxb',
    path: 'documentManager'
  })
  const globalParams = new MenuInstance()
  ld.merge(globalParams, {
    groupName: groupName,
    groupId: groupId,
    key: 'globalParameters' + md5(groupName),
    /*  name: '全局参数设置',
      tabName: '全局参数设置(' + groupName + ')', */
    name: menu.globalsettings,
    i18n:'globalsettings',
    tabName: menu.globalsettings+'(' + groupName + ')',
    component: 'GlobalParameters',
    path: 'GlobalParameters-' + groupName
  })
  inst.children.push(globalParams)
  const offlineDoc = new MenuInstance()
  ld.merge(offlineDoc, {
    groupName: groupName,
    groupId: groupId,
    key: 'OfficelineDocument' + md5(groupName),
    /*  name: '离线文档',
      tabName: '离线文档(' + groupName + ')', */
    name: menu.officeline,
    i18n:'officeline',
    tabName: menu.officeline+'(' + groupName + ')',
    component: 'OfficelineDocument',
    path: 'OfficelineDocument-' + groupName
  })
  inst.children.push(offlineDoc)
  const settings = new MenuInstance()
  ld.merge(settings, {
    groupName: groupName,
    groupId: groupId,
    key: 'Settings' + md5(groupName),
    /* name: '个性化设置', */
    name: menu.selfSettings,
    i18n:'selfSettings',
    component: 'Settings',
    path: 'Settings'
  })
  inst.children.push(settings)

  return inst
}

export function TagMenu(groupName: string, groupId: string, name: string) {
  const inst = new MenuInstance()
  ld.merge(inst, {
    groupName: groupName,
    groupId: groupId,
    key: md5(name),
    name: name,
    icon: 'icon-APIwendang',
    //path: groupName + "/" + tag.name
    //不存在接口,直接指向home主页
    path:""
  })

  return inst
}

export function TagSubMenu(groupName: string, groupId: string, tag: SwaggerApi) {
  const inst = new MenuInstance()
  ld.merge(inst, {
    groupName: groupName,
    groupId: groupId,
    key: md5(groupName + tag.summary + tag.operationId),
    name: tag.summary,
    description: tag.description,
    path: tag.operationId,
    component: 'ApiInfo',
    hasNew: tag.hasNew || tag.hasChanged,
    deprecated: tag.deprecated,
    //用于搜索
    url: tag.url,
    method: tag.methodType.toUpperCase(),
    menuClass: 'knife4j-menu-left-style'
  })

  return inst
}
