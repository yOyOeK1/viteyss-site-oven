<template>

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
        <span v-if="isDepth > 2">[{{ isDepth }}]{{ gtitle }}<br></span>
        <span v-else>
            <b>[{{ isDepth }}]# {{ gtitle }}</b><br>    
        </span>

    </div>

    
    <slot></slot>
</div>
</template>
<script>
export default{
props: [ 'gtitle' ],
data(){
    return {
        isDepth: `${this.gtitle}`.split('#').length
    
    };

},
}
</script>
