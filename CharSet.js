/**
 * Here, 'code point' means the unicode encoding of some unicode character. 
 * E.g. U+1D306 represents unicode character '𝌆'.
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */

	/* in-file */

	, between = (a, b, n) => (a <= n) === (n <= b)

	, defineGetSet = function(o, propertyName, get, set) {
		let options = {};
		if (get) options.get = get;
		if (set) options.set = set;
		Object.defineProperty(o, propertyName, options);
	}

	// Split the string into unicode characters.
	, splitIntoChars = s => {
		let chars = [];
		for (const char of s) {
			chars.push(char);
		}
		return chars;
	}

	// If char is a valid character code point.
	, isCodePoint = uni => {
		// code point should be an integer number.
		if (typeof uni != 'number' || uni % 1 != 0) return false;

		// code point should belong to special interval.
		if (uni < 0 || uni > 0x10FFFF) return false;
			
		// not preserved code.
		if (0xD800 <= uni && uni <= 0xDFFF) return false;

		// Then, it is a valid code point.
		return true;

		// try { String.fromCodePoint(char); return true; } 
		// catch(ex) { return false; }
	}

	// If char is a valid string containing only one character.
	, isChar = char => {
		if (typeof char != 'string' || char.length == 0 || char.length > 2) return false;

		let codePoint = char.codePointAt(0);

		// 若属于基本多语言平面（BMP），则长度应为 1。
		// 若属于辅助多语言平面，则长度应为 2.
		return char.length == (codePoint < 0x10000) ? 1 : 2;
	}

	// Here CHAR means a valid character code point or a string with length 1.
	, isCHAR = char => isCodePoint(char) || isChar(char)

	// Assume that char is a valid CHAR.
	, toChar = char => typeof char == 'number' ? String.fromCodePoint(char) : char
	, toCodePoint = char => typeof char == 'number' ? char : char.codePointAt(0)

	// Transform an array mixed with char and code point, to an array made up of only chars.
	, toChars = arr => {
		let chars = [];
		arr.forEach(item => {
			if (isCHAR(item)) {
				chars.push(toChar(item));
			}
			else if (typeof item == 'string') {
				chars = splitIntoChars(item);
			}
			else {
				throw new Error(`character(s) or valid code point expected but: ${item}`);
			}
		});
		return chars;
	}

	, TYPE = { 
		codePoint: 1, 
		char: 2,
		normalize: type => {
			switch(type.toLowerCase()) {
				case 'num' :
				case 'number' :
				case 'codepoint' :
					return TYPE.codePoint;
	
				case 'char' :
				case 'character' :
				case 'str' :
				case 'string' :
					return TYPE.char;
			}
		},
	}
	;


/**
 * Examples:
 *   new CharSet(char, char)
 *   new CharSet(string)
 *   new CharSet((char|string)[])
 * Here `char` SHOULD be a string with length 1 or a valid character code point.
 */
function CharSet(a, b) {
	if (!(this instanceof CharSet)) {
		switch(arguments.length) {
			case 1: return new CharSet(a);
			case 2: return new CharSet(a, b);
			default:
				throw new Error(`unexpect CharSet constructor arguments: ${arguments}`);
		}
	}

	this.cursor = -1;
	defineGetSet(this, 'length', this.getLength, null);

	if (arguments.length == 2 && isCHAR(a) && isCHAR(b)) {
		let start = toCodePoint(a);
		let end   = toCodePoint(b);
		let direction = start <= end ? 1 : -1;
		Object.assign(this, { start, end, direction });
		return;
	}

	if (arguments.length == 1 && typeof a == 'string') {
		let chars = splitIntoChars(a);
		Object.assign(this, { chars });
		return;
	}

	if (arguments.length == 1 && a instanceof Array) {
		let chars = toChars(a);
		Object.assign(this, { chars });
		return;
	}

	throw new Error(`unexpect CharSet constructor arguments: ${arguments}`);
}

/**
 * How many characters this CharSet contains.
 * @return {number}
 */
CharSet.prototype.getLength = function() {
	/* collection mode */ 
	if (this.chars) {
		return this.chars.length;
	}
	/* interval mode */
	else {
		let offset = 1;
		if (between(this.start, this.end, 0xD800)) {
			offset = 0xD800 - 0xDFFF;	
		}
		return Math.abs(this.start - this.end) + offset;
	}
};

/**
 * If character belongs to the CharSet.
 * @param {number|string(1)} char 
 * @return {boolean}
 */
CharSet.prototype.contains = function(char) {
	if (!isCHAR(char)) {
		return false;
	}
	
	return this.chars 
		? /* Collection mode. */ this.chars.includes(toChar(char))
		: /* Interval mode. */ between(this.start, this.end, toCodePoint(char))
		;
};

/**
 * Return the next character.
 * @return {string}
 */
CharSet.prototype.next = function() {
	if (this.isEnd()) {
		return null;
	}

	/* collection mode */ 
	if (this.chars) {
		return this.chars[++this.cursor];
	}
	/* interval mode */
	else {
		let code = this.start + this.direction * ++this.cursor;

		// Jump over the empty codes.
		if (code == 0xD800) code = 0xE000;
		if (code == 0xDFFF) code = 0xD7FF;

		return String.fromCodePoint(code);
	}
};

/**
 * Reset the cursor.
 */
CharSet.prototype.reset = function() {
	this.cursor = -1;	
	return this;
};

/**
 * If the CharSet has been read from start to end.
 * @return {boolean}
 */
CharSet.prototype.isEnd = function() {
	return this.cursor == this.length - 1;
};

/** 
 * Return an array in which the characters are stored one by one.
 * @param {string} [type=string]
 * @return {string[]|number[]}
 */
CharSet.prototype.toArray = function(type = 'string') {
	type = TYPE.normalize(type);
	if (!type) throw new Error(`invalid type name: ${type}`);
	
	/* Collection mode. */ 
	if (this.chars) {
		let chars = this.chars.slice('');
		if (type == TYPE.codePoint) {
			chars = chars.map(char => char.codePointAt(0));
		}
		return chars;
	}
	
	/* Interval mode. */
	else {
		let chars = new Array(this.end - this.start)
		for (let i = this.start; i <= this.end; i++) {
			chars.push(type == TYPE.codePoint ? i : String.fromCodePoint(i));
		}
		return chars;
	}
};

CharSet.prototype.toString = function() {
	return this.chars 
		? /* Collection mode. */ this
		: /* Interval mode. */ t	
};

/**
 * To be concatenated with other charset or char, and return a new CharSet.
 * @return {CharSet}
 */
CharSet.prototype.concat = function(/* ... */) {
	let args = [ this ].concat(Array.from(arguments));
	return CharSet.concat.apply(null, args);
};

/**
 * Concatenate two or more charsets, chars.
 * @return {CharSet}
 */
CharSet.concat = function() {
	let targetChars = [];
	for (let i = 0, arg, chars; i < arguments.length; i++) {
		arg = arguments[i];
		if (arg instanceof CharSet) {
			chars = arg.toArray('string');
		}
		else if (isCHAR(arg)) {
			chars = arg;
		}
		else if (typeof arg == 'string') {
			chars = splitIntoChars(arg);
		}
		else if (arg instanceof Array) {
			chars = toChars(arg);
		}
		else {
			throw new Error(`failed to concat CharSet: ${arg}`);
		}
		targetChars = targetChars.concat(chars);
	}
	return new CharSet(targetChars);
};

module.exports = CharSet;