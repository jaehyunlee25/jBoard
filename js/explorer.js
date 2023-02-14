function EXPLORER(data,p){
	var l=this,
		root=cf.recursive(data),
		hdr=cf.mkTag("div",p),
		bx=cf.mkTag("div",p),
		bxH=100+"%",
		prev,
		cnt=0,
		chkFile=false,
		troots=[];
	
	p.style.position="relative";
	bxStyle();
	
	drawTree(root);
	
	var menu=cf.mkAbsoluteDiv(0,0,150,0,p);
	menu.style.border="1px solid black";
	menu.style.display="none";
	
	var iptsearch=cf.mkTag("input",hdr),
		btnfold=cf.mkTag("button",hdr),
		btnunfold=cf.mkTag("button",hdr);
	btnfold.innerHTML="접기";
	btnunfold.innerHTML="펴기";
	
	cf.setCss(hdr,{display:"none",paddingTop:5+"px",paddingBottom:5+"px"});	

	btnfold.onclick=function(){
		
		if(troots.length>0){
			dir(troots);
			troots.trav(function(rt,i){
				cf.traverse(rt,function(el){
					if(el.div.childNodes[0].chk) el.div.childNodes[0].onclick();
				});
			});
		}else{
			cf.traverse(root,function(el){
				if(el.div.childNodes[0].chk) el.div.childNodes[0].onclick();
			});
		}
			
	};
	btnunfold.onclick=function(){
		
		cf.traverse(root,function(el){
			if(!el.div.childNodes[0].chk) el.div.childNodes[0].onclick();
		});
			
	};
	bx.onclick=function(){
		
		menu.style.display="none";
			
	};
	bx.oncontextmenu=function(e){
		
		e.preventDefault();
		menu.style.display="block";
		var x=e.layerX, 
			y=e.layerY;
		menu.style.left=x+"px";
		menu.style.top=y+"px";
		return;
			
	};
	iptsearch.onkeyup=function(){
		l.searchstring(this.value);
	};
	this.fileAdd=function(){		
		var str=prompt("새 파일의 이름을 입력하세요.","New File"),
			obj=prev.parentNode.obj,
			chk=nameChk(obj.childNodes, str);
		if(chk){
			var son={
				childNodes:[],
				con:"",
				dep:obj.dep+1,
				div:document.createElement("div"),
				key:"",
				name:str,
				par:obj.key,
				parentNode:obj,
				unfold:obj.unfold
			};
			obj.childNodes.push(son);
			data.push(son);
			var prm={pkey:obj.key,name:str};
			this.fncAdd(obj,prm,function(d){
				son.key=d.response.key;
				son.con={
					kind:prm.kind,
					title:prm.title
				};
				drawTree(root);
				l.searchstring(iptsearch.value);				
			});
		}else{
			alert("이미 같은 이름이 있습니다.");
		}			
	};
	this.fileDel=function(){
		
		var obj=prev.parentNode.obj,
			pobj=obj.parentNode,
			idx;
		pobj.childNodes.trav(function(d,i){
			if(d==obj) idx=i;
		});
		pobj.childNodes.splice(idx,1);
		
		var tdata=[];
		data.trav(function(el,i){
			if(el.key!=obj.key) tdata.push(el);
		});
		data=tdata;
		
		var prm={key:obj.key};
		this.fncDel(prm,function(d){
			if(d.response.msg=="okay"){
				prev=undefined;
				drawTree(root);
				l.searchstring(iptsearch.value);
			}else{
				alert("노드삭제에 실패했습니다.");
			}
		});
			
	};
	this.fileDoubleClick=function(){
		
				
			
	};
	this.fillHeight=function(num){
		
		bx.style.height=num+"%";
			
	};
	this.fncAdd=function(){
		
				
			
	};
	this.fncDel=function(){
		
				
			
	};
	this.fncMod=function(){
		
				
			
	};
	this.fncMove=function(id,npid,fnc){
		
		fnc();
			
	};
	this.fncSel=function(){
		
				
			
	};
	this.folderAdd=function(){
		
		var str=prompt("새 폴더의 이름을 입력하세요.","New Folder"),
			obj=prev.parentNode.obj,
			chk=nameChk(obj.childNodes, str),
			fkey, 
			lkey;
		if(chk){
			var prm="pkey="+obj.key+"&";
			prm+="name="+str;
			this.fncAdd(prm,function(d){
				fkey=d;
				var prm="pkey="+d+"&";
				prm+="name=New File";
				l.fncAdd(prm,function(d){
					lkey=d;
					mkNewFolderAndFile(fkey, lkey);
					drawTree();
				});
			});
		}else{
			alert("이미 같은 이름이 있습니다.");
		}
			

		function mkNewFolderAndFile(a,b){
			
			var fobj={
				childNodes:[],
				con:"",
				dep:obj.dep+1,
				div:document.createElement("div"),
				key:a,
				name:str,
				par:obj.key,
				parentNode:obj,
				unfold:obj.unfold
			};
			obj.childNodes.push(fobj);
			
			var lobj={
				childNodes:[],
				con:"",
				dep:fobj.dep+1,
				div:document.createElement("div"),
				key:b,
				name:"New File",
				par:fobj.key,
				parentNode:fobj,
				unfold:obj.unfold
			};
			fobj.childNodes.push(lobj);
			
					
		};

	};
	this.folderDel=function(){
		
				
			
	};
	this.getRoot=function(){
		
		return root;
			
	};
	this.init=function(){
		
		root.div.childNodes[1].onclick();
			
	};
	this.rename=function(){
		
		var obj=prev.parentNode.obj,
			str=prompt("바꾸실 이름을 입력하세요.",obj.name),
			prm={
				key:obj.key,
				name:str
			};
		this.fncMod(obj,prm,function(d){
			if(d==1){
				obj.name=str;
				drawTree(root);
				l.searchstring(iptsearch.value);
				obj.div.childNodes[1].onclick();
			}
		});
			
	};
	this.search=function(num){
		
		var troot;
		cf.traverse(root,function(el){
			if(el.key==num) troot=el;
		});
		if(troot){
			drawTree(troot);
			l.searchstring(iptsearch.value);
			troot.div.childNodes[1].onclick();
		}else{
			bx.innerHTML="";
		}
		
			
	};
	this.searchstring=function(str){
		
		troots=[];
		var troot;
		if(str==""){
			drawTree(root);
			return;
		}
		bx.innerHTML="";
		cf.traverse(root,function(el){
			if(el.name.has(str)){
				troot=el;
				troots.push(troot);
				drawTree(troot,true);
			}
		});
			
	};
	this.setHeader=function(opt){
		
		if(opt){
			cf.setCss(hdr,{display:"block"});
		}else{
			cf.setCss(hdr,{display:"none"});
		}
			
	};
	function bxStyle(){
		
		bx.style.position="relative";
		bx.style.height=bxH;
		bx.style.overflow="auto";
		bx.style.padding=10+"px";
		bx.style.border="1px solid gray";
		bx.style.whiteSpace="nowrap";
		bx.bg("white");
		
			
	};
	function drawTree(root,opt){
		
		if(!opt) bx.innerHTML="";
		cf.traverse(root,traverseaction);
		
		if(opt){
			var ln=cf.mkTag("div",bx);
			cf.setCss(ln,{
				height:1+"px",
				marginTop:10+"px",
				marginBottom:10+"px",
				backgroundColor:"#eee"
			});
		}		

		function traverseaction(el){			
			var div=cf.mkTag("div",bx),
				img=cf.mkTag("img",div),
				span=cf.mkTag("span",div);
			
			divStyle(el);
			div.obj=el;
			div.idx=cnt;
			div.open=true;
			
			img.style.marginRight=3+"px";
			img.chk=true;
			
			if(el.childNodes.length>0) img.src='img/folder.gif';
			else img.src='img/file.gif';
			
			span.style.padding=3+"px";
			span.innerHTML=el.key+" "+el.name;
			
			cnt++;
			el.div=div;					

			el.unfold=function(){				
				this.div.style.display="block";
				for(var i=0, ln=this.childNodes.length;i<ln;i++){
					this.childNodes[i].div.style.display="block";
					if(this.childNodes[i].div.open) this.childNodes[i].unfold();
				}
			};
			img.onclick=function(){				
				var ob=this.parentNode.obj;
				if(this.chk){
					cf.traverse(ob,function(elm){
						if(ob!=elm)	elm.div.style.display="none";
					});
					this.parentNode.open=false;
					this.chk=false;
				}else{
					ob.unfold();
					this.parentNode.open=true;
					this.chk=true;
				}
			};
			span.onclick=function(){				
				if(prev==this) return;
				if(prev){
					prev.bg("white");
					prev.style.color="black";
				}
				this.bg("rgb(143,176,216)");
				this.style.color="white";
				prev=this;
				l.fncSel(el.con,el);
				if(this.parentNode.obj.childNodes.length>0) chkFile=false;
				else chkFile=true;
				setMenuItems(chkFile);							
			};
			span.oncontextmenu=function(e){				
				span.onclick();
			};
			span.ondblclick=function(e){				
				if(this.parentNode.obj.childNodes.length>0) return;
				var path=getPath(this.parentNode.obj);
				var obj={
					filekey:this.parentNode.obj.key,
					filepath:path,
					filename:this.parentNode.obj.name,
					filecontent:this.parentNode.obj.con
				};
				l.fileDoubleClick(obj);
			};
			span.onmousemove=function(){				
				this.style.cursor="default";							
			};
			function divStyle(el){				
				div.style.fontSize=12+"px";
				div.style.paddingBottom=4+"px";
				div.style.paddingLeft=el.dep*20+"px";
			};
		};
	};
	function getPath(obj){		
		var tob=obj.parentNode,
			str="/";
		while(tob){
			str="/"+tob.name+str;
			if(!tob.parentNode) break;
			tob=tob.parentNode;
		}
		if(str.length>1) str=cf.cutHead(str,1);
		return str;
	};
	function memuOut(){
		
		menu.style.display="none";
			
	};
	function menuClick(str){		
		if(str=="삭제"){
			l.fileDel();
		}else if(str=="새 파일"){
			l.fileAdd();
		}else if(str=="새 폴더"){
			l.folderAdd();
		}else if(str=="이름 바꾸기"){
			l.rename();
		}else if(str=="이동"){
			nodemove();
		}
		memuOut();			
	};
	function nameChk(arr,str){		
		var res=true;
		arr.trav(function(d,i){
			if(d.name==str){
				res=false;
				return true;
			}
		});
		return res;
	};
	function nodemove(){		
		var num=prompt("이동할 노드의 아이디를 입력하세요.","1"),
			obj=prev.parentNode.obj,
			chk=false,
			reg=/^[0-9]+$/,
			newp;
		if(!num) return;
		if(!reg.test(num)){
			alert("올바른 숫자 형식이 아닙니다.");
			return;
		}
		
		cf.traverse(obj,function(el){
			if(el.key==num) chk=true;
		});
		if(chk){
			alert("자신과 자신의 하위 노드로는 이동할 수 없습니다.");
			return;
		}
		
		cf.traverse(root,function(el){
			if(el.key==num) newp=el.key
		});
		if(!newp){
			alert("존재하지 않는 노드입니다.");
			return;
		}
		l.fncMove(obj.key,newp,function(){
			obj.par=num;
			root=cf.recursive(data);
			drawTree(root);
			obj.div.childNodes[1].onclick();
		});
			
	};
	function setMenuItems(opt){		
		menu.innerHTML="";
		var forFolder=["새 폴더","새 파일","이름 바꾸기","이동"],
			forFile=["새 파일","삭제","복사","이름 바꾸기","이동"],
			arMe=opt?forFile:forFolder;
		menu.style.height=(16+7*2)*arMe.length+"px";
		menu.bg();
		arMe.trav(travaction);			

		function travaction(d,i){			
			var mn=cf.mkTag("div",menu);
			mn.style.fontSize=12+"px";
			mn.style.padding=7+"px";
			mn.style.paddingLeft=20+"px";
			mn.innerHTML=d;
			mn.bg("#ddd");			

			mn.onclick=function(){				
				menuClick(this.innerHTML);							
			};
			mn.onmousemove=function(){
				
				this.bg("rgb(77,101,215)");
				this.style.color="white";
				
							
			};
			mn.onmouseout=function(){				
				this.bg("#ddd");
				this.style.color="black";							
			};
		};
	};

};
