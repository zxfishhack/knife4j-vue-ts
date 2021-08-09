import ld from 'lodash'
import KUtils from '@/core/utils'
import DebugAxios from 'axios'
import md5 from 'js-md5'
import {
  message
} from 'ant-design-vue'
import SwaggerBootstrapUiCacheApis from "@/knife4j/SwaggerBootstrapUiCacheApis"
import ServiceOption from "@/knife4j/ServiceOption"
import {Store} from "vuex"
import {IRootState} from "@/store"
import CreateSwaggerBootstrapUiInstance from "@/knife4j/SwaggerBootstrapUiInstanceFactory"
import SwaggerBootstrapUiInstance from "@/knife4j/SwaggerBootstrapUiInstance";
import LogStub from "@/knife4j/LogStub";
import MarkdownFolder from "@/knife4j/MarkdownFolder";
import MenuInstance, {
  DocumentManage,
  GlobalParam,
  HomePage,
  SwaggerModel,
  TagMenu,
  TagSubMenu
} from "@/knife4j/MenuInstance";

export class SwaggerBootstrapUiSettings {
  enableDebug=true//是否开启Debug调试栏
  enableFooter=true//是否默认显示底部Footer
  enableFooterCustom=false//是否自定义Footer
  footerCustomContent=""//自定义footer内容
  enableSearch=true//是否显示搜索框
  enableOpenApi=true//是否显示OpenApi原始规范结构
  enableHomeCustom=false// 是否开启主页自定义配置，默认false
  homeCustomLocation=''//自定义主页的Markdown文档内容
  enableGroup=true//是否显示分组下拉框，默认true(即显示)，一般情况下，如果是单个分组的情况下，可以设置该属性为false，即不显示分组，那么也就不用选择了

  enableSwaggerModels=true//是否显示界面中SwaggerModel功能
  swaggerModelName='Swagger Models'//重命名界面Swagger Model的显示名称
  enableReloadCacheParameter=false// 是否在每个Debug调试栏后显示刷新变量按钮,默认不显示
  enableAfterScript=true//调试Tab是否显示AfterScript功能,默认开启
  enableDocumentManage=true//是否显示界面中"文档管理"功能
  enableVersion=false//是否开启界面中对某接口的版本控制,如果开启，后端变化后Ui界面会存在小蓝点
  showApiUrl= false //接口api地址不显示
  showTagStatus= false //分组tag显示description属性,针对@Api注解没有tags属性值的情况
  enableSwaggerBootstrapUi= false //是否开启swaggerBootstrapUi增强
  treeExplain= true
  enableDynamicParameter= false //开启动态参数
  enableFilterMultipartApis= false //针对RequestMapping的接口请求类型,在不指定参数类型的情况下,如果不过滤,默认会显示7个类型的接口地址参数,如果开启此配置,默认展示一个Post类型的接口地址
  enableFilterMultipartApiMethodType= "POST" //默认保存类型
  enableRequestCache= true //是否开启请求参数缓存
  enableCacheOpenApiTable= false //是否开启缓存已打开的api文档
  enableHost=false//是否启用Host
  enableHostText=''//启用Host后文本
  language= 'zh-CN' //默认语言版本
}
export class SwaggerBootstrapUiOptions extends LogStub {
  //swagger请求api地址
  url = "mock/swagger-resources.json"
  i18n = 'zh-CN'
  desktop = false
  i18nVue = null
  //是否从地址栏设置i18n，如果是，那么默认以外部地址传入为主，否则会根据后台配置的setting中的language进行合并显示具体对应的i18n版本
  i18nFlag = false
  configUrl = 'mock/config.json'
  //用于控制是否请求configUrl的配置
  configSupport = false
  //用于控制是否请求configSecurityUrl的配置
  securitySupport = false
  routeParams? :any
  store?: Store<IRootState>
  localStore = {}
  plus = false
  layui = {}
  ace = {}
  treetable = {}
  cacheApis: SwaggerBootstrapUiCacheApis[] = []
  i18nInstance = {}
  settings = new SwaggerBootstrapUiSettings()
}

export default class SwaggerBootstrapUi extends SwaggerBootstrapUiOptions {
  swaggerData = null
  desktopCode? : string
  serviceOptions? :ServiceOption[]
  defaultServiceOption? :string
  menuData?: MenuInstance[]

