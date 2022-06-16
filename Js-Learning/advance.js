import fetch from 'node-fetch'
globalThis.fetch = fetch

console.log("Learning JS");

// arrow function without arguments
const arrowfunction1 = () => (console.log("heello")); 
arrowfunction1();

// arrow function single line
const arrowfunction2 = (a,b) => (console.log("a+b=", a+b)); 
arrowfunction2(2,5);

// arrow function multiple line
const arrowfunction3 = (a,b) => {
    let c = 10;
    return a+b+c;
    }; 
console.log("a+b+c=", arrowfunction3(2,5));

// ternary operator
const tern1 = 15;
const tern2 = 6;
let result = tern1 > tern2 ? "true" : "false";
console.log(result);

// template string
// means we can write a sentence without using the plus sign. 
const age= 18, nam= "Aqib";
const templatestring = `Hi, my name is ${nam} and I am ${age} year old.`;
console.log(templatestring);


// arry map method  
// map aur filter ka syntax same ha but only difference yeh ha k agr hum map use kr rhy hain tu her item array1 ka map hoga new array may.
// jb k filter method array ko filter out krta ha aur new array may filteres array ko return krta ha.
// exmaples of both are given below.
const array1 = [1,2,3,4,5];
const mapresult = array1.map((item) => {
    return item+1;
})
console.log(mapresult);

// array filter method 
const array2 = [1,2,3,4,5];
const filterresult = array1.filter((item) => {
    return item>2;
})
console.log(filterresult);

// array reduce method - return a single value means will return accumulated value 
const array3 = [1,2,3,4,5];
const reduceresult = array1.reduce((accumulated, item) => {
    return accumulated + item;
}, 0);
console.log(reduceresult);

//synchornous means we can perform one task at a time.
//Asynchronous means we can perform multiple task at a time or we dont need to wait for the completion of one task to start a new task.

//callback function - means a function which is passed to another function as a argument.
//aesa function jou ksi dosry function k argument k tor per pass kea jata ha.
//callback function ka sab sy zyada use asynchronous javascript may hota ha.
// above all are the examples of callback function also the below one.
const array4 = [1,2,3,4,5];
const callbackresult = array1.map((item) => {
    return item+1;
})
console.log("Callback function: ", mapresult);

// callback function has several problems if uses multiple time means multiple time in a nested manner.
// in order to tackle that problem the concept of promises comes in place.


// Promises in Javascript.
// A Promise represents something that is eventually fulfilled. 
// A Promise can either be rejected or resolved based on the operation outcome. 
// ES6 Promise is the easiest way to work with asynchronous programming in JavaScript.

const promise = new Promise((resolve, reject) => {
    if (true) {
    resolve("Promise resolved");
}
else{
    reject("Promise rejected");
}
});

promise
.then((result1) => console.log(result1+" yes"), (result1) =>  console.log(result1+" error"));
console.log("bye");


// async is a function, await is something that wait for the promise to fulfill.
// async await - basically its an easy way of writing promises.
// async await return a promise
// await statements wait for the promise to fulfill
// whenever the code encounter the await then it return to the other work and after doing that work then come back to the await.

async function github_api_call(){
    console.log("inside github api call function");
    const response = await fetch('https://api.github.com/users');
    console.log("before response");
    const result = await response.json();
    console.log("result");
    return result;
}

console.log("before calling the github api function");
let res = github_api_call();
console.log("after calling the github api function");
console.log(res);
res.then(data => console.log(data));
console.log("last line of code/");

// Run this code in browser console it gives error in the vscode.
