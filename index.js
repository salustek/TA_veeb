const express = require("express");

//käivitan express.js funktsiooni ja annan talle nimeks "app"
const app = express();
//määran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    //res.send("Express.js läks käima ja serveerib veebi!");
    res.render("index");
});

app.listen(5124);
