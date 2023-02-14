function jSCREEN(){
	var mode=false;
	this.screen=function(addr,param,raw,fnc){
		if(!mode){
			fnc(raw);
			return;
		}
		var raw1=dl.enCon(raw),
			pop=popup(cf.workareawidth*9/10,cf.workareaheight*9/10),
			con=cf.mkTag("div",pop.con),
			title=cf.mkTag("div",con),
			
			body=cf.mkTag("div",con),
			name=cf.mkTag("div",body),
			tbl=cf.mkTag("div",body);
			
		title.innerHTML="다음과 같은 데이터가 수신되었습니다.";
		
		if(raw1.has("\"list\":")){
			var ob=JSON.parse(raw1);
			name.innerHTML="address: "+addr+"<br />"+"params: "+JSON.stringify(param);
			if(ob.list){
				var tb=cf.mkTable(ob.list.length,ob.list[0].length,tbl);
				tb.cells.trav(function(row,i){
					row.trav(function(col,k){
						col.innerHTML=ob.list[i][k];
						if(ob.list[i][k]=="") cf.setCss(col,{backgroundColor:"pink"});
						if(i==0) cf.setCss(col,{borderTop:"1px solid gray"});
						if(k==0) cf.setCss(col,{borderLeft:"1px solid gray"});
						cf.setCss(col,{borderRight:"1px solid gray",borderBottom:"1px solid gray"});
						cf.setCss(col,{overflow:"auto"});
					});
				});
			}
		}else{
			body.innerHTML=raw1;
		}
		cf.setCss(body,{padding:20+"px"});
		cf.setCss(name,{paddingTop:20+"px",paddingBottom:20+"px",fontSize:20+"px"});
		con.onclick=function(){
			pop.kill();
			fnc(raw);
		};
	};
};
