import store from '@/store'

/**
 * each方法
 */
export function each(object, callback) {
  var type = (function() {
    switch (object.constructor) {
      case Object:
        return 'Object'
      case Array:
        return 'Array'
      case NodeList:
        return 'NodeList'
      default:
        return 'null'
    }
  })()
  // 为数组或类数组时, 返回: index, value
  if (type === 'Array' || type === 'NodeList') {
    // 由于存在类数组NodeList, 所以不能直接调用every方法
    [].every.call(object, function(v, i) {
      return callback.call(v, i, v) !== false
    })
  } else if (type === 'Object') { // 为对象格式时,返回:key, value
    for (var i in object) {
      if (callback.call(object[i], i, object[i]) === false) {
        break
      }
    }
  }
}

/**
 * 划线方法
 */
export function lineStyle(x1, y1, x2, y2, lineWidth = 4, color = 'black') {
  let rectX = x1 < x2 ? x1 : x2
  let rectY = y1 < y2 ? y1 : y2
  let rectWidth = Math.abs(x1 - x2)
  let rectHeight = Math.abs(y1 - y2)
  //弦长
  let stringWidth = Math.ceil(Math.sqrt((rectWidth * rectWidth) + (rectHeight *
    rectHeight)))
  let xPad = (rectWidth - stringWidth) / 2
  let yPad = (rectHeight - lineWidth) / 2
  let radNum = Math.atan2((y1 - y2), (x1 - x2))
  return `
                    position: absolute;
                    width: ${ stringWidth }px;
                    height: ${ lineWidth }px;
                    background-color: ${ color };
                    transform: translate(${ rectX + xPad }px, ${ rectY + yPad }px) rotate(${ radNum }rad);
                `
}

/**
 * 递归无限级
 * @param {data} 数据
 * @param {parent} 父ID字段名称
 * @param {id} ID字段名称
 * @param {children} 子字段名称
 * @param {parentid} 父id
 */
export function zTree(data, parent, id, children, parentid = 0) {
  const newData = []
  each(data, function(index, val) {
    if (val[parent] == parentid) {
      // console.log(val)
      const newVal = val
      const child = zTree(data, parent, id, children, val[id])
      if (child) newVal[children] = child
      newData.push(newVal)
    }
  })
  return newData
}
/**
 * 获取字典列表
 * @param {codeName} 字典标识
 */
export function zGetCodeAll(codeName) {
  const codeCaches = store.getters.codeCaches
  const codeDirCaches = store.getters.codeDirCaches
  var id = 0
  for (let v of codeDirCaches) {
    if (v.CODENAME === codeName) id = v.ID
  }
  if (!id) return []
  var result = []
  for (let v of codeCaches) {
    if (v.DIRID === id) result.push(v)
  }
  return result
}

/**
 * 获取字典标识-含义
 * @param {codeName} 字典标识-含义
 */
export function zGetCodeValue(codeName) {
  const codeDirCaches = store.getters.codeDirCaches
  var result = ''
  for (const v of codeDirCaches) {
    if (v.CODENAME === codeName) result = v.CODEMEAN
  }
  return result
}

/**
 * 获取字典名称
 * @param {codeName} 字典标识
 * @param {val} 字典值
 */
export function zGetCode(codeName, val) {
  const codeCaches = store.getters.codeCaches
  const codeDirCaches = store.getters.codeDirCaches
  var id = 0
  for (let v of codeDirCaches) {
    if (v.CODENAME === codeName) id = v.ID
  }
  if (!id) return []
  var result = ''
  for (let v of codeCaches) {
    if (v.DIRID === id && v.CODEVALUE == val) result = v.CODELABEL
  }
  return result
}

/**
 * 获取字典目录
 * @param {name} 目录名称
 */
export function zGetDir(name) {
  const codeDirCaches = store.getters.codeDirCaches
  var result = []
  var id = 0
  for (let v of codeDirCaches) {
    if (v.CODENAME === name) id = v.ID
  }
  for (let v of codeDirCaches) {
    if (v.PARENTID === id) result.push(v)
  }
  return result
}

/**
 * 查找元素是否存在数组
 * @param {search} 查找的元素
 * @param {array} 数组
 */
export function in_array(search, array) {
  for (var i in array) {
    if (array[i]==search) {
      return true
    }
  }
  return false
}
/**
 * 筛选菜单权限
 * @param {name} 目录名称
 */
export function menuDg(menu) {
  const roule = ['1', '2']
  const newMenu = []
  each(menu, function(index, val) {
    if (in_array(index + 1, roule)) {
      newMenu.push(val)
    }
    if (index + 1==menu.length) {
      newMenu.push(val)
    }
  })
  return newMenu
}
