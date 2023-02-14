function jSQL(){
	
	var l=this,
		operators=["!=",">=","<=","=",">","<","like"],
		commandset=[" where ", " order by ", " group by "],
		reason,
	
		ALIAS={},
		DEPTH=0;
	
	this.table=this.raw;
	this.header;
	this.meta;
	this.tables={};
	this.strRaw="";
	

	this.parse=function(str){
		
		str=str.toLowerCase();
		str=str.getWords().join(" ");
		
		this.strRaw=str;
		
		if(cf.getHead(str,5)=="show "){
			var res=[];
			for(var el in l.tables){
				if(el!="MULTI" && el!="JOIN")
					res.push([el]);
			}
			return {arr:res, header:["table"], meta:["string"]};
		}else if(cf.getHead(str,5)=="desc "){
			var res=[];
			str=str.replace(/;/g,"");
			log(str.substring(5));
			l.tables[str.substring(5)].header.trav(function(d,i){
				res.push([d]);
			});
			return {arr:res, header:["table"], meta:["string"]};
		}
		var proc=str,
			opt=cf.getHead(proc,6),
			strBody=cf.cutHead(proc,6);
		
		if(cf.getTail(strBody,1)==";")
			strBody=cf.cutTail(strBody,1);
		
		if(opt=="select") return procSelect(strBody);
		if(opt=="delete") return procDelete(strBody);
		if(opt=="insert")  return procInsert(strBody);
		if(opt=="update") return procUpdate(strBody);
		
			
	};
	this.reg=function(name,obj){
		
		this.tables[name]=obj;
			
	};
	this.use=function(name){
		
		if(typeof name=="string"){
			var table=getTable(name);
			if(!table){
				errorMessage(0,name);
				return false;
			}
			this.table=table.arr;
			this.header=table.header;
			this.meta=table.meta;
		}else if(typeof name=="object"){
			this.table=name.arr;
			this.header=name.header;
			this.meta=name.meta;
		}
		return true;
		
			
	};
	function arrConcat(ar1,ar2){
		
		var tmp=[ar1,ar2], res=[];
		if(typeof ar1=="number"){
			tmp=[new Array(ar1),ar2];
		}
		if(typeof ar2=="number"){
			tmp=[ar1,new Array(ar2)];
		}
		tmp.trav(function(ar,i){
			ar.trav(function(d,i){
				if(d==undefined) d=null;
				res.push(d);
			});
		});
		return res;
		
			
	};
	function comparison(ar,cond){
		
		var idx=cond[0],
			opt=l.meta[idx],
			org=ar[idx],
			val=cond[1],
			otr=cond[2];
		
		if(typeof val=="string"){
			var num;
			l.header.trav(function(d,i){
				if(d==val){
					num=i;
					return true;
				}
			});
			if(num!=undefined) val=ar[num];
		}
		if(opt=="number"){
			org*=1;
			val*=1;
		}
		if(otr=="!=") return org!=val;
		if(otr==">=") return org>=val;
		if(otr=="<=") return org<=val;
		if(otr=="=") return org==val;
		if(otr==">") return org>val;
		if(otr=="<") return org<val;
		if(otr=="like") return likeSearch();
			

		function likeSearch(){
			
			var arVal=val.split("%");
			if(arVal.length==1) return org==val;
			var res=true, idx=0;
			arVal.trav(function(d,i){
				var num=org.indexOf(d,idx);
				if(num==-1){
					res=false;
					return true;
				}
				idx=num;
			});
			if(arVal[arVal.length-1]!="") 
				if(cf.getTail(org,arVal[arVal.length-1].length)!=arVal[arVal.length-1]) return false;
			
			if(arVal[0]!="") 
				if(cf.getHead(org,arVal[0].length)!=arVal[0]) return false;
			
			return res;
			
					
		};

	};
	function delAlias(){
		
		if(DEPTH==0){
			for(var el in ALIAS){
				delete l.tables[el];
			}
			ALIAS={};
		}
		
			
	};
	function errorMessage(type,str){
		
		if(type==0) alert("table name error!! ==> "+str);
		if(type==1) alert("syntax error: no values command ==> "+str);
		if(type==2) alert("syntax error in values command ==> "+str);
		if(type==3) alert("syntax error: column length mismatch!! ==> "+str);
		if(type==4) alert("column name error!! ==> "+str);
		if(type==5) alert("syntax error: no set command!! ==> "+str);
		if(type==6) alert("syntax error: no on command!! ==> "+str);
		if(type==7) alert("syntax error: invalid join command ==> "+str);
		if(type==8) alert("all subqueries should have its own alias ==> "+str);
		if(type==9) alert("can't use one of table names as a subquery alias ==> "+str);
		if(type==10) alert("can't use one of aliases as a subquery alias ==> "+str);
		
		for(var el in ALIAS){
			delete l.tables[el];
		}
		ALIAS={};
		
			
	};
	function getTable(str){
		
		return l.tables[str] || l.tables[ALIAS[str]];
			
	};
	function hdrConcat(ftbl,stbl){
		
		var res=[],
			str=stbl=="JOIN" || stbl=="MULTI" ? "":stbl+".",
			ftr=ftbl=="JOIN" || ftbl=="MULTI" ? "":ftbl+".";
		
		l.tables[ftbl].header.trav(function(d,i){
			res.push(ftr+d);
		});
		l.tables[stbl].header.trav(function(d,i){
			res.push(str+d);
		});
		return res;
		
			
	};
	function nametoindex(str,hdr){
		
		var res;
		if(hdr){
			hdr.trav(function(d,i){
				if(d==str){
					res=i;
					return true;
				}
			});
			return res;
		}
		l.header.trav(function(d,i){
			if(d==str){
				res=i;
				return true;
			}
		});
		return res;
			
	};
	function opRows(rows){
		
		//컬럼명을 인덱스로, 연산자는 후위배치
		rows.trav(function(d,i){
			var str=d.replace(/\s/gi,"");
			var otr;
		
			if(str=="or" || str=="and") return;
		
			operators.trav(function(t,k){
				if(str.has(t)){
					otr=t;
					return true;
				}
			});
		
			if(!otr) reason="operator error!! ==> " + d;
			var lr=d.split(otr);
		
			var idx=nametoindex(lr[0].trimFB());
			if(idx==undefined) reason="column name error!! ==> " + d;
			
		
			rows[i]=[idx,lr[1].trimFB(),otr];
		});
		return rows;
		
			
	};
	function procDelete(str){
		
		var dv, conRow, rows=[], tableName;
		
		str=str.trimFB();
		if(cf.getHead(str,4)!="from"){
			errorMessage(0,str);
			return;
		}
		
		str=cf.cutHead(str,4);
		if(str.indexOf(" where ")!=-1){
			dv=str.split(" where ");
			tableName=dv[0].trimFB();
			conRow=dv[1].trimFB();
			rows.rowParse(conRow);
		}else{
			tableName=str.trimFB();
			l.use(tableName);
			return l.table=[];
		}
		
		if(!l.use(tableName)) return;
		
		reason=undefined;
		rows=opRows(rows);
		if(reason){
			alert(reason);
			return;
		}
		
		var res=[];
		l.table.trav(function(d,i){
			if(!rowcheck(d,rows)) res.push(d);
		});
		
		return {arr:res,header:l.header, meta:l.meta};
		
			
	};
	function procInsert(str){
		
		var res=[], dv, conCols, conVals, frn, tableName;
		str=str.trimFB();
		if(cf.getHead(str,4)!="into"){
			errorMessage(0,str);
			return;
		}
		str=cf.cutHead(str,4);
		if(str.indexOf("values")==-1){
			errorMessage(1,str);
			return;
		}
		
		dv=str.split("values");
		conVals=dv[1].trimFB();
		frn=dv[0].split("(");
		tableName=frn[0].trimFB();
		if(frn[1]) conCols=frn[1].split(")")[0].trimFB();
		if(!l.use(tableName)) return;
		
		if(cf.getHead(conVals,1)!="("){
			errorMessage(2,str);
			return;
		}
		conVals=cf.cutHead(conVals,1);
		
		if(cf.getTail(conVals,1)!=")"){
			errorMessage(2,str);
			return;
		}
		
		conVals=cf.cutTail(conVals,1);
		vals=conVals.split(",");
		
		if(conCols){
			cols=conCols.split(",");
			if(vals.length!=cols.length){
				errorMessage(3,str);
				return;
			}
			var chk=false;
			cols.trav(function(d,i){
				var idx=nametoindex(d.trimFB());
				if(idx==undefined){
					errorMessage(4,d);
					chk=true;
					return true;
				}else{
					cols[i]=idx;
				}
			});
			if(chk) return;
			
			l.header.trav(function(d,i){
				res.push(null);
			});
			cols.trav(function(d,i){
				res[d]=vals[i];
			});
			
		}else{		
			if(vals.length!=l.header.length){
				errorMessage(3,str);
				return;
			}
			vals.trav(function(d,i){
				res.push(d);
			});
		}
		
		l.table.push(res);
		
		return {arr:l.table,header:l.header, meta:l.meta};
		
			
	};
	function procJoin(tblname){
		
		var cond=[" cross", " inner", " left", " right", " outer"],
			numJoin=0,
			cmds=[],
			idxCmd,
			wrds=tblname.getWords();
		wrds.trav(function(d,i){
			cmds.push(d);
			if(d=="join"){
				cmds.pop();
				var pre=wrds[i-1], ppre=wrds[i-2];
				if(pre=="outer"){
					cmds.pop(); cmds.pop();
					cmds.push(ppre+" "+pre+" "+d);
				}else{
					var chk=true;
					cond.trav(function(cmd,k){
						if(cmd.trimFB()==pre){
							chk=false;
							cmds.pop();
							cmds.push(pre+" "+d);
							return true;
						}
					});
					if(chk) cmds.push(d);
				}
				numJoin++; 
				if(numJoin==2) idxCmd=cmds.length-1;
			}
		});
		if(numJoin>1){
			var bfr=cmds.getClip(0,idxCmd-1),
				aft=cmds.getClip(idxCmd,cmds.length-1);
			l.reg(
				"JOIN", 
				procJoin(bfr.join(" ")	)
			);
			aft.unshift("JOIN");
			tblname=aft.join(" ");
		}
		
		var qr=tblname,
			aa=qr.split(" on "), cmd=aa[0], agr=aa[1];
		
		if(!agr) agr="";
		
		var aa=cmd.split(" join "), rst=aa[0], stbl=aa[1].trimFB(), ftbl, numJoin="";
		cond.trav(function(d,i){
			if(rst.indexOf(d)!=-1){
				numJoin+=i;
			}
		});
		if(numJoin=="0"){
			optr="cross join";
			ftbl=rst.split(" cross")[0].trimFB();
		}else if(numJoin=="" || numJoin=="1"){
			optr="inner join";
			if(numJoin=="") ftbl=rst.trimFB();
			else ftbl=rst.split(" inner")[0].trimFB();
		}else if(numJoin=="2" || numJoin=="24"){
			optr="left outer join";
			if(numJoin=="2") ftbl=rst.split(" left")[0].trimFB();
			else ftbl=rst.split(" outer")[0].split(" left")[0].trimFB();
		}else if(numJoin=="3" || numJoin=="34"){
			optr="right outer join";
			if(numJoin=="3") ftbl=rst.split(" right")[0].trimFB();
			else ftbl=rst.split(" outer")[0].split(" right")[0].trimFB();
		}else{
			errorMessage(7,qr);
			return;
		}
		//table name validation check!!/////////////////////////////////////////////////
		var tbls=[ftbl, stbl];
		tbls.trav(function(d,i){
			var nm=d.trimFB();
			if(!getTable(nm)) errorMessage(0,nm);
		});
		tblname=tbls.join(",");
		
		if(optr=="cross join") return procMultiTable(tblname);
		if(optr=="inner join"){
			if(!agr.has("=")){
				return procMultiTable(tblname);
			}
			var aa=agr.split("="), rows=[], res=[], obj=procMultiTable(tblname),
				sstr=aa[0].trimFB(), fstr=aa[1].trimFB();
			if(agr=="")  return obj;
			l.use(obj);
			rows.push([nametoindex(sstr),fstr,"="]);
			l.table.trav(function(d,i){
				if(rowcheck(d,rows)) res.push(d);
			});
			obj.arr=res;
			return obj;
		}
		if(optr=="left outer join"){
			if(agr==""){
				errorMessage(6,qr);
				return false;
			}
			var lt=getTable(ftbl).arr, rt=getTable(stbl).arr,
				hdr=hdrConcat(ftbl,stbl), meta=arrConcat(getTable(ftbl).meta, getTable(stbl).meta),
				obj={},error=false;
			agr.split("=").trav(function(d,i){
				if(nametoindex(d.trimFB(), hdr)==undefined){
					errorMessage(0,d);
					error=true;
					return true;
				}
				var tmp=d.split("."),
					nt=tmp[0].trimFB(), nc=tmp[1].trimFB();
				if(!getTable(nt)){
					errorMessage(0,nt);
					error=true;
					return true;
				}
				obj[nt]=nametoindex(nc,getTable(nt).header);
			});
			if(error) return false;
			
		
			var res=[];
			lt.trav(function(lrow,i){
				var chk=true;
				rt.trav(function(rrow,k){
					if(lrow[obj[ftbl]]==rrow[obj[stbl]]){
						chk=false;
						res.push(arrConcat(lrow,rrow));
					}
				});
				if(chk) res.push(arrConcat(lrow,rt[0].length));
			});
		
			
			return {arr:res, header:hdr, meta:meta};
		}
		if(optr=="right outer join"){
			if(agr==""){
				errorMessage(6,qr);
				return false;
			}
			
			var lt=l.tables[ftbl].arr, rt=l.tables[stbl].arr,
				hdr=hdrConcat(ftbl,stbl), meta=arrConcat(l.tables[ftbl].meta, l.tables[stbl].meta),
				obj={}, error=false;
			agr.split("=").trav(function(d,i){
				if(nametoindex(d.trimFB(), hdr)==undefined){
					errorMessage(0,d);
					error=true;
					return true;
				}
				var tmp=d.split("."),
					nt=tmp[0].trimFB(), nc=tmp[1].trimFB();
				
				if(!getTable(nt)){
					errorMessage(0,nt);
					error=true;
					return true;
				}
				obj[nt]=nametoindex(nc,getTable(nt).header);
			});
			if(error) return false;
			
		
			var res=[];
			rt.trav(function(rrow,i){
				var chk=true;
				lt.trav(function(lrow,k){
					if(lrow[obj[ftbl]]==rrow[obj[stbl]]){
						chk=false;
						res.push(arrConcat(lrow,rrow));
					}
				});
				if(chk) res.push(arrConcat(lt[0].length,rrow));
			});
		
			
			return {arr:res, header:hdr, meta:meta};
		}
		
			
	};
	function procMultiTable(tblname){
		
		var ar=tblname.split(","), clct=[], gops, sum=0, res=[], hdrs=[], metas=[];
		
		ar.trav(function(d,i){
			var strTbl=d.trimFB(), tbl=getTable(strTbl);
			clct.push(tbl.arr);
			var str=strTbl=="JOIN" || strTbl=="MULTI" ? "":strTbl+".";
			tbl.header.trav(function(col){
				hdrs.push(str+col);
			});
			tbl.meta.trav(function(col){
				metas.push(col);
			});
		});
		gops=getGop(clct);
		around(gops[0],function(i){
			var idc=getIdc(clct,i), row=[];
			idc.trav(function(d,i){
				clct[i][d].trav(function(col,k){
					row.push(col);
				});
			});
			res.push(row);
		});
		
		return {arr:res, header:hdrs, meta:metas};
			

		function getGop(arr){
			
			var res=[], gop=1, lng=arr.length;
			around(lng,function(num){
				var i=lng-num;
				gop*=arr[i-1].length;
				res.unshift(gop);
			});
			return res;
			
					
		};
		function getIdc(arr,num){
			
			var rest=num,
				res=[];
			around(arr.length,function(i){
				if(i==0) return;
				vl=parseInt(rest/gops[i]);
				res.push(vl);
				rest=rest%gops[i];
			});
			res.push(rest);
			return res;
			
					
		};

	};
	function procSelect(str){
		
		str=senseQuery(str);
		
		if(str==""){
			delAlias();
			return;
		}
		
		var bs=str.split(" from "), 
			conCol=bs[0].trimFB(), 
			cols,
			rows=[], 
			tableName;
		
		if(conCol=="*"){
			cols="*";
		}else{
			cols=conCol.split(",");
			cols.trav(function(d,i){
				cols[i]=d.trimFB();
			});
		}
		
		var tblCom=getTableNameAndCommandset(bs[1]),
			comset=tblCom.commandset;
		
		tableName=tblCom.tbl;
		
		if(!l.use(tableName)){
			delAlias();
			return;
		}
		if(!tblCom.commandset){
			delAlias();
			return extractCols(l.table,cols);
		}
		if(comset["where"]) rows.rowParse(comset["where"]);
		
		reason=undefined;
		rows=opRows(rows);
		if(reason){
			alert(reason);
			delAlias();
			return;
		}
		
		var res=[];
		l.table.trav(function(d,i){
			if(rowcheck(d,rows)) res.push(d);
		});
		
		if(!comset["where"]) res=l.table;
		
		var idc=[];
		if(cols=="*") cols=l.header;
		cols.trav(function(d,i){
			var idx=nametoindex(d);
			if(idx==undefined){
				errorMessage(4,d);
				res=undefined;
				return true;
			}
			idc.push(idx);
		});
		
		if(comset["order by"]) res=orderby(res,comset["order by"]);
		
		res=extractCols(res,cols);
		
		delAlias();
		
		return res;
			

		function extractCols(arr,cols){
			
			if(cols=="*"){
				return {arr:arr,header:l.header, meta:l.meta}
			}
			var idc=[];
			cols.trav(function(d,i){
				idc.push(nametoindex(d));
			});
			var res=[],
				hdr=[],
				meta=[];
			arr.trav(function(row,i){
				var ar=[];
				idc.trav(function(m,k){
					ar.push(row[m]);
				});
				res.push(ar);
			});
			idc.trav(function(d,i){
				hdr.push(l.header[d]);
			});
			idc.trav(function(d,i){
				meta.push(l.meta[d]);
			});
			return {arr:res,header:hdr, meta:meta};
			
					
		};
		function getTableNameAndCommandset(str){
			
			var idc=[];
			commandset.trav(function(d,i){
				var idx=str.indexOf(d);
				if(idx!=-1) idc.push([d.trimFB(), idx]);
			});
			idc.desc(1);
			
			var strRest=bs[1];
			var arComm=[];
			idc.trav(function(d,i){
				arComm.push([d[0], strRest.substring(d[1]).trimFB()]);
				strRest=strRest.substring(0,d[1]);
			});
			
			var tbl;
			if(idc.length==0) tbl=strRest.trimFB()
			else tbl=strRest.substring(0,idc[idc.length-1][1]).trimFB();
			
			var arCom={};
			arComm.trav(function(d,i){
				arCom[d[0]]=d[1].split(d[0])[1].trimFB();
			});
			if(arComm.length==0) arCom=undefined;
			
			return {tbl:tbl, commandset:arCom};
			
					
		};
		function orderby(ar,str){
			
			var qu=str.split(","),
				distincts=[], box=[],res=[],
				goptocol=new Array(qu.length),
				ts=cf.getTimeStamp();
			if(qu.length==1){
				var d=qu[0],
					xim=d.trimFB().split(" "),
					col=nametoindex(xim[0]),
					sel=xim[1]?xim[1].trimFB():"asc",
					opt=false;				
				if(l.meta[col]=="number") opt=true;
				if(sel=="asc")	ar.asc(col,opt);
				if(sel=="desc") ar.desc(col,opt);
				return ar;
			}
			
			qu.trav(function(d,i){
				var xim=d.trimFB().split(" "),
					col=nametoindex(xim[0]),
					sel=xim[1]?xim[1].trimFB():"asc",
					mid=ar.distinct(col);
					opt=false;
				if(l.meta[col]=="number") opt=true;
				
				if(sel=="asc"){
					if(opt) mid.sort(function(a,b){return a-b});
					else 	mid.sort();
				}
				if(sel=="desc"){
					if(opt) mid.sort(function(a,b){return b-a});
					else mid.revSort();
				}
				var obj={};
				obj[ts]=mid.length;
				mid.trav(function(val,k){
					obj[val]=k;
				});
				distincts.push(obj);
				qu[i]=[col,sel];
				
			});
			ar.trav(function(row,i){
				var sum=0;
				qu.trav(function(cond,k){
					var col=cond[0],
						idx=getNth(distincts[k],row[col])*1,
						num=gop(distincts,k+1);
					if(k<qu.length-1) sum+=idx*num;
					else sum+=idx;
				});
				box.push([sum,row]);
			});
			box.asc(0);
			box.trav(function(d,i){
				res.push(d[1]);
			});
			
			return res;
					

			function getNth(obj,val){
				
				return obj[val];
							
			};
			function gop(arr,col){
				
				var res=1;
				if(goptocol[col]==undefined){
					arr.trav(function(d,i){
						if(i>=col) res*=d[ts];
					});
					goptocol[col]=res;
				}else{
					res=goptocol[col];
				}
				return res;
				
							
			};

		};

	};
	function procUpdate(str){
		
		var dv, conRow, rows=[], tableName, conVal, vals;
		
		str=str.trimFB();
		if(str.indexOf(" set ")==-1){
			errorMessage(5,str);
			return;
		}
		
		tableName=getTableName(str);
		str=cf.cutHead(str,tableName.length).trimFB();
		str=cf.cutHead(str,4).trimFB();
		
		if(str.indexOf(" where ")!=-1){
			dv=str.split(" where ");
			conVal=dv[0].trimFB();
			conRow=dv[1].trimFB();
			rows.rowParse(conRow);
		}else{
			conVal=str.trimFB();
			l.use(tableName);
			return l.table=[];
		}
		
		if(!l.use(tableName)) return;
		
		reason=undefined;
		rows=opRows(rows);
		if(reason){
			alert(reason);
			return;
		}
		
		var res=[];
		l.table.trav(function(d,i){
			if(rowcheck(d,rows)) res.push(d);
		});
		
		vals=opVals(conVal);
		res.trav(function(d,i){
			vals.trav(function(t,k){
				var col=t[0], val=t[1];
				d[col]=val;
			});
		});
		
		return {arr:l.table,header:l.header, meta:l.meta};
			

		function getTableName(str){
			
			var dv=str.split("set");
			return dv[0].trimFB();
			
					
		};
		function opVals(str){
			
			var dv=str.split(",");
			dv.trav(function(d,i){
				var t=d.trimFB();
				dv[i]=t.split("=");
				dv[i].trav(function(el,k){
					var col;
					if(k==0){
						col=nametoindex(el);
						dv[i][k]=col;
					}
				});
			});
			return dv;
			
					
		};

	};
	function rowcheck(ar,rows){
		
		var stack=[];
		rows.trav(function(d,i){
			if(typeof d=="object"){
				stack.push(comparison(ar,d));
			}else{
				var back=stack.pop(),
					front=stack.pop();
				if(d=="and") stack.push(front && back);
				if(d=="or") stack.push(front || back);
			}
		});
		return stack[0];
		
			
	};
	function senseQuery(str){
		
		//2. 테이블 연산 및 등록
		
		var error=false,
			tstr=str.getWords().join(" "),
			tmp=bracket(tstr);
		tmp.rev();
		var brckts={};
		tmp.trav(function(d,i){
			tstr=tstr.substitute(d[0],d[1],"BRACKET"+i);
			brckts["BRACKET"+i]=d[2];
		});
		
		var dv=getTableArea(tstr),
			tblstr=dv.body,
		
			stnc=tblstr.getWords(),
			refine=[],
			subqueries=[];
		
		stnc.trav(function(d,i){
			if(d=="as"){
				var als=stnc[i+1].trimFB(), val=stnc[i-1];
				if(als.has(",")) als=als.replace(/\,/g,"");
				if(!nameValidation(als)){
					error=true;
					return true;
				}
				if(val.has("BRACKET")){
					val=brckts[val].trimFB(1);
					subqueries.push([als,val]);
				}
				ALIAS[als]=val;
				refine.pop();
			}else{
				refine.push(d);
			}
		});
		if(error) return "";
		tstr=refine.join(" ");
		
		//분석기를 재귀호출하여 서브쿼리를 해석한 후 결과값을 DB에 등록한다./////////
		subqueries.trav(function(d,i){
			if(cf.getHead(d[1],7)=="select "){
				DEPTH++;
				ALIAS[d[0]]=d[1];
				l.reg(d[0],l.parse(d[1]));
				DEPTH--;
			}
		});
		var tables=tstr.split(",");
		tables.trav(function(d,i){
			if(d.has(" join ")){
				var ob=procJoin(d);
				if(!ob){
					error=true;
					return true;
				}
				l.reg("JOIN",ob);
				tables[i]="JOIN";
			}
		});
		if(error) return "";
		
		tstr=tables.join(",");
		
		if(tables.length>1){
			tstr=tables.join(",");
			l.reg("MULTI",procMultiTable(tstr));
			tstr="MULTI ";
		}
		
		return dv.before+tstr+dv.after;
			

		function bracket(str){
			
			var brackets=[],
				st, en, substr=[];
			
			str.trav(function(d,i){
				if(d=="("){
					brackets.push(d);
					if(brackets.length==1) st=i;
				}
				if(d==")"){
					brackets.pop();
					if(brackets.length==0){
						en=i;
						substr.push([st, en, str.substring(st,en+1)]);
					}
				}
			});
			return substr;
			
					
		};
		function getTableArea(tstr){
			
			var st=tstr.indexOf(" from ")+" from ".length, en, min,
				before=tstr.substring(0,st), after;
			
			commandset.trav(function(d,i){
				var idx=tstr.indexOf(d,st+" from ".length);
				if(idx!=-1){
					if(min==undefined || idx<min) min=idx;
				}
			});
			
			if(min!=undefined) en=min;
			else en=tstr.length-1;
			
			after=tstr.substring(en+1);
			
			return {before:before, body:tstr.substring(st,en+1), after:after};
			
					
		};
		function nameValidation(str){
			
			for(var el in l.tables){
				if(str==el){
					errorMessage(9,str);
					return false;
				} 
			}
			
			if(ALIAS[str]){
				errorMessage(10,str);
				return false;
			}
			
			return true;
			
					
		};

	};

};
