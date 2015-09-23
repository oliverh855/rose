import { Promise } from 'rsvp'

import ConfigModel from './models/system-config'
import NetworkCollection from './collections/networks'
import ExtractorCollection from './collections/extractors'
import ObserverCollection from './collections/observers'

import Repository from './classes/repository'
import { backboneFetch } from './utils/backbone-promises'

function update () {
  return backboneFetch(new ConfigModel())
    .then((config) => {
      const repositoryUrl = config.get('repositoryURL')
      const repository = new Repository(repositoryUrl, {secureMode: true})

      const networksQueries = [
        repository.getNetworks(),
        backboneFetch(new NetworkCollection())
      ]

      return Promise.all(networksQueries)
        .then((networks) => {
          if (!networks || networks.length < 2) return

          const remoteNetworks = networks[0]
          const localNetworks = networks[1]

          return Promise.all(remoteNetworks.map((remoteNetwork) => {
            const network = localNetworks.findWhere({name: remoteNetwork.name})

            if (network) {
              const requests = []

              if (remoteNetwork.hasExtractors()) requests.push(remoteNetwork.getExtractors())
              if (remoteNetwork.hasObservers()) requests.push(remoteNetwork.getObservers())

              return Promise.all(requests)
                .then((responses) => {
                  return responses.reduce((sequence, list) => {
                    if (list[0].type === 'input' || list[0].type === 'click') {
                      return sequence.then(() => network.updateObservers(list))
                    } else {
                      return sequence.then(() => network.updateExtractors(list))
                    }
                  }, Promise.resolve())
                })
            }
          }))
        })
    })
    .catch((error) => console.log(error))
}

function load (networks) {
  const collectionQueries = [
    backboneFetch(new NetworkCollection()),
    backboneFetch(new ExtractorCollection()),
    backboneFetch(new ObserverCollection())
  ]

  return Promise.all(collectionQueries)
    .then((collections) => {
      const [
        networkCol,
        extractorCol,
        observerCol
      ] = collections

      networks.forEach((network) => {
        network.observers.forEach((observer) => observerCol.create(observer))
        network.extractors.forEach((extractor) => extractorCol.create(extractor))

        delete network.extractors
        delete network.observers
        networkCol.create(network)
      })
    })
    .catch((error) => console.log(error))
}

export default {update, load}
