<template >
Working: {{ oven.working  }} ( {{ oven.runNo }} )
<div class="smallBt" style="color:#000000;">



<OvGroup v-if="0"
    gtitle="abc gTitle test"
    > 
    abc <b>html</b>
</OvGroup>

<OvGroup
    v-if="0"
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
    gtitle="Exec about host" >
    
    |

    <a @click="onQeryOvenDir()">
        QOvenDir</a>

    |

    <a @click="onQeryOvenDirUpdate()"
        title="Query to update home dir CookBook ~/.viteyss/oven">
        QODir</a>
        

    |
    
    <a @click="onQeryTasksNow()">
        QTaskList</a>
        
    |  <a 
        title="ps [ PID's ] of subprocess on host"
        @click="onCmdStrTocmdResConole( `ps ${oven.spList.flatMap( d => d.sp.pid ).join(' ')}` )">
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
tasks total:    [ {{ oven.spList.length }} ] running [ {{ oven.spList.filter( sp => sp.tEnd == undefined ).length }} ]
errCode:        [ {{ oven.spList.filter( sp => sp.exitCode != 0 ).length }} ]
pennding now:</pre>
        </OvGroup>

    </div>

    
    
    <div v-if="oven.spList == undefined">not loaded ...</div>
    
    <div v-else v-for="spi,sNo in oven.spList.filter( spi => spi.tEnd == undefined )">
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
    gtitle="Tools - dev 1" >

    <button 
        title="subscribe to all topics at mqtt"
        @click="makeHook( 'mqtt', '#', 'all topics', 'raw', 'log' )"># all topiks</button> 
    
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
    gtitle="### Oven - Recipes Books">

    <div v-if="oven.dir == undefined">dir data not loaded ...</div>
    <div v-else>
        <OvDir
            :dir="oven.dir" 
            :adressUrl="oven.adressUrl"
            @dir-channel-click="onEmit_dirChannelClick"
            ></OvDir>

    </div>

</OvGroup>




   

<OvGroup
    gtitle="Cmd - results"
    >
    <div v-for="res,resNo in oven.results"
        :style="'border:1px solid green;'"
        >
        <small><pre>[{{ res.id }}]: {{ res.data.res.join('\n#\t') }}</pre></small>

    </div>

</OvGroup> 
<OvGroup
    gtitle="cmd:"
    >
    <button
        title="Save this command in history global TODO"
        ><i class="fa-solid fa-heart-circle-plus"></i></button>

    <input type="text" @change="onChangeInput_toCmd" ref="cmdInputRef"
        style="min-width: 75%;"></input><br></br>
    <select @change="$refs.cmdInputRef.value = $event.target.value;$refs.cmdInputRef.focus();"
        style="min-width: 90%;">
        <option value="">- - -</option>
        <option v-for="cmdH,cmdI in oven.cmdHistory"
            :value="cmdH">
            [ {{ cmdI }} ]: {{ cmdH }}
        </option>   
    
    </select>
</OvGroup>





<div>status ... oven</div>
<div>---</div>


