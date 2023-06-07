
let startEndFlags = 0

const container = document.getElementsByClassName('board')[0];


// Variables containing total row & column amount in the board
let rowAmount = 0
let columnAmount = 0

// Event listener for algorithm speed slider
let algorithmSpeed = document.getElementById('algorithm-speed')
algorithmSpeed.addEventListener("change", changeAlgorithmSpeed)
changeAlgorithmSpeed();

window.addEventListener('resize', updateGrid);

let grid = [];
let startNode = []
let endNode = []


// 0 - Algorithm has not been run, 1 - Alrotihm is in progress, 2 - Algorithm has finished running
let algorithmRun = 0


// Creates the grid system dynamically
function updateGrid() {

    // Checks if the algorithm is running, if so returns
    if (algorithmRun == 1) {
        return
    }

    algorithmRun = 0;

    // Dynamically determines the row and column amount for the user
    rowAmount = parseInt(window.innerWidth / 10 * 9 / 20)
    columnAmount = parseInt((window.innerHeight - parseInt(document.getElementsByClassName('controls')[0].clientHeight) - 140) / 20);

    startEndFlags = 0

    // Clearing innerHTML
    container.innerHTML = '';

    // Adds cells to the board
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

    // Creates a graph object using 2D array
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
                lastDirection: null,
            };
        }
    }
    startNode = []
    endNode = []

    cellEventListener();
}

updateGrid();



// Mouse down action listeners
let isLeftMouseDown = false;

document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', handleMouseMove);

// Left mouse button is pressed
function handleMouseDown(event) {
    if (event.button === 0) {
        isLeftMouseDown = true;
    }
}

// Left mouse button is released
function handleMouseUp(event) {
    if (event.button === 0) {
        isLeftMouseDown = false;
    }
}

// Left mouse button is being held down
function handleMouseMove(event) {
    if (isLeftMouseDown) {
        updateCell(event.target, true);
    }
}


// Adds event listener to each grid cell
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

    if (cellElement.attributes.class == null) {
        return
    }

    cellgrid = cellElement.attributes.class.textContent;

    if (!(cellgrid.includes('grid-cell'))) {
        return
    }

    index = cellgrid.split(' ')[1].split('-')


    // Starting node
    if (startEndFlags == 0) {
        cellElement.classList.remove("not-found");
        cellElement.classList.add("startNode");
        grid[index[1]][index[2]].isStartNode = true;
        grid[index[1]][index[2]].visited = true;
        grid[index[1]][index[2]].cost = 0;
        startNode.push(index[1])
        startNode.push(index[2])
        startEndFlags += 1;
    }
    // End node
    else if ((startEndFlags == 1) && (cellgrid.split(" ")[2] != "startNode")) {
        cellElement.style.backgroundColor = 'Red';
        cellElement.classList.remove("not-found");
        cellElement.classList.add("endNode");
        grid[index[1]][index[2]].isEndNode = true;
        endNode.push(index[1])
        endNode.push(index[2])
        startEndFlags += 1;
    }
    // Wall Node
    else if ((cellgrid.split(" ")[2] != "endNode") && (cellgrid.split(" ")[2] != "startNode") && !(grid[index[1]][index[2]].visited)) {
        cellElement.style.backgroundColor = 'Grey';
        cellElement.classList.remove("not-found");
        cellElement.classList.add("wall");
        grid[index[1]][index[2]].isWall = true;
        removeWallBorders(index[1], index[2])
    }

}

