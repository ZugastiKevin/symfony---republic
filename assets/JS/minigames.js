const data = [
    { word: "minigames_word_liberte", definition: "minigames_def_liberte" },
    { word: "minigames_word_egalite", definition: "minigames_def_egalite" },
    { word: "minigames_word_fraternite", definition: "minigames_def_fraternite" },
    { word: "minigames_word_laicite", definition: "minigames_def_laicite" },
    { word: "minigames_word_citoyen", definition: "minigames_def_citoyen" },
    { word: "minigames_word_republique", definition: "minigames_def_republique" },
    { word: "minigames_word_democratie", definition: "minigames_def_democratie" },
    { word: "minigames_word_droit", definition: "minigames_def_droit" },
    { word: "minigames_word_devise", definition: "minigames_def_devise" },
    { word: "minigames_word_constitution", definition: "minigames_def_constitution" }
];

// gestion des tableau vrai ou faux
const vfQuestionsKeys = [
    { q: "vf_q1", a: true },
    { q: "vf_q2", a: false },
    { q: "vf_q3", a: true },
    { q: "vf_q4", a: false }
];

let shuffledWords = [];
let shuffledDefinitions = [];
let matches = {};
let score = 0;

// section pour le jeux vrai ou faux
let vfIndex = 0, vfScore = 0;
let vfFinished = false;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function getLang() {
    return localStorage.getItem('lang') || 'fr';
}

function t(key) {
    return (typeof window.translations !== "undefined" && window.translations[getLang()] && window.translations[getLang()][key]) ? window.translations[getLang()][key] : `[${key}]`;
}

function renderGame() {
    const selection = shuffle([...data]).slice(0, 4);
    shuffledWords = shuffle([...selection]);
    shuffledDefinitions = shuffle([...selection]);
    matches = {};
    score = 0;
    const resultElem = document.getElementById('result');
    const restartElem = document.getElementById('restart');
    if (resultElem) resultElem.innerText = '';
    if (restartElem) restartElem.style.display = 'none';

    // affichage des mots (zones de drag)
    const wordsDiv = document.getElementById('words');
    if (wordsDiv) {
        wordsDiv.innerHTML = '<strong>' + t('minigames_1_label') + '</strong><br>';
        shuffledWords.forEach((item, idx) => {
            const span = document.createElement('span');
            span.innerText = t(item.word);
            span.draggable = true;
            span.id = 'word-' + idx;
            span.className = 'draggable-word';
            span.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', item.word);
            };
            wordsDiv.appendChild(span);
        });
    }

    // affiche les def (zones de drop)
    const defsDiv = document.getElementById('definitions');
    if (defsDiv) {
        defsDiv.innerHTML = '<strong>' + t('minigames_1_def_label') + '</strong>';
        shuffledDefinitions.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'dropzone';
            div.id = 'def-' + idx;
            div.ondragover = (e) => e.preventDefault();
            div.ondrop = (e) => handleDrop(e, idx);
            div.innerHTML = `<span>${t(item.definition)}</span><br><span class="drop-word" id="drop-word-${idx}"></span>`;
            defsDiv.appendChild(div);
        });
    }
}

function handleDrop(e, defIdx) {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    const def = shuffledDefinitions[defIdx];
    const dropWordElem = document.getElementById('drop-word-' + defIdx);
    if (!dropWordElem || dropWordElem.innerText !== '') return;
    dropWordElem.innerText = t(word);
    matches[defIdx] = word;
    const wordElem = Array.from(document.getElementsByClassName('draggable-word')).find(el => el.innerText === t(word));
    if (wordElem) wordElem.remove();
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
    const resultElem = document.getElementById('result');
    const restartElem = document.getElementById('restart');
    if (resultElem) resultElem.innerText = `Résultat : ${score} / ${shuffledDefinitions.length}`;
    if (restartElem) restartElem.style.display = 'inline-block';
}

function showVFQuestion() {
    const vfQuestion = document.getElementById('vf-question');
    const vfFeedback = document.getElementById('vf-feedback');
    const vfNext = document.getElementById('vf-next');
    const minigamesContainer = document.querySelector('.minigames-container');
    if (!vfQuestion || !vfFeedback || !vfNext || !minigamesContainer) return;

    if (vfFinished) {
        minigamesContainer.innerHTML = `<h2>${t('vf_score')} : ${vfScore} / ${vfQuestionsKeys.length}</h2>`;
        return;
    }

    vfFeedback.innerText = '';
    vfNext.style.display = 'none';
    vfQuestion.innerText = t(vfQuestionsKeys[vfIndex].q);
}

function checkVF(ans) {
    const vfFeedback = document.getElementById('vf-feedback');
    const vfNext = document.getElementById('vf-next');
    if (!vfFeedback || !vfNext) return;
    if (ans === vfQuestionsKeys[vfIndex].a) {
        vfFeedback.innerText = t('vf_good');
        vfScore++;
    } else {
        vfFeedback.innerText = t('vf_bad');
    }
    vfNext.style.display = 'inline-block';
}

document.addEventListener('DOMContentLoaded', () => {
    const restartElem = document.getElementById('restart');
    if (restartElem) restartElem.onclick = renderGame;
    if (document.getElementById('words') && document.getElementById('definitions')) {
        renderGame();
    }

    const vfTrue = document.getElementById('vf-true');
    const vfFalse = document.getElementById('vf-false');
    const vfNext = document.getElementById('vf-next');
    const minigamesContainer = document.querySelector('.minigames-container');

    // expose pour reload dynamique
    window.showVFQuestion = function() {
        showVFQuestion();
    };
    window.renderGame = function() {
        renderGame();
    };

    if (vfTrue && vfFalse && vfNext && minigamesContainer) {
        vfIndex = 0;
        vfScore = 0;
        vfFinished = false;

        vfTrue.onclick = () => checkVF(true);
        vfFalse.onclick = () => checkVF(false);
        vfNext.onclick = () => {
            vfIndex++;
            if (vfIndex < vfQuestionsKeys.length) {
                showVFQuestion();
            } else {
                vfFinished = true;
                showVFQuestion();
            }
        };

        showVFQuestion();
    }
});