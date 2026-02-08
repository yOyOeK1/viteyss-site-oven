
import { spawn } from 'node:child_process';
import { cl2, cl2ts, linesToAppendArray } from './ovenHelper.js';
import { msgsCODES } from './ovenHttp.js';

class Beakeary {

    constructor( runNo, req, res, spList, vClients ){
        res['runNo'] = runNo;
        this.runNo = runNo;
        this.req = req;
        this.res = res;
        this.spList = spList;
        this.vClients = vClients;

    }

    cl( str ){
        console.log(`[Beakeary]   `,str);
    }


    mkVClient = ( runNo, req, res ) => {
        let vClient = { id: runNo,'online': true, req, res};
        this.vClients[ runNo ] = vClient;
        return vClient;
    }

    startBeaking=( cmdToDo, recipe = undefined )=>{        
        //this.runNo++;
        let runNo = `${this.runNo}`;
        
        let clientOnline = 1;    
        let vClientsOnline = true;    
        
        let tvClient = this.mkVClient( runNo, this.req, this.res );
        let tvClients = this.vClients;
        //let tspList = this.spList;

        let waitForEndInter = -1;
        let waitForEnd = true;
        //let cDir = chkCasheDir( res, this.casheFolder );
        let semaforPath = `ide${Date.now()}_status_`;
        let extOk = true;
        
       

        let spObj = {
            ident: semaforPath,
            cmd: cmdToDo,
            'vClient':tvClient,
            'sp': undefined,
            'runNo': runNo,
            'status' : 'running ...',
            'tEnd': undefined,
            'tEndWatchDog': undefined,
            'tStart': Date.now(),
            'exitCode': undefined,
            'stdout': [],
            'stderr': [],
            recipe,
            'vClients':[ runNo ]
        };
        
        
        if( recipe != undefined ){
            // look for shared recipy running .... START
            let spRunning = this.spList.filter( 
                s => s.end == undefined && s.exitCode == undefined && s.recipe.sharedSession &&
                s.recipe.mediumProtocal == recipe.mediumProtocal &&
                s.recipe.topicAddress == recipe.topicAddress &&
                s.vClients.indexOf( runNo ) == -1
            );
            if( spRunning.length == 1 ){
                
                this.res.write('# comming ... chunk ...\n');
                
                spRunning[0].vClients.push( runNo );
                
                console.log('[have share 1 ....]',spRunning[0]);
                return undefined;
                //process.exit(11);
                // look for shared END
            }
        }
        
        //this.spList.push( spObj );
        
        cmdToDo = `echo '${msgsCODES['START_STDIO']}_${runNo}';` + cmdToDo;
        //'echo "'+msgsCODES['END_STDIO']+'_'+runNo+'";'
        
        
        let sp = spawn( cmdToDo, { shell: true, detached: false, } );
        spObj.sp = sp;
        let spPidSend = false;
        
        
        //"# set oven ENVexport oven_home=$HOME'/.viteyss/oven'export oven_adressUrl=''export oven_my_chNo='-1'export oven_my_rName='debug_test'# set oven ENV --- END;echo 'Pwd: [ '`pwd`' ] ';"
                //spStatus = 'running ...';
        

        let cl2Res = ( data, desc ) => {
            let linRes;
            if( desc == 'data' ){
                linRes = linesToAppendArray( data, spObj.stdout );
            }else{
                linRes = linesToAppendArray( data, spObj.stderr );
            }

            if( spObj.vClients.length > 0 ){
                spObj.vClients.forEach( ciRID => {
                    if( ciRID != -1 ){

                        if( tvClients[ ciRID ] != -1 && !( 'spPidSend' in tvClients[ ciRID ] ) ){
                            linRes.linesSplit.push( msgsCODES['PID_NO']+','+spObj.sp.pid+',' );
                            tvClients[ ciRID ]['spPidSend'] = true;
                        }
                    
                        cl2ts( 
                            tvClients[ ciRID ]['res'], 
                            '[sp]['+desc+'] ... ['+runNo+']:vC['+ciRID+']',
                            linRes.linesSplit.join('\n') 
                        );

                    }

                });
            }


            return linRes.arrayTo;

        };



        sp.stdout.on( 'data', dataOut =>{
            spObj.stdout = cl2Res( dataOut, 'data' );
           
        });

        sp.stderr.on( 'data', dataErr =>{
            spObj.stderr = cl2Res( dataErr, 'err' );
        });

        sp.on('close', exitCode => {
            //cl2(res, ['[sp][close] ',exitCode]);
            clearInterval( waitForEndInter );
            
            spObj.status='done';
            spObj.exitCode = exitCode;
            spObj.tEnd = Date.now();
            waitForEndInter = -1;
            

            if( spObj.vClients.length > 0 ){
                spObj.vClients.forEach( ciRID => {
                    if( ciRID != -1 ){
                        cl2( tvClient['res'], ['[sp][close] ',exitCode] );
                        if( tvClients[ ciRID ]['res'] != undefined ) tvClients[ ciRID ]['res'].end( msgsCODES['END_STDIO']+'_'+runNo );
                        tvClients[ ciRID ] = -1;
                        clientOnline = 0;
                        vClientsOnline = false;
                    }

                });
            }



        });            
        sp.stdin.end();
        



        waitForEndInter = setInterval(()=>{
            if( waitForEnd == false || spObj.status == 'done' ){
            
                cl2( this.res, '# [@@] BakeInPlace ... At WATCHDOG');
                clearInterval( waitForEndInter );
                
                cl2( this.res, '# [@@] BakeInPlace ... cleaning sub process list ');
                spObj.tEndWatchDog = Date.now();

                this.res.end('# ----- DONE');
                waitForEndInter = -1;

                

            }else{
                cl2(this.res, msgsCODES['PING']+clientOnline+' ] sp [ '+spObj.status+' ] ('+this.spList.length+')\n');
            }

        },15000);

        this.setBeakingProcess( spObj );

        return spObj;
    }
    


    setBeakingProcess = ( spObj) =>{
        this.req.on('close',e=>{
            this.cl('\n\n['+spObj.runNo+'][##] http client left close\n'+
                '# TODO vClients ... ')
                ;

            this.vClients[ spObj.runNo ] = -1;
            spObj.vClient.online = false;
            

            // if recipe to kill process not background ones
            if( spObj.recipe != undefined && 
                spObj.recipe.onlyWhenImOnline == true &&
                spObj.exitCode == undefined
            ){
                console.log('[@@] client close session.\n But process still running ... \n Will kill process ... pid [ '+spObj.sp.pid+' ]');
                spawn( `pkill -e -P ${spObj.sp.pid}`, { shell: true, detached: false, } );

            }



        });
        this.req.on('error',e=>{ 
            this.cl('\n\n['+spObj.runNo+'][##] http client left error');
        });

    }
    

}

export{ Beakeary }
    

