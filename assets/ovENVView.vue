<template>
<pre>### ENV 
 | [<a @click="onRefresh()">r</a>] | adressUrl[ {{ this.oven.adressUrl }} ] |
  <i>[i] will be set as $oven_xxx</i>
set's:        
    <small>{{ ENVs.sets.join(' | ') }}</small>
get's:
    <small>{{ ENVs.gets.join(' | ') }}</small>
<!--ENV's:
    {{ JSON.stringify(ENVs, null, 4) }}
-->
</pre>

</template>
<script>
export default{

inject: [ 'oven' ],
data(){
    return {
        ENVs:{
            sets:[],
            gets:[]
        },
           
    };
},
methods:{
    onRefresh(){ 
        let a = this.envsNowSets; 
        a = this.envsNowGets;
    },
},
computed:{
    envsNowSets(){
        console.log('[ENVv] onvs now sets at adressUrl('+this.oven.adressUrl+') \n\t* oven.dir: \n', this.oven.dir );
        if( Object.keys( this.oven.dir ).length == 0 || this.oven.adressUrl == undefined ){
            console.error('so exit');
            return 1;
        }
        
        let channels = this.oven.dir[ `${this.oven.adressUrl}` ].layout.channels;
        let envs = [];
        channels.forEach( (ch, chi)=>{
            console.log('ooss chi: '+chi,ch);
            if( 'setENV' in ch && ch.setENV.length > 0 )
                ch.setENV.forEach( cset => envs.push( cset ) );
        });
        this.ENVs.sets = envs;
    },
    envsNowGets(){
       console.log('[ENVv] onvs now gets at adressUrl('+this.oven.adressUrl+') \n\t* oven.dir: \n', this.oven.dir );
        if( Object.keys( this.oven.dir ).length == 0 || this.oven.adressUrl == undefined ){
            console.error('so exit');
            return 1;
        }
        
        let channels = this.oven.dir[ `${this.oven.adressUrl}` ].layout.channels;
        let envs = [];
        channels.forEach( (ch, chi)=>{
            console.log('oogg chi: '+chi,ch);
            if( 'getENV' in ch && ch.getENV.length > 0 )
                ch.getENV.forEach( cset => envs.push( cset ) );
        });
        this.ENVs.gets = envs;
    }

},



}
</script>
