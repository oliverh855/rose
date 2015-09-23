export default function compareVersion (oldVersion, newVersion) {
  var result = false

  oldVersion = oldVersion.split('.')
  newVersion = newVersion.split('.')

  for (var i = 0; i < (Math.max(oldVersion.length, newVersion.length)); i++) {
    if (oldVersion[i] === undefined) { oldVersion[i] = 0 }
    if (newVersion[i] === undefined) { newVersion[i] = 0 }

    if (Number(oldVersion[i]) < Number(newVersion[i])) {
      result = true
      break
    }
    if (oldVersion[i] !== newVersion[i]) {
      break
    }
  }
  return result
}
