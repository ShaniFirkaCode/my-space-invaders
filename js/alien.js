'use strict'

const ALIEN_SPEED = 500
const ROCK_SPEED = 700
var gIntervalAliens
var gAliensTopRowIdx
var gAliensBottomRowIdx
var gIsAlienFreeze
var gRockPos
var gBlinkRockInterval

function createAliens(board) {
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = gAliensTopRowIdx + ALIENS_ROW_COUNT - 1
    for (var i = gAliensTopRowIdx; i < ALIENS_ROW_COUNT; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            board[i][j] = createCell(ALIEN)
            gGame.aliensCount++
        }
    }
}

function handleAlienHit(pos) {
    stopLaser()
    gGame.aliensCount--
    gGame.score += 10
    renderScore()
    if (gGame.aliensCount === 0) victory()
    else if (!isRowHasAlien(gBoard[pos.i])) updateAlienRowIdxs()
}

function shiftBoardRight(board, fromI, toI) {
    if (gIsAlienFreeze) return
    if (isAliensReachedRightWall(board)) {
        clearInterval(gIntervalAliens)
        shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    } else {
        for (var i = fromI; i <= toI; i++) {
            for (var j = board[0].length - 1; j >= 0; j--) {
                if (j === 0) updateCell({ i, j })
                else {
                    var lastCellObj = board[i][j - 1].gameObject
                    if (lastCellObj === LASER) handleAlienHit({ i, j })
                    if (lastCellObj === ALIEN) updateCell({ i, j }, ALIEN)
                    else if (lastCellObj === null) updateCell({ i, j })
                }
            }
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    if (gIsAlienFreeze) return
    if (isAliensReachedLeftWall(board)) {
        clearInterval(gIntervalAliens)
        shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    } else {
        for (var i = fromI; i <= toI; i++) {
            for (var j = 0; j < board[0].length; j++) {
                if (j === board[0].length - 1) updateCell({ i, j })
                else {
                    var nextCellObj = board[i][j + 1].gameObject
                    if (gLaserPos === { i, j }) handleAlienHit({ i, j })
                    if (nextCellObj === ALIEN) updateCell({ i, j }, ALIEN)
                    else if (nextCellObj === null) updateCell({ i, j })
                }

            }
        }
    }
}

function shiftBoardDown(board, fromI, toI) {
    if (gIsAlienFreeze) return
    clearInterval(gIntervalAliens)
    if (gAliensBottomRowIdx + 1 === gHero.pos.i) {
        loss()
        return
    }
    else {
        for (var i = toI + 1; i >= fromI; i--) {
            for (var j = 0; j < board[0].length; j++) {
                if (i === 0 || i === fromI) updateCell({ i, j })
                else {
                    var cellAboveObj = board[i - 1][j].gameObject
                    if (cellAboveObj === ALIEN) updateCell({ i, j }, ALIEN)
                    else if (cellAboveObj === null) updateCell({ i, j })
                }
            }
        }
        updateAlienRowIdxs()

        var func = (isAliensReachedRightWall(gBoard)) ? shiftBoardLeft : shiftBoardRight
        gIntervalAliens = setInterval(func, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    }
}

function moveAliens() {
    gIntervalAliens = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
}

function getRandomRockPos() {
    var alienCells = []
    for (var j = 0; j < gBoard[0].length; j++) {
        const cell = gBoard[gAliensBottomRowIdx][j]
        if (cell.gameObject === ALIEN) alienCells.push({ i: gAliensBottomRowIdx + 1, j })
    }
    var randIdx = getRandomInt(0, alienCells.length)
    return alienCells[randIdx]
}

function isAliensReachedRightWall(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i][board.length - 1].gameObject === ALIEN) return true
    }
    return false
}

function isAliensReachedLeftWall(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i][0].gameObject === ALIEN) return true
    }
    return false
}

function updateAlienRowIdxs() {
    for (var i = 0; i < gBoard.length; i++) {
        if (isRowHasAlien(gBoard[i])) {
            gAliensTopRowIdx = i
            break
        }
    }
    for (var i = gBoard.length - 1; i >= 0; i--) {
        if (isRowHasAlien(gBoard[i])) {
            gAliensBottomRowIdx = i
            break
        }
    }
}

function isRowHasAlien(row) {
    var rowObjects = []
    for (var j = 0; j < row.length; j++) {
        rowObjects.push(row[j].gameObject)
    }
    if (rowObjects.includes(ALIEN)) return true
    else return false
}

function throwRocks() {
    gRockPos = getRandomRockPos()
    gBlinkRockInterval = setInterval(blinkRock, ROCK_SPEED)
}

function blinkRock() {
    if (gRockPos.i > gHero.pos.i) {
        stopBlinkRock()
        return
    }
    if ({ i: (gRockPos.i + 1), j: gRockPos.j } === gHero.pos) {
        handleHeroHit()
        stopBlinkRock()
    } else if (gRockPos.gameObject === CANDY) {
        gIsAlienFreeze = true
        setTimeout(() => gIsAlienFreeze = false, 5000)
    }
    updateCell(gRockPos, ROCK)
    setTimeout(() => {
        updateCell(gRockPos)
        gRockPos.i++
    }, ROCK_SPEED)
}

function stopBlinkRock() {
    clearInterval(gBlinkRockInterval)
    gBlinkRockInterval = null
}

