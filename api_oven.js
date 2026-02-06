import { spawn } from 'node:child_process';

import {dirname} from 'node:path'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';  

import { msgsCODES, writeHeadChunke }  from './libs/ovenHttp.js';
import { cl2, linesToAppendArray, 
    chkCasheDir, ovenDirEmpty, 
    ovenLayoutToObjectFromJson, ovenDirToObj 
    } from './libs/ovenHelper.js';


import { oven } from './libs/ovenMain.js';
import { Beakeary } from './libs/startBeaking.js';


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
        /*
        this.ovenCurrent = undefined;
        this.adressUrl = undefined;
        this.ovenM.dirs = undefined;
        this.readHomeCookBook();
        */
        // remove it --- END
        
        this.ovenM = new oven( 'as1', this.homePath, __dirname );
        this.ovenM.readHomeCookBook_init();
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

    /*
    // remove it 
    readHomeCookBook=()=>{
        this.ovenCurrent = ovenDirToObj( this.homePath, __dirname, '' );
        this.adressUrl = '';
        this.ovenM.dirs = {};
        //this.ovenM.dirs[ this.adressUrl ] = 
        this.updateDirWith( '', this.ovenCurrent );       

    }
    
    // remove it
    updateDirWith=( adressUrl, dirObj )=>{
        this.ovenM.dirs[ adressUrl ] = dirObj;
        console.log('[oven] dir now hawe [ '+Object.keys( this.ovenM.dirs ).join(', ')+' ]');
    }
    */
    


    cl( str ){
        console.log(` apioven     ${this.method}  ${this.url}     `,str);
    }

    




    async doIt( req, res ){


        let bUrl = String(req.originalUrl).substring( this.url.length+1 );
        let sapi = bUrl.split("/");

        // / key / x / y / z
        if( sapi.length ==  4 ){
            res.end('4');
            return 0;
       
        // sh  / /apis/oven/blessedGate
        }else if( sapi.length >=  1 && sapi[0] == 'blessedGate' ){
            res.writeHead(200,{
                'Content-Type': 'text/plain; charset=utf-8',
            });
            //res.write('hi');
            res.end('* abc\n* 1233111\n* xxxxaaa\n');
            return 0;
        
        // sh  / /apis/oven/sh
        }else if( sapi.length >=  1 && sapi[0] == 'sh' ){
            writeHeadChunke( res );
            let shVer = '2601321126';
            let shId = Date.now()%100;
            let shObj = {
                shId,
                req,
                res,
                tStart: Date.now(),
                tEnd: undefined
            };
            
            console.log('[/apis/oven/sh] client .. shId:',shObj.shId);
            let cmds = [
                'clear',
                'echo -n "# shId:[ '+shObj.shId+' ] | @:[ '+bUrl+' ] | "',
                'date',
                'echo "# "',
                'sCols=`tput cols`',
                'mWidth=$(($sCols-20))',
                'sLines=`tput lines`',
                'echo "# Console size: [ $sCols x $sLines ] max width [ $mWidth ]"',
                'dialog --infobox "Hello at api_oven a.k.a. TUI oven\n\t* ver: '+shVer+'" 5 $mWidth',
                'sleep 1',
            ];
            
            res.write( 
                cmds.join('\n')+'\n'
            );
            
            let chunkI = setInterval(()=>{
                res.write( 
                    'date\n'
                );            
            },1000);
            
            setTimeout(()=>{
                clearInterval( chunkI );
                res.end( 
                    'sleep 5; clear;echo "# Exiting"'+'\n'
                );
            }, 5000 );
            
            //return 0;
        
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
            res.end( JSON.stringify( this.ovenM.dirs )+'\n');
            return 0;






        // http://localhost:8080/apis/oven/dirUpdate
        // to update current home dir CookBooks ~/.viteyss/oven from fs
        }else if( sapi.length >=  1 && sapi[0] == 'dirUpdate'  ){
            writeHeadChunke( res );
            let tStart = Date.now();
            let si = 0;
            let nAdressUrl = sapi.filter( se => si++ != 0 ).join('/');

            if( sapi.length > 1 ){
                // TOFIX
                nAdressUrl = '/'+nAdressUrl;
                console.log('[oven] have more? nAdressUrl: [ '+nAdressUrl+' ]  sapi ',sapi);
            }
            
            this.ovenM.updateDirsWith( nAdressUrl, ovenDirToObj( this.homePath,  __dirname, nAdressUrl ) );
            
            //this.readHomeCookBook();
            //this.ovenM.dirs['tRebuildHomeCookBook'] = Date.now() - tStart;
            //res.write( JSON.stringify( this.ovenM.dirs ) );
            res.end( JSON.stringify( this.ovenM.dirs )+'\n');
            console.log('[oven] -> dirUpdate - CookBook in '+( (Date.now() - tStart)/1000 )+' sec.');
            return 0;


        // http://localhost:8080/apis/oven/QTaskList
        }else if( sapi.length ==  1 && sapi[0] == 'QTaskList' ){
            writeHeadChunke( res );
            let spL = this.spList;
            spL.forEach( spi => {
                delete spi.sp['stdin'];
                delete spi.sp['stdout'];
                delete spi.sp['stderr'];
                delete spi.sp['stdio'];
            } );
            res.end( JSON.stringify( spL )+'\n' );
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
            let recipe = undefined;
            
            if( req.method == 'POST' ){
                //"mediumProtocal":"cmd","setENV":[],"topicAddress":"echo \'Pwd: [ \'`pwd`\' ] \';","rName":"Home of script - pwd","valType":"raw","wrapType":"toast","liveSes":false,"intervalEverySec":0,"iterator":-1,"sharedSession":true,"onlyWhenImOnline":false,"chNo":0,"basenameAdressUrl":"oven","sp":{"tStart":0,"tPing":0,"tEnd":0,"exitCode":-1,"statusNow":"","resCount":0,"result":[]},"tStart":1770042886840,"statusNow":"started"
                let hs = req.headers;
                if( 'recipe' in hs ){
                    console.log('[sp] POST cmd0 ... with recipe ! NICE\nrecipe:\n',hs.recipe);
                    recipe = JSON.parse( hs.recipe );
                    
                }

            }            

            if( cmdToDo.startsWith('b64:') ){
                cmdToDo = decodeURIComponent( atob( cmdToDo.substring(4) ) );
                console.log(`[sp] command as base64 ...\n`,cmdToDo,'\n----------------------------END');
            }

            //console.log('stop for now');
            //process.exit( 3 );
            writeHeadChunke( res );

            let beakO = new Beakeary( ++this.runNo, req, res, this.spList, this.vClients );
            let spO = beakO.startBeaking( cmdToDo, recipe );
            if( spO != undefined )
                this.spList.push( spO );


            return 0;


        //  / bakeInPlace / base64PathToFile
        }else if( sapi.length ==  2 && sapi[0] == 'bakeInPlace' ){
            let cmd = 'echo "ok ready";sleep 1; echo "doing it ...."; sleep 1; echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date; echo "doing it ...."; sleep 1; echo "cmd in bash DONE"; '
            writeHeadChunke( res );
            let beakO = new Beakeary( ++this.runNo, req, res, this.spList, this.vClients );
            let spO = beakO.startBeaking( cmd, undefined );
            if( spO != undefined )
                this.spList.push( spO );



            return 0;
        
        } 
           
       
    }

   
   
    
    
    
    
    
    
    
    /// old 
    
    
    
    
    
    
    
}

export { serveroven }