// Removes all the walls from the grid. It the grid has already been run, completelly resets the grid
function removeWalls() {

    if (algorithmRun == 2) {
        updateGrid();
    }
    else if (algorithmRun == 1) {
        return
    }

    walls = document.getElementsByClassName('wall');
    let wallArray = Array.from(walls);

    for (let i = 0; i <= (wallArray.length - 1); i++) {
        wallArray[i].style.backgroundColor = 'White';
        wallArray[i].classList.remove("wall");
        wallArray[i].classList.add("not-found");
        index = wallArray[i].classList[1].split('-')
        grid[index[1]][index[2]].isWall = false
    }

    // Dynamically determines which class should be added
    wallborders = Array.from(document.getElementsByClassName('topWall21'));
    for (let i = 0; i <= (wallborders.length - 1); i++) {
        wallborders[i].classList.remove("topWall21");
    }

    wallborders = Array.from(document.getElementsByClassName('topWall22'));
    for (let i = 0; i <= (wallborders.length - 1); i++) {
        wallborders[i].classList.remove("topWall22");
    }

    wallborders = Array.from(document.getElementsByClassName('rightWall21'));
    for (let i = 0; i <= (wallborders.length - 1); i++) {
        wallborders[i].classList.remove("rightWall21");
    }

    wallborders = Array.from(document.getElementsByClassName('rightWall22'));
    for (let i = 0; i <= (wallborders.length - 1); i++) {
        wallborders[i].classList.remove("rightWall22");
    }

    wallborders = Array.from(document.getElementsByClassName('leftWall21'));
    for (let i = 0; i <= (wallborders.length - 1); i++) {
        wallborders[i].classList.remove("leftWall21");
    }

    wallborders = Array.from(document.getElementsByClassName('leftWall22'));
    for (let i = 0; i <= (wallborders.length - 1); i++) {
        wallborders[i].classList.remove("leftWall22");
    }

    wallborders = Array.from(document.getElementsByClassName('bottomWall21'));
    for (let i = 0; i <= (wallborders.length - 1); i++) {
        wallborders[i].classList.remove("bottomWall21");
    }

    wallborders = Array.from(document.getElementsByClassName('bottomWall22'));
    for (let i = 0; i <= (wallborders.length - 1); i++) {
        wallborders[i].classList.remove("bottomWall22");
    }

}


// Event listener for pathfinding speed slider
function changeAlgorithmSpeed() {
    algorithmSpeed = document.getElementById('algorithm-speed')
    document.getElementsByClassName('Algorithm speed')[0].innerHTML = `${algorithmSpeed.value}x`
}




function generateWalls() {

    if (algorithmRun == 2) {
        updateGrid();
    }
    else if (algorithmRun == 1) {
        return
    }

    for (let i = 0; i < rowAmount; i++) {
        for (let j = 0; j < columnAmount; j++) {
            if ((Math.random() >= 0.75) && !(grid[i][j].isEndNode) && !(grid[i][j].isStartNode)) {
                grid[i][j].isWall = true;
                document.getElementsByClassName(`grid-${i}-${j}`)[0].style.backgroundColor = 'Grey';
                document.getElementsByClassName(`grid-${i}-${j}`)[0].classList.remove('not-found');
                document.getElementsByClassName(`grid-${i}-${j}`)[0].classList.add('wall');
                removeWallBorders(i, j);
            }
        }
    }
}



