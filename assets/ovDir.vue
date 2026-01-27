<template>

<pre>
title:      [ {{ dir[ adressUrl ]['layout']['title'] }} ]
adressUrl:  [ {{  adressUrl }} ]
subs: <span> <a @click="onChannelAction( -1, 'sub' )">[ .. ]</a> </span> | <span v-for="sDir,sDiri in dir[ adressUrl ]['layout']['dirList']"><a @click="onChannelAction( sDir, 'sub' )">[{{ sDiri }}] {{ sDir }}</a> | </span>
channels:   [ {{ dir[ adressUrl ]['layout']['channels'].filter( c=>c).length }} / {{ dir[ adressUrl ]['layout']['jIn']['channels'] }} ]


ini dir:    <span v-for="dn in Object.keys(dir)">
    * [{{dn}}] </span>

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
            - {{ ch['rName'] }}<pre v-if="dir[ adressUrl ]['layout']['channels'][ chi ]['sp']" v-html="JSON.stringify(dir[ adressUrl ]['layout']['channels'][ chi ]['sp'].result,null,4)"></pre>
        </div>



    </div>

</div>


</template>
<script>
export default{
props: [ 'dir', 'adressUrl' ],
emits: [ 'dir-channel-click' ],
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
