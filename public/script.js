const getPlayer = async () => {
    try {
        return (await fetch("https://node-server4.onrender.com/api/players")).json();
    } catch(error) {
        console.log("error");
    }
};



const showPlayer = async () => {
    let players = await getPlayer();
    let playersDiv = document.getElementById("player-list");
    playersDiv.innerHTML = "";
    players.forEach((player) => {
        const section = document.createElement("section");
        playersDiv.append(section);

        const  a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = player.name;
        a.append(h3);

        if(player.img) {
        const img = document.createElement("img");
        section.append(img);
        img.src = "https://node-server4.onrender.com/" + player.img;
        } 

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(player);
        }
    });
};

const displayDetails = (player) => 
{
    const playerDetails = document.getElementById("player-details");
    playerDetails.innerHTML = "";

    const dLink = document.createElement("a");
    dLink.innerHTML = " &#x2715;";
    playerDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    playerDetails.append(eLink);
    eLink.id = "edit-link";

    const h3 = document.createElement("h3");
    h3.innerHTML = player.name;
    playerDetails.append(h3);

    const h4 = document.createElement("h4");
    h4.innerHTML = player.position;
    playerDetails.append(h4);

    const p = document.createElement("p");
    p.innerHTML = player.team;
    playerDetails.append(p);

    const p1 = document.createElement("p");
    p1.innerHTML = player.nickname;
    playerDetails.append(p1);

    const ul = document.createElement("ul");
    playerDetails.append(ul);
    console.log(player.skills);
    player.skills.forEach((skill) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = skill;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("second-title").innerHTML = "Edit Player";
    };
    dLink.onclick = (e) => {
        e.preventDefault();
        deletePlayer(player);
    };
    populateEditForm(player);
};

const deletePlayer = async (player) => {
    let response = await fetch(`https://node-server4.onrender.com/api/players/${player.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    });

    if(response.status != 200)
    {
        console.log("Error delete");
        return;
    }

    let result = await response.json();
    showPlayer();
    document.getElementById("player-details").innerHTML = "";
    resetForm();
};

const populateEditForm = (player) => {
    const form = document.getElementById("add-player");
    form._id.value = player.id;
    form.name.value = player.name;
    form.position.value = player.position
    form.team.value = player.team;
    form.nickname.value = player.nickname;

    //add skills
    populateSkills(player.skills);
};

const populateSkills = (skills) => {
    const section = document.getElementById("skill-boxes");
    skills.forEach((skill)=>{
        const input = document.createElement("input");
        input.type = "text";
        input.value = skill;
        section.append(input);
    });
};

const addPlayer = async (e) => 
{
    e.preventDefault();
    const form = document.getElementById("add-player");
    const formData = new FormData(form);
    formData.append("skills", getSkills());
    let response;

    //new player
    if(form._id.value == -1) {
        formData.delete("_id");
        // console.log(...formData);
    
        response = await fetch("https://node-server4.onrender.com/api/players", {
            method: "POST",
            body: formData,
        });
    }

        else { //existing player
            response = await fetch(`https://node-server4.onrender.com/api/players/${form._id.value}`,{
                method: "PUT",
                body: formData,
            });
        }
    if(response.status != 200) {
        console.log("Error contacting server");
        return;
    }
    player = await response.json();

    //in edit mode
    if(form._id.value != -1)
    {
        //get the player with the indicated id
        //then display
        displayDetails(player);
    }

    document.querySelector(".dialog").classList.add("transparent");
    resetForm();
    showPlayer();
};

const addSkill = (e) => 
{
    e.preventDefault();
    const section = document.getElementById("skill-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
};

const getSkills = () => {
    const inputs = document.querySelectorAll("#skill-boxes input");
    const skills = [];

    inputs.forEach((input)=>
    {
        skills.push(input.value);
    });

    return skills;
}

const resetForm = () => {
    const form = document.getElementById("add-player");
    form.reset();
    form._id = "-1";
    document.getElementById("skill-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("second-title").innerHTML = "Add your Favorite Player";
    resetForm();
};


window.onload = () => 
{
    showPlayer();
    document.getElementById("add-player").onsubmit = addPlayer;
    document.getElementById("add-link").onclick = showHideAdd;

    document.getElementById("add-skill").onclick = addSkill;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };
};