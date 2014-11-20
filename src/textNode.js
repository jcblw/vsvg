
'use strict';

var utils = require( './utils' );

module.exports = TextNode;

function TextNode ( text, options ) {
    if ( !( this instanceof TextNode ) ) { // magical invocation
        return new TextNode( text, options );
    }
    options = options || {};
    this.text = options.unsafe ? text : utils.escapeHTML( text );
}

TextNode.prototype = {
    toHTML: function( ) {
        return this.text;
    },
    toText: function( ) {
        return this.text;
    }
};