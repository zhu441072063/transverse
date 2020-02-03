import { getSql, setSql } from '@/api/sql'
import { zGetCodeAll, zGetCode } from '@/utils/common' // 数据字典
const util = {}
util.dateFormat = function(fmt, date) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}
//  根据设备类型获取数据
util.getDeviceList = function(type, callback) {
  var obj = {
    pageno: 1,
    pagesize: 5,
    sql: 1200,
    DEVICE_TYPE: type
  }
  var that = this
  setSql(obj).then(response => {
    callback(formatPosition(response.rows))
  })
}


function formatPosition(tableData) {
  for (const i in tableData) {
    tableData[i].PLACE = zGetCode('tunnelType', tableData[i].POSITION).concat("k", tableData[i].PILE_NUM1,"+", tableData[i].PILE_NUM2)
  }
  return tableData
}
export { util }
