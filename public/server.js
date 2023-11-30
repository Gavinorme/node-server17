const express = require("express");
const bodyParser = require("body-parser");
const joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const startMongo = require("./db");
const User = require("./user");
const app = express();
app.use(express.static("public"));

startMongo();

app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.listen(3002, ()=>{
    console.log("I'm listening");
});