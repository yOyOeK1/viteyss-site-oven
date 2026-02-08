let writeHeadChunke = function( res ) {
    res.writeHead(200,{
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Content-Length':'1042141',
        'Connection': 'keep-alive',
    });

};

//msgsCODES['START_STDIO']
let msgsCODES = {
    'START_STDIO': '#GOGOGO ... START',
    'END_STDIO'  : '#GOGOGO ... END',
    'PID_NO'     : '#PID_NO##',
    'PING'       : '# [@@] ping client[ ',
};

let msgsCODESFlat = [];
Object.keys( msgsCODES ).forEach( k => msgsCODESFlat.push( msgsCODES[ k ] ) );


export { msgsCODES, msgsCODESFlat ,writeHeadChunke }

