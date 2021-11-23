const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ message: "Token não informado!" })
    }

    const [, token] = authorization.split(" ")

    jwt.verify(token, 'JWT_SECRET', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Seu token expirou!" })
        }

        next()
    });
}

module.exports = { ensureAuthenticated }