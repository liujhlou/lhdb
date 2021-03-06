package org.tbs.uflo.dao.release;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.tbs.entity.TbsProjRelease;
import com.bstek.bdf2.core.business.IUser;
import com.bstek.bdf2.core.message.MessagePacket;
import com.bstek.bdf2.core.message.impl.InternalMessageSender;
import com.bstek.bdf2.core.model.DefaultUser;
import com.bstek.uflo.env.Context;
import com.bstek.uflo.model.ProcessInstance;
import com.bstek.uflo.process.handler.ActionHandler;
/**
 * @author Hank
 * 动作的实现类
 * 
 */

@Component
public class ActRelease implements ActionHandler {

	@Autowired
	@Qualifier(InternalMessageSender.BEAN_ID)
	private InternalMessageSender SendMsg;
	
	@Override
	public void handle(ProcessInstance processInstance, Context context) {
		String docid=processInstance.getBusinessId();
		Date now = new Date(); 
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String today = dateFormat.format(now);
		if (StringUtils.isNotEmpty(docid)){
			Session session = context.getSession();
			
			//====全部审批通过
			TbsProjRelease tprls = (TbsProjRelease) session.get(TbsProjRelease.class, Integer.valueOf(docid));
			String docsn = tprls.getSn();
			String projname = tprls.getTbsProj().getProjName();
			int projid = tprls.getTbsProj().getId();
			int cusid = tprls.getTbsProj().getTbsCustomer().getId();
			String arolename = tprls.getTbsProj().getBdf2User_A().getUsername();
			String brolename = tprls.getTbsProj().getBdf2User_B().getUsername();
			//更新状态
			String sql="update tbs_proj_release set valid=1 where id="+docid+" and proj_id="+projid;
			SQLQuery sqlquery = session.createSQLQuery(sql);
			sqlquery.executeUpdate();
			//更新金额
			String sql_hisloc = "call p_hisloc(4" + "," + projid + "," + cusid + ",'" + docsn + "')";
			SQLQuery sqlquery_hisloc = session.createSQLQuery(sql_hisloc);
			sqlquery_hisloc.executeUpdate();
					
			//===发送全部审批通过的消息===
			String promoter=processInstance.getPromoter(); //获取promoter
			DefaultUser receiver = (DefaultUser)session.get(DefaultUser.class,promoter );  //获得消息的接收人
			DefaultUser arole = (DefaultUser)session.get(DefaultUser.class, arolename);
			DefaultUser brole = (DefaultUser)session.get(DefaultUser.class, brolename);
			DefaultUser sender = (DefaultUser)session.get(DefaultUser.class,"SystemSender" );  //获得消息的发送人，默认为“系统发信人”
			Collection<IUser> receivers = new ArrayList<IUser>();
			receivers.add(receiver);
			receivers.add(arole);
			receivers.add(brole);
			MessagePacket Msgpkt= new MessagePacket();
			Msgpkt.setTitle("【项目解保】审批已全部通过！");
			Msgpkt.setContent("您发送的【项目解保】\n【项目名称："+projname+"】\n已经全部通过审批！\n" +
					 			"日期：" + today );
			Msgpkt.setTo(receivers);	
			Msgpkt.setSender(sender);	
			SendMsg.send(Msgpkt);		
		}
	}

}
