<template >
<div class="smallBt">


Working: {{ oven.working  }}

<OvGroup v-if="0"
    gtitle="abc gTitle test"
    > 
    abc <b>html</b>
</OvGroup>


<OvGroup
    gtitle="Exec on local" >

    <button 
        title="Home - Disk Space information"
        @click="onOvenCompact( 'disk space' )"><i class="fa-regular fa-hard-drive"></i></button>
    
    |
    
    <span title="cpu's on off cores">
        <i class="fa-solid fa-microchip"></i>
            [
            <input type="checkbox" value="0" checked 
                @change="console.log('click'+$event.target.checked);
                    onCmdStrTocmdResConole( $event.target.checked ? 
                        'sudo /home/yoyo/bin/cpusOff.sh 1' : 
                        'sudo /home/yoyo/bin/cpusOff.sh 0'
                        );
                    " 
                />
            | 
            <a @click="onCmdStrTocmdResConole( `sudo /home/yoyo/bin/cpusOff.sh 0` )">0</a> |
            <a @click="onCmdStrTocmdResConole( `sudo /home/yoyo/bin/cpusOff.sh 1` )">1</a>]
    </span> 
    
    |
    
    
    
    
</OvGroup>

<OvGroup
    gtitle="Tools - dev 1" >

    <button 
        title="subscribe to all topics at mqtt"
        @click="makeHook( 'mqtt', '#', 'all topics', 'raw', 'widget' )"># all topiks</button> 
    
    |

    <a @click="onDoFetch( '/apis/oven/bakeInPlace/L2hvbWUveW95by9BcHBzL3ZpdGV5c3Mtc2l0ZS0ycWVzdC9vdmVuL2luUGxhY2UyXzI2MDExN3R0MTY1OTM0LjJxZXN0')">
        start tast</a>
    | 
    <a @click="onCmdPredefined()">
        st</a> 
</OvGroup>


<OvGroup
    gtitle="Subscribe" >
    
    <button 
        title="e01Mux time left to switch ..."
        @click="onOvenCompact( 'e01Mux_left' )">e01Mux left</button> 
    
    |

    <button 
        title="Home percent battery status"
        @click="onOvenCompact( 'home_perc' )">home battery</button> 
    
    
    
</OvGroup>
    


<OvGroup
    gtitle="Exec about host" >
    
    |
    
    <a @click="onQeryTasksNow()">
        QTaskList</a>
        
    | 
    
    <a 
        title="ps [ PID's ] of subprocess on host"
        @click="onCmdStrTocmdResConole( `ps ${oven.data.flatMap( d => d.sp.pid ).join(' ')}` )">
        ?</a> 
    |
    
    
    
    
    
</OvGroup>


    
<OvGroup
    gtitle="QTaskList - results"
    >
    
    <div v-if="oven.tUpdate == undefined">* need to Qeory server</div>
    <div v-if="oven.tUpdate != undefined">
        <OvGroup
            gtitle="#### fast - status">            
            <pre>{{ new Date(oven.tUpdate) }}
tasks total:    [ {{ oven.data.length }} ] running [ {{ oven.data.filter( sp => sp.tEnd == undefined ).length }} ]
errCode:        [ {{ oven.data.filter( sp => sp.exitCode != 0 ).length }} ]
pennding now:</pre>
        </OvGroup>

    </div>

    
    
    <div v-if="oven.data == undefined">not loaded ...</div>
    
    <div v-else v-for="spi,sNo in oven.data.filter( spi => spi.tEnd == undefined )">
        [TODOisRunningNow] | 
        [<a 
            @click="oven_onSendKill( spi.sp.pid, 'KILL' )"
            title="kill process"
            >k</a>] 
        [<a 
            @click="oven_onSendKill( spi.sp.pid, 'STOP' )"
            title="pause"
            >p</a>]
        [<a 
            @click="oven_onSendKill( spi.sp.pid, 'CONT' )"
            title="resume if pause"
            >r</a>]
        [<a 
            title="set low nice"
            >n-</a>] 
        [<a 
            title="set high nice"
            >n+</a>]
        |
        [{{ spi.runNo }}] pid: [{{spi.sp.pid }}]
        |

        {{ parseInt(Date.now()- spi.tStart)/1000.00 }} sec.
        |
        {{ spi.ident }}
        <small>{{spi.sp.spawnargs[2]}}</small>
    </div>
</OvGroup>


   

