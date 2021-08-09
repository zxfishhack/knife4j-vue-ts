export default class LogStub {
  log(msg: any) {
    if (window.console) {
      window.console.log(msg)
    }
  }
  error(msg: any) {
    if (window.console) {
      window.console.error(msg)
    }
  }
  warn(msg: any) {
    if (window.console) {
      window.console.warn(msg)
    }
  }
}
