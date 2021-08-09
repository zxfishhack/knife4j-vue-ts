/**
 * 控制台日志组件
 */
const debug = false

const logger = {
  info: function (msg: any) {
    if (debug) {
      if (window.console) {
        window.console.log(msg)
      }
    }
  },
  error: function (err: any) {
    if (window.console) {
      window.console.error(err)
    }
  }
}
export default logger
