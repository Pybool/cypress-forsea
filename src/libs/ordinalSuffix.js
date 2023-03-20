const pr = new Intl.PluralRules('en-GB', { type: 'ordinal' })

const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
])

const ordinalSuffix = (n) => {
  const rule = pr.select(n)
  return suffixes.get(rule)
}

export default ordinalSuffix
