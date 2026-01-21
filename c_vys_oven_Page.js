import { createApp } from 'vue';
import ovenApp from './assets/ovenApp.vue';


class s_vysovenPage{

  constructor(){
    this.ovenApp = createApp( ovenApp );
    
    this.package = process.env.vy_config.pathsToSitesPackages.find( s=>{ 
      //console.log('2qest package site -> ',s);
      return s.package.name == 'viteyss-site-oven';
    });
    this.package = this.package.package;

  }
  
  get getName(){
    return `Oven`;
  }
    
  
  get getDefaultBackgroundColor(){
    return "#ffffff";
  }
  
  getHtml = () => {

    return `<b>${this.getName}</b><br>
    <img src="${this.homeUrl}assets/ico_mafinOven_64_64.png"><br><!--
    This is a npm package<br>
    viteyss-site-oven<br>
    <pre>
    In Menu: ${this.getName}
    Home url: ${this.homeUrl}
    Ver: ${this.instanceOf.ver}

    More ditails in \`./site.json\`
    </pre>-->
    <div id="ovenApp" >ovenApp holder</div>
    `;

  }

  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);
    this.ovenApp.mount('#ovenApp');
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){

  }

  onMessageCallBack = ( r ) => {
    cl( `${this.getName} [cb] - got msg `);

  }

}

export { s_vysovenPage };
