//console.log('nst main.js GOGO');


import { s_vysovenPage } from '../c_vys_oven_Page.js';
//import { s_vyssettings1Page } from '@viteyss-site-settings1/c_vys_settings1_Page.js';

window['cl'] = ( msg ) => {
    console.log('oven cl :',msg );
};


let pager = {
    wsCallback( msg ){ console.log(`oven ws msg `,msg) },

};


function initoven(){

    wsConnectIn( pager );
	wsConnectOut();





}

document.addEventListener("DOMContentLoaded", function() {
    
    console.log( 'oven init ...' );
    initoven();

    let page = new s_vysovenPage();
   // let settings = new s_vyssettings1Page();

    //settings['o'] = settings;

    window['siteByKey'] = {
        's_vysnovePage' : page,
        //'s_vyssettings1Page': settings
    };

    window['pager'] = {
        currentPage: 1
    };

    page['homeUrl'] = '../';
    page['o'] = { homeUrl: page.homeUrl };
    page['instanceOf'] = {
        ver: 0.1
    };
    document.getElementById('appoven').innerHTML =
        page.getHtml();
    page.getHtmlAfterLoad();

    /*
    window.addEventListener( 'resize', ()=>{
        page.onWindowResize(
            window.innerWidth, window.innerHeight
        ); 
    });
    window.addEventListener( 'keypress', page.onKeypress );
    */

});