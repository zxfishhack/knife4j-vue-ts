import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IGlobals {
  menuData: any[]
  language: string
  swagger? : any
  swaggerCurrentInstance? : any
  enableVersion : boolean
  enableAfterScript: boolean
  enableReloadCacheParameter: boolean
  currentMenuData: any[]
  serviceOptions: any[]
  settings: any
  defaultServiceOption: string
}

@Module({ namespaced: true, store, name: 'globals' })
export default class Globals extends VuexModule implements IGlobals {
  menuData = []
  language = 'zh-CN'
  swagger = null
  swaggerCurrentInstance = null
  enableVersion = false
  enableAfterScript = true
  enableReloadCacheParameter = false
  currentMenuData = []
  serviceOptions = []
  settings = {}
  defaultServiceOption = ''

  @Mutation
  setMenuData (state: IGlobals, menuData: any[]) {
    state.menuData = state.menuData.concat(menuData)
    state.currentMenuData = menuData
  }
}