<OvGroup
    gtitle="Cmd - results"
    >
    <div v-for="res,resNo in oven.results"
        :style="'border:1px solid green;'"
        >[{{ res.id }}]
        <small>#   {{ res.data.res.join('\n#\t') }}</small>

    </div>

</OvGroup> 
<OvGroup
    gtitle="cmd:"
    >
    <input type="text" @change="onChangeInput_toCmd"></input>
    <select @change="onChangeInput_toCmd">
        <option v-for="cmdH,cmdI in oven.cmdHistory"
            :value="cmdH"
            >
            [ {{ cmdI }} ]: {{ cmdH }}
        </option>
    
    
    </select>
</OvGroup>





<div>status ... over</div>
<div>---</div>


<OvGroup
    gtitle="### Selector">

    protocal:<!-- <br></br>
    <input type="text" v-model="selectonNow.mediumProtocal"></input>-->
    <select v-model="selectonNow.mediumProtocal">
        <option v-for="procal,pci in oven.opts.mediumProtocal" :value="procal">
            [ {{ pci}} ]: {{ procal }}
        </option>
    </select>    
    <br></br>

    topic adres:<br></br>
    <input type="text" v-model="selectonNow.topicAddress"></input><br></br>

    title:<br></br>
    <input type="text" v-model="selectonNow.title"></input><br></br>

    type of value:<!--<br></br>
    <input type="text" v-model="selectonNow.valType"></input>-->
    <select v-model="selectonNow.valType">
        <option v-for="valtyp,vti in oven.opts.valType" :value="valtyp">
            [ {{ vti }} ]: {{ valtyp }}
        </option>
    </select><br></br>

    msg wrapper:<!--<br></br>
    <input type="text" v-model="selectonNow.wrapType"></input>-->
    <select v-model="selectonNow.wrapType">
        <option v-for="wratyp, wti in oven.opts.wrapType" :value="wratyp">
            [ {{ wti }} ]: {{ wratyp }}
        </option>
    </select><br></br>

    live sesion:<br></br>
    <input type="checkbox" v-model="selectonNow.liveSes"></input><br></br>

    <button @click="onProbeSelector()">probe selector</button><hr></hr>

</OvGroup>




widgets:
<div v-for="w, wIn in oven.widgets.reverse()" >
    widget{{ wIn }}---
    <div v-html="w"></div>
</div>



</div>
</template>


<script>

console.log('[oven] inclide. ...');
import { msToDurationString } from '/libs/libsForTime.js';
import ovGroup from './ovGroup.vue';

