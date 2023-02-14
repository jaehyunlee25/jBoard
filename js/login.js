var ws;
function startWSHTTPcall(fnc){
	post("conf/jboard.conf",{},data=>{
		var conf=JSON.parse(data);
		ws=new WS(conf.ws,fnc);
	});
};