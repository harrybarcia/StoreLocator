const waitTime=3000;
const waitInterval=500;

let currentTime=0;
const incTime=()=>{
    currentTime+=waitInterval;
    console.log(`waiting ${currentTime/1000}ms`);
}

console.log(`setting a ${waitTime/1000}s`);
const timerFinished=()=>{
    clearInterval(interval);
    console.log(`timer finished`);
};

const interval=setInterval(incTime,waitInterval);
setTimeout(timerFinished,waitTime);