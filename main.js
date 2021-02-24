var debug = true
var showCalculationDetails = false

var canvas = document.getElementById('cvs')
var ctx = canvas.getContext('2d')
var alpha = "0.01"

var center = {
    x: canvas.width/2,
    y: canvas.height/2
}

var enableCollison = true
var centerVeiw = 1
var zoom = 1
var globalColorregular = '#FFF' 
var globalColorback = '0,0,0' 

var forceMultiplayer = 1; //Болше - быстрее
var massMultiplayer = 1; //Больше - медленнее 

var updateCount = 0
var bodyselector = 0
const g = 6.67 * Math.pow(10, -11)

window.onresize = resizeHandle
resizeHandle()

let bodyNew1 = { 
    radius: 20,
    mass: 60000000,
    color: '#333',
    velocity:{
        x: 1610000*2,
        y: 0
    },
    position:{
        x: center.x,
        y: center.y-200
    }
}
let bodyNew2 = { 
    radius: 20,
    mass: 60000000,
    color: '#333',
    velocity:{
        x: -1610000*2,
        y: 0
    },
    position:{
        x: center.x,
        y: center.y+200
    }
}

var bodies = [   ]
var bodiesToDelete = []
var bodiesToMerge = []

let Body = class {
    /**
     * @param {num} radius 
     * @param {num} mass 
     * @param {num} vx 
     * @param {num} vy 
     * @param {num} px 
     * @param {num} py 
     */
    constructor(radius=1, mass=1, vx=0, vy=0, px=0, py=0){
        this.radius = radius
        this.mass = mass
        this.velocity = {x: vx, y: vy} 
        this.position = {x: center.x + px, y: center.x + py}
    }
} 

initPreset(Math.round(randomNumber(0,7)))
// initPreset(6)
drawBodies()
setInterval(update, 1)

setInterval(()=>{
    if( (updateCount==250) || (updateCount>250) ){
        document.getElementById('sim-speed').innerText = '250 (max) '
    } else { 
        document.getElementById('sim-speed').innerText = updateCount
    }
    updateCount=0 
},1000)

ctx.clearRect(0, 0, canvas.width, canvas.height)