export default{
components:{
    'OvGroup': ovGroup
},
mounted(){
    setTimeout(()=>{

    },500);
    console.log('[oven] mounted. ...');
},
unmounted(){
    console.log('[oven] unmounted. ...');
},
data(){   

    return {

        selectonNow:{
            mediumProtocal:'mqtt', 
            topicAddress:"e01Mux/#", 
            title: 'test e01#', 
            valType: 'raw',
            wrapType: 'toast',
            liveSes: true,
        },

        oven:{
            working: true,
            tUpdate: undefined,
            data: undefined,
            results:[],
            isWatching: false,
            watchingIter: -1,
            
            cmdHistory: [],
            
            opts:{
                mediumProtocal: [ 'mqtt', 
                    'bash' ], 
                topicAddress: [], 
                title: [], 
                valType: [ 'raw', 'secLeft', 'percent' ],
                wrapType: [ 'toast', 'widget', 
                    'log' ],
                liveSes: [ true, false ],
            },
            
            widgets:[
                
            ],
            
        },
        
    
    };
},

methods:{

    // oven start

    onDoFetch( url, onCB = { onChunk: undefined, onReady: undefined } ){
        //setTimeout(()=>this.chkWatcher(),500);       
       
        async function readAllChunks(readableStream) {
            const reader = readableStream.getReader();
            const chunks = [];
            
            let done, value;
            while (!done) {
                ({ value, done } = await reader.read());
                if (done) {
                    //console.log('[oven] res final all ... ');
                    return chunks;
                }
                let chunkStr = new TextDecoder().decode( value );
                chunks.push( chunkStr );
                //console.log('[oven] res 3 chunk,', chunkStr);

                if( 'onChunk' in onCB && onCB.onChunk != undefined )
                    onCB.onChunk( chunkStr );
            }
        };
        let onCBt = onCB;
        return fetch( url )
            .then( res => {
                let resStream = readAllChunks( res.body );
                //console.log('[oven] res 20', resStream );
                resStream.then( r => { 
                     if( 'onReady' in onCBt && onCBt.onReady != undefined )
                        onCBt.onReady( r ) 
                } );                

                //console.log('[oven] res 2',res);
            })
            .catch(e=>{
                console.log('[oven] error 2',e);
            });
        
    },
    oven_onSendKill( pid, sigNal ){
        console.log('[oven] cmd0 sendKill to pid: [ '+pid+' ] [ '+sigNal+' ] ' );
        this.onDoFetch( '/apis/oven/cmd0/b64:'+btoa(`echo 'Will send kill signall ';/bin/kill -${sigNal} ${pid}`),{
            'onReady':(r)=>{
                let cmdRes = this.cunksResult_resultObject( r );
                console.log('[oven] cmd0 sendKill DONE',cmdRes );
                this.onQeryTasksNow();
                }
        });
    },








    cunksResult_resultObject( lines ){
        
        let tr = {
            runNo: -1,
            lines: [],
            linesC: -1,
            res: [],
            exitCode:undefined,

        };
        
        if( lines.length > 0  ){
            lines.findIndex( l => {
                if( l.indexOf('#  runNo:        [ ') != -1 ){
                    let lTmp = l.split('#  runNo:        [ ')[1];
                    tr.runNo = lTmp.split(' ]')[0];
                    return true;

                }
            });
            tr.runNo = lines[0].substring( 1 ).split(']')[0];
        }


        let lis = [];
        let spDataStart = 0;
        let lNo = 0;
        let templateSpData = `[${tr.runNo}][sp][data] ... `;
        for( let line of lines ){
            line.split('\n').forEach(l => {

                if( l != templateSpData && l != '' ){

                    lis.push ( l );
                    
                    if( l.endsWith('# GOGO ... #') )
                    spDataStart = lNo;
                
                    lNo++
                }   
            });            
        }
        tr.lines = lis;
        let linesC = lis.length;
        tr.linesC = linesC;

        let templateP = `[${tr.runNo}]   `;
        let tepmlateS = `[${tr.runNo}][sp][data] ... `;
        if( linesC > 5 && lis[ linesC - 1 ] == '# ----- DONE'){
            tr.exitCode = lis[ linesC - 2 ].split(',')[1];

            let spDataEnd = linesC - 2;
            let prefLen = templateP.length;
            for( let li=spDataStart+1; li<spDataEnd; li++ )
                if( lis[ li ] != tepmlateS){
                    console.log('insert - '+lis[ li ]);
                    tr.res.push( lis[ li ].substring( prefLen ) );
                }

        }


        this.oven.results.push( {id:tr.runNo, data: tr} );

        return tr;
    },


    onChangeInput_toCmd( ev ){
        let cmdStr = `${ev.target.value}`;
        
        //if( this.oven.cmdHistory.findIndex( ch => ch == cmdStr ) == -1 )
            this.oven.cmdHistory.push( cmdStr );
        
        console.log('[oven] got cmd: ', cmdStr );
        this.onCmdStrTocmdResConole( `${cmdStr}` );
        ev.target.value = '';
    },

    

    onQeryTasksNow(){

        // this.onDoFetch( '/apis/oven/bakeInPlace/L2hvbWUveW95by9BcHBzL3ZpdGV5c3Mtc2l0ZS0ycWVzdC9vdmVuL2luUGxhY2UyXzI2MDExN3R0MTY1OTM0LjJxZXN0' 
        this.onDoFetch( '/apis/oven/QTaskList',{
            'onReady':(r)=>{
                let j = JSON.parse( r );
                console.log('[oven] QTaskList result .... ',
                    //JSON.stringify( j ,null,4)
                );
                this.oven.tUpdate = Date.now();
                this.oven.data = j;

                } 
            });

    },


    msgWrapInToast( msg ){
        $.toast( msg );
    },

    msgWrapInWidget( msg ){
        this.oven.widgets.push( msg );
    },

    msgWrapInType( msg, wrapType ){
        if( wrapType == 'toast' ){
            this.msgWrapInToast( msg );
        }else if( wrapType == 'widget' ){
            this.msgWrapInWidget( msg );

        }else{
            console.log('[oven] ee make hook msg wraper nan ',wrapType);
            return 1;
        }
    },

    dataWrapType( title, data, valType ){
        if( valType == 'secLeft' ){
                return msToDurationString( data )+' sec.';

        }else if( valType == 'percent' ){
                let divName = 'ooccPerc'+Date.now();
                setTimeout(()=>{ 
                    new JustGage({
                        id: divName,
                        value: data,
                        min: 0,
                        max: 100,
                        title: title,
                        donut: true
                        });

                },200);
                return `<div id="${divName}"></div>`;
                    //afterShown: function () {
                        

        }else{
                console.log('EE dataWrapType Nan ',valType);
        }
    },


    makeMqttHook(topicAddress, title, valType ){
        return this.makeHook( 'mqtt', topicAddress, title, valType, 'toast' );
        //return this.makeHook( 'mqtt', topicAddress, title, valType, 'widget' );
    },

    onProbeSelector(){
        let postProcessCmd = this.makeHook( 
            this.selectonNow.mediumProtocal, 
            this.selectonNow.topicAddress, 
            this.selectonNow.title, 
            this.selectonNow.valType, 
            this.selectonNow.wrapType
        );

         
        this.onOvenCompact_full( 'nooo custom', 
            postProcessCmd.cmd, 
            postProcessCmd.postProcess, 
            this.selectonNow.liveSes 
        );
    },

    makeHook( mediumProtocal, topicAddress, title, valType, wrapType ){
        
        let cmd = undefined;
        //let msg = undefined;
        let mRes = undefined;

        if( mediumProtocal == 'mqtt' )
            cmd = `mosquitto_sub -t '${topicAddress}' -h 'hu' -p 10883 -V mqttv311`;
        else{
            console.log('EE NAN medium protocal ',mediumProtocal);
            return 1;
        }


        let postProcess = ( chunkNo, res ) => {
            if( valType == 'raw' && res != undefined ){
                this.msgWrapInType( `${title}: ( raw ): ${res}`, wrapType );
                
            }else if( valType == 'secLeft' ){
                mRes = parseInt(res.split(']')[1]);
                this.msgWrapInType( 
                    `${title}: ( sec left )<br>${ this.dataWrapType( '', mRes, valType ) }`, wrapType );
        
            }else if( valType == 'percent' ){
                mRes = parseInt(res.split(']')[1]);
                this.msgWrapInType( `${title}: ( percent )<br>${ this.dataWrapType( '', mRes, valType ) }`, wrapType  );
                /*{
                    text:`<div id="${divName}"></div>`,
                    afterShown: function () {
                        new JustGage({
                            id: divName,
                            value: mRes,
                            min: 0,
                            max: 100,
                            title: title,
                            donut: true
                            });
                    }
                });*/


            }else {
                console.log('EE 5678987 valType not supported ',valType);
            }
        };

        

        return {postProcess, cmd};
    },











    /** from string to ready predefine something */
    onOvenCompact( compactName = 'disk space'){
        this.onOvenCompact_full( compactName );
    },


    onOvenCompact_full( compactName = 'disk space', ownCmd = undefined, ownPost = undefined, ownLive = false ){

        let cmd = undefined;
        let liveSes = undefined;
        let postProcess = undefined;
        
        let tStart = Date.now();
        let tDelta = undefined;


        if( ownCmd != undefined ){
            cmd = ownCmd;
            postProcess = ownPost;
            liveSes = ownLive;

        }else if( compactName == 'e01Mux_left' ){
            //cmd = `mosquitto_sub -t 'e01Mux/left' -h 'hu' -p 10883 -V mqttv311`;
            liveSes = true;
            let postProcessCmd = this.makeMqttHook( 'e01Mux/left', 'e01Mux - left', 'secLeft' );
            cmd = postProcessCmd.cmd;
            postProcess = postProcessCmd.postProcess;
        
        } else if( compactName == 'home_perc' ){
            //cmd = `mosquitto_sub -t 'e01Mux/left' -h 'hu' -p 10883 -V mqttv311`;
            liveSes = true;
            let postProcessCmd = this.makeMqttHook( 'e01MuxFix/homeBatPerc', 'Home battery - in percents', 'percent' );
            cmd = postProcessCmd.cmd;
            postProcess = postProcessCmd.postProcess;

            
            //let divName = 'abcLeft'+Date.now();
            //postProcess = ( chunkNo, res ) => {
            //    let mRes = parseInt(res.split(']')[1]);
            //    $.toast({
            //        text:`[${chunkNo}] e01Mux - left: <br><br>${ msToDurationString( mRes ) } sec.<br>`,
            //    });
            //}

        }else if( compactName == 'disk space' ){
            cmd = `df -h $HOME`;
            liveSes = false;
            let divName = 'abc'+Date.now();
            postProcess = ( res ) => {
                console.log('[oven]-diskSpace ',res);
                let rWords = res[1].split(' ');
                let percInd = rWords.findIndex(o => o.endsWith('%') );
                let percIs = parseInt( rWords[ percInd ].replaceAll('%',''));
                let gigW = rWords.filter( w => w.length > 2 );
                let gigAvail =  gigW[ 3 ];
                $.toast({
                    text:`Disk space at home: <br><br>${res[1]}<br><div id="${divName}"></div>`,
                    afterShown: function () {
                        let justGage2 = new JustGage({
                            id: divName,
                            value: percIs,
                            min: 0,
                            max: 100,
                            title: 'Home left: '+gigAvail,
                            donut: true
                            });
                    }
                });
                
               
            }
        }



        if( cmd != undefined && liveSes == false ){
            this.onDoFetch( '/apis/oven/cmd0/b64:'+btoa(`${cmd}`),{
                'onReady':(r)=>{
                    let cmdRes = this.cunksResult_resultObject( r );
                    console.log('[oven] onOvenCompact DONE',cmdRes.res );
                    //this.onQeryTasksNow();
                    if( postProcess != undefined ){
                        postProcess( cmdRes.res );
                    }
                    tDelta = ( (Date.now() - tStart) /1000 );
                    console.log('[oven] onOvenCompact ... loop in '+tDelta +' sec.');
                }
            });

        }else if( cmd != undefined && liveSes == true ){
            let chunkNo = 0
            this.onDoFetch( '/apis/oven/cmd0/b64:'+btoa(`${cmd}`),{
                'onChunk':(r)=>{
                    console.log('[oven] onOvenCompactChunk  ... ( '+chunkNo+' ) ['+r+']' );
                    //this.onQeryTasksNow();
                    

                    if( postProcess != undefined && r.lastIndexOf('][sp][data] ...') != -1 ){
                        let tLinst = r.split('\n');
                        let resOk = [];
                        tLinst.filter( l => {
                            if( l.lastIndexOf('][sp][data] ...') == -1 &&
                                l.lastIndexOf(']# [@@] ping client[ ') == -1 &&
                                l.lastIndexOf('   # GOGO ... #') == -1
                            )
                                resOk.push( l );
                        } );
                        postProcess( chunkNo, resOk.join('\n') );
                    }else if( postProcess != undefined && r.lastIndexOf(']# [@@] ping client[ ') == -1 ){
                        postProcess( chunkNo, r );
                        }
                    chunkNo++;
                    
                }
            });

        }else {
            TODO
        }


    },

    onCmdStrTocmdResConole( cmd ){
        this.onDoFetch( '/apis/oven/cmd0/b64:'+btoa(cmd),{
            'onReady':(r)=>{
                //console.log('[oven] cmd0 finally .... ',r );
                let cmdRes = this.cunksResult_resultObject( r );
                console.log('[oven1] cmd0 res .... ',JSON.stringify(cmdRes,null,4) );
                

                },
            'onChunk':(r)=>{
                console.log('[oven1] cmd0 chunk  .... ',r);
                } 
            });
            
    },






    onCmdPredefined(){
        this.onDoFetch( '/apis/oven/bakeInPlace/L2hvbWUveW95by9BcHBzL3ZpdGV5c3Mtc2l0ZS0ycWVzdC9vdmVuL2luUGxhY2UyXzI2MDExN3R0MTY1OTM0LjJxZXN0',{
            'onReady':(r)=>{
                console.log('[oven2] qery tast now result .... ',
                   r
                );

                },
            'onChunk':(r)=>{
                console.log('[oven2]chunk qery tast now result .... ',
                    r
                );

                } 
            });
            
    },




        /*
    chkWatcher(){        
        if( this.oven.watchingIter == -1 ){
            //isWatching: false,
            //watchingIter: -1
            this.oven.watchingIter = setInterval(()=>{
                let killInter = false;
                let pendinng = this.oven.data.filter( spi => spi.tEnd == undefined );
                console.log('[over][watcher] .... ',pendinng.length);
                if( this.oven.data == undefined ){
                    killInter = true;
                }else{
                    
                    if( pendinng.length == 0 ){
                        killInter = true;
                        console.log('[over][watcher] .... kill it it\' done');
                    }else{
                        console.log('[over][watcher] working ... ',pendinng);
                    }
                }
                    
                    
                if( killInter ){
                    clearInterval( this.oven.watchingIter );
                    this.oven.watchingIter = -1;
                }else{
                    this.onQeryTasksNow();

                }

            },1000);

        }else{

        }
    },
    */



    // oven end 

}

    
}

</script>

