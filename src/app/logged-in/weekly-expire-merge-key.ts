/** Sentinel + Pacific week date; optional JSON after third `|` */
export const WEEKLY_EXPIRE_PREFIX = "$$WEEKLY_EXPIRE$$"

/** Merge key for grouping same-week `$$WEEKLY_EXPIRE$$` rows (server + client safe). */
export function weeklyExpireMergeKey(comment: string | null): string | null {
  if (!comment?.startsWith(`${WEEKLY_EXPIRE_PREFIX}|`)) return null
  const rest = comment.slice(WEEKLY_EXPIRE_PREFIX.length + 1)
  const date = rest.slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  return `${WEEKLY_EXPIRE_PREFIX}|${date}`
}
