var delayTime = 2000;
var words = [];
var score, aciertos, fallos, repeticiones, tiempo, playerName, word;

init();

function init() {
    words = ['agudo', 'contractura', 'progresivo', 'higiene', 'excremento', 'mozo'];
    document.querySelector('.playerName').style.display = 'grid';
    console.log('Ahorkado loaded!');
}

function showHangMan(chance) {
    document.querySelector('#img').src = 'resources/images/hm-' + chance + '.png';
}