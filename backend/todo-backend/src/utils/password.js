const bcrypt = require('bcrypt')

const encryptPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

const verifyPassword = async (password, hashedPassword) => {
    const isValid = await bcrypt.compare(password, hashedPassword)
    return isValid
}

module.exports = {
    encryptPassword,
    verifyPassword
}