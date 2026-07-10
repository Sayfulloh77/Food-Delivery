import { onMounted, onUnmounted } from 'vue'

// Cards behind this selector are often rendered after an async fetch
// resolves (post-mount), so a one-time querySelectorAll at mount would
// miss them. A MutationObserver picks up elements added later too.
export function useReveal(selector = '.reveal') {
  let observer: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null

  onMounted(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    observer = io

    const observeAll = () => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains('visible')) io.observe(el)
      })
    }

    observeAll()

    mutationObserver = new MutationObserver(observeAll)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
  })

  onUnmounted(() => {
    observer?.disconnect()
    mutationObserver?.disconnect()
  })
}
