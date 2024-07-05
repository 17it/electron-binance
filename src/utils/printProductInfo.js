const packageInfo = require('../../package.json')
const printInfo = function(e) {
  const t = e.title
  const r = e.content
  const n = e.backgroundColor
  const a = [
    '%c '.concat(t, ' %c ').concat(r, ' '),
    'padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: '.concat('#606060', ';'),
    'padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: '.concat(n, ';')
  ]
  return (function() {
    let e
    window.console && typeof window.console.log === 'function' && (e = console).log.apply(e, arguments)
  }.apply(undefined, a))
}

printInfo({ title: 'Name', content: packageInfo.ch_name, backgroundColor: '#1475b2' })
printInfo({ title: 'Version', content: packageInfo.version, backgroundColor: '#42c02e' })
printInfo({ title: 'Environment', content: process.env.NODE_ENV, backgroundColor: '#42c02e' })
