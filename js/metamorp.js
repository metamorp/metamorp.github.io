var version = document.getElementById("metamorpVersion");
if (version) {
    var v = "v0.0.1";
    version.innerHTML = v;
    console.log("loading up metamorp.js "+v);
}

function parse(text) {
    // first split text into tokens...
    var result = lex(text);
    if (result[0] !== 0) // had error lexing
        return result;

    console.log("got lexing: ", result[1]);

    // now need to parse it into a recursively-computable list

    // return result
    return [0, result[1]];
}

function execute(s) { 
    return [0, "no comment"];
}

var scopes = [{}];

const INDENT=-1, UNKNOWN=0, INT=1, REAL=2, OPERATOR=3, NAME=4;

function getNextAtom(text, i) {
    // return [i, [type, atom]] 
    // NOTE: you must ensure that text[i] !== ' '.
    var istart = i;
    var type = NAME;
    // TODO:  if it starts out as a number, keep expecting number chars.
    // if it starts out as a name, keep expecting name chars.
    // once it hits an operator or something, duck out!
    // (and vice versa.  if starting in an operator, and finding a number
    // or name, duck out.)
    while (i < text.length && !(text[i] === ' ' || text[i] === '\n' || text[i] === '\r')) {
        ++i;
    }
    return [i, [type, text.slice(istart, i)]];
}

function lexLine(text, i) {
    // return ["error"] for error
    // break on statement ends (newlines if nothing else expected)
    // return [0, i, [list, of, atoms]] for ok

    var indent=0;
    while (i < text.length && text[i] === ' ') {
        ++i; ++indent;
    }
    if (i >= text.length) { // empty line
        return [0, i, []];
    }
    if (text[i] === '\n' || text[i] === '\r') {
        ++i; 
        if (i >= text.length) { // ignore last empty line
            return [0, i, []];
        }
        if (text[i] === '\n') { // \r\n combination probably
            return [0, i+1, []];
        }
        return [0, i, []];
    }
    if (text[i] === '#') { // commented line, get to newline in i
        while (i < text.length && !(text[i] === '\n' || text[i] === '\r')) {
            ++i;
        }
        ++i; // go past the \n or \r
        if (i >= text.length) { // comment to end of input
            return [0, i, []];
        }
        if (text[i] === '\n') { // comment to \r\n probably
            return [0, i+1, []];
        }
        return [0, i, []];
    }
   
    var tokens = [[INDENT, indent]];
    while (i < text.length && !(text[i] === '\n' || text[i] === '\r')) {
        var result = getNextAtom(text, i);
        i = result[0];
        if (result[1][0] === UNKNOWN) {
            return ["unknown: "+result[1][1]];
        }
        tokens.push(result[1]);
        // eat up white space after the atom:
        // the next getNextAtom requires it.
        while (i < text.length && text[i] === ' ') {
            ++i;
        }
    }
    ++i; // go past the \n or \r
    if (i >= text.length) { 
        return [0, i, tokens];
    }
    if (text[i] === '\n') { 
        return [0, i+1, tokens];
    }
    return [0, i, tokens];
}

function lex(text) {
    var tokens = [], i=0;
    while (i < text.length) {
        var result = lexLine(text, i);
        if (result[0] !== 0) {
            return [result[0]+" on e-line "+tokens.length];
        }
        i = result[1];
        if (result[2].length) {
            tokens.push(result[2]);
        }
    } 
    return [0, tokens];
}
