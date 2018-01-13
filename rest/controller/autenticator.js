/*
* Controlador de autenticação
* 
* (C) João Carlos Pandolfi Santana - 10/01/2018
*/


var Mysql = require('../libs/persistence/mysql.js');


//Redundant function
function error_message(code, message){
	return {success: 0, error:{code:code,message:message}};
}


var Autenticator = {

	//TODO: implementar
	/*
	* Verifica se a hash informada faz sentido com o ID
	* @param user_id {Id do usuario}
	* @param hash {Hash recebida para conferencia}
	* @return bool {Valida ou nao}
	*/
	check_hash_id: function(user_id, hash){
		return true
	},

	//TODO: Implementar
	/*
	* Gera hash para o usuario
	* @param user_id {Id do usuario}
	* @return hash (String) {Hash gerada para o usuario}
	*/
	generate_hash_id: function(user_id){
		return user_id+"1234";
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

	/*
	* Efetua login do usuario pela rota
	* @receive res.query {Variavel com os parametros}
	* @param user {login do usuario}
	* @param pass {Senha do usuario}
	*/
	login_route: function(req,res){
		//Getting param data
		var user = req.query.user;
		var pass = req.query.pass;

		//Checkig correct data in route
		if(user == undefined || pass == undefined){
			res.send(500,"Bad Formatation :(")
			return
		}

		console.log("#=> Login process -- user:"+user)

		var sql = "CALL login(?,?)";
		sql = Mysql.format(sql, [user,pass]);

		Mysql.query(sql, function (err, results) {
			if(err) { res.send(500,"Database error"); return; }
			var response = {
				success: 1,
				data:{}
			}

			if(results.length > 0){
	
				var user =  {
					user_id: results[0].id,
					type_user: results[0].type_user,
					hash: Autenticator.generate_hash_id(results[0].id),
					name: results[0].name,
					picture: results[0].picture
				}

				response.data = user;
				
			}else
				response.success = 0
			

			res.send(JSON.stringify(event_list_json(response)));
			
		});
	},



	renew_route: function(req,res){

	},

	logout_route: function(req,res){

	}


}


module.exports = Autenticator;