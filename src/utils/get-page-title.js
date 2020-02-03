import defaultSettings from '@/settings'

const title = defaultSettings.title || '昭乐'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
