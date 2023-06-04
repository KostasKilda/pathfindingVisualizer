let startEndFlags = 0
const container = document.getElementsByClassName('board')[0];

let rowAmount = 0
let columnAmount = 0


let algorithmSpeed = document.getElementById('algorithm-speed')
algorithmSpeed.addEventListener("change", changeAlgorithmSpeed)
changeAlgorithmSpeed();

window.addEventListener('resize', updateGrid);

let grid = [];
let startNode = []
let endNode = []

// Creating the grid system
function updateGrid() {

    // Adjusting the amount of rows and columns based on window size (90% width, 80% height)
    rowAmount = parseInt(window.innerWidth/10*9/20)
    columnAmount = parseInt(window.innerHeight/10*8/20);

    startEndFlags = 0

    // Clearing innerHTML
    container.innerHTML = '';

    // Adding the grid
    for (let i = 0; i < rowAmount; i++) {

        let row = document.createElement('div');
        row.className = 'grid-row';

        for (let j = 0; j < columnAmount; j++) {

            let cell = document.createElement('div');
            cell.className = `grid-cell grid-${i}-${j} not-found`;

            row.appendChild(cell);
        }

        container.appendChild(row);
    }


    // Creating a graph object using 2D array
    for (let i = 0; i < rowAmount; i++) {
        grid[i] = [];
        for (let j = 0; j < columnAmount; j++) {
            grid[i][j] = {
                element: document.querySelector(`.grid-${i}-${j}`),
                isStartNode: false,
                isEndNode: false,
                pastNode: null,
                isWall: false,
                cost: 1,
                visited: false,
            };
        }
    }

    startNode = []
    endNode = []

    cellEventListener();
}

updateGrid();

var isLeftMouseDown = false;


// Event handler for mouse down
function handleMouseDown(event) {
    if (event.button === 0) {
        // Left mouse button is pressed
        isLeftMouseDown = true;
    }
}

// Event handler for mouse up
function handleMouseUp(event) {
    if (event.button === 0) {
        // Left mouse button is released
        isLeftMouseDown = false;
    }
}

// Event handler for mouse move
function handleMouseMove(event) {
    if (isLeftMouseDown) {
        // Left mouse button is being held down
        updateCell(event.target, true);
    }
}

// Attach event listeners
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', handleMouseMove);




function cellEventListener() {
    let cell = document.getElementsByClassName('grid-cell');

    for (let i = 0; i < cell.length; i++) {
        cell[i].addEventListener("click", updateCell, cell[i]);
    }
}


// Function to update cell status
function updateCell(cell, mouseDown) {

    let cellElement

    if (mouseDown) {
        cellElement = cell;
    }
    else {
        cellElement = cell.srcElement;
    }

    cellgrid = cellElement.attributes.class.textContent;

    if ((cellgrid == 'grid-row') || (cellgrid == 'board')) {
        return
    }

    index = cellgrid.split(' ')[1].split('-')

    if (cellgrid.split(' ')[0] == 'grid-cell') {
        if (startEndFlags == 0) {
            cellElement.style.backgroundColor = '#4BA351';
            cellElement.classList.remove("not-found");
            cellElement.classList.add("startNode");
            grid[index[1]][index[2]].isStartNode = true;
            grid[index[1]][index[2]].visited = true;
            grid[index[1]][index[2]].cost = 0;
            startNode.push(index[1])
            startNode.push(index[2])
            startEndFlags += 1;
        }
        else if ((startEndFlags == 1) && (cellgrid.split(" ")[2] != "startNode")) {
            cellElement.style.backgroundColor = 'Red';
            cellElement.classList.remove("not-found");
            cellElement.classList.add("endNode");
            grid[index[1]][index[2]].isEndNode = true;
            endNode.push(index[1])
            endNode.push(index[2])
            startEndFlags += 1;
        }
        else if ((cellgrid.split(" ")[2] != "endNode") && (cellgrid.split(" ")[2] != "startNode")) {
            cellElement.style.backgroundColor = 'Grey';
            cellElement.classList.remove("not-found");
            cellElement.classList.add("wall");
            grid[index[1]][index[2]].isWall = true;
        }
    }
}


