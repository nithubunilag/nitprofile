import { DataTypes, type CreationOptional, type InferAttributes, type InferCreationAttributes, Model, type ForeignKey } from "sequelize"
import { sequelize } from "@/core"
import { placeholderTextNodeEntity, type INodeType, type IPlaceholderTextNodeEntity } from "../types"
import { Program } from "@/programs/models/program.model"

export class ProgramNodes extends Model<InferAttributes<ProgramNodes>, InferCreationAttributes<ProgramNodes>> {
    declare id: CreationOptional<string>
    declare programId: ForeignKey<Program["id"]>
    declare category: "profile" | "certificate"
    declare type: INodeType
    declare x: number
    declare y: number

    // Image Node Attributes
    declare overlay: CreationOptional<string>
    declare width: CreationOptional<number>
    declare height: CreationOptional<number>
    declare gravity: CreationOptional<string>
    declare radius: CreationOptional<number>
    declare crop: CreationOptional<string>

    // Text Node Attributes
    declare text: CreationOptional<string>
    declare font_family: CreationOptional<string>
    declare font_size: CreationOptional<number>
    declare font_weight: CreationOptional<string>
    declare color: CreationOptional<string>
    declare placeholder: CreationOptional<boolean>

    // Placeholder Text Node Attributes
    declare entity: CreationOptional<IPlaceholderTextNodeEntity>
    declare entity_key: CreationOptional<string>
}

ProgramNodes.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            allowNull: false,
            primaryKey: true,
        },
        programId: {
            type: DataTypes.UUID,
            references: {
                model: Program,
                key: "id",
            },
        },
        category: {
            type: DataTypes.ENUM("profile", "certificate"),
            defaultValue: "profile",
        },
        type: {
            type: DataTypes.ENUM("image", "text"),
            allowNull: false,
        },
        x: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        y: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        overlay: {
            type: DataTypes.STRING,
        },
        width: {
            type: DataTypes.INTEGER,
        },
        height: {
            type: DataTypes.INTEGER,
        },
        gravity: {
            type: DataTypes.STRING,
        },
        radius: {
            type: DataTypes.INTEGER,
        },
        crop: {
            type: DataTypes.STRING,
        },
        text: {
            type: DataTypes.STRING,
        },
        font_family: {
            type: DataTypes.STRING,
        },
        font_size: {
            type: DataTypes.INTEGER,
        },
        font_weight: {
            type: DataTypes.STRING,
        },
        color: {
            type: DataTypes.STRING,
        },
        placeholder: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        entity: {
            type: DataTypes.ENUM(...placeholderTextNodeEntity),
        },
        entity_key: {
            type: DataTypes.STRING,
        },
    },
    {
        scopes: {
            imageNodes: {
                attributes: {
                    exclude: ["text", "font_family", "font_size", "font_weight", "placeholder", "value"],
                },
            },
            textNodes: {
                attributes: {
                    exclude: ["width", "height", "gravity", "radius", "crop", "overlay"],
                },
            },
        },

        modelName: "program_nodes",
        tableName: "program_nodes",
        sequelize,
        timestamps: true,
        freezeTableName: true,
    },
)
