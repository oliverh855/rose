import _startsWith from 'lodash/startsWith'

function repairMissingInteractions() {
    localforage.keys()
        .then(keys => keys.filter(key => _startsWith(key, 'Interaction/')))
        .then(interactionKeys => localforage.setItem('Interactions', interactionKeys))
}

export default { repairMissingInteractions }
