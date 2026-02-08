<style>
.aAsLinks a{
    cursor: pointer;
}
pre{
    margin-top:0px;
    margin-bottom:0px;
}
</style>

<template >

<div 
    style="
        border-bottom: 5px solid #8d162c;
        padding: 3px;
        background-color: rgb(117, 190, 114);;
        color: white;
    
    "
    >

    <div style="display:inline-block;"
        >
        
         
        <img :src="homeUrl+'/assets/ico_mafinOven_32_32.png'" alt="Oven - logo">
       
        |
        
        <button 
            style="height:32px;border:0px;padding:0px;margin:0px;"
            title="Previes oven mode"
            :disabled="!(modeHistory.length > 1)"
            @click="console.log('modeHistory',mdeHistory);oven.ovenMode = modeHistory[ modeHistory.length - 2 ]; modeHistory.splice(modeHistory.length - 1,1);">
            <i class="fa-regular fa-circle-left"></i>({{ modeHistory.length }})
        </button>
        
        <select 
            title="Oven current mode"
            style="height:32px;"
            v-model="oven.ovenMode" 
            @change="onModeSwith( $event.target.value )"
            >
            <option v-for="om,omi in oven.ovenModes" :value="om">
            {{ om }}
            </option>
        </select>
        
    </div>

    |

    Working: {{ oven.working  }} ( {{ oven.runNo }} )


</div>


<div class="smallBt aAsLinks" style="color:#000000;">

<OvGroup 
    gtitle="abc gTitle test"
    v-if="0"
    > 
    abc <b>html</b>
</OvGroup>


<OvGroup
    gtitle="Exec about host" 
    v-if="[ 'debug' ].indexOf( oven.ovenMode ) != -1"
    >
    
    |

    <a @click="onQeryOvenDir()">
        QOvenDir</a>

    |

    <a @click="onQeryOvenDirUpdate('')"
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
    v-if="[ 'debug' ].indexOf( oven.ovenMode ) != -1"
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
    gtitle="## Exec on local" 
    v-if="[ 'debug' ].indexOf( oven.ovenMode ) != -1"
    >

    |

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
    gtitle="## Tools - dev 1" 
    v-if="[ 'debug' ].indexOf( oven.ovenMode ) != -1"
    >

    <button 
        title="subscribe to all topics at mqtt"
        @click="makeHook( 'mqtt', '#', 'all topics', 'raw', 'log' )"># all topiks</button> 
    
    |

    <a @click="onDoFetch( 'UI start task', '/apis/oven/bakeInPlace/L2hvbWUveW95by9BcHBzL3ZpdGV5c3Mtc2l0ZS0ycWVzdC9vdmVuL2luUGxhY2UyXzI2MDExN3R0MTY1OTM0LjJxZXN0')">
        start tast</a>
    | 
    <a @click="onCmdPredefined()">
        st</a> 
</OvGroup>


<OvGroup
    gtitle="## Subscribe" 
    v-if="[ 'debug' ].indexOf( oven.ovenMode ) != -1"
    >
    
    <button 
        title="e01Mux time left to switch ..."
        @click="onOvenCompact( 'e01Mux_left' )">e01Mux left</button> 
    
    |

    <button 
        title="Home percent battery status"
        @click="onOvenCompact( 'home_perc' )">home battery</button> 
    
    
    
</OvGroup>
    




<div v-if="[ 'view', 'debug' ].indexOf( oven.ovenMode ) != -1">

    ENV start

    <OvENVView 
        ref="ENVHub"
        @dir-channel-click="onEmit_dirChannelClick"
        />

</div>




ovenRuns: ({{ oven.ovenRuns.length }})
<div style="position:relative;">
<OvGroup
    :gtitle="'Oven - Recipes Books ('+oven.adressUrl+')['+Object.keys( oven.dir ).length+']'"
    v-if="[ 'view', 'debug' ].indexOf( oven.ovenMode ) != -1"
    >

    <div v-if="Object.keys( oven.dir ).length == 0">
        dir data not loaded ...
    </div>
    <div v-else>
    
    
        <a @click="onQeryOvenDirUpdate( oven.adressUrl )"
            title="QOven for update dir with CookBook"
            style="position:absolute;right:10px;top:4px;"
            ><i class="fa-solid fa-retweet"></i>
        </a>
    
        
    
    
        <OvDir
            :keyCount="OvDirKeyCount"
            :dir="oven.dir" 
            :adressUrl="oven.adressUrl"
            @dir-channel-click="onEmit_dirChannelClick"
            >
        </OvDir>

    </div>

</OvGroup>
</div>




<OvGroup
    gtitle="Log"
    v-if="oven.ovenMode == 'view'"
    >
    <div v-for="w, wIn in oven.logs.reverse()" >

<pre># [ {{ oven.logs.length-wIn }} ] {{ w.title }} [ {{ w.entryDate }} ] 
<small>{{w.msg}}</small></pre>

    </div>

</OvGroup>


<div style="position:relative;">
    <OvGroup
        :gtitle="'Cmd - results ( '+oven.screens.cmdResults.asLines.length+' )'"
        v-if="[ 'cmd', 'debug' ].indexOf( oven.ovenMode ) != -1"
        >
        
        <a @click="oven.screens.cmdResults.isEmpty = true;oven.screens.cmdResults.strDone = '';oven.ovenRuns=[];"
            title="Clean all logs entries"
            style="position:absolute;right:10px;top:4px;"
            v-if="oven.screens.cmdResults.isEmpty == false"
            ><i class="fa-regular fa-trash-can"></i>
        </a>
  
        <pre v-html="oven.screens.cmdResults.strDone"></pre>
        <!--
        <div v-for="res,resNo in oven.results"
            :style="'border-bottom:1px solid green;'"
            >
            <small><pre>[{{ res.id }}]: {{ res.data.res.join('\n#\t') }}</pre></small>

        </div>
        -->


    </OvGroup>
</div>    

     
<OvGroup
    gtitle="cmd"
    v-if="[ 'cmd', 'debug' ].indexOf( oven.ovenMode ) != -1"
    >

    <button
        title="Save this command in history global TODO"
        @click="onSaveToHistory()"
        ><i class="fa-solid fa-heart-circle-plus"></i></button>

    <input type="text" @change="onChangeInput_toCmd" ref="cmdInputRef"
        id="cmdInputRefByID"
        value="free; sleep 1;free; sleep 1;free; sleep 1;"
        placeholder="#$ echo 'hello world';"
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


<OvGroup
    :gtitle="'Oven beaking now'"
    v-if="[ 'debug' ].indexOf( oven.ovenMode ) != -1"
    >
    
    <div v-for="or,ori in oven.ovenRuns.reverse()" 
        v-if="ori < 3">
        <pre>[{{ or.runNo }}] #$ {{ or.isFromWho+' | cmd:'+or.cmd }}
status:     [ {{ or.tEnd != undefined ? 'Done' : 'Runn' }} ] 
run time:   [ {{ or.tEnd != undefined ? or.tEnd-or.tStart : Date.now() - or.tStart }} ] ms.
chunkTr :
keys in ovenRun: 
  * {{ or.tEnd!=undefined ? Object.keys(or).join('\n  *') :'-' }} 
- - - -</pre>
    </div>
    
    
</OvGroup>







