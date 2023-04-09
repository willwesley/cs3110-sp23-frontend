
const numb = 0b1111;
let foo = `lu lu ${numb}
lu la`;
let bar = "something's \
wierd";
const baz = [1,3,4,5,"something else", true];
baz[3] = "something else";

const obj = {
        nine: 9,
        something: "else",
      }
let key = "nine"

function hiya(name) {
  return "Hello, " + name;
}

const fnworl = function(fn) {
  return fn("worl!");
}

const dowhat = function() {
  return function(youwatm8) {
    console.log(youwatm8)
  }
}

// const hi = fnworl(hiya)
// console.log(hi);
//const thisbeit = dowhat()
//console.log(thisbeit)

//console.log(thisbeit("this is the value"))


//console.log(thisbeit = dowhat())
//console.log(thisbeit)




const multiply = (a, b) => {
  return a * b
}

// console.log(multiply(3,7))


const doubleIt = (a) => multiply(2, a)
const returnObject = () => ({
  how: 2
})

// console.log(returnObject())


// goal: double elements in array
//
let arr1 = [ 1,2,3,4,5,6,7 ]

for(let i = 0; i < arr1.length; i++) {
  arr1[i] = arr1[i] * 2
}

for(let i = arr1.length - 1; i >= 0; i--) {
  arr1[i] = arr1[i] * 2
}

arr1 = arr1.map(doubleIt)

//console.log(arr1)

window.addEventListener("load", () => {
    document.querySelectorAll("a")
      .forEach((a) => {
         a.addEventListener("click", (ev) => {
           ev.preventDefault()
           //ev.stopPropagation()
           console.log("Anchor clicked!")
         })
      })
   document.querySelectorAll("nav")
      .forEach((nav) => {
        nav.onclick = (ev) => console.log("Nav got click event")
    })
    document.querySelectorAll("img")
        .forEach((img) => img.addEventListener("mouseover", 
                    () => console.log("meow")))




  const span = document.createElement("span")
  const innerspan = document.createElement("span")
  innerspan.innerText = "rofl I am the best"
  span.appendChild(innerspan)
  span.innerText = "<h1>I have all of my fingies</h1>"
  document.querySelector("header").appendChild(span)
console.log(span)


  })

