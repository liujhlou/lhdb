/*=======================dialog确认按钮及下拉框空值解决方案===================*/
/** @Bind #buttonSave.onClick */
!function(self,arg,dialogEdit,dataSetTbsProjcfm1){
	dialogEdit.hide();
	//datagrid的去空
	var TbsProjsfaBizvtSet =dataSetTbsProjcfm1.getData("#").get("tbsProjcfm1BizvtSet");
	TbsProjsfaBizvtSet.each(function(entity){
		if(entity.get("tbsBasBiztype")==""){
			entity.set("tbsBasBiztype",null);}
		if(entity.get("tbsBasBizvar")==""){
			entity.set("tbsBasBizvar",null);
		}
	});
	};

	/*=======================dialog取消按钮-清空当前数据操作===================*/
	/** @Bind #buttonCancel.onClick */
	!function(self,arg,dialogEdit,ddlAutoform,dataSetTbsProjcfm1){
		dialogEdit.hide();
		dataSetTbsProjcfm1.get("data:#").cancel();
	};
	/*=======================主表单查询按钮===================*/
	/** @Bind #buttonQuery.onClick */
	!function(self,arg,autoformCondition,dataSetTbsProjcfm1){
		//获取autoformCondition绑定的实体对象
		var entity = autoformCondition.get("entity");
		//将实体对象作为参数传入，并异步刷新
		dataSetTbsProjcfm1.set("parameter",entity).flushAsync();
	};

	/*=======================主表单新增按钮===================*/
	/** @Bind #buttonAdd.onClick */
	!function(self,arg,dialogEdit,dataSetTbsProjcfm1,ddlAutoform){
		dataSetTbsProjcfm1.insert();
		dialogEdit.show();
	};

	/*=======================主表删除按钮===================*/
	/** @Bind #buttonDel.onClick */
	!function(self,arg,dataSetTbsProjcfm1){
		var entity = dataSetTbsProjcfm1.get("data:#");
		entity.remove();
		//updateactionSave.execute();
	};

	/*=======================主表单修改按钮===================*/
	/** @Bind #buttonEdit.onClick */
	!function(self,arg,dialogEdit){
		dialogEdit.show();
	};

	/*========保存后刷新，执行query相同的方法=========*/
	/**@Bind #updateAction.onSuccess */
	!function(self,arg,autoformCondition,dataSetTbsProjcfm1){ 
	//获取autoformCondition绑定的实体对象
	var entity = autoformCondition.get("entity");
	//将实体对象作为参数传入，并异步刷新
	dataSetTbsProjcfm1.set("parameter",entity).flushAsync();
	};
	
	/*=======================Cgg表单查询按钮===================*/
	/** @Bind #buttonQueryCgg.onClick */
	!function(self,arg,dataSetTbsProjCgg,dataSetTbsProjcfm1,DialogTbsProjCgg){
		//获取autoformCondition绑定的实体对象
		var entity = dataSetTbsProjcfm1.getData("#").get("tbsProj.id");
		//将实体对象作为参数传入，并异步刷新
		dataSetTbsProjCgg.set("parameter",entity).flushAsync();
		DialogTbsProjCgg.show();
	};
	
	/*=======================业务类型的下拉联动===================*/
	/** @Bind #DropDownTbsBasBiztype.onClose  *//*
	!function(self,arg,dataSetTbsProjcfm1,dataSetTbsBasBizvar){
	var TbsProjsfaBizvtSet =dataSetTbsProjcfm1.getData("#").get("tbsProjsfaBizvtSet");
	TbsProjsfaBizvtSet.each(function(entity){
	if (entity.get("tbsBasBizvar")!=null) {
		entity.set("tbsBasBizvar"),null;}
		dataSetTbsProjcfm1.flushAsync();
	});};*/
	
	//=========双击显示反担保详细信息==========
	/** @Bind #dgTbsProjCgg.onDataRowDoubleClick */
	!function() {
		var path = "";
		var entity = view.get("#dgTbsProjCgg").getCurrentEntity("entity").get("cggStr");
		var cggSn = view.get("#dgTbsProjCgg").getCurrentEntity("entity").get("cggSn");
		var cat1name;
		var cat2name;
		var cat3name;
		var customerId = view.get("#dataSetTbsProjcfm1").getData("#.tbsProj").get("tbsCustomer").get("id");;
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