<OvGroup
    gtitle="Baking recipe"
    v-if="oven.ovenMode == 'edit'"
    >

    ## <input type="text" v-model="recipeNow.rName"
        placeholder="Recipe name"
        ></input><br></br>


    * <img :src="homeUrl+'./assets/ico_autoStart_22_22.png'">
    <input type="checkbox" v-model="recipeNow.autoStart"
        id="recreconAutoStart"></input>
    <label for="recreconAutoStart"
        style="display: inline;">
        auto start TODO
    </label><br>


    * <i class="fa-regular fa-headphones"
        title="So if EVN viariable will update it will be callBack"
        ></i> 
        getENV variable: TODO<br></br>
    &nbsp;&nbsp;
        <span style="color:white">
        <TagsColector
            :idIdentName="11"
            :tags="recipeNow.getENV"
            @tags-colector-add="onEmit_tagsAdd_getENV"
            @tags-colector-remove-index="onEmit_tagRemove_getENV"
            />
    </span>
    <br>

    
    * <input type="checkbox" v-model="recipeNow.sharedSession"
    id="recShaSel"></input>
    <label for="recShaSel"
        style="display: inline;">
        shared task TODO
    </label><br></br>

    * <input type="checkbox" v-model="recipeNow.onlyWhenImOnline"
        id="reconlWheImOn"></input>
    <label for="reconlWheImOn"
        style="display: inline;">
        only when I'm online TODO
    </label><br>

    <br></br>
    ## ingreadience


    <br>

    * <i class="fa-solid fa-kitchen-set"></i>
        protocal:<br></br>
            &nbsp;&nbsp; <!-- <br></br>
    <input type="text" v-model="recipeNow.mediumProtocal"></input>-->
    <select v-model="recipeNow.mediumProtocal">
        <option v-for="procal,pci in oven.opts.mediumProtocal" :value="procal">
            [ {{ pci}} ]: {{ procal }}
        </option>
    </select>    
    

    <div v-if="recipeNow.mediumProtocal == 'mqtt'">
        * <i class="fa-regular fa-address-card"></i>
            topic adres:<br></br>
                &nbsp;&nbsp;
        <input type="text" v-model="recipeNow.topicAddress"
            placeholder="/and/+/res"></input><br></br>
    </div>
    <div  v-else-if="recipeNow.mediumProtocal == 'cmd'">
        * <img :src="homeUrl+'./assets/ico_command_22_22.png'">
            command:
                &nbsp;&nbsp;

        <select @change="recipeNow.topicAddress = $event.target.value">
            <option value="0">[⠺] - - -</option>
            <option v-for="cmdH,cmdI in oven.cmdHistory"
                :value="cmdH"
                :selected="recipeNow.topicAddress == cmdH"
                >
                [ {{ cmdI }} ]: {{ cmdH }}
            </option>
        
        
        </select>
    </div>



    * <i class="fa-solid fa-utensils"></i>
        type of value:
            &nbsp;&nbsp;<!--<br></br>
    <input type="text" v-model="recipeNow.valType"></input>-->
    <select v-model="recipeNow.valType">
        <option v-for="valtyp,vti in oven.opts.valType" :value="valtyp">
            [ {{ vti }} ]: {{ valtyp }}
        </option>
    </select><br></br>

    * <img :src="homeUrl+'assets/ico_tacos_22_22.png'">
        wrapper it in:<br></br>
            &nbsp;&nbsp;<!--<br></br>
    <input type="text" v-model="recipeNow.wrapType"></input>-->
    <select v-model="recipeNow.wrapType">
        <option v-for="wratyp, wti in oven.opts.wrapType" :value="wratyp">
            [ {{ wti }} ]: {{ wratyp }}
        </option>
    </select><br></br>


    * <i class="fa-solid fa-volcano"
        title="So result will be set as define in ENV"
        ></i> 
        setENV variable: <u>SOME setsome ...</u> <br>
             &nbsp;&nbsp;
        <span style="color:white">
        <TagsColector
            :idIdentName="11"
            :tags="recipeNow.setENV"
            @tags-colector-add="onEmit_tagsAdd_setENV"
            @tags-colector-remove-index="onEmit_tagRemove_setENV"
            />
    </span>
    <br></br>


    * <input type="checkbox" v-model="recipeNow.liveSes"
    id="recLivSes"></input>
    <label for="recLivSes"
        style="display: inline;">
        live sesion
    </label><br></br>

    



    <div v-if="recipeNow.liveSes == false">
        * interval every:<br></br>
            &nbsp;&nbsp; 
        <input type="number" min="1" max="600" step="1" v-model="recipeNow.intervalEverySec" >
        ( .sec )<br></br>
        <pre><small>0 - no interval </small></pre>
    </div>


    <br>


    
    ## toping action
<pre style="padding:5px;">
<button @click="onProbeSelectorFrom( recipeNow )"><i class="fa-solid fa-fire-burner"></i> Bake recepe</button>
 - OR -
<div v-if="oven.dir != undefined && Object.keys( oven.dir).length > 0 ">Save recipe to [ {{ oven.adressUrl }} ]:  
<select v-model="recipeNow.saveChannelNo" 
    title="Save is free channel"
    >
    <option value="-1">[⠺] - select channel to stor in ...</option>
    <option v-for="ch in getChannelsFrom( oven.adressUrl ).length"
        :value="ch-1"
        :selected="false"
        >
        [{{ch-1}}] - {{freeChannels[ ch-1 ] }}
    </option>
</select>
<button
    :disabled="recipeNow.saveChannelNo=='-1'"
    title="Save recipe" 
    @click="onSaveSelectorFrom()"><i class="fa-regular fa-floppy-disk"></i>Save to file</button>
</div></pre>        

    
    
    
</OvGroup>


<OvGroup
    gtitle="#### DEBUG Icon test set"
    v-if="[ 'debug' ].indexOf( oven.ovenMode ) != -1"
    >


    <i class="fa-regular fa-circle-play"></i>
    <i class="fa-regular fa-circle-stop"></i>
    <i class="fa-regular fa-circle-pause"></i>
    <i class="fa-regular fa-circle-xmark"></i>
    |
    <i class="fa-regular fa-circle-up"></i>
    <i class="fa-regular fa-circle-down"></i>
    |
    <i class="fa-regular fa-circle-check"></i>
    <i class="fa-regular fa-circle-xmark"></i>
    |
    <i class="fa-solid fa-circle-check"></i>
    <i class="fa-solid fa-circle-xmark"></i>

    |<br>

    <i class="fa-solid fa-play"></i>
    <i class="fa-solid fa-stop"></i>
    <i class="fa-solid fa-pause"></i>
    <i class="fa-solid fa-xmark"></i>
    |
    <i class="fa-solid fa-angles-up"></i>
    <i class="fa-solid fa-angles-down"></i>
    |
    <i class="fa-solid fa-gauge"></i>
    <i class="fa-solid fa-gauge-high"></i>
    |
    <i class="fa-solid fa-check"></i>
    <i class="fa-solid fa-xmark"></i>

    |<br></br>
    ▷
    □
    ◷
    ☢
    |
    ◹
    ◿
    |
    ▵
    ▿
    |
    ●
    ●


    |<br></br>
    ▶ ⏹ ⏸ ⏏ | ⏪ ⏩ | ● ● | ⊕ ⊖ ☢ ♽ ⚫ 🔴 🔵 🎯 ☯ ⛔ 
    <br></br>
    ◌̊  ◌̥  ◌ͦ  ◌゚ ⧉ ⧆ <br></br>
    ♾ ⚆ ᴏ O o 0 . ⚇ ⚯ ⚮ ⚭ 
    |<br>

    <OvGroup
        gtitle="process action button set"
        v-if="oven.ovenMode == 'debug'"
        >
    
        <a @click=""
            title="Execute / bake it ...">
            <i class="fa-solid fa-square-caret-right"></i>
        </a>
        <a @click=""
            title="Stop / pause process">
            <i class="fa-solid fa-stop"></i>
        </a>
        <a @click=""
            title="Resume process">
            <i class="fa-solid fa-pause"></i>
        </a>
        <a @click=""
            title="Kill process">
            <i class="fa-solid fa-square-xmark"></i>
        </a>
        |
        <a @click=""
            title="Change priopity to high">
            <i class="fa-regular fa-square-caret-up"></i>
        </a>
        <a @click=""
            title="Change priopity to low">
            <i class="fa-regular fa-square-caret-down"></i>
        </a>
        |
        <i style="color:rgb(104, 141, 22);" 
            class="fa-solid fa-square-check"
                title="Process exitCode 0"       
            ></i>            
        <i style="color:rgb(218, 0, 0);"
            class="fa-solid fa-square-xmark"
            title="Process exit with error"
        ></i>

    
    </OvGroup>
    |<br>


    <i class="fa-solid fa-square-xmark"></i>
    <i class="fa-solid fa-square-h"></i>
    <i class="fa-regular fa-square-caret-right"></i>
    &nbsp;&nbsp;&nbsp;
    |
    <i class="fa-regular fa-square-caret-up"></i>
    <i class="fa-regular fa-square-caret-down"></i>
    |
    <i class="fa-solid fa-square-check"></i>
    <i class="fa-solid fa-square-xmark"></i>
    |
    <i class="fa-regular fa-square-check"></i>
    <i class="fa-regular fa-square-xmark"></i>


    |<br>

    <i class="fa-solid fa-square-share-nodes"></i>
    <i class="fa-solid fa-square-share-nodes"></i>
    <i class="fa-solid fa-recycle"></i>
    <i class="fa-solid fa-check"></i>



    |<br>

    <i class="fa-brands fa-node-js"></i>
    <i class="fa-solid fa-hexagon-nodes"></i>
    <i class="fa-solid fa-hashtag"></i>



