const dureedutimer=3000;
const intervalleunite=500;
let duree=0;
console.log(`setting a ${dureedutimer/1000}s`);	

const increment=()=>{
    duree+=intervalleunite;
    console.log(duree);
}

const fintimer=()=>{

    clearInterval(intervalle);
    console.log(`timer finished`);}

const intervalle=setInterval(increment,intervalleunite);
setTimeout(fintimer,dureedutimer);