/*
* Controlador de usuários
* 
* (C) João Carlos Pandolfi Santana - 16/01/2018
*/

//Config
var config = require('../../constants/config.js');

//Databases
var Mysql = require('../../libs/persistence/mysql.js');
var Mongodb = require('../../libs/persistence/mongodb.js');

//Base class
var Base = require( '../generic.js' );

var User = Object.create(Base);

/*
* Registra novo usuario
* @receives name,email,login,pass,hash,type_user
* @return id_user {Id do usuario}
*/
User.new_user = function(req, res){

	//Check authentication
	if(!User.check_requisition(req)){
		res.send(User.error_message(500,"Bad requisition"));
		return
	}

	var sql = "SELECT new_user(?,?,?,?,?,?);";
	sql = Mysql.format(sql, [req.query.name, 
			req.query.email,
			req.query.login,
			req.query.pass,
			"-void-hash-",
			parseInt(req.query.type_user)]);

	Mysql.query(sql, function (err, results) {
		if(err) { res.send(500,"Database error"); return; }
		var response = {
			success: 1,
			data:{iduser:results[1]}
		}

		if(results.length == 0)
			response.success = 0

		res.send(JSON.stringify(response));		
	});

}


module.exports = User;
