export interface ICreateNotificationDTO {
    message: string
    actor: "SYSTEM" | { id: string }
    notifier: string[]
    item_id: string
    entity_type: EntityType
}

// These are default Entity types that are prepopulated in the DB, if you add a new Entity Type, add it here also to avoid typographical errors

const entity_type = ["PROFILE_AVAILABLE"] as const

type EntityType = (typeof entity_type)[number]