  //文档id
  docId = 'content'
  title = 'knife4j'
  titleOfUrl = ''
  load = 1
  //tabid
  tabId = 'tabUl'
  tabContentId = 'tabContent'
  searchEleId = 'spanSearch'
  searchTxtEleId = 'searchTxt'
  menuId = 'menu'
  searchMenuId = 'searchMenu'
  //实例分组
  instances :SwaggerBootstrapUiInstance[] = []
  //当前分组实例
  currentInstance? :SwaggerBootstrapUiInstance
  //全局菜单
  globalMenuDatas:MenuInstance[] = []
  //动态tab
  globalTabId = 'sbu-dynamic-tab'
  globalTabs = []
  layTabFilter = 'admin-pagetabs'
  version = '1.9.6'
  requestOrigin = 'SwaggerBootstrapUi'
  requestParameter : any = {}
  extUrl = '/v2/api-docs'
  validateExtUrl = ''

  hasLoad = false

  configuration = {
    supportedSubmitMethods: [
      'get',
      'put',
      'post',
      'delete',
      'options',
      'head',
      'patch',
      'trace'
    ]
  }

  ajax = DebugAxios.create()

  constructor(options: SwaggerBootstrapUiOptions) {
    super()
    ld.merge(this, options)
    this.settings.language = options.i18n || 'zh-CN'

    this.ajax.interceptors.response.use(resp => {
      return resp.data
    })

    //this.welcome();
    this.initRequestParameters()
    this.initSettings().then()
    /* this.initUnTemplatePageI18n();
    this.initWindowWidthAndHeight();
    this.initApis();
    this.windowResize(); */
    //2019/08/28 13:16:50 支持configuration接口,主要是相关配置,目前支持属性supportedSubmitMethods(请求调试)
    //接口地址:/swagger-resources/configuration/ui
  }
  initRequestParameters() {
    const url = new URL(window.location.href)
    url.searchParams.forEach((value, key) => {
      this.requestParameter[KUtils.trim(key)] = KUtils.trim(value)
    })
    this.log('请求参数========================================')
    this.log(this.requestParameter)
  }

  async initSettings() {
    this.log("本地Settings初始化")
    //添加对knife4j-front版本的支持,静态版本不提供配置
    if (this.configSupport) {
      await this.configInit()
    }
    //加载分组接口
    await this.analysisGroup()
  }

  initApis() {
    if (window.localStorage) {
      const store = window.localStorage
      const cacheApis = store['SwaggerBootstrapUiCacheApis']
      if (cacheApis !== undefined && cacheApis !== null && cacheApis != '') {
        //var settings = JSON.parse(cacheApis)
        this.cacheApis = KUtils.json5parse(cacheApis)
      } else {
        this.cacheApis = []
      }
    }
  }

  async configInit() {
    try{
      const data = await this.ajax.get(this.configUrl, {
        timeout: 20000,
      }) as any
      if (data && data.hasOwnProperty('supportedSubmitMethods')) {
        const originalSupportSubmitMethods = data['supportedSubmitMethods']
        if (originalSupportSubmitMethods.length > 0) {
          const newSupports: string[] = []
          originalSupportSubmitMethods.forEach(function (method:string) {
            newSupports.push(method.toLowerCase())
          })
          this.configuration.supportedSubmitMethods = newSupports
        } else {
          this.configuration.supportedSubmitMethods = []
        }
      }
    } catch(e) {
      this.error(e)
    }
  }

  async analysisGroup() {
    try{
      let headers = {}
      if (this.desktop) {
        const loc = window.location.pathname;
        //默认根目录
        let code='ROOT';
        const reg=new RegExp('(?:/(.*?))?/doc.html',"ig");
        if(reg.exec(loc)){
          const c=RegExp.$1;
          if(KUtils.strNotBlank(c)){
            code=c;
          }
        }
        headers={
          'knife4j-gateway-code':code
        };
        this.desktopCode= code;
      }
      const data = await this.ajax.get(this.url, {timeout: 20000, headers: headers}) as any[]
      this.analysisGroupSuccess(data)
      //创建分组元素
      this.createGroupElement()
    }catch (e) {
      message.error('Knife4j文档请求异常')
      this.error(e)
    }
  }

