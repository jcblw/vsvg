/*
    tag - a list of tags that gets split into an array
*/

var tags = 'a,altGlyph,altGlyphDef,altGlyphItem,animate,animateColor,animateMotion,animateTransform,circle,clipPath,color-profile,cursor,defs,desc,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,font,font-face,font-face-format,font-face-name,font-face-src,font-face-uri,foreignObject,g,glyph,glyphRef,hkern,image,line,linearGradient,marker,mask,metadata,missing-glyph,mpath,path,pattern,polygon,polyline,radialGradient,rect,script,set,stop,style,svg,switch,symbol,text,textPath,title,tref,tspan,use,view,vkern'.split(',');

/*
    s4 & guid - makes a unique idenifier for elements
*/

function s4( ) {
    return Math.floor( ( 1 + Math.random( ) ) * 0x10000 )
        .toString( 16 )
        .substring( 1 );
}

function guid( ) {
    return s4( ) + s4( ) + '-' + s4( ) + '-' + s4( ) + '-' +
        s4( ) + '-' + s4( ) + s4( ) + s4( );
}

/*
    objToStyle - compiles { key: value } to key:value;
*/

function objToStyles( styles ) {
    var ret = '';
    for ( var prop in styles ) {
        ret += prop + ':' + styles[ prop ] + ';';
    }
    return ret;
}

/*
    objToAttribute - compiles { key: value } to key="value"
*/

function objToAttributes( attributes ) {
    var ret = '',
        value;
    for( var attr in attributes ) {
        value = attr === 'style' ? objToStyles( attributes[ attr ] ) : attributes[ attr ];
        ret += attr + '="' + value + '" ';
    }
    return ret;
}

/*
    mapElementsToHTML - to be use with arr.map with run toHTML of each element
*/

function mapElementsToHTML( elem ) {
    return elem.toHTML();
}

/*
    getElementIndex - get the index of the element in an array
*/

function getElementIndex( elem, arr ) {
    var index = -1;
    arr.forEach( function( _elem, _index ) {
        if ( elem.guid === _elem.guid ) {
            index = _index;
        }
    } );
    return index;
}

/*
    tag - creates an element
*/

// might be best to turn this into a instance
function tag( tagName, _attributes ) {
    var ns = tagName === 'svg' ? 'xmlns="http://www.w3.org/2000/svg" ' : ' ',
        children = [],
        attributes = Object.create( _attributes || {} ),
        styles = {};


    /*
        _elem is the element object
    */

    var _elem = {
        guid: guid(),
        parentNode: null,
        children: children,
        insertBefore: function ( elem, refElem ) {
            var index = getElementIndex( refElem, _elem.children );
            _elem.children.splice( index, 0, elem );
        },
        removeChild: function ( elem ) {
            var index = getElementIndex( elem, children );
            if ( index === -1 ) {
                return;
            }
            children.splice( index, 1 );
        },
        appendChild: function ( elem ) {
            _elem.removeChild( elem ); // remove any old instances
            elem.parentNode = _elem;
            children.push( elem );
        },
        toHTML: function ( ) {
            return '<' + 
                tagName + 
                ' ' + 
                ns + 
                objToAttributes( attributes || {} ) + 
                '>' + 
                children.map( mapElementsToHTML ).join('') +
                '</' +
                tagName +
                '>';
        },
        getAttribute: function( key ) {
            return attributes[ key ];
        },
        setAttribute: function( key, value ) {
            attributes[ key ] = value;
        },
        get attributes ( ) {
            return attributes;
        },
        get outerHTML () {
            return _elem.toHTML();
        },
        get innerHTML () {
            return children.map( mapElementsToHTML ).join('');
        },
        set innerText ( value ) {
            children.length = 0; // empty array
            children.push({
                // this need to be a better solution
                toHTML: function(){
                    return value;
                }
            })
        }
    };

    return _elem;
}

/*
    runs and returns an object with all the tagNames eg. vsvg.style()
*/

module.exports = ( function() {
    var methods = {};
    tags.forEach( function( tagName ) {
        methods[ tagName ] = tag.bind( null, tagName );
    } );
    return methods;
}( ) );