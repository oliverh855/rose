import Network from './network'
import checkStatus from '../utils/check-status'
import secureFetch from '../utils/secure-fetch'

class Repository {
  constructor (url, options = {secureMode: false}) {
    this.url = url
    this.baseFileUrl = url + 'base.json'
    this.baseFileSigUrl = url + 'base.json.asc'
    this.publicKeyUrl = url + 'public.key'
    this.secureMode = options.secureMode
  }

  getNetworks () {
    if (this.secureMode) {
      return this.getPublicKey()
        .then((publicKey) => secureFetch(this.baseFileUrl, publicKey))
        .then((file) => file.json())
        .then((json) => json.networks.map((networkProperties) => {
          return new Network(networkProperties, this.url)
        }))
    } else {
      return fetch(this.baseFileUrl)
        .then((file) => file.json())
        .then((json) => json.networks.map((networkProperties) => {
          return new Network(networkProperties, this.url)
        }))
    }
  }

  getPublicKey () {
    return fetch(this.publicKeyUrl)
      .then(checkStatus)
      .then((file) => file.text())
  }
}

export default Repository
