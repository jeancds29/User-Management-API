const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const secret = "gato198roboto36769voador823de768skate0985prateado432surfando265no9267espaço"

class UserController {
    async index(req, res){
        var users = await User.findAll();
        res.json({users});
    }

    async findUser(req, res){
        var id = req.params.id;
        var user = await User.findById(id);

        if (user == undefined) {
            res.status(404);
            res.json({erro:"Id não encontrado!"})
        } else {
            res.status(200)
            res.json(user)
        }
    }

    async signUp(req, res){
        var {name, email, password} = req.body;

        if (name == undefined) {
            res.status(400);
            res.json({error:"invalid name"});
            return;
        }
        if (email == undefined) {
            res.status(400);
            res.json({error:"invalid email"});
            return;
        }
        
        var emailExists = await User.findEmail(email);

        if (emailExists) {
            res.status(406);
            res.json({error: "Email já cadastrado"});
            return;
        }

        await User.new(name, email, password);

        res.status(200);
        res.send("Operação concluida com sucesso.");
    }

    async update(req, res){
        var {id, name, email, role} = req.body;

        var result = await User.update(id, name, email, role);

        if (result != undefined) {
            if (result.status){
                res.send("Operação concluida com sucesso.");
            }else{
                res.status(406);
                res.send(result.error)
            }
        }else{
            res.status(406)
            res.send("Ocorreu um erro no servidor.")
        }

    }

    async delete(req, res){
        var id = req.params.id;

        var result = await User.delete(id);

        if (result.status) {
            res.status(200);
            res.send("Usuário deletado com sucesso.");
        } else {
            res.status(406)
            res.send(result.error)
        }
    }

    async recoverPassword(req, res){
        var email = req.body.email;
        var result = await PasswordToken.createToken(email);

        if (result.status) {
            res.status(200);
            //adicionar nodemailer
            res.send("Foi enviado um email para recuperação de senha.");
        }else{
            res.status(406);
            res.send(result.error);
        }
    }

    async changePassword(req, res){
        var token = req.body.token;
        var password = req.body.password;
        var isTokenValid = await PasswordToken.tokenValidate(token);

        if (isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada com sucesso!")
        } else {
            res.status(406);
            res.send("Token Invalído!");
        }


    }

    async login(req, res){
        var {email, password} = req.body;
        var user = await User.findByEmail(email);

        if (user != undefined) {
            var correct = await bcrypt.compareSync(password, user.password);
            if (correct) {
                var token = jwt.sign({email: user.email, role: user.role }, secret);
                res.status(200)
                res.json({token: token})
            } else {
                res.status(400)
                res.send("senha incorreta!")
            }
        } else {
            res.status(400)
            res.send("Usuario invalido!")
        }

    }

}

module.exports = new UserController();