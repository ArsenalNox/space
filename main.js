var debug = true
var showCalculationDetails = false

var canvas = document.getElementById('cvs')
var ctx = canvas.getContext('2d')
var alpha = "1"
var readyThreads = 0
var center = {
    x: canvas.width/2,
    y: canvas.height/2
}

var enableCollison = true
var centerVeiw = 0
var zoom = 1
var globalColorregular = '#000' 
var globalColorback = '155,155,155' 

var forceMultiplayer = 1; //Болше - быстрее
var massMultiplayer = 1; //Больше - медленнее 

var updateCount = 0
var bodyselector = 0
const g = 6.67 * Math.pow(10, -11)

window.onresize = resizeHandle
resizeHandle()

var bodies = [   ]
var bodiesToDelete = []
var bodiesToMerge = []

// initPreset(Math.round(randomNumber(0,5)))
initPreset(7)
drawBodies()
// update()
// setInterval(update, 1)
calculateBodyInteractions()
setInterval(()=>{
    console.log(updateCount);
    updateCount=0 
},1000)
/**
color: "#333"
mass: 600000000
position: {x: 960.0008531268458, y: 539.995521472571}
radius: 20
velocity: {x: -6.588758377691109, y: -85.95962999200012}
__proto__: Object

color: "#333"
mass: 200
position: {x: 772.8238107115627, y: 611.323183186142}
radius: 2
velocity: {x: 10.681104679128106, y: 42.72126943622764}
*/