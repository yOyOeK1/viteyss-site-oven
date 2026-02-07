<style>
.fadeIcons i{
    color: rgba(0, 0, 0, 0.6);
    
}

</style>

<template>

<pre v-if="channels.length > 0 &&  adressUrl != undefined">
title({{ keyCount }}):      [ {{ lTitle }} ]
adressUrl:  [ {{  adressUrl }} ] 
subs: <span> <a @click="onChannelAction( -1, 'sub' )">[ .. ]</a> </span> | <span v-for="sDir,sDiri in dir[ adressUrl ]['layout']['dirList']"><a @click="onChannelAction( sDir, 'sub' )">[{{ sDiri }}] {{ sDir }}</a> | </span>
channels:   [ {{ dir[ adressUrl ]['layout']['channels'].filter( c=>c).length }} / {{ dir[ adressUrl ]['layout']['jIn']['channels'] }} ]
in dir (cashe):    
            <span v-for="dn in Object.keys(dir)">[{{dn}}] </span>

</pre>
<pre v-else>
    CookBook not loaded ...
</pre>

<!--
<div v-if="channelsShow">
    <OvChannel v-for="ch,chi in channels"
        :channel="ch"
        :chi="chi"
        :adressUrl="adressUrl"
        @dir-channel-click="onChannelAction( $event.chNo, $event.action )"
    />
</div>
-->
<div 
    v-if="channels.length > 0 &&  adressUrl != undefined"
    v-for="ch,chi in dir[ adressUrl ]['layout']['channels']"

    :style="{
        'font-family':'monospace',
        //'font-size': '75%',
        padding:'3px',
        margin:'1px',
        'border-radius': '6px',
        border:'3px solid #'+chDatas[ chi ].borderColor
        }"
    >

    <div v-if=" Object.keys(ch).length == 0 ">
        [{{ chi }}] 

    </div>

    


    <div v-else
        :style="
            'min-height: 15px;'+
            getCellBgColor( chi )
        ">

        <div style="display: table-cell;float: right;">
            ({{ chDatas[ chi ].doneList }})

            <OvProcessControll 
                :psNow=" psNow[ chi ] "
                /> | 
            <a 
                :title="'Edit recipe ...'+JSON.stringify( ch, null, 4 )"
                style="color:gray;"
                @click="onChannelAction( chi, 'edit' )"><i class="fa-regular fa-pen-to-square"></i>
            </a>

            <a 
                title="Bake this recipe ..."
                style="color:cadetblue;"
                @click="onChannelAction( chi, 'click' )"><i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>

            
            [ <div v-if="chanIcn.length > 0" v-html="chanIcn[ chi ]"
                style="display:inline;opacity:0.8;"></div> ]
        </div> 
        <div style="
            display: table-cell;
            ">
            [{{ chi }}] 
            - {{ ch['rName'] }}
            <pre v-html="channels[ chi ].widget" class="fadeIcons"></pre><!--
            <pre v-html="chDatas[ chi ].contentW" class="fadeIcons"></pre>
                <pre
                v-if="typeof dir[ adressUrl ]['layout']['channels'][ chi ]['widget'] == 'string' " 
                title="Data as ... widget string" 
                v-html=" dir[ adressUrl ]['layout']['channels'][ chi ]['widget'] "></pre>
            <pre 
            v-else-if="typeof dir[ adressUrl ]['layout']['channels'][ chi ]['widget'] == 'undefined' " 
                title="Data as ... widget undefined"
                >. . .</pre>
            <pre 
                v-else-if="typeof dir[ adressUrl ]['layout']['channels'][ chi ]['widget'] == 'object' "
                title="Data as ... widget object" 
                >is Object {{ JSON.stringify(dir[ adressUrl ]['layout']['channels'][ chi ]['widget'], null, 4) }} </pre>
            <pre 
                v-else
                title="Data as ... else ..."
                >NAN widget typeof: {{ typeof dir[ adressUrl ]['layout']['channels'][ chi ]['widget'] }}</pre>
            -->
        </div>



    </div>

</div>
<pre style="color: black; background-color: white; margin:5px;">
  <i style="color:#abf9ab;">■■◐</i> OK | <i style="color:#ffc4c4;">■■</i> ERR | <i style="color:rgb(253, 253, 217);">■■</i> Not baked
</pre>


</template>
<script>
import OvChannel from './ovChannel.vue';
import OvProcessControll from './ovProcessControll.vue';



