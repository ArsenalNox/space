function update(draw=true){
    //ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba("+globalColorback+","+alpha+")";
    ctx.fillRect(0, 0, canvas.width, canvas.height)   
    updateCount++
    calculateBodyInteractions()
    if(draw){
        drawBodies();
    }
    document.getElementById('body-info-quant').innerText = bodies.length
}   

function resizeHandle(){
    if(debug){console.log('Resizing canvas');}
    canvas.width  = window.innerWidth   
    canvas.height = window.innerHeight  
    if(zoom !==1){
        center = {
            x: (canvas.width*zoom)/2,
            y: (canvas.height*zoom)/2
        }
    } else{
        center = {
            x: canvas.width/2,
            y: canvas.height/2
        }
    }
}

function drawBodies(){   //Отрисовка тел
    for (i in bodies) {
        if(centerVeiw){
            if(i == bodyselector){
                ctx.beginPath();
                ctx.arc(center.x, center.y, bodies[i].radius, 0, 2 * Math.PI);
                ctx.fillStyle = 'black';
                ctx.fill();
                ctx.stroke()
            } else {
                offsetX = center.x + (-bodies[bodyselector].position.x);
                offsetY = center.y + (-bodies[bodyselector].position.y);
                ctx.beginPath();
                ctx.fillStyle = bodies[i].color;
                ctx.strokeStyle = bodies[i].color;
                ctx.arc( (bodies[i].position.x + offsetX), (bodies[i].position.y + offsetY), bodies[i].radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke()
            }
            bodies[i].color = globalColorregular
        } else {
            ctx.beginPath();
            if(zoom !== 1){
                ctx.arc(bodies[i].position.x / zoom , bodies[i].position.y / zoom, bodies[i].radius / (zoom/2), 0, 2 * Math.PI);
            } else {
                ctx.arc(bodies[i].position.x, bodies[i].position.y, bodies[i].radius, 0, 2 * Math.PI);
            }
            ctx.fillStyle = bodies[i].color;
            ctx.strokeStyle = bodies[i].color;
            ctx.fill();
            ctx.stroke()
            bodies[i].color = globalColorregular
        }
    }
}

function calculateBodyInteractions(){
    /** Расчитывание взаимодействий */
    for (i in bodies){
        let body1 = bodies[i]
        for (j in bodies) {
            if(j == i) { continue}
            if( bodiesToDelete.includes(j) || bodiesToDelete.includes(i) || bodiesToMerge.includes(j) || bodiesToMerge.includes(j)){continue}
            let body2 = bodies[j] 

            let distance = Math.sqrt(Math.pow(body1.position.x - body2.position.x,2) + Math.pow(body1.position.y - body2.position.y, 2))
            if(distance==0){continue}

            let force = g * ( ( body1.mass * body2.mass) / Math.pow(distance, 2 ))
            if(debug && showCalculationDetails){
                console.log(i,j,force)
                console.log(body1.mass, body2.mass, distance);
            }
            body1.velocity.x += ((body2.position.x - body1.position.x) * force * forceMultiplayer ) 
            body1.velocity.y += ((body2.position.y - body1.position.y) * force * forceMultiplayer ) 
           
            if(enableCollison){ //Если коллизия включена
                let futurePos1 = {
                    x: body1.position.x + (body1.velocity.x / (body1.mass * massMultiplayer)),
                    y: body1.position.y + (body1.velocity.y / (body1.mass * massMultiplayer))
                }
                let futurePos2 = {
                    x: body2.position.x + (body2.velocity.x / (body2.mass * massMultiplayer)),
                    y: body2.position.y + (body2.velocity.y / (body2.mass * massMultiplayer))
                }
                let futuredistance = Math.sqrt(Math.pow(futurePos1.x - futurePos2.x,2) + Math.pow(futurePos1.y - futurePos2.y, 2))
                if( body1.radius + body2.radius > futuredistance ){
                    if(body1.mass > body2.mass){
                        bodiesToMerge.push([i,j])
                        bodiesToDelete.push(j)
                        body1.velocity.x += body2.velocity.x
                        body1.velocity.y += body2.velocity.y
                    } else { 
                        bodiesToMerge.push([i,j])
                        bodiesToDelete.push(i)
                        body2.velocity.x += body1.velocity.x
                        body2.velocity.y += body1.velocity.y
                    }
                }
            }
        }
    }
    if(enableCollison){
        for(let i=0; i < bodiesToMerge.length; i++){
            if(debug){
                console.log('Merging ' + bodiesToMerge[i][0] + ' with ' + bodiesToMerge[i][1]);
            }
            bodies[bodiesToMerge[i][0]].mass += bodies[bodiesToMerge[i][1]].mass
        }
        for(let i=0; i < bodiesToDelete.length; i++){
            bodies.splice(bodiesToDelete[i]-i, 1)
            if(debug){
                console.log('Deleted '+ bodiesToDelete[i] + '\nBodies remain: ' + bodies.length);
            }
        }
        bodiesToDelete = []
        bodiesToMerge = []
        if(bodyselector!==0){
            bodyselector--
        }
    }
    for (i in bodies) {
        bodies[i].position.x += bodies[i].velocity.x  / (bodies[i].mass * massMultiplayer)
        bodies[i].position.y += bodies[i].velocity.y  / (bodies[i].mass * massMultiplayer)
    }
}

/**
 * a_0
 * Заполняет канвас случайными телами
 * @param {times} Кол-во тел
 */
function populate(times=10){
    for(let i = 0; i<times; i++){
        let choice = randomNumber(1, 100)
        let rad, m
        if( choice > 98 ){
            rad = 10
            m = rad*10000000
        } else {
            rad = Math.round(randomNumber(1,5))
            m = rad*1000
        }
        let bodyNew = new Body(rad, m, randomNumber(-100,100), randomNumber(-100,100), randomNumber(200,canvas.width-200), randomNumber(200,canvas.width-200))
        bodies.push(bodyNew)
    }
    console.log(bodies);
}

/**
 * a_1
 * @param {number} num 
 */
function commonOrbit(num){
    for(let i = 1; i<num; i++){
        let bodyNew = new Body(1, 200, 0, -40, i*5, 0)
        bodies.push(bodyNew)
    }
    let bodyNew = new Body(10, 600000000, 0, 0, 0, 0) 
    bodies.push(bodyNew)
}

/**
 * a_2
 * @param {number} num 
 */
function commonTwoDOrbitWing(num){ //Крыло
    for(let i = 1; i<num; i++){
        let bodyNew = new Body(1, 200, 0, -40, i*10, 0)
        bodies.push(bodyNew)
    }
    for(let i = 1; i<num; i++){
        let bodyNew = new Body(0.5, 200, 0, 40, i*10+5, 0)
        bodies.push(bodyNew)
    }
    let bodyNew = new Body(5, 600000000)
    bodies.push(bodyNew)
}

/**
 * a_3
 * @param {number} num 
 */
function commonTwoDOrbitSpiral(num){ //Спираль
    for(let i = 1; i<num; i++){
        let bodyNew = new Body(1, 200, 0, -40, i*20+60, 0)
        bodies.push(bodyNew)
    }
    for(let i = 1; i<num; i++){
        let bodyNew = new Body(1, 200, 0, 40, -(i*20+60), 0)
        bodies.push(bodyNew)
    }
    let bodyNew = new Body(20, 600000000)
    bodies.push(bodyNew)
}

/**
 * a_4
 * @param {number} num 
 */
function commonTwoDorbitsDestruct(num){ //2 на самоуничтожение
    for(let i = 1; i<num; i++){
        let bodyNew = new Body(1, 200, 0, 40, i*10)
        bodies.push(bodyNew)
    }
    for(let i = 1; i<num; i++){
        let bodyNew = new Body(1, 200, 0, 40, -i*10)
        bodies.push(bodyNew)
    }
    let bodyNew = new Body(20, 600000000)
    bodies.push(bodyNew)
}

/**
 * a_5
 * @param {number} num 
 */
function commonTwoDorbitsCrest(num){ //4 линии
    for(let i = 1; i<num; i++){ //правая
        let bodyNew = { 
            radius: 1,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: 0,
                y: 40
            },
            position:{
                x: center.x+i*10,
                y: center.y
            }
        }
        bodies.push(bodyNew)
    }
    for(let i = 1; i<num; i++){ //верхняя
        let bodyNew = new Body(1, 200, 40, 0, 0, -i*10)
        bodies.push(bodyNew)
    }
    for(let i = 1; i<num; i++){ //нижняя
        let bodyNew = new Body(1, 200, -40, 0, 0, i*10)
        bodies.push(bodyNew)
    }
    for(let i = 1; i<num; i++){ //Левая
        let bodyNew = new Body(1, 200, 0, -40, -i*10)
        bodies.push(bodyNew)
    }
    let bodyNew = new Body(20, 600000000)
    bodies.push(bodyNew)
}

