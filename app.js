// https://opentdb.com/api.php?amount=10

let Category = document.querySelector('.quiz-subject')
let Question = document.querySelector('.main-question')
let AnswerLiWrraper = document.querySelector('.quiz-question-box')
let ResultContainer = document.querySelector('.result')

let quizDiscription = document.querySelector('.quiz-discription')
let quizContainer = document.querySelector('.quiz-container')

let CheckBTN = document.querySelector('.Check-answer-btn')
let startBTN = document.querySelector('.start-btn')
let startAgainBTN = document.querySelector('.start-again-btn')
let generalScore = document.querySelector('.total-score')
let correctScore = document.querySelector('.result-score')

let correctAnswer = "";
let resultScore = 0;
let totalScore = 10;
let askedScore = 0;

// all event listener
function eventListeners () {
    CheckBTN.addEventListener('click' , checkAnswer )
    startAgainBTN.addEventListener('click' , StartAgain )
    startBTN.addEventListener('click' , ShowQuestion )
}

function ShowQuestion () {
    quizDiscription.style.display = 'none'
    quizContainer.style.display = 'flex'
}

// loaded data generally
window.addEventListener('load' , () => {
    loadQuestion()
    eventListeners()
    generalScore.textContent = totalScore
    correctScore.textContent = resultScore

})

// fetch data from API
async function loadQuestion () {
    fetch(`https://opentdb.com/api.php?amount=1`)
        .then( (response) => {
            return response.json()
        })
        .then((Data) => {
            ResultContainer.innerHTML = ''
            showData(Data.results[0])
        })
        .catch((err) => {
            ResultContainer.innerHTML = `
                <p>Please Wait...</p>
            `;
            setTimeout(() => {
                loadQuestion()
            } , 2000)
        })
}

// show api data in DOM
function showData(data){
    CheckBTN.disabled = false;
    correctAnswer = data.correct_answer
    let incorrectAnswer = data.incorrect_answers
    let AnswerList = incorrectAnswer
    AnswerList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)) , 0 , correctAnswer );
    Question.innerHTML = `${data.question}`
    Category.innerHTML = `${data.category}`
    AnswerLiWrraper.innerHTML = `
        ${AnswerList.map((liItem , index) => `<li> ${index + 1}. <span> ${liItem} </span> </li>`).join('')}
    `;
    selectedLiAnswer()
    console.log(correctAnswer)
}

// hundle the selected answer
function selectedLiAnswer(){
    AnswerLiWrraper.querySelectorAll('li').forEach((liItem) => {
        liItem.addEventListener('click' , () => {
            if (AnswerLiWrraper.querySelector('.selected')) {
                let activeLiItem = AnswerLiWrraper.querySelector('.selected')
                activeLiItem.classList.remove('selected')
            }
            liItem.classList.add('selected')
        })
    })
}

// check correct answer
function checkAnswer () {
    CheckBTN.disabled = true;
    if (AnswerLiWrraper.querySelector('.selected')) {
        let selectedAnswer = AnswerLiWrraper.querySelector('.selected span').textContent;
        if (selectedAnswer.trim() === changeString(correctAnswer)) {
            resultScore++;
            ResultContainer.innerHTML = `
                <p class="correct-answer"> <i class="fas fa-check"></i>Correct Answer! </p>
            `;
        }
        else{
            ResultContainer.innerHTML = `
                <p class="incorrect-answer"> <i class="fas fa-times"></i>Incorrect Answer! </p>
                <p class="correct-answer"> Correct Answer: ${correctAnswer} </p>
            `;
        }
        checkScore()
    }
    else{
        ResultContainer.innerHTML = `<p> Please Select an Answer! </p>`;
        CheckBTN.disabled = false;
    }
}

// use new DOMParser() and parseformstring( , );
function changeString(stringtext){
    let htmlDoc = new DOMParser().parseFromString(stringtext , "text/html")
    return htmlDoc.documentElement.textContent;
}

// check score
function checkScore(){
    askedScore++;
    setCount();
    if (askedScore == totalScore) {
        ResultContainer.innerHTML = `<p> Your Score : ${resultScore} </p>`
        CheckBTN.style.display = 'none'
        startAgainBTN.style.display = 'block'
    }
    else{
        setTimeout(() => {
            loadQuestion()
        } , 1000)
    }
}

function setCount(){
    generalScore.textContent = totalScore
    correctScore.textContent = resultScore
}

// start quiz again
function StartAgain(){
    resultScore = askedScore = 0;
    CheckBTN.style.display = 'block'
    startAgainBTN.style.display = 'none'
    CheckBTN.disabled = false;
    setCount();
    loadQuestion();
}

