/**
 * Only for UFLO
 * */

// Global variables
var docid;
var projid;
var psid;
var valid;
var taskid = "${request.getParameter('taskId')}";
var outcome = "修改确认";
var downloadbutton="disable";//附件控制参数
var uploadbutton ="invisible";//附件控制参数

/*======Get status from CurrentRecordSets======*/
function GetCRStatus(ds){
	var CurRec = ds.getData("#");
	docid = CurRec.get("id")+"";
	projid = CurRec.get("tbsProj.id")+"";
	valid = CurRec.get("valid")+"";
	psid=CurRec.get("tbsProj.tbsBasPs.id")+"";
};

/** @Bind view.onReady */
!function(self, arg, dataSettbsProjundwrtCfmar){
	dataSettbsProjundwrtCfmar.flushAsync();
};

/** @Bind #dataSettbsProjundwrtCfmar.onLoadData */
!function(self,arg,ddlAutoform,buttonAppr,buttonClose,buttonResend,DdlOutcome,OpinionGroupBox,DocGroupBox,tabInAppr,tabMain){
	GetCRStatus(self);
	if (psid == 33 ){  //驳回
		tabMain.set("currentIndex", 1);
		buttonClose.set("visible",false);
		buttonAppr.set("visible",false);
		buttonResend.set("visible",true);
		//self.set("readOnly",false);  
		OpinionGroupBox.set("visible",false);
		DocGroupBox.set("height","80%");
		uploadbutton ="";
	}else{
		tabMain.set("currentIndex", 0);
		tabInAppr.set("visible",true);
		buttonClose.set("visible",true);
		buttonAppr.set("visible",true);
		buttonResend.set("visible",false);
		DdlOutcome.set("items",["通过","驳回"]);
		view.get("^edit").set("readOnly",true);
		view.get("^other").set("readOnly",false);
	}
};
//Global End

/*============Execute approving=============*/
/** @Bind #ajaxActionAppr.beforeExecute */
!function(self,arg,updateActionSave){
	var opinion=view.id("OpinionAutoform").get("entity").opinion;
	if (!opinion){
		opinion="无意见";
	};
	if (psid == 33){
		self.set("confirmMessage","您确定再次发送审批？");
		updateActionSave.execute();
		self.set("parameter",{docid:docid,projid:projid,psid:psid,taskid:taskid,outcome:outcome,opinion:opinion});
	}else {
			outcome = view.id("OpinionAutoform").get("entity").outcome;
			if(!outcome){
				dorado.MessageBox.alert("请先选择【审批结果】", {title : "趣博信息科技"});	
				throw "exit" ;
			}else {
				self.set("confirmMessage","您确定发送审批？");
			    self.set("parameter",{docid:docid,projid:projid,psid:psid,taskid:taskid,outcome:outcome,opinion:opinion});
			}
	};
};

/*==============Close===================*/
/** @Bind #ajaxActionAppr.onSuccess */
/** @Bind #buttonClose.onClick */
!function(self,arg){
	//var entity=view.id("OpinionAutoform").get("entity");
	window.parent.closeProcessDialog('${request.getParameter("type")}'); 
	//dataSetTbsProjHtsh.get("data:#").cancel();
};

/*=============本次承保金额和日期判断=====crs表示CurrentRecordSets==========*/
/** @Bind #udtfaloc.onPost */
/** @Bind #udtnfaloc.onPost */
/** @Bind #udtotloc.onPost */
!function(self,arg,ddlAutoform,buttonResend,udttotloc,dataSettbsProjundwrtCfmar){
	var crs = ddlAutoform.get("entity"); 
	var dataSet = dataSettbsProjundwrtCfmar.getData("#");
	var udtfaloc = crs.get("udtfaloc"); var udtnfaloc = crs.get("udtnfaloc"); var udtotloc = crs.get("udtotloc");
	var vfaloc = crs.get("tbsProj.vfaloc"); var vnfaloc = crs.get("tbsProj.vnfaloc"); var votloc = crs.get("tbsProj.votloc");	
	if (udtfaloc == 0 && udtnfaloc == 0 && udtotloc == 0 ) {
		buttonResend.set("disabled",true);
		dorado.MessageBox.alert("对不起，【本次承保金额】不能都为 【0.00】 ",{title:"趣博信息科技"});
	} else if (udtfaloc > vfaloc || udtnfaloc > vnfaloc || udtotloc > votloc){
		dorado.MessageBox.alert("对不起，您输入的【本次承保金额】 大于【当前可用授信额度】，请重新录入！",{title:"趣博信息科技"});
		buttonResend.set("disabled",true);		
	}else{
		buttonResend.set("disabled",false);
	    dataSet.set("udttotloc",udtfaloc+udtnfaloc+udtotloc);
	};
};

