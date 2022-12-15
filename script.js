// Document variables
    
// Scene state variables
    let sceneState = 'start';
    let gameModeList = [
        {id:0, mode:'killer', explain:'hit the drone<br>until it dies'},
        {id:1, mode:'timeout', explain:'how many points <br> can you get in 60s?'},
        {id:2, mode:'training', explain:'no pressure,<br>just shoot and chill.'}]
    let gameMode = gameModeList[0];

// UI & title screen elements
    const toggle = document.getElementById('toggle');
    const sliderMenu = document.getElementById('menu-slider');
    const burgerMenu = document.getElementById('menu-burger');
    const burgerLabel = document.getElementById('burger-label');
    const optionReturn = document.getElementById('option-return');
    const optionSound = document.getElementById('option-sound');
    const optionEndGame = document.getElementById('option-end-game');
    const sliderLabel = document.getElementById('slider-label');  
    const titleScreen = document.getElementById('title-screen');
    const startBtn = document.getElementById('start-btn');
    const timer = document.getElementById('timer');
    const tutorial = document.getElementById('tutorial');
    const skip = document.getElementById('skip');
    const endScreen = document.getElementById('end');
    const previousModeBtn = document.getElementById('previous-game-mode');
    const nextModeBtn = document.getElementById('next-game-mode');
    const gameModeName = document.getElementById('game-mode-name');    
    const modeExplanation = document.getElementById('mode-explanation');    
    const playAgainBtn = document.getElementById('play-again-btn');
    
    
// Game elements
    const backGround = document.getElementById('background');
    const root = document.querySelector(':root');
    const gameArea = document.getElementById('game-area');
    const debugPoints = document.getElementById('debug-points');
    const target = document.getElementById('target');
    const ground = document.getElementById('ground');
    const leftHand = document.getElementById('left-hand');
    const rightHand = document.getElementById('right-hand');
    const trajectoryPoints = document.getElementById('trajectory-points'); 
    const arrowHeadPoints = document.getElementById('arrow-head-points'); 
    const arrowShaftPoints = document.getElementById('arrow-shaft-points'); 
    const arrowEndPoints = document.getElementById('arrow-end-points'); 
    const score = document.getElementById('score'); 
    const currentHit = document.getElementById('current-hit'); 
    const arrowAnimations = document.getElementById('released-arrows');
    const stationaryArrows = document.getElementById('stationary-arrows'); 
    const explosion_10 = document.getElementById('explosion-10');

// Game sounds
    const soundtrack = new Audio('sounds/music.mp3');
    soundtrack.loop = true;
    soundtrack.volume = 0.2;
    const soundBowShoot = new Audio('sounds/bowShoot.wav');
    soundBowShoot.volume = 0.05;
    const soundTargetHit = new Audio('sounds/targetHit.wav');
    soundTargetHit.volume = 0.25;
    const soundDroidHit = new Audio('sounds/droidHit.wav');
    soundDroidHit.volume = 0.15;
    const soundGroundHit = new Audio('sounds/groundHit.wav');
    soundGroundHit.volume = 0.2;
    const soundExplosion = new Audio('sounds/explosion.wav');
    soundExplosion.volume = 0.25;


// Stats elements
    const runScore = document.getElementById("run-score");
    const runTime = document.getElementById("run-time");
    const runMissed = document.getElementById("run-missed");
    const runAtTarget = document.getElementById("run-at-target");
    const runAccuracy = document.getElementById("run-accuracy");
    const runLongestStreak = document.getElementById("run-longest-streak");
    const runPps = document.getElementById("run-pps");

// Perspective variables
    const screen = {
        name: 'screen',
        width: window.innerWidth,
        height: window.innerHeight,
        depth: 0,
    }
    const fov = 39.6;
    const cameraHeight = 1.7;
    const imagePlaneDepth = 0.2;
    const imagePlane = {
        name: 'imagePlane',
        width: 2 * imagePlaneDepth * Math.tan((fov / 2) * (Math.PI) / 180), // window.innerWidth, <<< TU MOZE BYĆ BUG
        height: (2 * imagePlaneDepth * Math.tan((fov / 2 * Math.PI / 180))) * (window.innerWidth / window.innerHeight),
        depth: imagePlaneDepth,
    }
    const imagePlaneScale = imagePlane.width / window.innerWidth;
    const perspective = {
        name: 'perspective',
    }

// Graphical variables
    let totalScore = 0;
    let arrowId = 0;
    let targetSize = 1*1.22;
    let targetSizePixels;
    let targetPosition = {u: 0, v:(1.5-cameraHeight), w:30};
    let targetPositionPixels;
    let arrowSize = 150;
    let leftHandPosition;
    let leftHandSize = getComputedStyle(leftHand).getPropertyValue('--left-hand-size');
    leftHandSize = leftHandSize.slice(0, -2);
    leftHandSize = Number(leftHandSize);
    let rightHandSize = getComputedStyle(rightHand).getPropertyValue('--right-hand-size');
    rightHandSize = rightHandSize.slice(0, -2);
    rightHandSize = Number(rightHandSize);
    let originPosition = {
        X: Number (getComputedStyle(target).getPropertyValue('left').slice(0, -2)),
        Y: Number (getComputedStyle(sky).getPropertyValue('height').slice(0, -2))
    }    
        
// Player input
    let device;
    let leftHandScr = {
        Xs: 0,
        Ys: 0
    };
    let leftHand_uvw = {
        u: 0,
        v: 0,
        w: 0
    }
    let rightHandScr = {
        Xs: 0,
        Ys: 0
    };
    let rightHand_uvw = {
        u: 0,
        v: 0,
        w: 0
    }
    let leftHandDistance = 1.4;
    let rightHandDistance = 0.7;
    let shotTrajectory;
    
// Mode - specific variables
    let debugMode;
    let soundMode = false;
    let optionsMode = false;
    
// Physics variables
    const g = 9.8; // m/s
    let time = 0;  // time will start at arrow release.
    let slowMoFactor = 1.0; // this variable will be used to slow time for debug or fun.
    const arwLng = 0.85; // arrow length
    let arwSpdAtRel; // Arrow speed at release
    let arwSpd; // for storing current arrow speed
    let arwVecAtRel; // Arrow vector at release
    let arwVec; // for storing current arrow vector
    let arwHead;
    let arwEnd;
    let hitTime;
    
// Bow variables            
    let v0 = 40; // this will be a complex equation later.
    let shotPreviewSteps = 16;
    let arrowShaftPointsCount = 64;

// Animation variables
    let animation_fps = 30;

// Gameplay variables
    let droneHp = 200;
    let runStart; // this is the time when a run started
    let timeoutDuration = 60; //[s]
    timer.innerHTML = timeoutDuration;
    let tutorialSkipped = false;
    let stopSignal = false;



//

// Known bugs to fix:
    // 1. DONE - Arrows should have a variable z-index applied, based on w coordinate, so that they vanish behind the target.
    // 2. Desktop-specific event listeners to enable desktop browser support.
    // 3. Zooming in on mobile doesn't work as intended.
    // 4. Performance issues with 4+ arrows in the air simultaneously.
    // 5. Arrow spine doesn't have its spine width animated.
    // 6. All width variables should be parametrized, not specified locally.
    // 7. All variable declarations should be moved to the top.
    // 8. General code clean-up is needed.
    // 9. On mobile devices, unwanted arrow releases occur with double-tap or with very short swipes. Exact reason needs to be found.
    // 10. Target framerate is 60 fps. Should be achievable after optimizations.
    // 11. After turning the mobile screen to horizontal, the page needs a refresh. That can be super annoying if it happens mid-game!
    // 12. Hit scores sometimes display properly for 2.5s, but often (50% of the time) they just flash for a moment.
    // 13. DONE - Performance issues while aiming. Reason unknown. // Reason: SVG background melts the GPU.
    // 14. DONE - The target feels a few centimeters off to the top in relation to trajectory hint. Possible reasons:
    //      a) player's finger can move a little on release -> no fix needed. NO
    //      b) trajectory hint is wrong. -> fix YES, KINDA.
    //      c) displayed target position is wrong -> fix
    // 15. Target PNG's position should be paramatrized to scale and move according to target distance parameter.
    // 16. DONE - Make hitbox of the target bigger, so that the arrow gets stuck in the spaceship properly.
    // 17. Debug button is inaccessible.
    // 18. Double-tapping releases an arrow. This enables an exploit allowing to score 2000+ points / minute.
    // 19. Sometimes time calculation gets messed up.
    // 20. On mobile there are seemingly random freezes that are not reproducable on desktop.
    
    
//

