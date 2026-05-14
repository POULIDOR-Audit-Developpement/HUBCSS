#!/usr/bin/env node
/**
 * Empaquette le dossier dist/ en dist.tar.gz + manifest.json prêts à l'upload
 * dans l'admin HUB ("Design System").
 *
 * - Aucun téléchargement réseau, 100% local.
 * - manifest.json contient : version (depuis package.json), liste des fichiers
 *   avec sha256 hex et taille.
 * - L'archive .tar.gz contient le contenu de dist/ (sans le préfixe "dist/").
 *
 * Usage : `npm run pack` → produit dist.tar.gz et manifest.json à la racine.
 */
import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream, statSync, existsSync } from 'node:fs'
import { mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises'
import { createGzip } from 'node:zlib'
import { pipeline } from 'node:stream/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const distDir = join(root, 'dist')
const tarballOut = join(root, 'dist.tar.gz')
const manifestOut = join(root, 'manifest.json')

if (!existsSync(distDir)) {
  console.error('❌ dist/ introuvable — exécutez `npm run build` avant `npm run pack`.')
  process.exit(1)
}

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else if (entry.isFile()) out.push(full)
  }
  return out
}

async function sha256(file) {
  const hash = createHash('sha256')
  const stream = createReadStream(file)
  for await (const chunk of stream) hash.update(chunk)
  return hash.digest('hex')
}

// Encode un header tar (POSIX ustar) pour un fichier régulier de taille connue.
function tarHeader(name, size, mtime) {
  if (Buffer.byteLength(name, 'utf8') > 100) {
    throw new Error(`Nom de fichier trop long pour le format tar standard : ${name}`)
  }
  const buf = Buffer.alloc(512, 0)
  buf.write(name, 0, 100, 'utf8')
  buf.write('0000644\0', 100, 8) // mode
  buf.write('0000000\0', 108, 8) // uid
  buf.write('0000000\0', 116, 8) // gid
  buf.write(size.toString(8).padStart(11, '0') + '\0', 124, 12)
  buf.write(Math.floor(mtime / 1000).toString(8).padStart(11, '0') + '\0', 136, 12)
  buf.write('        ', 148, 8) // checksum placeholder = 8 espaces
  buf.write('0', 156, 1) // typeflag = fichier
  buf.write('ustar\0', 257, 6)
  buf.write('00', 263, 2)
  let sum = 0
  for (let i = 0; i < 512; i++) sum += buf[i]
  buf.write(sum.toString(8).padStart(6, '0') + '\0 ', 148, 8)
  return buf
}

async function main() {
  // Nettoyer les anciens artefacts
  await rm(tarballOut, { force: true })
  await rm(manifestOut, { force: true })

  const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  const version = pkg.version
  if (!version) {
    console.error('❌ Aucune version dans package.json')
    process.exit(1)
  }

  const files = (await walk(distDir)).sort()
  if (files.length === 0) {
    console.error('❌ dist/ est vide')
    process.exit(1)
  }

  // Construire le manifest
  const manifest = {
    version,
    generated_at: new Date().toISOString(),
    files: [],
  }
  for (const f of files) {
    const rel = relative(distDir, f).split(sep).join('/')
    const st = statSync(f)
    manifest.files.push({
      path: rel,
      size: st.size,
      sha256: await sha256(f),
    })
  }

  // Écrire l'archive tar non compressée → pipée dans gzip
  const tarPath = tarballOut + '.tmp.tar'
  const tarStream = createWriteStream(tarPath)
  for (const f of files) {
    const rel = relative(distDir, f).split(sep).join('/')
    const st = statSync(f)
    tarStream.write(tarHeader(rel, st.size, st.mtimeMs || Date.now()))
    await new Promise((res, rej) => {
      const r = createReadStream(f)
      r.on('end', res)
      r.on('error', rej)
      r.pipe(tarStream, { end: false })
    })
    const pad = (512 - (st.size % 512)) % 512
    if (pad) tarStream.write(Buffer.alloc(pad, 0))
  }
  // Deux blocs de 512 octets nuls = fin d'archive
  tarStream.write(Buffer.alloc(1024, 0))
  await new Promise((res, rej) => tarStream.end(err => (err ? rej(err) : res())))

  await pipeline(createReadStream(tarPath), createGzip({ level: 9 }), createWriteStream(tarballOut))
  await rm(tarPath, { force: true })

  await writeFile(manifestOut, JSON.stringify(manifest, null, 2) + '\n', 'utf8')

  const tarSize = statSync(tarballOut).size
  console.log(`✅ ${relative(root, tarballOut)} (${(tarSize / 1024).toFixed(1)} KB)`)
  console.log(`✅ ${relative(root, manifestOut)} (${manifest.files.length} fichiers, version ${version})`)
  console.log('')
  console.log('Étapes suivantes :')
  console.log('  1. Ouvrez l\'admin HUB → onglet "Design System".')
  console.log('  2. Glissez `dist.tar.gz` dans la zone d\'import.')
  console.log('  3. Cliquez "Déployer". Les apps clients reflètent le changement immédiatement.')
}

main().catch(err => {
  console.error('❌ pack-dist :', err)
  process.exit(1)
})
