export function getLocale() {
  let locale = 'en'
  if(navigator.language.indexOf('ko') >= 0)
    locale = 'ko'
  
  return locale
}
