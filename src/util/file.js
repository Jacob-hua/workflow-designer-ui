export function readFile(fileHandle = () => {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onprogress = (event) => {
      const size = `(${Math.floor(event.total / 1000)} KB)`
      const progress = `${Math.floor((event.loaded / event.total) * 100)} %`
      console.log(`Loading size: ${size} progress: ${progress}`)
    }
    reader.onload = (event) => {
      resolve(event.target.result)
    }
    reader.onerror = (err) => {
      reject(err)
    }
    fileHandle(reader)
  })
}

export function selectFile(accepts = ['.xml', '.bpmn'], multiple = false) {
  if (!document || !document instanceof Document) {
    throw new Error('This is not a browser environment')
  }
  const inputElem = document.createElement('input')
  inputElem.setAttribute('type', 'file')
  inputElem.setAttribute('visibility', 'hidden')
  if (Array.isArray(accepts) && accepts.length > 0) {
    inputElem.setAttribute('accept', accepts.join(','))
  }
  if (multiple) {
    inputElem.setAttribute('multiple')
  }
  inputElem.click()
  return new Promise((resolve, reject) => {
    inputElem.addEventListener('change', () => {
      if (inputElem.files.length == 0) {
        reject()
      }
      resolve([...inputElem.files])
    })
  })
}

const mimes = {
  xml: 'application/bpmn20-xml',
  bpmn: 'application/bpmn20-xml',
  svg: 'image/svg+xml',
  xlsx: 'application/vnd.ms-excel'
}

export async function downloadFile(fileName, fileType, content, charset = 'utf-8') {
  if (!document || !document instanceof Document) {
    throw new Error('This is not a browser environment')
  }
  const blob = new Blob([content], {
    type: `${mimes[String.prototype.toLowerCase.call(fileType)]};charset=${charset}`,
  })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = `${fileName}.${fileType}`
  link.click()
  window.URL.revokeObjectURL(link.href)
}

export async function readFileToBlob(file, type) {
  const content = await readFile((reader) => reader.readAsText(file))
  return new Blob([content], {
    type: `${type};charset=utf-8`,
  })
}
