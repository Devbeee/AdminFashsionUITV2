export const getBreadCrumLabel = (location: Location): { label: string; value: string }[] => {
  return location.pathname === '/'
    ? [{ label: 'Dashboard', value: '' }]
    : location.pathname
        .split('/')
        .filter(Boolean)
        .map((segment) => ({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          value: segment
        }))
}
export const ConvertDateString = (dateString: string) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

export const ConvertTimeString = (dateString: string) => {
  const date = new Date(dateString)

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}
