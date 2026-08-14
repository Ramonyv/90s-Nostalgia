import { pbkdf2Sync, randomBytes } from 'node:crypto'

async function readPassword() {
  if (!process.stdin.isTTY) {
    let value = ''; for await (const chunk of process.stdin) value += chunk
    return value.trim()
  }
  process.stdout.write('Choose the Blog Studio admin password: ')
  process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding('utf8')
  return new Promise((resolve, reject) => {
    let value = ''
    const finish = () => { process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n'); resolve(value) }
    process.stdin.on('data', key => {
      if (key === '\u0003') { process.stdin.setRawMode(false); process.stdout.write('\n'); reject(new Error('Cancelled.')); return }
      if (key === '\r' || key === '\n') { finish(); return }
      if (key === '\u007f') { value = value.slice(0, -1); return }
      value += key
    })
  })
}

const password = await readPassword()
if (password.length < 12) throw new Error('Use an admin password with at least 12 characters.')
const iterations = 210_000, salt = randomBytes(18)
const hash = pbkdf2Sync(password, salt, iterations, 32, 'sha256')

console.log('\nAdd these values to the hosting provider secret/environment settings. Do not commit them:\n')
console.log(`BLOG_ADMIN_PASSWORD_HASH=pbkdf2$${iterations}$${salt.toString('base64url')}$${hash.toString('base64url')}`)
console.log(`BLOG_SESSION_SECRET=${randomBytes(48).toString('base64url')}`)
