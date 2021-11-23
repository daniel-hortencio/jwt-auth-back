const { Router } = require('express')
const { ensureAuthenticated } = require('./middleware/ensureAuthenticated')
const { generateToken } = require('./utils/generateToken')
const { generateRefreshToken } = require('./utils/generateRefreshToken')
const dayjs = require("dayjs")

const router = Router()

const users = [
    {
        id: '1',
        name: "Nome do Usuário",
        email: "user@mail.com",
        password: "123",
        tel: "99999-0000"
    },
    {
        id: '2',
        name: "Tester",
        email: "tester@mail.com",
        password: "123456",
        tel: "99999-1111"
    },
]

let refreshTokenList = []

router.post('/signin', async (req, res) => {
    const { email, password } = req.body

    try {
        const userExists = users.find(user => user.email === email && user.password === password)

        if (!userExists) {
            return res.status(400).json({ error: "Usuário ou senha incorretos" })
        }

        const token = generateToken(userExists.id)
        const refreshToken = generateRefreshToken(userExists.id, refreshTokenList)

        const userWithoutPassword = {
            email: userExists.email,
            id: userExists.id,
            name: userExists.name,
            tel: userExists.tel
        }

        return res.status(200).json({
            user: userWithoutPassword,
            token,
            refreshToken
        })
    } catch (err) {
        return res.status(500).send("Internal Server Error")
    }

})

router.get('/userData', ensureAuthenticated, (_, res) => {

    res.status(200).json({
        user: "Nome do Usuário",
        email: "user@mail.com",
        tel: "99999-0000",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_8m1STQqVkNCjKkqNbH4sK8uXhDMmtvPFqQ&usqp=CAU",
        payment: 12000
    })

})

router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body

    const refreshTokenAlreadyExists = refreshTokenList.find((userRefreshToken) => userRefreshToken.id === refreshToken)

    if (!refreshTokenAlreadyExists) {
        return res.status(401).json({ message: "RefreshToken Inválido!" })
    }

    const { expiresIn } = refreshTokenAlreadyExists

    const now = dayjs().unix()

    const refreshTokenExpired = now > expiresIn

    if (refreshTokenExpired) {
        return res.status(401).json({ message: "Seu RefreshToken Expirou! Será necessário logar novamente na aplicação." })
    }

    const newToken = generateToken(refreshTokenAlreadyExists.userId)

    return res.status(200).json({
        token: newToken
    })

})

module.exports = { router }
