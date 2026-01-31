let writeHeadChunke = function( res ) {
    res.writeHead(200,{
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Content-Length':'1042141',
        'Connection': 'keep-alive',
    });

};


export { writeHeadChunke }

