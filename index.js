const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
//const mysql = require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
//const dbInfo = require("../../../../vp2025config");
const textRef = "public/txt/vanasonad.txt";
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
//kui tuleb vormist ainult text, siis false, muidu true
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", (req, res)=>{
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateEt.weekDay();
	const dateNow = dateEt.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			res.render("genericlist", {heading: "Valik Eesti vanasÃµnu", listData: ["Ei leidnud Ã¼htegi vanasÃµna!"]});
		}
		else {
			folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik Eesti vanasÃµnu", listData: folkWisdom});
		}
	});
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.fullDate() + " kell " + dateEt.fullTime() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			res.render("genericlist", {heading: "Registreeritud kÃ¼lastused", listData: ["Ei leidnud Ã¼htegi kÃ¼lastust!"]});
		}
		else {
			listData = data.split(";");
			let correctListData = [];
			for(let i = 0; i < listData.length - 1; i ++){
				correctListData.push(listData[i]);
			}
			res.render("genericlist", {heading: "registreeritud kÃ¼lastused", listData: correctListData});
		}
	});
});

//Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/Eestifilm", eestifilmRouter);

//Galerii fotode üleslaadimine
const photoupRouter = require("./routes/photoupRoutes");
app.use("/galleryphotoupload", photoupRouter);

app.listen(5124);