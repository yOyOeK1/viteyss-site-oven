import { spawn } from 'node:child_process';
import {dirname} from 'node:path'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';  
import { cl2, chkCasheDir, ovenDirEmpty, ovenLayoutToObjectFromJson } from './libs/ovenHelper.js';

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
        this.ovedDir = chkCasheDir( undefined, this.homePath );
        this.ovedCurrent = this.ovenDirToObj(this.ovedDir );

        debugger
        this.spList = [];

        //this.mapleafletPath = '/home/iloo/Projects/ilooViteYss/sharelibs/viteyss-site-mapleaflet';
        //this.mapleafletPath = '/home/yoyo/Apps/viteyss-site-mapleaflet';
        
        
    }
    
    cl( str ){
        console.log(` apioven     ${this.method}  ${this.url}     `,str);
    }



    ovenDirToObj( dirList, pathBase = undefined ){
        if( pathBase == undefined)
            pathBase = this.homePath;
        
        if( dirList.length == 0 ){
            ovenDirEmpty( this.envMy.dirname ); // adres to src of over for defs
            this.ovedDir = chkCasheDir( undefined, this.homePath );
            dirList = this.ovedDir;
        }

        let layoutR = dirList.findIndex( fName => fName == '0_layout.js' );
        let layoutName = layoutR == -1 ? {} : JSON.parse( fs.readFileSync( path.join( pathBase, '0_layout.js' ) ).toString() );

        let ovenObj = {
            'layout': ovenLayoutToObjectFromJson( layoutName, pathBase ),
            pathBase,
            baseAddres: pathBase.substring( this.homePath.length )
        }; 


        return ovenObj;
    }

    
    
   


    linesToAppendArray( res, lines, arrayTo ){
        for( let line of `${lines}`.split('\n') ){
            arrayTo.push( line );
            cl2(res,   '   '+line );
        }
        
        return arrayTo;
    }


    startBeaking=( req, res, cmdToDo )=>{        
        this.runNo++;
        let runNo = `${this.runNo}`;
        res['runNo'] = runNo;
        let clientOnline = 1;        
        this.writeHeadChunke( res );
        
        let waitForEndInter = -1;
        let waitForEnd = true;
        let cDir = chkCasheDir( res, this.casheFolder );
        let semaforPath = `${this.casheFolder}/${Date.now()}_status_`;
        let extOk = true;
        
        cl2(res, [
            ` viteyss-site-oven / ${this.url} ... `,
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

        let sp = spawn( 'echo "# GOGO ... #";'+cmdToDo, { shell: true } );
        //let sp = spawn( 'echo "# GOGO ... #"; sh -s <<EOF\n '+cmdToDo+' \nEOF\n', { shell: true } );
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
        };
        this.spList.push( spObj );
        //spStatus = 'running ...';
        

        sp.stdout.on( 'data', d =>{
            cl2(res,           '[sp][data] ... ');
            spObj.stdout = this.linesToAppendArray( res, d, spObj.stdout );
           
        });

        sp.stderr.on( 'data', d =>{
            cl2(res, '[sp][err] ... ');
            spObj.stderr = this.linesToAppendArray( res, d, spObj.stderr );
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
            this.cl('\n\n['+runNo+'][##] http client left close');
            clientOnline = 0;

        });
        req.on('error',e=>{
            this.cl('\n\n['+runNo+'][##] http client left error');
        });


    }






    


    writeHeadChunke(res){
        res.writeHead(200,{
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
            'Content-Length':'1042141',
            'Connection': 'keep-alive',
        });

    }


    async doIt( req, res ){


        let bUrl = String(req.originalUrl).substring( this.url.length+1 );
        let sapi = bUrl.split("/");

        // / key / x / y / z
        if( sapi.length ==  4 ){
            res.end('4');
        
        // http://localhost:8080/apis/oven/QTaskList
        }else if( sapi.length ==  1 && sapi[0] == 'QTaskList' ){
            this.writeHeadChunke( res );
            res.write( JSON.stringify(
                this.spList
            ) );
            res.end('\n');
            return 0;
        
        // http://localhost:8080/apis/oven/splog0
        // to get spList [ no ].log
        
        }else if( sapi.length ==  1 && sapi[0].startsWith( 'splog' ) ){
            let spNo = parseInt( sapi[ 0 ].substring(5) );
            this.writeHeadChunke( res );
            res.write( JSON.stringify(
                this.spList[ spNo ].log
            ) );
            res.end('\n');
            return 0;
            

        // http://localhost:8080/apis/oven/cmd0/i%C3%87
        }else if( sapi.length ==  2 && sapi[0].startsWith('cmd') ){
            let cmdToDo = `${sapi[1]}`;
            console.log('[sp]Doit cmd got: ['+cmdToDo+']');

            if( cmdToDo.startsWith('b64:') ){
                console.log(`[sp] command as base64 ...`);
                cmdToDo = atob( cmdToDo.substring(4) );
            }

            this.startBeaking( req, res,  cmdToDo);
            return 0;


        //  / bakeInPlace / base64PathToFile
        }else if( sapi.length ==  2 && sapi[0] == 'bakeInPlace' ){
            let cmd = 'echo "ok ready";sleep 1; echo "doing it ...."; sleep 1; echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date; echo "doing it ...."; sleep 1; echo "cmd in bash DONE"; '
             this.startBeaking( req, res,  cmd);
            return 0;
        
        } 
           
       
    }

   
    handleRequest( args ){
        let {req, res, server } = args;

        if( String(req.url).startsWith(this.url) ){
            this.server = server;
            return this.doIt( req,res );

        }



    }
    
    
    
    
    
    
    
    /// old 
        startBeaking_old=( req, res, cmdToDo )=>{        
        this.runNo++;
        let runNo = `${this.runNo}`;
        res['runNo'] = runNo;
        let clientOnline = 1;        
        this.writeHeadChunke( res );
/*
       

        // echo -n '/home/yoyo/Apps/viteyss-site-oven/oven/inPlace2_260117tt165934.oven' | base64
        // L2hvbWUveW95by9BcHBzL3ZpdGV5c3Mtc2l0ZS0ycWVzdC9vdmVuL2luUGxhY2UyXzI2MDExN3R0MTY1OTM0LjJxZXN0
        // http://localhost:8080/apis/oven/bakeInPlace/L2hvbWUveW95by9BcHBzL3ZpdGV5c3Mtc2l0ZS0ycWVzdC9vdmVuL2luUGxhY2UyXzI2MDExN3R0MTY1OTM0LjJxZXN0

        
        
        //debugger
        let cmd = ['echo -n "# "`date`"\n";',
            `echo "# [i] Hello from api_oven terminal agent ..";`,
            'echo "# pwd:   [`pwd`]";',
            `echo "# Will performe automatic sequence to make from .oven to  _Ready in place.";`,
            `echo "# ... start in 5 sec";`,
            `sleep .15;`,
            `echo "GOGOGO from sh layer ....";pwd;`,
            `echo "# * will convert .oven to .sh ...";

mkpLog=\`mktemp\`

cd ${this.envMy.dirnameProcess}
node ./runItSelector.js --site=oven --convertToSh=1 --files="${fPath}" >> "$mkpLog"
exitC="$?"
echo "# [d] Exit convert with code: [ ""$exitC"" ]"                
if test "$exitC" = "11";then
echo "# * echo convert OK in log file [ $mkpLog ]"
shFilePath=\`cat "$mkpLog" | grep "target sh file " | awk '{print $6}' \`
echo "# * sh file path  ...  [ $shFilePath ]"
if test -e "$shFilePath";then
    echo "# * make it executable ..."
    chmod +x "$shFilePath"
    cd \`dirname "$shFilePath"\`
    pwd
    echo "run in ... 5""exec \`basename "$shFilePath"\`"
    sleep 5
    exec \`basename "$shFilePath"\`

else
    echo "#EE * no sh file in target place "
fi

else
echo "#EE * convert error exit 9"

fi                
            `,
            `echo "# Done _______________"\`date\`;exec bash`].join('\n');
            
            //date;sleep 5;df -h;date;sleep 5;df -h;date;sleep 5;df -h;echo 'done';`;
            //cmd = `gnome-terminal -- bash -c "${cmd}"`;
            cmd = 'echo "ok ready";sleep 1; echo "doing it ...."; sleep 1; echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date;echo "doing it ...."; sleep 1;date; echo "doing it ...."; sleep 1; echo "cmd in bash DONE"; '
            */
        //cmd = `gnome-terminal --wait -- bash -c '${cmd}'`;
        let cmd = `cmdToDo='${cmdToDo}';echo "# will make cmdToDo"; echo "# [ $cmdToDo ] "; echo "# ... in 5 sec\n. . .\n";sleep .5;echo "# GOGOGO ..."; $cmdToDo && exitCodeCmd="$?"&& echo "1 Main cmd bash exitWith: [ $exitCodeCmd ]" || exitCodeCmd="$?"&& echo "2Main cmd bash exitWith: [ $exitCodeCmd ]";`;
        let waitForEndInter = -1;
        let waitForEnd = true;
        let cDir = chkCasheDir( res, this.casheFolder );
        let semaforPath = `${this.casheFolder}/${Date.now()}_status_`;
        //let spStatus = '';
        //let cDir = chkCasheDir( res, dirname );
        let extOk = true;
        
        cl2(res, [
            ` viteyss-site-oven / ${this.url} ... `,
            '',
            ' will exec?    [ '+extOk+' ]',
            ' cmd to run: ',
            '               [ '+cmdToDo+' ]',
            ' runNo:        [ '+runNo+' ]',
            ' semafor path: [ '+semaforPath+ ' ]',
            ' entry date:   [ '+Date.now()+' ]',
            '',
            '',
            ' Plan is to run it in place if all good',
            ' ... will start in 5 sec.'
            ].join('\n# ')
        );
        
        if( extOk == false ){
            cl2(res,'No start extension not ok !! EXIT;');

            return 0;

        }

        let sp = spawn( 'echo "# GOGO ... #";'+cmdToDo, { shell: true } );
        let spObj = {
            ident: semaforPath,
            'sp': sp,
            'runNo': runNo,
            'status' : 'running ...',
            'tEnd': undefined,
            'tStart': Date.now(),
            'exitCode': undefined,
            'log': [],
        };
        this.spList.push( spObj );
        //spStatus = 'running ...';
        

        sp.stdout.on( 'data', d =>{
            cl2(res,           '[sp][data] ... ');
            for( let line of `${d}`.split('\n') ){
                if( line != '' ){
                    //cl2(res,   '           \x1b[2m'+line+'\x1b[0m' );
                    cl2(res,   '   '+line );
                    //logCmd.push( line );
                    spObj.log.push( line );
                }
            }

        });

        sp.stderr.on( 'data', d =>{
            cl2(res, '[sp][err]: '+d);
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
                spObj.tEnd = Date.now();

                res.end('# ----- DONE');
                waitForEndInter = -1;

                

            }else{
                cl2(res, '# [@@] ping client[ '+clientOnline+' ] sp [ '+spObj.status+' ] ('+this.spList.length+')');
            }

        },15000);

        
        req.on('close',e=>{
            this.cl('\n\n['+runNo+'][##] http client left close');
            clientOnline = 0;

        });
        req.on('error',e=>{
            this.cl('\n\n['+runNo+'][##] http client left error');
        });


    }


    // --- end old 
    
    
    
    
    
    
    
    
    
    
}

export { serveroven }
