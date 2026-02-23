const { spec, Model } = require('pear-hyperdb')
const HyperDB = require('hyperdb')
const Corestore = require('corestore')
const { isMac, isLinux } = require('which-runtime')
const path = require('path')
const os = require('os')

module.exports = async (key) => {
  const platformDir = isMac
    ? path.join(os.homedir(), 'Library', 'Application Support')
    : isLinux
      ? path.join(os.homedir(), '.config')
      : path.join(os.homedir(), 'AppData', 'Roaming')

  let store = null
  let model = null

  try {
    store = new Corestore(path.join(platformDir, 'pear', 'corestores', 'platform'), {
      readOnly: true
    })
    await store.ready()
    const rocks = HyperDB.rocks(store.storage.rocks.session(), spec)
    model = new Model(rocks)
    await model.db.ready()
    return await model.getAppStorage(key)
  } catch (err) {
    console.log(err)
    return null
  } finally {
    await model?.close()
    await store?.close()
  }
}