<OvGroup
    gtitle="### Baking recipe">

    protocal:<!-- <br></br>
    <input type="text" v-model="recipeNow.mediumProtocal"></input>-->
    <select v-model="recipeNow.mediumProtocal">
        <option v-for="procal,pci in oven.opts.mediumProtocal" :value="procal">
            [ {{ pci}} ]: {{ procal }}
        </option>
    </select>    
    

    <div v-if="recipeNow.mediumProtocal == 'mqtt'">
        topic adres:
        <input type="text" v-model="recipeNow.topicAddress"></input><br></br>
    </div>
    <div  v-else-if="recipeNow.mediumProtocal == 'cmd'">
        command:
        <select @change="recipeNow.topicAddress = $event.target.value">
            <option value="0">- - -</option>
            <option v-for="cmdH,cmdI in oven.cmdHistory"
                :value="cmdH"
                >
                [ {{ cmdI }} ]: {{ cmdH }}
            </option>
        
        
        </select>
    </div>



    title:<br></br>
    <input type="text" v-model="recipeNow.title"></input><br></br>

    type of value:<!--<br></br>
    <input type="text" v-model="recipeNow.valType"></input>-->
    <select v-model="recipeNow.valType">
        <option v-for="valtyp,vti in oven.opts.valType" :value="valtyp">
            [ {{ vti }} ]: {{ valtyp }}
        </option>
    </select><br></br>

    msg wrapper:<!--<br></br>
    <input type="text" v-model="recipeNow.wrapType"></input>-->
    <select v-model="recipeNow.wrapType">
        <option v-for="wratyp, wti in oven.opts.wrapType" :value="wratyp">
            [ {{ wti }} ]: {{ wratyp }}
        </option>
    </select><br></br>

    * <input type="checkbox" v-model="recipeNow.liveSes"
    id="recLivSes"></input>
    <label for="recLivSes"
        style="display: inline;">
        live sesion
    </label><br></br>

    * <input type="checkbox" v-model="recipeNow.sharedSession"
    id="recShaSel"></input>
    <label for="recShaSel"
        style="display: inline;">
        shared task
    </label><br></br>

    * <input type="checkbox" v-model="recipeNow.onlyWhenImOnline"
        id="reconlWheImOn"></input>
    <label for="reconlWheImOn"
        style="display: inline;">
        kill after disconnect
    </label><br>



    <div v-if="recipeNow.liveSes == false">
        so interval then every ( .sec ):<br></br>
        <input type="number" min="1" max="600" step="1" v-model="recipeNow.intervalEverySec" ><br></br>
        <small>0 - no interval </small>
    </div>


    <hr></hr>
    <button @click="onProbeSelectorFrom( recipeNow )">bake recepe</button>

</OvGroup>




<OvGroup
    gtitle="### log">
    <div v-for="w, wIn in oven.logs.reverse()" >
        # log - entryDate [ {{ w.entryDate }} ]
        <div v-html="w.msg"></div>
    </div>

</OvGroup>


</div>
</template>


<script>

console.log('[oven] inclide. ...');
import { msToDurationString } from '/libs/libsForTime.js';
import ovGroup from './ovGroup.vue';
import OvDir from './ovDir.vue';



