var xSize=10;
var ySize=10;
var numberconst=10;
var number=numberconst;
var empty=xSize*ySize-number;
var razbivka=new Array();
var sqSize=25;
var call_i=0;

document.oncontextmenu=function(){
    return false;
};

newGame();

document.getElementById("set1_t").value=xSize;
document.getElementById("set2_t").value=ySize;
document.getElementById("set3_t").value=numberconst;

document.getElementById("button1").onclick=function(){
	newGame();
};

document.getElementById("button2").onclick=function(){
	document.getElementById("settings").style.display="block";
};

document.getElementById("apply").onclick=function(){
	document.getElementById("settings").style.display="none";
	xSize=document.getElementById("set1_t").value;
    ySize=document.getElementById("set2_t").value;
    numberconst=document.getElementById("set3_t").value;
	number=numberconst;
};

//////////////// генератор случайных неповторяющихся целых чисел ////////////////////////

function genArrRanNum (min, max) {                                                      // (20,30)
	var totalNumbers 		= max - min + 1,                                            // 30-20+1=11
		arrayTotalNumbers 	= [],                                                               
		arrayRandomNumbers 	= [],
		tempRandomNumber;
	while (totalNumbers--) {
		arrayTotalNumbers.push(totalNumbers + min);                                     // добавляем в массив 30, 29 ... 20
	};
	while (arrayTotalNumbers.length) {
		tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));  // создаем от 0 до 10/9...1
		arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);                   // забираем число из массива 30, 29... и уменьшаем массив
		arrayTotalNumbers.splice(tempRandomNumber, 1);
	};
	return arrayRandomNumbers;
};

///////////////////// генератор массива мин /////////////////////////////////////////////

function genArray(xSize, ySize, number){
	let min = 1;
    let max = xSize*ySize;
	let vybor=new Array();
    vybor=genArrRanNum (min, max);
	for (let i=-1; i<=xSize; i++){
		razbivka[i]=new Array();
		for (let j=0; j<ySize; j++){
			if ((vybor[i*ySize+j])<=number){
			    razbivka[i][j]=1;
			}
		    else{
				razbivka[i][j]=0;
			};
		};
	};
	for (let i=0; i<xSize; i++){
		razbivka[i][-1]=0;
		razbivka[i][ySize]=0;
	};
	for (let j=0; j<ySize; j++){
		razbivka[-1][j]=0;
		razbivka[xSize][j]=0;
	};
};

function newGame(){

plan=document.getElementById("plan");	
while (plan.firstChild) {
  plan.removeChild(plan.firstChild);
}

number=numberconst;
document.getElementById("number").innerHTML=number;
empty=xSize*ySize-numberconst;
genArray(xSize, ySize, number);

///////////////// создание минного поля ///////////////////

document.getElementById("bigplan").style.width=(xSize*sqSize+25)+"px";
document.getElementById("bigplan").style.height=(ySize*sqSize+135)+"px";
document.getElementById("plan").style.width=xSize*sqSize+"px";
document.getElementById("plan").style.height=ySize*sqSize+"px";
for (let i=0; i<xSize; i++){
	for (let j=0; j<ySize; j++){
		let newElement=document.createElement("div");
		newElement.className="square_closed";
		newElement.style.top=sqSize*j+"px";
		newElement.style.left=sqSize*i+"px";
		newElement.style.width=sqSize+"px";
		newElement.style.height=sqSize+"px";
		newElement.id=i+"_"+j;
		newElement.dataset.i=i;
		newElement.dataset.j=j;
		newElement.dataset.flag=0;
		newElement.dataset.min=razbivka[i][j];
		document.getElementById("plan").append(newElement);
	};
};

////////////////// нажатие на клетку /////////////

squares=document.getElementsByClassName("square_closed");
for (let k=0; k<squares.length; k++){
	let x=squares[k];
	x.onclick=function(){
		if(x.dataset.flag==0){
		    open1(x.dataset.i,  x.dataset.j);
			x.onclick=null;
			x.onclick=function(){
				open2(x.dataset.i,  x.dataset.j);
			};
		    x.oncontextmenu=null;
		    empty=document.getElementsByClassName("square_closed").length-numberconst;
		};
		//close1
		if (empty==0){
			winner();
		};
	};
	x.oncontextmenu=function(){
		// Проверка выигрыша ///
		if (x.dataset.flag==1){
			document.getElementById("number").innerHTML=document.getElementById("number").innerHTML-(-1);
		    x.style.backgroundImage=null;
			x.dataset.flag=0;
			if(razbivka[x.dataset.i][x.dataset.j]==1){
				number++;
			};
	    }
		else{
			document.getElementById("number").innerHTML=document.getElementById("number").innerHTML-1;
			x.style.backgroundImage="url('flag.png')";
            x.dataset.flag=1;
			if(razbivka[x.dataset.i][x.dataset.j]==1){
				number--;
			};
			if (number==0){
				winner();
			};
		};
	};
};

};

