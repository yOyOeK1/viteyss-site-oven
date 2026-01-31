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

    constructor( oName, homePath, srcHomePath ){
        this.oName = oName;
        this.homePath = homePath; 
        this.srcHomePath = srcHomePath;
        this.ENVs = {};
        this.dirs = {};
        this.adressUrl = '/';
        this.ovenRuns = [];
        this.ovenRun = 0;
        
        this.logs = [];
        this.logsMax = 10;
        
        this.readHomeCookBook_init();
    
    }
    
    readHomeCookBook_init = () => {
        ovenDirObj = ovenDirToObj( this.homePath, this.srcHomePath, '' );
        this.adressUrl = '';
        this.dirs = {};
        //this.dir[ this.adressUrl ] = 
        this.updateDirWith( '', ovenDirObj );    
    
    }
    
    
    updateDirWith=( adressUrl, dirObj )=>{
        this.dirs[ adressUrl ] = dirObj;
        console.log('[oven:'+this.ovenRun+'] dirs now hawe [ '+Object.keys( this.dirs ).join(', ')+' ]');
    }
    

}

export { oven }

