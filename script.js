// Document variables

    // UI Elements
    const debugToggle = document.getElementById('debug-toggle');
    const debugStateLabel = document.getElementById('debug-state-label');    
    // Perspective data
    const screen = {
        name: 'screen',
        width: window.innerWidth,
        height: window.innerHeight,
        depth: 0,
    }
    const imagePlaneScale = 0.01;
    const imagePlane = {
        name: 'imagePlane',
        width: window.innerWidth,
        height: window.innerHeight,
        depth: 1.0,
    }
    const perspective = {
        name: 'perspective',
    }
    // Graphical elements
    const gameArea = document.getElementById('game-area');
    const target = document.getElementById('point-area-1');
    const ground = document.getElementById('ground');
    const leftHand = document.getElementById('left-hand');
    let debugMode;
    let leftHandPosition;
    let leftHandSize = getComputedStyle(leftHand).getPropertyValue('--left-hand-size');
        leftHandSize = leftHandSize.slice(0, -2);
        leftHandSize = Number(leftHandSize);
    let targetPosition = {
        X: Number (getComputedStyle(target).getPropertyValue('left').slice(0, -2)),
        Y: Number (getComputedStyle(sky).getPropertyValue('height').slice(0, -2))
    }    
    // console.log(targetPosition);    
    // Player input
    let leftHandSet = {
        X:0,
        Y:0,
    };
    let leftHandDistance = 1.2;
    let rightHandDistance;

//


// Add event listeners
    debugToggle.addEventListener('click', toggle);
    gameArea.addEventListener('mousedown', leftHandAim);
//

// Debug mode toggle
    function toggle(e) {
        debugMode = debugToggle.checked
        if (debugMode === true) {
            debugStateLabel.innerHTML = `Debug: ON`;
        } else {
            debugStateLabel.innerHTML = `Debug: OFF`;
        }
    }
//

// Perspective translator
    
    /* We'll have 3 coordinate systems:
      - screen      [X,Y],   2D, with screen top left as origin;
      - imagePlane  [x,y,z], 2D, with Oz (vanishing point) as origin;
      - perspective [u,v,w], 3D, with camera as origin;
    We need functions to translate the coordinates of a point, 
    given in one of these coordinate systems into a needed coordinate system. */

    // Translator: screen -> imagePlane
        // TODO: create a XY function that operates on both coordinates at a time 
      
     
        function screenToImagePlane_X(X) {
            let pointOnImagePlane = {
                x: 0            
            };

            pointOnImagePlane.x = (X - (imagePlane.width/2)) * imagePlaneScale;
            return pointOnImagePlane.x;
        }

        function screenToImagePlane_Y(Y) {
            let pointOnImagePlane = {
                y: 0
            };

            pointOnImagePlane.y = (targetPosition.Y - Y) * imagePlaneScale;
            return pointOnImagePlane.y;
        }

    // Translator: imagePlane -> perspective
        //This one needs an additional variable of depth.

        
        function imagePlaneToPerspective(input_xyz, w) {
            let pointInPerspective = {
                u: 0,
                v: 0,
                w: w
            };
            let input_x = input_xyz.x;
            let input_y = input_xyz.y;
            let input_z = input_xyz.z;
            // console.log(input_x);
            // console.log(input_y);
            // console.log(input_z);

            pointInPerspective.u = (input_x * w) / input_z;
            pointInPerspective.v = (input_y * w) / input_z ;
            pointInPerspective.w = w;
            
            console.log(pointInPerspective);


            return pointInPerspective;
        }

        // let testPoint = {x:400, y:500, z:1};        
        // let log = imagePlaneToPerspective(testPoint, leftHandDistance);
        // console.log(log);

//


// Target - here we define point areas

    let previousPointArea = '';
    let thisPointArea = '';
    let nextPointArea = '';

    for (let i = 0; i <= 9;) {
        
        thisPointArea = `
        <div id="point-area-${10-i}" class="point-area " style="
        width: calc(var(--target-size)*${(i+1)*0.1});
        height: calc(var(--target-size)*${(i+1)*0.1});
        z-index: ${10-i}">
            ${previousPointArea}
        </div>
        `;
        i++;
        previousPointArea = thisPointArea;

        if (i===9) {
            target.innerHTML = thisPointArea;
        }
    };
//

// Left Hand Aim
    function leftHandAim(e) {
        leftHand.style.left = `${e.clientX-leftHandSize/2}px`;
        leftHand.style.top = `${e.clientY-leftHandSize/2}px`;
        leftHandSet.X = e.clientX
        leftHandSet.Y = e.clientY;
        
        let ipCoordinates = {
            x: screenToImagePlane_X(e.clientX),
            y: screenToImagePlane_Y(e.clientY),
            z: imagePlane.depth,
        }

        // console.log(ipCoordinates);
        
        let ppCoordinates = {
            u: imagePlaneToPerspective(ipCoordinates, leftHandDistance).u,
            v: imagePlaneToPerspective(ipCoordinates, leftHandDistance).v,
            w: leftHandDistance,
        }



        if (debugMode === true) {
            // console.log(e.clientX, e.clientY);
            leftHand.innerHTML = `
            <span class="debug-text">
                ${screen.name}:<br>
                ${e.clientX},<br>
                ${e.clientY}
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
            `;
        }

        return leftHandSet;
    }

// screenToImagePlane(leftHandSet.X, leftHandSet.Y);


// screenToImagePlane(leftHandSet);




