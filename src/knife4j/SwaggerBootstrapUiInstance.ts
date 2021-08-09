import SwaggerBootstrapUiCacheApis from '@/knife4j/SwaggerBootstrapUiCacheApis'
import SwaggerBootstrapUi from '@/knife4j/SwaggerBootstrapUi'
import LogStub from '@/knife4j/LogStub'
import MarkdownTag from '@/knife4j/MarkdownTag'
import SwaggerTag from '@/knife4j/SwaggerTag'

export default class SwaggerBootstrapUiInstance extends LogStub {
  url = ''
  header: any;
  basicAuth: any;
  servicePath: any;
  desktop = false
  desktopCode: string | undefined;
  extUrl = ''
  baseUrl = ''
  groupId = ''
  firstLoad = true
  cacheInstance?: SwaggerBootstrapUiCacheApis
  name = ''
  id = ''
  allGroupIds: string[] = []
  load = false
  location = ''
  securityArrs: any[] = []
  oauths?: any;
  markdownFiles: MarkdownTag[] = []
  tags: SwaggerTag[] = []

  loadMenu (ui: SwaggerBootstrapUi, menu: any[]) {
    this.setInstanceBasicProperties(menu)
    // since2.0.6
    // this.openSettings(menu)
    // this.openDocuments(menu)
    // this.dispatchSettings();
    // this.analysisDefinition(menu);
    // this.mergeLocalSecurityContext();
    this.log(menu)
    // this.createDescriptionElement();
    // 当前实例已加载
    this.load = true
  }

  protected setInstanceBasicProperties (menu: any[]) {}
}
