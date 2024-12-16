export const AppMessages = {
    FAILURE: {
        INVALID_TOKEN_PROVIDED: "Invalid token provided.",
        INVALID_CREDENTIALS: "Invalid credentials provided.",
        EMAIL_EXISTS: "This account already exists, kindly login",
        EMAIL_NOT_VERIFIED: "Please verify your email address",
        FORBIDDEN_RESOURCE: "Forbidden Resource. You do not have the required permissions to access this resource",
        PROGRAM_EXISTS: "This Program already exists",
        INVALID_PROGRAM: "This Program doesn't exist",
        FORBIDDEN_PROGRAM: "You don't have access to this program",
        INVALID_PROGRAM_NODE: "This Program Node doesn't exist",
        START_DATE_ERROR: "Start Date cannot be earlier than Current date",
        DATE_DURATION_ERROR: "Start Date cannot be later than End date",
        USER_ALREADY_ASSIGNED_TO_PROGRAM: "User already exists in this program",
        INVALID_PROFILE_PICTURE: "You must have a profile picture before you can generate your profile. kindly update your profile picture.",
        PROFILE_GENERATION_NOT_AVAILABLE: "Profile generation is currently unavailable. Please reach out to the administrator for further details.",
        CERTIFICATE_GENERATION_NOT_AVAILABLE:
            "Certificate generation is currently unavailable. Please reach out to the administrator for further details.",
        ADMIN_ALREADY_ASSIGNED: "Profile generation is currently unavailable. Please reach out to the administrator for further details.",
        VERIFY_ACCOUNT:
            "For your account's ongoing security, we require you to establish a new password.  Logging in with the default password is no longer possible due to enhanced security measures.",
    },
    SUCCESS: {
        LOGIN: "Login successful.",
        ADMIN_INVITED: "Invitation Sent successfully.",
        LOGOUT: "Logged out successfully.",
        SIGNUP: "Signup successful",
        EMAIL_SENT: "If you have an account with us, You will receive a mail to",
        PASSWORD_RESET: "Password reset successfully",
        TOKEN_REFRESHED: "Token Refreshed Successfully",
        DATA_FETCHED: "Data Retreived Successfully",
        PROGRAM_CREATED: "Program created successfully",
        PROGRAM_UPDATED: "Program updated successfully",
        PROGRAM_DELETED: "Program deleted successfully",

        PROGRAM_NODE_CREATED: "Program Nodes created successfully",
        PROGRAM_NODE_FOUND: "Program Node Retrieved successfully",
        PROGRAM_NODE_UPDATED: "Program Node updated successfully",
        PROGRAM_NODE_DELETED: "Program Node deleted successfully",

        USERS_REGISTERED_SUCCESSFULLY: "Users registered for program successfully",
        USER_REGISTERED_SUCCESSFULLY: "User registered for program successfully",

        PROFILE_GENERATION_AVAILABLE: "Profile Generation Enabled",
        CERTIFICATE_GENERATION_AVAILABLE: "Certificate Generation Enabled",
    },
    INFO: {
        INVALID_OPERATION: "Invalid operation.",
        EMPTY_TOKEN_HEADER: "Invalid authorization header",
    },
}
