<template>

<div :style="`
    border: solid ${ isDepth > 1 ? '#dcb ' : 'gray' } 2px; 
    border-radius: 7px;
    margin: 5px;
    margin-left:10px;
    padding: 1px;
    `">
    
    <!--
    {{ isDepth }} ] 
    -->
    <span v-if="isDepth > 1">
        {{ gtitle }}<br>
    </span>

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
        isDepth: this.gtitle.split('#').length
    
    };

},
}
</script>