export default{
components: {
    OvChannel, OvProcessControll
},
inject: [ 'oven' ],
props: [ 'dir', 'adressUrl', 'keyCount' ],
emits: [ 'dir-channel-click' ],
data(){

   
    return {
        channelsShow: true,
        CookBook: undefined,
        channels: [],
        chanIcn: [],
        psNow: [],
        chDatas: [],
        lTitle : '',
        contentW:'. . .',
        exitCodes:[],
    };
    
},

watch:{
    keyCount(nv,ov){
        //this.onAdressUrl(); 
        for(let i=0,ic=this.channels.length; i<ic; i++)
            this.chDataBuild( i );
    },
    adressUrl(nv,ov){
       this.onAdressUrl();
    }    
},
mounted(){
    this.onAdressUrl();
},
//computed:{},
methods:{
    onAdressUrl(){
        console.log('[ovDir] @@- adressUrl change \n\t* adressUrl: \n', this.adressUrl,'\n\t*dir: ',Object.keys( this.dir ).length );
        
        if( this.dir == undefined || this.adressUrl == undefined ){ 
            setTimeout(()=>{ 
                console.log('[ovDir] @@- adressUrl dir undefined so wait ...');
                this.onAdressUrl();
            },300);
            return 1;
        }

        let CookBook = this.dir[ `${this.adressUrl}` ];
        this.CookBook = CookBook;
        this.lTitle = CookBook['layout']['name'];
   
    

        
        let channels = CookBook['layout']['channels'];
        this.channels = channels;
        //this.channelsShow = false;
        let i;
        let ic = channels.length;
        if( ic != this.chanIcn.length ){
            this.chanIcn = new Array( ic );
            this.psNow = new Array( ic ).fill('ps_init');
            this.chDatas = new Array( ic ).fill({});
        }

        for(i=0 ; i<ic; i++ ){
            this.chanIcn[ i ] = this.getMyWrapTypeIcon( i );
            this.chDatas[ i ] = this.chDataBuild( i );
        }


        if( this.exitCodes.length != ic ){
            this.exitCodes = new Array( ic ).fill( undefined );
        }
        
        //setTimeout(()=> this.channelsShow = true, 500);
    },    
   
    getCellBgColor( chNo ){
        let tr = 'background-color: ';

        if( this.exitCodes[ chNo ] == 0 )
            tr+= '#abf9ab;'; // done exit code 0
        else if( this.exitCodes[ chNo ] > 0 ) 
            tr+= '#ffc4c4;'
        else
            tr+= 'rgb(253, 253, 217);' // not runned 

        return tr
    },

    getMyWrapTypeIcon( chNo ){
        if( this.channels == undefined ) return 1;
        let tchan = this.channels[ chNo ];
        let targetSrc = '<i class="fa-solid fa-at" title="to recipe channel ..."></i>';
        if( tchan.wrapType == 'log' ) targetSrc = '<i class="fa-regular fa-file-code" title="to log ..."></i>';
        else if ( tchan.wrapType == 'toast' ) targetSrc = '<i class="fa-regular fa-note-sticky" title="to toast ..."></i>';
        else if ( tchan.wrapType == 'terminal' ) targetSrc = '<i class="fa-solid fa-square-arrow-up-right" title="to terminal ..."></i>';
        return targetSrc;
    },

    chDataBuild( chNo ){
        let chData = {};

        let workList = 0;
        let doneList = 0;
        let tchan = this.channels[ chNo ];
        let chansC = this.channels.length;
        let targetSrc =  ' . . ';
        /*
        if( tchan.wrapType == 'log' ) targetSrc = '<i class="fa-regular fa-file-code" title="to log ..."></i>';
        else if ( tchan.wrapType == 'toast' ) targetSrc = '<i class="fa-regular fa-note-sticky" title="to toast ..."></i>';
        else if ( tchan.wrapType == 'terminal' ) targetSrc = '<i class="fa-solid fa-square-arrow-up-right" title="to terminal ..."></i>';
        */
              
        let lastRunId = -1;
        this.oven.chsRuns.forEach( (cr,cuni) => {
            if( cr.targetData.chNo == chNo && cr.targetData.adressUrl == this.adressUrl ){
                if( cr.ovenRun.tEnd == undefined ){
                    lastRunId = cuni;
                    workList++;
                    if( tchan.wrapType == 'widget' )
                        targetSrc+=`\n`+cr.ovenRun.chunkTr.join('\n');
                }else{
                    doneList++;

                    this.exitCodes[ cr.recipe.chNo ] = parseInt( cr.ovenRun.res.exitCode );
                }
            }
        });

        if( tchan.wrapType == 'widget' && doneList > 0 && chansC > chNo ){
            targetSrc = `23${tchan.widget} `;
        }

        
        chData['contentW'] = targetSrc;

        if( doneList != 0 ){
            this.psNow[ chNo ] = this.exitCodes[ chNo ] == 0 ? 'done ...' : 'error ...';
            chData['borderColor'] = '00aaff';


        }else if( workList != 0 ){            
            this.psNow[ chNo ] = 'working ...';
            chData['borderColor'] = 'aaff00';        

        }else{
            this.psNow[ chNo ] = 'Ready ...';
            chData['borderColor'] = 'ffaa00';

        }

        chData['doneList'] = doneList;

        return chData;
    },
    onChannelAction( chNo, action = 'click' ){
        if( [ 'click', 'edit', 'sub' ].indexOf( action ) != -1 ){
            //let ch =  dir[ adressUrl ]['layout']['channels'][ chNo ];            
            this.$emit('dir-channel-click', { action, 'adressUrl':this.adressUrl, chNo } );
       
        }else{
            TODO
        }
    }

}

}

</script>
