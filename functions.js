function update(draw=true){
    //ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba("+globalColorback+","+alpha+")";
    ctx.fillRect(0, 0, canvas.width, canvas.height)   
    updateCount++
    calculateBodyInteractions()
    if(draw){
        drawBodies();
    }
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

/**
 * Отрисовка тел
 * @param {array} bodies Массив всех тел для отрисовки
 */
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
                ctx.arc( (bodies[i].position.x + offsetX) / zoom , (bodies[i].position.y + offsetY) / zoom, bodies[i].radius, 0, 2 * Math.PI);
                ctx.fillStyle = bodies[i].color;
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

/**
 * Высчитывание гравитацинонного взаимодействия между всеми телами
 * @param {bodies} Массив тел
 */
function calculateBodyInteractions(){
    /** Расчитывание взаимодействий */
    for (i in bodies){
        let body1 = bodies[i]
        for (j in bodies) {
            if(j == i) { continue}
            if( bodiesToDelete.includes(j) || bodiesToDelete.includes(i) || bodiesToMerge.includes(j) || bodiesToMerge.includes(j)){continue}
            let body2 = bodies[j] 
            //let force  = g * ( ( body1.mass * body2.mass) / Math.pow((Math.abs( Math.sqrt(Math.pow(body1.position.x,2) + Math.pow(body1.position.y,2)) - Math.sqrt(Math.pow(body2.position.x,2) + Math.pow(body2.position.y,2))) ), 2 ))
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
                    
                    body1.color = "#f00";
                    body2.color = "#f00";
                }
            }
        }
       
    }
    if(enableCollison){
        for(let i=0; i < bodiesToMerge.length; i++){
            bodies[bodiesToMerge[i][0]].mass += bodies[bodiesToMerge[i][1]].mass
        }

        for(let i=0; i < bodiesToDelete.length; i++){
            if(debug){
                console.log(bodies[bodiesToDelete[i]]);
                console.log('Deleted '+bodiesToDelete[i]+'\n'+bodies.length);}
            bodies.splice(bodiesToDelete[i]-i, 1)
        }
        bodiesToDelete = []
        bodiesToMerge = []
    }

    /** Изменение координат в соответсвии с изменением  */
    for (i in bodies) {
        bodies[i].position.x += bodies[i].velocity.x  / (bodies[i].mass * massMultiplayer)
        bodies[i].position.y += bodies[i].velocity.y  / (bodies[i].mass * massMultiplayer)
    }
}

/**
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

        let bodyNew = {
            radius: rad,
            mass: m,
            color: '#000',
            velocity:{
                x: randomNumber(-100,100),
                y: randomNumber(-100,100)
            },
            position:{
                x: randomNumber(200,canvas.width-200)*zoom,
                y: randomNumber(200,canvas.height-200)*zoom
            }
        }
        bodies.push(bodyNew)
    }
    console.log(bodies);
}


/**
 * Генерирует планету с телами на её орбите
 * @param {num} number кол-во тел на орбите
 */
function commonOrbit(num){
    for(let i = 1; i<100; i++){
        let bodyNew = { 
            radius: 1,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: 0,
                y: -40
            },
            position:{
                x: center.x+i*5,
                y: center.y
            }
        }
        bodies.push(bodyNew)
    }

    let bodyNew = { 
        radius: 10,
        mass: 600000000,
        color: globalColorregular,
        velocity:{
            x: 0,
            y: 0
        },
        position:{
            x: center.x,
            y: center.y
        }
    }
    
    bodies.push(bodyNew)
    console.log(bodies);
}

function commonTwoDOrbitWing(num){ //Крыло
    for(let i = 1; i<40; i++){
        let bodyNew = { 
            radius: 1,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: 0,
                y: -40
            },
            position:{
                x: center.x+i*10,
                y: center.y
            }
        }
        bodies.push(bodyNew)
    }
    for(let i = 1; i<40; i++){
        let bodyNew = { 
            radius: 0.5,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: 0,
                y: 40
            },
            position:{
                x: center.x+i*10+5,
                y: center.y
            }
        }
        bodies.push(bodyNew)
    }
    let bodyNew = { 
        radius: 5,
        mass: 600000000,
        color: globalColorregular,
        velocity:{
            x: 0,
            y: 0
        },
        position:{
            x: center.x,
            y: center.y
        }
    }
    
    bodies.push(bodyNew)
    console.log(bodies);
}

function commonTwoDOrbitSpiral(num){ //Спираль
    for(let i = 1; i<40; i++){
        let bodyNew = { 
            radius: 1,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: 0,
                y: -40
            },
            position:{
                x: center.x+i*10,
                y: center.y
            }
        }
        bodies.push(bodyNew)
    }
    for(let i = 1; i<40; i++){
        let bodyNew = { 
            radius: 1,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: 0,
                y: 40
            },
            position:{
                x: center.x-i*10-5,
                y: center.y
            }
        }
        bodies.push(bodyNew)
    }
    let bodyNew = { 
        radius: 20,
        mass: 600000000,
        color: globalColorregular,
        velocity:{
            x: 0,
            y: 0
        },
        position:{
            x: center.x,
            y: center.y
        }
    }
    
    bodies.push(bodyNew)
    console.log(bodies);
}

