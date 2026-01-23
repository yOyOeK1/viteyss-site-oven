<template>

<div :style="`
    border: solid ${ isDepth > 1 ? '#dcb ' : 'gray' } 2px; 
    border-radius: 7px;
    margin: 5px;
    margin-left:10px;
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
    <div v-if="isDepth > 1"
        style="font-size:75%; margin-top:-10px;
        
        border: solid 2px #9977aa;
        border-radius: 5px;
        background-color: rgb(234, 234, 234);
        display:table;
        margin-left:20px;
        padding-left:20px;
        padding-right:20px;

        ">
        {{ gtitle }}<br>
    </div>

    <span v-else>
        <b># {{ gtitle }}</b><br>    
    </span>
    
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
