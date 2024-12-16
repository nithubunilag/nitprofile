import type { ContextTypes, RequestFileContents } from "@/core"
import type { Node } from "../types"

interface IBaseProgram {
    name: string
    startDate: Date
    endDate: Date
}

export interface IProgramUser {
    email: string
    firstName: string
    lastName: string
}

export interface CreateProgramPayload extends ContextTypes {
    input: IBaseProgram
}

export interface AssignAdminToProgramPayload extends ContextTypes {
    input: {
        programId: string
        adminId: string
    }
}

export interface UpdateProgramPayload extends ContextTypes {
    input: Partial<IBaseProgram>

    query: {
        programId: string
    }
    files: {
        csv: RequestFileContents
    }
}

export interface FindSingleProgram extends ContextTypes {
    query: {
        programId: string
    }
}

export interface AddProgramProfileFramePayload extends ContextTypes {
    input: {
        profileFrameHeight: string
        profileFrameWidth: string
    }
    query: {
        programId: string
    }
    files: {
        frame: RequestFileContents
    }
}

export interface AddProgramCertificateFramePayload extends ContextTypes {
    input: {
        certificateFrameHeight: string
        certificateFrameWidth: string
    }
    query: {
        programId: string
    }
    files: {
        frame: RequestFileContents
    }
}


export interface CreateProgramNodesPayload extends ContextTypes {
    input: {
        nodes: Node[]
        category: "profile" | "certificate"
    }
    query: {
        programId: string
    }
}

export interface GetProgramNodesPayload extends ContextTypes {
    query: {
        programId: string
        category: "profile" | "certificate"
    }
}

export interface UpdateProgramNodePayload extends ContextTypes {
    input: {
        node: Partial<Node>
    }
    query: {
        id: string
    }
}

export interface GenerateProgramProfilePayload extends ContextTypes {
    query: {
        programId: string
    }
}

export interface RegisterProgramUser extends ContextTypes {
    input: {
        user: {
            email: string
            firstName: string
            lastName: string
        }
    }

    query: {
        programId: string
    }
    files: {
        csv: RequestFileContents
    }
}

export interface ResendUserMailPayload extends ContextTypes {
    input: {
        email: string
    }
    query: {
        programId: string
    }
}
