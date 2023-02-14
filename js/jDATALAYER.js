function datalayer(){
	var qry=new jSQL(),
		l=this;
	this.addboardtree=function(prm,fnc){
		call.api("addboardtree",prm,fnc);
	};
	this.deCon=function(str){
		return deCon(str);
	};
	this.delboardtree=function(prm,fnc){
		call.api("delboardtree",prm,fnc);
	};
	this.enCon=function(str){
		return enCon(str);
	};
	this.getboardtree=function(fnc){
		call.api("boardtree",{},function(data){
			var list=data.response,
				res=[];
			list.trav(function(obj,i){
				var tmp=[];
				obj.trav(function(key,val,i){
					tmp.push(val);
				});
				res.push(tmp);
			});
			var obRes={
				list:res
			};
			opBoardtree(JSON.stringify(obRes));
			var obs=getobjectarray("select * from boardtree"),
				res=[];
			obs.trav(function(ob,i){
				res.push([ob.id,ob.pid,ob.name,{kind:ob.kind,title:ob.title,key:ob.id}]);
			});
			fnc(res);
		});
		/* jc("boardtree.php",{},function(d){
			opBoardtree(d);
			var obs=getobjectarray("select * from boardtree"),
				res=[];
			obs.trav(function(ob,i){
				res.push([ob.id,ob.pid,ob.name,{kind:ob.kind,title:ob.title}]);
			});
			fnc(res);
		}); */
	};
	this.login=function(fnc){
		//조회
		call.api("login",{regId:lsg("regId")},function(data){
			if(data.response.length==0) fnc(false);
			else fnc(true);
		});
	};
	this.loginEnter=function(obj,fnc){
		call.api("loginEnter",obj,function(data){
			fnc(data.response);
		});
	};
	this.modboardtree=function(prm,fnc){
		jc("modboardtree.php",prm,fnc);
	};
	function deCon(str){
		str=str.replace(/\<lf \/\>/g,"\n");
		str=str.replace(/\<tab \/\>/g,"\t");
		str=str.replace(/\<quot \/\>/g,'"');
		return str;
	};
	function enCon(str){
		str=str.replace(/\n/g,"<lf />");
		str=str.replace(/\t/g,"<tab />");
		str=str.replace(/\\"/g,"<quot />");
		str=str.replace(/\\/g,"");
		return str;
	};
	function getobjectarray(str){
		var raw=qry.parse(str),
			res=[];
		raw.arr.trav(function(ar,i){
			var obj={};
			raw.header.trav(function(col,k){
				obj[col]=raw.meta[k]=="number"?ar[k]*1:ar[k];
			});
			res.push(obj);
		});
		return res;
	};
	function jc(addr,b,c){
		var a=new ajaxcallforgeneral();
		a.post("data/"+addr,"param="+encodeURIComponent(JSON.stringify(b)));	
		a.ajaxcallback=function(d){
			sc.screen(addr,b,d,function(data){
				c(data);
			});
		};
	};
	function jcs(addr,b,c){
		var a=new ajaxcallforgeneral();
		a.post("js/"+addr,"param="+encodeURIComponent(JSON.stringify(b)));	
		a.ajaxcallback=function(d){
			sc.screen(addr,b,d,function(data){
				c(data);
			});
		};
	};
	function opBoardtree(d){
		d=enCon(d);
		var ob={
				"id":"number",
				"pid":"number",
				"name":"string",
				"kind":"string",
				"title":"string",
				"ip":"string",
				"date":"string"
			},
			arr=JSON.parse(d).list;
		regTable("boardtree",ob,arr);
	};
	function opWriterinfo(d){
		var ob={
				"id":"number",
				"name":"string",
				"type":"number",
				"phone":"string",
				"date":"string",
				"ip":"string",
				"others":"string",
				"password":"string"
			},
			arr=JSON.parse(d).list;
		regTable("writerinfo",ob,arr);
	};
	function regTable(tablename,ob,arr){
		var hdr=[], 
			meta=[];
		for(var el in ob){
			hdr.push(el);
			meta.push(ob[el]);
		}
		qry.reg(tablename,{arr:arr,header:hdr,meta:meta});
	};
};
