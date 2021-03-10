function ChessBox(props){

  var style = {}
  if(props.board === "noChess" && props.hover){
    style = {
      background: props.curPlayer,
      cursor: "pointer",
      opacity: 0.1
    }
  }
  else if(props.board !== "noChess"){
    style = {background: props.board}
  }

  return (
    <div className="chessBox"
          onClick={() => props.onClick(props.value)}
          onMouseEnter={() => props.onMouseEnter(props.value)}
          onMouseLeave={() => props.onMouseLeave(props.value)}>
      <div className="chess" style={style}></div>
    </div>
  )
}


class MainBoard extends React.Component{
  constructor(){
    super()
    this.boardWidth = 10;
    this.boardHeight = 10;
    this.state = {
      board: Array(this.boardWidth * this.boardHeight).fill("noChess"),
      boardHover: Array(this.boardWidth * this.boardHeight).fill(false),
      gameStatus: "running" //running, black, white, draw
    }
    this.curPlayer = "black"
    this.winningType = ["no"]

    const resetBtn = document.getElementById("changeSizeButton")
    resetBtn.addEventListener("click", () => {
      let size = document.getElementById("inputSize").value
      if(size >= 5 && size <= 50){
        this.reStart(size)
      }else{
        alert("The size should be >=5 and <=50")
      }
    })
  }

  reStart(size=false){
    if(size !== false){//only change size when input size exist
      this.boardWidth = size;
      this.boardHeight = size;
    }
    this.curPlayer = "black"
    this.winningType = ["no"]
    this.setState({
      board: Array(this.boardWidth * this.boardHeight).fill("noChess"),
      boardHover: Array(this.boardWidth * this.boardHeight).fill(false),
      gameStatus: "running"
    })
  }

  handleClick(pos){
    if(this.state.gameStatus !== "running"){
      return
    }

    if(this.state.board[pos] !== "noChess"){
      return
    }

    this.setState((prevState) => {
      const newBoard = prevState.board.slice()
      newBoard[pos] = this.curPlayer
      this.curPlayer = this.curPlayer === "black" ? "white" : "black"

      return {
          board: newBoard
        }
    })

  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.board !== prevState.board){
      this.checkWinner(this.state.board)
    }
  }


  handleHover(pos, bool){
    this.setState((prevState) => {
      const newBoard = prevState.boardHover.slice()
      newBoard[pos] = bool
      return {
        boardHover: newBoard
        }
    })
  }

  checkWinner(newBoard){
    if(newBoard.includes("noChess") === false){
      this.setState({
        gameStatus: "draw"
      })
      return
    }

    for(let i=0;i<this.boardHeight;i++){
      for(let j=0;j<this.boardWidth-4;j++){
        var box_row = []
        var box_col = []
        var box_dia = []
        var box_dia_reverse = []
        for(let k=0, z=4;k<5;k++, z--){
          box_row.push(newBoard[i*this.boardHeight + j + k])
          box_col.push(newBoard[(j+k)*this.boardHeight + i])
          if(i <= this.boardWidth - 5){
            box_dia.push(newBoard[(j+k)*this.boardHeight + i + k])
            box_dia_reverse.push(newBoard[(j+z)*this.boardHeight + i + k])
          }
        }

        ["black", "white"].forEach((player) => {
          [box_row, box_col, box_dia, box_dia_reverse].forEach((box, index) => {
            if(box.length === 5 && box.every((value) => {return value === player})){
              this.setState({
                gameStatus: player
              })

              switch(index){
                case 0:
                  this.winningType = ["row", j, i]
                  break;
                case 1:
                  this.winningType = ["col", i, j]
                  break;
                case 2:
                  this.winningType = ["dia", i, j]
                  break;
                case 3:
                  this.winningType = ["dia_re", i, j]
                  break;
                default:
              }

              return;
            }
          })
        })
      }
    }
  }

  render(){
    var box = [];
    for(let i=0; i<this.boardHeight; i++){
      var box_row = [];
      for(let j=0; j<this.boardWidth; j++){
        var position = i*this.boardWidth + j
        box_row.push(<ChessBox
                      key={position}
                      value={position}
                      onClick={(pos) => this.handleClick(pos)}
                      board={this.state.board[position]}
                      hover={this.state.boardHover[position]}
                      onMouseEnter={(pos) => this.handleHover(pos, true)}
                      onMouseLeave={(pos) => this.handleHover(pos, false)}
                      curPlayer={this.curPlayer}/>)
      }
      box.push(<div key={i} className="box-row">{box_row}</div>)
    }

    return (
            <div style={{position: "relative"}}>
              {box}

              <ShowLine winningType={this.winningType} boardWidth={this.boardWidth} gameStatus={this.state.gameStatus}/>
              <ShowWinner gameStatus={this.state.gameStatus} reStart={() => {this.reStart()}}/>
            </div>
          )
  }
}


function ShowLine(props){
  const boxWidth = 52, boxHeight = 52 //the extra 2px is the border
  var style={
    position: "absolute",
    top: "0px",
    left: "0px",
    visibility: props.gameStatus === "running" ? "hidden" : "visible"
  }
  if(props.winningType[0] === "row"){
    style["borderTop"] = "5px solid yellow"
    style["width"] = `${4*boxWidth}px`
    style["transform"] = `translate(${props.winningType[1]*boxWidth+boxWidth/2}px, ${props.winningType[2]*boxHeight+boxHeight/2}px)`
  }else if(props.winningType[0] === "col"){
    style["borderLeft"] = "5px solid yellow"
    style["height"] = `${4*boxHeight}px`
    style["transform"] = `translate(${props.winningType[1]*boxWidth+boxWidth/2}px, ${props.winningType[2]*boxHeight+boxHeight/2}px)`
  }else if(props.winningType[0] === "dia"){
    style["borderTop"] = "5px solid yellow"
    style["width"] = `${4*boxWidth}px`
    style["transform"] = `translate(${props.winningType[1]*boxWidth+boxWidth/2}px, ${(props.winningType[2]+2)*boxHeight+boxHeight/2}px) skewY(45deg)`
  }else if(props.winningType[0] === "dia_re"){
    style["borderTop"] = "5px solid yellow"
    style["width"] = `${4*boxWidth}px`
    style["transform"] = `translate(${props.winningType[1]*boxWidth+boxWidth/2}px, ${(props.winningType[2]+2)*boxHeight+boxHeight/2}px) skewY(-45deg)`
  }

  return(
    <div style={style}></div>
  )
}


function ShowWinner(props){
  return (
          <div style={{position: "absolute",
                      top: "0px",
                      left: "0px",
                      width: "100%",
                      height: "100%",
                      background: props.gameStatus === "running"? "rgba(255,255,255,0)" : "rgba(255,255,255,0.5)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "60px",
                      fontWeight: "bold",
                      color: props.gameStatus === "running"? "rgba(0,0,0,0)" : "rgba(0,0,0,1)",
                      transitionProperty: "background color",
                      transitionDuration: props.gameStatus === "running"? "0s" : "5s",
                      visibility: props.gameStatus === "running"? "hidden" : "visible"}}
                      >

                      <div>{
                        props.gameStatus === "draw" ? "Draw" : props.gameStatus === "black" ?
                        "Black won!" : "White won!"
                      }</div>
                      <button onClick={props.reStart} className="restartButton">Restart</button>
          </div>

  )
}


ReactDOM.render(<MainBoard />,document.getElementById('react-root'));
