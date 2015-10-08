import checkStatus from '../utils/check-status'

class Network {
  constructor (properties, url) {
    this.url = url
    this.extractorsFileUrl = url + properties.extractors
    this.observersFileUrl = url + properties.observers
    this.name = properties.name
  }

  hasExtractors () {
    return !!this.extractorsFileUrl
  }

  hasObservers () {
    return !!this.observersFileUrl
  }

  getExtractors () {
    return fetch(this.extractorsFileUrl)
      .then(checkStatus)
      .then((file) => file.json())
  }

  getObservers () {
    return fetch(this.observersFileUrl)
      .then(checkStatus)
      .then((file) => file.json())
  }
}

export default Network
