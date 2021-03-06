var test = require( 'tape' ),
    vsvg = require( '../src/' ),
    SvgNode = require( '../src/svgNode' );

test( 'testing element creation', function( t ) {
    var path = vsvg.path(),
        g = vsvg.path(),
        svg = vsvg.svg( { 
            xmlns: 'http://www.w3.org/2000/svg' 
        }, g, path );
    // test out some of the properties of new element
    t.equals( typeof svg.guid, 'string', 'property guid is a string' );
    t.equals( !!svg.parentNode, false, 'property parentNode is not set' );
    t.equals( Array.isArray( svg.children ), true, 'property children is an array' );
    t.equals( svg.children.length, 2, 'property children startes empty' );
    t.equals( svg.children[ 0 ].guid, g.guid, 'the element is passed in the second argument is the appended to the children in the correct position' );
    t.equals( svg.children[ 1 ].guid, path.guid, 'the element is passed in the third argument is the appended to the children in the correct position' );
    t.equals( typeof svg.insertBefore, 'function', 'property insertBefore is a function' );
    t.equals( typeof svg.appendChild, 'function', 'property appendChild is a function' );
    t.equals( typeof svg.removeChild, 'function', 'property removeChild is a function' );
    t.equals( typeof svg.toHTML, 'function', 'property toHTML is a function' );
    t.equals( typeof svg.getAttribute, 'function', 'property getAttribute is a function' );
    t.equals( typeof svg.setAttribute, 'function', 'property setAttribute is a function' );
    t.equals( typeof svg.attributes, 'object', 'property attributes is an object' );
    t.equals( svg.attributes.xmlns, 'http://www.w3.org/2000/svg', 'attributes that are passed in the first argument is applied to the attributes object' ); 
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

test( 'testing element::replaceChild', function( t ) {
    var svg = vsvg.svg(),
        group = vsvg.g(),
        group2 = vsvg.g(),
        defs = vsvg.defs();

    svg.appendChild( defs );
    svg.appendChild( group );

    svg.replaceChild( group, group2 );

    t.equals( svg.children.length, 2, 'svg has two child elements' );
    t.equals( svg.children[1].guid, group2.guid, 'the correct child was replaced' );

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

test( 'testing element::firstChild', function( t ) {
    var svg = vsvg.svg(),
        group = vsvg.g(),
        defs = vsvg.defs(),
        first;

    svg.appendChild( defs );
    svg.appendChild( group );

    first = svg.firstChild;

    t.equals( first.guid, defs.guid, 'the first element is returned' );

    t.end();
} );

test( 'testing element::children', function( t ) {
    var svg = vsvg.svg(),
        group = vsvg.g(),
        defs = vsvg.defs(),
        text = {
            text: 'hello'
        };

    svg.appendChild( defs );
    svg.appendChild( group );

    t.equals( svg.children.length, 2, 'the correct amount of element are returned' );

    svg.appendChild( text );

    t.equals( svg.children.length, 2, 'the correct amount of element are returned even when text nodes are present' );

    t.end();
} );

test( 'testing element::_removeTextNodes', function( t ) {
    var arr = [
            vsvg.svg(), 
            vsvg.g(),
            {
                text: 'hello'
            }
        ],
        arr2 = arr.filter( vsvg.svg()._removeTextNodes );

    t.equals( arr.length, 3, 'the correct amount of elements are in the array' );
    t.equals( arr2.length, 2, 'the correct amount of elements are in the array after the filter' );
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

test( 'testing element::innerHTML setter', function( t ) {
    var svg = vsvg.svg({
            version: '1.1'
        });

    svg.innerHTML = '<g foo="bar"><line></line><line></line></g>';

    t.equals( svg.children.length, 1, 'svg gets one child from innerHTML' );
    t.equals( svg.children[ 0 ].tagName, 'g', 'svg\'s first child should be a group tag' );
    t.equals( svg.children[ 0 ].children.length, 2, 'group should have two children' );
    t.equals( svg.children[ 0 ].children[ 1 ].tagName, 'line', 'group should be lines' );

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

test( 'testing vsvg::_eachTag', function( t ) {
    var tags = [{
            tagName: 'svg',
            attributes: {
                version: '1.2'
            },
            children : [{
                tagName: 'line',
                attributes: {},
                children: []
            }]
        }],
        elem = vsvg._eachTag( tags[ 0 ] );


    t.equals( typeof elem, 'object', 'return from _eachTag is an object' );
    t.equals( elem.tagName, 'svg', 'return from _eachTag has the correct tag name' );
    t.equals( typeof elem.guid, 'string', 'return from _eachTag has a guid' );
    t.equals( elem.children.length, 1, 'return from _eachTag has the correct amount of children' );
    t.end();

} );

test( 'testings SvgNode.isNode', function( t ) {
    var svg = vsvg.svg();
    t.equals( SvgNode.isNode( svg ), true, 'SvgNode.isNode will return true id a SvgNode is given in the first parameter' );
    t.equals( SvgNode.isNode( {} ), false,  'SvgNode.isNode will return true id a SvgNode is given in the first parameter' );
    t.end();
} );