// Possible optimizations:
    // 1. All depth calculations can be made beforehand. We just need an array with width percentages at certain depths.
    // 2. Arrowheads should vanish after hitting the target / ground.
    // 3. Arrow animation function can be rewritten so that it skips some frames when overloaded.
    // 4. There are multiple points in the code, where a certain thing is calculated again, despite being calculated before.
    // 5. Suspect performance killers: display and loop functions. Some are calculating dozens of arrays, but could calculate just one,
    //    or have data passed from another function, that calculated sth earlier.
    // 6. Add preload of images.

//

// Graphics features wishlist:
    // 1. DONE - UI, arrow & hands recoloring to match new art direction.
    // 2. DONE - Simple light FX after hitting "10".
    // 3. DONE - Target startup animation.
    // 4. DONE - Target after hit animation.
    // 5. DONE - Polish midground of the background image.
    // 6. DONE - Custom number colors after hits.
    // 7. Static background animation.
    // 8. Special FX after hitting the target / ground.
    // 9. DONE - After getting new points, score counter should light up a little.
    // 10. Animate 10 explosion and scene lighting.
//

// Gameplay features wishlist:
    // 1. DONE - Start screen.
    // 2. End screen.
    // 3. DONE - Instructions on start screen.
    // 4. DONE - Name of the game.
    // 5. DONE - 2-3 different game modes: 1) Killer 2) Chill 3) Timeout
    // 6. Add shop screen with bow and arrow upgrades.
    // 7. Equipment screen.
    // 8. Leaderboard.
    // 9. DONE - Streak mechanics after hitting 2+ "10s" in a row.
    // 10. Options screen.
    // 11. Credits screen.
    // 12. Move Debug switch to options.
    // 13. Add health bar to the drone in killer mode.
//

// Sound features wishlist:
    // 0. Add sound switch.
    // 1. Sound FX on: bow draw, release, target hit, ground hit, 10 hit.
    // 2. Soundscape for the scene.
    // 3. Try if music works well or not.
    // 4. Add sound options.
//









// GLOBAL UTILITIES SECTION ////////////////////////////////////////////////////////           

// Add event listeners
    // soundToggle.addEventListener('touchstart', toggleSound);
    toggle.addEventListener('click', toggleSound);
    // gameArea.addEventListener('mousedown', mouse);
    // gameArea.addEventListener('mousedown', gameStarted);
    // gameArea.addEventListener('mousemove', rightHandAim);
    // gameArea.addEventListener('mouseup', rightHandAim);
    startBtn.addEventListener('touchstart', touch);
    // gameArea.addEventListener('touchstart', gameStarted);
    startBtn.addEventListener('touchend', tutorialStarted);
    // gameArea.addEventListener('touchcancel', touchCancelled);
    // gameArea.addEventListener('touchmove', touchMoved);

//

// Device recognition           
    function mouse () {
        device = 'mouse';
        gameArea.removeEventListener('mousedown', mouse);
        console.log(device);
        return device;
    };
    function touch () {
        device = 'touch';
        gameArea.removeEventListener('touchstart', touch);
        console.log(device);
        return device;
    };
//

// Point array formatting function
    // Input format: [num0, num1, num2, num3, num4... numn];
    // Target format: {id:0, u:0, v:10, w:-cameraHeight};
    
    function pointArrayToObjects(pointArray) {
              
        let objectCollection = [];
        let pointObject;
        let chunkSize = 3;
        let chunk;
        for (let i = 0; i < pointArray.length; i += chunkSize) {
            chunk = pointArray.slice(i, i + chunkSize);
            pointObject = {
                u: chunk[0],
                v: chunk[1],
                w: chunk[2]
            }

            objectCollection.push(pointObject);
        };
        objectCollection = objectCollection.filter( Boolean );
        return objectCollection;
        }
//

// Create DOM element from string

    function createElementFromHTML(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
    
        return div.firstElementChild;
    }

//

// General functions

    function vectorLength (input_vector) {
        let result;
        if (input_vector.length === 2 && input_vector.length === 2) {
            result = Math.sqrt( Math.pow(input_vector[0], 2) + Math.pow(input_vector[1], 2));
        } else if (input_vector.length === 3 && input_vector.length === 3) {
            result = Math.sqrt( Math.pow(input_vector[0], 2) + Math.pow(input_vector[1], 2) + Math.pow(input_vector[2], 2));
        } else {
            result = 'Invalid input.'
        };
        return result;
    };

    function setVectorMagnitude (input_vector, num) {
        let result;
        let multiplier = num / vectorLength(input_vector);
        if (input_vector.length === 2 && input_vector.length === 2) {
            result = [input_vector[0] * multiplier, input_vector[1] * multiplier]; 
        } else if (input_vector.length === 3 && input_vector.length === 3) {
            result = [input_vector[0] * multiplier, input_vector[1] * multiplier, input_vector[2] * multiplier];
        } else {
            result = 'Invalid input.'
        };
        return result;
    }

    function distance (point1, point2) {
        let result;
        let pt1;
        let pt2;
        let isPt1Array = Array.isArray(point1);
        let isPt2Array = Array.isArray(point2);

        if (Array.isArray(point1)) {
            pt1 = point1;
        } else {
            pt1 = Object.values (point1);
        };

        if (Array.isArray(point2)) {
            pt2 = point2;
        } else {
            pt2 = Object.values (point2);
        };

        point1;
        if (pt1.length === 2 && pt2.length === 2) {
            result = Math.sqrt( Math.pow((pt2[0] - pt1[0]), 2) + Math.pow((pt2[1] - pt1[1]), 2));
        } else if (pt1.length === 3 && pt2.length === 3) {
            result = Math.sqrt( Math.pow((pt2[0] - pt1[0]), 2) + Math.pow((pt2[1] - pt1[1]), 2) + Math.pow((pt2[2] - pt1[2]), 2));
        } else {
            result = 'Invalid input.'
        };
        return result;
    };

    function crossProduct (vec1, vec2) {
        let result;
        if (vec1.length === 3 && vec2.length === 3) {
            result = [(vec1[1]*vec2[2] - vec1[2]*vec2[1]), (vec1[2]*vec2[0] - vec1[0]*vec2[2]), (vec1[0]*vec2[1] - vec1[1]*vec2[0])];
        } else {
            result = 'Invalid input.'
        };
        return result;
    };

    function dotProduct (vec1, vec2) {
        let result;
        if (vec1.length === 2 && vec2.length === 2) {
            result = (vec1[0]*vec2[0] + vec1[1]*vec2[1]);
        } else if (vec1.length === 3 && vec2.length === 3) {
            result = (vec1[0]*vec2[0] + vec1[1]*vec2[1] + vec1[2]*vec2[2]);
        } else {
            result = 'Invalid input.'
        };
        return result;
    };

    function vectorFromPoints (input1, input2) {
        let result;
        let vec1 = Object.values(input1);
        let vec2 = Object.values(input2);

        if (vec1.length === 2 && vec2.length === 2) {
            result = [vec2[0] - vec1[0], vec2[1] - vec1[1]];
        } else if (vec1.length === 3 && vec2.length === 3) {
            result = [vec2[0] - vec1[0], vec2[1] - vec1[1], vec2[2] - vec1[2]];
        } else {
            result = 'Invalid input.'
        };
        
        return result;
    };

    function multiplyVector (vec, multiplier) {
        let result;
        if (vec.length === 2) {
            result = [vec[0]*multiplier, vec[1]*multiplier];
        } else if (vec.length === 3) {
            result = [vec[0]*multiplier, vec[1]*multiplier, vec[2]*multiplier];
        } else {
            result = 'Invalid input.'
        };
        return result;
    };

    function series (startNumber, endNumber, count) {
        let result = [];
        let step = ( endNumber - startNumber ) / ( count - 1 );

        for ( i = 0; i < count; i++) {
            let y;
            y = startNumber + step * [i];
            result.push(y); 
        }
        return result;
    }

    // console.log(series(0, 10, 10));

    function interpolatePts (point1, point2, count) {
        let result = [];
        let stepX = ( point2[0] - point1[0] ) / ( count - 1 );
        let stepY = ( point2[1] - point1[1] ) / ( count - 1 );
        let stepZ = ( point2[2] - point1[2] ) / ( count - 1 );

        for ( i = 0; i < count; i++) {
            let point;
            point = [(point1[0] + stepX * [i]), (point1[1] + stepY * [i]), (point1[2] + stepZ * [i])];
            result.push(point); 
        }
        return result;
    }


    let a = 1;
    let b = 2;
    let c = -3;

    function solveQuadraticEquation (a, b, c) {
        let delta;
        let result1;
        let result2;
        let result;
        delta = Math.pow(b, 2) - 4 * a * c;
        if (delta > 0) {
            result1 = ( - b - Math.sqrt(delta)) / ( 2 * a );
            result2 = ( - b + Math.sqrt(delta)) / ( 2 * a );
            result = [result1, result2];
        } else if (delta = 0) {
            result = - b / ( 2 * a );
        } else {
            result = 'no solution';
        }
        return result;
    };

    function vectorAngle (vec1, vec2) {
        let result;
        if ((vec1.length === 2 && vec2.length === 2) || (vec1.length === 3 && vec2.length === 3)) {
            result = Math.acos( dotProduct(vec1,vec2) / ((vectorLength(vec1) * vectorLength(vec2))) )
        } else {
            result = 'Invalid input.'
        };
        return result;
    }

    function planeVecVecPt (vec_x=[], vec_y=[], origin=[]) {
        result = {type: 'plane', xAxis: [0, 0, 0], yAxis: [0, 0, 0], zAxis: [0, 0, 0], origin: [0, 0, 0]}; // this is the plane object format we'll be using.
        if (vectorAngle (vec_x, vec_y) === Math.PI/2) {
            result.type = 'plane';
            result.xAxis = vec_x;
            result.yAxis = vec_y;
            result.zAxis = crossProduct(vec_x, vec_y);
            result.origin = origin;
        } else {
            result = 'Invalid input.'
        };
        return result;
    };
    
    // test = vectorAngle([1, 0, 0], [0, 1, 0]);
    // console.log(test);
    // // vec = [0, 1, 0];
    // // console.log(vec.length)
    // console.log(planeVecVecPt ([-1, 0, 0], [0, 1, 0], [0, 0, 0]));
    
    function changeOrigin (plane, newOrigin) {
        let result = {type: 'plane', xAxis: [0, 0, 0], yAxis: [0, 0, 0], zAxis: [0, 0, 0], origin: [0, 0, 0]};
        if ((plane.type === 'plane' && newOrigin.length === 3) || (plane.type === 'plane' && newOrigin.length === 2)) {
            result.type = 'plane';
            result.xAxis = plane.xAxis;
            result.yAxis = plane.yAxis;
            result.zAxis = plane.zAxis;
            result.origin = newOrigin;
        } else {
            result = 'Invalid input.'
        };

        return result; 
    };

    function move (point, vector) {
        let result;
        let pt;

        if (Array.isArray(point)) {
            pt = point;
        } else {
            pt = Object.values(point);
        };

        if (vector.length === 2) {
            result = [pt[0] + vector [0], pt[1] + vector [1]];
        } else if (vector.length === 3) {
            result = [pt[0] + vector [0], pt[1] + vector [1], pt[2] + vector [2]];
        } else {
            result = 'Invalid input.'
        }
 

        return result; 
    };

    function msToMinutesAndSeconds(ms) {
        let result;
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);
       
        if (seconds == 60) {
            result = `${minutes + 1}:00`
        } else if (seconds < 10){
            result = `${minutes}:0${seconds}`
        } else {
            result = `${minutes}:${seconds}`
        }
        return result;
    }

    function average (array) {
        let result;
        let sum = 0;
        for (i=0; i< array.length; i++) {
            sum +=  parseInt( array[i], 10 );
        }
        result = sum / array.length;
        return result;
    }

    function sum (array) {
        let sum = 0;
        for (i=0; i< array.length; i++) {
            sum +=  parseInt( array[i], 10 );
        }
        return sum;
    }
    
