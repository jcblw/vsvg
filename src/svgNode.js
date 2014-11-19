
'use strict';

var utils = require( './utils' ),
    TextNode = require( './textNode' );

module.exports = SvgNode;

/*
    SvgNode - creates an svg node
    params
        tagName { String } - name of tag to create
        _attribute { Object } - an object with attribute declarations
    returns
        this { SvgNode Object } - an object with a number of methods to
            manipulate element

    TODO make toHTML serve back self closing tags 
*/

function SvgNode( tagName, attributes ) {

    if ( !( this instanceof SvgNode ) ) { // magical invocation
        return new SvgNode( tagName, attributes );
    }

    this.guid = utils.guid();
    this.tagName = tagName;
    this.children = [];
    this._attributes = Object.create( attributes || {} );
    this.styles = {};
}

SvgNode.prototype = {
    insertBefore: function ( elem, refElem ) {
        var index = utils.getElementIndex( refElem, this.children );
        this.removeChild( elem ); // this needs to be revised to be more like normal html spec
        this.children.splice( index, 0, elem );
    },
    removeChild: function ( elem ) {
        var index = utils.getElementIndex( elem, this.children );
        if ( index === -1 ) {
            return;
        }
        this.children.splice( index, 1 );
    },
    appendChild: function ( elem ) {
        this.removeChild( elem ); // remove any old instances
        elem.parentNode = this;
        this.children.push( elem );
    },
    toHTML: function ( ) {
        // need to revise to have tags like <line/>
        return '<' + 
            this.tagName + 
            ' ' + 
            utils.objToAttributes( this._attributes || {} ) + 
            '>' + 
            this.children.map( utils.mapElementsToHTML ).join('') +
            '</' +
            this.tagName +
            '>';
    },
    getAttribute: function( key ) {
        return this._attributes[ key ];
    },
    setAttribute: function( key, value ) {
        this._attributes[ key ] = value;
    },
    get attributes ( ) {
        return this._attributes;
    },
    set attributes ( value ) {
        return value; // block from directly setting
    },
    get outerHTML () {
        return this.toHTML();
    },
    get innerHTML () {
        return this.children.map( utils.mapElementsToHTML ).join('');
    },
    get innerText () {
        return this.children.map( utils.mapElementsToHTML ).join('');
    },
    set innerText ( value ) {
        this.children.length = 0; // empty array
        this.children.push( new TextNode( value, {
            unsafe: this.tagName === 'style' 
        } ) ); // style tags need no escape
    }
};