package org.tbs.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * tbs_bas_area:客户基本信息-区域
 */
@Entity
@Table(name = "tbs_bas_area")
public class TbsBasArea implements Serializable {

	private static final long serialVersionUID = 1L;
	
	/**
	 * ID:
	 */
	private int id;

	/**
	 * NAME_:
	 */
	private String name;

	/**
	 * 默认为1，生效:默认为1，生效
	 */
	private boolean valid;

	/**
	 * tbs_bas_court:法院基本信息
	 */
	private Set<TbsBasCourt> tbsBasCourtSet = new HashSet<TbsBasCourt>(0);

	/**
	 * tbs_customer:客户基本信息
	 */
	private Set<TbsCustomer> tbsCustomerSet = new HashSet<TbsCustomer>(0);

	public TbsBasArea() {
		super();
	}

	public TbsBasArea(int id, String name, boolean valid,
			Set<TbsBasCourt> tbsBasCourtSet,Set<TbsCustomer> tbsCustomerSet) {
		super();
		this.id = id;
		this.name = name;
		this.valid = valid;
		this.tbsBasCourtSet = tbsBasCourtSet;
		this.tbsCustomerSet = tbsCustomerSet;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "ID", nullable = false)
	public int getId() {
		return id;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "NAME_", length = 45)
	public String getName() {
		return name;
	}

	public void setValid(boolean valid) {
		this.valid = valid;
	}

	@Column(name = "VALID")
	public boolean isValid() {
		return valid;
	}

	public void setTbsBasCourtSet(Set<TbsBasCourt> tbsBasCourtSet) {
		this.tbsBasCourtSet = tbsBasCourtSet;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "tbsBasArea")
	public Set<TbsBasCourt> getTbsBasCourtSet() {
		return tbsBasCourtSet;
	}
	
	public void setTbsCustomerSet(Set<TbsCustomer> tbsCustomerSet) {
		this.tbsCustomerSet = tbsCustomerSet;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "tbsBasArea")
	public Set<TbsCustomer> getTbsCustomerSet() {
		return tbsCustomerSet;
	}

	public String toString() {
		return "TbsBasArea [id=" + id + ",name=" + name + ",valid=" + valid
				+ ",tbsBasCourtSet=" + tbsBasCourtSet + ",tbsCustomerSet="
				+ tbsCustomerSet + "]";
	}

}
