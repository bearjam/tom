export const excludes = <T>(as: T[]) => (...bs: T[]) => {
  return bs.reduce((acc, v) => (!acc ? acc : acc && !as.includes(v)), true)
}
