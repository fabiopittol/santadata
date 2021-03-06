/*
* Controlador de autenticação
* 
* (C) João Carlos Pandolfi Santana - 10/01/2018
*/

//Config
var config = require('../constants/config.js');

//Databases
var Mysql = require('../libs/persistence/mysql.js');
var Mongodb = require('../libs/persistence/mongodb.js');

//Helpers
var md5 = require('../libs/helper/md5.js');
global.Buffer = global.Buffer || require('buffer').Buffer;


//Redundant function
function error_message(code, message){
	return {success: 0, error:{code:code,message:message}};
}


// BASE 64 FUNCIONS
if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  };
}


var Autenticator = {

	/*
	* Verifica se a hash informada faz sentido com o ID
	* @param user_id {Id do usuario}
	* @param hash {Hash recebida para conferencia}
	* @return bool {Valida ou nao}
	*/
	check_hash_id: function(user_id, hash){
		return (escape(btoa(md5(user_id+config.secret_hash))) == escape(hash))
	},

	/*
	* Gera hash para o usuario
	* @param user_id {Id do usuario}
	* @return hash (String) {Hash gerada para o usuario}
	*/
	generate_hash_id: function(user_id){
		return btoa(md5(user_id+config.secret_hash));
	},

	//TODO: Implementar
	/*
	* Efetua login do usuario e retorna os dados
	* @param user {login do usuario}
	* @param pass {Senha do usuario}
	* @return user (Class) {Dados do usuario}
	*/
	login: function(user,pass){

		var user =  {
			user_id:0,
			type_user: 0,
			hash: Autenticator.generate_hash_id(0),
			name: "",
			picture: ""
		}

		return user;
	},

	/* TODO: JOGAR PARA DENTRO DO DAO
	* Efetua login do usuario pela rota
	* @receive res.query {Variavel com os parametros}
	* @param user {login do usuario}
	* @param pass {Senha do usuario}
	*/
	login_route: function(req,res){

		var var_req = req.body
		var user = null
		var pass = null

		try{
			var_req = atob(var_req.data)
			var_req = JSON.parse(var_req)
			//Getting param data
			user = var_req.user;
			pass = var_req.pass;

		}
		catch(e){
			res.status(500).send("Bad Formatation :(")
			return
		}

		
		console.log("#=> Login process -- user:"+user)
	
		var sql = "SELECT * FROM login WHERE login=? AND pass=? ";
		sql = Mysql.format(sql, [user,pass]);

		Mysql.query(sql, function (err, results) {
			if(err) { res.status(500).send("Database error"); return; }
			var response = {
				success: 1,
				data:{}
			}

			if(results.length > 0){
	
				var user =  {
					user_id: results[0].iduser,
					type_user: results[0].type_user,
					hash: Autenticator.generate_hash_id(results[0].id),
					name: results[0].name,
					picture: results[0].picture
				}

				response.data = user;
				console.log("#=> LOGIN SUCESS :"+user.user_id)
				
			}else
				response.success = 0
			

			res.send(JSON.stringify(response));
			
		});
	},

	// DISABLED
	renew_route: function(req,res){
		return {success: 1, data:{}}
	},

	/*
	* JUST FOR TEST
	*/
	test_route: function(req,res){
		var user = req.query.user;
		try{
			console.log("Creating MONGO database")
			Mongodb.createDb();

			console.log("Creating user Collection")
			Mongodb.createCollection("user");

			console.log("Searching user on Collection")
			Mongodb.search.one("user",{},function(result){
				console.log(result)
				res.send(JSON.stringify(result));
			});
		}
		catch(e){
			console.log("Error")
			res.send("ERRO NO MONGO");
		}
	},

	logout_route: function(req,res){

	}


}


module.exports = Autenticator;