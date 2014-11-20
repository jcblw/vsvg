
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

    /*
        SvgNode::insertBefore - inserts new child before a referanced child
        params
            elem { SvgNode } - a new element
            refElem { SvgNode } - an exsisting child element
    */

    insertBefore: function ( elem, refElem ) {
        var index = utils.getElementIndex( refElem, this.children );
        this.removeChild( elem ); // this needs to be revised to be more like normal html spec
        this.children.splice( index, 0, elem );
    },

    /*
        SvgNode::removeChild - removes a child element from child array
        params
            elem { SvgNode } - an exsisting child element to be removed
    */


    removeChild: function ( elem ) {
        var index = utils.getElementIndex( elem, this.children );
        if ( index === -1 ) {
            return;
        }
        this.children.splice( index, 1 );
    },

    /*
        SvgNode::appendChild - appends a child element from child array
        params
            elem { SvgNode } - an exsisting child element to be appended
    */

    appendChild: function ( elem ) {
        this.removeChild( elem ); // remove any old instances
        elem.parentNode = this;
        this.children.push( elem );
    },

    /*
        SvgNode::toHTML - compiles tags for the element and child elements
        returns
            html { String } - the html ( svg ) compilied to a tring form
    */

    toHTML: function ( ) {
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

    /*
        SvgNode::getAttribute - get attribute of element
        params 
            key { String } - attribute name 
        returns
            value { Mixed } - the value of the attribute
    */

    getAttribute: function( key ) {
        return this._attributes[ key ];
    },

    /*
        SvgNode::setAttribute - set attribute of element
        params 
            key { String } - attribute name 
            value { Mixed } - the value of the attribute
    */

    setAttribute: function( key, value ) {
        this._attributes[ key ] = value;
    },

    /*
        SvgNode::attributes [ getter ] - returns the actual attribute object
        returns 
            attributes { Object } - object of attributes key values 
    */

    get attributes ( ) {
        return this._attributes;
    },

    /*
        SvgNode::attributes [ setter ] - blocks the direct setting of attributes
        returns 
            attributes { Mixed } - value attempting to set attibutes to 
    */

    set attributes ( value ) {
        return value; // block from directly setting
    },

    /*
        SvgNode::outerHTML [ getter ] - returns same as toHTML();
        returns 
            html { String } - compiled version of element and children
    */

    get outerHTML () {
        return this.toHTML();
    },

    /*
        SvgNode::innerHTML [ getter ]
        returns 
            html { String } - compiled version of element's children
    */

    get innerHTML () {
        return this.children.map( utils.mapElementsToHTML ).join('');
    },

    /*
        SvgNode::innerText [ getter ]
        returns 
            html { String } - current does the exact same thing as innerHTML

        TODO only compile down textNodes
    */

    get innerText () {
        return this.children.map( utils.mapElementsToHTML ).join('');
    },

    /*
        SvgNode::innerText [ setter ]
        params
            value { String } - This creates a textNode with the text given in it,
                will also remove any other Nodes from current element
    */

    set innerText ( value ) {
        this.children.length = 0; // empty array
        this.children.push( new TextNode( value, {
            unsafe: this.tagName === 'style' 
        } ) ); // style tags need no escape
    }
};