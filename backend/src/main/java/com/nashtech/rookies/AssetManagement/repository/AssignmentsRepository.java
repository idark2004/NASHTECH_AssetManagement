package com.nashtech.rookies.AssetManagement.repository;

import com.nashtech.rookies.AssetManagement.model.entity.Assignments;
import com.nashtech.rookies.AssetManagement.model.entity.Users;
import com.nashtech.rookies.AssetManagement.model.enums.EAssignState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentsRepository extends JpaRepository<Assignments, Long> {

    @Query("select a from Assignments a where a.assignee = ?1")
    Optional<List<Assignments>> getAssignmentsByAssignee(Users assignee);

    @Query("select a from Assignments a where  a.assigner = ?1")
    Optional<List<Assignments>> findAssignmentsByAssigner(Users assigner);

    boolean existsByAsset_AssetCode(String assetCode);

    List<Assignments> findAllByAsset_AssetCode(String assetCode);


    /*Filter by Both State And Date*/
    @Query(value = "select a from Assignments a where (lower(a.asset.assetCode) like %?4% or lower(a.asset.name) like %?4% or lower(a.assignee.username) like %?4%) " +
            "and a.asset.location.id = ?1 and a.state in ?2 and a.assignedDate = ?3")
    Page<Assignments> filterAllByLocationAndStateAndDate(Long location, List<EAssignState> state, Date date, String keyword, Pageable page);


    @Query(value = "select a from Assignments a where (lower(a.asset.assetCode) like %?4% or lower(a.asset.name) like %?4% or lower(a.assignee.username) like %?4%) " +
            "and a.asset.location.id = ?1 and a.state in ?2 and a.assignedDate = ?3 order by  a.assignee.username")
    Page<Assignments> filterAllByLocationAndStateAndDateSortByAsigneeOrder(Long location, List<EAssignState> state, Date date, String keyword, Pageable page);


    @Query(value = "select a from Assignments a where (lower(a.asset.assetCode) like %?4% or lower(a.asset.name) like %?4% or lower(a.assignee.username) like %?4%) " +
            "and a.asset.location.id = ?1 and a.state in ?2 and a.assignedDate = ?3 order by  a.assigner.username")
    Page<Assignments> filterAllByLocationAndStateAndDateSortByAsignerOrder(Long location, List<EAssignState> state, Date date, String keyword, Pageable page);



    @Query(value = "select a from Assignments a where (lower(a.asset.assetCode) like %?4% or lower(a.asset.name) like %?4% or lower(a.assignee.username) like %?4%) " +
            "and a.asset.location.id = ?1 and a.state in ?2 and a.assignedDate = ?3 order by  a.asset.assetCode")
    Page<Assignments> filterAllByLocationAndStateAndDateSortByAssetCodeOrder(Long location, List<EAssignState> state, Date date, String keyword, Pageable page);



    @Query(value = "select a from Assignments a where (lower(a.asset.assetCode) like %?4% or lower(a.asset.name) like %?4% or lower(a.assignee.username) like %?4%) " +
            "and a.asset.location.id = ?1 and a.state in ?2 and a.assignedDate = ?3 order by a.asset.name")
    Page<Assignments> filterAllByLocationAndStateAndDateSortByAssetName(Long location, List<EAssignState> state, Date date, String keyword, Pageable page);




    /*filter by Location Date only*/
    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?3% or lower(a.asset.name) like %?3% or lower(a.assignee.username) like %?3%) " +
            "and a.asset.location.id = ?1 and a.assignedDate = ?2")
    Page<Assignments> filterAllByLocationAndDate(Long location, Date date, String keyword, Pageable page);

    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?3% or lower(a.asset.name) like %?3% or lower(a.assignee.username) like %?3%) " +
            "and a.asset.location.id = ?1 and a.assignedDate = ?2 order by  a.asset.assetCode")
    Page<Assignments> filterAllByLocationAndDateSortByAssetCode(Long location, Date date, String keyword, Pageable page);

    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?3% or lower(a.asset.name) like %?3% or lower(a.assignee.username) like %?3%) " +
            "and a.asset.location.id = ?1 and a.assignedDate = ?2 order by  a.asset.name")
    Page<Assignments> filterAllByLocationAndDateSortByAssetName(Long location, Date date, String keyword, Pageable page);

    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?3% or lower(a.asset.name) like %?3% or lower(a.assignee.username) like %?3%) " +
            "and a.asset.location.id = ?1 and a.assignedDate = ?2 order by  a.assignee.username")
    Page<Assignments> filterAllByLocationAndDateSortByAssigneeName(Long location, Date date, String keyword, Pageable page);

    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?3% or lower(a.asset.name) like %?3% or lower(a.assignee.username) like %?3%) " +
            "and a.asset.location.id = ?1 and a.assignedDate = ?2 order by  a.assigner.username")
    Page<Assignments> filterAllByLocationAndDateSortByAssignerName(Long location, Date date, String keyword, Pageable page);



    /*filter by Location only*/
    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?2% or lower(a.asset.name) like %?2% or lower(a.assignee.username) like %?2%) " +
            "and a.asset.location.id = ?1")
    Page<Assignments> filterAllByLocation(Long location, String keyword, Pageable page);

    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?2% or lower(a.asset.name) like %?2% or lower(a.assignee.username) like %?2%) " +
            "and a.asset.location.id = ?1 order by a.asset.assetCode")
    Page<Assignments> filterAllByLocationSortByAssetCode(Long location, String keyword, Pageable page);

    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?2% or lower(a.asset.name) like %?2% or lower(a.assignee.username) like %?2%) " +
            "and a.asset.location.id = ?1 order by a.asset.name")
    Page<Assignments> filterAllByLocationSortByAssetName(Long location, String keyword, Pageable page);


    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?2% or lower(a.asset.name) like %?2% or lower(a.assignee.username) like %?2%) " +
            "and a.asset.location.id = ?1 order by a.assigner.username")
    Page<Assignments> filterAllByLocationSortByAssignerName(Long location, String keyword, Pageable page);


    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?2% or lower(a.asset.name) like %?2% or lower(a.assignee.username) like %?2%) " +
            "and a.asset.location.id = ?1 order by a.assignee.username")
    Page<Assignments> filterAllByLocationSortByAssigneeName(Long location, String keyword, Pageable page);



    /*filter by location and state only*/

    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?3% or lower(a.asset.name) like %?3% or lower(a.assignee.username) like %?3%) " +
            "and a.asset.location.id = ?1 and a.state in ?2")
    Page<Assignments> filterAllByLocationAndState(Long location, List<EAssignState> state, String keyword, Pageable page);


    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?3% or lower(a.asset.name) like %?3% or lower(a.assignee.username) like %?3%) " +
            "and a.asset.location.id = ?1 and a.state in ?2 order by a.asset.assetCode")
    Page<Assignments> filterAllByLocationAndStateSortByAssetCode(Long location, List<EAssignState> state, String keyword, Pageable page);


    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?3% or lower(a.asset.name) like %?3% or lower(a.assignee.username) like %?3%) " +
            "and a.asset.location.id = ?1 and a.state in ?2 order by a.asset.name")
    Page<Assignments> filterAllByLocationAndStateSortByAssetName(Long location, List<EAssignState> state, String keyword, Pageable page);


    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?3% or lower(a.asset.name) like %?3% or lower(a.assignee.username) like %?3%) " +
            "and a.asset.location.id = ?1 and a.state in ?2 order by a.assigner.username")
    Page<Assignments> filterAllByLocationAndStateSortByAssignerName(Long location, List<EAssignState> state, String keyword, Pageable page);


    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?3% or lower(a.asset.name) like %?3% or lower(a.assignee.username) like %?3%) " +
            "and a.asset.location.id = ?1 and a.state in ?2 order by a.assignee.username")
    Page<Assignments> filterAllByLocationAndStateSortByAssigneeName(Long location, List<EAssignState> state, String keyword, Pageable page);









    @Query("SELECT a FROM Assignments a WHERE (a.assignedDate <= :date AND a.assignee.id = :id)")
    List<Assignments> getAssignmentsByUserId(@Param("id") String userId, @Param("date") Date currentDate);

    @Query("SELECT MAX(a.id) FROM Assignments a")
    int getLatestId();

    @Query("select a from Assignments a where (lower(a.asset.assetCode) like %?1% or lower(a.asset.name) like %?1% or lower(a.assignee.username) like %?1%) " +
            "order by a.assignee.username asc")
    Page<Assignments> filterAllByLocationAndStateOrderByAssigneeUserName(String keyword,String orderBy, Pageable page);}
