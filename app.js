document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    let width = 10;
    let bombAmount = 20;
    let squares = [];

    //function to create board 
    function createBoard(){

        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort( () => Math.random() - 0.5)
        
        for(let i = 0; i < width*width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square)
            squares.push(square);
        }

        //add numbers around bombs
        for(let i=0; i < squares.length; i++){
            // define a left edge
            const isLeftEdge = i % width === 0;
            const isRightEdge = i % width === width-1;
            let total = 0;
            
            if(squares[i].classList.contains('valid')){
                if( i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                if( i < 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total);
                console.log(squares[i]);
            }
        }
    }
    
    createBoard();
})