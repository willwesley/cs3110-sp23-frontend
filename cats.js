// helper function to get a random int between 100-300
const randomN = () => Math.floor(200 * Math.random()) + 100

// helper to convert screen pixel coords to percent based coords
const eventToPercentCoords = e => {
  const { clientWidth, clientHeight } = document.body
  return [
    e.x/clientWidth,
    e.y/clientHeight,
  ]
}

// drag reference
let dragon;

// cat element constructor
// creates an image element that can be dragged and dblclicked to delete
const makeCat = ({ x, y, n, cid }) => {
  const cat = document.createElement("img")
  cat.src = `//placekitten.com/${n}/${n}`
  cat.draggable = true
  // center image on percent coord
  cat.style.left = `calc(${100 * x}vw - 25px)`
  cat.style.top = `calc(${100 * y}vh - 25px)`

  // prevent clicks on the img from bubbling to the body
  cat.addEventListener("click", e => e.stopPropagation())

  // double click deletes
  cat.addEventListener("dblclick", e => deleteCat(cid))

  // save ref to this cat as well as where on the cat the mouse was at drag start
  cat.addEventListener("dragstart", e => dragon = { cat, x: e.layerX, y: e.layerY })

  cat.addEventListener("dragend", e => {
    // update cat to new center coordinates adjusted by where on the cat the drag started
    updateCat(...eventToPercentCoords({
        x: e.x - dragon.x + 25,
        y: e.y - dragon.y + 25,
      }),n,cid)
    // clear ref for great success
    dragon = null
  })
  return cat
}

// sync with server
const updateCats = async () => {
    const r = await fetch("/api")
    const json = await r.json() // parse response as JSON into an object
    writeCats(json)
}

const writeCats = (json) => {
    const cats = json.map(makeCat) // we expect an array, convert items to cat elements
    document.getElementById("cats").replaceChildren(...cats) // blast the whole body
}

// send a new cat to the server
const addNewCat = (x,y,n) => fetch("/api", { 
  method: "POST",
  body: JSON.stringify({x,y,n})
})

// update an existing cat on the server
const updateCat = (x,y,n,cid) => fetch("/api", { method: "PUT", body: JSON.stringify({
    x,y,cid,n }) })

// delete a cat from the server
const deleteCat = (catId) => fetch(`/api/${catId}`, { method: "DELETE" })

// clicks on the document create a new cat
document.body.addEventListener("click", e => addNewCat(...eventToPercentCoords(e), randomN()))

// this enables drop (see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event)
document.body.addEventListener("dragover", e => e.preventDefault())

// polling solution - simply make the GET every 5 seconds
let polling;
const doPoll = () => {
  if(!polling) {
    polling = setInterval(updateCats, 5 * 1000)
  }
}
const stopPoll = () => {
  clearInterval(polling)
}

// long polling solution - open connection and call 
// a function when the server responds.
let keepLongPolling = false;
/** subscribe a function to the api endpoint /api/subscribe
 * @param subscriber a function to call whenever the server
 *   successfully responds to the long poll
 * @return Promise to do things
 */
const subscribe = async (subscriber) => {
  const response = await fetch("/api/subscribe")
  const json = await response.json()
  if(response.status == 502) {
    // connection timeout, which is fine probably
  } else if(response.status != 200) {
    // other errors are bad. one option is to retry
    // and this is a fancy way to smoosh concept together:
    // we will await a promise that will resolve in a second
    await new Promise(resolve => setTimeout(resolve, 1000))
  } else {
    // api returned something interesting, maybe
    subscriber(json)
  }
  // whatever happened, we'll resubscribe
  if(keepLongPolling) {
    await subscribe(subscriber)
  }
}
// subscribe the writeCats function to that thing.
const doLongPoll = () => {
  keepLongPolling = true
  subscribe(writeCats)
}
const stopLongPoll = () => {
  // technically, this stops after the next long poll completes
  keepLongPolling = false
}

// SSE solution - create an EventSource, and we just need to
// funnel those events to writeCats
let source;
const doSse = () => {
  source = new EventSource("/api/subscribe")
  source.addEventListener("message", e => writeCats(JSON.parse(e.data)))
  source.addEventListener("open", console.log)
  source.addEventListener("error", console.log)
}
const stopSse = () => {
  if(source) {
    source.close()
    source = undefined
  }
}

// Setup the drop down thing.
document.querySelector("#cats~label").addEventListener("click", (e) => {
  e.stopPropagation()
})
document.querySelector("#cats~label").addEventListener("change", (e) => {
  stopPoll()
  stopLongPoll()
  stopSse()
  switch(e.target.value) {
    case "poll":
      doPoll();
      break
    case "longpoll":
      doLongPoll();
      break
    case "sse":
      doSse();
      break
    case "ws":
      alert("Not implemented!");
      break
  }
})

// when the page loads, go ahead and fetch the cats
window.addEventListener("load", updateCats);
// and enable the default sync mode
window.addEventListener("load", doSse);

