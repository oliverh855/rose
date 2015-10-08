/*
Copyright (C) 2015
    Oliver Hoffmann <oliverh855@gmail.com>
    Felix Epp <work@felixepp.de>

This file is part of ROSE.

ROSE is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ROSE is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ROSE.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Promise } from 'rsvp'

import ExtractorCollection from '../collections/extractors'
import ObserverCollection from '../collections/observers'
import compareVersion from '../utils/compare-version'
import { backboneFetch, backboneSave } from '../utils/backbone-promises'

var model = Backbone.Model.extend({
  sync: Backbone.kangoforage.sync('Network'),

  updateExtractors (list) {
    return this.updateCollection(new ExtractorCollection(), list)
  },

  updateObservers (list) {
    return this.updateCollection(new ObserverCollection(), list)
  },

  updateCollection (collectionInstance, list) {
    return backboneFetch(collectionInstance)
      .then((collection) => this.updateByVersion(collection, list))
  },

  updateByVersion (collection, newCollection) {
    return collection.reduce((sequence, model) => {
      let remoteModel = _.findWhere(newCollection, {name: model.get('name'), network: model.get('network')})
      if (remoteModel !== undefined && compareVersion(model.get('version'), remoteModel.version)) {
        return sequence.then(() => backboneSave(model, remoteModel))
      }
      return Promise.resolve()
    }, Promise.resolve())
  }
})

export default model
