const load = () => {
  try {
    const path = '__active_file__'
    if (!path) return undefined
    return import('__active_file__')
  } catch (_) {
    return undefined
  }
};

export default load


export function getActiveFilePath() {
  return '__active_file__'
}