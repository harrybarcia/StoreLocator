const waitTime=3000;
const waitInterval=500;

let currentTime=0;


const incTime=()=>{
    currentTime+=waitInterval;
    console.log(currentTime);
}

console.log(`setting a ${waitTime/1000}s`);

// timerfinished me stoppe la fontion setTimeout
const timerFinished=()=>{
    clearInterval(interval);
    console.log(`timer finished`);
};


const interval=setInterval(incTime,waitInterval);

// 1er argument est la fonction à lancer, 2ème est le temps d'attente
// cette fonction est lançée
setTimeout(timerFinished,waitTime);