/** @Bind #undbdate.onPost */
/** @Bind #by3.onPost */
!function(self,arg,ddlAutoform,buttonResend,udttotloc,dataSettbsProjundwrtCfmar){
	var crs = ddlAutoform.get("entity"); 
	var bdate = crs.get("bdate"); var edate = crs.get("edate");
	var undbdate = crs.get("undbdate"); //var undedate = crs.get("undedate");
	var by3 = crs.get("by3");
	if (undbdate < bdate || undbdate > edate){  //undedate < bdate || undedate > edate
		buttonResend.set("disabled",true);
		dorado.MessageBox.alert("对不起，您输入的项目【承保开始日期】范围， 超出了【授信日期】的范围，请重新录入！",{title:"趣博信息科技"});
	}else if (by3 <= 0){
		buttonResend.set("disabled",true);
		dorado.MessageBox.alert("对不起，【承保期限（月）】必须输入一个大于零的数字！",{title:"趣博信息科技"});
	}else {
		buttonResend.set("disabled",false);
	};
};


/*=======================Cgg表单查询按钮===================*/
/** @Bind #buttonQueryCgg.onClick */
!function(self,arg,dataSetTbsProjCgg,dataSettbsProjundwrtCfmar,DialogTbsProjCgg){
	//获取autoformCondition绑定的实体对象
	var entity = dataSettbsProjundwrtCfmar.getData("#").get("tbsProj.id");
	//将实体对象作为参数传入，并异步刷新
	dataSetTbsProjCgg.set("parameter",entity).flushAsync();
	DialogTbsProjCgg.show();
};

/**
 * 文件处理 开始
 */

/** @Bind #tabAttach.onClick */
!function(self,arg,iFrameAttach,dataSettbsProjundwrtCfmar){
	var title = "projundwrtCfmar";
	var projsn = dataSettbsProjundwrtCfmar.getData("#").get("projSn");
	var fid ="承保补录";
	var attachpath="org.tbs.views.funs.MyFile.d?by1=" + title 
			+ "&by2=" + projsn
			+ "&by3=" + null
			+ "&fid=" + fid
			+ "&typid=" + null
			+ "&downloadbutton=" + downloadbutton //只读
			+ "&uploadbutton=" + uploadbutton //上传模块不显示
			+ "&dt=" + new Date();
			iFrameAttach.set("path",attachpath);
};


/**
 * 文件处理  结束
 */

//=========双击显示反担保详细信息==========
/** @Bind #dgTbsProjCgg.onDataRowDoubleClick */
!function() {
	var path = "";
	var entity = view.get("#dgTbsProjCgg").getCurrentEntity("entity").get("cggStr");
	var cggSn = view.get("#dgTbsProjCgg").getCurrentEntity("entity").get("cggSn");
	var cat1name;
	var cat2name;
	var cat3name;
	var customerId = view.get("#dataSettbsProjundwrtCfmar").getData("#.tbsProj").get("tbsCustomer").get("id");
	if(entity[0]){
	cat1name = entity[0].cat1name;
	cat2name = entity[0].cat2name;
	cat3name = entity[0].cat3name;
	}else{
		cat1name = entity.cat1name;
		cat2name = entity.cat2name;
		cat3name = entity.cat3name;
	}	
	if (cat3name) {
		path = "org.tbs.views.funs.CggDetail.d?fromAppr=0&customerId="
				+ customerId + "&cat=" + cat3name + "&cggSn=" + cggSn;
	} else if (cat2name) {
		path = "org.tbs.views.funs.CggDetail.d?fromAppr=0&customerId="
				+ customerId + "&cat=" + cat2name + "&cggSn=" + cggSn;
	} else if (cat1name) {
		path = "org.tbs.views.funs.CggDetail.d?fromAppr=0&customerId="
				+ customerId + "&cat=" + cat1name + "&cggSn=" + cggSn;
	}
	view.get("#dialogCggMaintain").show();
	view.get("#iFrameCggMaintain").set("path", path);
};

/** @Bind #dataGridHis.onDataRowDoubleClick */
!function(self) {
	var path = "org.tbs.views.funs.MyTbsFunApprc.d?id=";
	var taskHisId = self.getCurrentItem().get("id");
	view.get("#DialogTbsFunApprc").show();
	view.get("#iFrameTbsFunApprc").set("path", path+taskHisId);
};