//

// General graphic functions

    let arrowLine;

    function line (point1_xy, point2_xy, width, target_div, _class) {
        let result;
        let center;
        let style;
        let length;
        let angle;
        let correctionX = 0;
        let correctionY = 0;
        // We have an endpoint in screen coordinates. To calculate relative width of the arrow, we need to calculate its position to uvw space.
        point1_xy = Object.values(point1_xy);
        point2_xy = Object.values(point2_xy);

        length = distance(point1_xy, point2_xy);
        
        if (point1_xy[1] < point2_xy[1]) {
            angle = vectorAngle(vectorFromPoints(point1_xy, point2_xy), [1, 0]);
        } else {
            angle = -vectorAngle(vectorFromPoints(point1_xy, point2_xy), [1, 0]);
        }

        let correctionVec;
        correctionVec = vectorFromPoints(point1_xy, point2_xy);
        correctionVec = [-correctionVec[1], correctionVec[0]];
        correctionVec = setVectorMagnitude(correctionVec, (width)/2);

        result = `
            <div class="${_class}" style="
                position: absolute;
                top: ${point1_xy[1]}px;
                left: ${point1_xy[0]}px;
                height: ${width}px;
                width: ${length}px;
                transform-origin: 0px 0px;
                transform: translate(${-correctionVec[0]}px, ${-correctionVec[1]}px) rotate(${angle}rad);
                "></div>
                `;
        target_div.innerHTML = result;
        arrowLine = result;
        // return result;
    };

    // function line_uvw (point1_xy, point2_xy, width, target_div, _class) {
    //     let result;
    //     let center;
    //     let style;
    //     let length;
    //     let angle;
    //     let correctionX = 0;
    //     let correctionY = 0;
    //     // We have an endpoint in screen coordinates. To calculate relative width of the arrow, we need to calculate its position to uvw space.
    //     let endPt_xy = screenToImagePlane (point2_xy); 
    //     let endPt_uvw = imagePlaneToPerspective( endPt_xy, imagePlaneDepth) 
    //     let sizeRefPt = [endPt_uvw.u + width, endPt_uvw.v, endPt_uvw.w];
    //     point1_xy = Object.values(point1_xy);
    //     point2_xy = Object.values(point2_xy);

    //     length = distance(point1_xy, point2_xy);
        
    //     if (point1_xy[1] < point2_xy[1]) {
    //         angle = vectorAngle(vectorFromPoints(point1_xy, point2_xy), [1, 0]);
    //     } else {
    //         angle = -vectorAngle(vectorFromPoints(point1_xy, point2_xy), [1, 0]);
    //     }


    //     // Relative width calculation
        
        
    //     // console.log(sizeRefPt);

    //     console.log(endPt_uvw, sizeRefPt)
        
    //     let sizeRefPtOnImagePlane = perspectiveToImagePlane(sizeRefPt, imagePlaneDepth);
    //     console.log(endPt_xy, sizeRefPtOnImagePlane);
    //     let sizeScale = distance(endPt_xy, sizeRefPtOnImagePlane);
    //     console.log(sizeScale);
    //     // let initialSize = distance(perspectiveToImagePlane([0,0,imagePlaneDepth], imagePlaneDepth), perspectiveToImagePlane( [size, 0, imagePlaneDepth] , imagePlaneDepth));
    //     let currentSize = Math.ceil(sizeScale * width);

    //     let correctionVec;
    //     correctionVec = vectorFromPoints(point1_xy, point2_xy);
    //     correctionVec = [-correctionVec[1], correctionVec[0]];
    //     correctionVec = setVectorMagnitude(correctionVec, ((width)/2)*currentSize);

    //     result = `
    //         <div class="${_class}" style="
    //             position: absolute;
    //             top: ${point1_xy[1]}px;
    //             left: ${point1_xy[0]}px;
    //             height: ${width * currentSize}px;
    //             width: ${length}px;
    //             transform-origin: 0px 0px;
    //             transform: translate(${-correctionVec[0]}px, ${-correctionVec[1]}px) rotate(${angle}rad);
    //             "></div>
    //             `;
    //     target_div.innerHTML = result;
    //     // return result;
    // };

//
    

