var activeplayer,dice,score1=0,score2=0;
activeplayer=0;

document.getElementById("score-0").textContent='0';
document.getElementById("score-1").textContent='0';

document.getElementById("current-0").textContent='0';
document.getElementById("current-1").textContent='0';

document.querySelector(".dice").style.display='none';
document.querySelector(".btn-roll").addEventListener("click",function()
{
	var dice=Math.floor(Math.random()*6)+1;
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
		if(activeplayer===1)
			score1+=dice;
		else
			score2+=dice;
	}else{
		//nextplayers turn;
		document.getElementById("current-"+activeplayer+).textContent='0';
		if(activeplayer===1)
			activeplayer=0;
		else
			activeplayer=1;

	}
});

