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
export * from './uploadToCloudinary'
export * from './convertStringDate'