// Perspective transformer functions
    
    /* We'll have 4 coordinate systems:

      - screen         [Xs,Ys],   2D, with screen top left as origin,       units: pixels;
      - scrAtOrg       [Xo,Yo],   2D, with Vp (vanishing point) as origin   units: pixels;
      - imagePlane     [x,y,z],   2D, with Vp (vanishing point) as origin   units: meters;
      - perspective    [u,v,w],   3D, with camera as origin                 units: meters;

    We need functions to transform the coordinates of a point, 
    given in one of these coordinate systems into a needed coordinate system. */



    // Transform: screen -> imagePlane
        
        function screenToImagePlane (input_XsYs) {
            let reorientedPoint = {
                x: 0,
                y: 0,
                z: imagePlaneDepth,
            }

            let input_Xs = input_XsYs.Xs;
            let input_Ys = input_XsYs.Ys;

            reorientedPoint.x = (input_Xs - screen.width / 2) * imagePlaneScale; // Multiplying by imagePlaneScale lets us go directly from scrAtOrg to imagePlane
            reorientedPoint.y = (originPosition.Y - input_Ys) * imagePlaneScale; 

            return reorientedPoint; 
        }

    //

    // Transform: imagePlane -> perspective
        // this one needs an additional variable of depth.

        // It actually can be used for ANY plane (?).
        
        function imagePlaneToPerspective(input_xyz, depth) {
            let pointInPerspective = {
                u: 0,
                v: 0,
                w: depth
            };
            let input_x = input_xyz.x;
            let input_y = input_xyz.y;
            let input_z = input_xyz.z;

            pointInPerspective.u = input_x * depth / input_z;
            pointInPerspective.v = input_y * depth / input_z ;
            pointInPerspective.w = depth;
            
            return pointInPerspective;
        }
        
    //

    // Transform: perspective -> imagePlane
        
        function perspectiveToImagePlane (input_uvw, depth) {
            let pointOnImagePlane = {
                x: 0,
                y: 0,
                z: 0
            }
            let input_u;
            let input_v;
            let input_w;

            // console.log(input_uvw);
            if (Array.isArray(input_uvw)) {
                input_u = input_uvw[0];
                input_v = input_uvw[1];
                input_w = input_uvw[2];
            } else {
                input_u = input_uvw.u;
                input_v = input_uvw.v;
                input_w = input_uvw.w;
            }
            // console.log(input_u);
                        
            pointOnImagePlane.x = input_u * depth / input_w;
            pointOnImagePlane.y = input_v * depth / input_w;
            pointOnImagePlane.z = depth;
            
            // console.log(pointOnImagePlane);
            
            // console.log(pointOnImagePlane);
            return pointOnImagePlane;
        }

    //

    // Transform imagePlane -> screen

        function imagePlaneToScreen (input_xyz) {
            
            let pointOnScreen = {
                Xs: 0,
                Ys: 0,
            }
            // console.log(input_xyz)
            let input_x = input_xyz.x;
            let input_y = input_xyz.y;
            let input_z = input_xyz.z;

            pointOnScreen.Xs = (input_x / imagePlaneScale) + (screen.width / 2);
            pointOnScreen.Ys = originPosition.Y - (input_y / imagePlaneScale); // 

            return pointOnScreen;
        }

    // Transform perspective -> screen
    // TODO - figure out, why below code doesn't work:

        // function perspectiveToScreen (input_uvw, depth) {
        //     imagePlaneToScreen(perspectiveToImagePlane(input_uvw, depth));
        // }

        //  Temporary solution:
        //  imagePlaneToScreen(perspectiveToImagePlane(input_uvw, imagePlaneDepth));



//

// Display & Clear display functions
    // This function takes as an input an array of perspective points,
    // it projects these points onto browser screen,
    // and assigns divs of a given class to them.

    let pointOnScreen;
    let pointOnScreenDiv;

    function display (pointArray, targetDiv, divClass, size) {
        let pointCollection = '';
        for (let i = 0; i < (pointArray.length / 3); i++) {
            // I have coordinates of a point in perspective coordinates:
            let pointInPerspective = pointArrayToObjects(pointArray)[i];
            // console.log(pointInPerspective);
            
            let pointOnImagePlane;
            // Now I need to find its position on the screen:
            pointOnImagePlane = perspectiveToImagePlane(pointInPerspective, imagePlaneDepth);
            pointOnScreen = imagePlaneToScreen(pointOnImagePlane);
            
            // console.log(pointInPerspective);
            let sizeRefPt = [pointInPerspective.u + size, pointInPerspective.v, pointInPerspective.w];
            // console.log(sizeRefPt);

            let sizeRefPtOnImagePlane = perspectiveToImagePlane(sizeRefPt, imagePlaneDepth);
            let sizeScale = distance(pointOnImagePlane, sizeRefPtOnImagePlane) / size;
            // let initialSize = distance(perspectiveToImagePlane([0,0,imagePlaneDepth], imagePlaneDepth), perspectiveToImagePlane( [size, 0, imagePlaneDepth] , imagePlaneDepth));
            let currentSize = Math.ceil(sizeScale * size);
    
            let pointDiv = `
            <div class="${divClass}" style="
            top: ${pointOnScreen.Ys}px;
            left: ${pointOnScreen.Xs}px;
            width: ${currentSize}px;
            height: ${currentSize}px;            
            transform: translate(-${currentSize/2}px, -${currentSize/2}px);
            z-index: ${-1 * Math.ceil(pointInPerspective.w) }
            "</div>
            `;
            
            pointCollection = `${pointCollection} ${pointDiv}`;
            // console.log(pointCollection);

            pointOnScreenDiv = pointDiv;
        }
        targetDiv.innerHTML = pointCollection;        
    }

    function clearDisplay (targetDiv) {
        targetDiv.innerHTML = null;
    }

    function displayTrajectory (pointArray, targetDiv, divClass) {
        let pointCollection = '';
        let pointInPerspective;
        for (let i = 0; i < (pointArray.length / 3); i++) {
            // I have coordinates of a point in perspective coordinates:
            pointInPerspective = pointArrayToObjects(pointArray)[i];
            
            let pointOnScreen;
            let pointOnImagePlane;
            // Now I need to find its position on the screen:
            // console.log(pointInPerspective);
            pointOnImagePlane = perspectiveToImagePlane(pointInPerspective, imagePlaneDepth);
            // console.log(pointOnImagePlane);
            pointOnScreen = imagePlaneToScreen(pointOnImagePlane);
            // console.log(pointOnScreen);
    
            let pointDiv = `
            <div class="${divClass}" style="
            top: ${pointOnScreen.Ys}px;
            left: ${pointOnScreen.Xs}px;">
            </div>
            `;
            
            pointCollection = `${pointCollection} ${pointDiv}`;
            
            
            // return pointCollection;
        }
        targetDiv.innerHTML = pointCollection;        
    }

//









// USER INTERFACE SECTION ////////////////////////////////////////////////////////
// This section contains all UI elements.
    
    function toggleSound() {
        soundMode = toggle.checked;
        if (soundMode === true) {
            sliderLabel.innerHTML = `sound on`;
            console.log('sound: ON');
            soundOn();
        } else {
            sliderLabel.innerHTML = `sound off`;
            console.log('sound: OFF');
            soundOff();
        }
        return soundMode;
    }

    function openOptions() {
        optionsMode = true;        
        
        if (optionsMode = true) {  
            console.log('options: ON');
            toggle.removeEventListener('click', openOptions);        
            optionReturn.style.display = 'block';
            optionReturn.addEventListener('click', closeOptions);
            optionSound.style.display = 'block';
            optionSound.addEventListener('click', soundOnOff);
            if (soundMode === true) {
                optionSound.innerHTML = `sound: on`
                soundOn();
            } else {
                optionSound.innerHTML = `sound: off`
                soundOff();
            }
            optionEndGame.style.display = 'block';
            optionEndGame.addEventListener('click', endGame);
        } else {
            optionReturn.removeEventListener('click', closeOptions);
            return optionsMode;
        }
    }

    function closeOptions() {  
        optionsMode = false;
        console.log('options: OFF');
        optionReturn.style.display = 'none';
        optionSound.style.display = 'none';
        optionEndGame.style.display = 'none';
        setTimeout ((() => {
            toggle.addEventListener('click', openOptions);
        }), 50);
        return optionsMode;
    }

    function endGame (){
        closeOptions();
        displayEndScreen(200);
        
    }

    
    function burgerMenuOn() {
        sliderMenu.style.display = 'none';
        burgerMenu.style.display = 'block';
        toggle.removeEventListener('click', toggleSound);
        toggle.checked = false;
        toggle.addEventListener('click', openOptions);

    }

    function soundOnOff () {
        soundMode = !(soundMode);
        console.log(soundMode);
        if (soundMode === true) {
            optionSound.innerHTML = `sound: on`
            soundOn();
        } else {
            optionSound.innerHTML = `sound: off`
            soundOff();
        }
    }

//


// Sound section

    function soundOn () {
        soundtrack.play();
    }
    
    function soundOff () {
        soundtrack.pause();
    }

    function playSound (sound) {
        if (soundMode === true) {
            sound.play();
        } else return;
    }




// SCENE SECTION ////////////////////////////////////////////////////////
// This section contains all stuff that is visible on the screen when the page loads, excluding UI elements.

// Target size & position calculation

    // Target size calculation:
        // targetSize;
        // targetPosition.w;
        ;

        // we need to calculate distance in px from a point [targetSize/2, targetPosition.]
        (function targetSizePx() {            
            let rightPoint = {u: targetSize/2, v: targetPosition.v , w: targetPosition.w};
            let leftPoint = {u: -targetSize/2, v: targetPosition.v , w: targetPosition.w};
            let rightPointPx = imagePlaneToScreen(perspectiveToImagePlane(rightPoint, imagePlaneDepth));
            let leftPointPx = imagePlaneToScreen(perspectiveToImagePlane(leftPoint, imagePlaneDepth));

            let result = rightPointPx.Xs - leftPointPx.Xs;
            
            targetSizePixels = result;
        }());
        root.style.setProperty('--target-size', `${targetSizePixels}px`);
        
        // we need to calculate the position of the target in px
        
        targetPositionPixels = imagePlaneToScreen(perspectiveToImagePlane(targetPosition, imagePlaneDepth));
        let targetPositionPixelsXs = targetPositionPixels.Xs;

        root.style.setProperty('--target-position-X', `${targetPositionPixels.Xs - (targetSizePixels/2)}px`);
        root.style.setProperty('--target-position-Y', `${targetPositionPixels.Ys - (targetSizePixels/2)}px`);











