import bcrypt from 'bcrypt'

const encryptPWD = async (pwd: any) => {
    return bcrypt.hash(pwd, 10)
}

const decryptPWD = async (loginPWD: any, RegistedPWD: any) => {
    return bcrypt.compare(loginPWD, RegistedPWD)
}

export const bcryptFunctions = {
    encryptPWD,
    decryptPWD
}
