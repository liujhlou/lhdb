// Global variables
var aprv = 1; // 表示来自审批界面, 0表示来自detail按钮, 2来自新增按钮
var projid;
var undwrtid ;
var initfaloc;
var initnfaloc;
var initotloc;
var inittotloc;

/** @Bind view.onReady */
!function(self, arg) {
	if ("${request.getParameter('aprv')}"){
		aprv = "${request.getParameter('aprv')}";
	}	
	projid = "${request.getParameter('projid')}";
	undwrtid = "${request.getParameter('undwrtid')}";
	initfaloc = "${request.getParameter('rlsfaloc')}";
	initnfaloc = "${request.getParameter('rlsnfaloc')}";
	initotloc = "${request.getParameter('rlsotloc')}";
	inittotloc = "${request.getParameter('rlstotloc')}";
	var projname = "${request.getParameter('projname')}";
	if (aprv == 2) {
		var rq = new Date();
		var dataSet = view.get("#dataSetTbsProjRelease");
		var autoform = view.get("#AutoFormRelease");
		view.get("#tabInAppr").set("visible",false);
		view.get("#tabTbsProj").set("visible",false);
		view.get("#tabTbsProjundwrt").set("visible",false);
		view.get("#tabProjAttach").set("visible",false);
		view.get("#tabHistoryTask").set("visible",false);
		view.get("#btnSave").set("visible",true);
		view.get("#btnSave").set("action","saveRelease");
		view.get("#btnClose").set("visible",true);
		view.get("#btnSubmit").set("visible",false);
		view.get("#projname0").set("visible",false);
		dataSet.insert();
		autoform.set("entity.projname2",projname);
		dataSet.getData("#").set("tbsProj.id",projid);
		dataSet.getData("#").set("tbsProjundwrt.id",undwrtid);
		dataSet.getData("#").set("faloc",initfaloc);
		dataSet.getData("#").set("nfaloc",initnfaloc);
		dataSet.getData("#").set("otloc",initotloc);
		dataSet.getData("#").set("totloc",inittotloc);
		dataSet.getData("#").set("timestampInput", rq);	
		dataSet.getData("#").set("timestampUpdate", rq);
		dataSet.getData("#").set("rlsdate", rq);	
	} else if (aprv == 0) {
		var releaseid = "${request.getParameter('releaseid')}";
		var releasevalid = "${request.getParameter('releasevalid')}";
		if (releasevalid != "0"){
			view.get("#dataSetTbsProjRelease").set("readOnly",true);
			view.get("#btnSubmit").set("visible", false);
			view.get("#btnSave").set("visible",false);
		};
		view.get("#tabInAppr").set("visible",false);
		view.get("#projname2").set("visible",false);
		view.get("#btnSave").set("action","saveRelease");
		view.get("#dataSetTbsProj").set("parameter", projid).flushAsync();
		view.get("#dataSetTbsProjundwrt").set("parameter", projid).flushAsync();
		view.get("#dataSetTbsProjRelease").set("parameter", releaseid).flush();
	} else {
		var businessId = "${request.getParameter('businessId')}";  
		view.get("#dataSetTbsProjRelease").set("parameter", businessId).flush();  // 这里为了立刻让dataset有值只能用flush，不能用flushasync
		var dataSet = view.get("#dataSetTbsProjRelease").getData("#"); 
		var projid = dataSet.get("tbsProj.id"); 
		var releasevalid = dataSet.get("valid");
		initfaloc = dataSet.get("tbsProjundwrt.rlsfaloc");
		initnfaloc = dataSet.get("tbsProjundwrt.rlsnfaloc");
		initotloc = dataSet.get("tbsProjundwrt.rlsotloc");
		inittotloc = dataSet.get("tbsProjundwrt.rlstotloc");
		if (releasevalid !=3 ) {	
			view.get("#listDdlOutcome").set("items",["通过","驳回"]);
			view.get("#dataSetTbsProjRelease").set("readOnly",true);
		} else {
			view.get("#listDdlOutcome").set("items",["修改确认"]);
		}
		view.get("#btnPanel").set("visible",false);
		view.get("#tabControlMain").set("height","99%");
		view.get("#dataSetTbsProj").set("parameter", projid).flushAsync();  
		view.get("#dataSetTbsProjundwrt").set("parameter", projid).flushAsync();
		view.get("#projname2").set("visible",false);
	}
};

/*=======数据保存后刷新父窗口，关闭自身========*/
/** @Bind #btnSave.onClick */
!function(self, arg, saveRelease) {
	saveRelease.execute();
	var autoformCondition = window.parent.$id("autoformCondition").objects[0];
	var dataSet = window.parent.$id("dataSetTbsProj").objects[0];
	var condition = autoformCondition.get("entity");
	var dialogMainForm = window.parent.$id("dialogProjDetails").objects[0];
	dialogMainForm.hide();
	dataSet.set("parameter", condition).flushAsync();
};

/*======关闭窗口按钮==========*/
/** @Bind #btnClose.onClick */
!function(self, arg) {
	var dialogMainForm = window.parent.$id("dialogProjDetails").objects[0];
	dialogMainForm.close();
};