// USER INPUT SECTION ////////////////////////////////////////////////////////
// This section contains all objects the player interacts with, excluding UI.

// TRIGGER EVENT /////////////////////////////
    (function titleScreen (){
       console.log(sceneState);
    })();
//

// TRIGGER EVENT /////////////////////////////
    function tutorialStarted (e) {
        sceneState = 'tutorial';
        console.log(sceneState);
        startBtn.removeEventListener('touchstart', tutorialStarted);
        startBtn.style.display = 'none';
        titleScreen.style.display = 'none';
        burgerMenuOn();

        tutorial.style.display = 'block';
        skip.addEventListener('touchend', skipTutorial)
        
        setTimeout(() => {
            if (tutorialSkipped === false) {
                skipTutorial();
            }
        }, "5380");

        };
//

// Skip tutorial 
    
    function skipTutorial (e) {
        console.log(gameMode.mode);
        gameArea.addEventListener('touchstart', gameStarted);
        if (gameMode.mode === 'timeout') {
            timeout();
            timer.style.display = 'table';
        }
        if (gameMode.mode === 'killer') {
            timer.style.display = 'none';
        }
        if (gameMode.mode === 'training') {
            timer.style.display = 'none';
        }
        runStart = Date.now();
        score.style.setProperty('display', 'block');
        tutorial.style.display = 'none';
        target.style.backgroundImage = `url('images/target.gif')`;
        tutorialSkipped = true;
    }

// TRIGGER EVENT /////////////////////////////
    function gameStarted (e) {
        sceneState = 'bowAim';
        if (stopSignal === true) return;
    
        console.log(sceneState);

        gameArea.addEventListener('touchmove', rightHandAim);
        gameArea.addEventListener('touchend', bowReleased);
        arrowShaftPoints.style.display = 'block';
        trajectoryPoints.style.display = 'block';
        leftHandAim(e);
        };
//

//
    // Left Hand Aim

        function leftHandAim(e) {
            leftHand.style.setProperty('display', 'block');
            let triggerX;
            let triggerY;
            if (device === 'mouse') {
                triggerX = e.clientX;
                triggerY = e.clientY;
            } else {
                triggerX = e.touches[0].clientX;
                triggerY = e.touches[0].clientY;
            }
            // let triggerX = e.touches[0].clientX, e.clientX // e.touches[0].clientX for mobile; e.clientX for desktop

            leftHand.style.left = `${triggerX-leftHandSize/2}px`;
            leftHand.style.top = `${triggerY-leftHandSize/2}px`;

            leftHandScr.Xs = triggerX;
            leftHandScr.Ys = triggerY;
        
            let ipCoordinates = {
                x: screenToImagePlane(leftHandScr).x,
                y: screenToImagePlane(leftHandScr).y,
                z: imagePlane.depth,
            }

            
            let ppCoordinates = {
                u: imagePlaneToPerspective(ipCoordinates, leftHandDistance).u,
                v: imagePlaneToPerspective(ipCoordinates, leftHandDistance).v,
                w: leftHandDistance,
            }

            let ipRtrnCoords = perspectiveToImagePlane(ppCoordinates, imagePlaneDepth);

            let scrnRtrnCoords = imagePlaneToScreen(ipRtrnCoords);

            leftHand_uvw = ppCoordinates;        
            
            if (debugMode === true) {
                leftHand.innerHTML = `
                <span class="debug-text">
                    ${screen.name}:<br>
                    ${triggerX},<br>
                    ${triggerY}
                </span>
                <span class="debug-text">
                    ${imagePlane.name}:<br>
                    ${ipCoordinates.x},<br>
                    ${ipCoordinates.y},<br>
                    ${ipCoordinates.z}
                </span>
                <span class="debug-text">
                    ${perspective.name}:<br>
                    ${ppCoordinates.u},<br>
                    ${ppCoordinates.v},<br>
                    ${ppCoordinates.w}
                </span>
                <span class="debug-text">
                    imgpl-rtrn:<br>
                    ${ipRtrnCoords.x},<br>
                    ${ipRtrnCoords.y},<br>
                    ${ipRtrnCoords.z}
                </span>
                <span class="debug-text">
                    scrn-rtrn:<br>
                    ${scrnRtrnCoords.Xs},<br>
                    ${scrnRtrnCoords.Ys}
                </span>
                `;
            } else {
                leftHand.innerHTML = ``;
            };

            return leftHandScr, leftHand_uvw;
        }

//

// TRIGGER EVENT /////////////////////////////
    
    function bowAimed (e) {
        sceneState = 'bowDraw';
        console.log(sceneState);        
        rightHandAim(e);
    };

//

//
    // Right hand aim
        // TODO: this function is basically a duplicaye code of leftHandAim. These two should be combined into one.

        function rightHandAim(e) {
            rightHand.style.setProperty('display', 'block');
            let triggerX;
            let triggerY;


            if (device === 'mouse') {
                triggerX = e.clientX;
                triggerY = e.clientY;
            } else {
                triggerX = e.touches[0].clientX;
                triggerY = e.touches[0].clientY;
            }


            rightHand.style.left = `${triggerX-rightHandSize/2}px`;
            rightHand.style.top = `${triggerY-rightHandSize/2}px`;
            rightHandScr.Xs = triggerX;
            rightHandScr.Ys = triggerY;
       
            let ipCoordinates = {
                x: screenToImagePlane(rightHandScr).x,
                y: screenToImagePlane(rightHandScr).y,
                z: imagePlane.depth,
            }

            
            let ppCoordinates = {
                u: imagePlaneToPerspective(ipCoordinates, rightHandDistance).u,
                v: imagePlaneToPerspective(ipCoordinates, rightHandDistance).v,
                w: rightHandDistance,
            }

            let ipRtrnCoords = perspectiveToImagePlane(ppCoordinates, imagePlaneDepth);

            let scrnRtrnCoords = imagePlaneToScreen(ipRtrnCoords);

            rightHand_uvw = ppCoordinates;
            
            if (debugMode === true) {
                rightHand.innerHTML = `
                <span class="debug-text">
                    ${screen.name}:<br>
                    ${triggerX},<br>
                    ${triggerY}
                </span>
                <span class="debug-text">
                    ${imagePlane.name}:<br>
                    ${ipCoordinates.x},<br>
                    ${ipCoordinates.y},<br>
                    ${ipCoordinates.z}
                </span>
                <span class="debug-text">
                    ${perspective.name}:<br>
                    ${ppCoordinates.u},<br>
                    ${ppCoordinates.v},<br>
                    ${ppCoordinates.w}
                </span>
                <span class="debug-text">
                    imgpl-rtrn:<br>
                    ${ipRtrnCoords.x},<br>
                    ${ipRtrnCoords.y},<br>
                    ${ipRtrnCoords.z}
                </span>
                <span class="debug-text">
                    scrn-rtrn:<br>
                    ${scrnRtrnCoords.Xs},<br>
                    ${scrnRtrnCoords.Ys}
                </span>
                `;
            } else {
                rightHand.innerHTML = ``;
            };
            
            shotPreview();
  
            return rightHandScr, rightHand_uvw;
        }

    //


//



