var call=new WSCALL();
function WSCALL(){
	var self=this,
		callstack=[],
		callflag=false;
	this.chain=function(apiname,obj,fnc){
		callstack.push([apiname,obj,fnc]);
		if(!callflag) callstart();
	};
	this.api=function(apiname,obj,fnc){
		var param=getParam(apiname);
		addKeys(param,obj);
		ws.call(param,fnc);
	};
	this.make=function(company,project,fnc){
		var param={
			__command:"make",
			company:company,
			project:project
		};
		ws.call(param,fnc);
	},
	this.find=function(){
		var args=arguments,
			opt=args[0],
			fnc=args[args.length-1],
			param={
				__command:"find",
				opt:opt
			};
		if(opt=="project") param.company=args[1];
		ws.call(param,fnc);
	},
	this.login=function(pwd,fnc){
		var param={
			__command:"login",
			pwd:pwd
		};
		ws.call(param,fnc);
	},
	function callstart(){
		callflag=true;
		if(callstack.length==0){
			callflag=false;
			return;
		}
		var ar=callstack.shift();
		self.api(ar[0],ar[1],function(data){
			ar[2](data);
			callstart()
		});
	};
	function addKeys(source,addition){
		Object.keys(addition).trav(function(key,i){
			source[key]=addition[key];
		});
	};
	function getParam(cmd){
		return {
			__command:cmd,
			__lsItems:getLsItems(),
			__timeStamp:new Date().getTime()
		};
	};
	function getLsItems(){
		var obj={};
		Object.keys(localStorage).trav(function(key,i){
			if(key=="pw") return;
			obj[key]=localStorage.getItem(key);
		});
		return obj;
	};
};