function removeWalls() {
    walls = document.getElementsByClassName('wall');
    let wallArray = Array.from(walls);

    for (let i = 0; i <= (wallArray.length - 1); i++) {
        wallArray[i].style.backgroundColor = 'White';
        wallArray[i].classList.remove("wall");
        wallArray[i].classList.add("not-found");
        index = wallArray[i].classList[1].split('-')
        grid[index[1]][index[2]].isWall = false
    }

}


// Event listener for pathfinding speed slider
function changeAlgorithmSpeed(){
    algorithmSpeed = document.getElementById('algorithm-speed')
    document.getElementsByClassName('Algorithm speed')[0].innerHTML = `${algorithmSpeed.value}x`
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function dijkstrasPathfinding() {
    const startingNode = grid[startNode[0]][startNode[1]];

    const currentNodes = [grid[startNode[0]][startNode[1]]]
    const neighborNodes = []
    let foundEndNode = false

    while (!foundEndNode) {

        // Finding the neighbors
        for (let i = currentNodes.length - 1; i >= 0; i--) {
            getNeighbors(currentNodes[i], neighborNodes)
            currentNodes.pop(i);
        }

        if (neighborNodes.length == 0) {
            break;
        }
        for (let i = neighborNodes.length - 1; i >= 0; i--) {
            
            if (neighborNodes[i].isEndNode) {
                foundEndNode = true
            }

            if (neighborNodes[i].isEndNode == false) {
                neighborNodes[i].element.style.backgroundColor = 'yellow';
            }

            currentNodes.push(neighborNodes[i])
            neighborNodes.pop(i);
        }

        await sleep(parseInt(250/algorithmSpeed.value));
    }

    finalNode()
}

function getNeighbors(node, neighborNodes) {
    row = parseInt(node.element.classList[1].split('-')[1])
    col = parseInt(node.element.classList[1].split('-')[2])

    if ((col > 0) && !(grid[row][col - 1].isWall) && !(grid[row][col - 1].visited)) {
        grid[row][col - 1].visited = true;
        grid[row][col - 1].pastNode = node;
        neighborNodes.push(grid[row][col - 1])
    }

    if ((row + 1 < rowAmount) && !(grid[row + 1][col].isWall) && !(grid[row + 1][col].visited)) {
        grid[row + 1][col].visited = true;
        grid[row + 1][col].pastNode = node;
        neighborNodes.push(grid[row + 1][col])
    }

    if ((col + 1 < columnAmount) && !(grid[row][col + 1].isWall) && !(grid[row][col + 1].visited)) {
        grid[row][col + 1].visited = true;
        grid[row][col + 1].pastNode = node;
        neighborNodes.push(grid[row][col + 1])
    }

    if ((row > 0) && !(grid[row - 1][col].isWall) && !(grid[row - 1][col].visited)) {
        grid[row - 1][col].visited = true;
        grid[row - 1][col].pastNode = node;
        neighborNodes.push(grid[row - 1][col])
    }
    return;

}

async function finalNode() {

    targetNode = grid[startNode[0]][startNode[1]]
    backTrackNode = grid[endNode[0]][endNode[1]]

    while(targetNode != backTrackNode){
        backTrackNode = backTrackNode.pastNode

        if(targetNode == backTrackNode){
            break;
        }

        backTrackNode.element.style.backgroundColor = 'blue';

        await sleep(parseInt(100/algorithmSpeed.value));
    }

}


function generateWalls(){
    for (let i = 0; i < rowAmount; i++) {
        for (let j = 0; j < columnAmount; j++) {
            if((Math.random() >= 0.75) && !(grid[i][j].isEndNode) && !(grid[i][j].isStartNode)){
                grid[i][j].isWall = true;
                document.getElementsByClassName(`grid-${i}-${j}`)[0].style.backgroundColor = 'Grey';
                document.getElementsByClassName(`grid-${i}-${j}`)[0].classList.remove('not-found');
                document.getElementsByClassName(`grid-${i}-${j}`)[0].classList.add('wall');
            }
        }
    }
}
