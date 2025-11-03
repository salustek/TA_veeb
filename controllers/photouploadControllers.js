const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc home page for uploading gallery photos
//@route GET /galleryphotupload
//@access public

const photouploadPage = (req, res)=>{
	res.render("photoupload");
};

//@desc page for uploading photos to gallery
//@route POST /galleryphotupload
//@access public

const photouploadPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	console.log(req.file);
	try {
		const fileName ="vp_" + Date.now() + ".jpg";
		console.log(fileName);
		await fs.rename(req.file.path, req.file.destination + fileName)
		//loon normaalsuuruse 800x600
		await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./gallery/normal" + fileName);
		//loon thumbnail pildi
		await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./gallery/thumbs" + fileName);
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "INSERT INTO galleryphotos (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";
		//kuna kasutajakontosid veel pole siis maarame userid = 1
		const userId = 1;
		const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
		console.log("Salvestati kirje: " + result.insertId);
		res.render("photoupload")
	}
	catch(err) {
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus on suletud!");
		}
		
	}
	/* let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
	  res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu vÃµi ebakorrektsed"});
	}
	
	else {
		try {
			conn = await mysql.createConnection(dbConfInga);
			console.log("AndmebaasiÃ¼hendus loodud!");
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje: " + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaÃµnnestus"});
		}
		finally {
			if(conn){
			await conn.end();
				console.log("AndmebaasiÃ¼hendus on suletud!");
			}
		}
	} */
};

module.exports = {
	photouploadPage,
	photouploadPagePost
};