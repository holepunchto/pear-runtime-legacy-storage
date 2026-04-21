const { spec, Model } = require('pear-hyperdb')
const HyperDB = require('hyperdb')
const Corestore = require('corestore')
const { isMac, isLinux } = require('which-runtime')
const path = require('path')
const os = require('os')
const fs = require('fs/promises')

module.exports = async (key) => {
  const isSnap = !!process.env.SNAP_USER_COMMON
  const platformDir = isMac
    ? path.join(os.homedir(), 'Library', 'Application Support', 'pear')
    : isLinux
      ? isSnap
        ? path.join(process.env.SNAP_USER_COMMON, 'pear')
        : path.join(os.homedir(), '.config', 'pear')
      : path.join(os.homedir(), 'AppData', 'Roaming', 'pear')

  const corestorePath = path.join(platformDir, 'corestores', 'platform')

  try {
    await fs.access(corestorePath)
  } catch {
    return null
  }

  let store = null
  let model = null

  try {
    store = new Corestore(corestorePath, {
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
