function jBOARD(){
	var REG_FILE_PATH="gboardreg.html",
		l=this,
		spt,
		lst,
		tb_name,
		p,
		arList=["title","headmenu","table","footmenu","paging","search"],
		arTable=["header","note","list"],
		arHdr=["num","title","writer","date","click"],
		arCont=["hdrmenu","body","ftmenu","prv/nxt"],
		pageUnit=15, 
		tb_w=718+30+2,
		wnum=50, 
		wwriter=110, 
		wdate=50, 
		wclick=50,
		wtitle=tb_w-wnum-wwriter-wdate-wclick,
		arsp=[wnum,wtitle,wwriter,wdate,wclick],
		lnpd=8,
		or=[], 
		nt=[], 
		rply=[], 
		opor=or,
		arNote=[],
		currentPage=0, 
		unit=7, 
		rlp=0,
		srchTerm="전체기간", 
		srchOpt="제목+내용", 
		srchString="";
	
	this.loginEl={
		innerHTML:"이재현",
		password:"1234"
	};
	this.callBoard=function(key,title,p){
		p.innerHTML="";
		var div=cf.mkTag("div",p);
		div.bn=title;
		cf.setCss(div,{marginTop:20+"px",position:"relative"});
		l.mkBoard(key,div);
	};
	this.mkBoard=function(tbKey,pNode){
		
		p=pNode;
		tb_name=tbKey;
		
		var a=cf.mkTag("div",p);
		lst=cf.mkTag("div",a);
		
		a.css("width:"+tb_w+"px;margin:auto;");
		
		call.api("select",{key:tbKey},function(data){
			init(arAr(data.response));
		});
	};
	
	function init(res){
		var a=res;
		or=new Array(); 
		rply=new Array(); 
		nt=new Array();
		a.trav(function(d,n){
			if(d[1]<=0) or.push(d);
			else rply.push(d);
				
			if(d[1]==-1) nt.push(d);
		});
		nt.trav(function(d,n){
			arNote.push(["공지",d[4],d[3],"20"+cf.datify(d[8].substring(0,8)),d[9]]);
		});
		opor=or;
		setListPage();
	};
	function setContent(a,b){
		var eldt=a, 
			nth=b;
				
		lst.innerHTML="";
		arCont.trav(function(d,n){
			var c=cf.mkTag("div",lst);
		});
		
		var rowid=eldt[0], 
			rowtitle=eldt[4], 
			rowdate=cf.datify(eldt[8].substring(0,8))+" "+cf.timify(eldt[8].substring(8,14)),
			rowcont=cr(eldt[5]), 
			rowip=eldt[7], 
			rowboardname=eldt[2], 
			rowwriter=eldt[3],
			rowclick=eldt[9],
			rowrply=mkRowReply(rowid),
			
			row={
				id:rowid, 
				title:rowtitle, 
				date:rowdate, 
				cont:rowcont, 
				ip:rowip, 
				boardname:rowboardname,
				writer:rowwriter, 
				click:rowclick, 
				rply:rowrply, 
				nth:nth
			};
		
		setHdrmenu(nth);
		setBody(row);
		setFtmenu(row);
		setPrvnxt(nth);

	};
	function deleteclick(){
		var pw=prompt("비밀번호를 입력하세요."),
			rowid=this.row.id;
		call.api("pwcheck",{id:rowid,password:pw},data=>{
			if(data.response.msg=="fail"){
				alert("비밀번호가 맞지 않습니다.");
				return;
			}
			call.api("delete",{kind:tb_name,id:rowid},data=>{
				init(arAr(data.response));
			});
		});
	};
	function mkRowReply(rowid){
		var a=[];
		rply.trav(function(d,n){
			if(d[1]==rowid) a.push(d);
		});
		return a;
	};
	function setBody(row){
		
		var body=lst.childNodes[1],
			hdr=cf.mkTag("div",body),
			hdrLeft=cf.mkTag("span",hdr),
			hdrRight=cf.mkTag("span",hdr),
			rhdrmenu1=cf.mkTag("span",hdrRight),
			rhdrmenu2=cf.mkTag("span",hdrRight),
			space=cf.mkTag("span",hdrRight),
			rhdrmenu3=cf.mkTag("span",hdrRight),
			hdr1=cf.mkTag("div",body),
			hdr1Left=cf.mkTag("span",hdr1),
			hdr1Right=cf.mkTag("span",hdr1),
			cont=cf.mkTag("pre",body),
			attaches=cf.mkTag("div",body),
			ft=cf.mkTag("div",body),
			rphdr=cf.mkTag("div",body),
			rp=cf.mkTag("div",body),
			rnm=mkInput("이름",rp),
			rpw=mkInput("비밀번호",rp,100,true),
			br=cf.mkTag("br",rp),
			ta=cf.mkTag("textarea",rp),
			btnRp=cf.mkTag("button",rp),
			rp1=cf.mkTag("div",body);
		
		body.css("padding:15px;border:1px solid gray;font-size:12px;margin-bottom:8px;word-break:break-all;");
		hdr.css("position:relative;border-bottom:1px dashed gray;padding-bottom:10px;margin-bottom:10px;");
		hdrLeft.css("width:"+(hdr.offsetWidth/2)+"px;display:inline-block;");
		hdrRight.css("width:"+(hdr.offsetWidth/2-5)+"px;display:inline-block;text-align:right;");
		hdr1.css("position:relative;padding-bottom:10px;margin-bottom:10px;");
		hdr1Left.css("width:"+(hdr1.offsetWidth/2)+"px;display:inline-block;font-weight:bold;");
		hdr1Right.css("width:"+(hdr1.offsetWidth/2-5)+"px;display:inline-block;text-align:right;");
		cont.css("padding-top:50px;padding-bottom:50px;font-size:14px;overflow:auto;white-space:pre-wrap;line-height:1.5em;");
		ft.css("text-align:right;padding-top:20px;padding-bottom:20px;color:#aaa;");
		rp.css("position:relative;padding20px;height:110px;");
		ta.css("position:absolute;width:"+(tb_w-20*4-90)+"px;height:90px;");
		btnRp.css("position:absolute;left:"+(tb_w-20*2-90)+"px;width:90px;height:95px;");
		rp1.bg("#eeeeee");
		rp1.style.padding=10+"px";
		
		hdrLeft.innerHTML="<b>"+cr(row.title)+"</b>"+" | "+row.boardname;
		rhdrmenu1.innerHTML=row.date+" | ";
		rhdrmenu2.innerHTML="수정";
		space.innerHTML=" | ";
		rhdrmenu3.innerHTML="삭제";		
		hdr1Left.innerHTML=cr(row.writer);
		hdr1Right.innerHTML=row.ip;
		cont.innerHTML=row.cont;
		ft.innerHTML="예의에 어긋나는 글은 삼가합시다. - 깨끗한 게시판 캠페인";
		rphdr.innerHTML="<b>댓글 "+row.rply.length+ " 개</b> | <b>"+"조회수 "+row.click+"</b>";
		btnRp.innerHTML="댓글입력";
		
		rhdrmenu2.row=row;
		rhdrmenu3.row=row;
		getAttaches(row.id,attaches);
		
		rhdrmenu2.onclick=updateclick;
		rhdrmenu3.onclick=deleteclick;
		
		if(l.loginEl){
			rnm.value=l.loginEl.innerHTML;
			rnm.disabled=true;
		}
		if(l.loginEl){
			rpw.value=l.loginEl.password;
			rpw.disabled=true;
		}
		if(row.rply.length==0) rp1.style.display="none";
		row.rply.trav(function(d,n){
			rp1.appendChild(mkRp1(d));
		});
		btnRp.onclick=function(){
			this.disabled=true;
			if(rnm.value==""){
				alert("이름을 입력하세요.");
				rnm.focus();
				this.disabled=false;
				return false;
			}
			if(rpw.value==""){
				alert("비밀번호를 입력하세요.\n수정, 삭제시 사용됩니다.");
				rpw.focus();
				this.disabled=false;
				return false;
			}
			if(ta.value==""){
				alert("내용을 입력하세요.");
				ta.focus();
				this.disabled=false;
				return false;
			}
			
			var t=new Date(),
				prm={
					id:row.id,
					kind:tb_name,
					writer:rnm.value,
					title:"",
					content:ta.value.replace(/\'/g,"\\'"),
					password:rpw.value,
					time:""+t.getFullYear()+
						cf.addzero(t.getMonth()+1)+
						cf.addzero(t.getDate())+
						cf.addzero(t.getHours())+
						cf.addzero(t.getMinutes())+
						cf.addzero(t.getSeconds())+
						cf.addzero(t.getDay())
				};
			call.api("insert",prm,data=>{
				var ap=arAr(data.response);
				rply.unshift(ap[0]);
				row.rply=mkRowReply(row.id);
				
				cf.insdiv(rp1,mkRp1(rply[0]));
				rp1.style.display="block";
				
				rphdr.innerHTML="<b>댓글 "+row.rply.length+ " 개</b> | <b>"+"조회수 "+row.click+"</b>";
				
				btnRp.disabled=false;
			});
			rpw.value=l.loginEl.password;
			ta.value="";
		};
		rhdrmenu2.onmousemove=function(){
			this.style.textDecoration="underline";
		};
		rhdrmenu2.onmouseout=function(){
			this.style.textDecoration="none";
		};
		rhdrmenu3.onmousemove=function(){
			this.style.textDecoration="underline";
		};
		rhdrmenu3.onmouseout=function(){
			this.style.textDecoration="none";
		};
		
		function mkRp1(d){
			var a=document.createElement("div"),
				f=cf.mkTag("div",a),
				rowdate=cf.datify(d[8].substring(0,8))+" "+cf.timify(d[8].substring(8,14)),
				s=cf.mkTag("div",a),
				t=cf.mkTag("div",a),
				sp=cf.mkTag("span",t);
			
			a.css("pading-bottom:15px;padding-top:15px;border-bottom:1px dotted gray;");
			t.style.textAlign="right";
			sp.style.color="gray";
			
			a.identity=d[0];
			f.innerHTML="<b>"+cr(d[3])+"</b> "+rowdate+"<br /><br />";
			s.innerHTML+=cr(d[5]);
			sp.innerHTML="삭제";
			
			sp.onclick=function(){
				var pw=prompt("비밀번호를 입력하세요."),
					id=d[0];
				call.api("pwcheck",{id:id,password:pw},data=>{
					if(data.response.msg=="fail"){
						alert("비밀번호가 맞지 않습니다.");
						return;
					}
					call.api("rpDelete",{kind:tb_name,id:id,pid:row.id},data=>{
						//기존자료에서 삭제된 댓글 지우기
						var tmp=[];
						rply.trav(ar=>{
							if(ar[0]==data.id) return;
							tmp.push(ar);
						});
						rply=tmp;
						//-----
						
						rp1.innerHTML="";
						if(data.response.length==0) rp1.style.display="none";
						data.response.trav(function(d,n){
							var tmp=[];
							d.trav((key,val,i)=>{
								tmp.push(val);
							});
							rp1.appendChild(mkRp1(tmp));
						});
					});
				});
			};
			sp.onmousemove=function(){
				this.style.textDecoration="underline";
			};
			sp.onmouseout=function(){
				this.style.textDecoration="none";
			};
			
			return a;
		};
	};
	function setFtmenu(row){
		var ftmenu=lst.childNodes[2],
			btn1=cf.mkTag("button",ftmenu),
			btn3=cf.mkTag("button",ftmenu),
			btn4=cf.mkTag("button",ftmenu),
			btn5=cf.mkTag("button",ftmenu);
		
		ftmenu.css("text-align:right;margin-bottom:50px;");
		btn4.row=row;
		btn3.row=row;
		
		btn1.innerHTML="새글쓰기";			
		btn3.innerHTML="수정하기";
		btn3.onclick=updateclick;
		btn4.innerHTML="삭제하기";
		btn4.onclick=deleteclick;
		btn5.innerHTML="목록보기";

		btn1.onclick=function(){
			lst.innerHTML="";
			writeclick();
		};
		btn5.onclick=function(){
			setListPage(or,rply);
		};
	};
	function setHdrmenu(nth){
		var hdrmenu=lst.childNodes[0],
			w=hdrmenu.offsetWidth,
			left=cf.mkAbsoluteDiv(0,0,w/2,30,hdrmenu),
			btnPrv=cf.mkTag("button",left),
			btnNxt=cf.mkTag("button",left),
			right=cf.mkAbsoluteDiv(w/2,0,w/2,30,hdrmenu),
			btnLst=cf.mkTag("button",right);
		
		hdrmenu.style.height=30+"px";
		hdrmenu.style.position="relative";
		btnPrv.innerHTML="이전글";				
		btnNxt.innerHTML="다음글";				
		right.style.textAlign="right";
		btnLst.innerHTML="목록보기";

		btnLst.onclick=function(){
			setListPage();
		};
		btnPrv.onclick=function(){
			if(nth+1<or.length) setContent(or[nth+1],nth+1,or,rply);
		};
		btnNxt.onclick=function(){
			if(nth-1>-1) setContent(or[nth-1],nth-1,or,rply);
		};
	};
	function setPrvnxt(nth){
		var prvnxt=lst.childNodes[3],
			prv=cf.mkTag("div",prvnxt),
			w=prv.offsetWidth,
			nxtleft=cf.mkTag("span",prv),
			prvright=cf.mkTag("span",prv),
			nxt=cf.mkTag("div",prvnxt),
			prvleft=cf.mkTag("span",nxt),
			nxtright=cf.mkTag("span",nxt);
		
		prvnxt.css("border-top:1px solid gray;font-size:12px;padding-bottom:50px;");
		prv.css("padding-top:8px;padding-bottom:8px;border-bottom:1px solid gray;");
		nxtleft.css("display:inline-block;width:"+(w*2/3)+"px;");
		prvleft.css("display:inline-block;width:"+(w*2/3)+"px;");
		prvright.css("display:inline-block;text-align:right;width:"+w/3+"px;");
		nxtright.css("display:inline-block;text-align:right;width:"+w/3+"px;");
		nxt.css("padding-top:8px;padding-bottom:8px;border-bottom:1px solid gray;");
		
		if(nth-1>-1){
			var prvleft1=cf.mkTag("span",nxtleft);
			prvleft1.innerHTML="다음글&nbsp;&nbsp;&nbsp;&nbsp;";
			var prvleft2=cf.mkTag("span",nxtleft);
			
			prvleft2.innerHTML=shorten(cr(or[nth-1][4]),60);
			prvright.innerHTML=shorten(cr(or[nth-1][3]),10)+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+dpDate(or[nth-1][8]);
		
			prvleft2.onmousemove=prvleft2mousemove;
			prvleft2.onmouseout=prvleft2mouseout;
			prvleft2.onclick=prvleft2click;
		}else{
			prv.style.display="none";
		}
		
		if(nth+1<or.length){
			var nxtleft1=cf.mkTag("span",prvleft);
			var nxtleft2=cf.mkTag("span",prvleft);
			
			nxtleft1.innerHTML="이전글&nbsp;&nbsp;&nbsp;&nbsp;";
			nxtleft2.innerHTML=shorten(cr(or[nth+1][4]),60);					
			nxtright.innerHTML=shorten(cr(or[nth+1][3]),10)+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+dpDate(or[nth+1][8]);
		
			nxtleft2.onmousemove=nxtleft2mousemove;
			nxtleft2.onmouseout=nxtleft2mouseout;
			nxtleft2.onclick=nxtleft2click;
		}else{
			nxt.style.display="none";
		}

		function nxtleft2click(){
			setContent(or[nth+1],nth+1,or,rply);
		};
		function nxtleft2mousemove(){
			this.style.textDecoration="underline";
		};
		function nxtleft2mouseout(){
			this.style.textDecoration="none";
		};
		function prvleft2click(){
			setContent(or[nth-1],nth-1,or,rply);
		};
		function prvleft2mousemove(){
			this.style.textDecoration="underline";
		};
		function prvleft2mouseout(){
			this.style.textDecoration="none";
		};
	};
	function updateclick(){
		var pw=prompt("비밀번호를 입력하세요."),
			row=this.row;
		call.api("pwcheck",{id:row.id,password:pw},function(data){
			if(data.response.msg=="fail"){
				alert("비밀번호가 맞지 않습니다.");
			}else{
				lst.innerHTML="";
				writingtool(false,row);
			}
		});
	};
	function getAttaches(id,p,opt){
		p.innerHTML="";
		var img_line=cf.mkTag("div",p);
		img_line.style.overflow="auto";
		call.api("readAttaches",{pid:id},data=>{
			procData(data);
		});
		function procData(data){
			data.response.trav((file,i)=>{
				procFile(file,i)
			});			
		};
		function procFile(file,i){
			var dv=cf.mkTag("div",p),
				span=cf.mkTag("span",dv),
				atag=cf.mkTag("a",dv),
				ar=file.name.split("/"),
				fileName=ar[ar.length-1];
			
			//파일이 이미지면, 미리보기를 한다.
			var splt=ar[ar.length-1].split("."),
				fileType=splt[splt.length-1];
			
			if(fileType=="jpg" || fileType=="png" || fileType=="gif"){
				var img=cf.mkTag("img",img_line);
				img.width=239;
				img.src="img/upload/"+ar[ar.length-1];
				img.onclick=function(){
					var cw=document.body.clientWidth*9/10,
						ch=document.body.clientHeight*9/10,
						pop=new popup(cw,ch);
					pop.con.style.cssText+="overflow:auto;text-align:center;background-color:rgba(0,0,0,0)";
					pop.con.onclick=function(){
						pop.terminate();
					};
					var real_img=cf.mkTag("img",pop.con);
					real_img.style.maxWidth=cw+"px";
					real_img.src="img/upload/"+fileName;
				};
			}
				
			if(opt){
				var del=cf.mkTag("a",dv);
				del.innerHTML=" X ";
				del.style.cssText="color:red;cursor:pointer;";
				del.onclick=function(){
					call.api("delFile",{id:file.id},function(data){
						if(data.response.msg=="okay") getAttaches(id,p,opt);
					});
				}
			}	
			span.innerHTML="첨부 "+(i+1)+": ";
			atag.innerHTML=mkFileName(fileName);
			if(!opt){
				atag.href="img/upload/"+fileName;
				atag.download=fileName.split("_").lo();
			}			
		};
	};
	function splitdiv(el){
		var w=el.offsetWidth,
			a=cf.mkTag("span",el),
			b=cf.mkTag("span",el);
		a.css("display:inline-block;width:"+(w/2)+"px;");
		b.css("display:inline-block;left:"+(w/2)+"px;width:"+(w/2)+"px;");
		return {a:a, b:b};
	};
	function writingtool(opt,row){
		var cv=cf.mkTag("div",lst),
			t=splitdiv(cv),
			a=t.a, 
			b1=t.b,
			btn=cf.mkTag("button",b1),
			blst=cf.mkTag("div",lst),
			b=cf.mkTag("div",blst),
			nm=mkInput("이름",b),
			pw=mkInput("비밀번호",b,100,true),
			tl=mkInput("<br />제목",b,tb_w-58),
			ta=mkTextarea("<br />",b,tb_w-32,400),
			inf=cf.mkTag("div",b),
			attaches=cf.mkTag("div",b),
			file=cf.mkTag("div",b),
			fm=new FileManager("첨부파일",file),
			aw=cf.mkTag("div",lst),
			btnw=cf.mkTag("button",aw),
			btnc=cf.mkTag("button",aw);
		
		a.style.fontWeight="bold";
		b1.style.textAlign="right";
		blst.css("padding:15px;font-size:13px;");
		blst.bg("#eeeeee");
		aw.style.textAlign="center";
		inf.css("font-size:12px;text-align:right;");
		attaches.style.cssText+="padding-top:5px;padding-bottom:5px;";
		
		btnw.innerHTML=opt?"저장하기":"수정하기";
		btnc.innerHTML="취소하기";
		a.innerHTML=opt?"새글쓰기":"수정하기";
		btn.innerHTML="목록보기";		
		inf.innerHTML=" 글자수(공백포함): 0"+"/2,066(약 "+cf.rommify(0/2066,1)+"페이지)";
		
		ta.inf=inf;
		fm.mode=opt;
		fm.pid=row.id;
		
		if(!opt){
			nm.value=row.writer;
			nm.disabled=true;
			
			tl.value=row.title;
			ta.value=rcr(row.cont);
			
			inf.innerHTML=" 글자수(공백포함): "+cf.commify(ta.value.length)+"/2,066(약 "+cf.rommify(ta.value.length/2066,1)+"페이지)";
			
			getAttaches(row.id,attaches,true);	//수정하기일때,
		}else{
			getAttaches(0,attaches,true);	//새로쓰기일때
		}
		if(l.loginEl){
			nm.value=l.loginEl.innerHTML;
			nm.disabled=true;
			pw.value=l.loginEl.password;
			pw.disabled=true;
		}
			
		fm.onselect=function(ids){
			if(!opt){
				//수정일 때,
				//수정화면을 처음 열었을 때, 기존의 첨부파일들을 가져오는 것일 수도 있고,
				//거기에 더하여 새로운 첨부파일들을 불러와야 할 수도 있다.
				getAttaches(row.id,attaches,true);
			}else{
				//새로운 첨부파일들만 불러오면 됨(pid가 0인 것들)
				//이 방식은 다른 여러 사람이 동시에 파일을 첨부하려고 할 때, 문제가 됨
				//0이 아니라, 세션 고유번호로 저장해야 함
				//혼자 쓸 땐, 문제 없음
				getAttaches(0,attaches,true);	//새글일때
			}
		};
		btn.onclick=function(){
			fm.cancel(function(){
				setListPage(or,rply);
			});
		};
		btnc.onclick=function(){
			fm.cancel(function(){
				setListPage(or,rply);
			});
		};
		btnw.onclick=function(){
			this.disabled=true;
			if(nm.value==""){
				alert("이름을 입력하세요.");
				nm.focus();
				this.disabled=false;
				return false;
			}
			if(pw.value==""){
				alert("비밀번호를 입력하세요.\n수정, 삭제시 사용됩니다.");
				pw.focus();
				this.disabled=false;
				return false;
			}
			if(tl.value==""){
				alert("제목을 입력하세요.");
				tl.focus();
				this.disabled=false;
				return false;
			};
			if(ta.value==""){
				alert("내용을 입력하세요.");
				ta.focus();
				this.disabled=false;
				return false;
			};
			
			if(opt){	//새로쓰기일때
				dbinsert("insert",tb_name,0,nm.value,pw.value,tl.value,ta.value,data=>{
					var dt=arAr(data)[0],
						id=dt[0];
					fm.send(id,response=>{
						lst.innerHTML="";
						or=new Array(); 
						rply=new Array(); 
						nt=new Array();
						init(arAr(data));
					});
				});
			}else{	//수정하기일때
				dbinsert("update",tb_name,row.id,nm.value,pw.value,tl.value,ta.value,data=>{
					fm.send(row.id,function(response){
						var a=arAr(data);
						or.trav(function(ar,i){
							if(ar[0]==a[0][0]){
								or[i]=a[0];
							}
						});
						setContent(a[0],row.nth,or,rply);
					});
				});
			}
		};
	};
	function shorten(str,num){
		var rslt;
		if(str.length>num) rslt=str.substring(0,num)+"...";
		else rslt=str;
		
		return rslt;
	};
	function setListPage(){
		lst.innerHTML="";
		var term, 
			opt, 
			strSrch, 
			btnSrch;
		arList.trav(function(d,n){
			var c=cf.mkTag("div",lst);
			if(d=="table"){
				arTable.trav(function(t,m){
					var f=cf.mkTag("div",c);
				});
			}
		});
		
		pgDt=splitDataPerPage(opor);
		
		setTitle();
		setHdmn();
		setFtmn(function(){
			writeclick();
		});
		setPg(opor);
		setSrch(srchAct);
		
		setList(pgDt[currentPage]);

	};
	function noteclick(){
		lst.innerHTML="";
	};
	function pgclick(el){
		el.style.textDecoration="underline";
		currentPage=el.pg;
		setList(pgDt[el.pg]);
	};
	function setFtmn(fnc){
		var ftmn=lst.childNodes[3],
			btn=cf.mkTag("button",ftmn);
		
		ftmn.style.textAlign="right";
		ftmn.style.marginBottom=30+"px";
		
		btn.innerHTML="글쓰기";
		btn.onclick=fnc;
	};
	function setHdmn(){
		var hdmn=lst.childNodes[1],
			m1=cf.mkTag("span",hdmn),
			sp1=cf.mkTag("span",hdmn),
			m2=cf.mkTag("span",hdmn),
			sp2=cf.mkTag("span",hdmn),
			m3=cf.mkTag("span",hdmn);
		
		hdmn.style.marginBottom=10+"px";
		hdmn.style.textAlign="right";
		hdmn.style.fontSize=11+"px";
		
		m1.innerHTML="제목순";
		sp1.innerHTML=" | ";
		m2.innerHTML="날짜순";
		sp2.innerHTML=" | ";
		m3.innerHTML="클릭순";
		
		m1.onmousemove=mousemove;
		m1.onmouseout=mouseout;
		m2.onmousemove=mousemove;
		m2.onmouseout=mouseout;
		m3.onmousemove=mousemove;
		m3.onmouseout=mouseout;
					
		m1.asc=true;				
		m2.asc=false;
		m3.asc=false;

		m1.onclick=function(){
			click(0)
		};
		m2.onclick=function(){
			click(1)
		};
		m3.onclick=function(){
			click(2)
		};
		function click(opt){
			if(opt==0){
				this.asc?or.asc(4):or.desc(4);
				setListPage();
			}
			if(opt==1){
				this.asc?or.asc(8):or.desc(8);
				setListPage();
			}
			if(opt==2){
				this.asc?or.asc(9,true):or.desc(9,true);
				setListPage();
			}
			this.asc=this.asc?false:true;
		};
		function mousemove(){
			this.style.textDecoration="underline";
		};
		function mouseout(){
			this.style.textDecoration="none";
		};
	};
	function setList(dt){
		var lstTable=lst.childNodes[2];
		lstTable.style.marginBottom=5+"px";
		
		lstTable.childNodes[0].innerHTML="";
		lstTable.childNodes[1].innerHTML="";
		lstTable.childNodes[2].innerHTML="";
		
		lstTable.childNodes[0].appendChild(tblhdr());
		arNote.trav(function(d,n){
			lstTable.childNodes[1].appendChild(tblnote(d));
		});
		if(dt)
			dt.trav(function(d,n){
				var arRow=[d[0],d[4],d[3],"20"+cf.datify(d[8].substring(0,8)),d[9]];
				lstTable.childNodes[2].appendChild(tblrow(arRow,d,currentPage*pageUnit+n));
			});
	};
	function setPg(dt){
		var l=dt.length/pageUnit, 
			rl, 
			max=0,
			pg=lst.childNodes[4],
			prv=cf.mkTag("span",pg),
			md=cf.mkTag("span",pg),
			ns=[],
			nxt=cf.mkTag("span",pg);
		
		if(l>parseInt(l)) rl=parseInt(l)+1;
		else rl=parseInt(l);
		
		max=parseInt(rl/unit);
		
		pg.css("text-align:center;font-size:12px;margin-bottom:10px;");
		prv.css("display:inline-block;width:50px;");
		nxt.css("display:inline-block;width:50px;");
		
		//pg.innerHTML="";
		prv.innerHTML="◀이전";				
		nxt.innerHTML="다음▶";		
		
		setNumbers();

		nxt.onclick=function(){
			var t=rlp;
			rlp++;
			if(rlp>max) rlp=max;
			if(t!=rlp) setNumbers(true);
		};
		nxt.onmousemove=function(){
			this.style.cursor="pointer";
		};
		prv.onclick=function(){
			var t=rlp;
			rlp--;
			if(rlp<0) rlp=0;
			if(t!=rlp) setNumbers(false);
		};
		prv.onmousemove=function(){
			this.style.cursor="pointer";
		};
		function setNumbers(opt){
			ns.trav(function(d,n){
				cf.killTag(d);
			});
			ns=[];
			
			var sn=rlp*unit+0, 
				en=rlp==max?rl:(rlp+1)*unit;
			
			for(var i=sn;i<en;i++){
				
				var n=cf.mkTag("span",md),
					cn;
				
				n.css("display:inline-block;width:20px;font-weight:bold;");
				
				n.pg=i;
				n.innerHTML=i+1;						
				
				if(opt==undefined) cn=currentPage;
				else cn=opt?sn:en-1;
				
				if(i==cn){
					n.style.textDecoration="underline";
					if(opt!=undefined) pgclick(n);	
				}
				
				ns.push(n);
				n.onmousemove=mousemove;
				n.onclick=click;
			}

			function click(){
				ns.trav(function(d,n){
					d.style.textDecoration="none";
				})
				pgclick(this);
			};
			function mousemove(){
				this.style.cursor="pointer";
			};
		};
	};
	function setSrch(fnc){
		var srch=lst.childNodes[5];
		srch.css("text-align:center;padding-bottom:50px;");
		
		term=cf.mkOpt(srch,["전체기간","1일","1주","1개월","6개월","1년"]);
		opt=cf.mkOpt(srch,["제목+내용","제목만","글작성자","댓글내용","댓글작성자"]);
		strSrch=cf.mkTag("input",srch);
		term.value=srchTerm;
		opt.value=srchOpt;
		strSrch.value=srchString;
		
		btnSrch=cf.mkTag("button",srch);
		btnSrch.innerHTML="검색";

		btnSrch.onclick=function(){
			srchTerm=term.value, srchOpt=opt.value, srchString=strSrch.value;
			currentPage=0, rlp=0;
			fnc(this);
		};
	};
	function setTitle(){
		var ttl=lst.childNodes[0];
		ttl.css("border:5px solid pink;padding:10px;margin-bottom:30px;");
		ttl.innerHTML=p.bn;
	};
	function splitDataPerPage(dt){
		var pgDt=[],
			pg=0;
		pgDt[pg]=new Array();
		dt.trav(function(d,n){
			if(n>0&&n%pageUnit==0){
				pg++;
				pgDt[pg]=new Array();
			}
			pgDt[pg].push(d);
		});
		return pgDt;
	};
	function srchAct(d){
		d.disabled=true;
		
		var a=srchTerm, 
			b=srchOpt, 
			c=srchString,
			r1,
			r2;
		
		if(a=="전체기간") r1=or;
		else if(a=="1일") r1=compDate(or,"D",0);
		else if(a=="1주") r1=compDate(or,"D",-6);
		else if(a=="1개월") r1=compDate(or,"M",-1);
		else if(a=="6개월") r1=compDate(or,"M",-6);
		else if(a=="1년") r1=compDate(or,"Y",-1);
		
		if(c!="") r2=compStr(r1,rply,c,b);
		else r2=r1;
		
		opor=r2;
		pgDt=splitDataPerPage(opor);
		setPg(opor);
		setList(pgDt[currentPage]);
		
		d.disabled=false;
	};
	function tblhdr(){
		var a=document.createElement("div");
		a.css("padding-top:"+lnpd+"px;padding-bottom:"+lnpd+"px;border-top:3px solid gray;border-bottom:1px solid gray;font-size:11px;");
		arHdr.trav(function(d,n){
			var b=cf.mkTag("span",a);
			b.css("display:inline-block;width:"+arsp[n]+"px;text-align:center;");
			b.innerHTML=d;
		});
		return a;
	};
	function tblnote(ar){
		var a=document.createElement("div");
		a.css("padding-top:"+lnpd+"px;padding-bottom:"+lnpd+"px;border-bottom:1px solid gray;font-size:11px;");
		
		ar.trav(function(d,n){
			var b=cf.mkTag("span",a);
			b.css("display:inline-block;width:"+arsp[n]+"px;text-align:center;");
			
			if(n==1||n==2)
				b.style.fontSize=13+"px";
			if(n==1){
				b.style.fontWeight="bold";
				b.style.textAlign="left";						
				b.onclick=noteclick;
			}
			b.innerHTML=d;
		});
		b.onmousemove=function(){
			this.style.textDecoration="underline";
		};
		b.onmouseout=function(){
			this.style.textDecoration="none";
		};
		
		return a;
	};
	function tblrow(arRow,dt,num){
		var a=document.createElement("div");
		a.css("padding-top:"+lnpd+"px;padding-bottom:"+lnpd+"px;border-bottom:1px solid gray;font-size:11px;");
		
		var cnt=0;
		rply.trav(function(d,n){
			if(arRow[0]==d[1]){
				cnt++;
			}
		});
		
		arRow.trav(function(d,n){
			var b=cf.mkTag("span",a);
			b.css("display:inline-block;width:"+arsp[n]+"px;text-align:center;");
			
			if(n==1||n==2)
				b.style.fontSize=13+"px";
			if(n==1){
				b.style.textAlign="left";						
				b.dt=dt;
				b.num=num;
				b.onclick=ttlclick;
				
				var ttl=shorten(d,50);
				if(cnt!=0) b.innerHTML=cr(ttl)+" ["+cnt+"]";
				else b.innerHTML=cr(ttl);
				
				if(curchk(arRow[3])) b.innerHTML+="<span style='display:inline-block;width:10px;height:9px;background-image:url(img/ico-new.gif)'> </span>";
				
			}else if(n==2){
				var ttl=shorten(d,10);
				b.innerHTML=cr(ttl);
			}else{
				b.innerHTML=cr(d);
			}
			b.onmousemove=function(){
				this.style.textDecoration="underline";
			};
			b.onmouseout=function(){
				this.style.textDecoration="none";
			};
		});
		
		return a;
	};
	function ttlclick(){
		var l=this;
		call.api("clickupdate",{id:this.dt[0]},(data)=>{
			l.dt=arAr(data.response)[0];
			or.trav(function(t,m){
				if(t[0]==l.dt[0]){
					or[m]=l.dt;
					return true;
				}
			});
			setContent(l.dt,l.num);
		});
	};
	function writeclick(){
		lst.innerHTML="";
		writingtool(or,rply,true);
	};
	function writerclick(){};
	function cod(str){
		return encodeURIComponent(str);
	};
	function compStr(ar,rply,str,opt){
		var rslt=new Array();
		if(opt=="제목+내용"){
			ar.trav(function(d,n){
				if(d[4].indexOf(str)!=-1||d[5].indexOf(str)!=-1) rslt.push(d);
			});
		}else if(opt=="제목만"){
			ar.trav(function(d,n){
				if(d[4].indexOf(str)!=-1) rslt.push(d);
			});
		}else if(opt=="글작성자"){
			ar.trav(function(d,n){
				if(d[3].indexOf(str)!=-1) rslt.push(d);
			});
		}else if(opt=="댓글내용"){
			var tar=new Array();
			rply.trav(function(d,n){
				if(d[5].indexOf(str)!=-1){
					var chk=true;
					tar.trav(function(t,m){
						if(t==d[1]){
							chk=false;
							return true;
						}
					});
					if(chk) tar.push(d[1]);
				}
			});
			ar.trav(function(d,n){
				tar.trav(function(t,m){
					if(d[0]==t) rslt.push(d);
				});
			});
		}else if(opt=="댓글작성자"){
			var tar=new Array();
			rply.trav(function(d,n){
				if(d[3].indexOf(str)!=-1){
					var chk=true;
					tar.trav(function(t,m){
						if(t==d[1]){
							chk=false;
							return true;
						}
					});
					if(chk) tar.push(d[1]);
				}
			});
			ar.trav(function(d,n){
				tar.trav(function(t,m){
					if(d[0]==t) rslt.push(d);
				});
			});
		}
		return rslt;
	};
	function cr(str){
		if(typeof str=="number") str+="";
		while(str.indexOf("<")!=-1){
			str=str.replace("<","&lt;");
		}
		str=str.replace("&lt;img ","<img ");
		while(str.indexOf("\n")!=-1){
			str=str.replace("\n","<br />");
		}
		return str;
	};
	function curchk(str){
		var a=cf.getToday(),
			td=""+a[0]+"."+a[1]+"."+a[2];
		if(str==td) return true;
		return false;
	};
	function dbinsert(work,dbTable,id,writer,password,title,content,fnc){
		content=content.replace(/\'/g,"\\'");
		
		var t=new Date(),
			prm={
				id:id,
				kind:dbTable,
				key:dbTable,
				writer:writer,
				title:title,
				content:content,
				password:password,
				time:""+t.getFullYear()+
					cf.addzero(t.getMonth()+1)+
					cf.addzero(t.getDate())+
					cf.addzero(t.getHours())+
					cf.addzero(t.getMinutes())+
					cf.addzero(t.getSeconds())+
					cf.addzero(t.getDay())
			};
		
		call.api(work,prm,data=>{
			fnc(data.response);
		});
	};
	function dpDate(str){
		var a=str.substring(0,8),
			b=str.substring(8,14);
		return cf.datify(a)+" "+cf.timify(b);
	};
	function mkDate(str){
		var a=str,
			b=cf.getHead(a,4),
			c=cf.getHead(cf.cutHead(a,4),2),
			d=cf.getTail(a,2);
		return b+"-"+c+"-"+d;
	};
	function mkInput(str,p,w,opt){
		var span=cf.mkTag("span",p),
			np=cf.mkTag("input",p);
		span.innerHTML=str;
		
		if(opt) np.type="password";
		if(w) np.style.width=w+"px";
		
		return np;
	};
	function mkTextarea(str,p,w,h){
		var strCn=cf.mkTag("span",p),
			cn=cf.mkTag("textarea",p);
		
		strCn.innerHTML=str+"<br />";
		cn.css("width:"+w+"px;height:"+(h*1.5)+"px;padding:15px;background:url(img/wongoji.png);line-height:2em;font-size:13px;color:rgb(65,65,65);font-weight:bold;font-family:맑은 고딕;");
		
		cn.onkeydown=function(e){
			if(e.keyCode==9){
				e.preventDefault();
				var st=this.selectionStart,
					en=this.selectionEnd;
				this.value=this.value.substring(0,st)+String.fromCharCode(9)+this.value.substring(en,this.value.length);
				this.selectionStart=st+1;
				this.selectionEnd=st+1;
			}
		};
		cn.onkeyup=function(){
			var lng=this.value.length;
			this.inf.innerHTML=" 글자수(공백포함): "+cf.commify(lng)+"/2,066(약 "+cf.rommify(lng/2066,1)+"페이지)";
		};

		return cn;
	};
	function mkURL(work,dbTable,id,writer,password,title,content){
		var str="";
		str+="work="+work;
		str+="&id="+id;
		str+="&kind="+dbTable;
		str+="&writer="+writer;
		str+="&title="+title;
		str+="&cont="+content;
		str+="&password="+password;
		
		return str;
	};
	function rcr(str){
		while(str.indexOf("<br />")!=-1){
			str=str.replace("<br />","\n");
		}
		str=str.replace(/&lt;/g,"<");
		return str;
	};
	function compDate(dt,opt,num){
		var t=new Date(),
			today=t.getFullYear()+"-"+cf.addZero(t.getMonth()*1+1)+"-"+cf.addZero(t.getDate()),
			a=cf.calDate(today,opt,num), av=new Date(a.a).valueOf(),
			rslt=new Array();
		dt.trav(function(d,n){
			var dv=new Date(mkDate(d[8].substring(0,8))).valueOf();
			if(dv>=av) rslt.push(d);
		});
		return rslt;
	};
	function arAr(arOb){
		var res=[];
		arOb.trav((ob,i)=>{
			var tmp=[];
			ob.trav((key,val,j)=>{
				tmp.push(val);
			});
			res.push(tmp);
		});
		return res;
	};
	function jc(addr,b,c){
		var a=new ajaxcallforgeneral();
		a.post("data/"+addr,b);
		a.ajaxcallback=c;
	};
	function jcs(addr,b,c){
		var a=new ajaxcallforgeneral();
		a.post("js/"+addr,b);
		a.ajaxcallback=c;
	};
};
