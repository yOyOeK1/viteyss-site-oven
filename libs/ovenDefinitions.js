

let getDefRecipe = (

    cmd, taskName, chNo = -1

) => { return {
    "autoStatr": false,

    "setENV": [],
    "getENV": [],

    "mediumProtocal": 'cmd',
    "topicAddress": cmd,
    
    "rName": taskName,
    "valType": "raw",
    "wrapType": "log",
    
    "liveSes": false,
    "intervalEverySec": 0,
    "iterator": -1,
    "sharedSession": false,
    "onlyWhenImOnline": true,
    
    "saveChannelNo": chNo,
            
}};



let ODdataWrapType = ( title, data, valType ) => {
        console.log('[ODoven data wrap]('+valType+') ... data typeof ('+(typeof data)+') isArray: ['+Array.isArray( data )+'] \n\ndata:\n',data);
    
        let trWrap = [];
        
    
        if( Array.isArray( data ) ){
            data.forEach( (l,li) => { 
        
                      
    
                if( valType == 'secLeft' ){
                
                    let secRes = msToDurationString( l );
                        trWrap.push( secRes == 'NaNms' ? l : secRes+' sec.' );
                
                
                
                }else if( valType == 'percent' ){
                
                    let w = parseFloat(l);
                    if( typeof w == 'object' ){
                        trWrap.push( l );
                    } else {
                        let divName = 'ooccPerc_'+li+'_'+Date.now();
                        setTimeout(()=>{ 
                            new JustGage({
                                id: divName,
                                value: l,
                                min: 0,
                                max: 100,
                                title: title,
                                donut: true
                                });

                        },200);
                        trWrap.push( `<div id="${divName}"></div>` );                    
                    }
                           
                           
                }else if( valType == 'toString' ){
                
                    console.log('[OD toString] ....',{title, data, valType});            
                    trWrap.push( '<pre>'+l+'</pre>' );
                    
                }else if( valType == 'toBraile' ){

                    let map =       " A1B'K2L@CIF/MSP\"E3H9O6R^DJG>NTQ,*5<-U8V.%[$+X!&;:4\\0Z7(_?W]#Y)=".split("").reduce((o, n, i) => {
                    return o[n] =   "⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿"[i],
                        o[n.toLowerCase()] = o[n], o;
                    }, {});

                    function toBraile(string) {
                        return string.split("").map(c => map[c]).join("");
                    }
                    let bRes = toBraile( l );
                    console.log( bRes );
                    trWrap.push( '<pre>'+bRes+'</pre>' );

                            
                }else if( valType == 'A progress bar' ){
                
                    let w = parseFloat(l);
                    if( typeof w == 'object' || `${w}` == 'NaN'   ){
                        trWrap.push( l );
                    } else {                    
                        let size = 20.00 - 6;
                        let cDone = (size/100.0)*w;
                        let percLen = `${parseInt(w)} `.length;
                        if( cDone > 100.00 || cDone < 0.00 || size <= 0 ) return 'EE apbar '+data;
                        
                        console.log(`[OD apbar debug] w type(${typeof w}) then ... `,{data, w, percLen, size, cDone,'notDone':( size - cDone)});
                        let strDone = '⠶'.repeat( parseInt( cDone ) );
                        let strNot = "⠄".repeat( parseInt( size - cDone )  ); 
                        let tr = `[ ${strDone}${strNot} ]${' '.repeat(4-percLen)}${parseInt(w)}%`;
                        console.log('[OD A progress bar] '+tr);
                        trWrap.push( tr );                   
                   }


                }else if( valType == 'percent bar' ){

                    let divName = 'ooccPerc'+Date.now();
                    let w = parseInt(l);
                    if( typeof w == 'object' ){
                        trWrap.push( l );
                    } else {            
                        let size = [150,20];
                        trWrap.push( `
                        
                        <b style="">
                            ${w} %
                        </b>  
                        <div id="${divName}" style="
                            border: 2px solid black;
                            width:${size[0]+10}px;
                            height:${size[1]}px;
                        
                        ">
                            <div style="border-left:2px solid black;height:${size[1]}px;width:${w}px;background-color: red;display:inline-block;" ></div>
                            <div style="border-left:2px solid black;height:${size[1]}px;width:${size[0]-w}px;background-color: green;display:inline-block;" ></div>

                        </div>` );
                    }
                        
                    
                }else if( valType == 'raw' ){
                    trWrap.push( l );
                    
                }else{
                    console.error('EE2 ODdataWrapType Nan ',valType);
                }
        
            
            });
        
        } else {
            console.error('EE4 ODdataWrapType data is not array!');
            return data;
        
        } 
        
        
        
        return trWrap.join('\n');
        
        
        
    };











export { getDefRecipe, ODdataWrapType }