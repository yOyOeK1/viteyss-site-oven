import { cl2, linesToAppendArray, 
    chkCasheDir, ovenDirEmpty, 
    ovenLayoutToObjectFromJson, ovenDirToObj 
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
        this.srcHomePath = srcHomePath == undefined ? '/home/yoyo/Apps/viteyss-site-oven' : srcHomePath;
        this.ENVs = {};
        this.dirs = {};
        this.adressUrl = '/';
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
    
    
    
    
    // tui --- START
    A_getCookBooks_asMsg=( adressUrl = undefined )=>{
        return this.getDirFrom( adressUrl ).layout.dirList;
    }    
    
    A_getCookBooks_asArray=( adressUrl = undefined )=>{
        return this.getDirFrom( adressUrl ).layout.dirList;
    }

    A_getStatus_asMsg=()=>{
        return `@[ ${this.adressUrl} ] | ENVs(${Object.keys(this.ENVs).length}) | `;
    }

    // tui --- ENDS
    
    
    

}

export { oven }

