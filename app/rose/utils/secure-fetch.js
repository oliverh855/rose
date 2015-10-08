import { Promise } from 'rsvp'

import checkStatus from './check-status'
import verify from '../verify'

export default function (url, publicKey) {
  const fileQueries = [
    fetch(url),
    fetch(url + '.asc')
  ]

  return Promise.all(fileQueries)
    .then((responses) => responses.map((response) => checkStatus(response)))
    .then((files) => {
      const copies = files.map((file) => file.clone().text())
      return Promise.all(copies)
        .then((textFiles) => verify(...textFiles, publicKey))
        .then((fingerprint) => console.log(fingerprint))
        .then(() => files[0])
    })
}
