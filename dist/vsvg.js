(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// export out src svg
var vsvg = require( './src/' );

module.exports = vsvg;

if ( typeof window === 'object' ) {
    window.vsvg = vsvg;
}
},{"./src/":2}],2:[function(require,module,exports){

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
    var parsedSVG;
    try {
        parsedSVG = parser.parse( svg );
    } catch ( e ) {
        return null;
    }
    return parsedSVG.map( _eachTag );
};
},{"./parser":3,"./svgNode":4,"./tags":5}],3:[function(require,module,exports){
'use strict';

var startTag = /^<([-A-Za-z0-9_]+)(.*?)(\/?)>/g, // match opening tag
    endTag = /<\/([-A-Za-z0-9_]+)[^>]*>/, // this just matches the first one
    attr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g, // match tag attributes
    utils = require( './utils' ); 

exports.parse = parse;

/*
    getAttributes - turns an array of attributes into a key value object
    params
        attributes { Array } - array of strings eg. [ 'x="5"' ]
    returns
        attributes { Object } - object of key values eg. { x: '5' }
*/

var getAttributes =
exports.getAttributes = function getAttributes( attributes ) {
    var _attributes = {};

    function addToAttributes( keyvalue ) {
        var arr = keyvalue.split( /=/ ),
            key = arr[ 0 ],
            value = arr[ 1 ] ? arr[ 1 ].slice( 1 ).slice( 0, -1 ) : '';

        _attributes[ key ] = value;
    }

    attributes.forEach( addToAttributes );

    return _attributes;
};

/*
    getTagIndex - given a tagName it will return the index of the last tag that matches the tagName
    params
        tagName { String } - the tagName eg, svg, text, line
        tags { Array } - array of tags, the tag object has a tagName variable that is matched against the tagName
    returns
        index { Number } - returns index of tag, or -1 if not in array
*/

var getTagIndex =
exports.getTagIndex = function getTagIndex( tagName, tags ) {
    for ( var i = tags.length - 1; i >= 0; i -= 1 ) {
        if ( tags[i].tagName === tagName ) {
            return i;
        }
    }
    return -1;
};

/*
    getLastOpenTag - gets the index of the last opened tag
    params
        tags { Array } - array of tags, the tag object has a closed variable that is test which
            indicates if the tag is closed. Array is ran through in reverse
    returns
        index { Number } - returns index of tag, or -1 if not in array
*/

var getLastOpenTag =
exports.getLastOpenTag = function getLastOpenTag( tags ) {
   for ( var i = tags.length - 1; i >= 0; i -= 1 ) {
        if ( !tags[ i ].closed ) {
            return i;
        }
   } 
   return -1;
};

/*
    createTree - turns an array of elements and turns them into tree based off position array
    params
        tags { Array } - array of tags, the tag object consist of three main things, tagName, position, attributes
    returns
        attributes { Object } - object which is a nest object representation of the original svg
*/

var createTree =
exports.createTree = function createTree( tags ) {

    var _tags = [];

    function getArray( position, arr ) {
        var _position = utils.makeArray( position );
        if ( _position.length === 1 ) {
            return arr;
        }
        var next = arr[ _position[ 0 ] ].children;
        _position.shift();
        return getArray( _position, next );
    }

    function addTagToTree( tag ) {
        var arr = getArray( tag.position, _tags );
        arr.push( tag );
    }

    tags.forEach( addTagToTree );
    return _tags;

};



/*
    parse - will parse a xml string and turn it into an array of tags
    params
        xml { String } - a xml string eg. '<svg><line /></svg>'
    returns
        index { Array } - array of tags in a tree form same as the structure as the xml string
        
        eg.
            [{
                tagName: 'svg',
                attributes: {},
                position: [ 0 ]
                children: [{
                    tagName: 'line',
                    attributes: {},
                    children: [],
                    postion: [ 0, 0 ]
                }]
            }]

*/

function parse( xml ) {

    xml = xml.replace( /(\r\n|\n|\r)/gm, '' ); // remove all line breaks

    var tags = [],
        position = [ 0 ], // initial position
        openTag, 
        attributes,
        end,
        text,
        index,
        prevTag,
        prevLength,
        closed,
        tagName,
        tag;

    while ( xml ) { // we carve away at the xml variable

        // this checks to see if the previous string length is same as 
        // the current string length
        if ( xml.length === prevLength ) {
            throw new Error( 'Failed to parse SVG at chars: ' + xml.substring( 0, 5 ) );
        }
        // set prevLength
        prevLength = xml.length;

        xml = xml.trim(); // there is some issues with open tag if this is not done

        openTag = xml.match( startTag );

        if ( openTag ) { // if there is an open tag grab the attribute, and remove tag from xml string
            openTag = openTag[ 0 ];
            attributes = openTag.match( attr );
            xml = xml.substring( openTag.length ); 
            // reseting some vars
            text = null;
            prevTag = null;
            closed = null;
            if ( /\/>$/.test( openTag ) ) { // testing for self closing tags
                closed = true;
            }
        }
        else {
            end = xml.match( endTag ); // see if there is an end tag
            attributes = [];
            if ( end ) { // if there is a end tag find the last tag with same name, set text, and remove data from xml string
                index = getTagIndex( end[ 1 ], tags ); 
                prevTag = tags[ index ];
                text = xml.slice( 0, end.index );
                xml = xml.substring( end.index + end[ 0 ].length );
            }
        }

        tagName = attributes.shift(); // tagName with be the first in array

        if ( tagName || text ) { // tagName or text will be set if it is somewhat of a good output

            tag = {
                tagName: tagName,
                attributes: getAttributes( attributes ), // convert to object
                children: [],
                text: text,
                inside: getLastOpenTag( tags ), // this is needed to get an accurate position
                closed: closed || !!text
            };

            if ( tag.inside > -1 ) {
                position.push( -1 ); // push this value it is sometime just cut off
                position[ tags[ tag.inside ].position.length ] += 1;
                position = position.slice( 0, tags[ tag.inside ].position.length + 1 );
                // eg. [ 0, 0, 1 ] this is a map of where this tag should be at
            }

            tag.position = utils.makeArray( position );
            tags.push( tag ); // push the tag

        }

        if ( prevTag ) {
            prevTag.closed = true; // close the prevTag
        }

    }

    return createTree( tags ); // convert flat array to tree
}
},{"./utils":7}],4:[function(require,module,exports){

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
    this._children = [];
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
        var index = utils.getElementIndex( refElem, this._children );
        this.removeChild( elem ); // this needs to be revised to be more like normal html spec
        this._children.splice( index, 0, elem );
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
    }
};
},{"./textNode":6,"./utils":7}],5:[function(require,module,exports){

'use strict';

/*
    All current svg tags
*/

module.exports = [
    "a",
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animate",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "color-profile",
    "cursor",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "font",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignObject",
    "g",
    "glyph",
    "glyphRef",
    "hkern",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "missing-glyph",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "script",
    "set",
    "stop",
    "style",
    "svg",
    "span",
    "switch",
    "symbol",
    "text",
    "textPath",
    "title",
    "tref",
    "tspan",
    "use",
    "view",
    "vkern"
];
},{}],6:[function(require,module,exports){

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
},{"./utils":7}],7:[function(require,module,exports){

'use strict';

/*
    s4 & guid - makes a unique idenifier for elements
*/
function s4( ) {
    return Math.floor( ( 1 + Math.random( ) ) * 0x10000 )
        .toString( 16 )
        .substring( 1 );
}


exports.guid = function guid( ) {
    return s4( ) + s4( ) + '-' + s4( ) + '-' + s4( ) + '-' +
        s4( ) + '-' + s4( ) + s4( ) + s4( );
};

/*
    objToStyle - compiles { key: value } to key:value;
    params
        styles { Object } - object of style declarations
    retruns
        ret { String } - compiled sting with css declarations 

    TODO - support camel case
*/

var objToStyles =
exports.objToStyles = function objToStyles( styles ) {
    var ret = '';
    for ( var prop in styles ) {
        ret += prop + ':' + styles[ prop ] + ';';
    }
    return ret;
};

/*
    objToAttribute - compiles { key: value } to key="value"
    params
        attributes { Object } - object of attribute declarations
            style objects will run through objToStyles
    returns
        ret { String } - compiled string with attribute declaration 

    TODO - support camel case
*/

exports.objToAttributes = function objToAttributes( attributes ) {
    var ret = '',
        value;
    for( var attr in attributes ) {
        value = attr === 'style' ? objToStyles( attributes[ attr ] ) : attributes[ attr ];
        ret += attr + '="' + value + '" ';
    }
    return ret;
};

/*
    mapElementsToHTML - to be use with arr.map with run toHTML of each element
    params
        elem { SvgNode Object } - object created by calling tag().
    returns
        html { String } - compiled elem object
*/

exports.mapElementsToHTML = function mapElementsToHTML( elem ) {
    return elem.toHTML();
};

/*
    mapElementsToHTML - to be use with arr.map with run toHTML of each element
    params
        elem { SvgNode Object } - object created by calling tag().
    returns
        html { String } - compiled elem object
*/

exports.mapElementsToText = function mapElementsToText( elem ) {
    return elem.toText();
};

/*
    getElementIndex - get the index of the element in an array
    params
        elem { SvgNode Object } - object created by calling tag().
        arr { Array } - a collections of SvgNode Objects
    returns
        index { Number } - the index of SvgNode obj in collection
*/

exports.getElementIndex = function getElementIndex( elem, arr ) {
    var index = -1;
    arr.forEach( function( _elem, _index ) {
        if ( elem.guid === _elem.guid ) {
            index = _index;
        }
    } );
    return index;
};

/*
    escapeHTML - escapes HTML
    params
        html { String } - unescaped html
    returns
        text { String } - escaped html
*/

exports.escapeHTML = function escapeHTML( html ) {
  return String( html )
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/*
    makeArray - creates a copy of an array
    params
        arr { Array } - original array
    returns
        arr { Array } - new Array
*/

exports.makeArray = function makeArray( arr ) {
    return Array.prototype.slice.call( arr, 0 );
};
},{}]},{},[1]);
