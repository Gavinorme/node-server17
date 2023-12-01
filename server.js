const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose
    .connect("mongodb+srv://gorme:Gavinorme@cluster0.s2hjtru.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to mongodb")
    })
    .catch((error) => console.log("Couldn't connect to mongodb", error));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const playerSchema = new mongoose.Schema({
    name: String,
    position: String,
    team: String,
    nickname: String,
    skills: [String],
    img: String,
    // _id: mongoose.SchemaTypes.ObjectId,
});

const Player = mongoose.model("Player", playerSchema);



app.get("https://node-server-17.onrender.com/api/players", (req, res) => {
    getPlayers(res);
});

const getPlayers = async(res) => {
    const players = await Player.find();
    res.send(players);
};


// app.get("/api/players", (req, res) => {
//     res.send(players);
// });


app.get("https://node-server-17.onrender.com/api/players/:id", (req, res) => {
    getPlayer(res, req.params.id);
});

const getPlayer = async(res) => {
    const player = await Player.findOne({ _id: id })
    res.send(player);
};

app.post("https://node-server-17.onrender.com/api/players", upload.single("img"), (req, res)=> {
    const result = validatePlayer(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const player = new Player({
        name: req.body.name,
        position: req.body.position,
        team: req.body.team,
        nickname: req.body.nickname,
        skills: req.body.skills.split(",")
    })
    
    

    if(req.file) {
        player.img = "images/" +req.file.filename;
    }
    createPlayer(res, player);
});

const createPlayer = async (res, player) =>{
    const result = await player.save();
    res.send(player);
};



app.put("https://node-server-17.onrender.com/api/players/:id", upload.single("img"), (req, res) => {

    
    
    const result = validatePlayer(req.body);
    console.log(result);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    updatePlayer(req,res);
});

const updatePlayer = async (req, res) => {
    let fieldsToUpdate = {
        name: req.body.name,
        position: req.body.position,
        team: req.body.team,
        nickname: req.body.nickname,
        skills: req.body.skills.split(",")
    }

    if(req.file) {
        fieldsToUpdate.img = "images/" + req.file.filename;
    }
    const result = await Player.updateOne({_id:req.params.id}, fieldsToUpdate);
    const player = await Player.findById(req.params.id);
    res.send(player);
};

app.delete("https://node-server-17.onrender.com/api/players/:id", (req, res) => {
    removePlayers(res, req.params.id);
});

const removePlayers = async (res, id) => {
    const player = await Player.findByIdAndDelete(id);
    res.send(player);
};

function validatePlayer(player) {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        position: Joi.string().min(3).required(),
        team: Joi.string().min(3).required(),
        nickname: Joi.string().min(3).required(),
        skills: Joi.allow(""),
    });

    return schema.validate(player);
} 


app.listen(3000, () => {
    console.log("Listening");
});
