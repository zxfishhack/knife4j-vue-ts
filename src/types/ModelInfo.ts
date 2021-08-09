import ModelData from '@/types/ModelData'

export default class ModelInfo {
  id = ''
  name = ''
  load = false
  data: ModelData[] = []
  random = 1

  constructor (id: string, name: string, random: number) {
    this.id = id
    this.name = name
    this.random = random
  }

  modelClass () {
    let cname = 'panel-default'
    switch (this.random) {
      case 1:
        cname = 'panel-success'
        break
      case 2:
        cname = 'panel-success'
        break
      case 3:
        cname = 'panel-info'
        break
      case 4:
        cname = 'panel-warning'
        break
      case 5:
        cname = 'panel-danger'
        break
      case 6:
        cname = 'panel-default'
        break
    }
    return cname
  }
}
