document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const flagsLeft = document.getElementById('flags-left');
    const result = document.getElementById('result');
    const startButton = document.getElementById('startButton');
    let width = 10;
    let bombAmount = 20;
    let squares = [];
    let isGameOver = true;
    let flags = 0;

    //function 1 - to create board 
    function createBoard(){

        flagsLeft.innerHTML = bombAmount;
        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort( () => Math.random() - 0.5);
        
        for(let i = 0; i < width*width; i++) {
            const square = document.createElement('div');
            // giving all squares an id
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            // add event listener for normal click
            square.addEventListener('click', () => {
                click(square);
            })

            // add event listener for right click
            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        startButton.addEventListener('click', () => {
            isGameOver = false;
        })

        //add numbers around bombs
        for(let i=0; i < squares.length; i++){
            // define a left edge
            const isLeftEdge = i % width === 0;
            const isRightEdge = i % width === width-1;
            let total = 0;
            
            if(squares[i].classList.contains('valid')){
                if( i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) {total++}
                if( i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) {total++}
                if( i > 10 && squares[i - width].classList.contains('bomb')) total++
                if( i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
                if( i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                if( i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
                if( i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                if( i < 89 && squares[i + width].classList.contains('bomb')) total++

                squares[i].setAttribute('data', total);
            }
        }
    }
    
    createBoard();

    // function 2 - add flag with right click
    function addFlag(square){
        if( isGameOver) return;
        if(!square.classList.contains('checked') && (flags < bombAmount)){
            if(!square.classList.contains('flag')){
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                flagsLeft.innerHTML = bombAmount - flags;
                // check for win after each flag added
                checkForWin();
            }
            else{
                square.classList.remove('flag');
                square.innerHTML = '';
                flags-- ;
                flagsLeft.innerHTML = bombAmount - flags;
            }
        }

    }

    // function 3 - to handle actions when a square is clicked
    function click(square){
        let currentId = square.id;

        if(isGameOver) return;
        if(square.classList.contains('checked') || square.classList.contains('flag')) return;
        if(square.classList.contains('bomb')){
            gameOver(square);
        } else{
            const total = square.getAttribute('data');
            if(total != 0){
                square.classList.add('checked');
                square.innerHTML = total;
                return;
            }
            checkSquare(square, currentId);
            square.classList.add('checked');
        }
    }

    // function 4 - check all neighbouring squares once a square is clicked
    function checkSquare(square, currentId){
        const isLeftEdge = (currentId % width) === 0 ;
        const isRightEdge = (currentId % width) === (width-1);

        setTimeout( () => {
            // checking square on the west
            if(currentId > 0 && !isLeftEdge){
                const newId = squares[parseInt(currentId)-1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            // checking north-west square
            if(currentId > 11 && !isLeftEdge){
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            // checking square on the north
            if(currentId > 10){
                const newId = squares[parseInt(currentId) - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            // checking north-east square
            if(currentId > 9 && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            // checking square on the east
            if(currentId < 98 && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }        

            // checking south-east square
            if(currentId < 88 && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            // checking square on the south
            if(currentId < 89){
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            // checking south-west square
            if(currentId < 90 && !isLeftEdge){
                const newId = squares[parseInt(currentId) + width - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10)
    }

    // function 5 - to determine when game is over
    function gameOver(square){
        result.innerHTML = 'BOOM, You clicked on a mine! 💣';
        isGameOver = true;
        startButton.disabled = true;
        startButton.style.backgroundColor = "lightGrey";

        // show all bombs when game is over
        squares.forEach( square => {
            if(square.classList.contains('bomb')){
                square.innerHTML = '💣';
            }
        })
    }

    // function 6 - to check for win
    function checkForWin() {
        let matches = 0;
        for(let i = 0; i < squares.length; i++){
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches++;
            }
            if(matches === bombAmount){
                result.innerHTML = 'You Win!';
                isGameOver = true;
            }
        }
    }
})


