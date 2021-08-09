// @ts-ignore
import localForage from 'localforage'
/**
 * 创建默认实例
 */
class LocalStore {
  getItem (key: string) {
    return new Promise((resolve, reject) => {
      localForage.getItem(key).then((value:any) => {
        resolve(value)
      }).catch((err:any) => {
        reject(err)
      })
    })
  }

  setItem (key:string, value:any) {
    return new Promise((resolve, reject) => {
      localForage.setItem(key, value).then((value:any) => {
        resolve(value)
      }).catch((err:any) => {
        reject(err)
      })
    })
  }

  removeItem (key:string) {
    return new Promise<void>((resolve, reject) => {
      localForage.removeItem(key).then(() => {
        resolve()
      }).catch((err:any) => {
        reject(err)
      })
    })
  }

  clear () {
    return new Promise<void>((resolve, reject) => {
      localForage.clear().then(() => {
        resolve()
      }).catch((err:any) => {
        reject(err)
      })
    })
  }

  length () {
    return new Promise((resolve, reject) => {
      localForage.length().then((numberOfKeys:number) => {
        resolve(numberOfKeys)
      }).catch((err:any) => {
        reject(err)
      })
    })
  }

  key (keyIndex:number) {
    return new Promise((resolve, reject) => {
      localForage.key(keyIndex).then((keyName:string) => {
        resolve(keyName)
      }).catch((err:any) => {
        reject(err)
      })
    })
  }

  keys () {
    return new Promise((resolve, reject) => {
      localForage.keys().then((keys:string[]) => {
        resolve(keys)
      }).catch((err:any) => {
        reject(err)
      })
    })
  }

  iterate () {
    return new Promise((resolve, reject) => {
      localForage.iterate((value:string, key:string, iterationNumber:number) => {
        resolve([value, key, iterationNumber])
      }).then((result:any) => {
        resolve(result)
      }).catch((err:any) => {
        // This code runs if there were any errors
        reject(err)
      })
    })
  }

  setDriver (driverName:string | string[]) {
    return new Promise((resolve, _) => {
      resolve(localForage.setDriver(driverName))
    })
  }

  config (options:any) {
    return new Promise((resolve, _) => {
      resolve(localForage.config(options))
    })
  }

  createInstance (options:any) {
    return new Promise((resolve, _) => {
      resolve(localForage.createInstance(options))
    })
  }
}

const localStorage = new LocalStore()

export default localStorage
