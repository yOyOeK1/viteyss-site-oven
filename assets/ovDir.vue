<style>
.fadeIcons i{
    color: rgba(0, 0, 0, 0.6);
    
}

</style>

<template>

<pre>
title:      [ {{ lTitle }} ]
adressUrl:  [ {{  adressUrl }} ] 
subs: <span> <a @click="onChannelAction( -1, 'sub' )">[ .. ]</a> </span> | <span v-for="sDir,sDiri in dir[ adressUrl ]['layout']['dirList']"><a @click="onChannelAction( sDir, 'sub' )">[{{ sDiri }}] {{ sDir }}</a> | </span>
channels:   [ {{ dir[ adressUrl ]['layout']['channels'].filter( c=>c).length }} / {{ dir[ adressUrl ]['layout']['jIn']['channels'] }} ]
in dir (cashe):    
            <span v-for="dn in Object.keys(dir)">[{{dn}}] </span>

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
<div v-for="ch,chi in dir[ adressUrl ]['layout']['channels']"

    :style="{
        'font-family':'monospace',
        //'font-size': '75%',
        padding:'3px',
        margin:'1px',
        'border-radius': '6px',
        border:'3px solid #'+borderColorWorkingStatus( chi )
        }"
    >

    <div v-if=" Object.keys(ch).length == 0 ">
        [{{ chi }}] 

    </div>

    


    <div v-else
        style="min-height: 15px;">

        <div style="display: table-cell;float: right;">
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

            
            [ <div v-html="getMyWrapTypeIcon( chi )"
                style="display:inline;opacity:0.8;"></div> ]
        </div> 
        <div style="display: table-cell;">
            [{{ chi }}] 
            - {{ ch['rName'] }}
            <pre :style="getCellBgColor( chi )" v-html="contentW" class="fadeIcons"></pre><!--
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


</template>
<script>
import OvChannel from './ovChannel.vue';


export default{
components: {
    OvChannel
},
inject: [ 'oven' ],
props: [ 'dir', 'adressUrl' ],
emits: [ 'dir-channel-click' ],
data(){

    let lTitle = this.dir[ this.adressUrl ]['layout']['name'];
   
    return {
        channelsShow: true,
        channels: this.dir[ `${this.adressUrl}` ]['layout']['channels'],

        lTitle,
        contentW:'. . .',
        exitCodes:[],
    };
    
},

watch:{
    adressUrl(nv,ov){
        console.log('[ovDir] @@- adressUrl change \n\t* nv: \n', nv );
        this.channels = this.dir[ `${this.adressUrl}` ]['layout']['channels'];
        this.channelsShow = false;

        if( this.exitCodes.length != this.channels.length ){
            this.exitCodes = new Array( this.channels.length ).fill( undefined );
        }
        
        setTimeout(()=> this.channelsShow = true, 500);
    }    
},
//mounted(){},
//computed:{},
methods:{
   
    getCellBgColor( chNo ){
        let tr = 'background-color: ';

        if( this.exitCodes[ chNo ] == 0 )
            tr+= '#abf9ab;'; // done exit code 0
        else if( this.exitCodes[ chNo ] > 0 ) 
            tr+= '#ffc4c4;'
        else
            tr+= '#ffff005c;' // not runned 

        return tr
    },

    getMyWrapTypeIcon( chNo ){
        let tchan = this.channels[ chNo ];
        let targetSrc = '<i class="fa-solid fa-at" title="to recipe channel ..."></i>';
        if( tchan.wrapType == 'log' ) targetSrc = '<i class="fa-regular fa-file-code" title="to log ..."></i>';
        else if ( tchan.wrapType == 'toast' ) targetSrc = '<i class="fa-regular fa-note-sticky" title="to toast ..."></i>';
        else if ( tchan.wrapType == 'terminal' ) targetSrc = '<i class="fa-solid fa-square-arrow-up-right" title="to terminal ..."></i>';
        return targetSrc;
    },

    borderColorWorkingStatus( chNo ){
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
              

        this.oven.chsRuns.forEach( cr => {
            if( cr.targetData.chNo == chNo && cr.targetData.adressUrl == this.adressUrl ){
                if( cr.ovenRun.tEnd == undefined ){
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
            targetSrc = `${tchan.widget} `;
        }

        
        this.contentW = targetSrc;

        if( workList != 0 ){
            
            return 'aaff00';

        }else if( doneList != 0 ){
            
            return '00aaff';

        }else{


            return 'ffaa00';
        }
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
