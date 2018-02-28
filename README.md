#	chc
__Character Class__

##	Table of contents

*	[Get Started](#get-started)
*	[API](#api)
*	[About](#about)

##	Links

*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/ecmascript.chc)

##	Get Started

```javascript
const chc = require('chc');

// Create an instance of CharSet.
const cs = new chc.CharSet('a', 'z');

// Get number of characters in the CharSet.
cs.length == 26;

// Get the next character in the CharSet.
cs.next();
// RETURN 'a'

// If all characters iterated.
cs.isEnd();
// RETURN false

// Reset the iteration state.
cs.reset();
cs.next();
// RETURN 'a'
```

##	API

###	Create *CharSet* Instances 

*	class | CharSet __chc.CharSet__( CHAR *start*, CHAR *end* ) throws Error<hr/>
	Create a charset containing characters from *start* to *end*. Here `CHAR` maybe a code point number or a string containing one but only one character. When invalid arguments passed in, an error will be thrown.  
	To create an CharSet instance, this function supports both contrutor mode and factory mode.  
	Hereafter use __\<charset\>__ to represent an instance of CharSet.  

*	class | CharSet __chc.CharSet__(String *chars*)<hr/>
	Create a charset containing every character in *char*.

*	CharSet __CharSet.concat__( CHAR | string | CharSet | Array *chars*, ... )<hr/>
	Create a new charset.

*	CharSet __\<charset\>.concat__( CHAR | string | CharSet | Array *chars*, ... )<hr/>
	Concatenate current charset with the character(s) or charsets, and return a new charset.

*	boolean __\<charset\>.isEnd__()<hr/>
	If all characters in the charset have been iterated.

*	number __\<charset\>.length__()<hr/>
	Number of characters in the charset.

*	boolean __\<charset\>.next__()<hr/>
	Get the next character in the charset.

*	boolean __\<charset\>.reset__()<hr/>
	Reset the iteration state of the charset.

*	Array __\<charset\>.toArray__("string" | "number" *type* = `"string"`)<hr/>
	Return characters in the charset. If *type* equals "number", an array of code points will be returned.

##  About

Following packages depend on __chc__ and offer predefined charsets:
*	[chc-posix](https://www.npmjs.com/package/chc-posix)
