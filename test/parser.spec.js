var test = require( 'tape' ),
    parser = require( '../src/parser' );

test( 'testing parser::getAttributes', function( t ) {
    var attributes = parser.getAttributes(['foo="bar"']);
    // test out some of the properties of new element
    t.equals( attributes.foo, 'bar', 'object contains correct key and value' );
    t.end();
} );

test( 'testing parser::getTagIndex', function( t ) {
    var tags = [{
            tagName: 'line'
        },{
            tagName: 'polygon'
        }],
        index = parser.getTagIndex( 'line', tags );

    // test out some of the properties of new element
    t.equals( index, 0, 'the correct index is returned' );

    tags.push({
        tagName: 'line'
    });

    index = parser.getTagIndex( 'line', tags );
    t.equals( index, 2, 'the correct index is returned of the last tag' );

    index = parser.getTagIndex( 'svg', tags );
    t.equals( index, -1, 'negative -1 is given when tag is not in array' );

    t.end();
} );


test( 'testing parser::getLastOpenTag', function( t ) {
    var tags = [{
        },{
            closed: true
        }],
        index = parser.getLastOpenTag( tags );

    // test out some of the properties of new element
    t.equals( index, 0, 'the correct index is returned' );
    tags[ 0 ].closed = true;
    index = parser.getLastOpenTag( tags );
    t.equals( index, -1, 'negative -1 is given when closed tag is not in array' );

    t.end();
} );

test( 'testing parser::createTree', function( t ) {
    var tags = [{
            position: [0],
            children:[],
            foo: 'bar'
        },{
            position: [0,0],
            children:[],
            baz: 'qux'
        },{
            position: [1],
            bar: 'baz'
        }],
        tree = parser.createTree( tags );

    // test out some of the properties of new element
    t.equals( tree[ 0 ].foo, 'bar', 'the root tag is correct' );
    t.equals( tree[ 0 ].children[ 0 ].baz, 'qux', 'the nested tag is correct' );
    t.equals( tree[ 1 ].bar, 'baz', 'the sibling tag is correct' );

    t.end();
} );

test( 'testing parser::parse', function( t ) {
    var svg = '<svg><line foo="bar"></line><polygon /><g><line /></g></svg>',
        tree = parser.parse( svg );

    // test out some of the properties of new element
    t.equals( Array.isArray( tree ), true, 'an array is returned' )
    t.equals( tree[ 0 ].tagName, 'svg', 'the root tag is correct' );
    t.equals( tree[ 0 ].children[ 0 ].tagName, 'line', 'the nested tag is correct' );
    t.equals( tree[ 0 ].children[ 0 ].attributes.foo, 'bar', 'the nested tag attributes are correct' );
    t.equals( tree[ 0 ].children[ 1 ].tagName, 'polygon', 'the nested self closing tag is correct' );
    t.equals( tree[ 0 ].children[ 2 ].children[ 0 ].tagName, 'line', 'the nested, nest self closing tag is correct' );

    t.end();
} );