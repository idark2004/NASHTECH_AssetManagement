package com.nashtech.rookies.AssetManagement.repository;

import com.nashtech.rookies.AssetManagement.model.entity.Assets;
import com.nashtech.rookies.AssetManagement.model.entity.Assignments;
import com.nashtech.rookies.AssetManagement.model.entity.Category;
import com.nashtech.rookies.AssetManagement.model.enums.EAssetState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Assets,String> {
    List<Assets> findAssetByCategory(Category category);
    @Query("select s from Assets s where s.name = ?1 or s.assetCode=?2 and s.category = ?3")
    List<Assets> findByNameContainingOrAssetCodeContainingAAndCategory(String name,String code, Category category);

    //Count the number of rows that has asset_code begin with param prefix
    @Query(value = "SELECT COUNT(a) FROM Assets a WHERE a.asset_code ~ concat('^',:prefix,'[0-9]{6}$')",nativeQuery = true)
    int getAssetRows(@Param("prefix") String prefix);

    //Get the latest asset_code that begin with param prefix
    @Query(value = "SELECT a.asset_code FROM Assets a WHERE a.asset_code ~ concat('^',:prefix,'[0-9]{6}$') ORDER BY a.asset_code DESC LIMIT 1",nativeQuery = true)
    String getLatestAssetCode(@Param("prefix") String prefix);

    @Query("select a from Assets a where (lower(a.assetCode) like %?3% or lower(a.name) like %?3%) " +
            "and a.location.id = ?1 and a.state in ?2")
    Page<Assets> filterAllByLocationAndState(Long location, List<EAssetState> state, String keyword, Pageable page);

    @Query("select a from Assets a where (lower(a.assetCode) like %?2% or lower(a.name) like %?2%) " +
            "and a.location.id = ?1")
    Page<Assets> filterAllByLocation(Long location, String keyword, Pageable page);

    @Query("select a from Assets a where (lower(a.assetCode) like %?3% or lower(a.name) like %?3%) " +
            "and a.location.id = ?1 and a.category.name in ?2")
    Page<Assets> filterAllByLocationAndCategory(Long location, List<String> categories, String keyword, Pageable page);

    @Query("select a from Assets a where (lower(a.assetCode) like %?4% or lower(a.name) like %?4%) " +
            "and a.location.id = ?1 and a.state in ?2 and a.category.name in ?3")
    Page<Assets> filterAllByLocationAndStateAndCategory(Long location, List<EAssetState> state, List<String> categories, String keyword, Pageable page);

    @Query(value = "SELECT a.asset_code, a.name as asset_name, c.name as category " +
            "FROM public.assets a INNER JOIN public.categories c ON a.category_id = c.prefix" +
            " WHERE a.state = 'AVAILABLE' AND a.location_id = ?1" +
            " ORDER BY a.asset_code ",nativeQuery = true)
    List<Object[]> getAvailableAsset(int location_ic);

    @Query(value = "SELECT c.name," +
            " Count(a) as Total," +
            " SUM(CASE WHEN a.state = 'ASSIGNED' THEN 1 ELSE 0 END) as Assigned," +
            " SUM(CASE WHEN a.state = 'AVAILABLE' THEN 1 ELSE 0 END) as Available," +
            " SUM(CASE WHEN a.state = 'NOT_AVAILABLE' THEN 1 ELSE 0 END) as not_available," +
            " SUM(CASE WHEN a.state = 'WAITING_FOR_RECYCLING' THEN 1 ELSE 0 END) as waiting," +
            " SUM(CASE WHEN a.state = 'RECYCLED' THEN 1 ELSE 0 END) as recycled" +
            " FROM categories c" +
            " LEFT JOIN assets a" +
            " ON a.category_id = c.prefix" +
            " AND a.location_id = ?1"+
            " GROUP BY c.name" +
            " ORDER BY c.name ASC", nativeQuery = true)
    List<Object[]> getReport(int location_id);
}
