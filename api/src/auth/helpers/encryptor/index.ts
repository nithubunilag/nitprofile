import CryptoJS from "crypto-js"
import { config } from "@/core"

export class Encryptor {
    constructor(private readonly encryptorSecretKey: string = config.auth.encryptorSecretKey) {}

    encrypt = (item: string) => {
        return CryptoJS.AES.encrypt(item, this.encryptorSecretKey).toString()
    }

    decrypt(encryptedString: string): string {
        return CryptoJS.AES.decrypt(encryptedString, this.encryptorSecretKey).toString(CryptoJS.enc.Utf8)
    }
}

export const encryptor = new Encryptor()
