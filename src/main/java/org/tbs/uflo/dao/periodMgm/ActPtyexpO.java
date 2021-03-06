package org.tbs.uflo.dao.periodMgm;

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
import org.tbs.entity.Bdf2User;
import org.tbs.entity.TbsProj;
import org.tbs.entity.TbsPtyexp;

import com.bstek.bdf2.core.business.IUser;
import com.bstek.bdf2.core.message.MessagePacket;
import com.bstek.bdf2.core.message.impl.InternalMessageSender;
import com.bstek.bdf2.core.model.DefaultUser;
import com.bstek.uflo.env.Context;
import com.bstek.uflo.model.ProcessInstance;
import com.bstek.uflo.process.handler.ActionHandler;


@Component
public class ActPtyexpO implements ActionHandler {

	@Autowired
	@Qualifier(InternalMessageSender.BEAN_ID)
	private InternalMessageSender SendMsg;
	
	@Override
	public void handle(ProcessInstance processInstance, Context context) {
		String docid=processInstance.getBusinessId();  //businessId需要view绑定的
		if (StringUtils.isNotEmpty(docid)){
			Session session = context.getSession();
			//====全部审批通过,更新valid===
			TbsPtyexp tbsPtyexp=(TbsPtyexp)session.get(TbsPtyexp.class, Integer.valueOf(docid));
			String sql="UPDATE `tbs`.`tbs_ptyexp` SET `valid`='1' WHERE `ID`="+docid+"";
			SQLQuery sqlquery=session.createSQLQuery(sql);
			sqlquery.executeUpdate();	
			String sn = tbsPtyexp.getSn();
			//===发送全部审批通过的消息===
			TbsProj tbsProj = tbsPtyexp.getTbsProj();
			String projname = tbsProj.getProjName();
			Bdf2User userA = tbsProj.getBdf2User_A();
			Bdf2User userB = tbsProj.getBdf2User_B();
			DefaultUser receiverA = (DefaultUser) session.get(
					DefaultUser.class, userA.getUsername());
			DefaultUser receiverB = (DefaultUser) session.get(
					DefaultUser.class, userB.getUsername());
			DefaultUser sender = (DefaultUser) session.get(DefaultUser.class,
					"SystemSender"); // 获得消息的发送人，默认为“系统发信人”
			Collection<IUser> receivers = new ArrayList<IUser>();
			receivers.add(receiverA);
			receivers.add(receiverB);
			Date now = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String today = dateFormat.format(now);
			MessagePacket Msgpkt= new MessagePacket();
			Msgpkt.setTitle("【费用退回】审批已全部通过！");
			Msgpkt.setContent("您发送的【费用收取】\n【项目名称："+projname+"】\n"+"【单据编号】"+sn+"\n审批已全部通过！\n日期： "+today);
			Msgpkt.setTo(receivers);	
			Msgpkt.setSender(sender);	
			SendMsg.send(Msgpkt);
			
		}
	}

}
