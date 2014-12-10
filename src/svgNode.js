
'use strict';

var utils = require( './utils' ),
    TextNode = require( './textNode' ),
    namespace = 'http://www.w3.org/2000/svg';

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

    attributes = Object.create( attributes || {} );

    this.guid = utils.guid();
    this.tagName = tagName;
    this._children = [];
    this.styles = attributes.style ? utils.styleToObject( attributes.style ) : {};
    attributes.style = this.styles;
    this._attributes = attributes;
    if ( typeof document === 'object' ) { // auto create element if in client
        this._node = document.createElementNS( namespace, tagName );
    }
}

SvgNode.prototype = {

    /*
        SvgNode::insertBefore - inserts new child before a referanced child
        params
            elem { SvgNode } - a new element
            refElem { SvgNode } - an exsisting child element
    */

    insertBefore: function ( elem, refElem ) {
        var index = utils.getElementIndex( refElem, this._children );
        this.removeChild( elem ); // this needs to be revised to be more like normal html spec
        this._children.splice( index, 0, elem );
        if ( this._node && elem._node && refElem._node ) {
            this._node.insertBefore( elem._node, refElem._node );
        }
    },

    /*
        SvgNode::removeChild - removes a child element from child array
        params
            elem { SvgNode } - an exsisting child element to be removed
    */


    removeChild: function ( elem ) {
        var index = utils.getElementIndex( elem, this._children );
        if ( index === -1 ) {
            return;
        }
        this._children.splice( index, 1 ); 
        if ( this._node && elem._node ) {
            this._node.removeChild( elem._node );
        }
    },

    /*
        SvgNode::replaceChild - removes a child element from child array and add a new one
        params
            elem { SvgNode } - an exsisting child element to be removed
            replaceElem { SvgNode } - an element to replace removed elem
    */


    replaceChild: function ( elem, replaceElem ) {
        var index = utils.getElementIndex( elem, this._children );
        if ( index === -1 ) {
            return;
        }
        this._children.splice( index, 1, replaceElem ); 
        if ( this._node && elem._node && replaceElem._node ) {
            this._node.replaceChild( replaceElem._node, elem._node );
        }
    },

    /*
        SvgNode::appendChild - appends a child element from child array
        params
            elem { SvgNode } - an exsisting child element to be appended
    */

    appendChild: function ( elem ) {
        this.removeChild( elem ); // remove any old instances
        elem.parentNode = this;
        this._children.push( elem );
        if ( this._node && elem._node ) {
            this._node.appendChild( elem._node );
        }
    },

    /*
        SvgNode::_removeTextNodes - a utility to remove text nodes from array
        params
            node { SvgNode } - a node to test to see if its a text node
    */

    _removeTextNodes: function ( node ) {
        return !!node.tagName;
    },
    
    /*
        SvgNode::children [ getter ]
        returns 
            array of nodes that are not text nodes
    */

    get children () {
        return this._children.filter( this._removeTextNodes );
    },

    /*
        SvgNode::firstChild [ getter ] 
        returns 
            child { SvgNode } - first child or null
    */

    get firstChild ( ) {
        return this._children[ 0 ];
    },

    /*
        SvgNode::toHTML - compiles tags for the element and child elements
        returns
            html { String } - the html ( svg ) compilied to a string form
    */

    toHTML: function ( ) {
        return '<' + 
            this.tagName + 
            ' ' + 
            utils.objToAttributes( this._attributes || {} ) + 
            '>' + 
            this._children.map( utils.mapElementsToHTML ).join('') +
            '</' +
            this.tagName +
            '>';
    },

    /*
        SvgNode::toText - compiles element inner text nodes to strings
        returns
            text { String } - the text inside of elements
    */

    toText: function( ) {
        return this._children.map( utils.mapElementsToText ).join('');
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
        if ( this._node ) {
            this._node.setAttribute( key, value );
        }
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
        return this._children.map( utils.mapElementsToHTML ).join('');
    },

    /*
        SvgNode::innerHTML [ setter ]
        params 
            html { String } - compiled version of element's children
    */

    set  innerHTML ( html ) {
        var vsvg = require( '../' ); // defer require so everything is loaded

        if ( this._node ) {
            this._node.innerHTML = html;
            this._children = vsvg.mount( this._node ).children;
        }
        else {
            this._children = vsvg.parse( html ); 
        }
    },

    /*
        SvgNode::innerText [ getter ]
        returns 
            html { String } - current does the exact same thing as innerHTML
    */

    get innerText () {
        return this.toText();
    },


    /*
        SvgNode::innerText [ setter ]
        params
            value { String } - This creates a textNode with the text given in it,
                will also remove any other Nodes from current element
    */

    set innerText ( value ) {
        this._children.length = 0; // empty array
        this._children.push( new TextNode( value, {
            unsafe: this.tagName === 'style' 
        } ) ); // style tags need no escape
        if ( this._node ) {
            this._node.innerText = value;
        }
    }
};