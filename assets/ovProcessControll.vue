<template>
    <span v-if="1"
        :title="psNow"
        style="">[{{ psNow.substring(0,3) }}]</span>
    <span v-if="[ 'done ...' ].indexOf( psNow ) > -1" style="color: green;"
        >●</span>
    <span v-if="[ 'error ...' ].indexOf( psNow ) > -1" style="color: red;"
        >●</span>
    <span v-if="[ 'error ...', 'Ready ...', 'done ...'].indexOf( psNow ) > -1"
        >▷</span>
    <div v-if="[ 'working ...'].indexOf( psNow ) > -1"
        style="display: inline;">    
        <a @click="$emit('on-ps-action', 'stop')">□</a>
        <a @click="$emit('on-ps-action', 'continue')">◷</a>
        <a @click="$emit('on-ps-action', 'kill')">☢</a>
        |
        <a @click="$emit('on-ps-action', 'n+')">◹</a>
        <a @click="$emit('on-ps-action', 'n-')">◿</a>
    </div>

</template>
<script>
export default{
emits:[ 'on-ps-action' ],
props:[ 'psNow' ],

}
</script>