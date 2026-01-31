import { spawn } from 'node:child_process';
import {dirname} from 'node:path'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';  
import { writeHeadChunke }  from './libs/ovenHttp.js';
import { cl2, linesToAppendArray, 
    chkCasheDir, ovenDirEmpty, 
    ovenLayoutToObjectFromJson, ovenDirToObj 
    } from './libs/ovenHelper.js';
import { stderr } from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __dirnameProcess = process.cwd();


class serveroven{

    constructor(){
        
        this.method = "GET";
        this.url = "/apis/oven";
        this.ottO = undefined;
        this.server = undefined;
        this.casheFolder = '/tmp/oven';
        this.runNo = 0;
        this.envMy = {'filename':__filename, 'dirname':__dirname, 'dirnameProcess':__dirnameProcess};
        
        chkCasheDir( undefined, path.join(process.env.HOME, '.viteyss') );
        this.homePath = path.join(process.env.HOME, '.viteyss', 'oven');
        
        
        this.spList = [];
        this.vClients = {};

        // remove it --- start
        this.ovenCurrent = undefined;
        this.adressUrl = undefined;
        this.dir = undefined;
        this.readHomeCookBook();
        // remove it --- END
        
        this.ovenM = new oven( 'as1', this.homePath, __dirname );
        
        //this.mapleafletPath = '/home/iloo/Projects/ilooViteYss/sharelibs/viteyss-site-mapleaflet';
        //this.mapleafletPath = '/home/yoyo/Apps/viteyss-site-mapleaflet';
        
        
    }

    handleRequest( args ){
        let {req, res, server } = args;

        if( String(req.url).startsWith(this.url) ){
            this.server = server;
            return this.doIt( req,res );

        }

    }

    // remove it 
    readHomeCookBook=()=>{
        this.ovenCurrent = ovenDirToObj( this.homePath, __dirname, '' );
        this.adressUrl = '';
        this.dir = {};
        //this.dir[ this.adressUrl ] = 
        this.updateDirWith( '', this.ovenCurrent );       

    }
    
    // remove it
    updateDirWith=( adressUrl, dirObj )=>{
        this.dir[ adressUrl ] = dirObj;
        console.log('[oven] dir now hawe [ '+Object.keys( this.dir ).join(', ')+' ]');
    }
    
    


    cl( str ){
        console.log(` apioven     ${this.method}  ${this.url}     `,str);
    }



       


    startBeaking=( req, res, cmdToDo, recipeStart = undefined )=>{        
        this.runNo++;
        let runNo = `${this.runNo}`;
        res['runNo'] = runNo;
        let clientOnline = 1;        
        writeHeadChunke( res );
        

        let waitForEndInter = -1;
        let waitForEnd = true;
        let cDir = chkCasheDir( res, this.casheFolder );
        let semaforPath = `${this.casheFolder}/${Date.now()}_status_`;
        let extOk = true;
        
        cl2(res, [
            ` viteyss-site-oven / startBeaking - ${this.url} ... `,
            '',
            ' will exec?    [ '+extOk+' ]',
            ' cmd to run: ',
            '               [ '+cmdToDo+' ]',
            ' runNo:        [ '+runNo+' ]',
            ' semafor path: [ '+semaforPath+ ' ]',
            ' entry date:   [ '+Date.now()+' ]',
            '',
            '',
            ].join('\n# ')
        );
        
        if( extOk == false ){
            cl2(res,'No start extension not ok !! EXIT;');
            return 0;
        }

        let vClientsOnline = true;
        let sp = spawn( 'echo "# GOGO ... #";'+cmdToDo, { shell: true } );
        //let sp = spawn( 'echo "# GOGO ... #"; sh -s <<EOF\n '+cmdToDo+' \nEOF\n', { shell: true } );
        let vClient = { id: runNo,'online': vClientsOnline, req, res};
        this.vClients[ runNo ] = vClient;

        let spObj = {
            ident: semaforPath,
            'sp': sp,
            'runNo': runNo,
            'status' : 'running ...',
            'tEnd': undefined,
            'tEndWatchDog': undefined,
            'tStart': Date.now(),
            'exitCode': undefined,
            'stdout': [],
            'stderr': [],
            recipeStart,
            'vClients':[ runNo ]
        };
        this.spList.push( spObj );
        //spStatus = 'running ...';
        

        sp.stdout.on( 'data', d =>{
            cl2(res,           '[sp][data] ... ');
            spObj.stdout = linesToAppendArray( res, d, spObj.stdout );
           
        });

        sp.stderr.on( 'data', d =>{
            cl2(res, '[sp][err] ... ');
            spObj.stderr = linesToAppendArray( res, d, spObj.stderr );
        });

        sp.on('close', exitCode => {
            cl2(res, ['[sp][close] ',exitCode]);
            clearInterval( waitForEndInter );
            
            spObj.status='done';
            spObj.exitCode = exitCode;
            spObj.tEnd = Date.now();
            //waitForEnd = false
            //cl2(res, '# [sp][close] BakeInPlace');
            res.end('# ----- DONE');
            waitForEndInter = -1;
            

        });            
        sp.stdin.end();
        
        waitForEndInter = setInterval(()=>{
            if( waitForEnd == false || spObj.status == 'done' ){
            
                cl2(res, '# [@@] BakeInPlace ... At WATCHDOG');
                clearInterval( waitForEndInter );
                
                cl2(res, '# [@@] BakeInPlace ... cleaning sub process list ');
                spObj.tEndWatchDog = Date.now();

                res.end('# ----- DONE');
                waitForEndInter = -1;

                

            }else{
                cl2(res, '# [@@] ping client[ '+clientOnline+' ] sp [ '+spObj.status+' ] ('+this.spList.length+')');
            }

        },15000);

        
        req.on('close',e=>{
            this.cl('\n\n['+runNo+'][##] http client left close\n'+
                '# TODO vClients ... ')
                ;
            clientOnline = 0;
            vClientsOnline = false;


        });
        req.on('error',e=>{
            this.cl('\n\n['+runNo+'][##] http client left error');
        });


    }


    


    