function removeWallBorders(row, col) {

    row = parseInt(row)
    col = parseInt(col)

    if (grid[row][col].isWall) {

        leftCriteria = (row != 0) && (grid[row - 1][col].isWall);
        topCriteria = (col != 0) && (grid[row][col - 1].isWall);
        rightCriteria = (row != rowAmount - 1) && (grid[row + 1][col].isWall)
        bottomCriteria = (col != columnAmount - 1) && (grid[row][col + 1].isWall)


        // Merges walls from the left of the node
        if (leftCriteria) {
            if (window.getComputedStyle(grid[row - 1][col].element).borderLeft == '0px none rgb(0, 0, 0)') {
                grid[row - 1][col].element.classList.add('rightWall22')
            }
            else {
                grid[row - 1][col].element.classList.add('rightWall21')
            }

            if (window.getComputedStyle(grid[row][col].element).borderRight == '0px none rgb(0, 0, 0)') {
                grid[row][col].element.classList.add('leftWall22')
            }
            else {
                grid[row][col].element.classList.add('leftWall21')
            }
        }


        // Merges walls from the top of the node
        if (topCriteria) {
            if (window.getComputedStyle(grid[row][col - 1].element).borderTop == '0px none rgb(0, 0, 0)') {
                grid[row][col - 1].element.classList.add('bottomWall22')
            }
            else {
                grid[row][col - 1].element.classList.add('bottomWall21')
            }

            if (window.getComputedStyle(grid[row][col].element).borderBottom == '0px none rgb(0, 0, 0)') {
                grid[row][col].element.classList.add('topWall22')
            }
            else {
                grid[row][col].element.classList.add('topWall21')
            }

        }


        // Merges walls from the right of the node
        if (rightCriteria) {
            if (window.getComputedStyle(grid[row + 1][col].element).borderRight == '0px none rgb(0, 0, 0)') {
                grid[row + 1][col].element.classList.add('leftWall22')
            }
            else {
                grid[row + 1][col].element.classList.add('leftWall21')
            }

            if (window.getComputedStyle(grid[row][col].element).borderLeft == '0px none rgb(0, 0, 0)') {
                grid[row][col].element.classList.add('rightWall22')
            }
            else {
                grid[row][col].element.classList.add('rightWall21')
            }
        }


        // Merges walls from the right of the node
        if (bottomCriteria) {
            if (window.getComputedStyle(grid[row][col + 1].element).borderBottom == '0px none rgb(0, 0, 0)') {
                grid[row][col + 1].element.classList.add('topWall22')
            }
            else {
                grid[row][col + 1].element.classList.add('topWall21')
            }

            if (window.getComputedStyle(grid[row][col].element).borderTop == '0px none rgb(0, 0, 0)') {
                grid[row][col].element.classList.add('bottomWall22')
            }
            else {
                grid[row][col].element.classList.add('bottomWall21')
            }
        }

    }
}

// Algorithm selection menu
function startAlgorithm() {
    algorithmRun = 1;

    let selectedOption = dropdown.querySelector('option:checked');

    // Checking for null variables (start/end nodes)
    if ((startNode[0] == null) || (startNode[1] == null) || (endNode[0] == null) || (endNode[1] == null)) {
        return
    }

    if (selectedOption.value == 'Dijkstras' || selectedOption.value == 'BFS') {
        dijkstrasPathfinding();
    }
}





// Dijkstras algorithm

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Dijkstras algorithm
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
                neighborNodes[i].element.classList.add('foundElement');
            }

            currentNodes.push(neighborNodes[i])
            neighborNodes.pop(i);
        }

        await sleep(parseInt(250 / algorithmSpeed.value));
    }

    if (foundEndNode == true) {
        await sleep(500);
        finalNode()
    }
    else {
        algorithmRun = 2;
    }
}



// Find all neighbours from a cell that can be pathed to. Excludes walls and visited nodes
function getNeighbors(node, neighborNodes) {
    row = parseInt(node.element.classList[1].split('-')[1])
    col = parseInt(node.element.classList[1].split('-')[2])

    if ((col > 0) && !(grid[row][col - 1].isWall) && !(grid[row][col - 1].visited)) {
        grid[row][col - 1].visited = true;
        grid[row][col - 1].lastDirection = 'bottom';
        grid[row][col - 1].pastNode = node;
        neighborNodes.push(grid[row][col - 1])
    }

    if ((row + 1 < rowAmount) && !(grid[row + 1][col].isWall) && !(grid[row + 1][col].visited)) {
        grid[row + 1][col].visited = true;
        grid[row + 1][col].lastDirection = 'left';
        grid[row + 1][col].pastNode = node;
        neighborNodes.push(grid[row + 1][col])
    }

    if ((col + 1 < columnAmount) && !(grid[row][col + 1].isWall) && !(grid[row][col + 1].visited)) {
        grid[row][col + 1].visited = true;
        grid[row][col + 1].lastDirection = 'top';
        grid[row][col + 1].pastNode = node;
        neighborNodes.push(grid[row][col + 1])
    }

    if ((row > 0) && !(grid[row - 1][col].isWall) && !(grid[row - 1][col].visited)) {
        grid[row - 1][col].visited = true;
        grid[row - 1][col].lastDirection = 'right';
        grid[row - 1][col].pastNode = node;
        neighborNodes.push(grid[row - 1][col])
    }
    return;

}

