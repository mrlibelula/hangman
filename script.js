var words = ['agudo', 'contractura', 'progresivo', 'higiene', 'excremento', 'mozo', 'dictador'];
/**********************************************************************************/
var delayTime = 2000;
var score, hits, totalHits, fails, time, chance, playerName, interval, lastInterval;
var word = {};

init();

// Start Game
document.querySelector('#btn-start').addEventListener('click', function() {
    resetStartBtn();
    startGame();
});

// Change name
document.getElementById('btn-name').addEventListener('click', function() {
    playerName = prompt('¿Cuál es tu nombre?');
    if(!playerName) playerName = 'Evaristo';
    changeName();
});

// Change uppercase
document.querySelector('.btn-cap').addEventListener('click', function() {
    document.querySelector('.drop-it').classList.toggle('upper');
});

// Mouse over uppercase button
document.querySelector('.btn-cap').addEventListener('mouseover', function() {
    document.querySelector('.btn-cap').style.cursor = 'pointer';
});

function chooseWord() {
    word.string = words[Math.floor(Math.random() * (words.length))];
    word.current_underscore = [];
    word.letterArr = explodeWord(word.string);
    word.hitIndex = [];
    word.selectedLetters = [];
    word.time_lapse = [];
}

function explodeWord(word) {
    var arr_word = [];
    for (var i = 0; i < word.length; i++) {
        arr_word.push(word.substring(i, i + 1));
    }
    return arr_word;
}

function logData() {
    console.log(word);
}

function setPlayGround() {
    // Prepare underscores of the word
    var str = '';

    word.letterArr.forEach(letter => {
        str += '_ ';
    });
    
    // UI show
    document.querySelector('.playGround').textContent = str;
    document.querySelector('.btn-cap').style.display = 'block';
    document.querySelector('#letter').style.display = 'block';
    document.querySelector('.btnSelect').style.display = 'block';
    document.querySelector('.msg').style.display = 'none';

    // HangMan init
    showHangMan(0);
}

function changeName() {
    document.querySelector('.playerName').textContent = playerName;
}

function init() {
    hideElements();
    resetAllVars();
    shineStartBtn();
    if(!playerName) {
        playerName = 'Evaristo';
    }
    console.log('AhorK\'ado rrreloaded! v.1 - libesoft.io');
}

function shineStartBtn() {
    window.onload = function() {
        // Combined with CSS transition
        document.querySelector('#ico-start').style.fontSize = '2.5rem';
        document.querySelector('#ico-start').style.color = 'deeppink';
        document.querySelector('#ico-start').style.marginLeft = '-2.5rem';
    };
}

function resetStartBtn() {
    // Combined with CSS transition
    document.querySelector('#ico-start').style.fontSize = '1rem';
    document.querySelector('#ico-start').style.color = 'black';
    document.querySelector('#ico-start').style.marginLeft = '0rem';
}

function resetAllVars() {
    hits = 0; fails = 0; time = 0; score = 0; chance = 0; totalHits = 0; 
    interval = 0; lastInterval = 0;
    word = {};
    printScore();
}

function printScore() {
    document.querySelector('#hits').textContent = totalHits;
    document.querySelector('#fails').textContent = fails;
    // document.querySelector('#time').textContent = time + ' seg.';
    document.querySelector('#score').innerHTML = score + '&nbsp;<i class="fas fa-star is-light"></i>';
}

function hideElements() {
    document.querySelector('.btn-cap').style.display = 'none';
    document.querySelector('#letter').style.display = 'none';
    document.querySelector('.btnSelect').style.display = 'none';
    document.querySelector('.msg').style.display = 'none';
}