// BOW DRAW SECTION ////////////////////////////////////////////////////////
// This section contains creates an arrow flight preview based on user input.
    
    // Arrow flight plane
    // We create a plane with rightHand_uvw (arrow release position) as origin.
    // We'll need functions to transform between arrow plane coordinates to uvw, too.

    // HARDCODED VALUES FOR DEBUGGING PURPOSES - TO BE DELETED / COMMENTED OUT       
        // leftHand_uvw = {
        //     "u": 0.12967788232866576,
        //     "v": -0.12233762483836391,
        //     "w": 1.4
        // };
        // rightHand_uvw = {
        //     "u": 0.1406882685641185,
        //     "v": -0.16270904103502398,
        //     "w": 0.7
        // };
    //

    // Transform perspective (uvw) to arrowPlane (dh) [d - distance on horizontal plane, h - height]
        function perspectiveToArwPln (input_uvw) {
            let result = {d:0, h:0};
            if (Array.isArray(input_uvw)) {
                // console.log('array')
                result.d = Math.sqrt( Math.pow( (rightHand_uvw.u - input_uvw[0]), 2) + Math.pow( (rightHand_uvw.w-input_uvw[2]), 2) );
                result.h = input_uvw[1] - rightHand_uvw.v;
            } else {
                // console.log('object')
                result.d = Math.sqrt( Math.pow( (rightHand_uvw.u - input_uvw.u), 2) + Math.pow( (rightHand_uvw.w-input_uvw.w), 2) );
                result.h = input_uvw.v - rightHand_uvw.v;
            }
            return result;
        };

    //
    
    // Transform arrowPlane (dh) to perspective (uvw) [d - distance on horizontal plane, h - height]
        // We need to get the angle between | rH -> lH | vector projected to uw plane and | w | axis vector.        
        let horizRelAng_uvw;
        
        function arwPlnToPerspective (input_dh) {
            
            let result = {u: 0, v: 0, w: 0}
            // We calculate a horizontal projection of the release angle.
            let projectedArwVec;
            projectedArwVec = [arwVecAtRel[0], 0, arwVecAtRel[2]]; 
            let wAxis;
            wAxis = [0, 0, arwVecAtRel[2]];            
            let angle;            
            angle = vectorAngle(wAxis, projectedArwVec);
            horizRelAng_uvw = angle;

            // Now we can calculate u & w values of the point.
            let delta_u;
            let delta_v;
            let delta_w;

            delta_u = input_dh.d*Math.sin(angle);
            delta_w = input_dh.d*Math.cos(angle);

            if (leftHand_uvw.u < rightHand_uvw.u) {
                result.u = rightHand_uvw.u - delta_u;
                result.w = rightHand_uvw.w + delta_w;
            } else {
                result.u = rightHand_uvw.u + delta_u;
                result.w = rightHand_uvw.w + delta_w;
            };

            
            // Now we just need v value.
            delta_v = input_dh.h; // correct.
            result.v = rightHand_uvw.v + delta_v;            
            
            return result;
        };
        // console.log(arwPlnToPerspective(perspectiveToArwPln(leftHand_uvw)));

    //

    // arrowHead calculation

        function arrowHeadPos (arrowEndPos_dh, arwVec_dh) {
            let result = {d: 0, h: 0};
            result.d = arrowEndPos_dh.d + arwVec_dh[0];
            result.h = arrowEndPos_dh.h + arwVec_dh[1];
            return result;
        };

    // Now, we need to create a function that calculates the position of the arrow on arrowPlane.
                
        function arrowMotion(startPoint_dh, angle, v0, t=[]) {
            let result = [];
            let v0x = v0 * Math.cos(angle);
            let v0y;
            
            if (leftHand_uvw.v >= rightHand_uvw.v) {
               v0y = v0 * Math.sin(angle);
            } else {
                v0y = - v0 * Math.sin(angle);
            }
          
            for (i = 0; i < t.length;) {
                let currentPosition = {d:0, h:0}; // SUPER IMPORTANT BASIC STUFF!! To get stuff out from the loop, we need to declare this variable in loop scope, not outside.
                
                // Displacement
                currentPosition.d = v0x * t[i] + startPoint_dh.d;
                // Height 
                currentPosition.h = v0y * t[i] - (g * Math.pow(t[i], 2) * 0.5) + startPoint_dh.h;
                i++;

                result.push(currentPosition) ;
            }            
            
            return result;
        };
    //

    // Arrow End evaluation

        function velocityVec (v0, angle, time) {
            let result;
            let vx;
            let vy;
            let v0x = v0 * Math.cos(angle);
            let v0y;
            if (leftHand_uvw.v >= rightHand_uvw.v) {
                v0y = v0 * Math.sin(angle);
            } else {
                v0y = - v0 * Math.sin(angle);
            };

            vx = v0x;
            vy = v0y - (g * time);

            result = [vx, vy];

            return result;
        };
    //


    // This function calculates time, when the arrow SHOULD arrive at tha target.
        // distance to cover:
        
        
        function timeAtDist (startPoint_dh, distance, angle) {
            let timeAtTargetDistance;
            let v0x = v0 * Math.cos(angle);
            timeAtTargetDistance = (distance - startPoint_dh.d) / v0x;
            return timeAtTargetDistance;
        }; 
    //

    // This function calculates time, when the arrow SHOULD hit the ground.

        function timeAtHeight (height, angle, initialV) {
            let result;
            let v0y;
            if (leftHand_uvw.v >= rightHand_uvw.v) {
                v0y = initialV * Math.sin(angle);
            } else {
                v0y = - initialV * Math.sin(angle);
            }
            
            // We need to transform this equation to solve it:
            // 0 = v0y * t - (g * Math.pow(t, 2) * 0.5) + (startPoint_dh.h + height);
            // Quadratic equation looks like this:
            // -gt^2/2 + v0y*t + (startPoint_dh.h + height) = 0
            // ,hence:

            let a = -g/2;
            let b = v0y;
            let c = height;

            result = solveQuadraticEquation(a,b,c);
            return result;
        };
        
    //


    // Shot preview function
        
        let arwVecAtRel_dh;
        let arwHeadAtRel_dh;
        let arwAngAtRel_dh;
        let arwHeadAtRel_uvw;
        let arwEndAtRel_dh;
        let arwEndAtRel_uvw;
        let rightHand_dh;
        let leftHand_dh
        
        function shotPreview () {
            // First, we need to create the | rH -> lH | vector in uvw space.
            arwVecAtRel = vectorFromPoints(rightHand_uvw, leftHand_uvw); 

                        
            // Now, we need the vector of the arrow at release in dh coordinates
            rightHand_dh = perspectiveToArwPln(rightHand_uvw);
            leftHand_dh = perspectiveToArwPln(leftHand_uvw);
            
            arwVecAtRel_dh = vectorFromPoints(rightHand_dh, leftHand_dh);
            arwVecAtRel_dh =  multiplyVector( arwVecAtRel_dh, ( arwLng / vectorLength (vectorFromPoints(rightHand_dh, leftHand_dh) ) ) ); // Now we need to change the magnitude of the vector to arwLength
            arwHeadAtRel_dh = arrowHeadPos(rightHand_dh, arwVecAtRel_dh);

            // VERY IMPORTANT!
            // Now we shift coordinate system to the ARROWHEAD. From now on, all calculations regarding arrow flight will be calculated in "dhAtArwHead" coordinate system.
            let dhPln = planeVecVecPt([arwVecAtRel_dh[0], 0], [0, 1], [0, 0]);
            let dhPlnAtArwHead = changeOrigin(dhPln, Object.values(arwHeadAtRel_dh))
            
            // Now we calculate the trajectory of the HEAD of the arrow.
            arwAngAtRel_dh = vectorAngle([arwVecAtRel_dh[0], 0], arwVecAtRel_dh);
            let targetPosition_dh = perspectiveToArwPln(targetPosition);
            let predictedHitDist = (targetPosition_dh.d / Math.cos(horizRelAng_uvw));
            t = series(0, timeAtDist(arwHeadAtRel_dh, predictedHitDist, arwAngAtRel_dh), shotPreviewSteps);
            let shotTrajectory_dh = (arrowMotion(arwHeadAtRel_dh, arwAngAtRel_dh, v0, t));

            shotTrajectory = [];
            for (i = 0; i < shotTrajectory_dh.length;) {
                shotTrajectory.push ( Object.values ( arwPlnToPerspective ( shotTrajectory_dh [i] ) ) ); 
                i++;
            }
                       
            arwHeadAtRel_uvw = Object.values ( arwPlnToPerspective(arwHeadAtRel_dh) );            
            // Now we'll calculate arrow end position.
            arwEndAtRel_uvw = Object.values (rightHand_uvw);

            // We'll calculate arrowshaft here.
            let arrowShaftAtRel;
            arrowShaftAtRel = interpolatePts(arwEndAtRel_uvw, arwHeadAtRel_uvw, arrowShaftPointsCount);
            
            displayTrajectory(shotTrajectory.flat(), trajectoryPoints, 'trajectory');
            display(arwHeadAtRel_uvw, arrowHeadPoints, 'arrow-head', arrowSize, false);
            display(arwEndAtRel_uvw, arrowEndPoints, 'arrow-end', arrowSize, false);
            line(Object.values(imagePlaneToScreen(perspectiveToImagePlane(arwEndAtRel_uvw, imagePlaneDepth))), 
                 Object.values(imagePlaneToScreen(perspectiveToImagePlane(arwHeadAtRel_uvw, imagePlaneDepth))), 
                 8, arrowShaftPoints, 'arrow-shaft');


            

            

            // return arwVecAtRel_dh;                        
        };

        // console.log(arwVecAtRel_dh);

//

// TRIGGER EVENT //////////////////////////////

    function bowReleased () {
        sceneState = 'arwFlight';
        playSound(soundBowShoot);      
        console.log(sceneState);
        console.log(`Arrow no:${arrowId}`);
        clearDisplay(trajectoryPoints);
        clearDisplay(arrowHeadPoints);
        clearDisplay(arrowEndPoints);
        clearDisplay(arrowShaftPoints);
        evalHit(arrowId);
        animateArrow(arwHeadAtRel_dh, hitTime, arrowId);
        arrowId++;
        //animFlight();
    };

