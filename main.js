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
var centerVeiw = 0
var zoom = 1
var globalColorregular = '#000000' 
var globalColorback = '255, 255, 255' 
var drawMethod = 'alpha' 

var forceMultiplayer = 1; //Болше - быстрее
var massMultiplier = 1; //Больше - медленнее 

var updateCount = 0
var bodyselector = 0
const g = 6.67 * Math.pow(10, -11)

window.onresize = resizeHandle
resizeHandle()

var bodies = [   ]
var bodiesToDelete = []
var bodiesToMerge = []

let Body = class {
    /**
     * @param {number} radius 
     * @param {number} mass 
     * @param {number} vx 
     * @param {number} vy 
     * @param {number} px 
     * @param {number} py 
     * @param {string} color
     */
    constructor(radius=1, mass=1, vx=0, vy=0, px=0, py=0, color='black'){
        this.radius = radius
        this.mass = mass
        this.velocity = {x: vx, y: vy} 
        this.position = {x: center.x + px, y: center.y + py}
        this.color = color
    }
} 

initPreset(Math.floor(randomNumber(0,8)))
// initPreset(7)
drawBodies()
setInterval(update, 1)

setInterval(()=>{
    document.getElementById('sim-speed').innerText = updateCount
    updateCount=0 
},1000)

initMenuVal()
if(drawMethod == 'no_alpha'){
ctx.fillStyle = "rgb("+globalColorback+")";
ctx.fillRect(0, 0, canvas.width, canvas.height)}