    async doIt( req, res ){


        let bUrl = String(req.originalUrl).substring( this.url.length+1 );
        let sapi = bUrl.split("/");

        // / key / x / y / z
        if( sapi.length ==  4 ){
            res.end('4');
            return 0;
        
        
        
        
        // intux  / /apis/oven/intux
        }else if( sapi.length >=  1 && sapi[0] == 'intux' ){
            console.log('client at intux');
            res.writeHead(200,{
                'Content-Type': 'text/html'
                
            });
            
            let adressURLhref = this.url+'/'+sapi.join('/');
            let screen = ['<html><body><pre># intux ... raw',`# adressURL:  [ ${sapi.join(' / ')} ]`, '#','## Menu'];
            let rMenu = [
                'exit', ()=>{ return 'quit / exit'; },
                'say hello', ()=>{ return 'hello world'; },
            ];

            for( let li=0,lc=rMenu.length; li<lc; li+=2 ){
                screen.push( `<a href="${adressURLhref}/${rMenu[ li ]}">${(li/2)+1} - ${ rMenu[ li ] }</a>` );
                

            }

            screen.push('\n---\n'+JSON.stringify(this.ovenCurrent,null,4));


            screen.push('</pre></body></html>');

            res.end( screen.join('\n')+'\n' );


            return 0;









        // http://localhost:8080/apis/oven/dir/xxxx
        // to get list of current home dir CookBooks ~/.viteyss/oven
        }else if( sapi.length >=  1 && sapi[0].startsWith('dir') && sapi[0] != 'dirUpdate'  ){
            writeHeadChunke( res );
            res.end( JSON.stringify( this.dir )+'\n');
            return 0;






        // http://localhost:8080/apis/oven/dirUpdate
        // to update current home dir CookBooks ~/.viteyss/oven from fs
        }else if( sapi.length >=  1 && sapi[0] == 'dirUpdate'  ){
            writeHeadChunke( res );
            let tStart = Date.now();
            let si = 0;
            let nAdressUrl = sapi.filter( se => si++ != 0 ).join('/');

            if( sapi.length > 1 ){
                nAdressUrl = '/'+nAdressUrl;
                console.log('[oven] have more? nAdressUrl: [ '+nAdressUrl+' ]  sapi ',sapi);
            }
            
            this.updateDirWith(nAdressUrl, ovenDirToObj( this.homePath,  __dirname, nAdressUrl ) );
            
            //this.readHomeCookBook();
            //this.dir['tRebuildHomeCookBook'] = Date.now() - tStart;
            //res.write( JSON.stringify( this.dir ) );
            res.end( JSON.stringify( this.dir )+'\n');
            console.log('[oven] -> dirUpdate - CookBook in '+( (Date.now() - tStart)/1000 )+' sec.');
            return 0;


        // http://localhost:8080/apis/oven/QTaskList
        }else if( sapi.length ==  1 && sapi[0] == 'QTaskList' ){
            writeHeadChunke( res );
            res.end( JSON.stringify( this.spList )+'\n' );
            return 0;

        

        // http://localhost:8080/apis/oven/splog0
        // to get spList [ no ].log        
        }else if( sapi.length ==  1 && sapi[0].startsWith( 'splog' ) ){
            let spNo = parseInt( sapi[ 0 ].substring(5) );
            writeHeadChunke( res );
            res.write( JSON.stringify({
                stdout: this.spList[ spNo ].stdout,
                stderr: this.spList[ spNo ].stderr
            }) );
            res.end('\n');
            return 0;
            

        // http://localhost:8080/apis/oven/cmd0/i%C3%87
        }else if( sapi.length ==  2 && sapi[0].startsWith('cmd') ){
            let cmdToDo = `${sapi[1]}`;
            console.log('[sp]Doit cmd got: ['+cmdToDo+']');

            if( cmdToDo.startsWith('b64:') ){
                console.log(`[sp] command as base64 ...`);
                cmdToDo = decodeURIComponent( atob( cmdToDo.substring(4) ) );
            }


            //console.log('stop for now');
            //process.exit( 3 );


            this.startBeaking( req, res,  cmdToDo);
            return 0;


        //  / bakeInPlace / base64PathToFile
        }else if( sapi.length ==  2 && sapi[0] == 'bakeInPlace' ){
            let cmd = 'echo "ok ready";sleep 1; echo "doing it ...."; sleep 1; echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date; echo "doing it ...."; sleep 1; echo "cmd in bash DONE"; '
             this.startBeaking( req, res,  cmd);
            return 0;
        
        } 
           
       
    }

   
   
    
    
    
    
    
    
    
    /// old 
    
    
    
    
    
    
    
}

export { serveroven }
