var fs = require( 'fs' ),
    vsvg = require( '../' ),
    svg = vsvg.svg({
        width: '130',
        height: '120',
        'shape-rendering': "crispEdges"
    }),
    style = vsvg.style({
        type: 'text/css'
    }),
    path0 = vsvg.path({ 
        d: 'M0 0h120v120h-120z',
        class: 'st0'
    }),
    path1 = vsvg.path({ 
        d: 'M110 62h10v20h-10z',
        class: 'st1'
    }),
    path2 = vsvg.path({
        d: 'M120 62h10v20h-10z',
        class: 'st2'
    }),
    path3 = vsvg.path({
        d: 'M24 33h4v4h-4zM32 33h4v4h-4zM28 37h4v4h-4zM24 41h4v4h-4zM32 41h4v4h-4zM76 33h4v4h-4zM84 33h4v4h-4zM80 37h4v4h-4zM76 41h4v4h-4zM84 41h4v4h-4zM44 53h4v4h-4zM48 57h12v4h-12zM60 53h4v4h-4zM20 81h8v4h-8zM28 77h8v4h-8zM36 73h32v4h-32zM68 77h16v4h-16zM84 81h8v4h-8zM92 85h8v4h-8z',
        class: 'st1'
    });

style.innerText = '<![CDATA[.st0{fill:#EE67A4;}.st1{fill:#231F20;}.st2{fill:#35BEB8;}]]>';

svg.appendNode( style );
svg.appendNode( path0 );
svg.appendNode( path1 );
svg.appendNode( path2 );
svg.appendNode( path3 );

fs.writeFile( './examples/hello.svg', svg.toHTML(), console.log.bind( console ) );
