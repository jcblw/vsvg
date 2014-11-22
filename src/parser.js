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
        closed,
        tagName,
        tag;


    while ( xml ) { // we carve away at the xml variable

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