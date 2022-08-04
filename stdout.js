  
const questions=[
    "name", "age", "phone"];
    const ask=(i=0)=>{
      process.stdout.write(`What is your ${questions[i]}? `);
      process.stdout.write(`>`)
    }
    ask();

    const answers=[];
    process.stdin.on('data', (data) => {
      answers.push(data.toString().trim());
      if(answers.length<questions.length){
        ask(answers.length);
      }else{
        process.exit();
      }
    })

process.on('exit', () => {
  const [name, age, phone] = answers;
  console.log(`
    Name: ${name}
    Age: ${age}
    Phone: ${phone}
  `);
})