/////// функция открывания закрытой клетки ///////////////////////////////

function open1(i,j){
	document.getElementById(i+"_"+j).className="square_open";
	if (razbivka[i][j]==1){
		document.getElementById(i+"_"+j).style.backgroundImage="url('mineclick.png')";
		loser();
	}
	else {
		let y=0;
		for(ii=i-1; ii<i-(-2); ii++){
			for(let jj=j-1; jj<j-(-2); jj++){
			    if (razbivka[ii][jj]==1){
					y=y-(-1);
				}
			};
		};
		if(y>0){
			document.getElementById(i+"_"+j).innerHTML="<p class='pole'>"+y+"</p>";
			document.getElementById(i+"_"+j).onclick=function(){
				open2(i,j);
			};
			document.getElementById(i+"_"+j).oncontextmenu=null;
			numberColor(document.getElementById(i+"_"+j),y);
		}
		else{
			for(let ii=i-1; ii<i-(-2); ii++){
			    for(let jj=j-1; jj<j-(-2); jj++){
					if(ii>=0 && ii<xSize && jj>=0 && jj<ySize && document.getElementById(ii+"_"+jj).className=="square_closed" && document.getElementById(ii+"_"+jj).dataset.flag==0){
						if (call_i>5000){
						    setTimeout(function(){open1(ii,jj); call_i=0; }, 0);
							document.getElementById(ii+"_"+jj).onclick=function(){
								open2(ii,jj);
							};
							document.getElementById(ii+"_"+jj).oncontextmenu=null;
						}
						else{
						    call_i++;
							open1(ii,jj);
							document.getElementById(ii+"_"+jj).onclick=function(){
								open2(ii,jj);
							};
							document.getElementById(ii+"_"+jj).oncontextmenu=null;
						};
					};
			    };
		    };
		};
	};
};

/////// функция открывания с открытой клетки ///////////////////////////////


function open2(i,j){
	let y=0;
	for(ii=i-1; ii<i-(-2); ii++){
		for(let jj=j-1; jj<j-(-2); jj++){
			if (ii>=0 && ii<xSize && jj>=0 && jj<ySize && document.getElementById(ii+"_"+jj).dataset.flag==1){
			    y=y-(-1);
			};
		};
	};
	let valexist=document.getElementById(i+"_"+j).getElementsByTagName("p").length;
	let val=0;
	if(valexist){
	    val=document.getElementById(i+"_"+j).getElementsByTagName("p")[0].innerHTML;
    };
	if(val==y){
		for(let ii=i-1; ii<i-(-2); ii++){
		    for(let jj=j-1; jj<j-(-2); jj++){
			    if (ii>=0 && ii<xSize && jj>=0 && jj<ySize && document.getElementById(ii+"_"+jj).className=="square_closed" && document.getElementById(ii+"_"+jj).dataset.flag==0){
					open1(ii,jj);
			    };
		    };
	    };
	};
};

function open3(i,j){
    //alert(i+":"+j);  
};

//////// функция выигрыша ///////////////

function winner(){
	let squares=document.getElementsByClassName("square_closed");
	for(let k=0; k<squares.length; k++){
		let x=squares[k];
		let i=x.dataset.i;
		let j=x.dataset.j;
		if (razbivka[i][j]==1){
			x.style.backgroundImage="url('flag.png')";
		}
		else{
			x.style.border="1px #A0A0A0 solid";
		    let y=0;
		    for(ii=i-1; ii<i-(-2); ii++){
			    for(let jj=j-1; jj<j-(-2); jj++){
			        if (razbivka[ii][jj]==1){
					    y=y-(-1);
				    };
			    };
		    };
			if(y>0){
			    x.innerHTML="<p class='pole'>"+y+"</p>";
				numberColor(x,y);
		    };
		}; 
	};
	document.getElementById("number").innerHTML=0;
	//alert("you win");
};

//////// функция проигрыша ///////////////

function loser(){
	let squares=document.getElementsByClassName("square_closed");
	for(let k=0; k<squares.length; k++){
		let x=squares[k];
		let i=x.dataset.i;
		let j=x.dataset.j;
		x.onclick=null;
		x.oncontextmenu=null;
		if (razbivka[i][j]==1 && x.dataset.flag==0){
			x.style.backgroundImage="url('mine.png')";
			x.style.border="1px #A0A0A0 solid";
		}
	};
	//alert("you lose");
};

//////// раскраска цифр ///////////////
function numberColor(x,y){
	if (y==1){
		x.style.color="#00F";
	}
	else if (y==2){
		x.style.color="#080";
	}
	else if (y==3){
		x.style.color="#F00";
	}
	else if (y==4){
		x.style.color="#008";
	}
	else if (y==5){
		x.style.color="#800";
	}
	else if (y==6){
		x.style.color="#088";
	}
	else if (y==7){
		x.style.color="#000";
	}
	else if (y==8){
		x.style.color="#888";
	}
};
