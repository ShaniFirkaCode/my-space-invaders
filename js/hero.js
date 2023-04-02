'use strict'

var LASER_SPEED = 80
var gHero = { pos: { i: 12, j: 5 }, isShoot: false, isBlowUp: false, isSuper: false, isSafe: false };
var gLaserPos = { i: null, j: null }
var gBlinkInterval

function createHero(board) {
    gHero = gHero = { pos: { i: 12, j: 5 }, isShoot: false, isBlowUp: false, isSuper: false, isSafe: false }
    gHero.isShoot = false
    gHero.isBlowUp = false
    gHero.isSuper = false
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

function onKeyDown(ev) {
    if (!gGame.isOn) return
    if (ev.code === 'Space') shoot()

    switch (ev.key) {
        case 'ArrowLeft':
            moveHero(-1)
            break
        case 'ArrowRight':
            moveHero(1)
            break
        case 'n':
            if (gHero.isShoot) {
                gHero.isBlowUp = true
                blowUpNegs()
            }
            break
        case 'x':
            superMode()
            break
        case 'z':
            if (!gHero.isSafe) {
                if (gGame.shields) safeMode()
            }
    }
}

function safeMode() {
    gHero.isSafe = true
    updateCell(gHero.pos, HERO)
    gGame.shields--
    renderShields()
    setTimeout(() => {
        gHero.isSafe = false
        updateCell(gHero.pos, HERO)
    }, 5000)
}

function moveHero(dir) {// Move the hero right (1) or left (-1)
    const i = gHero.pos.i
    const j = gHero.pos.j

    const newJ = gHero.pos.j + dir
    if (newJ === BOARD_SIZE || newJ < 0) return // not in range
    if (gBoard[i][newJ].gameObject === ROCK) return
    else if (gBoard[i][newJ].gameObject === CANDY) {
        gGame.score += 50
        renderScore()
        gIsAlienFreeze = true
        setTimeout(() => gIsAlienFreeze = false, 5000)
    }
    // remove from curr pos:
    updateCell(gHero.pos, null)

    // add hero to new pos:
    gHero.pos.j = newJ
    updateCell(gHero.pos, HERO)
}

function shoot() {
    if (gHero.isShoot) return
    gHero.isShoot = true
    gLaserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    gBlinkInterval = setInterval(blinkLaser, LASER_SPEED * 2)
}

function blinkLaser() {// renders a LASER at specific cell for short time and removes it
    if (!gHero.isShoot) return
    if (gLaserPos.i === 0) {
        stopLaser()
        return
    }
    if (gBoard[gLaserPos.i][gLaserPos.j].gameObject === ALIEN) {
        handleAlienHit(gLaserPos)
        updateCell(gLaserPos)
        return
    }
    //var time = (gHero.isSuper) ? LASER_SPEED : LASER_SPEED * 2
    updateCell(gLaserPos, LASER)
    setTimeout(function () {
        if (gBoard[gLaserPos.i][gLaserPos.j].gameObject === LASER) updateCell(gLaserPos)
        gLaserPos.i--
    }, LASER_SPEED * 2)
}

function stopLaser() {
    updateCell(gLaserPos)
    gHero.isShoot = false
    clearInterval(gBlinkInterval)
    gBlinkInterval = null
    if (gHero.isBlowUp) gHero.isBlowUp = false
    if (gHero.isSuper) gHero.isSuper = false
}

function blowUpNegs() {
    console.log('blowUpNegs() is on!')
    for (var i = gLaserPos.i - 1; i <= gLaserPos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = gLaserPos.j - 1; j <= gLaserPos.j + 1; j++) {
            if (i === gLaserPos.i && j === gLaserPos.j) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].gameObject === ALIEN) {
                if (gHero.isShoot) stopLaser()
                handleAlienHit({ i, j })
                updateCell({ i, j })
            }
        }
    }
}

function superMode() {
    console.log('superMode() is on!')
    if (gHero.isShoot && gGame.superAttack > 0) {
        gHero.isSuper = true
        gGame.superAttack--
        renderSuperCount()
    }
}

function handleHeroHit() {
    if (gHero.isSafe) return
    gGame.lives--
    renderLives()
    if (gGame.lives === 0) loss()
}



