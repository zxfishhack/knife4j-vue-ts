/* eslint no-useless-escape:0 */
// @ts-ignore
import md5 from 'js-md5'
// @ts-ignore
import JSON5 from './json5.js'
import { isObject } from 'lodash'
import MenuInstance from "@/knife4j/MenuInstance";

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g
const binaryContentType = {
  'application/octet-stream': true,
  'application/x-001': true,
  'text/h323': true,
  'drawing/907': true,
  'audio/x-mei-aac': true,
  'audio/aiff': true,
  'text/asa': true,
  'text/asp': true,
  'audio/basic': true,
  'application/vnd.adobe.workflow': true,
  'application/x-bmp': true,
  'application/x-c4t': true,
  'application/x-cals': true,
  'application/x-netcdf': true,
  'application/x-cel': true,
  'application/x-g4': true,
  'application/x-cit': true,
  'text/xml': true,
  'application/x-cmx': true,
  'application/pkix-crl': true,
  'application/x-csi': true,
  'application/x-cut': true,
  'application/x-dbm': true,
  'application/x-x509-ca-cert': true,
  'application/x-dib': true,
  'application/msword': true,
  'application/x-drw': true,
  'Model/vnd.dwf': true,
  'application/x-dwg': true,
  'application/x-dxf': true,
  'application/x-emf': true,
  'application/x-ps': true,
  'application/x-ebx': true,
  'image/fax': true,
  'application/fractals': true,
  'application/x-frm': true,
  'application/x-gbr': true,
  'image/gif': true,
  'application/x-gp4': true,
  'application/x-hmr': true,
  'application/x-hpl': true,
  'application/x-hrf': true,
  'text/x-component': true,
  'text/html': true,
  'image/x-icon': true,
  'application/x-iff': true,
  'application/x-igs': true,
  'application/x-img': true,
  'application/x-internet-signup': true,
  'java/*': true,
  'image/jpeg': true,
  'application/x-jpg': true,
  'application/x-laplayer-reg': true,
  'audio/x-liquid-secure': true,
  'audio/x-la-lms': true,
  'application/x-ltr': true,
  'video/x-mpeg': true,
  'video/mpeg4': true,
  'application/x-troff-man': true,
  'application/msaccess': true,
  'application/x-shockwave-flash': true,
  'message/rfc822': true,
  'audio/mid': true,
  'application/x-mil': true,
  'audio/x-musicnet-download': true,
  'application/x-javascript': true,
  'audio/mp1': true,
  'video/mpeg': true,
  'application/vnd.ms-project': true,
  'video/mpg': true,
  'audio/rn-mpeg': true,
  'image/pnetvue': true,
  'application/x-out': true,
  'application/x-pkcs12': true,
  'application/pkcs7-mime': true,
  'application/x-pkcs7-certreqresp': true,
  'application/x-pc5': true,
  'application/x-pcl': true,
  'application/pdf': true,
  'application/vnd.adobe.pdx': true,
  'application/x-pgl': true,
  'application/vnd.ms-pki.pko': true,
  'application/x-plt': true,
  'application/x-png': true,
  'application/vnd.ms-powerpoint': true,
  'application/x-ppt': true,
  'application/pics-rules': true,
  'application/x-prt': true,
  'application/postscript': true,
  'audio/vnd.rn-realaudio': true,
  'application/x-ras': true,
  'application/x-red': true,
  'application/vnd.rn-realsystem-rjs': true,
  'application/x-rlc': true,
  'application/vnd.rn-realmedia': true,
  'audio/x-pn-realaudio': true,
  'application/vnd.rn-realmedia-secure': true,
  'application/vnd.rn-realsystem-rmx': true,
  'image/vnd.rn-realpix': true,
  'application/vnd.rn-rsml': true,
  'video/vnd.rn-realvideo': true,
  'application/x-sat': true,
  'application/x-sdw': true,
  'application/x-slb': true,
  'drawing/x-slk': true,
  'application/smil': true,
  'text/plain': true,
  'application/futuresplash': true,
  'application/streamingmedia': true,
  'application/vnd.ms-pki.stl': true,
  'application/x-sty': true,
  'application/x-tg4': true,
  'image/tiff': true,
  'image/png': true,
  'drawing/x-top': true,
  'application/x-icq': true,
  'text/x-vcard': true,
  'application/vnd.visio': true,
  'application/x-vpeg005': true,
  'application/x-vsd': true,
  'audio/wav': true,
  'application/x-wb1': true,
  'application/x-wb3': true,
  'application/x-wk4': true,
  'application/x-wks': true,
  'audio/x-ms-wma': true,
  'application/x-wmf': true,
  'video/x-ms-wmv': true,
  'application/x-ms-wmz': true,
  'application/x-wpd': true,
  'application/vnd.ms-wpl': true,
  'application/x-wr1': true,
  'application/x-wrk': true,
  'application/x-ws': true,
  'application/vnd.adobe.xdp': true,
  'application/vnd.adobe.xfd': true,
  'application/x-xls': true,
  'application/x-xwd': true,
  'application/vnd.symbian.install': true,
  'application/x-x_t': true,
  'application/vnd.android.package-archive': true
}

