'use strict'
const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'
const SUPER_LASER = '🔥' // '⬆'
const CANDY = '🍬'
const ROCK = '🪨'
const SKY = 'sky'
const EARTH = 'earth'
const ROCK_IMG = '<img src="img/stone.png">'
const LASER_IMG = '<img src="img/arrow.png">'
const SUPER_LASER_IMG = '<img src="img/bullet.png">'
const HERO_IMG = '<img src="img/hero.png">'
const ALIEN_IMG = '<img src="img/alien.png">'

var gBoard;
var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0,
    superAttack: 3,
    lives: 3,
    shields: 3
}
var gCandyInterval
var gThrowRocksInterval

function init() {
    renderInstructions()
    gBoard = createBoard()
    renderBoard(gBoard)
    gGame.isOn = false
    gIsAlienFreeze = true
}

function startGame(elBtn, ev) {
    if (ev.pointerType !== "mouse") return
    if (elBtn.innerHTML === 'Start') {
        elBtn.innerHTML = 'Restart'
        closeModal()
        gIsAlienFreeze = false
        gGame.isOn = true
        moveAliens()
        gThrowRocksInterval = setInterval(throwRocks, 10000)
        gCandyInterval = setInterval(addCandy, 10000)
    } else if ((elBtn.innerHTML === 'Restart')) restartGame(elBtn)
}

function restartGame(elBtn) {
    stopGame()
    gGame.aliensCount = 0
    gGame.score = 0
    gGame.superAttack = 3
    gGame.lives = 3
    gGame.shields = 3
    renderScore()
    renderSuperCount()
    renderLives()
    renderShields()
    closeModal()
    elBtn.innerHTML = 'Start'
    init()
}

function createBoard() {
    var board = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        board[i] = []
        for (var j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = createCell()
            if (i === BOARD_SIZE - 1) board[i][j].type = EARTH
        }
    }
    createHero(board)
    createAliens(board)
    //console.log('aliensCount=', gGame.aliensCount)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const cellData = `data-i='${i}' data-j='${j}'`
            const cellClass = board[i][j].type
            var cellObject = board[i][j].gameObject || ''
            if (cellObject === ALIEN) cellObject = ALIEN_IMG
            else if (cellObject === HERO) cellObject = HERO_IMG

            strHTML += `<td class="${cellClass}" ${cellData}>${cellObject} </td>`
        }
        strHTML += '\n</tr>\n'
    }
    const elBoard = document.querySelector('table')
    elBoard.innerHTML = strHTML
}

function addCandy() {
    const pos = getEmptyCellHeroRow()
    updateCell(pos, CANDY)
    setTimeout(updateCell, 5000, pos)
}

function victory() {
    stopGame()
    openModal('VICTORY 🥇')
}

function loss() {
    stopGame()
    openModal('GAME OVER 💀')
}

function stopGame() {
    var elBtn = document.querySelector('.btn')
    elBtn.innerHTML = 'Restart'
    gGame.isOn = false
    gIsAlienFreeze = true
    if (gHero.isShoot) stopLaser()
    stopBlinkRock()
    clearInterval(gIntervalAliens)
    clearInterval(gCandyInterval)
    clearInterval(gThrowRocksInterval)
    gIntervalAliens = null
    gCandyInterval = null
    gThrowRocksInterval = null
}

function renderSuperCount() {
    const elSuperMode = document.querySelector('.super-mode')
    const elSpan = elSuperMode.querySelector('span')
    var txt = ''
    for (var i = 0; i < gGame.superAttack; i++) {
        txt += '⬆️'
    }
    elSpan.innerHTML = txt
}

function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    var value = ''
    if (gameObject === LASER) value = (gHero.isSuper) ? SUPER_LASER : LASER// SUPER_LASER_IMG : LASER_IMG
    else if (gameObject === ROCK) value = ROCK//ROCK_IMG
    else if (gameObject === ALIEN) value = ALIEN_IMG
    else if (gameObject === HERO) value = (gHero.isSafe) ? '🛡️' : HERO_IMG

    elCell.innerHTML = value
}
