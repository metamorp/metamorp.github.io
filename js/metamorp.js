var version = document.getElementById("metamorpVersion");
if (version) {
    var v = "v0.0";
    version.innerHTML = v;
    console.log("loading up metamorp.js "+v);
}

function parse(text) {
    // return [0, list of tokens], or ["error"] if text is incomplete or bad
    return [0, text];
}

function execute(s) { 
    return [0, "no comment"];
};
