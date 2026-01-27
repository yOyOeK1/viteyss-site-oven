import fs from 'fs'
import path from 'path'


function ovenDirToObj( thomePath, ovenHomeSrcPath, pathBase = undefined ){
    let ovenDir = chkCasheDir( undefined, thomePath );
            
    
    let dirPathScan = thomePath;
    if( pathBase == undefined){
        pathBase = thomePath;

    }else{
        dirPathScan = path.join( thomePath, pathBase );
    }
    
    if( ovenDir.length == 0 ){
        ovenDirEmpty( thomePath, ovenHomeSrcPath ); // adres to src of over for defs
        ovenDir = chkCasheDir( undefined, thomePath );        
    }

    ovenDir = fs.readdirSync( dirPathScan );


    let layoutR = ovenDir.findIndex( fName => fName == '0_layout.js' );
    let layoutName = layoutR == -1 ? {} : JSON.parse( fs.readFileSync( path.join( thomePath, '0_layout.js' ) ).toString() );

    let ovenObj = {
        'layout': ovenLayoutToObjectFromJson( layoutName, dirPathScan ),
        pathBase,
        ovenDir,
        dirPathScan,
    }; 


    return ovenObj;
}


function ovenDirEmpty( thomePath, dirname ){
    console.log( undefined, '# * dir empty copy default ...' );
    let ovenDefPath = path.join( dirname, 'ovenDef' );        
    let toCopy = fs.readdirSync( ovenDefPath );
    console.log( undefined, `# * dir empty copy default ... ( ${toCopy.length} ) files\n`+
        `#  to destination [ ${thomePath} ]`
    );
    toCopy.forEach( fName => {
        console.log( undefined, `#   - ${fName} ... `  );
        fs.copyFileSync( 
            path.join( ovenDefPath, fName ),
            path.join( thomePath, fName )
            );

        console.log( undefined, `# * root directory of Recipe books installed`);
    } );
    
}


 function ovenLayoutToObjectFromJson( jIn, pathBase ){
    
    let dirListAll = fs.readdirSync( pathBase );
    let dirList = dirListAll.filter( di => fs.statSync( path.join( pathBase, di ) ).isDirectory()  );
    let chs = new Array( 'channels' in jIn ?  jIn.channels : 10 ).fill({});
    
    for( let ci=0,chc=chs.length; ci<chc; ci++){
        if( dirListAll.findIndex( fi => fi == `0_ch${ci}.js`) != -1 ){
            chs[ ci ] = JSON.parse( fs.readFileSync( path.join( pathBase, `0_ch${ci}.js` ) ).toString() );
            console.log( '#* channel'+ci+' ... OK ');
        }else{
            console.log( '#* channel'+ci+' not set ');
        }
        
    }
    let tr = { 
        name: 'name' in jIn ? jIn.name : 'D:'+path.basename( pathBase ),
        channels: chs,
        dirList: dirList,
        jIn

    };
    return tr;
}

let chkCasheDir = ( res, dirname ) => {
    cl2(res, '[i] checking by temporary directory [ '+dirname+' ]');
    let cFolder = undefined;
    try{
        cFolder = fs.readdirSync( dirname );
    }catch(e){
        cl2(res, ['[ee] fs return\n',e]);
        fs.mkdirSync( dirname );
        cFolder = fs.readdirSync( dirname );

    }

    return cFolder;
};

function cl2( res, str ){
    if( res == undefined ){
        console.log( '[local]'+str );
    }else{
        console.log( '['+res.runNo+']'+str );
        res.write( '['+res.runNo+']'+str+"\n" );

    }
}

export {  cl2, chkCasheDir, ovenDirEmpty, ovenLayoutToObjectFromJson, ovenDirToObj }
