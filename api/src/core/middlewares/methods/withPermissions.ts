// // /middlewares/refactored-middlewares/withPermission.ts
// import { UserPermissions, Users } from "@/auth/model"
// import { UnAuthorizedError, type ITokenSignedPayload } from "@/core"
// import { AppMessages } from "@/core/common"
// import Resource from "@/database/models/Resources"

// // Define the structure of user permissions
// interface IPermissions {
//     _id: string
//     resource: string
//     ability: IPermissionAbility[]
// }

// interface IOptions {
//     resourceName: string
//     methods: IMethod[]
// }

// /**
//  * Middleware to check user roles and permissions before executing the main handler.
//  *
//  * @param {IRequestHandler} handler - The main request handler function.
//  * @param {IOptions} options - Options including the resourceName and methods.
//  * @returns {Promise<void>} - A Promise resolving to the result of the main handler.
//  */
// export const withPermissions = (handler: IRequestHandler, options: IOptions) => {
//     const { methods = ["ALL"], resourceName } = options

//     return async (req, res) => {
//         // Retrieve decoded token from next-auth/jwt
//         const user = req.user

//         // const userPermissions: IPermissions[] = user?.permissions ?? [];

//         const currentUser = await User.findById(user._id)
//         const userPermissions: IPermissions[] = currentUser.permissions ?? []

//         // Retrieve the resource from the database based on the provided name
//         const currentResource = await Resource.findOne({ name: resourceName.toLocaleUpperCase() })

//         // Check if the resource exists
//         if (!currentResource) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Resource. Please Register Resource!",
//             })
//         }

//         if (methods.includes(req.method) || methods.includes("ALL")) {
//             // Check if the user has permissions for the specified resource
//             const permission = userPermissions.find((item) => item.resource.toString() == currentResource._id.toString())

//             if (!permission) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Forbidden Resource. You do not have the required permissions to access this resource",
//                 })
//             }

//             if (permission.ability.includes("full")) return handler(req, res)

//             if (methods.includes("ALL")) {
//                 // Check if the user has the necessary ability for the requested method
//                 if (!checkMethodAbility(permission.ability, req.method)) {
//                     return res.status(401).json({
//                         success: false,
//                         message: "Forbidden Resource.",
//                     })
//                 }
//             }

//             methods.forEach((item) => {
//                 if (item.trim() === req.method && !checkMethodAbility(permission.ability, req.method)) {
//                     return res.status(401).json({
//                         success: false,
//                         message: "Forbidden Resource.",
//                     })
//                 }
//             })
//         }

//         // If all checks pass, execute the main handler
//         return handler(req, res)
//     }
// }

// /**
//  * Map HTTP method to permission ability.
//  *
//  * @param {IMethod} method - The HTTP method.
//  * @returns {IPermissionAbility} - The corresponding permission ability.
//  */
// const methodAbility = (method: IMethod): IPermissionAbility => {
//     switch (method) {
//         case "GET":
//             return "read"
//         case "POST":
//             return "write"
//         case "DELETE":
//             return "delete"
//         case "PUT":
//             return "edit"
//     }
// }

// /**
//  * Check if the user has the necessary ability for the requested method.
//  *
//  * @param {IPermissionAbility[]} abilities - The user's abilities.
//  * @param {IMethod} method - The HTTP method.
//  * @returns {boolean} - True if the user has the necessary ability, false otherwise.
//  */
// const checkMethodAbility = (abilities: IPermissionAbility[], method: IMethod): boolean => {
//     return abilities.includes(methodAbility(method))
// }

// export const withPermissionss = async (user: ITokenSignedPayload, options: IOptions) => {
//     const { methods = ["ALL"], resourceName } = options

//     const currentUser = await UserPermissions.findOne({
//         where: {
//             userId: user.id,
//         },
//     })

//     if (!currentUser) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_CREDENTIALS)

//     return async (req, res) => {
//         // const userPermissions: IPermissions[] = user?.permissions ?? [];

//         const currentUser = await User.findById(user._id)
//         const userPermissions: IPermissions[] = currentUser.permissions ?? []

//         // Retrieve the resource from the database based on the provided name
//         const currentResource = await Resource.findOne({ name: resourceName.toLocaleUpperCase() })

//         // Check if the resource exists
//         if (!currentResource) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Resource. Please Register Resource!",
//             })
//         }

//         if (methods.includes(req.method) || methods.includes("ALL")) {
//             // Check if the user has permissions for the specified resource
//             const permission = userPermissions.find((item) => item.resource.toString() == currentResource._id.toString())

//             if (!permission) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Forbidden Resource. You do not have the required permissions to access this resource",
//                 })
//             }

//             if (permission.ability.includes("full")) return handler(req, res)

//             if (methods.includes("ALL")) {
//                 // Check if the user has the necessary ability for the requested method
//                 if (!checkMethodAbility(permission.ability, req.method)) {
//                     return res.status(401).json({
//                         success: false,
//                         message: "Forbidden Resource.",
//                     })
//                 }
//             }

//             methods.forEach((item) => {
//                 if (item.trim() === req.method && !checkMethodAbility(permission.ability, req.method)) {
//                     return res.status(401).json({
//                         success: false,
//                         message: "Forbidden Resource.",
//                     })
//                 }
//             })
//         }

//         // If all checks pass, execute the main handler
//         return handler(req, res)
//     }
// }


export const hello = ''