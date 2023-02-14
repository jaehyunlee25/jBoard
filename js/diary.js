var ws=new WS("wss://mnemosynesolutions.co.kr/wss/diary",main),
	cf=new jCommon(),
	files={},
	/* call={
		getList(fnc){
			var param={__command:"getList"};
			ws.call(param,fnc);
		}
	}, */
	list;
function main(){
	call.api("getList",{},data=>{
		list=data.response.result;
		procList();
	});
};

/* fFile.onchange=function(){
	
};
btnFile.onclick=function(){
	var file=fFile.files[0],
		fd=new FormData();
	
	fd.append("filename",file.name);
	fd.append("type",file.type);
	fd.append("file",file);
	
	jFile("/fileupload/",fd,function(res){
		var param=JSON.parse(res);
		aFile.href=param.path;
		aFile.innerHTML=param.path;
		aFile.download=param.name;
	});
	
}; */
btnGoBoard.onclick=function(){
	location.href="index.html";
};
btnPastToday.onclick=function(){
	mkPop();
};
function mkPop(){
	var t=new Date(),
		pop=layerAlert("과거오늘"),
		con=cf.mkTag("div",pop),
		cvr=cf.mkTag("div",con),
		month=cf.mkTag("select",cvr),
		sp1=cf.mkTag("span",cvr),
		date=cf.mkTag("select",cvr),
		sp2=cf.mkTag("span",cvr),
		card=cf.mkTag("div",con);
		
	pop.css("background-color:#eee;");
	con.css("height:600px;overflow:auto;");
	cvr.css("padding:20px;");
	month.css("padding:5px;");
	date.css("padding:5px;");
	
	sp1.html("월");
	sp2.html("일");
	
	pop.parentNode.parentNode.border=0;
	
	around(12,i=>{
		var opt=cf.mkTag("option",month);
		opt.html(cf.addzero(i+1));
	});
	around(31,i=>{
		var opt=cf.mkTag("option",date);
		opt.html(cf.addzero(i+1));
	});
	month.value=cf.addzero(t.getMonth()+1);
	date.value=cf.addzero(t.getDate());
	date.card=card;
	date.month=month;
	
	month.onchange=popMonthChange;
	date.onchange=popDateChange;
	
	date.onchange();
};
function popMonthChange(){
	popDateChange();
};
function popDateChange(){
	this.card.html("");
	var res=[],
		self=this;
	list.trav(ob=>{
		if(ob.title.has([self.month.value,self.value].join("-"))) res.push(ob);
	});
	res.trav(ob=>{
		var div=cf.mkTag("div",self.card);
		div.css("width:400px;margin:auto;text-align:left;overflow:auto;background-color:ivory;padding:10px;margin-bottom:50px;");
		cf.mkTag("div",div).html(ob.title);
		cf.mkTag("div",div).html(procCon(ob.cont));
	});
};
function procList(){
	data=list;
	if(data.length==0) return;
	data.trav(function(obj,i){
		mkCard(obj);
	});
};
function mkCard(obj){
	var div=cf.mkTag("div",contents);
	div.data=obj;
	div.className="card";
	cf.mkTag("div",div)
		.txt(cf.commify(obj.id))
		.css("font-size:10px;color:gray;text-align:right;border-bottom:1px solid #aaa;padding:5px;");
	cf.mkTag("div",div)
		.txt(procCon(obj.cont))
		.css("font-size:12px;padding:5px;border-bottom:1px solid #aaa;min-height:180px;max-height:180px;overflow:hidden;");
	cf.mkTag("div",div)
		.txt(obj.title)
		.css("font-size:13px;font-weight:bold;text-align:center;padding:5px;border-bottom:1px solid #aaa;");
	cf.mkTag("div",div)
		.txt([obj.writer,obj.kind].join(" in "))
		.css("font-size:11px;color:gray;padding:5px;padding-bottom:0px;text-align:center;");
	cf.mkTag("div",div)
		.txt([cf.timify(obj.date.ch(8).gh(6)),cf.datify(obj.date.gh(8))].join(" in "))
		.css("font-size:11px;color:gray;padding:5px;padding-top:0px;text-align:center;");
	
	var days=["일","월","화","수","목","금","토"];
	var korday=days[new Date(obj.title).getDay()];
	if(korday=="토") div.css("background-color:rgba(0,0,255,0.1)");
	if(korday=="일") div.css("background-color:rgba(255,0,0,0.1)");
	if(obj.cont.split("\n")[0].hasoneof(["휴일","연휴","추석","개천절"])) div.css("background-color:rgba(255,0,0,0.1)");
	
	div.onclick=function(){
		var dt=procTime(this.data.date);
		var pop=layerAlert(this.data.kind+" :: "+this.data.title);
		pop.css("background-color:#eee;");
		pop.parentNode.parentNode.border=0;
		var con=cf.mkTag("pre",pop);
		con.css("width:400px;min-height:500px;margin:auto;text-align:left;overflow:auto;background-color:ivory;padding:10px;");
		con.innerHTML=this.data.cont;
	};
	
};
function procTime(str){
	return {time:cf.timify(str.ct(1).gt(6)),date:cf.datify(str.gh(8))};
};
function procCon(str){
	return str.split("\n").join("<br>");
};

HTMLElement.prototype.css=function(str){
	this.style.cssText+=str;
};
HTMLElement.prototype.txt=function(str){
	this.innerHTML=str;
	return this;
};
Object.prototype.trav=function(fnc){
	var self=this;
	Object.keys(this).trav(function(key,i){
		fnc(key,self[key],i);
	});
};