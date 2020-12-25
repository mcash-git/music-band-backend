const Helpers = use('Helpers')
const Env = use('Env')
const fs = use('fs')

function getToken (file) {
  return fs.statSync(file).isFile() ? fs.readFileSync(file) : ''
}

module.exports = {
  topic: Env.get('PUSH_TOPIC', ''),
  gcm: {
    id: Env.get('GCM_KEY', '')
  }
}
