import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const LANG_META = {
  de: { lang: 'de', dir: 'ltr' },
  en: { lang: 'en', dir: 'ltr' },
  zh: { lang: 'zh', dir: 'ltr' },
  ar: { lang: 'ar', dir: 'rtl' },
  es: { lang: 'es', dir: 'ltr' },
  fr: { lang: 'fr', dir: 'ltr' },
  ja: { lang: 'ja', dir: 'ltr' },
}

function patchDir(dir, lang, direction) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      patchDir(full, lang, direction)
    } else if (entry.endsWith('.html')) {
      let html = readFileSync(full, 'utf8')
      html = html.replace(/<html([^>]*)>/, `<html$1 lang="${lang}" dir="${direction}">`)
      writeFileSync(full, html)
    }
  }
}

for (const [segment, { lang, dir }] of Object.entries(LANG_META)) {
  patchDir(`out/${segment}`, lang, dir)
}

console.log('Patched <html lang/dir> attributes in out/')
