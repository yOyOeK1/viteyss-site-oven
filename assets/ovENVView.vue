<template>
<pre>### ENV 
 | [<a @click="onRefresh()">r</a>] | adressUrl [ {{ this.oven.adressUrl }} ] |
  <i>[i] will be set as $oven_xxx TODO</i>
  [i] ENVs [ {{ Object.keys( ENVs ).join(' | ') }} ]<!--

  ##### [fake] injector
   this.$emit('dir-channel-click', { action, 'adressUrl':this.adressUrl, chNo } );
-->
  ##### [set]'s:<!--    
  <small>{{ ENVs.sets.join(' | ') }}</small>
--><span v-for="x,xi,xa in GetsListTXs">
        - `{{ x.eName }}`
        <span v-for="xs in x.TXs">{{ `    * ${xs.adressUrl} / ${xs.chNo} [ ${xs.rName} ]` }}[<a @click="onEmit_asChannel( xs )">e</a>] 
    </span></span>

  ##### [get]'s2:<!--
    <small>{{ ENVs.gets.join(' | ') }}</small>
    --><span v-for="x,xi,xa in GetsListRXs">
        - `{{ x.eName }}`
        {{ x.RXs.map( xs => 
        '    * '+xs.adressUrl+' / '+xs.chNo +` [ ${xs.rName} ]` ).join('\n ooo ')
        }}</span>

</pre>

<!--ENV's:
    {{ JSON.stringify(ENVs, null, 4) }}
-->
<!--
get's:
    <small>{{ ENVs.gets.join(' | ') }}</small>
##### SetsList's:
    {{ JSON.stringify(GetsListRXs, null, 4) }}

    -->
<pre v-if="0">
##### GetsList's:
    {{ JSON.stringify(GetsListTXs, null, 4) }}
</pre>
</template>
<script>
import { getDefENV } from '../libs/ovenDefinitions';

export default{
emits: [ 'dir-channel-click' ],
inject: [ 'oven', 'ENVs' ],
data(){
    return {
        //ENVs:{},
        GetsListTXs: {},
        GetsListRXs: {},
    };
},
computed:{
    envsNowSets(){
       let {envs, getsList} = this.envsNowIO( 's' );
        this.ENVs.sets = envs;
        this.GetsListTXs = getsList;
    },
    envsNowGets(){
   let {envs, getsList} = this.envsNowIO( 'g' );
        this.ENVs.gets = envs;
        this.GetsListRXs = getsList;
    }



},
methods:{

    onEmit_asChannel( getTxItem ){
        console.log( getTxItem );
        this.$emit('dir-channel-click', { 
            'action': 'click', 
            'adressUrl': getTxItem.adressUrl, 
            'chNo': getTxItem.chNo 
        } );
    },


    reroutENV( data, recipe ){

        if( recipe.setENV.length > 0 ){
            
            recipe.setENV.forEach( envName => {
                this.ENVs[ envName ] = data;
               
               

            });
            this.$nextTick();

            recipe.setENV.forEach( envName => {
               if( envName in this.GetsListRXs ){
                    this.GetsListRXs[ envName ]['RXs'].forEach( chRx => {
                        this.onEmit_asChannel( chRx );
                    });
                }

            });


            

        }

    },



    onRefresh(){ 
        let a = this.envsNowSets; 
        a = this.envsNowGets;
    },


    /** 
     g - as getENV
     s - as setENV
     * */ 
    envsNowIO( ioDir = '' ){ 
        let adressUrl = `${this.oven.adressUrl}`;
        console.log('[ENVv] onvs now IO('+ioDir+')\n\t* adressUrl('+adressUrl+') \n\t* oven.dir: \n', this.oven.dir );
        
        if( ioDir == '' || Object.keys( this.oven.dir ).length == 0 || adressUrl == undefined ){
            console.error('so IO('+ioDir+') exit');
            return 1;
        }
        
        let channels = this.oven.dir[ `${adressUrl}` ].layout.channels;
        let envs = [];
        let getsList = {}; // to get fast callback interested in list 
        channels.forEach( (ch, chi)=>{
            console.log('oo('+ioDir+') chi: '+chi,ch);
            
            let ioENVk = ioDir == 'g' ? 'getENV' : 'setENV';
            let ioDirection = ioDir == 'g' ? 'RXs' : 'TXs';
            
            if( ioENVk in ch && ch[ ioENVk ].length > 0 ){
                
                ch[ ioENVk ].forEach( cset => {
                    
                    envs.push( cset );
                    
                    if( !(cset in getsList) )
                        getsList[ cset ] = getDefENV( cset );
                    

                    getsList[ cset ][ ioDirection ].push( {
                        adressUrl,
                        chNo: chi,
                        rName: ch.rName,
                    });

                });
            }


        });
        return {envs, getsList};
    },

},



}
</script>
