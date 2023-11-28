const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost/players")
    .then(() => console.log("Connected to mongodb"))
    .catch((error) => console.log("Couldn't connect to mongodb", error));

const playerSchema = new mongoose.Schema({
    name: String,
    position: String,
    team: String,
    nickname: String,
    skills: [String],
});

const Player = mongoose.model("Player", playerSchema);

const createPlayer = async () => {
    const player = new Player({
        name: "Lebron James",
        position: "Power Forward",
        team: "Lakers",
        nickname: "King James",
        skills: ["Strength", "Agility", "High basketball IQ"],
    });

    const result = await player.save();
    console.log(result);
};

createPlayer();