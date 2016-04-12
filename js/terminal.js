var body = document.getElementById("body");
var topDiv = document.getElementById("topDiv");
var aShift = document.getElementById("aShift");
var codeDiv = document.getElementById("codeDiv");
var errorMsg = document.getElementById("errorMsg");
var shuffleDiv = document.getElementById("shuffleDiv");

var expires = new Date();
expires.setTime(expires.getTime() + 365*(24*60*60*1000));
expires = "; expires="+expires.toUTCString();

var fontSize;
var shiftExecutes;
if (document.cookie) {
    var cookie = {};
    var split = document.cookie.split(";");
    for (var i=0; i<split.length; ++i) {
        var namevalue = split[i].split("=");
        cookie[namevalue[0].trim()] = namevalue[1].trim();
    }
    if (cookie.shiftExecutes) {
        changeShiftExecutes(parseInt(cookie.shiftExecutes));
    } else {
        changeShiftExecutes(0);
    }
    if (cookie.fontSize) {
        changeFontsize(parseInt(cookie.fontSize));
    } else {
        changeFontsize(12);
    }
} else {
    changeShiftExecutes(0);
    changeFontsize(12);
}
var changeFontsizeTimeout;
function changeFontsize(x) {
    if (x < 5) {
        if (fontSize === 5)
            return;
        fontSize = 5;
    } else
        fontSize = x;
    shuffleDiv.style.width = shuffleDiv.style.height = (50*fontSize)/3 + "px";
    body.style.fontSize = fontSize+"px";
    topDiv.style.lineHeight = 10+1.2*fontSize+"px";
    body.style.paddingTop = topDiv.offsetHeight;
    // write a cookie after 5 seconds
    clearTimeout(changeFontsizeTimeout);
    changeFontsizeTimeout = setTimeout(writeFontsizeCookie, 5000);
};
function writeFontsizeCookie() {
    document.cookie = "fontSize="+fontSize+expires;
}
var changeShiftExecutesTimeout;
function changeShiftExecutes(x, nowrite) {
    if (x === 1) {
        aShift.innerHTML = "Shift+Enter";
        shiftExecutes = 1;
    } else { //if (x === 0) { // make default!
        aShift.innerHTML = "Enter";
        shiftExecutes = 0;
    }
    body.style.paddingTop = topDiv.offsetHeight;
    // write a cookie after 5 seconds
    clearTimeout(changeShiftExecutesTimeout);
    changeShiftExecutesTimeout = setTimeout(writeShiftExecutesCookie, 5000);
}
function writeShiftExecutesCookie() {
    document.cookie = "shiftExecutes="+shiftExecutes+expires;
}

addEmptyCodeLine();
function addEmptyCodeLine(focus) {
    var newcode = document.createElement("pre");
    newcode.className = "code";
    newcode.contentEditable = "true";
    codeDiv.appendChild(newcode);
    if (focus === undefined)
        newcode.focus();
};

function executeOrLineBreak(codeblock) {
    var result = parse(codeblock.innerHTML); // first lex it into tokens, with error in front
    if (result[0]) {
        errorMsg.innerHTML = "parse: "+result[0];
        return;
    }
    result = execute(result);
    if (result[0]) {
        errorMsg.innerHTML = "execute: "+result[0];
        return;
    }
    codeblock.contentEditable = "false"; 
    codeblock.blur();
    addResponseLine(result[1], "return");
    addEmptyCodeLine();
}

function addResponseLine(s, s_class) {
    var newline = document.createElement("pre");
    newline.className = s_class;
    newline.innerHTML = s;
    codeDiv.appendChild(newline);
};

function terminal_onkeydown(evt) {
    if (evt.keyCode == 13 && document.activeElement.getAttribute("class") === "code") {
        // if we press enter on a code snippet...
        if (evt.shiftKey == shiftExecutes) {
            evt.preventDefault();
            executeOrLineBreak(document.activeElement);
            return false;
        }
        // if desired, add tabs here.  but it will require getting to the end of the range for the caret
        //evt.preventDefault(); 
        //document.activeElement.innerHTML += "\nasdf";
    }
}
