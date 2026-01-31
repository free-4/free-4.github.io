

//标签动作
function setTags(mname,objname,objorder,nums){
	var mobj_id=mname+'_'+objorder;
	var obj_id=objname+'_'+objorder;
	var showmobj=document.getElementById(mobj_id);
	var showobj=document.getElementById(obj_id);
	for(var i=1;i<=nums;i++){
		var tempm=mname+'_'+i;
		var temp=objname+'_'+i;
		var temptablem=document.getElementById(tempm);
		var temptable=document.getElementById(temp);
		temptablem.className='';
		temptable.style.display='none';
	}
	showmobj.className='lil';
	showobj.style.display='block';
}

//类型树操作
function setTypeTags(id){
	var showmobj=document.getElementById('tt_'+id);
	var showmimgobj=document.getElementById('ttimg_'+id);
	if (showmobj.style.display=='block'){
		showmobj.style.display='none';
		showmimgobj.src='images/jj_0.gif';
	}else{
		showmobj.style.display='block';
		showmimgobj.src='images/jj_1.gif';
	}
}

//显示标题标注信息
function showViewTitle(id){
	var showmobj=document.getElementById('lvt_'+id);
	if (showmobj.style.display=='block'){
		showmobj.style.display='none';
	}else{
		showmobj.style.display='block';
	}
}

