package com.nashtech.rookies.AssetManagement.repository.hibernate;

import com.nashtech.rookies.AssetManagement.config.Config;
import com.nashtech.rookies.AssetManagement.model.dto.RequestDTO;
import com.nashtech.rookies.AssetManagement.model.entity.Requests;
import com.nashtech.rookies.AssetManagement.model.enums.ERequestState;
import com.nashtech.rookies.AssetManagement.service.Impl.ReturnRequestServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.sql.Date;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
@Repository
public class ReturnRequestDAO {
    LocalContainerEntityManagerFactoryBean sessionFactory;

    public LocalContainerEntityManagerFactoryBean getSessionFactory() {
        return sessionFactory;
    }

    @Autowired
    public void setSessionFactory(LocalContainerEntityManagerFactoryBean sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public HashMap<String, Object> searchAndFilterByState(Long locationId, String keyword, String filterStr, String sortBy, int index){
        String sortRule = sortRuleGenerator(sortBy);
        try {
            List<ERequestState> state = Arrays.stream(filterStr.split(",")).map(s -> ERequestState.valueOf(s)).collect(Collectors.toList());
            System.out.println(state);
            EntityManager manager = sessionFactory.getObject().createEntityManager();
            Query query = manager.createQuery("select r from Requests r"
                    + " where " +
                    "  r.asset.location.id = :locationId and "
                    + "r.state in :state "
                    + "and lower(concat(r.asset.assetCode,r.asset.name,r.requestBy.username)) LIKE :keyword "
                    + "order by " + sortRule);
            query.setParameter("state", state);
            query.setParameter("keyword","%"+keyword.toLowerCase()+"%");
            query.setParameter("locationId",locationId);
            query.setFirstResult(index * Config.pageSize);
            query.setMaxResults(Config.pageSize);
            List<Requests> list = query.getResultList();
            List<RequestDTO> collect = list.stream().map(ReturnRequestServiceImpl::dtoConverter).collect(Collectors.toList());
            Query query2 = manager.createQuery("select count (r) from Requests r"
                    + " where " +
                    "  r.asset.location.id = :locationId and "
                    + "r.state in :state "
                    + "and lower(concat(r.asset.assetCode,r.asset.name,r.requestBy.username)) LIKE :keyword ");
            query2.setParameter("state", state);
            query2.setParameter("keyword","%"+keyword.toLowerCase()+"%");
            query2.setParameter("locationId",locationId);
            System.out.println("Total row: " + query2.getSingleResult());
            HashMap<String,Object> result = new HashMap();
            long totalRow = (long) query2.getSingleResult();
            long totalPage;
            if(totalRow / 19 > 0){
                totalPage = totalRow/19 + (totalRow % 19 > 0? 1:0);
            }else {
                totalPage = 1;
            }
            result.put("data",collect);
            result.put("totalPage",totalPage);
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public HashMap<String,Object>searchAndFilterStateAndReturnedDate(Long locationId, String keyword, String filterStr, String returnedDate, int index,String sortBy){
        String sortRule = sortRuleGenerator(sortBy);
        Date target = Date.valueOf(returnedDate);
        try {
            System.out.println();
            Date filterDate = Date.valueOf(returnedDate);
            List<ERequestState> state = Arrays.stream(filterStr.split(",")).map(s -> ERequestState.valueOf(s)).collect(Collectors.toList());
            System.out.println(state);
            EntityManager manager = sessionFactory.getObject().createEntityManager();
            Query query = manager.createQuery("select r from Requests r"
                    + " where " +
                    "  r.asset.location.id = :locationId and "
                    + "r.state in ?1 and r.returnedDate = ?2 "
                    + "and lower(concat(r.asset.assetCode,r.asset.name,r.requestBy.username)) LIKE :keyword "
                    + "order by " + sortRule)
                ;
        query.setParameter(1, state);
        query.setParameter(2, target);
        query.setParameter("keyword","%"+keyword.toLowerCase()+"%");
        query.setParameter("locationId",locationId);
        query.setFirstResult(index * Config.pageSize);
        query.setMaxResults(Config.pageSize);

            Query queryCount = manager.createQuery("select r from Requests r"
                    + " where " +
                    "  r.asset.location.id = :locationId and "
                    + "r.state in ?1 and r.returnedDate is not null and r.returnedDate = ?2 "
                    + "and lower(concat(r.asset.assetCode,r.asset.name,r.requestBy.username)) LIKE :keyword "
                    + "order by " + sortRule);
            queryCount.setParameter(1, state);
            queryCount.setParameter(2, filterDate);
            queryCount.setParameter("keyword","%"+keyword.toLowerCase()+"%");
            queryCount.setParameter("locationId",locationId);
            System.out.println(state);
            List<Requests> list = query.getResultList();
            System.out.println(list.size());
            List<RequestDTO> collect = list.stream().map(ReturnRequestServiceImpl::dtoConverter).collect(Collectors.toList());
            HashMap<String,Object> result = new HashMap<>();
            result.put("data",collect);
            long totalRow;
            try{
                totalRow = (long) queryCount.getSingleResult();
            }catch (Exception e){
                totalRow = 0;
            }
            long totalPage;
            if(totalRow / 19 > 0){
                totalPage = totalRow/19 + (totalRow % 19 > 0? 1:0);
            }else {
                totalPage = 1;
            }
            result.put("totalPage",totalPage);
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    private String sortRuleGenerator(String rule){
        String sortRule;
        switch (rule){
            case "assetCode": {
                sortRule = "r.asset.assetCode";
                break;
            }
            case "assetName":{
                sortRule = "r.asset.name";
                break;
            }
            case "assignedDate":{
                sortRule = "r.assignedDate";
                break;
            }
            case "acceptedBy":{
                sortRule = "r.acceptedBy";
                break;
            }
            case "requestBy":{
                sortRule = "r.requestBy";
                break;
            }
            case "returnedDate":{
                sortRule = " r.returnedDate";
                break;
            }
            case "state":{
                sortRule = "r.state";
                break;
            }
            default:{
                sortRule="id";
                break;
            }
        }
        return sortRule;
    }
}