</OvGroup>



<br><br><br><br>

</div>
</template>


<script>

import { ref } from 'vue';
import { msToDurationString } from '/libs/libsForTime.js';
import ovGroup from './ovGroup.vue';
import OvDir from './ovDir.vue';
import OvENVView from './ovENVView.vue';
import TagsColector from '@UiAssets/tagsColector.vue';
import { getDefRecipe, ODdataWrapType } from '../libs/ovenDefinitions';
import { msgsCODES, msgsCODESFlat } from '../libs/ovenHttp.js';



export default{
props: [ 'homeUrl' ],
components:{
    'OvGroup': ovGroup,
    'OvDir': OvDir,
    'OvENVView': OvENVView,
    'TagsColector': TagsColector,
},

mounted(){
    setTimeout(()=>{
        
        console.log('* inject - ovenSelected ');
        window['ovenSelected'] = (basenameAdressUrl, chNo, msg ) => {
            let exKey = `exT${basenameAdressUrl}Ch${chNo}`;
            console.log(`[ovenBD] got `,{exKey, basenameAdressUrl, chNo, msg});

            // TO FIX 
            let Cho = this.getChannelFromNo('/'+basenameAdressUrl, chNo);
            Cho.setENV.push( exKey );
            this.$refs.ENVHub.reroutENV( msg, Cho );

        };


        console.log('[oven] mounted ... setting adressUrl: ""');
        this.onQeryOvenDirUpdate('');
        //this.oven.adressUrl = '';
        this.onQeryOvenDirUpdate(
            '/aBasket', 
            o=> {
                this.oven.adressUrl = '/aBasket';
                //this.oven.adressUrl = '';
            });


    },500);
    console.log('[oven] mounted. ...');
},
unmounted(){
    console.log('[oven] unmounted. ...');
},

provide(){
    return {
        'oven': this.oven,
        'ENVs': this.ENVs,
    };
},
data(){   

    let ovenMode = 'view';


    return {

        iterators: [],

        freeChannels: [],

        modeHistory: [ ovenMode ],

        ENVs: {},

        OvDirKeyCount:0,

        oven:{
            working: true,
            ovenMode,
            ovenModes: [ 'view', 'cmd', 'edit', 'debug' ],    
            runsNo: 0,
            tUpdate: undefined,
            spList: undefined,
            dir: {},
            adressUrl: undefined,
            ovenRuns:[],
            //chsRuns: [],
            isWatching: false,
            watchingIter: -1,
            logs: [],
            logsMax: 10,
            
            
            cmdHistory: [
                'echo $(( `date +%s` - 1769016074 ))', // start count since 2026-01-21 12:....
                `free -hm | grep Mem | awk '{print "Ram: "$3"/"$2}'`, // #	Ram: 2.5Gi/30Gi
                `free | grep Mem | awk '{print ($3/$2)*100.00}'`, // to percent rame use
                `acpi -b | awk '{print $4}' | replace '%,' ''`, // # batery local status
                '../viteyss-site-oven/ovenDef/0_ch_sqlite3_select.sh "tab1" "/tmp/dbTab1.db"', // # sqlite3 slection
                'ls -al ./ | awk \'{print $5"\\n - "$9}\'',
                'ls ./ | head -n 5'
            ],
            
            
            widgets:[
                
            ],

            opts:{
                mediumProtocal: [ 'mqtt', 'cmd',
                    'sqlite3 TODO',
                    ], 
                topicAddress: [], 
                //rName: [  ], // use it as a sugestios for $FILE_EDITOR | $FILE_EXPLORER | $TERMINAL | ...  
                valType: [ 'raw', 'toString', 'toBraile', 'secLeft', 'percent', 'percent bar', 'A small plot', 'A progress bar',  
                    // submit
                    'input list select submit', 
                    'input text submit TODO',
                    'input combobox select submit TODO', 
                    
                    ],
                wrapType: [ 'toast',  'terminal', 'log', 'widget', 
                    'clipBoard TODO' ],
                liveSes: [ true, false ],

            },
            
            screens:{
                groups:{},
                cmdResults:{
                    isEmpty:true,
                    asLines:"",   
                    strDone:'nice ! ...'                 
                },
                
            },
            
        },

        recipeNow: getDefRecipe( '', 't01' ),
        
    
    };
},

methods:{


    


    // screen render ---- START
    
            
    onModeSwith( targetModeName , onDone = undefined ){
        this.modeHistory.push( `${this.oven.ovenMode}` );
        this.oven.ovenMode = targetModeName;        
        if( onDone != undefined ) onDone();
    
    },
    
    
    
    getScreen( sName = 'cmdResults' ){
        let msg = '';
        console.log('[ scr3 ] redraw start ... [ '+sName+' ] ');
        let sTr = ['[-1]# [oven] getScreen -> sName: [ '+sName+' ]'];
        
        if( !( sName in this.oven.screens ) ){
            console.log('[ scr3 ] EE no screen with name ...[ '+sName+' ]');
            return 1;
        }
        
        
        if( sName == 'cmdResults' ){        

            for ( let ri=0,rc=this.oven.ovenRuns.length; ri<rc; ri++ ){
                let runO = JSON.cloneRaw( this.oven.ovenRuns[ ri ] );
                console.log('[ scr3 for cmdResults] runO:',runO);
                let trH = `[${ runO.runNo }] `;
                let tr = trH+`#$ ${ runO['cmd']} \n`;
                
                // finished render 
                if( runO.result != undefined && runO.tEnd != undefined ){
                    
                    //tr+= '</pre><pre style="color:#ff8811;">';
                    
                    tr+=`${trH}  ${ runO.result.res.join('\n'+trH+'  ') }`+
                        `\n<span style="background-color:#${ runO.result.exitCode=='0'?'d1d1d1':'f98a6f' };">`+
                        `${trH}# ... exitCode: [ ${ runO.result.exitCode } ]  `+
                        `time in ... ${ msToDurationString( ( runO['tEnd']-runO['tStart'])/1000 ) }`+
                        '</span>';
                    //tr+= '</span>';
                  
                // working render 
                }else if( runO.result != undefined && runO.result.chunkTr.length > 0 && runO.tEnd == undefined ){
                    
                    let chunkTr = runO.result.chunkTr;
                    
                    tr+= '<span style="background-color:#dafbd2;">';
                    //tr+=`${trH} ${ runO.chunks.filter( r => r.indexOf('][sp][data] ...') != -1 ).join('') }`;
                    tr+=`${trH}${ chunkTr.join('\n') }`;
                    tr+=`...`;
                    tr+= '</span>';
                                    
                }else{
                    tr+= trH+' ... working'; 
                }
                    
                console.log('[ scr3 ]runO ['+ri+']: ',runO,'\ntr ....\n',tr);
                sTr.push( tr );
            }
        
         
            
        
        }else{
            msg = '[oven] EE get screen NAN sName '+sName;
            sTr.push( msg );
        }       
        console.log('oven g');
        console.log( sTr.join('\n') );
        this.oven.screens[ sName ].strDone = sTr.join('\n'); 
        this.oven.screens[ sName ].asLines = sTr;
        this.oven.screens[ sName ].isEmpty = false;
        
        if( 1 ){
            setTimeout(()=>{
            let byInput = document.getElementById('cmdInputRefByID');
            if( byInput == document.activeElement )
                byInput.scrollIntoView({ behavior: 'smooth',block: "center" });
            }, 20);
        }
        

    },
                

    // screen render ---- END

    
    // dir CookBook START

    // MOVED TO OVENMAIN
    getChannelsFrom( adressUrl ){
        console.log('[oven] getChannelFrom ... adressUrl:('+adressUrl+') \n oven.dir now\n',this.oven.dir);
        return this.oven.dir[ adressUrl ]['layout']['channels'];
    },
    // MOVED TO OVENMAIN
    getChannelFromNo( adressUrl = '', chNo ){
        return this.oven.dir[ adressUrl ]['layout']['channels'][ chNo ];
    },
    // MOVED TO OVENMAIN
    getChanneltargetData( targetData ){
        return this.oven.dir[ targetData.adressUrl ]['layout']['channels'][ targetData.chNo ];
    },


    onEmit_dirChannelClick( data ){
        console.log('[dirCh_click] data ',data);

        if( data.action == 'click' ){
            let recipeO = this.getChannelFromNo( data.adressUrl, data.chNo );
            recipeO['adressUrl'] = data.adressUrl;

            /*
            // sp 'sp' ['sp']
            if( !('sp' in chObj ) ) chObj['sp'] = {
                tStart: 0, tPing:0, tEnd: undefined, exitCode: undefined, statusNow:'', resCount:0, result:[] ,
                widget:'', widgetColor:'012001',
            };
            */

            this.onProbeSelectorFrom( recipeO, data );

        }else if( data.action == 'ps-action' ){
            let chObj = this.getChannelFromNo( data.adressUrl, data.chNo );
            //oven_onSendKill( spi.sp.pid, 'KILL' )
            this.oven_onSendPsKill( data );
            


        }else if( data.action == 'edit' ){
            let chObj = this.getChannelFromNo( data.adressUrl, data.chNo );
            if( this.oven.cmdHistory.findIndex( c => c == chObj.topicAddress ) == -1 )
                this.oven.cmdHistory.push( chObj.topicAddress );
            
            this.onModeSwith( 'edit' , done => {
                this.recipeNow =  chObj;
            } );

            // scroll to #Baking_recipe
            //document.getElementById('baking_recipe').scrollIntoView({ behavior: 'smooth' })

        }else if( data.action == 'sub' ){
                                   
            // MOVED TO OVENMAIN ---- START         
            let nAdre = this.oven.adressUrl;
            
            if( data.chNo == -1 ){
                nAdre = this.oven.adressUrl.substring( 0, nAdre.lastIndexOf('/')-1 );
                console.log('[oven] will swap CookBook [ .. ] back  nAdre',nAdre); 
            }else{
                nAdre+= '/'+data.chNo;
                console.log('[oven] will swap CookBook [ .. ] forvard  nAdre',nAdre); 
            }
            
            if( `${nAdre}` == `${this.oven.adressUrl}` ){
                console.log('[oven] will swap CookBook @@ ... skip it\'s now current');
                return 1;
            }
            // MOVED TO OVENMAIN --- END
            
            // check if need to load dir by adressUrl
            if( nAdre in this.oven.dir ){
                console.log('[oven] will swap CookBook target ... OK nAdre');
                this.oven.adressUrl = nAdre;
                this.getChannelsFreeToArray( nAdre );
                
            }else{

                console.log('[oven] will swap CookBook target ... fetching nAdre');
                this.onQeryOvenDirUpdate( nAdre, r=>{
                    console.log('[oven] will swap CookBook target ... fetching DONE nAdre');
                    this.oven.adressUrl = nAdre;
                    this.getChannelsFreeToArray( nAdre );
                } );

                console.log('[oven] will swap CookBook target ... not ok');
                return 1;
            }
            

        }else{
            TODO
        }
    },

    // dir CookBook END

    // kill all 
    //kill `ps aux | grep '#GOGOGO ... START_' | awk '{print $2}'`

    // pid send kill START
    oven_onSendPsKill( emitPsAction ){
        //pkill -e -P ${spObj.sp.pid}` -signal ...
        let toDel = [];
        let findMe = this.oven.ovenRuns.filter( (or,ori) => {
            if ( or.targetData != undefined &&
                or.targetData.adressUrl == emitPsAction.adressUrl &&
                or.targetData.chNo == emitPsAction.chNo ){
                    
                toDel.push( ori );
                return true;
            }
        });
        console.log('PsKill',emitPsAction,'\nhave targets: ('+findMe.length+')\n', findMe);
        if( findMe.length == 1 ){
            let cmd = `pkill -e -P ${findMe[0].res.pid} --signal SIG${emitPsAction.extraArgs}`;
            console.log('PsKill will send ['+cmd+']');
            cmd = encodeURIComponent( cmd );
            cmd = btoa( cmd );
            let toastKill = $.toast({
                text: `pkill ... pid ${findMe[0].res.pid} (${emitPsAction.extraArgs})`,
                hideAfter: false,
                allowToastClose: false
            });
            this.onDoFetch( undefined, 'oven_onSendKill', '/apis/oven/cmd0/b64:'+cmd, {
                'onReady':(r, resultObject )=>{
                    //let cmdRes = this.cunksResult_resultObject( r );
                    console.log('PsKill DONE', resultObject );
                    //this.onQeryTasksNow();
                    setTimeout(()=>
                        toastKill.reset({
                            text: `pkill ... pid ${findMe[0].res.pid} (${emitPsAction.extraArgs}) DONE`,
                            hideAfter: true,
                            allowToastClose: true
                        }),
                        200
                        );
                    }
            });

        }else{
            console.error('ERR more then one ovenRun for chunnel ! 6789');
            return 1;
        }
    },

    oven_onSendKill( pid, sigNal ){
        console.log('[oven] cmd0 sendKill to pid: [ '+pid+' ] [ '+sigNal+' ] ' );
        this.onDoFetch( undefined, 'oven_onSendKill', '/apis/oven/cmd0/b64:'+btoa(`echo 'Will send kill signall ';/bin/kill -${sigNal} ${pid}`),{
            'onReady':(r, resultObject )=>{
                //let cmdRes = this.cunksResult_resultObject( r );
                console.log('[oven] cmd0 sendKill DONE', resultObject );
                //this.onQeryTasksNow();
                }
        });
    },

        // pid send kill END



    // oven start
    // main featch !
    onDoFetch( targetData, isFromWho, url, 
        onCB = { onChunk: undefined, onReady: undefined }, 
        ovenRunEntry = { 
            'onDoFetch_notSetAttr':1, 
            targetData,
            isFromWho,
            url,
            chunkTr: [], 
            res:[],
            //exitCode: undefined,
            tStart: Date.now(),
            tEnd: undefined, 
            }             
            
        ){

        let fetchOpts = {};
        let srcRecipe = undefined;

        if( targetData != undefined ){
            srcRecipe = this.getChanneltargetData( targetData );
            ovenRunEntry['targetData'] = srcRecipe;
            /*
            this.oven.chsRuns.push({
                recipe: srcRecipe,
                targetData,
                entryDate: Date.now(),
                ovenRun: ovenRunEntry
            });
            */

            console.log('[ovenFetch] targetData defined targetData:',targetData/*,'\n\n over chsRuns: \n', this.oven.chsRuns*/ );
            
            let trRecipe = {
                'adressUrl': srcRecipe.adressUrl,
                'chNo': srcRecipe.chNo,
                'sharedSession':srcRecipe.sharedSession,
                'mediumProtocal':srcRecipe.mediumProtocal,
                'topicAddress':srcRecipe.topicAddress,
                'onlyWhenImOnline':srcRecipe.onlyWhenImOnline,

            };
            
            fetchOpts = {
                'method': 'POST',
                headers:{
                    "Content-Type": "onDoFeth/b64",
                    "recipe": JSON.stringify( trRecipe ),
                },
            };
        }
            
        
        //setTimeout(()=>this.chkWatcher(),500);       
        
        if( !( 'onDoFetch_notSetAttr' in ovenRunEntry ) ){        
            console.log('[ovenFetch] run with custome ovenRunEntry !\n',ovenRunEntry);
        }else{
            console.log('[ovenFetch] run in defaultMode ... url: ',url);
            this.oven.ovenRuns.push( ovenRunEntry );
        }
        
        if( ovenRunEntry == undefined ){        
            console.log('[ovenFetch] EE noentry !');
            alert( '[ovenFetch] EE no entry !' );
            return 1;
        }
       
        let lastChunkSend = 0;
        let tcunksResult_resultObject = this.cunksResult_resultObject;

        async function readAllChunks(readableStream) {
            const reader = readableStream.getReader();
            const chunks = [];
            ovenRunEntry.chunkTr = [];
            
            let done, value,newL;
            while (!done) {
                ({ value, done } = await reader.read());
                if (done) {
                    //console.log('[ovenFetch] res final all ... ');
                    return chunks;
                }
                let chunkStr = new TextDecoder().decode( value ).split('\n');
                
                newL = 0;
                chunkStr.forEach( l => {
                    
                    if( l.indexOf( msgsCODES['PING'] ) == -1 ){
                        ovenRunEntry.chunkTr.push( l );
                        chunks.push( l );
                        newL++;
                    }

                });

                if( 1 || ovenRunEntry.res == {} ){
                    ovenRunEntry.res = tcunksResult_resultObject( chunks );
                }

                //console.log('[ovenFetch] res 3 chunk,', chunkStr);

                if( newL > 0 && 'onChunk' in onCB && onCB.onChunk != undefined ){
                    let fakeOvenRun = ovenRunEntry;
                    fakeOvenRun.chunkTr = ovenRunEntry.chunkTr.slice( lastChunkSend );
                    onCB.onChunk( chunks, fakeOvenRun );
                    lastChunkSend = ovenRunEntry.chunkTr.length;
                }
            }
        };
        let onCBt = onCB;

        console.log('go fetch url\nurl\n',url, '\n\nfetchOpts\n',fetchOpts);


        
        fetch( url, fetchOpts )
            .then( res => {
                let resStream = readAllChunks( res.body );
                //console.log('[ovenFetch] res 20', resStream );
                resStream.then( r => { 
                
                    ovenRunEntry.res = this.cunksResult_resultObject( r ); 
                    
                    ovenRunEntry.tEnd = Date.now();
                    
                    if( 'onReady' in onCBt && onCBt.onReady != undefined )
                        onCBt.onReady( r, ovenRunEntry );
                        //onCBt.onReady( r );
                
                } );                

                //console.log('[ovenFetch] res 2',res);
            })
            .catch(e=>{
                console.log('[ovenFetch] error 2',e);
            });
            
            
            
        return ovenRunEntry;
            
        
    },
    
    
    
    
    

    cunksResult_resultObject( linesIn, asChunkFilter = false ){
        console.log('[ chunksResult ] 59943 ',(typeof linesIn),' -> ',linesIn);
        let tr = {
            'cunksResult_resultObject':1,
            pid:-1,
            runNo: -1,
            'lines': [],
            chunkTr: [],
            linesC: -1,
            res: [],
            exitCode:undefined,
        };
        let lData = false;
        let markerLine = false;
        
        for( let l of linesIn ){
            markerLine = false;
            
            if( lData && l.indexOf('][sp][close] ,') != -1 ){
                tr.exitCode = l.split(',')[1];
                markerLine = true;
            
            }else if( l.startsWith( msgsCODES['PID_NO'] ) ){
                tr.pid = l.split(',')[1];

            }else if( l.indexOf('][sp][data] ...') != -1 ){
                tr.runNo = l.substring(1).split(']')[0];
                markerLine = true;
            }else if( 
                l.indexOf(']   # GOGO ... #') != -1 ||
                l.indexOf(']# [@@] ping client[ ') != -1 ||
                l == '' ){
                markerLine = true;
            
                
            }else if( l.startsWith( msgsCODES['START_STDIO'] ) ){
                lData = true;
                markerLine = true;

            }else if( lData &&  tr.exitCode != undefined ){
                markerLine = true;

            }else if( lData && l != '' ){
                tr.res.push( l );
            }

            if( l != '' && markerLine == false ){
                tr.chunkTr.push ( l );
            }   
            
            
        }

        console.log( 'cunks result rult to OBJ \n',tr,{'exitCode':tr.exitCode} );


        


        return tr;
    },  




    // onCmdStrTocmdResConole

    //oven.ovenRuns[ n ].result.chunkTr 
    //or
    //oven.ovenRuns[ n ].result.res
    // or depricated ovenChunksToLine - use this with result and .res 
    cunksResult_resultObject_old( linesIn, asChunkFilter = false ){
        
        console.log('[ chunksResult ] 543 ',(typeof linesIn),' -> ',linesIn);
        if( typeof linesIn == 'string' ){
        
            linesIn = linesIn.split('\n');
            
            
            console.log('[ chunksResult ] mod ['+linesIn+']');
        }
            
            
        
        let tr = {
            'cunksResult_resultObject':1,
            runNo: -1,
            'lines': [],
            chunkTr: [],
            linesC: -1,
            res: [],
            exitCode:undefined,

        };
        
        if( typeof linesIn == 'number' ){
            console.log('[ chunksResult ] EE to number linesIn.. ['+tr.linesC+'].?');
            tr.chunkTr.push( linesIn );
            tr.linesC = 1;
            return tr;
        }
        
        if( linesIn.length == 1 ){
            console.log('[ chunksResult ] EE to small linesIn.. ['+tr.linesC+'].?');
            return tr;
        }
        
        
        if( linesIn.length > 0  ){
            linesIn.findIndex( l => {
                if( l.indexOf('#  runNo:        [ ') != -1 ){
                    let lTmp = l.split('#  runNo:        [ ')[1];
                    tr.runNo = lTmp.split(' ]')[0];
                    return true;

                }
            });
            tr.runNo = linesIn[0].substring( 1 ).split(']')[0];
            
        }


        let lis = [];
        let spDataStart = 0;
        let lNo = 0;
        let cStart = false;
        let templateSpData = `[${tr.runNo}][sp][data] ... `;
        for( let line of linesIn ){
            line.split('\n').forEach(l => {

                if( l != templateSpData && l != '' ){

                    lis.push ( l );
                    
                    if( l.startsWith( msgsCODES['START_STDIO'] ) ){
                        spDataStart = lNo;
                    }
                
                    lNo++
                }   
                
                if( l.indexOf('][sp][data] ...') != -1 ){
                    cStart = true;
                }else if( 
                    l.indexOf(']   # GOGO ... #') != -1 ||
                    l.indexOf(']# [@@] ping client[ ') != -1 ||
                    l == '' ){
                
                }else if( cStart && 1 ){
                    tr.chunkTr.push( l );
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

    

    
    // MOVEd TO OVENMAIN
    getChannelsFreeToArray( adressUrl = undefined ){
        if( adressUrl == undefined ){
            NO
        }
        this.freeChannels = [];
        if( !(adressUrl in this.oven.dir) ){ console.error('no target dir in oven for adressUrl:('+adressUrl+') !\n oven now :\n',this.oven); return 1; }
        let jdir = this.oven.dir[ adressUrl ];
        
        console.log('[oven] ch get free channels list ...',jdir['layout']);
        
        let chnow = jdir['layout']['channels'];
        for(let ci=0,cc=chnow.length; ci<cc; ci++ ){
            if( !( 'rName' in chnow[ ci ] ) ){
                console.log('[oven] ch '+ci+' ... ', chnow[ ci ] );
            
                this.freeChannels.push( '- - - free - - -' ); 
            }else{
                this.freeChannels.push( chnow[ ci ].rName );
            }
            
        }
        
        //this.freeChannels = tr;
    },













    // -----------------------qery to dir / CookBook 's --- START



    onQeryTasksNow(){

        // this.onDoFetch( undefined, '/apis/oven/bakeInPlace/L2hvbWUveW95by9BcHBzL3ZpdGV5c3Mtc2l0ZS0ycWVzdC9vdmVuL2luUGxhY2UyXzI2MDExN3R0MTY1OTM0LjJxZXN0' 
        this.onDoFetch( undefined, 'onQeryTasksNow', '/apis/oven/QTaskList',{
            'onReady':(r)=>{
                let j = JSON.parse( r.join('\n') );
                console.log('[oven] QTaskList result .... ',
                    //JSON.stringify( j ,null,4)
                );
                this.oven.tUpdate = Date.now();
                this.oven.spList = j;

                } 
            });

    },

    onQeryOvenDirUpdate( adressUrl = '', cbOnReady = undefined ){
        console.log('[oven] onQeryOvenDirUpdate -> [ '+adressUrl+' ]' );
        
        this.onDoFetch( undefined, 'onQeryOvenDirUpdate', '/apis/oven/dirUpdate'+adressUrl ,{
            'onReady':(r)=>{
                
                //console.log('5678906789   type('+(typeof r)+') len('+r.length+') '+'test: keys: ['+Object.keys(r)+']\n\n'+`[${r[0]}]`)
                if( r.length != 2 ){ console.error('EE onQeryOvenDirUpdate -> [ '+adressUrl+' ] ... type('+(typeof r)+') len('+r.length+') res:\n',r); }
                let jdir = JSON.parse( `${r.join('')}` );
                console.log('[oven] onQeryOvenDirUpdate -> [ '+adressUrl+' ] ... onReady ', jdir );
                for( let dKey of Object.keys( jdir ) ){
                    this.oven.dir[ dKey ] = jdir[ dKey ];
                } 
                this.getChannelsFreeToArray( adressUrl );
                if( cbOnReady != undefined )
                    cbOnReady( r );
           }
                
       });
       
       
    },

    onQeryOvenDir( adressUrl = ''){
        console.log('[oven] onQeryOvenDir -> [ '+adressUrl+' ]' );
        this.onDoFetch( undefined, 'onQeryOvenDir', '/apis/oven/dir?'+adressUrl ,{
            'onReady':(r)=>{
                if( r.length != 2 ){ console.error('EE onQeryOvenDir -> [ '+adressUrl+' ] ...type('+(typeof r)+') len('+r.length+') res:\n',r); }
                let j = JSON.parse( `${r[0]}` );
                console.log('[oven] onQeryOvenDir -> [ '+adressUrl+' ] ... onReady ', JSON.stringify( j ,null,4) );
                this.oven.dir = j;
                } 
        });
    },

    // -----------------------qery to dir / CookBook 's --- END
















    // ----------------------- cmd

    onSaveToHistory(){
        // cat /proc/cpuinfo | grep -n 'cpu MHz'
        let cmdStr = `${this.$refs.cmdInputRef.value}`;
        if( cmdStr == '' ) return 1;
        let cmdToSaveB64 = btoa( cmdStr );
        let cmdSh = [
            'targetF="$HOME""/.viteyss/oven/history"',
            'echo "# will add to root histary new record ...',
            '# in [ $targetF ]',
            '#"',
            'echo -en "\n## [ notset ]\n#// no description ... `date`\n#cmd:" | tee -a "$targetF"',
            'echo "'+cmdToSaveB64+'" | base64 -d | tee -a "$targetF"',
            'echo "" | tee -a "$targetF"',

            'echo "# --- DONE"',
            

        ].join( '\n' );
        let cmdShB64 = btoa ( this.getCmdEnvHeader()+cmdSh );
        console.log('[oven] on save to history \n#  base64: length ( '+cmdShB64.length+' )\n#  cmd:\n\n'+cmdSh);
        
        this.onDoFetch( undefined, 'onSaveToHistory',  '/apis/oven/cmd0/b64:'+cmdShB64 ,{
            'onReady':(r, resultObject )=>{
                let cmdRes = resultObject;//this.cunksResult_resultObject( r );
                console.log('[oven] on save to history result .... \n',cmdRes );
                if( cmdRes.res.exitCode == '0' ){
                    $.toast( 'New entry in history file ...' );
                }else{
                    $.toast( 'Save new entry in history file ... ERROR' );
                }
            } 
        });
    
    },




    // ----------------------- cmd END


    // ---- env bash export  ----  START
    getCmdEnvHeader( chNo = -1, rName = 'debug_test' ){
        let tr = [
            `# set oven ENV`,
            `export oven_home=$HOME'/.viteyss/oven'`,
            `export oven_adressUrl='${this.oven.adressUrl}'`,
            `export oven_my_chNo='${chNo}'`,
            `export oven_my_rName='${rName}'`,
        ];        
        for( let envN of Object.keys( this.ENVs ) )
            tr.push( `export oven_${envN}='${ this.ENVs[ envN ] }'` );
        
        
        tr.push( `# set oven ENV --- END` );

        return tr.join(';\n')+'\n';
    },
    
    // ---- env bash export  ----  END










    msgWrapInToast( msg ){
        $.toast( msg );
    },


    msgWrapInLog( logObj ){ 
        console.log(`[oven]78888 wrap in logObj`,logObj);
        this.oven.logs.push( {title:'' , entryDate:Date.now(), msg:logObj} );
        //{entryDate: Date.now(), title, msg }

    },

    msgWrapInWidget( msg, targetData ){
        console.log(`[oven] wrap in widget`,msg,' ... target ',targetData);
        let chObj = this.getChannelFromNo( targetData.adressUrl, targetData.chNo );
        //chObj['tPing'] = Date.now();
        //chObj['statusNow'] = 'running';

        //tStart: 0, tPing:0, tEnd: undefined, exitCode: undefined, statusNow:'', resCount:0, result:[] ,
        //widget:'', widgetColor:'012001'


        //chObj['result'] = msg;
        //:style="'background-color:#'+('1'=='0'?'d1d1d1':'f98a6f')+';'"
        chObj['widget'] = `${msg}`;

        //'d1d1d1' : 'f98a6f'
    },

   msgWrapInType( msg, wrapType, targetData = undefined ){
        if( wrapType == 'toast' ){
            this.msgWrapInToast( msg );

        }else if( wrapType == 'log' ){
            // msg - as msgObj
            console.log('[oven wrap in type log] msg typeof [ '+(typeof msg )+' ] \n msg ['+msg+']',);
            this.msgWrapInLog( msg );

        }else if( wrapType == 'widget' ){
            if( targetData != undefined ){
                this.msgWrapInWidget( msg, targetData );
            } else {
                this.msgWrapInLog( msg );
            }

        }else if( wrapType == 'terminal' ){
            console.log(`[oven] msg wrap go to terminal ...`, msg );

        }else{
            console.log('[oven] ee make hook msg wraper nan ',wrapType);
            return 1;
        }

        
        if( targetData == undefined )
            this.msgWrapInLog( msg );

        else if(  this.$refs.ENVHub != undefined ){
            console.log('[over] ENVHub rerouteENV ....');
            
            //chObj['result'] = msg;
            //chObj['widget'] = msg+'xxx';

            this.$refs.ENVHub.reroutENV( `${msg}`, 
                this.getChanneltargetData( targetData )
            );
            
        }

    },












    // to handle adding 
    onEmit_tagsAdd_setENV( event ){
        console.log('[oven] recipe setENV ... event: ',event,'\n\n recipeNow',this.recipeNow);
        this.recipeNow.setENV.push( `${event}` );
        this.recipeNow.setENV.sort();

    },        
    onEmit_tagRemove_setENV( index ){
        this.recipeNow.setENV.splice( parseInt( index ), 1 );
    },

    onEmit_tagsAdd_getENV( event ){
        console.log('[oven] recipe getENV ... event: ',event,'\n\n recipeNow',this.recipeNow);
        this.recipeNow.getENV.push( `${event}` );
        this.recipeNow.getENV.sort();

    },        
    onEmit_tagRemove_getENV( index ){
        this.recipeNow.getENV.splice( parseInt( index ), 1 );
    },




    onSaveSelectorFrom( recipe ){

        // get target channel slot
        if( this.recipeNow.saveChannelNo == -1 ){
            $.toast('EE select first <b>free channel</b>');
            return -1;
        }
        
        
        // colect stuff to str msg
        let msg = JSON.stringify( this.recipeNow, null, 4 );
        let recB64 = btoa( msg ); 
        
        // build bash cmd to do the thing...
        let cmd = [
            `oChanPath="$HOME""/.viteyss/oven${this.oven.adressUrl}/0_ch${this.recipeNow.saveChannelNo}.js"`,
            `echo "# on Save `,
            `# recipe          [ ${this.recipeNow.rName} ]`,
            `# to channel No    [ ${this.recipeNow.saveChannelNo} ]`,
            `# path             [ ${this.oven.adressUrl} ]`,
            `# fullPath         [ $oChanPath ]`,
            `#"`,
            '',
            `if test -e "$oChanPath";then`,
            ' echo "# EE target file exist exit 1";exit 1',
            'else',
            ' echo "# target file OK saving ....[ $oChanPath ]"',
            ' echo "'+recB64+'" | base64 -d > "$oChanPath"',
            ' ls -alh "$oChanPath"',
            'fi',
            '',
            'echo "## ITS OK ##',
            '# update oven directory !! ',
            '#',
            '# new recipe in CookBook ---- DONE"',
        
            ].join('\n');     
        
        
        
        
        
        // send data to api
        
        let postProcessCmd = this.makeHook( 'cmd', cmd, 'Save new recipe', 'raw', 'log' );
        let res = this.onOvenCompact_full( 'nooo custom', 
            postProcessCmd.cmd, 
            postProcessCmd.postProcess, 
            false 
        );
        
        
        // say haw was it 
        
        
        
        // update oven dir if all ok

    },
    

    


    onBeakTheRecipe_asLocalOvenTask( taskName = '', cmd = '' ){
        console.log(`[oven] onBeakTheRecipe_asLocalOvenTask taskName:`,taskName);
        if( taskName == '' || cmd == '' ){
            console.log('[oven] EE onBeakTheRecipe_asLocalOvenTask need to have taskName and cmd');
            return 0;
       }
       this.onProbeSelectorFrom( getDefRecipe( cmd, taskName, taskName ) );
    },

    onProbeSelectorFrom( recipe, targetData = undefined ){

    
        console.log(`[oven] onProbeSelectorFrom - \n\trecipe \n`,
            JSON.stringify( recipe, null, 4),
            '\n\n\ttargetData: \n', 
            targetData );

        let cmdPrefix = '';
        if( targetData != undefined && targetData.chNo )
            cmdPrefix = this.getCmdEnvHeader(   
                targetData.chNo , 
                this.getChannelFromNo( targetData.adressUrl, targetData.chNo ).rName 
            );
        else
            cmdPrefix = this.getCmdEnvHeader();
        

        let postProcessCmd = this.makeHook( 
            recipe.mediumProtocal, 
            recipe.topicAddress, 
            recipe.rName, 
            recipe.valType, 
            recipe.wrapType,
            targetData
        );
     
        
        if( targetData != undefined ){
            let chObj = this.getChannelFromNo( targetData.adressUrl, targetData.chNo );
            //chObj['tStart'] = Date.now();
            //chObj['statusNow'] = 'started';            
        }

        let whilePrefix = '';
        let whileSufix = '';
        if( recipe.liveSes == false && recipe.intervalEverySec != '0' ){
            recipe.liveSes = true;
            whilePrefix = `while true; do `;
            whileSufix = `\nsleep ${recipe.intervalEverySec};done`;
            
        }
        
        let makeItAs = () => {
            this.onOvenCompact_full( 'nooo custom', 
                cmdPrefix + whilePrefix + postProcessCmd.cmd + whileSufix, 
                postProcessCmd.postProcess, 
                recipe.liveSes,
                targetData
            );
        };
        
         makeItAs();
        /*
        if( recipe.liveSes == false && recipe.intervalEverySec != '0' ){
            this.iterators.push(
                setInterval( 
                    () => makeItAs(), 
                    parseInt( recipe.intervalEverySec ) * 1000 
                )
            );
            makeItAs();

        }else{
            makeItAs();
        
        }
        */

    },

    makeHook( mediumProtocal, topicAddress, title, valType, wrapType, targetData = undefined ){
        
        let cmd = undefined;
        let recipe = targetData != undefined ? this.getChanneltargetData( targetData ) : undefined;
        //let msg = undefined;
        

        if( mediumProtocal == 'mqtt' )
            cmd = `mosquitto_sub -t '${topicAddress}' -h 'hu' -p 10883 -V mqttv311`;
        
        else if( mediumProtocal == 'cmd' )
            cmd = topicAddress;
        
        else{
            console.log('EE NAN medium protocal ',mediumProtocal);
            return 1;
        }

        
        let postProcess = ( chunkNo, resToProcess ) => {
           
            //console.log('[oven] -> postprocess have valTypes ',JSON.stringify(this.oven.opts.valType));
            let msgToSend = undefined;
            
            if( this.oven.opts.valType.findIndex(  vts => `${vts}` == `${valType}` ) != -1 ){

                if( resToProcess.exitCode == undefined ){

                    msgToSend = ODdataWrapType( '', resToProcess , valType, recipe );

                }else{

                    msgToSend = ODdataWrapType( '', resToProcess.res , valType, recipe );

                }

                console.log('[oven 6789 - '+valType+'] resToProcessALL ->',resToProcess,"\n\t wrapType:",wrapType,"\n\nmsg to send\n", msgToSend,'\n\ntargetData:\n',targetData);
                this.msgWrapInType(
                   ( wrapType != 'widget' ? `${title}: ( ${valType} ) <br>` : '')+`${ msgToSend }`, 
                    wrapType, targetData 
                );

                if( targetData != undefined ){
                    setTimeout(()=> {
                        console.log('[oven 6789 - '+valType+'] resToProcessALL -> is from channel so delay update ...');
                        this.OvDirKeyCount++
                        },
                        300
                    );
                }




            } else {
                console.log('EE 5678987 valType not supported [',valType,'] is array of ('+resToProcess.length+') \n resToProcess: ',resToProcess);
            }

        };

        
        if( wrapType == 'terminal' ){
            let termNo = '# '+title+' ... '+Date.now();
            cmd = `x-terminal-emulator --title '${termNo}' -e "
                wmctrl -a '${termNo}' \
                || \
                echo '# Focus at terminal not working error ... continue';
                ${cmd};
                
                " `;
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
                    let rWords = result.res[1].split(' ');
                    let percInd = rWords.findIndex(o => o.endsWith('%') );
                    let percIs = parseInt( rWords[ percInd ].replaceAll('%',''));
                    let gigW = rWords.filter( w => w.length > 2 );
                    let gigAvail =  gigW[ 3 ];
                    $.toast({
                        text:`Disk space at home: <br><br>${result.res[1]}<br><div id="${divName}"></div>`,
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




    onOvenCompact_full( compactName = 'disk space', ownCmd = undefined, ownPost = undefined, liveSes = false, targetData = undefined ){

        let cmd = undefined;
        let postProcess = undefined;
        
        let tStart = Date.now();
        let tDelta = undefined;


        let compactByName = this.getByCompactName( compactName );
        
        if( ownCmd != undefined ){
            cmd = ownCmd;
            postProcess = ownPost;

        }else if( compactByName != undefined ){
            let compactObj = compactByName();
            liveSes = compactObj.liveSes;
            cmd = compactObj.cmd;
            postProcess = compactObj.postProcess;
        

        }

        console.log('[oven Starts] ...',{ cmd, postProcess, liveSes });

        // final end
        if( cmd != undefined && liveSes == false ){
        
            let ovenRunItem = this.onDoFetch(
                targetData, 
                'onOvenCompact_full - ReadyOnly', 
                '/apis/oven/cmd0/b64:'+btoa( encodeURIComponent( cmd ) ),{
                'onReady':(r, resultObject )=>{
                    let cmdRes = resultObject;//this.cunksResult_resultObject( r );
                    let resToPass = cmdRes.res;
                    console.log('[oven] onOvenCompact DONE',resToPass ,'\n postprocess:',postProcess,'\n',{'exitCode':cmdRes.res.exitCode} );
                    //this.onQeryTasksNow();
                    if( postProcess != undefined ){
                        postProcess( 0, resToPass );
                    }
                    tDelta = ( (Date.now() - tStart) /1000 );
                    console.log('[oven] onOvenCompact ... loop in '+tDelta +' sec.');
                }
            });
            
            
       

        // stream
        }else if( cmd != undefined && liveSes == true ){
        
            let chunkNo = 0
            

            let ovenRunItem = this.onDoFetch( 
                targetData,
                'onOvenCompact_full - kLive', 
                '/apis/oven/cmd0/b64:'+btoa( encodeURIComponent( cmd ) ),{
                'onChunk':(r, resultObject )=>{
                
                    if( postProcess != undefined && r.lastIndexOf('][sp][data] ...') != -1 ){
                        //let chunkTr = this.cunksResult_resultObject( r );                    
                        console.log('[oven] onOvenCompactChunk  ... ( '+chunkNo+' ) lines [ '+chunkTr.length+' ]... in '+
                            ( (Date.now() - tStart) /1000 )+' sec.\n'+
                            '\n'+r );
                        //this.onQeryTasksNow();
                        if( chunkTr.res.length > 0 ){
                            postProcess( chunkNo, resultObject.res );                            

                        } 
                        
                    }else if( postProcess != undefined && 
                        r.lastIndexOf(']# [@@] ping client[ ') == -1 
                        ){
                        //TODO2//   
                        

                        // now it's doing chunks real
                        postProcess( chunkNo, resultObject.chunkTr );
                    }

                    /*if( postProcess != undefined && r.lastIndexOf('][sp][data] ...') != -1 ){
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
                    */
                    chunkNo++;
                    
                }
            });
            

        }else {
            TODO
        }


    },
    
    




    onCmdStrTocmdResConole( cmd ){
        let bta = btoa(this.getCmdEnvHeader()+cmd);
        // run by cmd 
        let lchunks = [];
        
        console.log(`[oven1] Oven Run CMD ...\n[oven1]#$ [ ${atob( bta )} ]`);
        /*
        let ovenRun = { 
            'onCmdStrTocmdResConole':1,
            runNo:-1,
            cmd,
            tStart: Date.now(),
            res: undefined,
            tEnd: undefined
        };
        */

        this.onDoFetch( undefined, 'onCmdStrTocmdResConole', '/apis/oven/cmd0/b64:'+bta,{
            'onReady':(r, resultObject )=>{
                //let cmdRes = resultObject;//this.cunksResult_resultObject( r );                
                console.log('[oven1]  Oven Run CMD -> res .... ',JSON.stringify(resultObject,null,4) );
                
                //ovenRun.runNo = cmdRes.runNo;
                //ovenRun.res = cmdRes;
                //ovenRun.tEnd = Date.now();
                this.getScreen();
                
                

            },
            'onChunk':(r, resultObject  )=>{
                //let cmdRes = this.cunksResult_resultObject( r );
                console.log('[oven1]  Oven Run CMD -> chunk  .... ',resultObject);
                //ovenRun.result = cmdRes;
                this.getScreen();
            } 
        });
        
        //this.oven.ovenRuns.push( ovenRun );
        this.getScreen();
        
        
            
    },





    onCmdPredefined(){
        this.onDoFetch( undefined, 'onCmdPredefined', '/apis/oven/bakeInPlace/L2hvbWUveW95by9BcHBzL3ZpdGV5c3Mtc2l0ZS0ycWVzdC9vdmVuL2luUGxhY2UyXzI2MDExN3R0MTY1OTM0LjJxZXN0',{
            'onReady':(r)=>{
                console.log('[oven onCmdPredefined] qery tast now result .... ',
                   r
                );

                },
            'onChunk':(r)=>{
                console.log('[oven onCmdPredefined] chunk qery tast now result .... ',
                    r
                );

                } 
            });
            
    },


 /// ------------- for delet 
 
 
    // drop it for cunksResult_resultObject
    ovenChunksToLine( chunks ){
        TODO
        let chunkTr = [];
        let cStart = false;
        for ( let chn of chunks ) {
            let tLines = chn.split('\n');        
            for( let tLine of tLines ){        
                if( tLine.indexOf('][sp][data] ...') != -1 ){
                    cStart = true;
                }else if( 
                    tLine.indexOf(']   # GOGO ... #') != -1 ||
                    tLine.indexOf(']# [@@] ping client[ ') != -1 ||
                    tLine == '' ){
                
                }else if( cStart && 1 ){
                    chunkTr.push( tLine );
                }
            }
        }
        
        return chunkTr;

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

