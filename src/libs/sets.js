/**
 * Difference
 * (A)(B) = A - B
 * given A and B arrays of primitives, return an array of primitives that are in A but not in B
 *
 * @param {Array} a - array of primitives
 * @param {Array} b - array of primitives
 * @return {Array} - array of primitives
 */
export const difference = (a, b) => {
  const s = new Set(b)
  return a.filter((x) => !s.has(x))
}

/**
 * Intersection
 * (A)(B) = A ∩ B
 * given A and B arrays of primitives, return an array of primitives that are in both A and B
 *
 * @param {Array} a - array of primitives
 * @param {Array} b - array of primitives
 * @return {Array} - array of primitives
 */
export const intersection = (a, b) => {
  const s = new Set(b)
  return a.filter((x) => s.has(x))
}

/**
 * Union
 * (A)(B) = A ∪ B
 * given A and B arrays of primitives, return an array of primitives that are in either A or B
 *
 * @param {Array} a - array of primitives
 * @param {Array} b - array of primitives
 * @return {Array} - array of primitives
 */
export const union = (a, b) => {
  const s = new Set(a)
  b.forEach((x) => s.add(x))
  return Array.from(s)
}

/**
 * isIntersection
 * given A and B arrays of primitives, return true if A ∩ B is not empty
 *
 * @param {Array} a - array of primitives
 * @param {Array} b - array of primitives
 * @return {Boolean} - true if A ∩ B is not empty
 */
export const isIntersection = (a, b) => intersection(a, b).length > 0
