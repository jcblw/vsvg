
'use strict';

var tags = require( './tags' ),
    SvgNode = require( './svgNode' ),
    parser = require( 'vsvg-parser' ),
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


/*
    vsvg::_eachTag - utility to loop through the children of results of a parsed svg 
    string to turn the structure into vsvg tags.

    params
        tag { Object } - a tag object returned from parser.parse

    returns
        elem { Object } - a svgNode or textNode
*/

var _eachTag =
methods._eachTag = function _eachTag( tag ) {
 
    var elem;

    if ( tag.tagName && methods[ tag.tagName ] ) {

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

    return tag.text || '';
};

/*
    vsvg::parse - A wrapper around parser.parse to create vsvg Elements
    out of the return of parser.parse

    params
        svg { String } - a compiled string version of a svg to be parsed

    returns 
        tags { Array } - an array of svgNodes
*/
var parse =
methods.parse = function( svg ) {
    var parsedSVG;
    try {
        parsedSVG = parser.parse( svg );
    } catch ( e ) {
        return null;
    }
    return parsedSVG.map( _eachTag );
};

/*
    vsvg::_addNodeToVNode - adds regular DOM node to virtual node to allow for
    method proxing to actual dom nodes. Als o recusivly jumps into children and 
    attempts to add those nodes as well.

    params 
        node { Object } - a DOM node
        vNode { object } - a virtual svgNode
*/

var addNodeToVNode =
methods._addNodeToVNode = function( node, vNode ) {
    
    function eachChild( _vNode, index ) {
        addNodeToVNode( node.children[ index ], _vNode ); // recursivly jump down tree
    }

    vNode.children.forEach( eachChild ); // loop through all the children
    vNode._node = node;// attach node to vNode
};

/*
    vsvg::mount - mounts to a actual dom node and adds children  dom nodes to virtual tree
    as well.

    params 
        el { Object } - an entry point DOM node

    returns
        elem { Object } - a virtual representation of the DOM node
*/

methods.mount = function( el ) {
    var svg = el.outerHTML,
        tagTree = parse( svg );

    addNodeToVNode( el, tagTree[ 0 ] ); // start walking the parsed tree 
    return tagTree[ 0 ];
};