export default{
components:{
    'OvGroup': ovGroup,
    'OvDir': OvDir    
},
mounted(){
    setTimeout(()=>{
        this.onQeryOvenDirUpdate();
    },500);
    console.log('[oven] mounted. ...');
},
unmounted(){
    console.log('[oven] unmounted. ...');
},
data(){   

    return {

        recipeNow:{
            mediumProtocal:'cmd', 
            topicAddress:"echo $(( `date +%s` - 1769016074 ))", 
            title: 't01', 
            valType: 'raw',
            wrapType: 'toast',
            liveSes: false,
            intervalEverySec: 0,
            iterator: -1,
            sharedSession:true,
            onlyWhenImOnline:false,
        },

        iterators: [],

        oven:{
            working: true,
            runNo: 0,
            tUpdate: undefined,
            spList: undefined,
            dir: undefined,
            adressUrl: '',
            results:[],
            isWatching: false,
            watchingIter: -1,
            logs: [],
            logsMax: 10,
            
            
            cmdHistory: [
                'echo $(( `date +%s` - 1769016074 ))', // start count since 2026-01-21 12:....
                `free -hm | grep Mem | awk '{print "Ram: "$3"/"$2}'`, // #	Ram: 2.5Gi/30Gi
                `free | grep Mem | awk '{print ($3/$2)*100.00}'`, // to percent rame use
                `acpi -b | awk '{print $4}' | replace '%,' ''`, // # batery local status
            ],
            
            

            opts:{
                mediumProtocal: [ 'mqtt', 
                    'cmd' ], 
                topicAddress: [], 
                title: [], 
                valType: [ 'raw', 'secLeft', 'percent', 'percent bar' ],
                wrapType: [ 'toast',  'terminal', 'log', 
                'widget',
                ],
                liveSes: [ true, false ],
            },
            
            widgets:[
                
            ],
            
        },
        
    
    };
},

methods:{

    // dir CookBook

    getChannelFromNo( adressUrl, chNo ){
        return this.oven.dir[ adressUrl ]['layout']['channels'][ chNo ];
    },


    onEmit_dirChannelClick( data ){
        console.log('[dirCh_click] data ',data);

        if( data.action == 'click' ){

            let chObj = this.getChannelFromNo( data.adressUrl, data.chNo );

            if( !('sp' in chObj ) ) chObj['sp'] = {
                tStart: 0, tPing:0, tEnd: 0, exitCode:-1, statusNow:'', resCount:0, result:[]
            };

            this.onProbeSelectorFrom( chObj, data );

        }else{
            TODO
        }
    },

    // dir CookBook



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

            let spDataEnd = linesC - 3;
            let prefLen = templateP.length;
            for( let li=spDataStart+1; li<spDataEnd; li++ )
                if( lis[ li ] != tepmlateS){
                    //console.log('insert - '+lis[ li ]);
                    tr.res.push( lis[ li ].substring( prefLen ) );
                }

        }


        //this.oven.results.push( {id:tr.runNo, data: tr} );

        return tr;
    },


    onChangeInput_toCmd( ev ){
        let cmdStr = `${ev.target.value}`;
        
        //if( this.oven.cmdHistory.findIndex( ch => ch == cmdStr ) == -1 )
            this.oven.cmdHistory.push( cmdStr );
        
        console.log('[oven] got cmd: ', cmdStr );
        this.onCmdStrTocmdResConole( `${cmdStr}` );
        //ev.target.value = '';
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
                this.oven.spList = j;

                } 
            });

    },

    onQeryOvenDirUpdate( adressUrl = ''){
        this.onDoFetch( '/apis/oven/dirUpdate' ,{
            'onReady':(r)=>{
                let j = JSON.parse( r );
                console.log('[oven] QOvenDirUpdate result .... ', JSON.stringify( j ,null,4) );
                this.oven.dir = j;
                } 
            });
    },

    onQeryOvenDir( adressUrl = ''){
        this.onDoFetch( '/apis/oven/dir?'+adressUrl ,{
            'onReady':(r)=>{
                let j = JSON.parse( r );
                console.log('[oven] QOvenDir result .... ', JSON.stringify( j ,null,4) );
                this.oven.dir = j;
                } 
            });
    },


    msgWrapInToast( msg ){
        $.toast( msg );
    },


    msgWrapInLog( msg ){ 
        this.oven.logs.push( {entryDate: Date.now(), msg } );

    },


    msgWrapInType( msg, wrapType, targetData = undefined ){
        if( wrapType == 'toast' ){
            this.msgWrapInToast( msg );

        }else if( wrapType == 'log' ){
            this.msgWrapInLog( msg );

        }else if( wrapType == 'widget' ){
            if( targetData == undefined )
                this.msgWrapInLog( msg );
            

        

        }else if( wrapType == 'terminal' ){
            console.log(`[oven] msg wrap go to terminal ...`, msg );

        }else{
            console.log('[oven] ee make hook msg wraper nan ',wrapType);
            return 1;
        }

        if( targetData == undefined )
            this.msgWrapInLog( msg );
        else{
            console.log('[over] wrap update channel]');
            let chObj = this.getChannelFromNo( targetData.adressUrl, targetData.chNo );
            chObj['tPing'] = Date.now();
            chObj['statusNow'] = 'running';
            chObj['result'] = msg;
            
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
                        

        }else if( valType == 'percent bar' ){
                let divName = 'ooccPerc'+Date.now();
                
                let w = parseInt(data);
                let size = [150,20];
                return `
                
                <b style="">
                    ${w} %
                </b>  
                <div id="${divName}" style="
                    border: 2px solid black;
                    width:${size[0]+10}px;
                    height:${size[1]}px;
                
                ">
                    <div style="border-left:2px solid black;height:${size[1]}px;width:${w}px;background-color: red;display:inline-block;" ></div>
                    <div style="border-left:2px solid black;height:${size[1]}px;width:${size[0]-w}px;background-color: green;display:inline-block;" ></div>

                </div>`;
                    //afterShown: function () {
                        

        }else{
                console.log('EE dataWrapType Nan ',valType);
        }
    },


   

    onProbeSelectorFrom( recipe, targetData = undefined ){

        console.log(`[oven] on probe selector - recipe \n`,JSON.stringify( recipe, null, 4));

        let postProcessCmd = this.makeHook( 
            recipe.mediumProtocal, 
            recipe.topicAddress, 
            recipe.title, 
            recipe.valType, 
            recipe.wrapType,
            targetData
        );
     
        
        if( targetData != undefined ){
            let chObj = this.getChannelFromNo( targetData.adressUrl, targetData.chNo );
            chObj['tStart'] = Date.now();
            chObj['statusNow'] = 'started';
            
        }


        
        if( recipe.liveSes == false && recipe.intervalEverySec != '0' ){
            this.iterators.push(
                setInterval( () => { 

                    this.onOvenCompact_full( 'nooo custom', 
                        postProcessCmd.cmd, 
                        postProcessCmd.postProcess, 
                        recipe.liveSes 
                    );

                }, 
                parseInt( recipe.intervalEverySec ) * 1000 
                )
            );

        }
         
        this.onOvenCompact_full( 'nooo custom', 
            postProcessCmd.cmd, 
            postProcessCmd.postProcess, 
            recipe.liveSes 
        );

    },

    makeHook( mediumProtocal, topicAddress, title, valType, wrapType, targetData = undefined ){
        
        let cmd = undefined;
        //let msg = undefined;
        let mRes = undefined;

        if( mediumProtocal == 'mqtt' )
            cmd = `mosquitto_sub -t '${topicAddress}' -h 'hu' -p 10883 -V mqttv311`;
        
        else if( mediumProtocal == 'cmd' )
            cmd = topicAddress;
        
        else{
            console.log('EE NAN medium protocal ',mediumProtocal);
            return 1;
        }

        
        let postProcess = ( chunkNo, resToProcess ) => {
            console.log('[oven] -> postprocess have valTypes ',JSON.stringify(this.oven.opts.valType));

            if( valType == 'raw' ){
                //console.log('[oven 1111RAW] resToProcess',resToProcess);
                this.msgWrapInType( `${title}: ( raw ): ${resToProcess}`, wrapType, targetData );
           
            }else if( this.oven.opts.valType.findIndex(  vts => `${vts}` == `${valType}` ) != -1 && resToProcess.length > 0 ){

                console.log('[oven 6789 - '+valType+'] resToProcess ->',r);
                resToProcess.forEach( r => {
                    if( r ){
                        try{
                            mRes = parseInt(r);
                            this.msgWrapInType( 
                                `${title}: ( ${valType} )<br>${ this.dataWrapType( '', mRes, valType ) }`, 
                                wrapType, targetData 
                            );
                        } catch(e){
                            console.log('EE res line to integer no good');
                        }
                    
                    }

                });

            

















            }else {
                console.log('EE 5678987 valType not supported [',valType,'] is array of ('+resToProcess.length+') \n resToProcess: ',resToProcess);
            }
        };

        
        if( wrapType == 'terminal' ){
            cmd = `x-terminal-emulator -e "${cmd};sleep 10;"`;
        }



        return {postProcess, cmd};
    },











    /** from string to ready predefine something */
    onOvenCompact( compactName = 'disk space'){
        this.onOvenCompact_full( compactName );
    },



    getByCompactName( cName ){
        

        let compacts = {
            'e01Mux_left':() => {
                //cmd = `mosquitto_sub -t 'e01Mux/left' -h 'hu' -p 10883 -V mqttv311`;
                //let postProcessCmd = this.makeMqttHook( 'e01Mux/left', 'e01Mux - left', 'secLeft' );
                let postProcessCmd = this.makeHook( 'mqtt','e01Mux/left', 'e01Mux - left', 'secLeft', 'toast' );
                return {
                    liveSes: true,
                    cmd: postProcessCmd.cmd,
                    postProcess: postProcessCmd.postProcess,
                };
            },            
            'home_perc':() => {
                //cmd = `mosquitto_sub -t 'e01Mux/left' -h 'hu' -p 10883 -V mqttv311`;
                //let postProcessCmd = this.makeMqttHook( 'e01MuxFix/homeBatPerc', 'Home battery - in percents', 'percent' );
                let postProcessCmd = this.makeHook( 'mqtt', 'e01MuxFix/homeBatPerc', 'Home battery - in percents', 'percent', 'toast' );
                return {
                    liveSes: true,
                    cmd: postProcessCmd.cmd,
                    postProcess: postProcessCmd.postProcess,
                };
            },
            'disk space':()=>{
                let cmd = `df -h $HOME`;
                let divName = 'abc'+Date.now();
                let postProcess = ( chunkNo, result ) => {
                    console.log('[oven]-diskSpace ',result);
                    let rWords = result[2].split(' ');
                    let percInd = rWords.findIndex(o => o.endsWith('%') );
                    let percIs = parseInt( rWords[ percInd ].replaceAll('%',''));
                    let gigW = rWords.filter( w => w.length > 2 );
                    let gigAvail =  gigW[ 3 ];
                    $.toast({
                        text:`Disk space at home: <br><br>${result[2]}<br><div id="${divName}"></div>`,
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
                };


                return {
                    liveSes: false,
                    cmd,
                    postProcess
                };

            },
        };

        
        if( !`${cName}` in compacts )
            return undefined;
        else
            return compacts[ cName ];


    },




    onOvenCompact_full( compactName = 'disk space', ownCmd = undefined, ownPost = undefined, ownLive = false ){

        let cmd = undefined;
        let liveSes = undefined;
        let postProcess = undefined;
        
        let tStart = Date.now();
        let tDelta = undefined;


        let compactByName = this.getByCompactName( compactName );
        
        if( ownCmd != undefined ){
            cmd = ownCmd;
            postProcess = ownPost;
            liveSes = ownLive;

        }else if( compactByName != undefined ){
            let compactObj = compactByName();
            liveSes = compactObj.liveSes;
            cmd = compactObj.cmd;
            postProcess = compactObj.postProcess;
        

        }

        // final end
        if( cmd != undefined && liveSes == false ){
            this.onDoFetch( '/apis/oven/cmd0/b64:'+btoa(`${cmd}`),{
                'onReady':(r)=>{
                    let cmdRes = this.cunksResult_resultObject( r );
                    let resToPass = cmdRes.res;
                    console.log('[oven] onOvenCompact DONE',resToPass ,'\n postprocess:',postProcess );
                    //this.onQeryTasksNow();
                    if( postProcess != undefined ){
                        postProcess( 0, resToPass );
                    }
                    tDelta = ( (Date.now() - tStart) /1000 );
                    console.log('[oven] onOvenCompact ... loop in '+tDelta +' sec.');
                }
            });


        // [ ] proces dy when client leaws
        // [ ] postprocess to server site
        // [ ] wrapper to server site
        // [ ] directory layout for config
        //

        // stream
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
                                l.lastIndexOf('   # GOGO ... #') == -1 && 
                                l.lastIndexOf('][sp][close] ,') == -1 
                            )
                                resOk.push( l.substring( l.indexOf(']   ')+4 ) );
                        } );
                        postProcess( chunkNo, resOk );
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
        let bta = btoa(cmd);
        console.log(`[oven1] cmd0 sending cmd: [ ${atob( bta )} ]`);

        this.onDoFetch( '/apis/oven/cmd0/b64:'+bta,{
            'onReady':(r)=>{
                //console.log('[oven] cmd0 finally .... ',r );
                let cmdRes = this.cunksResult_resultObject( r );
                console.log('[oven1] cmd0 res .... ',JSON.stringify(cmdRes,null,4) );
                
                this.oven.results.push( {id:cmdRes.runNo, data: cmdRes} );

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
                let pendinng = this.oven.spList.filter( spi => spi.tEnd == undefined );
                console.log('[oven][watcher] .... ',pendinng.length);
                if( this.oven.spList == undefined ){
                    killInter = true;
                }else{
                    
                    if( pendinng.length == 0 ){
                        killInter = true;
                        console.log('[oven][watcher] .... kill it it\' done');
                    }else{
                        console.log('[oven][watcher] working ... ',pendinng);
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