function isUrl(path:string) {
  return reg.test(path)
}

class KUtils {
  getOAuth2Html() {
    return 'oauth/oauth2.html'
  }
  groupName(url:string, defaultName:string) {
    let gname = defaultName
    const reg = new RegExp('.*?group=(.*?)(&.*?)?$')
    if(reg.test(url)) {
      const tmpGroupName = RegExp.$1
      if(this.strNotBlank(tmpGroupName)) {
        if(tmpGroupName != defaultName) {
          gname = tmpGroupName
        }
      }
    }
    return gname
  }
  /**
   * @deprecated The method should not be used
   */
  oasmodel(oas2:boolean) {
    // 获取oas的definitions解析正则
    if(oas2) {
      return '#/definitions/(.*)$'
    } else {
      return '#/components/schemas/(.*)$'
    }
  }
  filterIgnoreParameters(inType: string, name: string, ignoreParameters: any | null) {
    // 是否过滤参数
    if(ignoreParameters === null) {
      return true
    }
    const tmpKeys = Object.keys(ignoreParameters || {})
    const ignoreParameterAllKeys : any[] = []
    const reg = new RegExp('\\[0\\]', 'gm')
    if(tmpKeys != null && tmpKeys.length > 0) {
      tmpKeys.forEach(tk => {
        ignoreParameterAllKeys.push(tk)
        if(tk.indexOf('[0]') > -1) {
          ignoreParameterAllKeys.push(tk.replace(reg, ''))
        }
      })
    }
    if(name.indexOf('[0]') > -1) {
      // 存在数组的情况
      if(ignoreParameterAllKeys.length > 0) {
        const containtsKey = ignoreParameterAllKeys.filter(ignoreName => name.startsWith(ignoreName))
        if(containtsKey.length > 0) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    } else {
      if(inType == 'query') {
        // console.log("ignoreParameterAllKeys")
        // console.log(ignoreParameterAllKeys)
        return !ignoreParameterAllKeys.some(key =>
          new RegExp(`^(${key}$|${key}[.[])`).test(name) || eval('/' + key + '/g').test(name))
      } else {
        return !ignoreParameterAllKeys.includes(name)
      }
    }
  }
  appendBasePath(paths:any, basePath:string) {
    let appendBasePathFlag = false
    try {
      if(this.checkUndefined(basePath) && this.strNotBlank(basePath) && basePath != '/') {
        const pathKeys = Object.keys(paths || {})
        const pathKeyLength = pathKeys.length
        let num = 0
        // https://gitee.com/xiaoym/knife4j/issues/I3B5BK
        const basePathStr = basePath + '/'
        for(let i = 0; i < pathKeys.length; i++) {
          if(pathKeys[i].startsWith(basePathStr)) {
            num++
          }
        }
        if(num == pathKeyLength) {
          // 已经追加过basePath，无需再次追加
          appendBasePathFlag = true
        }
      } else {
        // 其余情况都代表已经追加过
        appendBasePathFlag = true
      }
    } catch(e) {
      // ignore
      appendBasePathFlag = true
    }
    return appendBasePathFlag
  }
  filterIncludeParameters(inType, name, includeParameters) {
    if(includeParameters == null) {
      return true
    }
    const tmpKeys = Object.keys(includeParameters || {})
    const includeParameterAllKeys = []
    const reg = new RegExp('\\[0\\]', 'gm')
    if(tmpKeys != null && tmpKeys.length > 0) {
      tmpKeys.forEach(tk => {
        includeParameterAllKeys.push(tk)
        if(tk.indexOf('[0]') > -1) {
          includeParameterAllKeys.push(tk.replace(reg, ''))
        }
      })
    }
    if(name.indexOf('[0]') > -1) {
      // 存在数组的情况
      if(includeParameterAllKeys.length > 0) {
        const containtsKey = includeParameterAllKeys.filter(includeName => name.startsWith(includeName))
        if(containtsKey.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    } else {
      if(inType == 'query') {
        /* return includeParameterAllKeys.some(key =>
          new RegExp(`^(${key}$|${key}[.[])`).test(name)); */
        return includeParameterAllKeys.includes(name)
      } else if(inType == 'body') {
        return true
      } else {
        return includeParameterAllKeys.includes(name)
      }
    }
  }
  rootKeysPath(rootName, jsonInstance, includeKeys) {
    // 返回一个json对象的key属性集合
    let keyArrs = []
    if(jsonInstance != null && jsonInstance != undefined) {
      for(const key in jsonInstance) {
        var tmpRootName = rootName + '.' + key
        const parentKeyFlag = includeKeys.some(key => key.startsWith(tmpRootName))
        if(!parentKeyFlag) {
          keyArrs.push(tmpRootName)
          // 是否对象
          const tmpJson = jsonInstance[key]
          // 判断是否是数组
          if(Array.isArray(tmpJson)) {
            // 是
            const tmpArrName = rootName + '.' + key + '[0]'
            keyArrs = keyArrs.concat(this.rootKeysPath(tmpArrName, tmpJson[0], includeKeys))
            // keyArrs = keyArrs.concat(this.rootKeysPath(tmpRootName, tmpJson[0]));
          } else {
            if(isObject(tmpJson)) {
              keyArrs = keyArrs.concat(this.rootKeysPath(tmpRootName, tmpJson, includeKeys))
            }
          }
        }
      }
    }
    return keyArrs
  }
  binaryContentType(produces, contentType) {
    let binary = false
    let binaryType = ''
    if(produces != null && produces != undefined) {
      produces.forEach(function(p) {
        if(binaryContentType[p]) {
          binaryType = p
          binary = true
        }
      })
    }
    if(contentType != null) {
      if(!binary && binaryContentType[contentType]) {
        binary = true
        binaryType = contentType
      }
    }
    const bobj = {
      binary: binary,
      binaryType: binaryType
    }
    return bobj
  }
  copyOneObject(source) {
    const target = {}
    for(const k in source) {
      target[k] = source[k]
    }
    return target
  }
  randomMd5() {
    // 生成一个随机MD5码
    return md5(new Date().getTime().toString() +
      Math.floor(Math.random() * 100000).toString())
  }
  randomMd5Str(str) {
    // 生成一个随机MD5码
    return md5(new Date().getTime().toString() +
      Math.floor(Math.random() * 10000).toString() + str)
  }
  formatter(data:MenuInstance[], parentPath = '/', parentAuthority?:string) :MenuInstance[] {
    return data.map(item => {
      let {
        path
      } = item
      if(!isUrl(path)) {
        path = parentPath + item.path
      }
      const result = {
        ...item,
        path,
        authority: item.authority || parentAuthority
      }
      if(item.children) {
        result.children = this.formatter(
          item.children,
          `${parentPath}${item.path}/`,
          item.authority
        )
      }
      return result
    })
  }
  md5Id(obj) {
    let md5Id = ''
    try {
      if(obj != null && obj != undefined) {
        const str = JSON.stringify(obj)
        if(str != '') {
          const strArr = str.split('')
          strArr.sort()
          const newStr = strArr.join('')
          md5Id = md5(newStr)
        }
      }
    } catch(err) {}
    return md5Id
  }
  checkParamArrsExists(arr, param) {
    return(arr || []).some(row => row.name == param.name)
  }
  isChinese(keyword) {
    // 判断是否包含中文
    const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
    return reg.test(keyword)
  }
  json5stringifyNoFormat(rtext) {
    let ret = null
    try {
      ret = JSON5.stringify(rtext)
    } catch(err) {
      // console(err)
      ret = JSON.stringify(rtext)
    }
    return ret
  }
  json5stringify(rtext) {
    let ret = null
    try {
      ret = JSON5.stringify(rtext, null, 2)
    } catch(err) {
      // console(err)
      ret = JSON.stringify(rtext, null, 2)
    }
    return ret
  }
  json5stringifyFormat(rtext, format, num) {
    let ret = null
    try {
      ret = JSON5.stringify(rtext, format, num)
    } catch(err) {
      // console(err)
      ret = JSON.stringify(rtext, format, num)
    }
    return ret
  }
  json5parse(rtext) {
    let ret = null
    try {
      ret = JSON5.parse(rtext)
    } catch(err) {
      // console(err)
      ret = JSON.parse(rtext)
    }
    return ret
  }
  filterJsonObject(prefix, originalJson, filterObject) {
    let _tmpValue = null
    try {
      _tmpValue = utils.filterObject(prefix, originalJson, filterObject)
    } catch(err) {
      _tmpValue = originalJson
    }
    return _tmpValue
  }
  filterObject(preName, originalJsonObject, filterObject) {
    let newObj = {}
    if(filterObject != undefined && filterObject != null) {
      for(const x in originalJsonObject) {
        const _tmp = originalJsonObject[x]
        const filterName = preName + '.' + x
        if(!filterObject.hasOwnProperty(filterName)) {
          newObj[x] = _tmp
        }
        const _type = utils.genericType(_tmp)
        if(_type == 'object') {
          newObj[x] = utils.filterObject(filterName, _tmp, filterObject)
        } else if(_type == 'array') {
          const _t1 = _tmp[0]
          const _na = []
          _na.push(utils.filterObject(filterName, _t1, filterObject))
          newObj[x] = _na
        }
      }
    } else {
      newObj = originalJsonObject
    }

    return newObj
  }
  genericType(value) {
    const _tmp = Object.prototype.toString.call(value)
    let _tmpType = ''
    if(_tmp != null && _tmp != undefined) {
      if(_tmp.indexOf('Array') != -1) {
        _tmpType = 'array'
      } else if(_tmp.indexOf('Object') != -1) {
        _tmpType = 'object'
      }
    }
    return _tmpType
  }
  getJsonKeyLength(json) {
    let size = 0
    if(json != null) {
      for(key in json) {
        if(json.hasOwnProperty(key)) size++
      }
    }
    return size
  }
  regexMatchStr(regex, str) {
    let flag = false
    if(regex != null && regex != undefined && str != null && str != undefined) {
      const matchResult = str.match(regex)
      if(matchResult != null) {
        flag = true
      }
    }
    return flag
  }
  searchMatch(regex, str) {
    let flag = false
    if(regex != null && regex != undefined && str != null && str != undefined) {
      /* var matchResult = str.match(regex);
      if(matchResult != null) {
        flag = true;
      } */
      flag = new RegExp(regex, 'ig').test(str)
    }
    return flag
  }
  validateJSR303(parameter, origin) {
    const max = origin.maximum
    const min = origin.minimum
    const emin = origin.exclusiveMinimum
    const emax = origin.exclusiveMaximum
    const pattern = origin.pattern
    const maxLength = origin.maxLength
    const minLength = origin.minLength
    if(max || min || emin || emax) {
      parameter.validateStatus = true
      parameter.validateInstance = {
        minimum: min,
        maximum: max,
        exclusiveMaximum: emax,
        exclusiveMinimum: emin
      }
    } else if(pattern) {
      parameter.validateStatus = true
      parameter.validateInstance = {
        pattern: origin.pattern
      }
    } else if(maxLength || minLength) {
      parameter.validateStatus = true
      parameter.validateInstance = {
        maxLength: maxLength,
        minLength: minLength
      }
    }
  }
  checkUndefined(obj: undefined | null | any) {
    let flag = false
    if(obj !== undefined && obj !== null && typeof(obj) !== 'undefined') {
      flag = true
    }
    return flag
  }
  arrNotEmpty(arr: undefined | null | any[]) {
    // 集合非空
    let flag = false
    if(arr != undefined && arr.length > 0) {
      flag = true
    }
    return flag
  }
  arrEmpty(arr: undefined | null | any[]) {
    return !this.arrNotEmpty(arr)
  }
  strBlank(str) {
    return !this.strNotBlank(str)
  }
  strNotBlank(str) {
    let flag = false
    if(
      str != undefined &&
      str != null &&
      str != ''
    ) {
      flag = true
    }
    return flag
  }
  propValue(key, obj, defaultValue) {
    let t = defaultValue
    if(obj.hasOwnProperty(key)) {
      t = obj[key]
    }
    return t
  }
  getExample(key, obj, defaultValue) {
    let v = this.propValue(key, obj, defaultValue)
    // 判断是否是双精度64位，如果是，直接返回
    if(isNumber(v)) {
      return v
    } else {
      if(typeof(v) === 'object') {
        // v=this.json5stringify(v);
        v = this.json5stringifyNoFormat(v)
      }
    }
    return v
  }
  checkIsBasicType(type) {
    const basicTypes = ['string', 'integer', 'number', 'object', 'boolean', 'int32', 'int64', 'float', 'double']
    let flag = false
    if(type != null) {
      if(basicTypes.indexOf(type) > -1) {
        flag = true
      }
    }
    return flag
  }
  getBasicTypeValue(type) {
    let propValue = ''
    // 是否是基本类型
    if(type == 'integer') {
      propValue = 0
    }
    if(type == 'boolean') {
      propValue = true
    }
    if(type == 'object') {
      propValue = {}
    }
    if(type == 'number') {
      propValue = parseFloat(0)
    }
    return propValue
  }
  getValue(obj, key, defaultValue, checkEmpty) {
    let val = defaultValue
    if(obj != null && obj != undefined) {
      if(obj.hasOwnProperty(key)) {
        val = obj[key]
        if(checkEmpty) {
          if(val == null || val == '') {
            val = defaultValue
          }
        }
      }
    }
    return val
  }
  getClassName(item, oas2) {
    if(oas2) {
      var regex = new RegExp('#/definitions/(.*)$', 'ig')
      if(regex.test(item)) {
        var ptype = RegExp.$1
        return ptype
      }
    } else {
      var regex = new RegExp('#/components/schemas/(.*)$', 'ig')
      if(regex.test(item)) {
        var ptype = RegExp.$1
        return ptype
      }
    }

    return null
  }
  getRefParameterName(item) {
    const regex = new RegExp('#/components/parameters/(.*)$', 'ig')
    if(regex.test(item)) {
      const ptype = RegExp.$1
      return ptype
    }
    return null
  }
  trim(text) {
    const whitespace = '[\\x20\\t\\r\\n\\f]'
    const rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g')
    return text == null ? '' :(text + '').replace(rtrim, '')
  }
  getStringValue(obj) {
    let str = ''
    if(obj != undefined && typeof(obj) !== 'undefined' && obj != null) {
      str = obj.toString()
    }
    return str
  }
  toString(obj, defutStr) {
    let str = defutStr
    if(obj != undefined && typeof(obj) !== 'undefined' && obj != null) {
      str = obj.toString()
    }
    return str
  }
  randomNumber() {
    return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  htmlEncode(html) {
    if(html !== null) {
      return html.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    } else {
      return ''
    }
  }
  jsString(s) {
    s = JSON.stringify(s).slice(1, -1)
    return utils.htmlEncode(s)
  }
  replaceMultipLineStr(str) {
    if(str != null && str != undefined && str != '') {
      const newLinePattern = /(\r\n|\n\r|\r|\n)/g
      if(newLinePattern.test(str)) {
        const newDes = str.replace(newLinePattern, '\\n')
        return newDes
      }
      return str
    }
    return ''
  }
  camelCase(str) {
    if(str != null && str != undefined && str != '') {
      if(str.length == 1) {
        return str.toLocaleLowerCase()
      } else {
        return str.substr(0, 1).toLocaleLowerCase() + str.substr(1)
      }
    }
    return ''
  }
  generUUID() {
    return(utils.randomNumber() + utils.randomNumber() + '-' + utils.randomNumber() + '-' + utils.randomNumber() + '-' + utils.randomNumber() + '-' + utils.randomNumber() + utils.randomNumber() + utils.randomNumber())
  }
  base64Encode(str) {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    let out = ''
    let i = 0
    const len = str.length
    let c1; let c2; let c3
    while(i < len) {
      c1 = str.charCodeAt(i++) & 0xff
      if(i == len) {
        out += CHARS.charAt(c1 >> 2)
        out += CHARS.charAt((c1 & 0x3) << 4)
        out += '=='
        break
      }
      c2 = str.charCodeAt(i++)
      if(i == len) {
        out += CHARS.charAt(c1 >> 2)
        out += CHARS.charAt(((c1 & 0x3) << 4) |((c2 & 0xF0) >> 4))
        out += CHARS.charAt((c2 & 0xF) << 2)
        out += '='
        break
      }
      c3 = str.charCodeAt(i++)
      out += CHARS.charAt(c1 >> 2)
      out += CHARS.charAt(((c1 & 0x3) << 4) |((c2 & 0xF0) >> 4))
      out += CHARS.charAt(((c2 & 0xF) << 2) |((c3 & 0xC0) >> 6))
      out += CHARS.charAt(c3 & 0x3F)
    }
    return out
  }
  binToBase64(bitString) {
    const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('') // 索引表
    let result = ''
    const tail = bitString.length % 6
    const bitStringTemp1 = bitString.substr(0, bitString.length - tail)
    let bitStringTemp2 = bitString.substr(bitString.length - tail, tail)
    for(let i = 0; i < bitStringTemp1.length; i += 6) {
      const index = parseInt(bitStringTemp1.substr(i, 6), 2)
      result += code[index]
    }
    bitStringTemp2 += new Array(7 - tail).join('0')
    if(tail) {
      result += code[parseInt(bitStringTemp2, 2)]
      result += new Array((6 - tail) / 2 + 1).join('=')
    }
    return result
  }
}

export default new KUtils()
