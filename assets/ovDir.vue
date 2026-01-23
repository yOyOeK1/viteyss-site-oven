<template>

<pre>
title:      [ {{ dirNow[ adressUrl ]['layout']['title'] }} ]
dir:        [ {{  adressUrl }} ]
subs: <span v-for="sDir,sDiri in dirNow[ adressUrl ]['layout']['dirList']">[{{ sDiri}}]:{{sDir}} </span>
channels:   [ {{ dirNow[ adressUrl ]['layout']['channels'].filter( c=>c).length }} / {{ dirNow[ adressUrl ]['layout']['jIn']['channels'] }} ]
</pre>


<div v-for="ch,chi in dirNow[ adressUrl ]['layout']['channels']">

    <div v-if=" Object.keys(ch).length == 0 ">
        [ {{ chi }} ] 

    </div>

    <div v-else>
        [ {{ chi }} ] 

        <a 
            title="Bake this recipe ..."
            style="color:cadetblue;"
            @click="$emit('dir-channel-click', ch )"><i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a> 
        - {{ ch['title'] }}
        
    </div>

</div>


</template>
<script>
export default{

props: [ 'dirNow', 'adressUrl' ],
emits: [ 'dir-channel-click' ]


}

</script>