package com.nashtech.rookies.AssetManagement.repository;
import com.nashtech.rookies.AssetManagement.model.entity.Requests;
import com.nashtech.rookies.AssetManagement.model.enums.ERequestState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface RequestRepository extends JpaRepository<Requests,Long> {
    @Query("select count(r) from Requests r " +
            "where r.asset.location.id = ?1 and LOWER(concat(r.asset.assetCode, r.asset.name)) like %?2% and r.state in ?3 group by r.id")
    Long searchAndFilterState(Long locationId, String keyword, List<ERequestState> states);

    @Query("select count(r) from Requests r " +
            "where LOWER(r.asset.assetCode) like %?1% or lower(r.asset.name) like %?1% and r.state in ?2 and r.returnedDate = ?3 group by r.id")
    Long searchAndFilterStateAndReturnedDate(String keyword, List<ERequestState> states, Date returnedDate);

    @Query("select count(r) from Requests r " +
            "where r.asset.location.id = ?1")
    Long searchOnly(Long locationId);

    Requests findRequestsByAssignmentId(Long assignmentId);

}
