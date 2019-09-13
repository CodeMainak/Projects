var activeplayer,dice,score,actualscore,gamePlaying;

init();
document.querySelector(".btn-roll").addEventListener("click",function(){
	if(gamePlaying){
		dice=Math.floor(Math.random()*6)+1;
	var diceDOM=document.querySelector(".dice");
	diceDOM.style.display='block';
	diceDOM.src="dice-"+dice+".png";
	if(activeplayer===0)
		document.getElementById("current-0").textContent=dice;
	else
		document.getElementById("current-1").textContent=dice;
	if(dice!==1)
	{
		//add score
			score+=dice;
			document.querySelector("#current-"+activeplayer).textContent=score;
	}else
		nextplayer();
	}
});
document.querySelector(".btn-hold").addEventListener('click',function(){
	//add current score to global score;
	if(gamePlaying){
		actualscore[activeplayer]+=score;
	//Update to UI;
	document.getElementById("score-"+activeplayer).textContent=actualscore[activeplayer];
	//Checking if player has won the game or not;
	if(actualscore[activeplayer]>=100){
		document.querySelector("#name-"+activeplayer).textContent='WINNER!';
		document.querySelector(".dice").style.display='none';
		document.querySelector(".player-"+activeplayer+"-panel").classList.add('winner');
		document.querySelector(".player-"+activeplayer+"-panel").classList.remove('active');
		document.querySelector("#current-"+activeplayer).textContent='0';
		gamePlaying=false;
	}

	else{
		nextplayer();
		}
	}
	
});
function nextplayer()
{
	activeplayer===1?activeplayer=0:activeplayer=1;
		score=0;
	document.getElementById("current-0").textContent='0';	
	document.getElementById("current-1").textContent='0';	

	document.querySelector(".player-0-panel").classList.toggle('active');
	document.querySelector(".player-1-panel").classList.toggle('active');

	document.querySelector(".dice").style.display='none';
}
document.querySelector(".btn-new").addEventListener("click",init);
function init()
{
	score=0,
	actualscore=[0,0];
	activeplayer=0;
	document.querySelector(".dice").style.display='none';
	document.getElementById("score-0").textContent='0';
	document.getElementById("score-1").textContent='0';
	document.getElementById("current-0").textContent='0';
	document.getElementById("current-1").textContent='0';
	document.getElementById("name-0").textContent="Player 1";
	document.getElementById("name-1").textContent="Player 2";
	document.querySelector(".player-0-panel").classList.remove('winner');
	document.querySelector(".player-1-panel").classList.remove('winner');
	document.querySelector(".player-0-panel").classList.remove('active');
	document.querySelector(".player-1-panel").classList.remove('active');
	document.querySelector(".player-0-panel").classList.add('active');
	gamePlaying=true;
}

















