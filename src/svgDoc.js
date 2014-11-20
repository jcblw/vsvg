
'use strict';

var utils = require( './utils' ),
    tags = require( './tags' ),
    SvgNode = require( './svgNode' );

module.exports = SvgDocument;

function SvgDocument( attributes ) {

    if ( !( this instanceof SvgDocument ) ) { // magical invocation
        return new SvgDocument( attributes );
    }

    attributes = attributes || {};

    attributes.xmlns = attributes.xmlns || 'http://www.w3.org/2000/svg';
    attributes.version = attributes.version || '1.1';

    this._addMethods();

    SvgNode.call( this, 'svg', attributes );
    this._nodes = []; // collection of nodes in document
    return this;
}


SvgDocument.prototype = Object.create( SvgNode.prototype );

SvgDocument.prototype.appendChild = function( elem ) {
    this._addNode( elem );
    SvgNode.prototype.appendChild.call( this, elem );
};

SvgDocument.prototype.removeChild = function( elem ) {
    var index = utils.getElementIndex( elem, this._nodes );
    if ( index > -1 ) {
        this._nodes.splice( index, 1 ); // remove from nodes
    }

    SvgNode.prototype.removeChild.call( this, elem );
};

SvgDocument.prototype.hasNode = function( elem ) {
    return utils.getElementIndex( elem, this._nodes ) > -1;
};

SvgDocument.prototype._addNode = function( node ) {
    if ( !this.hasNode( node ) ) {
        this._nodes.push( node ); // this should be recursive to check children
    }
    if ( node.children && node.children.length ) {
        node.children.forEach( this._addNode.bind( this ) );
    }
};

SvgDocument.prototype._createNode = function( tagName, attributes ) {
    var node = new SvgNode( tagName, attributes );
    this._nodes.push( node );
    return node;
};

SvgDocument.prototype._addMethods = function( ) {
    var _this = this;
    tags.forEach( function( tagName ) {
        _this[ tagName ] = _this._createNode.bind( _this, tagName );
    } );
};