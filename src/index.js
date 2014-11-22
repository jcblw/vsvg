
'use strict';

var tags = require( './tags' ),
    SvgNode = require( './svgNode' ),
    parser = require( './parser' ),
    methods = {};

/*
    runs and returns an object with all the tagNames eg. vsvg.style()
*/

module.exports = ( function() {
    tags.forEach( function( tagName ) {
        methods[ tagName ] = SvgNode.bind( null, tagName );
    } );
    return methods;
}( ) );

var _eachTag =
methods._eachTag = function _eachTag( tag ) {
 
    var elem;

    if ( tag.tagName ) {

        elem = methods[ tag.tagName ]( tag.attributes );
        if ( elem.children ) {    

            for( var i = 0; i < tag.children.length; i += 1 ) {

                var _elem = _eachTag( tag.children[ i ] );

                if ( typeof _elem === 'string' ) {

                    elem.innerText = _elem;
                } else {

                    elem.appendChild( _elem );
                }
            }
        }

        return elem;
    }

    return tag.text;
};

methods.parse = function( svg ) {
    return parser.parse( svg ).map( _eachTag );
};