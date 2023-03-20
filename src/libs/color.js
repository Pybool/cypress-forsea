/**
 * Generate number has from a string
 */
export function hashCode(str) {
  let hash = 0,
    i,
    chr
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

/**
 * Generate a hex color from a string seed
 */
export function generateColor(seed) {
  let color = Math.floor(Math.abs(Math.sin(seed) * 16777215))
  color = color.toString(16)
  // pad any colors shorter than 6 characters with leading 0s
  while (color.length < 6) {
    color = '0' + color
  }

  return color
}

export default function generateColorFromString(str) {
  return '#' + generateColor(hashCode(str))
}
