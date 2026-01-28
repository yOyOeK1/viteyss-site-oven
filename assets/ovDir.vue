<template>

<pre>
title:      [ {{ lTitle }} ]
adressUrl:  [ {{  adressUrl }} ] 
subs: <span> <a @click="onChannelAction( -1, 'sub' )">[ .. ]</a> </span> | <span v-for="sDir,sDiri in dir[ adressUrl ]['layout']['dirList']"><a @click="onChannelAction( sDir, 'sub' )">[{{ sDiri }}] {{ sDir }}</a> | </span>
channels:   [ {{ dir[ adressUrl ]['layout']['channels'].filter( c=>c).length }} / {{ dir[ adressUrl ]['layout']['jIn']['channels'] }} ]
in dir (cashe):    
            <span v-for="dn in Object.keys(dir)">[{{dn}}] </span>

</pre>


<div v-for="ch,chi in dir[ adressUrl ]['layout']['channels']"

    :style="{
        'font-family':'monospace',
        //'font-size': '75%',
        padding:'3px',
        margin:'1px',
        'border-radius': '6px',
        border:'1px solid #ccaadd'
        }"
    >

    <div v-if=" Object.keys(ch).length == 0 ">
        [{{ chi }}] 

    </div>

    


    <div v-else
        style="min-height: 15px;">

        <div style="display: table-cell;float: right;">
            <a 
                title="Edit recipe ..."
                style="color:gray;"
                @click="onChannelAction( chi, 'edit' )"><i class="fa-regular fa-pen-to-square"></i>
            </a>

            <a 
                title="Bake this recipe ..."
                style="color:cadetblue;"
                @click="onChannelAction( chi, 'click' )"><i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
        </div> 

        <div style="display: table-cell;">
            [{{ chi }}] 
            - {{ ch['rName'] }}
            <pre v-if="typeof dir[ adressUrl ]['layout']['channels'][ chi ]['widget'] == 'string' " v-html=" dir[ adressUrl ]['layout']['channels'][ chi ]['widget'] "></pre>
            <pre v-else-if="typeof dir[ adressUrl ]['layout']['channels'][ chi ]['widget'] == 'undefined' " >. . .</pre>
            <pre v-else-if="typeof dir[ adressUrl ]['layout']['channels'][ chi ]['widget'] == 'object' " >is Object {{ JSON.stringify(dir[ adressUrl ]['layout']['channels'][ chi ]['widget'], null, 4) }} </pre>
            <pre v-else>NAN widget typeof: {{ typeof dir[ adressUrl ]['layout']['channels'][ chi ]['widget'] }}</pre>
        </div>



    </div>

</div>


</template>
<script>
export default{
inject: [ 'oven' ],
props: [ 'dir', 'adressUrl' ],
emits: [ 'dir-channel-click' ],
data(){

    let lTitle = this.dir[ this.adressUrl ]['layout']['name'];
   
    return {
        lTitle
    };
    
},
mounted(){

    
},
methods:{
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
