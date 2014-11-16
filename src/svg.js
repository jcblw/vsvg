
var utils = require( './utils' ),
    tags = require( './tags' );

/*
    tag - creates an element
    params
        tagName { String } - name of tag to create
        _attribute { Object } - an object with attribute declarations
    returns
        _elem { _elem Object } - an object with a number of methods to
            manipulate element

    TODO make toHTML serve back self closing tags 
*/

// might be best to turn this into a instance
function tag( tagName, _attributes ) {
    var ns = tagName === 'svg' ? 'xmlns="http://www.w3.org/2000/svg" ' : ' ',
        children = [],
        attributes = Object.create( _attributes || {} ),
        styles = {};


    /*
        _elem is the element object
    */

    var _elem = {
        guid: utils.guid(),
        parentNode: null,
        children: children,
        insertBefore: function ( elem, refElem ) {
            var index = utils.getElementIndex( refElem, _elem.children );
            _elem.children.splice( index, 0, elem );
        },
        removeChild: function ( elem ) {
            var index = utils.getElementIndex( elem, children );
            if ( index === -1 ) {
                return;
            }
            children.splice( index, 1 );
        },
        appendChild: function ( elem ) {
            _elem.removeChild( elem ); // remove any old instances
            elem.parentNode = _elem;
            children.push( elem );
        },
        toHTML: function ( ) {
            return '<' + 
                tagName + 
                ' ' + 
                ns + 
                utils.objToAttributes( attributes || {} ) + 
                '>' + 
                children.map( utils.mapElementsToHTML ).join('') +
                '</' +
                tagName +
                '>';
        },
        getAttribute: function( key ) {
            return attributes[ key ];
        },
        setAttribute: function( key, value ) {
            attributes[ key ] = value;
        },
        get attributes ( ) {
            return attributes;
        },
        get outerHTML () {
            return _elem.toHTML();
        },
        get innerHTML () {
            return children.map( utils.mapElementsToHTML ).join('');
        },
        set innerText ( value ) {
            children.length = 0; // empty array
            children.push({
                // this need to be a better solution
                toHTML: function(){
                    return value;
                }
            })
        }
    };

    return _elem;
}

/*
    runs and returns an object with all the tagNames eg. vsvg.style()
*/

module.exports = ( function() {
    var methods = {};
    tags.forEach( function( tagName ) {
        methods[ tagName ] = tag.bind( null, tagName );
    } );
    return methods;
}( ) );