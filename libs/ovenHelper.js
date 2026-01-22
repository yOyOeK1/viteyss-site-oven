import fs from 'fs'
import path from 'path'


function ovenDirEmpty( pathToOvenBaseDir ){
    console.log( undefined, '# * dir empty copy default ...' );
    let ovenDefPath = path.join( pathToOvenBaseDir, 'ovenDef' );        
    let toCopy = fs.readdirSync( ovenDefPath );
    console.log( undefined, `# * dir empty copy default ... ( ${toCopy.length} ) files\n`+
        `#  to destination [ ${this.homePath} ]`
    );
    toCopy.forEach( fName => {
        console.log( undefined, `#   - ${fName} ... `  );
        fs.copyFileSync( 
            path.join( ovenDefPath, fName ),
            path.join( this.homePath, fName )
            );

        console.log( undefined, `# * root directory of Recipe books installed`);
    } );
    
}


 function ovenLayoutToObjectFromJson( jIn, pathBase ){
    
    let dirListAll = fs.readdirSync( pathBase );
    let dirList = dirListAll.filter( di => fs.statSync( path.join( pathBase, di ) ).isDirectory()  );
    let chs = new Array( 'channels' in jIn ?  jIn.channels : 10 );
    
    for( let ci=0,chc=chs.length; ci<chc; ci++){
        if( dirListAll.findIndex( fi => fi == `0_ch${ci}.js`) != -1 ){
            chs[ ci ] = JSON.parse( fs.readFileSync( path.join( pathBase, `0_ch${ci}.js` ) ).toString() );
            console.log( '#* channel'+ci+' ... OK ');
        }else{
            console.log( '#* channel'+ci+' not set ');;
        }
        
    }
    let tr = { title: 'is layout TODO',
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

export {  cl2, chkCasheDir, ovenDirEmpty, ovenLayoutToObjectFromJson }