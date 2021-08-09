import Vue from 'vue'
import KUtils from '@/core/utils'

class Knife4jModels extends Vue {
  instance: any
  setTags (key:string, value:string) {
    // 该方法是递归遍历tags的方法
    // console("setTags--------")
    // console(value);
  }

  setValue (key:string, value:any) {
    // 该方法是递归Models的方法
    // 判断是否已经赋值
    const that = this
    const tmp = this.instance[key]
    if (!tmp) {
      // 开始递归初始化
      const data = value
      for (const modelName in data) {
        const model = data[modelName]
        if (!model) {
          const params = model.params
          if (!params) {
            params.forEach(function (p:any) {
              if (p.schema) {
                // 存在
                // p.children=deepModel(shareModels,data,p,p);
                // 查找该schema的子类属性
                p.children = that.deepModel(data, p, p)
              }
            })
          }
        }
      }
      // 初始化一个空的instance对象
      this.instance[key] = data
      // window.//console("递归初始化完成-----------")
      // window.//console(this.instance[key])
    }
  }

  deepModel (data:any, param:any, rootParam:any) {
    const childrens:any[] = []
    const that = this
    const model = data[param.schemaValue]
    if (model != undefined && model != null) {
      if (model.params != undefined && model.params != null) {
        model.params.forEach(function (chp:any) {
          // 深拷贝一个对象
          const childrenParam = that.deepCopy(chp) as any
          childrenParam.pid = param.id
          // 判断是否是schema参数
          if (childrenParam.schema) {
            rootParam.parentTypes.push(param.schemaValue)
            // 判断该程序是否已经查找过了
            if (rootParam.parentTypes.indexOf(childrenParam.schemaValue) == -1) {
              childrenParam.children = that.deepModel(data, childrenParam, rootParam)
            }
          }
          childrens.push(childrenParam)
        })
      }
    }

    return childrens
  }

  deepCopy (source:any) {
    const target = {
      childrenTypes: source.childrenTypes,
      def: source.def,
      description: source.description,
      enum: source.enum,
      example: source.example,
      id: source.id,
      ignoreFilterName: source.ignoreFilterName,
      in: source.in,
      level: source.level,
      name: source.name,
      parentTypes: source.parentTypes,
      pid: source.pid,
      readOnly: source.readOnly,
      require: source.require,
      schema: source.schema,
      schemaValue: source.schemaValue,
      show: source.show,
      txtValue: source.txtValue,
      type: source.type,
      validateInstance: source.validateInstance,
      validateStatus: source.validateStatus,
      value: source.value
    }
    return target
  }

  getByModelName (key:string, modelName:string) {
    return this.instance[key][modelName]
  }

  addModels (key:string, modelName:string, childrens: any[]) {
    if (!KUtils.checkUndefined(this.instance[key])) {
      this.initInstance(key)
    }
    this.instance[key][modelName] = childrens
  }

  exists (key: string, modelName: string) {
    if (!KUtils.checkUndefined(this.instance[key])) {
      this.initInstance(key)
    }
    // 判断是否存在
    let flag = false
    const value = this.instance[key][modelName]
    if (value) {
      flag = true
    }
    return flag
  }
}

export default new Knife4jModels()
