'use strict'

function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

function getElCell(pos) {
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`)
}

function getEmptyCellHeroRow() {
    var emptyCells = []
    for (var j = 0; j < gBoard[gHero.pos.i].length; j++) {
        const cell = gBoard[gHero.pos.i][j]
        if (cell.gameObject === null) emptyCells.push({ i: gHero.pos.i, j })
    }
    var randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]

}

function renderScore() {
    const elScore = document.querySelector('.score')
    const elSpan = elScore.querySelector('span')
    elSpan.innerHTML = gGame.score
}

function renderLives() {
    const elLives = document.querySelector('.lives')
    const elSpan = elLives.querySelector('span')
    var txt = ''
    for (var i = 0; i < gGame.lives; i++) {
        txt += '❤️'
    }

    elSpan.innerHTML = txt
}

function renderShields() {
    const elShields = document.querySelector('.lives')
    const elSpan = elShields.querySelector('span')
    var txt = ''
    for (var i = 0; i < gGame.lives; i++) {
        txt += '🛡️'
    }

    elSpan.innerHTML = txt
}

function openModal(msg) {
    const elModal = document.querySelector('.modal')
    const elSpan = elModal.querySelector('.msg')
    elSpan.innerText = msg
    elModal.style.display = 'block'
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}

function renderInstructions() {
    var elDiv = document.querySelector('.instructions')
    var instructions = `
    INSTRUCTIONS :\n
    👾 You win when all aliens clear\n
    👾 You lose when aliens reach your row\n
    👾 Move with left and right arrows\n
    👾 Press 'space' to shoot aliens\n
    👾 Blow up aliens around your laser by pressing 'n'\n
    👾 Super mode - press 'x' to shoot faster\n
    👾 Safe mode- press 'z' to have shild (5 sec)\n
    GO show them what you've got!`
    elDiv.innerText = instructions
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
    // The maximum is exclusive and the minimum is inclusive
}
