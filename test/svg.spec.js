var test = require( 'tape' ),
    vsvg = require( '../src/svg' );

test( 'testing element creation', function( t ) {
    var svg = vsvg.svg();
    // test out some of the properties of new element
    t.equals( typeof svg.guid, 'string', 'property guid is a string' );
    t.equals( !!svg.parentNode, false, 'property parentNode is not set' );
    t.equals( Array.isArray( svg.children ), true, 'property children is an array' );
    t.equals( svg.children.length, 0, 'property children startes empty' );
    t.equals( typeof svg.insertBefore, 'function', 'property insertBefore is a function' );
    t.equals( typeof svg.appendChild, 'function', 'property appendChild is a function' );
    t.equals( typeof svg.removeChild, 'function', 'property removeChild is a function' );
    t.equals( typeof svg.toHTML, 'function', 'property toHTML is a function' );
    t.equals( typeof svg.getAttribute, 'function', 'property getAttribute is a function' );
    t.equals( typeof svg.setAttribute, 'function', 'property setAttribute is a function' );
    t.equals( typeof svg.attributes, 'object', 'property attributes is an object' );
    t.equals( typeof svg.outerHTML, 'string', 'property outerHTML is a string' );
    t.equals( typeof svg.innerHTML, 'string', 'property innerHTML is a string' );
    t.end();
} );

test( 'testing element::appendChild', function( t ) {
    var svg = vsvg.svg(),
        group = vsvg.g(),
        defs = vsvg.defs();

    svg.appendChild( defs );

    t.equals( svg.children.length, 1, 'svg has one child element' );

    svg.appendChild( group );

    t.equals( svg.children.length, 2, 'svg has two child elements' );
    t.equals( svg.children[0].guid, defs.guid, 'Ordering is correct' );

    svg.appendChild( defs );

    t.equals( svg.children.length, 2, 'element is not duplicated if appended again' );
    t.equals( svg.children[1].guid, defs.guid, 'Ordering is correct' );
    t.end();
} );

test( 'testing element::removeChild', function( t ) {
    var svg = vsvg.svg(),
        group = vsvg.g(),
        defs = vsvg.defs();

    svg.appendChild( defs );
    svg.appendChild( group );

    t.equals( svg.children.length, 2, 'svg has two child elements' );

    svg.removeChild( group );

    t.equals( svg.children.length, 1, 'svg has one child element' );
    t.equals( svg.children[0].guid, defs.guid, 'the correct child was removed' );

    t.end();
} );

test( 'testing element::insertBefore', function( t ) {
    var svg = vsvg.svg(),
        group = vsvg.g(),
        group2 = vsvg.g(),
        defs = vsvg.defs();

    svg.appendChild( defs );
    svg.appendChild( group );
    svg.insertBefore( group2, group );

    t.equals( svg.children.length, 3, 'svg has three child elements' );
    t.equals( svg.children[1].guid, group2.guid, 'the element was pushed into the right position' );

    svg.insertBefore( group, group2 );

    // this should probably throw instead 
    t.equals( svg.children.length, 3, 'not elements are added if items are already in children' );    

    t.end();
} );

test( 'testing element::toHTML', function( t ) {
    var svg = vsvg.svg({
            version: '1.1'
        }),
        defs = vsvg.defs(),
        html;

    svg.appendChild( defs );
    html = svg.toHTML();

    t.equals( typeof html, 'string', 'svg.toHTML method returns a string' );
    // TODO make some better RegExp to test for open and  closing tags
    t.equals( /\<svg/.test( html ), true, 'html has a svg element' );
    t.equals( /\<defs/.test( html ), true, 'html has a defs element' );
    t.equals( /version\=/.test( html ), true, 'html has a attributes in element' );

    t.end();
} );

test( 'testing element::toText', function( t ) {
    var svg = vsvg.svg({
            version: '1.1'
        }),
        text = vsvg.text(),
        text2 = vsvg.text(),
        ret;

    text.innerText = 'foo bar';
    svg.appendChild( text );
    ret = svg.toText();

    t.equals( typeof ret, 'string', 'svg.toText method returns a string' );
    t.equals( ret, 'foo bar', 'toText returns expected value' );

    text2.innerText = 'baz qux';
    svg.appendChild( text2 );
    ret = svg.toText();

    t.equals( ret, 'foo barbaz qux', 'toText returns expected value' );

    t.end();
} );