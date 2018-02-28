'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')

    /* NPM */
    
    /* in-package */
    , CharSet = require('../CharSet')
    ;

describe('new CharSet (constructor mode)', () => {
    it('(char char)', () => {
        new CharSet('a', 'z');
    });

    it('(char, codePoint)', () => {
        new CharSet(0x61, 'f');
    });

    it('(string)', () => {
        new CharSet('aeiou');
    });

    it('(Array)', () => {
        new CharSet(['a', 'e', 'i', 'o', 'u']);
    });

    it('(Array)', () => {
        new CharSet(['0123456789', 'abcdef']);
    });
});
    
describe('new CharSet (factory mode)', () => {
    it('(char char)', () => {
        CharSet('a', 'z');
    });

    it('(codePoint, char)', () => {
        CharSet(0x61, 'f');
    });

    it('(string)', () => {
        CharSet('aeiou');
    });

    it('(char[])', () => {
        CharSet(['a', 'e', 'i', 'o', 'u']);
    });

    it('(string[])', () => {
        CharSet(['0123456789', 'abcdef']);
    });
});

describe.only('CharSet instance (collection mode)', () => {
    let cs = new CharSet('ab');

    it('.length & .getLength()', () => {
        assert.equal(2, cs.length); 
        assert.equal(2, cs.getLength());
    });
        
    it('.next(), .isEnd() and .reset()', () => {
        assert.equal(cs.isEnd() , false );
        assert.equal(cs.next()  , 'a'   );
        assert.equal(cs.isEnd() , false );
        assert.equal(cs.next()  , 'b'   );
        assert.equal(cs.isEnd() , true  );
        assert.equal(cs.next()  ,  null );
                     cs.reset()          ;
        assert.equal(cs.isEnd() , false );
        assert.equal(cs.next()  , 'a'   );
    });
});

describe.only('CharSet instance (interval mode)', () => {
    let cs = new CharSet('a', 'b');

    it('.length & .getLength()', () => {
        assert.equal(2, cs.length); 
        assert.equal(2, cs.getLength());
    });
        
    it('.next(), .isEnd() and .reset()', () => {
        assert.equal(cs.isEnd() , false );
        assert.equal(cs.next()  , 'a'   );
        assert.equal(cs.isEnd() , false );
        assert.equal(cs.next()  , 'b'   );
        assert.equal(cs.isEnd() , true  );
        assert.equal(cs.next()  ,  null );
                     cs.reset()          ;
        assert.equal(cs.isEnd() , false );
        assert.equal(cs.next()  , 'a'   );
    });
});

describe('CharSet instance (common)', () => { 
    let cs = new CharSet('a', 'b');

    it('.concat()', () => {
        let args = [ new CharSet('A'), 0x41, 'A' ];
        args.forEach(arg => {
            let cs2 = cs.concat(arg);
            assert(cs2 instanceof CharSet);
            assert.equal(cs2.length, 3);
            assert.equal(cs2.next(), 'a');
            assert.equal(cs2.next(), 'b');
            assert.equal(cs2.next(), 'A');
        });

        let cs2 = cs.concat.apply(cs, args);
        assert.equal(cs2.length, 5);
    });
});

describe.only('code point', () => {
    it('reserved code point', () => {
        // Valid code point.
        [ 0xD7FF, 0xE000 ].forEach(code => {
            new CharSet([ code ]);
        });

        // Reserved code point.
        [ 0xD800, 0xDFFF ].forEach(code => {
            assert.throws(() => new CharSet([ code ]));
        });

        // Outranges.
        [ -1, 0x110000 ].forEach(code => {
            assert.throws(() => new CharSet([ code ]));
        });
    });
});