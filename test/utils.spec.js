var test = require( 'tape' ),
    utils = require( '../src/utils' );

test( 'testing guid', function( t ) {
    var guid = utils.guid(),
        guid2 = utils.guid();

    t.equals( typeof guid, 'string', 'Guid is a string' );
    t.notEquals( guid, guid2, 'Two generate guid are not the same' );
    t.end();
} );

test( 'testing objToStyles', function( t ) {
    var styles = utils.objToStyles({
        color: 'white'
    });

    t.equals( typeof styles, 'string', 'compilied styles are a string' );
    t.equals( /^color\:(\s)?white;$/.test( styles ), true, 'style declaration is in string' );
    t.end();
} );

test( 'testing styleToObject', function( t ) {
    var styles = utils.styleToObject( 'color:white;foo:bar;');

    t.equals( typeof styles, 'object', 'deccompilied styles are an object' );
    t.equals( styles.color, 'white', 'style declaration is correct' );
    t.equals( styles.foo, 'bar', 'style declaration is correct' );
    t.end();
} );

test( 'testing objToAttributes', function( t ){
    var attributes = utils.objToAttributes({
        width: '100%'
    });
    var attributesWithStyles = utils.objToAttributes({
        style: {
            color: "white"
        }
    });
    
    t.equals( typeof attributes, 'string', 'compilied attributes are a string' );
    t.equals( /width\="100%"/.test( attributes ), true, 'attributes declaration is in string' );
    t.equals( typeof attributesWithStyles, 'string', 'compilied attributes are a string' );
    t.equals( /style\="(.*)"/.test( attributesWithStyles ), true, 'attributes declaration is in string' );
    t.equals( /color\:(\s)?white;/.test( attributesWithStyles ), true, 'style declaration is in attribute string' );
    t.end();
} );

test( 'testing mapElementsToHTML', function( t ){
    var collection = [
            {toHTML: function(){ return 'foo'; }},
            {toHTML: function(){ return 'bar'; }}
        ],
        values = collection.map( utils.mapElementsToHTML );

    t.equals( Array.isArray( values ), true, 'Values are an array' );
    t.equals( values[0], 'foo', 'First item in array is correct' );
    t.equals( values[1], 'bar', 'Second item in array is correct' );
    t.end( );
});

test( 'testing getElementIndex', function( t ){
    var elem = {guid: utils.guid() },
        elem2 = {guid: utils.guid() },
        collection = [
            {guid: utils.guid() }
        ],
        index,
        index2;

    collection.push( elem );
    index = utils.getElementIndex( elem, collection );
    index2 = utils.getElementIndex( elem2, collection );

    t.equals( typeof index, 'number', 'Index is a number' );
    t.equals( index, 1, 'Element is the second item in array' );
    t.equals( index2, -1, 'Element is not in array and returns -1' );
    
    t.end( );
});