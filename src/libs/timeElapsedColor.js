const timeElapsedColor = (timeElapsed = 0) => {
  if (timeElapsed > 7) return 'failure'
  if (timeElapsed > 4 && timeElapsed <= 7) return 'amber'

  return 'success'
}

export default timeElapsedColor
