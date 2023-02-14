var aSense,				//직전 기억
	aActions=[0,1],		//가능 행위 목록
	aState={},			//빈 서판(tabla rasa)
	
	wStimulus,			//직전 기억
	wState={"0 and 0":0,"0 and 1":0, "1 and 0":0, "1 and 1":1},	//자극 목록
	
	fncs=[agent,world],
	cnt=0,
	t=setInterval(f=>{
		var idx=cnt%2;
		fncs[idx](fncs[!idx*1]());
		cnt++;
	},1000);

function agent(wld){	
	//내가 세상에게 하는 일
	if(wld==undefined) return whenResponse();
	else whenSense(wld);
};
function world(agt){
	//세상이 agent에게 주는 값 생성:출력 행위
	if(agt==undefined) return whenStimulate();
	else whenReceive(agt);
};
//for world
function whenStimulate(){
	var list={good:true,bad:true};
	!list[wStimulus] && (wStimulus=Object.keys(wState)[gr(3)]);
	var stimulus=wStimulus;
	list[wStimulus] && (wStimulus=undefined);
	return stimulus;
};
function whenReceive(resp){
	resp>-1 && log(resp);
	//agent 값이 들어 왔을 때의 행위:비출력 행위
	var actions={
		true(){wStimulus="good"},
		false(){wStimulus="bad"}
	};
	(wStimulus!=undefined) && actions[(wState[wStimulus]==resp)]();
};
//for agent
function whenSense(sense){
	log(sense);
	//세상이 나에게 wld를 주었을 때, 하는 일
	var actions={
		good(){
			aState[sense]=-1;
			aSense=sense;
		},
		bad(){
			var actions={
				0(){return 1},
				1(){return 0}
			};
			aState[aSense]=actions[aState[aSense]]();
			aState[sense]=-2;
			aSense=sense;
		}
	};
	actions[sense] && actions[sense]();
	
	!actions[sense] && aState[sense]==undefined && (aState[sense]=aActions[gr(1)]);
	!actions[sense] && (aSense=sense);
};
function whenResponse(){
	//세상에 하는 행동
	return aState[aSense];
};
