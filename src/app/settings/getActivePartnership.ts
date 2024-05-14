import { PartnershipsWithName } from "../load-partnerships"

/** Helper type: an array with at least one element */
export type NonEmptyArray<T> = [T, ...T[]]

/** Check if an array is non-empty */
export function isNonEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
  return arr.length > 0
}

/** Compares against `active_partner` setting, or defaults to 1st partnership. Requires partnerships that have first passed `isNonEmptyArray()` check. */
export const getActivePartnership = (
  partnerships: NonEmptyArray<PartnershipsWithName[0]>,
  active_partner?: string | null,
) =>
  partnerships.find((p) => [p.inviter, p.invitee].includes(active_partner || "")) || partnerships[0]
