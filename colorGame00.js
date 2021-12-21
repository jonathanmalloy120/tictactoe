function checkWinner (state) {
  //adding test comment 
  console.log('winner has run')
  const win = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  for(let i =0; i < win.length; i++){
    const [a,b,c] = win[i];
    if(state[a]==state[b] && state[a] == state[c] && state[a] != null) {
      console.log('winner found at',a,b,c)
      return state[a];
    }
  }
  console.log('no winner found')
  return null;
}

const Square = ( { id, player, newState } ) => { //replacing "{ id }"" with "props" and then using props.id also works
  const [color,setColor] = React.useState('red');
  const [status,setStatus] = React.useState(null);
  const oandx = ['O','X'];

  const palet = ['red','blue','green','yellow'];
  const getRandomColor = palet => {
    let length = palet.length;
    return palet[Math.floor(Math.random(length)*length)];
  }
  React.useEffect(()=> {
    //console.log(`Render ${id}`);
    //return () => console.log(`unmounting Square ${id}`)
  }) 
  return (
    <button id = {id} onClick = {(e) => {
      let newCol = getRandomColor(palet) // get a random color
      setColor(newCol); //set state of that square to the new color
      e.target.style.background = newCol; //update the background of the square to the color (Because setcolor is too slow because it is async)
      let nextPlayer = newState(id) //adding square to state of game so parent knows about it. 
                                                       //Also the newState func returns nextplayer which we are capturing
      setStatus(nextPlayer); //nextPlayer is what comes from the parent via return val of newState, which is how all the squares stay coordinated
    }}> {oandx[status]} </button>
  )
}

const Board = () => {
  const [player, setPlayer] = React.useState(1);
  const [mounted,setMounted] = React.useState(true);
  const [random,setRandom] = React.useState(0);
  const [state, setstate] = React.useState(Array(9).fill(null));

  let status = `Player ${player}`;
  let winner = checkWinner(state);
  if(winner != null) status = `player ${winner} wins!`

  const newState = idOfSquare => {
    let currPlayer = player;
    state[idOfSquare] = currPlayer; //use old player before we update to newPlayer that way next click will be primed for newPlayer after recording state
    setstate(state); //we manually update 'state', but use setState to make sure React actually sets it correctly
    let newPlayer = (player + 1) %2;
    setPlayer(newPlayer);
    return currPlayer;
  }

  const toggle = ()=> setMounted(!mounted); //invert the state of mounted

  const reRender = () => setRandom(Math.random()) // doesn't do anything, just forces components to re-render by changing the state

  function renderSquare(i) {
    return <Square id = {i} player = {player} newState = {newState} ></Square>;
  }


  return (
    <div
      className="game-board">
        <div className = "grid-row">
          {mounted && renderSquare(0)}
          {mounted && renderSquare(1)}
          {mounted && renderSquare(2)}
        </div>
        <div className = "grid-row">
          {mounted && renderSquare(3)}
          {mounted && renderSquare(4)}
          {mounted && renderSquare(5)}
        </div>
        <div className = "grid-row">
          {mounted && renderSquare(6)}
          {mounted && renderSquare(7)}
          {mounted && renderSquare(8)}
        </div>
      <div id="info">
        <button onClick = {toggle}>Show/Hide Row</button>
        <button onClick = {reRender}>Re-Render</button>
        <h1>{status}</h1>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Board />, document.getElementById("root"));

/*
old way that doesn't pass easily to children
onClick={(e) => {
  setPlayer((player + 1) %2);
  status = `Player ${player}`;
  e.target.style.background = 'red';
  e.target.style.width = '400px';
}}
*/
