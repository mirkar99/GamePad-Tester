const InfoPanel = document.querySelector(".InfoPanel");
const navButtons = document.querySelector('.nav__buttons');
const navButtonsChildrens = [...navButtons.children]
const main = document.querySelector('#main');
const GamePadButtonsInfo = [...document.querySelectorAll('.GamePadButtonsInfo')][0];
const GamePadStickInfo = [...document.querySelectorAll('.GamePadStickInfo')][0];
const form = document.querySelector('.form');

//gamepad representation in html
const gamepadHtml = [...[...document.getElementsByClassName('Gamepad')][0].children];
//vibration form
const checkVibrationBtn = document.getElementsByClassName("form_input--button")[0];
const magnitudeRage = document.getElementById("Magnitude-Rage");
//protocolMap
const xinputMap = {
    buttons: ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "Back", "Start", "Left Stick Click", "Right Stick Click", "D-pad Up",
        "D-pad Down", "D-pad Left", "D-pad Right"]
}
const LeftSticKPositon = {
    left: parseInt(getComputedStyle(gamepadHtml[10]).getPropertyValue('left')),
    top: parseInt(getComputedStyle(gamepadHtml[10]).getPropertyValue('top'))
}
const rightSticKPositon = {
    left: parseInt(getComputedStyle(gamepadHtml[11]).getPropertyValue('left')),
    top: parseInt(getComputedStyle(gamepadHtml[11]).getPropertyValue('top'))
}
let IntervalId;
let gp;
let usedPad = 0;

const changeElementDisplay = function (element, operation) {
    if (operation === 'show') {
        element.classList.remove('hidden');
    }
    if (operation === 'hide') {
        element.classList.add('hidden');
    }
}
const GamePadInfoValue = function (value) {
    if (value == true) {
        return 'True'
    }
    return 'False'
}
const changePad = function (id) {
    usedPad = id;
}

window.addEventListener("gamepadconnected", (e) => {
    changeElementDisplay(main, 'show');
    if (navigator.userAgent.indexOf("Firefox") === -1) {
        changeElementDisplay(form, 'show');
    }
    changeElementDisplay(GamePadButtonsInfo, 'show');
    changeElementDisplay(GamePadStickInfo, 'show');
    changeElementDisplay(navButtonsChildrens[e.gamepad.index], 'show')
    IntervalId = setInterval(() => {
        gp = navigator.getGamepads()[usedPad];
        InfoPanel.textContent = `Gamepad connected: ${gp.id}`;
        let GamePadAxes = navigator.getGamepads()[usedPad].axes;
        let GamePadBtn = navigator.getGamepads()[usedPad].buttons;


        gamepadHtml[10].style.left = LeftSticKPositon.left + 4 * GamePadAxes[0] + "px";
        gamepadHtml[10].style.top = LeftSticKPositon.top + 4 * GamePadAxes[1] + "px";
        gamepadHtml[11].style.left = rightSticKPositon.left + 4 * GamePadAxes[2] + "px";
        gamepadHtml[11].style.top = rightSticKPositon.top + 4 * GamePadAxes[3] + "px";

        GamePadStickInfo.children[0].children[1].innerText = GamePadAxes[0];
        GamePadStickInfo.children[0].children[3].innerText = GamePadAxes[1];
        GamePadStickInfo.children[1].children[1].innerText = GamePadAxes[2];
        GamePadStickInfo.children[1].children[3].innerText = GamePadAxes[3];

        GamePadBtn.forEach((el, index) => {
            if (GamePadButtonsInfo.children[index]?.children[1]) {
                GamePadButtonsInfo.children[index].children[0].innerText = xinputMap.buttons[index];
                GamePadButtonsInfo.children[index].children[1].innerText = GamePadInfoValue(el.pressed);
            }
            if (el.pressed === true) {
                gamepadHtml[index]?.classList.add('pressed');
            }
            if (el.pressed === false) {
                if (gamepadHtml[index]?.classList.contains('pressed')) {
                    gamepadHtml[index].classList.remove('pressed');
                }
            }
        })
    }, 1);
});

window.addEventListener("gamepaddisconnected", (e) => {
    if(e.gamepad.index>0){
    changePad(e.gamepad.index - 1);
    }
    console.log(navigator.getGamepads()[0]);
    changeElementDisplay(navButtonsChildrens[e.gamepad.index], 'hide');
    if (navigator.getGamepads()[0]?.connected  === false || navigator.getGamepads()[0] === null ) {
        InfoPanel.innerHTML = "<b>Please press random button on the controller</b>";
        changeElementDisplay(main, 'hide');
        changeElementDisplay(form, 'hide');
        changeElementDisplay(GamePadButtonsInfo, 'hide');
        changeElementDisplay(GamePadStickInfo, 'hide');
        clearInterval(IntervalId);
    }
});

const VibratonTest = function (duration, Magnitude) {
    gp.vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: duration,
        weakMagnitude: Magnitude / 100,
        strongMagnitude: Magnitude / 100,
    });
}
checkVibrationBtn.addEventListener("click", function () {
    VibratonTest(2000, magnitudeRage.value);
});
navButtonsChildrens.forEach((el, id) => {
    el.addEventListener("click", function () {
        changePad(id)
    })
})