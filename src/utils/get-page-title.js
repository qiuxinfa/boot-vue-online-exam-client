import defaultSettings from '@/settings'

const title = defaultSettings.title || 'boot-vue-online-exam'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
