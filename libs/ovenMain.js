import { 
    cl2, linesToAppendArray, chkCasheDir, ovenDirEmpty, ovenLayoutToObjectFromJson, ovenDirToObj 
    } from './ovenHelper.js';


class ovenRun{
    constructor( recipe ){
        this.recipe = recipe;
        
    }


}


class oven{

    constructor( oName, homePath, srcHomePath = undefined ){
        this.oName = oName;
        this.homePath = homePath; 
        // as a __dirname
        this.srcHomePath = srcHomePath == undefined ? '/home/yoyo/Apps/viteyss-site-oven' : srcHomePath;
        this.mode = 'view';
        this.ENVs = {};
        this.dirs = {};
        this.freeChannels = [];
        this.adressUrl = '';
        this.ovenRuns = [];
        this.ovenRun = 0;
        
        this.logs = [];
        this.logsMax = 10;
        
        //this.readHomeCookBook_init();
    
    }
    
    readHomeCookBook_init = () => {
        let ovenDirObject = ovenDirToObj( this.homePath, this.srcHomePath, '' );
        this.adressUrl = '';
        this.dirs = {};
        //this.dir[ this.adressUrl ] = 
        this.updateDirsWith( '', ovenDirObject );    
    
    }
    
    updateDirsWith=( adressUrl, dirObj )=>{
        this.dirs[ adressUrl ] = dirObj;
        console.log('[oven:'+this.ovenRun+'] dirs now hawe [ '+Object.keys( this.dirs ).join(', ')+' ]');
    }
    
    
    setNewAdressUrl=( nAdressUrl )=>{
        let nAdre = this.adressUrl;
    
        if( nAdressUrl == -1 || nAdressUrl == '..' ){
            nAdre = this.adressUrl.substring( 0, nAdre.lastIndexOf('/')-1 );
            console.log('[oven] will swap CookBook [ .. ] back  nAdre',nAdre); 
        }else{
            nAdre+= '/'+nAdressUrl;
            console.log('[oven] will swap CookBook [ .. ] forvard  nAdre',nAdre); 
        }
        
        if( `${nAdre}` == `${this.adressUrl}` ){
            console.log('[oven] will swap CookBook @@ ... skip it\'s now current');
            return 1;
        }
        
        
        
        if( nAdre in this.dirs ){
            console.log('[oven] will swap CookBook target ... OK nAdre');
            this.adressUrl = nAdre;
            this.updateChannelsFreeArray( nAdre );
            
        }else{

            console.log('[oven] will swap CookBook target ... fetching nAdre');
            
            
            // place for a driver ?            
            this.adressUrl = nAdre;
            let dirObj = ovenDirToObj( this.homePath,  this.srcHomePath, nAdre );
            debugger
            this.updateDirsWith( nAdre, dirObj );
            this.updateChannelsFreeArray( nAdre );
            // place for a driver ? END

            console.log('[oven] will swap CookBook target ... not ok');
            return 1;
        }
        
        
    
    } 
    
    
    
    getDirFrom = ( adressUrl ) => {
        adressUrl = adressUrl == undefined ? this.adressUrl : adressUrl;
        return this.dirs[ adressUrl ];
    }
    getChannelsFrom = ( adressUrl ) => {
        return this.getDirFrom( adressUrl )['layout']['channels'];
    }
    getChannelFromNo = ( adressUrl = '', chNo ) => {
        return this.getDirFrom( adressUrl )['layout']['channels'][ chNo ];
    }
    getChanneltargetData = ( targetData ) => {
        return this.getChannelFromNo( targetData.adressUrl, targetData.chNo );
    }
    
    updateChannelsFreeArray = ( adressUrl = undefined ) => {
    
        if( adressUrl == undefined ){
            NO
        }
        if( !( adressUrl in this.dirs ) ){ console.error('no target dir in oven for adressUrl:('+adressUrl+') !'); return 1; }
        
        this.freeChannels = [];
        let channels = this.getChannelsFrom( adressUrl );
        
        //let chnow = channel['layout']['channels'];
        for(let ci=0,cc=channels.length; ci<cc; ci++ ){
            if( !( 'rName' in channels[ ci ] ) ){
                //console.log('[oven] ch '+ci+' ... ', channels[ ci ] );
            
                this.freeChannels.push( '- - - free - - -' ); 
            }else{
                this.freeChannels.push( channels[ ci ].rName );
            }
            
        }
        
        //this.freeChannels = tr;
    }
    
    
    
    
    
    
    // tui --- START
    A_getCookBooks_asMsg=( adressUrl = undefined )=>{
        return this.getDirFrom( adressUrl ).layout.dirList;
    }    
    
    A_getCookBooks_asArray=( adressUrl = undefined )=>{
        adressUrl = adressUrl == undefined ? this.adressUrl : adressUrl;
        let tr = adressUrl != '' && adressUrl != undefined ? [ '..' ] : [];
        //setTimeout(()=>console.log('adressUrl',adressUrl),200);
        
        for( let d of this.getDirFrom( adressUrl ).layout.dirList)
            tr.push( d ); 
        return tr;
    }

    A_getStatus_asMsg=()=>{
        return `@[ ${this.adressUrl} ][${this.mode}] | ENVs(${Object.keys(this.ENVs).length}) | `;
    }
    
    A_getLayout_asMsg=()=>{
        let i = 0;
        let tr = [];
        for( let ch of this.getChannelsFrom() ){
            tr.push( 
                "["+i+"] "+
                `${ ch.rName }\n`+
                `   \\_  > . . .`
                //JSON.stringify(ch,null,4) 
            );
            
            i++;
        }
        return tr.join('\n');
    } 
    // tui --- ENDS
    
    
    

}

export { oven }

