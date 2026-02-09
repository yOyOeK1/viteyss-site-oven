
import { msToDurationString } from '/libs/libsForTime.js';


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
    "sharedSession": true,
    "onlyWhenImOnline": true,
    
    "saveChannelNo": chNo,
            
}};


let getDefENV = ( eName ) => {
    return { 
        eName,
        results:[],
        RXs: [],
        TXs: [],
    }; 
};



let ODdataWrapType = ( title, data, valType, recipe ) => {
        console.log('[ODoven data wrap]('+valType+') ... data typeof ('+(typeof data)+') isArray: ['+Array.isArray( data )+'] \n\ndata:\n',data);
    
        let trWrap = [];
        
    
        if( Array.isArray( data ) ){
            data.forEach( (l,li) => { 
        
                      
    
                if( valType == 'secLeft' ){
                
                    let w = msToDurationString( l );
                    if( typeof w == 'object' ){
                        trWrap.push( l );
                    } else {
                        trWrap.push( w == 'NaNms' ? l : w+' sec.' );
                    
                    }
                
                
                
                }else if( valType == 'percent' ){
                
                    let w = parseFloat(l);
                    if(  typeof w == 'object' || `${w}` == 'NaN'  ){
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

                }else if( valType == 'A small plot' ){
                    // in line as 0,2,3,4,5 [,] - delimiter 
                    let map = " ▁▂▃▄▅▆▇".split(''); // 8 long



                //input list select submit
                }else if( valType == 'input list select submit' ){
                    
                    let fName = "inLisSelSub"


                    console.log('[OD A input list] '+l,' \n recipe ',JSON.stringify(recipe,null,4));
                    if( l != '' )
                        trWrap.push( '[ <a onclick="ovenSelected( \''+recipe.basenameAdressUrl+'\', '+recipe.chNo+', \''+l+'\' );">o</a> ] '+l );                   
                        
                    
                    

                }else if( [ 'A progress bar', 'A progress bar2' ].indexOf( valType ) != -1 ){
                
                    let w = parseFloat(l);
                    if( typeof w == 'object' || `${w}` == 'NaN'   ){
                        trWrap.push( l );
                    } else {        
                        let bTheme = [ ' ⠽','⠿','⠂','⠯ ' ];
                        
                        if( valType == 'A progress bar2' ){ bTheme = [ '[_','▇','_','_]' ]; };
                        
                        let mSize = 16;
                        mSize = parseInt( window.innerWidth / 11 );
                        let size = mSize - 6;
                        let cDone = (size/100.0)*w;
                        let percLen = `${parseInt(w)} `.length;
                        if( cDone > 100.00 || cDone < 0.00 || size <= 0 ) return 'EE apbar '+data;
                        let cNotDone = size - cDone;

                        console.log(`[OD apbar debug] w type(${typeof w}) then ... `,{data, w, percLen, size, cDone,'notDone':( size - cDone)});
                        let strDone = bTheme[1].repeat( parseInt( cDone ) );
                        let strNot = bTheme[2].repeat( (parseInt(size)-1)-parseInt( cDone )  ); 
                        let tr = bTheme[0]+`${strDone}${strNot}`+bTheme[3]+`${' '.repeat(4-percLen)}${parseInt(w)}%`;
                        console.log('[OD A progress bar] '+tr);
                        trWrap.push( tr );                   
                   }
                
                }else if( valType == 'volts' ){

                    let w = parseFloat(l);
                    if( typeof w == 'object' || `${w}` == 'NaN'   ){
                        trWrap.push( l );
                    } else {    
                        trWrap.push( w.toFixed(2)+' volt.' );
                    }
                
                }else if( valType == 'percent bar' ){

                    let divName = 'ooccPerc'+Date.now();
                    let w = parseFloat(l);
                    if( typeof w == 'object' || `${w}` == 'NaN'   ){
                        trWrap.push( l );
                    } else {            
                        let mSize = parseInt( window.innerWidth  ) *0.8;
                        let size = [ mSize ,20.00];
                        let sizeW = ( size[0]/100.00 ) * w ;
                        let styStr = `border-radius:5px;`;
                        trWrap.push( `<div id="${divName}" style="
                            border: 1px solid #7e0707;
                            width: ${size[0]}px;
                            height: ${size[1]}px;
                            position:relative;
                            ${styStr}
                        "><div style="
                            height: ${size[1]}px;
                            left:0;
                            top:0;
                            width:${parseInt(sizeW)}px;background-color: #aeaeb4;
                            display:block;
                            box-shadow: inset 2px 2px 3px #383838;
                            ${styStr}"
                            ></div><div
                            
                            style="
                                height: ${size[1]}px;
                                right:0;
                                top:0;
                                width:${size[0]-parseInt(sizeW)}px;background-color: #f9f0ab;
                                position:absolute;
                                ${styStr}">
                            </div
                        ><b style="position:absolute;left:30px;top:0;">${w} %</b
                        ></div>` );
                    }
                        
                    
                }else if( valType == 'raw' ){
                    trWrap.push( l );
                    
                }else{
                    console.error('EE2 ODdataWrapType Nan ',valType);
                }
        
            
            });
        
        } else {
            console.error('EE4 ODdataWrapType data is not array!');
            return l;
        
        } 
        
        
        
        return trWrap.join('\n');
        
        
        
    };











export { getDefRecipe, getDefENV, ODdataWrapType }
