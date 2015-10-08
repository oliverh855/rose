import { Promise } from 'rsvp'

function backboneFetch (backboneObject) {
  return new Promise((resolve, reject) => {
    backboneObject.fetch({
      success: (model, response, options) => {
        resolve(model)
      },
      error: (mode, response, options) => {
        reject(response)
      }
    })
  })
}

function backboneSave (backboneObject, attrs = {}) {
  return new Promise((resolve, reject) => {
    backboneObject.save(attrs, {
      success: (model, response, options) => {
        resolve(model)
      },
      error: (mode, response, options) => {
        reject(response)
      }
    })
  })
}

export default {
  backboneFetch,
  backboneSave
}
