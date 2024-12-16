export type IHttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "ALL"

export const permission_abilities = ["read", "write", "edit", "delete", "full"] as const

export type IPermissionAbility = (typeof permission_abilities)[number]
