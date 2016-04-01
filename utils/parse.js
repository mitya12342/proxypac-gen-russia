import fs from 'fs'
import path from 'path'
import moment from 'moment'
import request from 'request'

import shitsites from '../shit-sites'

const IP_REGEXP = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\s|;)/g

const URL_REGEXP = /(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/g

function removeDuplicates (array) {
  let uniq_array = array.reduce(function (a, b) {
    if (a.indexOf(b) < 0) a.push(b)
    return a
  }, [])
  return uniq_array
}

export default function parseDumpToPac () {
  console.log('generating new proxy.pac')
  request(process.env.DUMP_URL, (err, resp, body) => {
    if (err) {
      return console.log(err)
    }

    let ips = (body.match(IP_REGEXP)||[]).map(i => i.slice(0, -1))
    let urls = body
      .match(URL_REGEXP)
      .map(u => u.replace(/^www./g, ''))
      .filter(u => !/.php$|.html?$|.jpe?g$|.png$|.gif$|.pdf$|.swf$|.wml$|.asp$/.test(u))

    ips = removeDuplicates(ips)
    urls = removeDuplicates(urls)

    if (process.env.HOST_DOMAIN) {
      // add site itself to preserve from blocking
      urls.push(process.env.HOST_DOMAIN)
    }

    buildPac(ips, urls, 'proxy.pac') // generate pac-file
    buildPac(ips, urls.concat(shitsites), 'proxy+shitsites.pac')
    console.log('.pac file generated successfully at ' + moment().format('LLL'))
  })
}

function buildPac(ips, urls, name) { // .pac-file builder
  let content = ''
  content += '// proxypac_gen_russia, autogenerated on ' + moment().utc().add(3, 'h').format('LLL') + ' (MSK)\n'
  content += '// ' + ips.length + ' IPs and ' + urls.length + ' domains in list\n\n'
  content += 'function FindProxyForURL(url, host) {'

  content += `\nblocked_ips = ["${ips.join('","')}"]`
  content += `\nblocked_domains = ["${urls.join('","')}"]`

  content += '\n\n  if ((blocked_ips.indexOf(dnsResolve(host)) != -1) || (blocked_domains.indexOf(host) != -1)) {\n    return "' + process.env.PROXYSTRING + '; DIRECT";\n  }\n  if (dnsDomainIs(host, ".onion")) {\n    return "SOCKS5 127.0.0.1:9050; DIRECT"; // tor proxy\n  }\n  if (dnsDomainIs(host, ".i2p")) {\n    return "PROXY 127.0.0.1:4444"; // i2p proxy\n  }\n\n  return "DIRECT";\n}'

  let file = fs.createWriteStream(path.resolve('public', name))
  file.write(content)
  file.end()
}