function startGame() {
    resetAllVars();
    chooseWord();
    setPlayGround();
    timeInterval();
    // Optional console log of the 'word' object
    logData();
}

 // Select letter
 document.querySelector('#btn-this').addEventListener('click', function() {
    hits = 0;
    var str = '';
    var selectedLetter = document.getElementById('letter').value.toLowerCase();
    var isHit = isLetterPresent(selectedLetter);

    if(isHit) {
        // Dont hang
        // Calculate hits matrix 'word.current_underscore'
        if(!word.current_underscore.length) {
            // First time
            word.letterArr.forEach(function(letter, key) {
                if(selectedLetter === letter) {
                    word.current_underscore.push(true);
                } else {
                    word.current_underscore.push(false);
                }
            });
        } else {
            // The underscore already exists
            // Update with current hits
            word.letterArr.forEach(function(letter, key) {
                if(!word.current_underscore[key]) {
                    if(selectedLetter === letter) {
                        word.current_underscore[key] = true;
                    }
                }
            });
        }
        // Display updated underscore
        word.current_underscore.forEach(function(el, key) {
            str += el ? word.letterArr[key] + ' ' : '_ ';
        });
        document.querySelector('.playGround').textContent = str;
        // Increase points
        // Check if won the game
        if(word.hitIndex.length === word.letterArr.length) {
            // Won
            // alert('You win!!!');
            gameOver(true);
        }
        printScore();
    } else {
        // Hang a little bit
        chance++;
        fails++;
        score = score - 5;
        printScore();
        showHangMan(chance);

        if(chance >= 7) {
            // Game over
            gameOver(false);
        }
    }

    // Optional console log of the 'word' object
    logData();
    
});

function isLetterPresent(letter) {
    var hitted;
    // Will increment hits, define hitIndex (arr) property, and sum totalHits.
    // Returns 1, 0

    // Watch if the user already selected the letter
    if(word.selectedLetters.indexOf(letter) != -1) {
        // Letter repeated found
        score = score - 3;
    } else {
        // Calculate time lapse
        var timeLapse = 0;
        timeLapse = interval - lastInterval;
        lastInterval = interval;
        console.log('Time lapse: ', Math.ceil(timeLapse / 1000), ' seg.');
        // End calculate time lapse

        word.letterArr.forEach(function(letter_form_arr, key) {
            if(letter_form_arr === letter) {
                // Its a hit
                hits++;
                word.hitIndex.push(key);
                hitted = true;
                score += 15;
                word.time_lapse.push(timeLapse);
            }
        });
    }

    totalHits += hits;
    word.selectedLetters.push(letter);

    printScore();

    return hitted ? true : false;
}

function gameOver(won) {
    document.querySelector('.btn-cap').style.display = 'none';
    document.querySelector('#letter').style.display = 'none';
    document.querySelector('.btnSelect').style.display = 'none';
    document.querySelector('.msg').style.display = 'block';
    if(won) {
        document.querySelector('.msg').classList.add('msgOk');
        document.querySelector('.msg').classList.remove('msgError');
        document.querySelector('.msg').textContent = 'Te salvaste ' + playerName + '!!!!!';
    } else {
        document.querySelector('.msg').classList.add('msgError');
        document.querySelector('.msg').classList.remove('msgOk');
        document.querySelector('.msg').textContent = 'Ahorcado ' + playerName + '!!';        
    }
}

function showHangMan(chance) {
    document.querySelector('#img').src = 'resources/images/hm-' + chance + '.png';
}

function timeInterval() {
    var start = Date.now();
    
    setInterval(function() {
    //   document.getElementById('difference').innerHTML = Date.now() - start;
        interval = Date.now() - start;
      // the difference will be in ms
    }, 1000);
    // return interval;
}

// Timer

function markPresent() {
    window.markDate = new Date();
    updateClock();
}

function updateClock() {  
    var currDate = new Date();
    var diff = currDate - markDate;
    document.getElementById("time").innerHTML = format(diff/1000);
    setTimeout(function() {updateClock()}, 1000);
}

function format(seconds)
{
var numhours = parseInt(Math.floor(((seconds % 31536000) % 86400) / 3600),10);
var numminutes = parseInt(Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),10);
var numseconds = parseInt((((seconds % 31536000) % 86400) % 3600) % 60,10);
    return ((numhours<10) ? "0" + numhours : numhours)
    + ":" + ((numminutes<10) ? "0" + numminutes : numminutes)
    + ":" + ((numseconds<10) ? "0" + numseconds : numseconds);
}

markPresent();