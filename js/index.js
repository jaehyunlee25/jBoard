var cf=new jCommon(),
	dl=new datalayer(),
	sc=new jSCREEN(),
	jb=new jBOARD();

startWSHTTPcall(main);
	
function main(){
	dl.login(function(val){
		if(val) init();
		else mkLogin();
	});
};
function init(){
	document.body.innerHTML="";
	var header=cf.mkTag("div",document.body),
		body=cf.mkTag("div",document.body),
		btnBoard=cf.mkTag("button",header),
		btnDiary=cf.mkTag("button",header);
	btnBoard.innerHTML="BOARD";	
	btnDiary.innerHTML="Diary";	
	btnBoard.onclick=clickaction;
	btnDiary.onclick=goDiary;
	btnBoard.onclick();
	function clickaction(){
		body.innerHTML="";
		dl.getboardtree(function(arr){
			mkBoard(arr,body);
		});
	};
	function goDiary(){
		location.href="diary.html";
	};
};
function memberjoin(){
	document.body.innerHTML="";
	var dv=cf.mkTag("div",document.body),
		tb=cf.mkTable(6,2,dv),
		arr=[
			["name","","[0-9a-zA-Z가-핳]+"],
			["type","","^[0-9]$"],
			["phone","","[0-9]{9,}"],
			["others","",""],
			["password","","[0-9]{4,}"],
			["","",""]
		],
		ipts=[];
	tb.cells.trav(function(row,i){
		row.trav(function(col,k){
			col.innerHTML=arr[i][k];
			if(i<5){
				if(k==0) cf.setCss(col,{textAlign:"right"});
				if(k==1){
					var ipt=cf.mkTag("input",col);
					ipts.push(ipt);
					cf.setCss(col,{textAlign:"left"});
				}
			}else{
				if(k==1){
					var btn=cf.mkTag("button",col);
					btn.innerHTML="JOIN";
					btn.onclick=btnonclick;
					cf.setCss(col,{textAlign:"left"});
				}
			}
		});
	});
	cf.setCss(dv,{width:1200+"px",margin:"auto"});
	function btnonclick(){
		var obj={}, 
			chk={};
		ipts.trav(function(ipt,i){
			var re=new RegExp(arr[i][2]);
				chk[arr[i][0]]=re.test(ipt.value);
			if(i<5) obj[arr[i][0]]=ipt.value;
		});
		for(var el in chk){
			if(!chk[el]){
				alert("정보를 정확히 입력해 주세요.");
				return;
			}
		}
		dl.newmemberjoin(obj,function(d){
			document.body.innerHTML="";
			main();
		});
	};
};
function mkBoard(arr,p){
	var tb=cf.mkTable(1,2,p),
		jsn=cf.arToJson(arr),
		tree=new EXPLORER(jsn,tb.cells[0][0]);
	tree.setHeader(true);
	cf.setCss(tb.table,{textAlign:"left",verticalAlign:"top",width:1200+"px",marginTop:20+"px"});
	cf.setCss(tb.cells[0][0],{width:25+"%",height:750+"px"});
	cf.setCss(tb.cells[0][1],{verticalAlign:"top"});

	tree.fncAdd=function(obj,prm,fnc){
		prm.kind=prm.name;
		prm.title=prm.name+" board";
		dl.addboardtree(prm,fnc);
	};
	tree.fncDel=function(prm,fnc){
		dl.delboardtree(prm,fnc);
	};
	tree.fncMod=function(obj,prm,fnc){
		obj.con.kind=prm.name;
		obj.con.title=prm.name+" board";
		prm.kind=prm.name;
		prm.title=prm.name+" board";
		dl.modboardtree(prm,fnc);
	};
	tree.fncSel=function(ob){
		tb.cells[0][1].innerHTML="";
		if(ob.kind=="root") return;
		jb.callBoard(ob.key,ob.title,tb.cells[0][1]);
	};
};
function mkLogin(){
	document.body.innerHTML="";
	var tb=cf.mkTable(3,2,document.body),
		iptName=cf.mkTag("input",tb.cells[0][1]),
		iptPassword=cf.mkTag("input",tb.cells[1][1]),
		btnEnter=cf.mkTag("button",tb.cells[2][1]),
		btnSearch=cf.mkTag("button",tb.cells[2][1]),
		btnJoin=cf.mkTag("button",tb.cells[2][1]);
	tb.cells[0][0].innerHTML="이름";
	tb.cells[1][0].innerHTML="비번";
	btnEnter.innerHTML="Login";
	btnSearch.innerHTML="Forget";
	btnJoin.innerHTML="Join";
	tb.cells.trav(function(row,i){
		row.trav(function(col,k){
			if(k==0) cf.setCss(col,{textAlign:"right"});
			if(k==1) cf.setCss(col,{textAlign:"left"});
		});
	});
	iptPassword.type="password";
	tb.table.width=50+"%";
	btnEnter.onclick=function(){
		var obj={
			name:iptName.value,
			password:iptPassword.value
		};
		dl.loginEnter(obj,function(data){
			if(data.length==1){
				lss("regId",data[0].id);
				init();
			}else{
				alert("존재하지 않는 사용자 입니다.");
			}
		});
		/* var obj={
			name:iptName.value,
			password:iptPassword.value
		};
		call.api("loginEnter",obj,function(data){
			if(data.response.length==1){
				lss("regId",data.response[0].id);
				init();
			}else alert("존재하지 않는 사용자 입니다.");
		}); */
	};
	btnJoin.onclick=function(){
		memberjoin();
	};
	btnSearch.onclick=function(){
		alert("id/pw를 잊으셨나요?");
	};
};