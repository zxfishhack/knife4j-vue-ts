<template>
  <a-layout-content class="knife4j-body-content">
    <div class="swaggermododel">
      <a-collapse @change="modelChange">
        <a-collapse-panel
          v-for="model in modelNames"
          :header="model.name"
          :key="model.id"
          :class="model.modelClass()"
        >
          <a-table
            v-if="model.load"
            :defaultExpandAllRows="expanRows"
            :columns="columns"
            :dataSource="model.data"
            :rowKey="unionKey"
            size="middle"
            :pagination="page"
          >
          <template slot="descriptionValueTemplate" slot-scope="text">
            <span v-html="text"></span>
          </template>
          </a-table>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </a-layout-content>
</template>
<script lang="ts">
import KUtils from '@/core/utils'
import Constants from '@/store/constants'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { LocaleMessage } from 'vue-i18n'
import ModelInfo from '@/types/ModelInfo'

@Component
export default class SwaggerModels extends Vue {
  @Prop()
  private data!: any

  columns : LocaleMessage = []
  expanRows = true
  page = false
  modelNames :ModelInfo[] = []

  get language () {
    return this.$store.state.globals.language
  }

  get swagger () {
    return this.$store.state.globals.swagger
  }

  @Watch('language')
  languageChanged () {
    this.initI18n()
  }

  created () {
    this.initI18n()
    this.initModelNames()
  }

  getCurrentI18nInstance () {
    return this.$i18n.messages[this.language]
  }

  initI18n () {
    this.columns = this.getCurrentI18nInstance().table.swaggerModelsColumns
  }

  unionKey () {
    return KUtils.randomMd5()
  }

  initModelNames () {
    var key = Constants.globalTreeTableModelParams + this.data.instance.id
    // 根据instance的实例初始化model名称
    var treeTableModel = this.data.instance.swaggerTreeTableModels
    this.$Knife4jModels.setValue(key, treeTableModel)
    if (KUtils.checkUndefined(treeTableModel)) {
      for (var name in treeTableModel) {
        var random = Math.floor(Math.random() * (6 - 1 + 1) + 1)
        this.modelNames.push(new ModelInfo(id, name, random))
      }
    }
  }

  modelChange (key: any[]) {
    var that = this
    // console("当前激活面板key:" + that.activeKey);

    var instanceKey =
      Constants.globalTreeTableModelParams + this.data.instance.id
    // console("chang事件-------");
    // console(key);

    if (KUtils.arrNotEmpty(key)) {
      // 默认要取最后一个
      var lastIndex = key.length - 1
      var id = key[lastIndex]
      // console("key------------");
      this.modelNames.forEach(model => {
        if (model.id == id) {
          // console("找到匹配的model了===");
          // 找到该model,判断是否已加载
          if (!model.load) {
            // 未加载的情况下,进行查找数据
            /// /console("查找属性");
            /// /console(model);
            const modelData = []
            // 得到当前model的原始对象
            // 所有丶属性全部深拷贝,pid设置为-1
            // var originalModel = treeTableModel[model.name];
            var originalModel = that.$Knife4jModels.getByModelName(
              instanceKey,
              model.name
            )
            originalModel = that.swagger.analysisDefinitionRefTableModel(that.data.instance.id, originalModel)
            // console.log("初始化完成")
            // console.log(originalModel);
            // console("查找原始model:" + model.name);
            if (KUtils.checkUndefined(originalModel)) {
              // 存在
              // 查找属性集合
              if (KUtils.arrNotEmpty(originalModel.params)) {
                originalModel.params.forEach(function (nmd) {
                  // 第一层属性的pid=-1
                  var childrenParam = {
                    children: nmd.children,
                    childrenTypes: nmd.childrenTypes,
                    def: nmd.def,
                    description: nmd.description,
                    enum: nmd.enum,
                    example: nmd.example,
                    id: nmd.id,
                    ignoreFilterName: nmd.ignoreFilterName,
                    in: nmd.in,
                    level: nmd.level,
                    name: nmd.name,
                    parentTypes: nmd.parentTypes,
                    pid: '-1',
                    readOnly: nmd.readOnly,
                    require: nmd.require,
                    schema: nmd.schema,
                    schemaValue: nmd.schemaValue,
                    show: nmd.show,
                    txtValue: nmd.txtValue,
                    type: nmd.type,
                    validateInstance: nmd.validateInstance,
                    validateStatus: nmd.validateStatus,
                    value: nmd.value
                  }
                  modelData.push(childrenParam)
                  // 判断是否存在schema
                })
              }
            }
            /// /console(modelData);
            model.data = modelData
            model.load = true
          }
        }
      })
    }
    // 第二次复制
    that.expanRows = true
  }
}

</script>
<style lang="less" scoped>
@ColHeaderSize: 16px;
@ColTopHeight: 3px;

.swaggermododel {
  width: 98%;
  margin: 20px auto;
}
.ant-collapse {
  .panel-info {
    font-size: @ColHeaderSize;
    background: #bce8f1;
    margin-top: @ColTopHeight;
  }
  .panel-default {
    font-size: @ColHeaderSize;
    background: #ddd;
    margin-top: @ColTopHeight;
  }
  .panel-danger {
    font-size: @ColHeaderSize;
    background: #ebccd1;
    margin-top: @ColTopHeight;
  }
  .panel-success {
    font-size: @ColHeaderSize;
    background: #d6e9c6;
    margin-top: @ColTopHeight;
  }
  .panel-warning {
    font-size: @ColHeaderSize;
    background: #faebcc;
    margin-top: @ColTopHeight;
  }
}
</style>