/**
 * a_6
 * @param {number} num 
 */
function commonBinarySystem(num){
    let bodyNew1 = new Body(2, 600000000, 0, 95000000, 100, 0)
    let bodyNew2= new Body(2, 600000000, 0, -95000000, 100, 0)
    bodies.push(bodyNew1, bodyNew2)
    for(let i=0; i<num; i++){
        let bodyNew = new Body(1, 10, 0, 2.5, (500+i*70), 0)
        bodies.push(bodyNew)
    }
}

/**
 * a_7
 * @param {number} num 
 */
function blackHole(num){
    enableCollison = 0
    let bodyNew1 = new Body(2, 600000000000, 0, 95000000, 100, 0)
    bodies.push(bodyNew1)
    for(let i = 1; i<num; i++){
        let bodyNew = new Body(1, 150, 0, -120-i/2, (i+503), 0) 
        bodies.push(bodyNew)
    }
}

/**
 * @param {a} number min value 
 * @param {b} number max value
 * */
function randomNumber(a, b){
    return a+(Math.random()*(b-a))
}

function initPreset(id=0){
    bodies = []
    let num=0
    if(id==0){
        id=Math.round(randomNumber(0,7))
    }
    if(debug){console.log('Selected animation '+id);}
    switch(id){
        case 0:
            if(debug){console.log('Random bodies');}
            populate(200)
        break;
    
        case 1:
            if(debug){console.log('Main body orbit');}
            commonOrbit(randomNumber(1,10))
        break;
    
        case 2:
            num = Math.round(randomNumber(20, 100))
            if(debug){console.log(`Main body two-directional orbits with ${num} bodies`);}
            commonTwoDOrbitWing(num)
        break;

        case 3:
            //Я вообще не понимаю как но если оставить let num а не num3 то будет ошибка Reference error num has bеen daclared already (???????) (Объявление было в отдельных кейсах)
            num = Math.round(randomNumber(20, 100))  
            if(debug){console.log(`Main body two one-directional spiral orbits with ${num} bodies`);}
            commonTwoDOrbitSpiral(randomNumber(1,10))
        break;
            
        case 4:
            num = Math.round(randomNumber(20, 100))  
            if(debug){console.log(`Main body two-directional terminating orbit with ${num} bodies`);}
            commonTwoDorbitsDestruct(num)
        break;

        case 5:
            num = Math.round(randomNumber(20, 100)) 
            if(debug){console.log('Main body four spiral orbits');}
            commonTwoDorbitsCrest(num)
        break;

        case 6:
            num = Math.round(randomNumber(20, 100)) 
            if(debug){console.log(`binarry system with ${num} bodies`);}
            commonBinarySystem(num)
        break;

        case 7:
            num = Math.round(randomNumber(200, 700)) 
            if(debug){console.log(`Black hole with ${num} bodies`);}
            blackHole(num)
        break;
    }
  
    bodyselector = Math.round(randomNumber(1, bodies.length-1))
    console.log('Selected body '+ bodyselector +' for spectating');
}