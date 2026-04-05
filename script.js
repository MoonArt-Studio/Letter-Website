const character = document.getElementById("character");
const bubble = document.getElementById("bubble");
const choicesDiv = document.getElementById("choices");
const bg = document.getElementById("bg");

let currentScenes = [];
let sceneIndex = 0;
let typing = false;
let fullText = "";
let typingTimer;

function typeText(text, callback) {
    if (typingTimer) clearTimeout(typingTimer);
    bubble.innerHTML = "";
    bubble.classList.remove("hidden");
    fullText = text;
    let i = 0;
    typing = true;

    function type() {
        if (i < text.length) {
            bubble.innerHTML += text[i];
            i++;
            typingTimer = setTimeout(type, 35);
        } else {
            typing = false;
            if (callback) callback();
        }
    }
    type();
}

function completeText() {
    if (typingTimer) clearTimeout(typingTimer);
    bubble.innerHTML = fullText;
    typing = false;
}

function loadScene(scene) {
    if (!scene) return;

    // Apply specific scene effects
    if (scene.img && scene.img.includes("slap.png")) {
        triggerShake();
        bubble.classList.add("impact-text");
    } else {
        bubble.classList.remove("impact-text");
    }

    character.style.opacity = 0;
    character.style.transform = "translateX(-50%) translateY(20px)";

    setTimeout(() => {
        if (scene.img) {
            character.src = scene.img;
            character.classList.remove("hidden");
        } else {
            character.classList.add("hidden");
        }
        
        character.style.opacity = 1;
        character.style.transform = "translateX(-50%) translateY(0)";

        if (scene.text) {
            typeText(scene.text, () => {
                if (scene.choices) showChoices(scene.choices);
            });
        } else {
            bubble.classList.add("hidden");
            if (scene.choices) showChoices(scene.choices);
        }
    }, 200);
}

function triggerShake() {
    bg.classList.add("shake");
    setTimeout(() => bg.classList.remove("shake"), 500);
}

function nextScene(e) {
    // Prevent double clicking / button interference
    if (e && e.target.tagName === 'BUTTON') return;

    if (typing) {
        completeText();
        const currentScene = currentScenes[sceneIndex - 1];
        if (currentScene && currentScene.choices) {
            showChoices(currentScene.choices);
        }
        return;
    }

    // Hide choices if moving forward
    choicesDiv.classList.add("hidden");

    if (sceneIndex < currentScenes.length) {
        loadScene(currentScenes[sceneIndex]);
        sceneIndex++;
    }
}

function showChoices(options) {
    choicesDiv.innerHTML = "";
    choicesDiv.classList.remove("hidden");

    options.forEach(opt => {
        let btn = document.createElement("button");
        btn.innerText = opt.text;
        btn.onclick = (e) => {
            e.stopPropagation(); // Avoid triggering nextScene on document
            choicesDiv.classList.add("hidden");
            startPath(opt.next);
        };
        choicesDiv.appendChild(btn);
    });
}

function startPath(pathName) {
    currentScenes = paths[pathName];
    sceneIndex = 0;
    nextScene();
}

const mainStory = [
    { img: "images/bg_park.png", text: "..." },
    { img: "images/gojo_peek.png", text: "👀" },
    { img: "images/gojo-twerking.webp", text: "Gonna make this special! 🍑" },
    { img: "images/gojo_hi.png", text: "Hi." },
    { img: "images/anywhere_girl.png", text: "..." },
    { img: "images/gojo_emotional.png", text: "Do you know how long I waited for this day..." },
    { img: "images/anywhere_girl.png", text: "???" },
    { img: "images/gojo_emotional.png", text: "It's your birthday." },
    { img: "images/gojo_cake.png", text: "Here... take this 🎂" },
    { img: "images/blowing_candles.png", text: "Close your eyes and make a wish..." },
    { img: "images/gojo_eat.png", text: "*NOM NOM NOM*" },
    { img: "images/gojo_eat.png", text: "Hey! You ate the whole thing?!" },
    { img: "images/gojo_gift.png", text: "Wait! I got a gift for you to make up for it." },
    { img: "images/gojo_gift_2.png", text: "Open it! Open it!" },
    {
        img: "images/gojo_gift_2.png",
        text: "(WHAT?! FAT BURNER PILLS?!)",
        choices: [
            { text: "Slap him", next: "slapPath" },
            { text: "Laugh it off", next: "laughPath" }
        ]
    }
];

const paths = {
    laughPath: [
        { img: "images/gojo_hi.png", text: "Glad you liked it 😎" },
        { img: "images/bg_park.png", text: "End - The Laughing Path" }
    ],
    slapPath: [
        { img: "images/slap.png", text: "*SLAP*" },
        {
            img: "images/gojo_cry.png",
            text: "😭😭😭 WHY?! IT WAS A THOUGHTFUL GIFT!!",
            choices: [
                { text: "Comfort him", next: "comfortPath" },
                { text: "Leave", next: "leavePath" }
            ]
        }
    ],
    leavePath: [
        { img: "images/anywhere_girl.png", text: "You walk away in disgust." },
        { img: "images/gojo_cry.png", text: "He cries louder... and louder." },
        { img: "images/bg_park.png", text: "End - The Departure Path" }
    ],
    comfortPath: [
        { img: "images/girl_comfort.png", text: "There, there... (even if you are a jerk)" },
        { img: "images/gojo_emotional.png", text: "sniff... you're so kind to forgive me..." },
        {
            img: "images/gojo_hug_attempt.png",
            text: "(He leans in for a sudden hug...)",
            choices: [
                { text: "Push him", next: "pushPath" },
                { text: "Hug him", next: "hugPath" }
            ]
        }
    ],
    pushPath: [
        { img: "images/push.png", text: "STAY BACK!" },
        { img: "images/anywhere_girl.png", text: "You leave him there to rethink his life choices." },
        { img: "images/bg_park.png", text: "End - The Rejection Path" }
    ],
    hugPath: [
        { img: "images/dont use.png", text: "Fine... just one hug." },
        { img: "images/hand_kiss.png", text: "*Gojo suddenly kisses your hand*" },
        { img: "images/gojo_run.png", text: "Gurl, you're fast but not fast enoughhh! SEE YA!" },
        { img: "images/anywhere_girl.png", text: "End - The Romantic(?) Path" }
    ]
};

// Start the game correctly
window.onload = () => {
    currentScenes = mainStory;
    sceneIndex = 0;
    nextScene();
};

document.addEventListener("click", nextScene);
