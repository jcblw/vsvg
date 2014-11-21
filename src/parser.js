var startTag = /^<([-A-Za-z0-9_]+)(.*?)(\/?)>/g,
    endTag = /<\/([-A-Za-z0-9_]+)[^>]*>/, // this just matches the first one
    attr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

var fs = require( 'fs' );
var util = require( 'util' );

function createTree ( tags ) {

    var _tags = [];

    function getArray( position, arr ) {
        var _position = makeArray( position );
        if ( !(_position.length - 1) ) {
            return arr;
        }
        var next = arr[ _position[ 0 ] ].children;
        _position.shift();
        return getArray( _position, next )
    }

    function addTagToTree( tag ) {
        var arr = getArray( tag.position, _tags );
        arr.push( tag );
    }

    tags.forEach( addTagToTree );
    return _tags;

}

function makeArray( arr ) {
    return Array.prototype.slice.call( arr, 0 )
}

function parse( xml, callback ) {

    xml = xml.replace( /(\r\n|\n|\r)/gm, '' ); // remove all line breaks

    var tags = [],
        position = [ 0 ];

    function getLastOpenTag( arr ) {
       for ( var i = tags.length - 1; i >= 0; i -= 1 ) {
            if ( !tags[ i ].closed ) {
                return i;
            }
       } 
       return -1;
    }

    function getTagIndex( tagName ) {
        for ( var i = tags.length - 1; i >= 0; i -= 1 ) {
            if ( tags[i].tagName === tagName ) {
                return i;
            }
        }
        return -1;
    }

    while ( xml ) {

        xml = xml.trim();

        var openTag = xml.match( startTag ),
            attributes,
            end,
            length,
            text,
            child,
            index,
            prevTag,
            closed,
            tag;

        if ( openTag ) {
            openTag = openTag[ 0 ];
            attributes = openTag.match( attr );
            xml = xml.substring( openTag.length ); 
            text = null;
            if ( /\/>$/.test( openTag ) ) {
                console.log( xml, openTag )
                closed = true;
            }
        }
        else {
            end = xml.match( endTag );
            attributes = [];
            if ( end ) {
                index = getTagIndex( end[ 1 ] );
                prevTag = tags[ index ];
                text = xml.slice( 0, end.index );
                xml = xml.substring( end.index + end[ 0 ].length );
            }
        }

        var tagName = attributes.shift(); 


        if ( tagName || text ) {
            
            
            function getPos( n ) {
                return n;
            }

            tag = {
                tagName: tagName,
                attributes: attributes,
                children: [],
                text: text,
                inside: getLastOpenTag(),
                closed: closed || !!text
            };

            if ( tag.inside > -1 ) {
                position.push( -1 );
                position[ tags[ tag.inside ].position.length ] += 1;
                position = position.slice( 0, tags[ tag.inside ].position.length + 1 );
            }

            tag.position = makeArray( position );
            tags.push( tag );

        }

        if ( prevTag ) {
            prevTag.closed = true;
        }

    }

    return createTree( tags );
}

