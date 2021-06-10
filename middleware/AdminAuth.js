const jwt = require("jsonwebtoken");
const secret = "gato198roboto36769voador823de768skate0985prateado432surfando265no9267espaço"

module.exports = function (req, res, next) {
    const headersToken = req.headers["authorization"];

    if (headersToken != undefined) {
        const bearer = headersToken.split(' ');//atenção headersToken.split(' ')=> certo // headersToken.split('') => Errado
        const token = bearer[1];

        try {
            var verifiedToken = jwt.verify(token, secret);
            if (verifiedToken.role == 1) {
                next();
            } else {
                res.status(403);
                res.send("você nao tem permissão!");
                return;
            }
            
        } catch (error) {
            res.status(403);
            res.send(error);
            return;
        }
    }else {
        res.status(403);
        res.send("você nao está autenticado!");
        return;
    }

}