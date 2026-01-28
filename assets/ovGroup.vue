<template>



<section :id="gtitle.toLowerCase().replaceAll('#','_').replaceAll(' ','_')"
    v-if="showIt"
    >
    
    
    
<div :style="`
    border: solid ${ isDepth > 4 ? '#dcb ' : 'gray' } 2px; 
    border-radius: 7px;
    margin: 5px;
    margin-left:10px;
    margin-bottom:6px;
    padding: 1px;
    `+( isDepth > 1 ? 
        'display:inline-block; background-color:rgb(234, 234, 234);' 
        : 
        '' 
        )+`
    ${modeStyle}
    `">
    
    <!--
    
    {{ isDepth }} ] 
    -->
    <div 
        style="font-size:75%; margin-top:-10px;
        
        border: solid 2px #9977aa;
        border-radius: 5px;
        background-color: rgb(234, 234, 234);
        display:table;
        margin-left:20px;
        padding-left:20px;
        padding-right:20px;

        ">
        
        <span>{{ gTitle }}<br></span>

    </div>

    
    <slot></slot>
</div>
</section>
</template>
<script>
export default{

inject: [ 'oven' ],
props: [ 'gtitle' ],
data(){

    let isDepth = `${this.gtitle}`.split('#').length;
    let gTitle = `[${ isDepth }]`+(isDepth > 2 ? '# ' : ' ') + this.gtitle;
    
    return {
        showIt:true,
        
        modeNow: 'normal',
        modeStyle: '',
        
        title: this.gtitle.replaceAll('# ','').replaceAll('#',''),
        gTitle,
        isDepth,
        entryDate: Date.now()    
    };

},
mounted(){
    console.log('[ovGroup mount] set screen * gTitle: ', this.title);
    this.oven.screens.groups[ this.gTitle ] = { 
        
        title: `${this.title}`,
        gTitle: `${this.gTitle}` ,
        entryDate: this.entryDate
        
    };
    
    //console.log('[ovGroup mount] set screen \n\t* this.screens.groups: ', this.oven.screens.groups );


},

}
</script>