function commonTwoDorbitsDestruct(num){ //2 на самоуничтожение
    for(let i = 1; i<40; i++){
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
    for(let i = 1; i<40; i++){
        let bodyNew = { 
            radius: 1,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: 0,
                y: 40
            },
            position:{
                x: center.x-i*10,
                y: center.y
            }
        }
        bodies.push(bodyNew)
    }
    let bodyNew = { 
        radius: 20,
        mass: 600000000,
        color: globalColorregular,
        velocity:{
            x: 0,
            y: 0
        },
        position:{
            x: center.x,
            y: center.y
        }
    }
    
    bodies.push(bodyNew)
    console.log(bodies);
}

function commonTwoDorbitsCrest(num){ //4 линии
    for(let i = 1; i<40; i++){ //правая
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
    for(let i = 1; i<40; i++){ //верхняя
        let bodyNew = { 
            radius: 1,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: 40,
                y: 0
            },
            position:{
                x: center.x,
                y: center.y-i*10
            }
        }
        bodies.push(bodyNew)
    }
    for(let i = 1; i<40; i++){ //нижняя
        let bodyNew = { 
            radius: 1,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: -40,
                y: 0
            },
            position:{
                x: center.x,
                y: center.y+i*10
            }
        }
        bodies.push(bodyNew)
    }
    for(let i = 1; i<40; i++){ //Левая
        let bodyNew = { 
            radius: 1,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: 0,
                y: -40
            },
            position:{
                x: center.x-i*10,
                y: center.y
            }
        }
        bodies.push(bodyNew)
    }
    let bodyNew = { 
        radius: 20,
        mass: 600000000,
        color: globalColorregular,
        velocity:{
            x: 0,
            y: 0
        },
        position:{
            x: center.x,
            y: center.y
        }
    }
    
    bodies.push(bodyNew)
    console.log(bodies);
}

function commonBinarySystem(num){
    let bodyNew1 = { 
        radius: 2,
        mass: 600000000,
        color: globalColorregular,
        velocity:{
            x: 0,
            y: 95000000
        },
        position:{
            x: center.x+100,
            y: center.y
        }
    }
    let bodyNew2 = { 
        radius: 2,
        mass: 600000000,
        color: globalColorregular,
        velocity:{
            x: 0,
            y: -95000000
        },
        position:{
            x: center.x-100,
            y: center.y
        }
    }
    for(let i=0; i<num; i++){
        let bodyNew = { 
            radius: 1,
            mass: 10,
            color: globalColorregular,
            velocity:{
                x: 0,
                y: 2.5
            },
            position:{
                x: center.x+500+i*70,
                y: center.y
            }
        }
        bodies.push(bodyNew)
    }
    bodies.push(bodyNew1, bodyNew2)
}

function blackHole(num){
    enableCollison = false
    alpha = 1
    let bodyNew1 = { 
        radius: 2,
        mass: 600000000000,
        color: globalColorregular,
        velocity:{
            x: 0,
            y: 0
        },
        position:{
            x: center.x+100,
            y: center.y
        }
    }
    bodies.push(bodyNew1)
    for(let i = 1; i<num; i++){
        let bodyNew = { 
            radius: 1,
            mass: 200,
            color: globalColorregular,
            velocity:{
                x: 0,
                y: -(20*Math.sin(i))*2-200
            },
            position:{
                x: center.x+i + 503,
                y: center.y
            }
        }
        bodies.push(bodyNew)
    }
}

/**
 * @param {a} number min value 
 * @param {b} number max value*/
function randomNumber(a, b){
    return a+(Math.random()*(b-a))
}

function initPreset(id=0){
    if(id==0){
        id=Math.round(randomNumber(0,6))
    }
    if(debug){console.log('selecting animation '+id);}
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
            if(debug){console.log('Main body two-directional orbits');}
            commonTwoDOrbitWing(randomNumber(1,10))
        break;

        case 3:
            if(debug){console.log('Main body two one-directional spiral orbits');}
            commonTwoDOrbitSpiral(randomNumber(1,10))
        break;
            
        case 4:
            if(debug){console.log('Main body two-directional terminating orbit');}
            commonTwoDorbitsDestruct(randomNumber(1,10))
        break;

        case 5:
            if(debug){console.log('Main body four spiral orbits');}
            commonTwoDorbitsCrest(randomNumber(1,10))
        break;

        case 6:
            if(debug){console.log('binarry system with n{1-10} bodies');}
            commonBinarySystem(Math.round(randomNumber(1,10)))
        break;

        case 7:
            if(debug){console.log('Black hole with 200-600 bodies');}
            blackHole(700)
        break;
    }
    // if(Math.round(randomNumber(0,1))){
    //     centerVeiw = true
    // }
    bodyselector = Math.round(randomNumber(1, bodies.length-1))
    if(debug){
        if(centerVeiw){
            console.log('Selected body '+ bodyselector +' for spectating');
        }
    }
}