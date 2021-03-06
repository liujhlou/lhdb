// Global variables
var aprv = 1; // 表示来自审批界面, 0表示来自detail按钮, 2来自新增按钮
var projid;
var projsn ;

/** @Bind view.onReady */
!function(self, arg) {
	if ("${request.getParameter('aprv')}"){
		aprv = "${request.getParameter('aprv')}";
	}	
	projid = "${request.getParameter('projid')}";
	projsn = "${request.getParameter('projsn')}";
	if (aprv == 2) {
		var arole = "${request.getParameter('arole')}";
		var brole = "${request.getParameter('brole')}";
		var arolename = "${request.getParameter('arolename')}";  // 只给新增页面使用，直接取值
		var brolename = "${request.getParameter('brolename')}";
		var rq = new Date();
		var autoform = view.get("#AutoFormChangeRole");
		var dataSet = view.get("#dataSetTbsProjchangeRole");
		view.get("#tabInAppr").set("visible",false);
		view.get("#tabTbsProj").set("visible",false);
		view.get("#tabTbsProjundwrt").set("visible",false);
		view.get("#tabProjAttach").set("visible",false);
		view.get("#tabHistoryTask").set("visible",false);
		view.get("#btnSave").set("visible",true);
		view.get("#btnSave").set("action","saveChangeRole");
		view.get("#btnClose").set("visible",true);
		view.get("#btnSubmit").set("visible",false);
		dataSet.insert();
		dataSet.getData("#").set("projSn",projsn);
		dataSet.getData("#").set("tbsProj.id",projid);
		dataSet.getData("#").set("bdf2User_AO.id",arole);
		dataSet.getData("#").set("bdf2User_BO.id",brole);
		view.get("#bdf2User_AO").set("visible",false);
		view.get("#bdf2User_BO").set("visible",false);
		autoform.set("entity.arolename", arolename);
		autoform.set("entity.brolename", brolename);
		autoform.set("entity.timestampInput", rq);
	} else if (aprv == 0) {
		var projchangeid = "${request.getParameter('projchangeid')}";
		var projchangevalid = "${request.getParameter('projchangevalid')}";
		if (projchangevalid != "0"){
			view.get("#dataSetTbsProjchangeRole").set("readOnly",true);
			view.get("#btnSubmit").set("visible", false);
			view.get("#btnSave").set("visible",false);
		};
		view.get("#tabInAppr").set("visible",false);
		view.get("#arolename").set("visible",false);
		view.get("#brolename").set("visible",false);
		view.get("#btnSave").set("action","saveChangeRole");
		view.get("#dataSetTbsProj").set("parameter", projid).flushAsync();
		view.get("#dataSetTbsProjundwrt").set("parameter", projid).flushAsync();
		view.get("#dataSetTbsProjchangeRole").set("parameter", projchangeid).flushAsync();
	} else {
		var businessId = "${request.getParameter('businessId')}";  
		view.get("#dataSetTbsProjchangeRole").set("parameter", businessId).flush();  // 这里为了立刻让dataset有值只能用flush，不能用flushasync
		var dataSet = view.get("#dataSetTbsProjchangeRole").getData("#"); 
		var projid = dataSet.get("tbsProj.id"); 
		var projchangevalid = dataSet.get("valid");
		if (projchangevalid !=3 ) {	
			view.get("#listDdlOutcome").set("items",["通过","驳回"]);
			view.get("#dataSetTbsProjchangeRole").set("readOnly",true);
		} else {
			view.get("#listDdlOutcome").set("items",["修改确认"]);
		}
		view.get("#btnPanel").set("visible",false);
		view.get("#arolename").set("visible",false);
		view.get("#brolename").set("visible",false);
		view.get("#tabControlMain").set("height","99%");
		view.get("#dataSetTbsProj").set("parameter", projid).flushAsync();  
		view.get("#dataSetTbsProjundwrt").set("parameter", projid).flushAsync();
	}
};

/*=======数据保存后刷新父窗口，关闭自身========*/
/** @Bind #btnSave.onClick */  
!function(self, arg ,saveChangeRole) {
	saveChangeRole.execute({
		callback : function(result) {  //用回调方法是为了让字段的必填校验在界面上做出错提示
			if (result == true){    
				var autoformCondition = window.parent.$id("autoformCondition").objects[0];
				var dataSet = window.parent.$id("dataSetTbsProj").objects[0];
				var entity = autoformCondition.get("entity");
				var dialogMainForm = window.parent.$id("dialogProjDetails").objects[0];
				dialogMainForm.hide();
				dataSet.set("parameter", entity).flushAsync();
			}
		}
	});
};

/*======关闭窗口按钮==========*/
/** @Bind #btnClose.onClick */
!function(self, arg) {
	var dialogMainForm = window.parent.$id("dialogProjDetails").objects[0];
	dialogMainForm.close();
};

/*=======================发起流程===================*/
/** @Bind #btnSubmit.onClick */
!function(self, arg, dataSetTbsProj, dataSetTbsProjchangeRole, ajaxactionStartProcess, saveChangeRole) {
	var projid = dataSetTbsProj.getData("#").get("id");
	var projchangeid = dataSetTbsProjchangeRole.getData("#").get("id");
	var params ={
			projid : projid,
			projchangeid : projchangeid
	};
	saveChangeRole.execute();
	ajaxactionStartProcess.set("parameter", params).execute(function(result) {
		dorado.MessageBox.alert(result, {
			title : "趣博信息科技"
		});
	});
	window.parent.$id("dataSetTbsProj").objects[0].flushAsync();
	dataSetTbsProjchangeRole.flushAsync();
	dataSetTbsProjchangeRole.set("readOnly",true);
	self.set("visible",false);
	view.get("#btnSave").set("visible",false);
};

/*======================待办任务，进行审批==================*/
/** @Bind #btnApprSubmit.onClick */ 
!function(self,arg,autoformOpinion,saveChangeRole,ajaxactionApprSubmit) {
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
			saveChangeRole.execute();
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

/* =======================承保审批明细表=================== */
/** @Bind #datagridTbsProjundwrt.onDataRowDoubleClick */
!function(self){
	view.get("#dialogTbsProjundwrt").show();
};
/** @Bind #buttonClose.onClick */
!function(self){
	view.get("#dialogTbsProjundwrt").hide();
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
	var title = "ProjChangeRole";
	var projsn = dataSetTbsProj.getData("#").get("sn");
	var fid ="项目经理变更";
	var by3 =null;
	var typid =null;
	var attachpath="org.tbs.views.funs.MyFile.d?by1=" + title 
			+ "&by2=" + projsn
			+ "&by3=" + by3
			+ "&fid=" + fid
			+ "&typid=" + typid
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

/** @Bind #dataGridHis.onDataRowDoubleClick */
!function(self) {
	var path = "org.tbs.views.funs.MyTbsFunApprc.d?id=";
	var taskHisId = self.getCurrentItem().get("id");
	view.get("#DialogTbsFunApprc").show();
	view.get("#iFrameTbsFunApprc").set("path", path+taskHisId);
};