// Creates a path from the endNode to the startNode
async function finalNode() {

    targetNode = grid[startNode[0]][startNode[1]]
    backTrackNode = grid[endNode[0]][endNode[1]]

    if (backTrackNode.lastDirection == 'left') {
        backTrackNode.element.classList.add('leftWall21')
    }
    else if (backTrackNode.lastDirection == 'right') {
        backTrackNode.element.classList.add('rightWall21')
    }
    else if (backTrackNode.lastDirection == 'top') {
        backTrackNode.element.classList.add('topWall21')
    }
    else if (backTrackNode.lastDirection == 'bottom') {
        backTrackNode.element.classList.add('bottomWall21')
    }

    
    while (targetNode != backTrackNode) {
        previousNodeDirection = backTrackNode.lastDirection
        backTrackNode = backTrackNode.pastNode

        // Removes the borders during backtrackNodes
        if ((previousNodeDirection == 'top') && (backTrackNode.lastDirection == 'top') || ((previousNodeDirection == 'bottom') && (backTrackNode.lastDirection == 'bottom'))) {
            backTrackNode.element.classList.add('topBottomBacktrack')
        }
        else if (((previousNodeDirection == 'right') && (backTrackNode.lastDirection == 'right')) || ((previousNodeDirection == 'left') && (backTrackNode.lastDirection == 'left'))) {
            backTrackNode.element.classList.add('leftRightBacktrack')
        }
        else if (((previousNodeDirection == 'top') && (backTrackNode.lastDirection == 'left')) || ((previousNodeDirection == 'right') && (backTrackNode.lastDirection == 'bottom'))) {
            backTrackNode.element.classList.add('topLeftBacktrack')
        }
        else if (((previousNodeDirection == 'top') && (backTrackNode.lastDirection == 'right')) || ((previousNodeDirection == 'left') && (backTrackNode.lastDirection == 'bottom'))) {
            backTrackNode.element.classList.add('topRightBacktrack')
        }
        else if (((previousNodeDirection == 'bottom') && (backTrackNode.lastDirection == 'right')) || ((previousNodeDirection == 'left') && (backTrackNode.lastDirection == 'top'))) {
            backTrackNode.element.classList.add('bottomRightBacktrack')
        }
        else if (((previousNodeDirection == 'bottom') && (backTrackNode.lastDirection == 'left')) || ((previousNodeDirection == 'right') && (backTrackNode.lastDirection == 'top'))) {
            backTrackNode.element.classList.add('bottomLeftBacktrack')
        }

        // Edge case where the node is the targetNode
        backTrackNode.element.classList.remove('foundElement')
        if (targetNode == backTrackNode) {
            if (previousNodeDirection == 'left') {
                backTrackNode.element.classList.add('rightWall21')
            }
            else if (previousNodeDirection == 'right') {
                backTrackNode.element.classList.add('leftWall21')
            }
            else if (previousNodeDirection == 'top') {
                backTrackNode.element.classList.add('bottomWall21')
            }
            else if (previousNodeDirection == 'bottom') {
                backTrackNode.element.classList.add('topWall21')
            }
            break;
        }

        // Update the backtract cell colour
        backTrackNode.element.style.backgroundColor = '#ffab03';

        // Sleep for visual appeal
        await sleep(parseInt(100 / algorithmSpeed.value));
    }

    algorithmRun = 2;

}