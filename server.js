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
    .connect("mongodb://localhost/players")
    // .connect("mongodb+srv://gorme:Gavinorme@cluster0.s2hjtru.mongodb.net/?retryWrites=true&w=majority")
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
    _id: mongoose.SchemaTypes.ObjectId,
});

const Player = mongoose.model("Player", playerSchema);



app.get("/api/players", (req, res) => {
    getPlayers(res);
});

const getPlayers = async(res) => {
    const players = await Player.find();
    res.send(players);
};

// let players = [
//     {
//         id: 1, name: "Lebron James", position: "Power Forward", team: "Lakers", nickname: "King James", skills: ["Strength, agility and high basketball intelligence"], img: "images/lebron.jpeg", 
//     },
//     {
//         id: 2, name: "Stephen Curry", position: "Power Forward", team: "Warriors", nickname: "Chef Curry", skills: ["Shooting, handling, and passing"], img: "images/steph.jpeg", 
//     },
//     {
//         id: 3, name: "Kevin Durant", position: "Power Forward", team: "Suns", nickname: "EasyMoneySniper", skills: ["Shooting, isolation, and mid-range"], img: "images/kd.jpeg", 
//     },
//     {
//         id: 4, name: "Damian Lillard", position: "Power Forward", team: "Bucks", nickname: "Dame Dolla", skills: ["Clutch, deep 3's, and handling"], img: "images/dame.jpeg", 
//     },
//     {
//         id: 5, name: "Kyrie Irving", position: "Power Forward", team: "Mavricks", nickname: "Uncle Drew", skills: ["Handling, layups, and passing"], img: "images/kyrie.jpeg", 
//     },
//     {
//         id: 6, name: "Nkola Jokic", position: "Power Forward", team: "Nuggets", nickname: "Joker", skills: ["Passing, shooting, and rebounds"], img: "images/jokic.jpeg", 
//     },
// ];

app.get("/api/players", (req, res) => {
    res.send(players);
});


app.get("/api/players/:id", (req, res) => {
    getPlayer(res, req.params.id);
});

const getPlayer = async(res) => {
    const player = await Player.findOne({ _id: id })
    res.send(player);
};

app.post("/api/players", upload.single("img"), (req, res)=> {
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
    
    // {
    //     _id: players.length + 1,
    //     name: req.body.name,
    //     position: req.body.position,
    //     team: req.body.team,
    //     nickname: req.body.nickname,
        
    //     skills: req.body.skills.split(","),
    // };

    if(req.file) {
        player.img = "images/" +req.file.filename;
    }
    createPlayer(res, player);
});

const createPlayer = async (res, player) =>{
    const result = await player.save();
    res.send(player);
};



app.put("/api/players/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const player = players.find((r)=>r.id === id);
    
    const result = validatePlayer(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    player.name = req.body.name;
    player.position = req.body.position;
    player.team = req.body.team;
    player.nickname = req.body.nickname;
    player.skills = req.body.skills.split(",");

    if(req.file) {
        player.img = "images/" +req.file.filename;
    }

    res.send(player);
});

app.delete("/api/players/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const player = players.find((r)=>r.id === id);

    if(!player) {
        res.status(400).send("The player with the given id was not found.");
        return;
    }

    const index = players.indexOf(player);
    players.splice(index,1);
    res.send(player);
});

const validatePlayer = (player) => {
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
