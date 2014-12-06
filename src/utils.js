
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
    styleToObject - decompilies key:value to { key: value };
    params
        styles { String } - compiled sting with css declarations
    retruns
        ret { Object } - object of style declarations
*/

exports.styleToObject = function styleToObject( styles ) {
    var ret = { };

    if ( typeof styles === 'object' ) {
        return styles;
    }

    styles.split( ';' ).map( keyVal ).forEach( addToReturn );

    function addToReturn ( keyval ) {
        ret[ keyval[ 0 ] ] = keyval[ 1 ];
    }

    function keyVal( str ) {
        return str.trim().split( ':' );
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
        if ( attr !== 'style' || value ) {
            ret += attr + '="' + value + '" ';
        }
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