
var utils = require( './utils' ),
    tags = require( './tags' ),
    SvgNode = require( './svgNode' ),
    SvgDocument = require( './svgDoc' );

/*
    runs and returns an object with all the tagNames eg. vsvg.style()
*/

module.exports = ( function() {
    var methods = {};
    tags.forEach( function( tagName ) {
        methods[ tagName ] = SvgNode.bind( null, tagName );
    } );
    methods.svg = SvgDocument;
    return methods;
}( ) );