  analysisGroupSuccess(data: any[] | string) {
    let groupData: any[]
    if (typeof data === 'string') {
      groupData = KUtils.json5parse(data)
    } else {
      groupData = data
    }
    this.log('响应分组json数据')
    this.log(groupData)
    let serviceOptions : ServiceOption[] = []
    let allGroupIds: string[] = []
    groupData.forEach((group) => {
      const g = CreateSwaggerBootstrapUiInstance(
        KUtils.toString(group.name, '').replace(/\//g,'-'),
        group.location,
        group.swaggerVersion
      )
      g.url = group.url
      //测试api接口JSON
      //g.url="/test/json";
      //Knife4j自研微服务聚合使用，默认是null
      g.header=KUtils.getValue(group,'header',null,true)
      g.basicAuth=KUtils.getValue(group,'basicAuth',null,true)
      g.servicePath=KUtils.getValue(group,'servicePath',null,true)
      g.desktop=this.desktop
      g.desktopCode=this.desktopCode
      var newUrl = ''
      //此处需要判断basePath路径的情况
      if (group.url !== null && group.url !== undefined && group.url != '') {
        newUrl = group.url
      } else {
        newUrl = group.location
      }
      g.extUrl=newUrl
      if (this.validateExtUrl === '') {
        this.validateExtUrl = g.extUrl
      }
      //判断当前分组url是否存在basePath
      if (
        group.basePath !== null &&
        group.basePath !== undefined &&
        group.basePath !== ''
      ) {
        g.baseUrl = group.basePath
      }

      //赋值查找缓存的id
      if (this.cacheApis.length > 0) {
        let cainstance : SwaggerBootstrapUiCacheApis | null = null
        this.cacheApis.forEach(ca => {
          if (ca.id == g.groupId) {
            cainstance = ca
          }
        })
        if (cainstance != null) {
          g.firstLoad = false

          g.cacheInstance = cainstance
          this.log(g)
          //g.groupApis=cainstance.cacheApis;
        }
      }
      if (!g.cacheInstance) {
        g.cacheInstance = new SwaggerBootstrapUiCacheApis(
          g.groupId,
          g.name
        )
      }
      //双向绑定
      serviceOptions.push({
        label: g.name,
        value: g.id
      })
      //增加所有分组id，为afterScript特性
      allGroupIds.push(g.id)
      this.instances.push(g)
    })
    //赋值分组id
    if(KUtils.arrNotEmpty(this.instances)){
      this.instances.forEach(inst=>{
        inst.allGroupIds=allGroupIds;
      })
    }
    //初始化所有
    this.serviceOptions=serviceOptions;
    this.store?.dispatch('globals/setServiceOptions', serviceOptions);
    //this.$Vue.serviceOptions = serviceOptions;
    if (serviceOptions.length > 0) {
      //this.$Vue.defaultServiceOption = serviceOptions[0].value;
      this.defaultServiceOption = serviceOptions[0].value;
      this.store?.dispatch('globals/setDefaultService', serviceOptions[0].value);
    }
  }

  createGroupElement() {
    //创建分组flag
    this.log("分组-------------------------------")
    //this.log(this.instances)
    //this.log(this.$Vue.$route.params)
    //此处需要根据当前访问hash地址动态设置访问的下拉组
    //待写,是否包含分组名称
    const urlParams = this.routeParams;
    if (KUtils.checkUndefined(urlParams)) {
      if (urlParams.hasOwnProperty('groupName')) {
        //是否不为空
        const gpName = urlParams.groupName;
        if (KUtils.checkUndefined(gpName) && gpName != '') {
          let selectInstance = this.selectInstanceByGroupName(gpName);
          this.log("包含分组名称")
          this.log(selectInstance)
          //双向绑定下拉框的服务选项
          //this.$Vue.defaultServiceOption = selectInstance.id;
          this.defaultServiceOption = selectInstance?.id;
          this.store?.dispatch('globals/setDefaultService', selectInstance?.id);
          this.analysisApi(selectInstance);
        } else {
          //默认加载第一个url
          this.analysisApi(this.instances[0]);
        }
      } else {
        //默认加载第一个url
        this.analysisApi(this.instances[0]);
      }
    } else {
      //默认加载第一个url
      this.analysisApi(this.instances[0]);
    }
  }

  selectInstanceByGroupName(name: string) {
    let instance : SwaggerBootstrapUiInstance | undefined;
    this.instances.forEach(function (group) {
      if (group.name == name) {
        instance = group;
        return;
      }
    })
    return instance;
  }

  async analysisApi(instance?: SwaggerBootstrapUiInstance) {
    if (!instance) {
      return
    }
    try {
      //赋值
      this.currentInstance = instance;
      if (!this.currentInstance?.load) {
        var api = instance.url;
        if (api === "") {
          api = instance.location;
        }
        //判断是否开启增强功能
        if (this.settings.enableSwaggerBootstrapUi) {
          api = instance.extUrl;
        }
        //这里判断url请求是否已加载过
        //防止出现根路径的情况
        if (api.indexOf('/') == 0) {
          api = api.substr(1);
        }
        //测试
        //api = 'run.json';
        //此处加上transformResponse参数,防止Long类型在前端丢失精度
        //https://github.com/xiaoymin/swagger-bootstrap-ui/issues/269
        var reqHeaders={'language':this.settings.language};
        var requestConfig={
          url: api,
          dataType: 'json',
          timeout: 20000,
          type: 'get',
          //# 发送一个语言的header头给后端
          transformResponse:[function(data:string){
            return KUtils.json5parse(data);
          }]
        };
        //针对Knife4jAggregationDesktop软件的请求头
        if(this.desktop){
          reqHeaders=Object.assign({},reqHeaders,{'knife4j-gateway-code':this.desktopCode});
        }
        if(KUtils.checkUndefined(this.currentInstance?.header)){
          //Knife4j自研Aggreration微服务聚合组件请求头
          reqHeaders=Object.assign({},reqHeaders,{'knfie4j-gateway-request':this.currentInstance?.header});
        }
        if(KUtils.checkUndefined(this.currentInstance?.basicAuth)){
          reqHeaders=Object.assign({},reqHeaders,{'knife4j-gateway-basic-request':this.currentInstance?.basicAuth});
        }
        requestConfig=Object.assign({},requestConfig,{headers:reqHeaders})
        try {
          const data = await this.ajax(requestConfig)
          this.analysisApiSuccess(data)
        } catch(e) {
          message.error('Knife4j文档请求异常')
          this.error(e);
        }
      } else {
        //更新当前缓存security
        this.createDescriptionElement();
        this.createDetailMenu(false);
        this.afterApiInitSuccess();
        this.store?.dispatch('globals/setSwaggerInstance', this.currentInstance);
      }
    } catch (err) {
      this.error(err);
      if (window.console) {
        console.error(err);
      }
    }
  }

  /**
   * 当swagger-api请求初始化完成后,初始化页面的相关操作
   * 包括搜索、打开地址hash地址、tab事件等等
   */
  afterApiInitSuccess() {
    this.initOpenTable()
  }
  /***
   * 已经打开的api缓存,下一次刷新时打开
   * 新版本需要通过tabs实现
   */
  initOpenTable() {
    if (!this.settings.enableCacheOpenApiTable) {
      return
    }
    if (window.localStorage && this.currentInstance) {
      const store = window.localStorage;
      let cacheApis = store["SwaggerBootstrapUiCacheOpenApiTableApis"] || "{}";
      //var settings = JSON.parse(cacheApis);
      const settings = KUtils.json5parse(cacheApis);
      const insId = this.currentInstance?.groupId;
      cacheApis = settings[insId] || [];

      for (const idx in cacheApis) {
        const cacheApi = cacheApis[idx];
        this.log(cacheApi)
      }
    }
  }

  analysisApiSuccess(data: any | string) {
    this.hasLoad = true
    this.log(data)
    var menu = null;
    if (typeof data === 'string') {
      menu = KUtils.json5parse(data);
    } else {
      menu = data;
    }

    this.currentInstance?.loadMenu(this, menu)

    //创建swaggerbootstrapui主菜单
    this.createDetailMenu(true);
    //opentab
    //this.initOpenTable();
    //this.afterApiInitSuccess();
    this.store?.dispatch('globals/setSwaggerInstance', this.currentInstance);
  }

  createDetailMenu(addFlag: boolean) {
    if (!this.currentInstance) {
      return
    }
    //创建菜单数据
    var menuArr : MenuInstance[] = [];
    this.log(this.currentInstance)
    var groupName = this.currentInstance.name;
    var groupId = this.currentInstance.id;
    //console.log("----------------createDetailMenu")
    //console.log(this.i18nInstance);
    //主页
    menuArr.push(HomePage(groupName, groupId, this.getI18n().menu.home))
    //是否有全局参数
    if(KUtils.arrNotEmpty(this.currentInstance.securityArrs)||KUtils.checkUndefined(this.currentInstance.oauths)){
      /* if (this.currentInstance?.securityArrs != null && this.currentInstance?.securityArrs.length > 0) { */
      menuArr.push(GlobalParam(groupName, groupId))
    }
    //Swagger通用Models add by xiaoyumin 2018-11-6 13:26:45
    //是否显示SwaggerModels
    if(this.settings.enableSwaggerModels){
      //重命名model
      var swaggerModelName=KUtils.getValue(this.settings,"swaggerModelName","Swagger Models",true);
      menuArr.push(SwaggerModel(groupName, groupId, swaggerModelName))
    }
    //是否显示文档管理
    if(this.settings.enableDocumentManage){
      //文档管理
      menuArr.push(DocumentManage(groupName, groupId, this.getI18n().menu))
    }
    //自定义文档
    //since2.0.6后直接判断,不用管增强配置
    if(KUtils.arrNotEmpty(this.currentInstance.markdownFiles)){
      this.currentInstance.markdownFiles.forEach(mdTag=>{
        const mdFolder = new MarkdownFolder(groupName, groupId, mdTag)
        if(KUtils.arrNotEmpty(mdTag.children)){
          mdTag.children.forEach(mdFile=>mdFolder.addFile(mdFile))
        }
        menuArr.push(mdFolder)
      })
    }
    //接口文档
    this.currentInstance.tags.forEach((tag) => {
      var len = tag.children.length;
      //console.log(tag);
      var _lititle = "";
      if (len == 0) {
        if (this.settings.showTagStatus) {
          _lititle = tag.name + "(" + tag.description + ")";
        } else {
          _lititle = tag.name;
        }
        //如果当前tag分组下不存在接口,当前tag的path不允许点击,否则会出现白板
        //https://gitee.com/xiaoym/knife4j/issues/I2CVTF
        //modified by xiaoymin 2021年5月3日 19:40:41
        menuArr.push(TagMenu(groupName, groupId, _lititle))
      } else {
        if (this.settings.showTagStatus) {
          _lititle = tag.name + "(" + tag.description + ")";
        } else {
          _lititle = tag.name;
        }
        const tagMenu = TagMenu(groupName, groupId, _lititle)
        tagMenu.path = groupName + "/" + tag.name
        tagMenu.hasNew = tag.hasNew || tag.hasChanged
        tag.children.forEach(function (child) {
          tagMenu.children.push(TagSubMenu(groupName, groupId, child));
        })
        //给接口数量赋值
        tagMenu.num = tagMenu.children.length;
        menuArr.push(tagMenu);

      }
    })
    var mdata = KUtils.formatter(menuArr, '/', undefined);
    //添加全局参数
    if (addFlag) {
      this.globalMenuDatas = this.globalMenuDatas.concat(mdata);
    }
    ////console(JSON.stringify(mdata))
    //双向绑定
    //console.log(mdata)

    this.menuData=mdata
    this.store?.dispatch("globals/setMenuData", mdata)
    //setGitVersion
    this.store?.dispatch("globals/setGitVersion",this.settings.enableVersion)
    this.log("菜单初始化完成...")
  }

  dispatchSettings() {
    this.store?.dispatch('globals/setAfterScript', this.settings.enableAfterScript)
    this.store?.dispatch('globals/setReloadCacheParameter', this.settings.enableReloadCacheParameter)
    this.store?.dispatch('globals/setSettings', this.settings)
  }

  createDescriptionElement() {

  }

  getI18n() : any {
    return {}
  }
}

