import { handleSetAssociations } from "../../database/associations"
import { logger, sequelize } from "@/core"

export const initializeDbConnection = async () => {
  await sequelize.authenticate()

  logger.info("Connection has been established successfully.")

  logger.info("All models were synchronized successfully.")

  handleSetAssociations()
  logger.info("Associations Set Successfully")
}
