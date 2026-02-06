<template>
    <span v-if="1">[{{ psNow }}]</span>
    <span v-if="[ 'done ...' ].indexOf( psNow ) > -1" style="color: green;"
        >●</span>
    <span v-if="[ 'error ...' ].indexOf( psNow ) > -1" style="color: red;"
        >●</span>
    <span v-if="[ 'error ...', 'Ready ...', 'done ...'].indexOf( psNow ) > -1"
        >▷</span>
    <div v-if="[ 'working ...'].indexOf( psNow ) > -1"
        style="display: inline;">    
        □
        ◷
        ☢
        |
        ◹
        ◿
    </div>

</template>
<script>
export default{

props:[ 'psNow' ],

}
</script>