const dayjs = require('dayjs')
const { v4: generateId } = require('uuid')

function generateRefreshToken(userId, refreshTokenList) {
    const expiresIn = dayjs().add(10, 'seconds').unix()

    const refreshToken = {
        id: generateId(),
        userId,
        expiresIn
    }

    const userHasRefreshTokenIndex = refreshTokenList
        .findIndex(refreshToken => refreshToken.userId === userId)

    if (userHasRefreshTokenIndex >= 0) {
        refreshTokenList[userHasRefreshTokenIndex] = refreshToken
    } else {
        refreshTokenList.push(refreshToken)
    }

    return refreshToken
}

module.exports = { generateRefreshToken }