//

// ARROW FLIGHT SECTION ////////////////////////////////////////////////////////
// This section contains checks, where the arrow hit and displays an animation of the flight.

    // To simplify the calculations, we consider the arrow a single point, that starts from arrow TIP and reaches either target or the ground. OK
    // To do that, we need to calculate the tip position of the arrowTip in dh coordinates, and then plugging this position into our motion equations. DONE
    
    // To check where the arrow hit, we need to calculate the intersectionPoint of the arrow horizontal vector & target plane in dh coordinates. DONE
    // We'll figure out the height of this point by getting time when it arrived at target plane and then evaluating a simple motion equation. DONE
    // Now we need to convert from dh to uvw. DONE
    // We need to check the distance between target and intersectionPoint in uvw space, and now we know how far off the hit was. DONE
    // If it was less than targetSize, the target was hit. DONE
    // By simple division we can evaluate  how many points the player got. DONE
    //
    // Else, if the distance was larger than targetSize, we go back to dh space and do another calculation. OK
    // From the motion equations in dh space, we need to calculate, when the arrow reached the height of -arwHeightAtRel. DONE
    // We need to get the point, where arrow was at that time and that is a groundHit position in dh space.
    //
    // Now we need to just create a shotTrajectory and display it.
    // To display it as an animation, we'll need to create a new function that creates a different "style" for each div on the flightpath
    // 
    // In the end we can change the animated point into a line of a couple dozen divs, but this can be left for later, because it's quite simple.
    // It will be just single point and a vector, with a condition to stop the arrow animation when the ARROWHEAD, not ARROWEND hits stuff.    

//

// Hit evaluation function
    let arwHeadHit;
    let arwEndHit;
    let pointResults = [];
    let streakLength = 0;

    
    function evalHit (arrowId) {
        arwVecAtRel_dh;
        horizRelAng_uvw;
        
        let pointResult = {id: 0, result: 0};
        let lastResult = {id: 0, result: 0};
        let delta_u;
        let delta_v;
        let delta_w;
        let d;
        let time;
        let intersectionPoint_dh;
        let intersectionPoint_uvw;
        let groundHit_dh;
        let groundHit_uvw;
        let uniqueArrowId = arrowId;
        pointResult.id = uniqueArrowId;



        // This value is the distance the arrow travels along wAxis, until it reaches target plane:
        delta_w = targetPosition.w - rightHand_uvw.w; // It doesn't compensate for arrow length.
        delta_u = delta_w / Math.tan(Math.PI/2 - horizRelAng_uvw);
        d = Math.sqrt(Math.pow(delta_u, 2) + Math.pow(delta_w, 2)); // we don't compensate for arrow length here.
        time = timeAtDist(arwHeadAtRel_dh, d, arwAngAtRel_dh);
        
        intersectionPoint_dh = arrowMotion(arwHeadAtRel_dh, arwAngAtRel_dh, v0, [time]);
        intersectionPoint_dh = intersectionPoint_dh[0];
        
        // Now we have the intersectionPoint in uvw space!
        intersectionPoint_uvw = arwPlnToPerspective(intersectionPoint_dh);

        // Let's check how far off it was.
        let offTarget;

        offTarget = distance (targetPosition, intersectionPoint_uvw);

        if (offTarget <= targetSize/2) {
            let pointAreaSize = targetSize / 20;
            pointResult.result = Math.ceil(( targetSize / 2 - offTarget) / pointAreaSize);
            // console.log(pointResults.length);
            if (pointResults.length > 0) {
                lastResult = pointResults[pointResults.length - 1];
            } else {}
            if ((pointResult.result >= 10) && (lastResult.result >= 10)) {
                streakLength++; 
                console.log(`You're on a streak! Streak length: ${streakLength}`);
                pointResult.result = 10 * streakLength;
            } else {
                streakLength = 1;
            }
            totalScore = totalScore + pointResult.result;
            arwHeadHit = intersectionPoint_uvw;
            console.log('Target hit. Result: ', pointResult.result, ' points.');
            setTimeout(() => {
                playSound(soundTargetHit);
            }, `${time*1000}`);
        } else  if (offTarget > targetSize/2 && offTarget <= targetSize*1.6) {
            pointResult.result = 0;
            streakLength = 1;
            arwHeadHit = intersectionPoint_uvw;
            console.log('Droid hit.');
            setTimeout(() => {
                playSound(soundDroidHit);        
            }, `${time*1000}`);
        } else {
            console.log('Ground hit.');
            pointResult.result = 0;
            streakLength = 1;
            let distToGroundAtRel;
            
            distToGroundAtRel = (cameraHeight + arwHeadAtRel_uvw[1]);
            time = timeAtHeight(distToGroundAtRel, arwAngAtRel_dh, v0)[0];
            setTimeout(() => {
                playSound(soundGroundHit);        
            }, `${time*1000}`);
            groundHit_dh = arrowMotion(arwHeadAtRel_dh, arwAngAtRel_dh, v0, [time]);
            groundHit_dh = groundHit_dh[0];
            groundHit_uvw = arwPlnToPerspective(groundHit_dh);
            arwHeadHit = groundHit_uvw;
        }
        hitTime = time;
        pointResults.push(pointResult);

    };
//

// Calculation of arrowHead and arrowEnd positions at a given time

    let startTime;
    let arwHeadDiv;
    let arwEndDiv;    
    
    function animateArrow (startPoint, hitTime, arrowId) {
        let timeStep = (1 / animation_fps);
        let animFrameCount = Math.ceil(hitTime/timeStep);
        let timeArray = series(0, hitTime, animFrameCount);
        let arwHeadTrajectory_dh = arrowMotion(arwHeadAtRel_dh, arwAngAtRel_dh, v0, timeArray);
        // console.log(timeArray);
        
        // let arwEndTrajectory_dh = arrowMotion(rightHand_dh, arwAngAtRel_dh, v0, timeArray);
        let arwHead;
        let arwEnd;
        let arwShaft;
        let uniqueArrowId = arrowId;
        
        let arwHeadTrajectory = [];
        let arwEndTrajectory = [];
        let arwShaftTrajectory = [];

        for (i = 0; i < arwHeadTrajectory_dh.length;) {
            arwHead = Object.values ( arwPlnToPerspective ( arwHeadTrajectory_dh [i] ) );
            arwHeadTrajectory.push ( arwHead );

            // Here we'll calculate arrow vector at a given frame.
            let arwVec = setVectorMagnitude( velocityVec(v0, arwAngAtRel_dh, timeArray[i]), (arwLng * (-1)) ) ;
            arwEnd = move (Object.values(arwHeadTrajectory_dh [i]), arwVec);
            arwEnd = Object.values ( arwPlnToPerspective ( {d: arwEnd[0], h: arwEnd[1]} ) );
            arwEndTrajectory.push ( arwEnd );

            i++;
        };        

        if (sceneState = 'arwFlight') {
            let i=0;

            // We need to create AH, AE, L inside a unique div:              
                let arrowDiv = createElementFromHTML(
                    `<div id="arrow-${uniqueArrowId}">
                    </div>`);
                arrowAnimations.append(arrowDiv);                
                let currentArrowDiv = document.getElementById(`arrow-${uniqueArrowId}`);
                let scorePosition = imagePlaneToScreen ( perspectiveToImagePlane (arwEnd, imagePlaneDepth) );
                currentArrowDiv.append(
                    createElementFromHTML(`<div id="arrow-head-${uniqueArrowId}"></div>`) ,
                    createElementFromHTML(`<div id="arrow-end-${uniqueArrowId}"></div>`) ,
                    createElementFromHTML(`<div id="arrow-shaft-${uniqueArrowId}"></div>`) ,
                    createElementFromHTML(`<div id="arrow-points-${uniqueArrowId}" class="hit-score" style="top: ${scorePosition.Ys-16}px; left: ${scorePosition.Xs-13}px"></div>`) ,
                );
            //

            let animation = setInterval ( function () {
                i = i+1;           
                
                if (i >= animFrameCount) {
                    clearInterval(animation);
                    displayScore (uniqueArrowId);
                    arrowHit (uniqueArrowId);
                    return;
                }              
                
                let arrowHeads = document.getElementById(`arrow-head-${uniqueArrowId}`);
                let arrowEnds = document.getElementById(`arrow-end-${uniqueArrowId}`);
                let arrowShafts = document.getElementById(`arrow-shaft-${uniqueArrowId}`);
                    

                display(arwHeadTrajectory[i], arrowHeads, 'arrow-head', arrowSize , false);
                arwHead = pointOnScreen;
                arwHeadDiv = pointOnScreenDiv;
                
                display(arwEndTrajectory[i], arrowEnds, 'arrow-end', arrowSize , false);
                arwEnd = pointOnScreen;
                arwEndDiv = pointOnScreenDiv;

                // line (arwEnd, arwHead, 2, arrowShafts, 'arrow-shaft' );

                
                
            }, (timeStep * slowMoFactor * 1000));
        }

        
        
    }

