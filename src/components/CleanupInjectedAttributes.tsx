'use client'

import { useEffect } from 'react'

export default function CleanupInjectedAttributes() {
  useEffect(() => {
    const patterns: RegExp[] = [/^bis_/, /^__processed_/, /^bis_register$/, /^cz-shortcut-listen$/]

    function shouldRemove(attrName: string) {
      return patterns.some((p) => p.test(attrName))
    }

    function removeAttrs(el: Element | null) {
      if (!el || !el.attributes) return
      const toRemove: string[] = []
      for (let i = 0; i < el.attributes.length; i++) {
        const name = el.attributes[i].name
        if (shouldRemove(name)) toRemove.push(name)
      }
      toRemove.forEach((n) => el.removeAttribute(n))
    }

    // Remove on documentElement and body
    removeAttrs(document.documentElement)
    removeAttrs(document.body)

    // Walk DOM and remove attributes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
    let node = walker.nextNode()
    while (node) {
      removeAttrs(node as Element)
      node = walker.nextNode()
    }

    // One-time run is enough; extensions may re-inject but this reduces mismatch
  }, [])

  return null
}