/* =======================承保审批明细表=================== */
/** @Bind #datagridTbsProjundwrt.onDataRowDoubleClick */
!function(self){
	view.get("#dialogTbsProjundwrt").show();
};
/** @Bind #buttonClose.onClick */
!function(self){
	view.get("#dialogTbsProjundwrt").hide();
};

/*===============页面计算===================*/
/** @Bind #rlsfaloc.onPost */
/** @Bind #rlsnfaloc.onPost */
/** @Bind #rlsotloc.onPost */
!function(self, arg, AutoFormRelease){
	var autoform = AutoFormRelease.get("entity");
	var newfaloc = autoform.get("faloc");
	var newnfaloc = autoform.get("nfaloc");
	var newotloc = autoform.get("otloc");
	if (newfaloc > initfaloc || newnfaloc > initnfaloc || newotloc > initotloc) 
	{	view.get("#btnSave").set("disabled",true);
		view.get("#btnSubmit").set("disabled", true);
		view.get("#btnApprSubmit").set("disabled", true);
		dorado.MessageBox.alert("对不起，您输入的【解保金额】 大于承保单内的【可解保金额】，请重新录入！",{title:"趣博信息科技"});
	}else{
		view.get("#btnSave").set("disabled",false);
		view.get("#btnSubmit").set("disabled", false);
		view.get("#btnApprSubmit").set("disabled", false);
		autoform.set("totloc", newfaloc+newnfaloc+newotloc);
	 }
};



/*=======================发起流程===================*/
/** @Bind #btnSubmit.onClick */
!function(self, arg, dataSetTbsProj, dataSetTbsProjRelease, ajaxactionStartProcess, saveRelease) {
	var projid = dataSetTbsProj.getData("#").get("id");
	var releaseid = dataSetTbsProjRelease.getData("#").get("id");
	var params ={
			projid : projid,
			releaseid : releaseid
	};
	saveRelease.execute();
	ajaxactionStartProcess.set("parameter", params).execute(function(result) {
		dorado.MessageBox.alert(result, {
			title : "趣博信息科技"
		});
	});
	window.parent.$id("dataSetTbsProj").objects[0].flushAsync();
	dataSetTbsProjRelease.flushAsync();
	dataSetTbsProjRelease.set("readOnly",true);
	self.set("visible",false);
	view.get("#btnSave").set("visible",false);
};

/*======================待办任务，进行审批==================*/
/** @Bind #btnApprSubmit.onClick */ 
!function(self,arg,autoformOpinion,saveRelease,ajaxactionApprSubmit) {
	var outcome = autoformOpinion.get("entity.outcome");
	var comment = autoformOpinion.get("entity.comment");
	if (!outcome) {
		dorado.MessageBox.alert("请先选择审批结果！", {
			title : "趣博信息科技"
		});
		return;
	}
	if (outcome == "驳回" && !comment) {
		dorado.MessageBox.alert("驳回时审批意见不能为空！", {
			title : "趣博信息科技"
		});
		return;
	}
	else {
		if (!comment) {
			comment = "无意见";
		}
		var taskId = "${request.getParameter('taskId')}";
		var docid = "${request.getParameter('businessId')}";
		var params = {
				taskid : taskId,
				docid : docid,
				outcome : outcome,
				comment : comment,
			};
		if (outcome == "修改确认" ) {
			saveRelease.execute();
		};
		ajaxactionApprSubmit.set("parameter", params).execute();
	};
};

/*=========待办任务界面关闭窗口============*/
/** @Bind #ajaxactionApprSubmit.onSuccess */
/** @Bind #btnApprClose.onClick */
!function(self, arg) {
	window.parent.closeProcessDialog('${request.getParameter("type")}');
};

/* =======================反担保子表=================== 
*//** @Bind #buttonQueryCgg.onClick *//*
!function(self,arg,dataSetTbsProjCgg,dataSetTbsProjundwrt,DialogTbsProjCgg){
	//获取autoformCondition绑定的实体对象
	var entity = dataSetTbsProjundwrt.getData("#").get("tbsProj.id");
	//将实体对象作为参数传入，并异步刷新
	dataSetTbsProjCgg.set("parameter",entity).flushAsync();
	DialogTbsProjCgg.show();
};*/




/**
 * 文件处理 开始
 */

/** @Bind #tabProjAttach.onClick */
!function(self,arg,iFrameAttach,dataSetTbsProj){
	var title = "ProjRelease";
	var projsn = dataSetTbsProj.getData("#").get("sn");
	var fid ="项目解保";
	var attachpath="org.tbs.views.funs.MyFile.d?by1=" + title 
			+ "&by2=" + projsn
			+ "&by3=" + null
			+ "&fid=" + fid
			+ "&typid=" + null
			+ "&dt=" + new Date();
			iFrameAttach.set("path",attachpath);
};


/**
 * 文件处理  结束
 */

//=========双击显示反担保详细信息==========
/** @Bind #datagridTbsProjCgg.onDataRowDoubleClick */
!function() {
	var path = "";
	var entity = view.get("#datagridTbsProjCgg").getCurrentEntity("entity").get("cggStr");
	var cggSn = view.get("#datagridTbsProjCgg").getCurrentEntity("entity").get("cggSn");
	var cat1name;
	var cat2name;
	var cat3name;
	var customerId = view.get("#dataSetTbsProj").getData("#").get("tbsCustomer").get("id");;
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