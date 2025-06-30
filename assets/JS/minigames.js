// ajouter dans le tableau les mots et leurs définition afin de les ajouter au jeux
const data = [
    {
        word: "Liberté",
        definition: "Droit de faire ce que l’on veut dans le respect de la loi et d’autrui."
    },
    {
        word: "Égalité",
        definition: "Principe selon lequel tous les citoyens ont les mêmes droits et devoirs."
    },
    {
        word: "Fraternité",
        definition: "Solidarité et entraide entre les citoyens."
    },
    {
        word: "Laïcité",
        definition: "Principe de séparation des religions et de l’État."
    },
    {
        word: "Citoyen",
        definition: "Personne qui appartient à un pays et qui a des droits et des devoirs."
    },
    {
        word: "République",
        definition: "Régime politique où le pouvoir appartient au peuple et où les dirigeants sont élus."
    },
    {
        word: "Démocratie",
        definition: "Système où le peuple participe aux décisions par le vote."
    },
    {
        word: "Droit",
        definition: "Règle qui fixe ce que l’on peut faire ou ne pas faire."
    },
    {
        word: "Devise",
        definition: "Phrase courte qui exprime les valeurs d’un pays."
    },
    {
        word: "Constitution",
        definition: "Texte qui organise le fonctionnement de l’État et fixe les droits des citoyens."
    }
];

let shuffledWords = [];
let shuffledDefinitions = [];
let matches = {};
let score = 0;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function renderGame() {
    const selection = shuffle([...data]).slice(0, 4);
    shuffledWords = shuffle([...selection]);
    shuffledDefinitions = shuffle([...selection]);
    matches = {};
    score = 0;
    document.getElementById('result').innerText = '';
    document.getElementById('restart').style.display = 'none';

    // affichage des mots (zones de drag)
    const wordsDiv = document.getElementById('words');
    wordsDiv.innerHTML = '<strong>Mots :</strong><br>';
    shuffledWords.forEach((item, idx) => {
        const span = document.createElement('span');
        span.innerText = item.word;
        span.draggable = true;
        span.id = 'word-' + idx;
        span.className = 'draggable-word';
        span.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', item.word);
        };
        wordsDiv.appendChild(span);
    });

    // affiche les def (zones de drop)
    const defsDiv = document.getElementById('definitions');
    defsDiv.innerHTML = '<strong>Définitions :</strong>';
    shuffledDefinitions.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'dropzone';
        div.id = 'def-' + idx;
        div.ondragover = (e) => e.preventDefault();
        div.ondrop = (e) => handleDrop(e, idx);
        div.innerHTML = `<span>${item.definition}</span><br><span class="drop-word" id="drop-word-${idx}"></span>`;
        defsDiv.appendChild(div);
    });
}
function handleDrop(e, defIdx) {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    const def = shuffledDefinitions[defIdx];
    // un seul mot par def
    if (document.getElementById('drop-word-' + defIdx).innerText !== '') return;
    document.getElementById('drop-word-' + defIdx).innerText = word;
    matches[defIdx] = word;
    // supprime le mot de la liste des mots à glisser si il a été posé
    const wordElem = Array.from(document.getElementsByClassName('draggable-word')).find(el => el.innerText === word);
    if (wordElem) wordElem.remove();
    // vérifie si on a fini de poser tous les mots
    if (Object.keys(matches).length === shuffledDefinitions.length) checkResult();
}

function checkResult() {
    let correct = 0;
    for (let i = 0; i < shuffledDefinitions.length; i++) {
        const dropWordElem = document.getElementById('drop-word-' + i);
        if (matches[i] === shuffledDefinitions[i].word) {
            correct++;
            if (dropWordElem) {
                dropWordElem.classList.add('correct');
                dropWordElem.classList.remove('incorrect');
            }
        } else {
            if (dropWordElem) {
                dropWordElem.classList.add('incorrect');
                dropWordElem.classList.remove('correct');
            }
        }
    }
    score = correct;
    document.getElementById('result').innerText = `Résultat : ${score} / ${shuffledDefinitions.length}`;
    document.getElementById('restart').style.display = 'inline-block';
}

document.getElementById('restart').onclick = renderGame;

renderGame();



// JEUX VRAI OU FAUX 
// ajouter dans le tableau les questions et leurs réponses en suivant le format
const vfQuestions = [
    { q: "La devise de la République française est Liberté, Égalité, Fraternité.", a: true },
    { q: "La laïcité interdit toute religion en France.", a: false },
    { q: "Tous les citoyens sont égaux devant la loi.", a: true },
    { q: "On peut voter en France à partir de 16 ans.", a: false }
];

let vfIndex = 0, vfScore = 0;

// affiche la question 
function showVFQuestion() {
    // Efface le dernier feedback puis retire le bouton question suivant pui affiche la question actuelle
    document.getElementById('vf-feedback').innerText = '';
    document.getElementById('vf-next').style.display = 'none';
    document.getElementById('vf-question').innerText = vfQuestions[vfIndex].q;
}

// check si la réponse est true
document.getElementById('vf-true').onclick = () => checkVF(true);
// check si la réponse est false 
document.getElementById('vf-false').onclick = () => checkVF(false);

// gestion du passage a la questions suivante 
document.getElementById('vf-next').onclick = () => {
    vfIndex++; 
    if (vfIndex < vfQuestions.length) {
        showVFQuestion();
    } else {
        // si c'était la dernière question, affiche le score final
        document.querySelector('.minigames-container').innerHTML = `<h2>Score : ${vfScore} / ${vfQuestions.length}</h2>`;
    }
};

// check la réponse de l'user
function checkVF(ans) {
    // si c'est true ajoute du score et affiche un message de succès, sinon affiche un message comme quoi c'est faux
    if (ans === vfQuestions[vfIndex].a) {
        document.getElementById('vf-feedback').innerText = "Bonne réponse !";
        vfScore++;
    } else {
        document.getElementById('vf-feedback').innerText = "Mauvaise réponse.";
    }
    // montre le question suivante
    document.getElementById('vf-next').style.display = 'inline-block';
}

// affiche la premiere question au début du jeu
showVFQuestion();