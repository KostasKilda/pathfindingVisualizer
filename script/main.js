let startEndFlags = 0
const container = document.getElementsByClassName('board')[0];

const rowAmount = document.getElementById('row-amount')
rowAmount.addEventListener("change", updateGrid)

const columnAmount = document.getElementById('column-amount')
columnAmount.addEventListener("change", updateGrid)


let pathfindingSpeed = document.getElementById('pathfinding-speed')
pathfindingSpeed.addEventListener("change", changePathfindingSpeed)
changePathfindingSpeed();


let backTracingSpeed = document.getElementById('backtracing-speed')
backTracingSpeed.addEventListener("change", changeBacktracingSpeed)
changeBacktracingSpeed();


const grid = [];
const startNode = []
const endNode = []

// Creating the grid system
function updateGrid() {

    startEndFlags = 0

    // Clearing innerHTML
    container.innerHTML = '';
    document.getElementsByClassName('rows')[0].innerHTML = rowAmount.value;
    document.getElementsByClassName('columns')[0].innerHTML = columnAmount.value;

    // Adding the grid
    for (let i = 0; i < rowAmount.value; i++) {

        let row = document.createElement('div');
        row.className = 'grid-row';

        for (let j = 0; j < columnAmount.value; j++) {

            let cell = document.createElement('div');
            cell.className = `grid-cell grid-${i}-${j} not-found`;

            row.appendChild(cell);
        }

        container.appendChild(row);
    }


    // Creating a graph object using 2D array
    for (let i = 0; i < rowAmount.value; i++) {
        grid[i] = [];
        for (let j = 0; j < columnAmount.value; j++) {
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
            cellElement.style.backgroundColor = 'Green';
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
            cellElement.style.backgroundColor = 'Black';
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
function changePathfindingSpeed(){
    pathfindingSpeed = document.getElementById('pathfinding-speed')
    document.getElementsByClassName('Pathfinding speed')[0].innerHTML = `${pathfindingSpeed.value}x`
}

function changeBacktracingSpeed(){
    backTracingSpeed = document.getElementById('backtracing-speed')
    document.getElementsByClassName('Backtracing speed')[0].innerHTML = `${backTracingSpeed.value}x`
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

        await sleep(parseInt(500/pathfindingSpeed.value));
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

    if ((row + 1 < rowAmount.value) && !(grid[row + 1][col].isWall) && !(grid[row + 1][col].visited)) {
        grid[row + 1][col].visited = true;
        grid[row + 1][col].pastNode = node;
        neighborNodes.push(grid[row + 1][col])
    }

    if ((col + 1 < columnAmount.value) && !(grid[row][col + 1].isWall) && !(grid[row][col + 1].visited)) {
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

        await sleep(parseInt(200/backTracingSpeed.value));
    }

}