//

// Display score at the point where arrow hit

    function displayScore (arrowId) {
        let i = arrowId;
        let div = document.getElementById(`arrow-points-${arrowId}`);
        div.innerHTML = pointResults[i].result;
    }

//

// Display a special effect when a particular score is hit

    function displayExplosion_10 (arrowId) {
        let i = arrowId;
        if (pointResults[i].result >= 10) {
            explosion_10.style.opacity = `100%`;
            playSound(soundExplosion);        
            target.style.backgroundImage = `url('images/yellow_hit.gif')`; 
            let pointText = document.getElementById(`arrow-points-${arrowId}`);
            pointText.style.color = 'var(--score-text-10)';           
            pointText.style.textShadow = '0px 1px var(--score-text-shadow-10)';           
            score.style.animation = 'scoreAdd 1.9s normal forwards';           
            setTimeout(() => {
                explosion_10.style.opacity = `0%`;
            }, "400");
            setTimeout(() => {
                score.style.animation = '';           
                target.style.backgroundImage = `url('images/target.png')`;            
            }, "1900");
        } else if (pointResults[i].result < 10 && pointResults[i].result >= 8) {
            score.style.animation = 'scoreAdd 1.9s normal forwards';           
            target.style.backgroundImage = `url('images/yellow_hit.gif')`;            
            setTimeout(() => {
                score.style.animation = '';           
                target.style.backgroundImage = `url('images/target.png')`;            
            }, "1900");
        } else if (pointResults[i].result < 8 && pointResults[i].result >= 5) {
            score.style.animation = 'scoreAdd 1.3s normal forwards';           
            target.style.backgroundImage = `url('images/red_hit.gif')`;            
            setTimeout(() => {
                score.style.animation = '';           
                target.style.backgroundImage = `url('images/target.png')`;            
            }, "1300");
        } else if (pointResults[i].result < 5 && pointResults[i].result >= 1) {
            score.style.animation = 'scoreAdd 0.7s normal forwards';           
            target.style.backgroundImage = `url('images/cyan_hit.gif')`;            
            setTimeout(() => {
                score.style.animation = '';           
                target.style.backgroundImage = `url('images/target.png')`;            
            }, "700");
        } else {
            return;
        };

    }

//


// TRIGGER EVENT //////////////////////////////

    function arrowHit (uniqueArrowId) {
        sceneState = 'arwStopped';
        console.log(sceneState);
        score.innerHTML = `Score: ${totalScore}`;
        displayScore (uniqueArrowId);
        displayExplosion_10(uniqueArrowId);
        // console.log(`Hit: `, arwHeadHit);
        
        if ( totalScore >= droneHp && gameMode.mode === 'killer') {
            displayEndScreen (2000);
        }
    };
    
    //
    
    // TIMEOUT MODE /////////////////////////////
    
    function timeout () {
        if (gameMode.mode === 'timeout') {
            setTimeout(() => {
                displayEndScreen (2000);
            }, String(timeoutDuration * 1000));
        }
        if (gameMode.mode === 'timeout') {
            let i=0;
            let timerInterval = setInterval(() => {
                i++;
                if (i >= timeoutDuration) {
                    timer.innerHTML = 0; // i
                    displayEndScreen (2000);                
                    clearInterval(timerInterval);
                    return;
                } else {
                timer.innerHTML = (timeoutDuration - i); // i
                };
            }, 1000);
        }
        
        return;
    }

//

    
// SCORE SECTION ////////////////////////////////////////////////////////
// This section displays score calculated in the previous section and gives player the option to exit.
    
// Display end screen


    function displayEndScreen (delay) {
        stopSignal = true;
        gameArea.removeEventListener('touchmove', rightHandAim);
        gameArea.removeEventListener('touchend', bowReleased);
        clearDisplay(trajectoryPoints);
        clearDisplay(arrowHeadPoints);
        clearDisplay(arrowEndPoints);
        clearDisplay(arrowShaftPoints);
        
        leftHand.style.setProperty('display', 'none');
        rightHand.style.setProperty('display', 'none');
        sceneState = 'gameOver';
        console.log(sceneState);
        gameModeName.innerHTML = ` ${gameMode.mode} `
        previousModeBtn.addEventListener('touchstart', previousMode);
        nextModeBtn.addEventListener('touchstart', nextMode);
        playAgainBtn.addEventListener('touchend', continueGame);
        calculateStats();
        
        setTimeout(() => {
            clearDisplay(timer);
            endScreen.style.display = 'block';
            stopSignal = false;
            timer.innerHTML = timeoutDuration; // i
        }, `${delay}`);
    };

    
//

// Game mode switches
    console.log(gameMode.id);
    function previousMode (e) {
        let newGameModeId = gameMode.id - 1;
        if (newGameModeId < 0) {
            newGameModeId = gameModeList.length - 1;
        } else {}
        gameMode = gameModeList[newGameModeId];
        console.log(newGameModeId);
        gameModeName.innerHTML = ` ${gameMode.mode} `
        modeExplanation.innerHTML = ` ${gameMode.explain} `
        return newGameModeId;
    }
    
    function nextMode (e) {
        let newGameModeId = gameMode.id + 1;
        if (newGameModeId > (gameModeList.length -1)) {
            newGameModeId = 0;
        } else {}
        gameMode = gameModeList[newGameModeId];
        console.log(newGameModeId);
        gameModeName.innerHTML = ` ${gameMode.mode} `
        modeExplanation.innerHTML = ` ${gameMode.explain} `
        return newGameModeId;
    }

//

// Calculate game statistics

    function calculateStats () {
        
        totalScore;
        let duration = msToMinutesAndSeconds( Date.now() - runStart );
        let results = pointResults.map(a => a.result);
        let missCount = countNoOfResults(0, results);
        let atTarget = results.length - missCount;
        // to count accuracy properly we need to substitute 20,30..etc. with 10.
        console.log('results', results)
        let correctedResults = unStreakResults(results);
        console.log('corrected results', correctedResults);
        let accuracy = Math.round(average(correctedResults) * 10);
        let longestStreak = countConsecutiveBullseyes(10, correctedResults);
        let pointsPerSec = Math.round(((totalScore / ( Date.now() - runStart )) * 1000) * 100) / 100;
        
        console.log(results);
        
        function countNoOfResults(result, array){
            let count = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i] == result) count++;
            };
            return count;
        }
        
        function countConsecutiveBullseyes(result, array){
            let streak = 0;
            let streakArray = [0];
            let longestStreak = 0;
            for (let i = 0; i <= array.length; i++) {
                if (array[i] >= result) {
                    streak++;
                } else if ((array[i] != result) && (streak != 0)) {
                    streakArray.push(streak);
                    streak = 0;
                } else {};
            };
            let sorted = streakArray.sort();
            let reversed = sorted.reverse();
            console.log(reversed);
            longestStreak = reversed[0];
            return longestStreak;
        }

        function unStreakResults (array) {
            let unStreakedResults = [];
            for (let i = 0; i < array.length; i++) {
                if (array[i] > 10) {
                    let changed = 10;
                    unStreakedResults.push(changed);
                } else {
                    let unchanged = array[i];
                    unStreakedResults.push(unchanged);
                }
            }
            return unStreakedResults;
        }

        runScore.innerHTML =  `score: ${totalScore}`;
        runTime.innerHTML =  `time: ${duration}`;
        runMissed.innerHTML =  `missed: ${missCount}`;
        runAtTarget.innerHTML =  `at target: ${atTarget}`;
        runAccuracy.innerHTML =  `accuracy: ${accuracy}%`;
        runLongestStreak.innerHTML =  `bullseye streak: ${longestStreak}`;
        runPps.innerHTML =  `points per sec: ${pointsPerSec}`;
    }

//




// TRIGGER EVENT //////////////////////////////
    
    function continueGame () {
        sceneState = 'reload';
        console.log(sceneState);
        endScreen.style.display = 'none';
        arrowShaftPoints.style.display = 'none';
        trajectoryPoints.style.display = 'none';
        playAgainBtn.removeEventListener('touchend', continueGame);
        totalScore = 0;
        streakLength = 0;
        arrowId=0;
        pointResults = [];
        score.innerHTML = `Score: ${totalScore}`;
        arrowAnimations.innerHTML = '';
        skipTutorial();
    };

//

// RELOAD SECTION ////////////////////////////////////////////////////////

// TRIGGER EVENT //////////////////////////////

    function finishGame () {
    };

//

// GAMEOVER SECTION ///////////////////////////////////////////////////////;