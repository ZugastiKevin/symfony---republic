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

// Questions étendues pour le vrai/faux (10 questions au total)
const vfQuestionsKeys = [
    { q: "vf_q1", a: true },   // La devise de la République française est Liberté, Égalité, Fraternité
    { q: "vf_q2", a: false },  // La laïcité interdit toute religion en France
    { q: "vf_q3", a: true },   // Tous les citoyens sont égaux devant la loi
    { q: "vf_q4", a: false },  // On peut voter en France à partir de 16 ans
    { q: "vf_q5", a: true },   // Le président de la République est élu au suffrage universel direct
    { q: "vf_q6", a: false },  // La France est une monarchie constitutionnelle
    { q: "vf_q7", a: true },   // La Constitution de 1958 définit la Ve République
    { q: "vf_q8", a: false },  // Le Premier ministre est élu directement par les citoyens
    { q: "vf_q9", a: true },   // L'Assemblée nationale vote les lois
    { q: "vf_q10", a: false }  // Le mandat présidentiel dure 7 ans
];

let shuffledWords = [];
let shuffledDefinitions = [];
let matches = {};
let score = 0;

// Variables pour le jeu vrai/faux
let vfIndex = 0, vfScore = 0;
let vfFinished = false;
let vfAnswers = [];
let vfSelectedQuestions = [];
let vfDifficulty = 4; // Par défaut : 4 questions

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

    // affichage des mots (zones de drag) - SANS le label supplémentaire
    const wordsDiv = document.getElementById('words');
    if (wordsDiv) {
        wordsDiv.innerHTML = ''; // Vide le contenu sans ajouter de label
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

    // affiche les def (zones de drop) - SANS le label supplémentaire
    const defsDiv = document.getElementById('definitions');
    if (defsDiv) {
        defsDiv.innerHTML = ''; // Vide le contenu sans ajouter de label
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

// Fonction pour sélectionner la difficulté
function selectVFDifficulty(difficulty) {
    vfDifficulty = difficulty;
    
    // Met à jour l'interface pour montrer la difficulté sélectionnée
    document.querySelectorAll('.vf-difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
    
    // Cache le sélecteur et lance le jeu
    document.querySelector('.vf-difficulty-selector').style.display = 'none';
    document.querySelector('.vf-game-content').style.display = 'block';
    
    // Initialise le jeu avec la difficulté choisie
    initVFGame();
}

// Fonction pour initialiser le jeu vrai/faux
function initVFGame() {
    vfIndex = 0;
    vfScore = 0;
    vfFinished = false;
    vfAnswers = [];
    
    // Sélectionne aléatoirement les questions selon la difficulté
    vfSelectedQuestions = shuffle([...vfQuestionsKeys]).slice(0, vfDifficulty);
    
    // Configure les événements pour les boutons AVANT d'afficher la question
    setupVFGame();
    showVFQuestion();
}

function showVFQuestion() {
    const vfQuestion = document.getElementById('vf-question');
    const vfFeedback = document.getElementById('vf-feedback');
    const vfNext = document.getElementById('vf-next');
    const vfScoreElem = document.getElementById('vf-score');
    const vfProgress = document.getElementById('vf-progress');
    
    if (!vfQuestion || !vfFeedback || !vfNext) return;

    if (vfFinished) {
        showVFResults();
        return;
    }

    vfFeedback.innerText = '';
    vfFeedback.className = '';
    vfNext.style.display = 'none';
    vfQuestion.innerText = t(vfSelectedQuestions[vfIndex].q);
    
    // Mise à jour du score
    if (vfScoreElem) {
        vfScoreElem.innerText = `${t('vf_score')} : ${vfScore} / ${vfDifficulty}`;
    }
    
    // Mise à jour de la progression
    if (vfProgress) {
        vfProgress.innerText = `${t('vf_question')} ${vfIndex + 1} / ${vfDifficulty}`;
    }
    
    // Réactive les boutons pour la nouvelle question
    const vfTrue = document.getElementById('vf-true');
    const vfFalse = document.getElementById('vf-false');
    if (vfTrue && vfFalse) {
        vfTrue.disabled = false;
        vfFalse.disabled = false;
    }
}

function showVFResults() {
    const gameContent = document.querySelector('.vf-game-content');
    if (!gameContent) return;

    // Calcul du pourcentage
    const percentage = Math.round((vfScore / vfDifficulty) * 100);
    
    // Détermine le message selon le score
    let resultMessage, resultClass, emoji;
    if (percentage >= 80) {
        resultMessage = getLang() === 'fr' ? 'Excellent ! Vous maîtrisez bien les valeurs républicaines !' : 'Excellent! You master republican values well!';
        resultClass = 'excellent';
        emoji = '🏆';
    } else if (percentage >= 60) {
        resultMessage = getLang() === 'fr' ? 'Bien joué ! Continuez à apprendre !' : 'Well done! Keep learning!';
        resultClass = 'good';
        emoji = '👍';
    } else {
        resultMessage = getLang() === 'fr' ? 'Continuez vos efforts ! La République française n\'aura plus de secrets pour vous !' : 'Keep trying! The French Republic will have no more secrets for you!';
        resultClass = 'needs-improvement';
        emoji = '📚';
    }

    gameContent.innerHTML = `
        <div class="vf-final-results">
            <div class="vf-result-header">
                <div class="vf-result-emoji">${emoji}</div>
                <h2 class="vf-result-title">${t('vf_final_title') || (getLang() === 'fr' ? 'Quiz terminé !' : 'Quiz completed!')}</h2>
                <div class="vf-difficulty-badge">${getLang() === 'fr' ? 'Difficulté' : 'Difficulty'} : ${vfDifficulty} ${getLang() === 'fr' ? 'questions' : 'questions'}</div>
            </div>
            
            <div class="vf-result-score ${resultClass}">
                <div class="vf-score-circle">
                    <div class="vf-score-number">${vfScore}</div>
                    <div class="vf-score-total">/ ${vfDifficulty}</div>
                </div>
                <div class="vf-score-percentage">${percentage}%</div>
            </div>
            
            <div class="vf-result-message">
                <p>${resultMessage}</p>
            </div>
            
            <div class="vf-result-details">
                <h3>${getLang() === 'fr' ? 'Détail des réponses :' : 'Answer details:'}</h3>
                <div class="vf-questions-recap">
                    ${vfSelectedQuestions.map((item, index) => `
                        <div class="vf-question-item ${vfAnswers[index] === item.a ? 'correct' : 'incorrect'}">
                            <div class="vf-question-number">${index + 1}</div>
                            <div class="vf-question-text">${t(item.q)}</div>
                            <div class="vf-question-result">
                                ${vfAnswers[index] === item.a ? '✅' : '❌'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="vf-result-actions">
                <button id="vf-restart" class="vf-restart-btn">
                    ${getLang() === 'fr' ? '🔄 Recommencer' : '🔄 Restart'}
                </button>
                <button id="vf-new-difficulty" class="vf-new-difficulty-btn">
                    ${getLang() === 'fr' ? '⚡ Changer de difficulté' : '⚡ Change difficulty'}
                </button>
                <button id="vf-continue" class="vf-continue-btn">
                    ${getLang() === 'fr' ? '➡️ Continuer l\'apprentissage' : '➡️ Continue learning'}
                </button>
            </div>
        </div>
    `;

    // Ajout des événements
    const restartBtn = document.getElementById('vf-restart');
    const newDifficultyBtn = document.getElementById('vf-new-difficulty');
    const continueBtn = document.getElementById('vf-continue');
    
    if (restartBtn) {
        restartBtn.onclick = () => {
            initVFGame();
            resetVFGameInterface();
        };
    }
    
    if (newDifficultyBtn) {
        newDifficultyBtn.onclick = () => {
            resetVFGameInterface();
            document.querySelector('.vf-difficulty-selector').style.display = 'block';
            document.querySelector('.vf-game-content').style.display = 'none';
        };
    }
    
    if (continueBtn) {
        continueBtn.onclick = () => {
            document.querySelector('.drag-drop-game')?.scrollIntoView({ behavior: 'smooth' });
        };
    }
}

function resetVFGameInterface() {
    const gameContent = document.querySelector('.vf-game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="question-container">
            <div id="vf-progress"></div>
            <div id="vf-question"></div>
        </div>
        
        <div class="score-display">
            <div id="vf-score">${t('vf_score')} : 0 / ${vfDifficulty}</div>
        </div>
        
        <div class="answer-buttons">
            <button id="vf-true" data-i18n="minigames_2_true">${t('minigames_2_true')}</button>
            <button id="vf-false" data-i18n="minigames_2_false">${t('minigames_2_false')}</button>
        </div>
        
        <div class="feedback-container">
            <div id="vf-feedback"></div>
            <button id="vf-next" data-i18n="minigames_2_next">${t('minigames_2_next')}</button>
        </div>
    `;
    
    // Reconfigure les événements après avoir recréé le HTML
    setupVFGame();
    showVFQuestion();
}

function checkVF(ans) {
    const vfFeedback = document.getElementById('vf-feedback');
    const vfNext = document.getElementById('vf-next');
    const vfTrue = document.getElementById('vf-true');
    const vfFalse = document.getElementById('vf-false');
    
    if (!vfFeedback || !vfNext) return;
    
    // Désactive les boutons après réponse
    if (vfTrue && vfFalse) {
        vfTrue.disabled = true;
        vfFalse.disabled = true;
    }
    
    // Stocke la réponse
    vfAnswers[vfIndex] = ans;
    
    if (ans === vfSelectedQuestions[vfIndex].a) {
        vfFeedback.innerText = t('vf_good');
        vfFeedback.className = 'vf-feedback-correct';
        vfScore++;
    } else {
        vfFeedback.innerText = t('vf_bad');
        vfFeedback.className = 'vf-feedback-incorrect';
    }
    vfNext.style.display = 'inline-block';
    
    // Mise à jour du score en temps réel
    const vfScoreElem = document.getElementById('vf-score');
    if (vfScoreElem) {
        vfScoreElem.innerText = `${t('vf_score')} : ${vfScore} / ${vfDifficulty}`;
    }
}

function setupVFGame() {
    const vfTrue = document.getElementById('vf-true');
    const vfFalse = document.getElementById('vf-false');
    const vfNext = document.getElementById('vf-next');

    console.log('Setup VF Game - Boutons trouvés:', { 
        vfTrue: !!vfTrue, 
        vfFalse: !!vfFalse, 
        vfNext: !!vfNext 
    });

    if (vfTrue && vfFalse && vfNext) {
        // Supprime les anciens événements pour éviter les doublons
        vfTrue.onclick = null;
        vfFalse.onclick = null;
        vfNext.onclick = null;
        
        // Ajoute les nouveaux événements
        vfTrue.onclick = (e) => {
            console.log('Bouton VRAI cliqué');
            e.preventDefault();
            checkVF(true);
        };
        
        vfFalse.onclick = (e) => {
            console.log('Bouton FAUX cliqué');
            e.preventDefault();
            checkVF(false);
        };
        
        vfNext.onclick = (e) => {
            console.log('Bouton SUIVANT cliqué');
            e.preventDefault();
            vfIndex++;
            if (vfIndex < vfDifficulty) {
                showVFQuestion();
            } else {
                vfFinished = true;
                showVFQuestion();
            }
        };
        
        console.log('Événements VF configurés avec succès');
    } else {
        console.error('Impossible de configurer les événements VF - Boutons manquants');
    }
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé - Initialisation des jeux');
    
    const restartElem = document.getElementById('restart');
    if (restartElem) restartElem.onclick = renderGame;
    if (document.getElementById('words') && document.getElementById('definitions')) {
        renderGame();
    }

    // expose pour reload dynamique
    window.showVFQuestion = function() {
        showVFQuestion();
    };
    window.renderGame = function() {
        renderGame();
    };
    window.selectVFDifficulty = function(difficulty) {
        selectVFDifficulty(difficulty);
    };

    // Initialisation du jeu vrai/faux avec sélecteur de difficulté
    if (document.querySelector('.true-false-game')) {
        console.log('Jeu vrai/faux détecté - Configuration des boutons de difficulté');
        
        // Configuration des boutons de difficulté
        document.querySelectorAll('.vf-difficulty-btn').forEach(btn => {
            btn.onclick = () => {
                const difficulty = parseInt(btn.dataset.difficulty);
                console.log('Difficulté sélectionnée:', difficulty);
                selectVFDifficulty(difficulty);
            };
        });
        
        console.log('Boutons de difficulté configurés');
    }
});