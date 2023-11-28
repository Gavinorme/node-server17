const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let players = [
    {
        id: 1, name: "Lebron James", position: "Power Forward", team: "Lakers", nickname: "King James", skills: ["Strength, agility and high basketball intelligence"], img: "images/lebron.jpeg", 
    },
    {
        id: 2, name: "Stephen Curry", position: "Power Forward", team: "Warriors", nickname: "Chef Curry", skills: ["Shooting, handling, and passing"], img: "images/steph.jpeg", 
    },
    {
        id: 3, name: "Kevin Durant", position: "Power Forward", team: "Suns", nickname: "EasyMoneySniper", skills: ["Shooting, isolation, and mid-range"], img: "images/kd.jpeg", 
    },
    {
        id: 4, name: "Damian Lillard", position: "Power Forward", team: "Bucks", nickname: "Dame Dolla", skills: ["Clutch, deep 3's, and handling"], img: "images/dame.jpeg", 
    },
    {
        id: 5, name: "Kyrie Irving", position: "Power Forward", team: "Mavricks", nickname: "Uncle Drew", skills: ["Handling, layups, and passing"], img: "images/kyrie.jpeg", 
    },
    {
        id: 6, name: "Nkola Jokic", position: "Power Forward", team: "Nuggets", nickname: "Joker", skills: ["Passing, shooting, and rebounds"], img: "images/jokic.jpeg", 
    },
];

app.get("/api/players", (req, res) => {
    res.send(players);
});

app.get("/api/players/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const player = players.find((r)=>r.id === id);

    if(!player) {
        res.status(404).send("The player with the given id was not found");
    }
    res.send(player);
});

app.post("/api/players", upload.single("img"), (req, res)=> {
    const result = validatePlayer(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const player = {
        _id: players.length + 1,
        name: req.body.name,
        position: req.body.position,
        team: req.body.team,
        nickname: req.body.nickname,
        
        skills: req.body.skills.split(","),
    };

    if(req.file) {
        player.img = "images/" +req.file.filename;
    }

    players.push(player);
    res.send(player);
});

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
