/* eslint-env browser */

module.exports.baseUrl =
  (typeof window !== 'undefined' && window.BASE_URL) ||
  (typeof process !== 'undefined' && process.env.BASE_URL) ||
  ''

module.exports.withBaseUrl = url => `${module.exports.baseUrl}${url}`

module.exports.mapObjectToArray = o => {
  const keys = Object.keys(o).map(id => Number.parseInt(id, 10))
  const sortKeys = keys.sort((a, b) => (a < b ? -1 : 1))
  return sortKeys.map(id => o[id])
}
