package com.nashtech.rookies.AssetManagement.repository;

import com.nashtech.rookies.AssetManagement.model.entity.Location;
import com.nashtech.rookies.AssetManagement.model.entity.Roles;
import com.nashtech.rookies.AssetManagement.model.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, String> {
    Optional<Users> findByUsername(String username);

    @Query("SELECT u.username FROM Users u WHERE u.username LIKE concat(:username, '%') ")
    List<String> getUsernameStartsWith(@Param("username") String username);

    @Override
    Optional<Users> findById(String s);

    @Query(value = "select u from Users u where (lower(u.id) like %?3% or (lower(u.firstName) like %?4% or lower(u.lastName) like %?5%) or lower(u.username) like %?6%) and u.location = ?1 and u.isActive = ?7  and u.roles in ?2",
            countQuery = "select count(u) from Users u where (lower(u.id) like %?3% or (lower(u.firstName) like %?4% and lower(u.lastName) like %?5%) or lower(u.username) like %?6%) and u.location = ?1 and u.isActive = ?7  and u.roles in ?2",
            nativeQuery = false)
    Page<Users> filterAndSearch(Location location, List<Roles> roles, String id, String firstName, String lastName, String username, boolean isActive, Pageable pageable);

    @Query(value = "select u from Users u where (lower(u.id) like %?3% or (lower(u.firstName) like %?4% and lower(u.lastName) like %?5%) or lower(u.username) like %?6%) and u.location = ?1 and u.roles in ?2 and u.isActive = ?7 ",
            countQuery = "select count(u) from Users u where lower(u.id) like %?3% or (lower(u.firstName) like %?4% and lower(u.lastName) like %?5%) or lower(u.username) like %?6% and u.location = ?1 and u.isActive = ?7  and u.roles in ?2 ",
            nativeQuery = false)
    Page<Users> searchAndFilterWithFullName(Location location, List<Roles> roles, String keyword, Boolean isActive, Pageable pageable);


    @Query(value = "select u from Users u where (lower(u.id) like %?2% or (lower(u.firstName) like %?2% and lower(u.lastName) like %?2%) or lower(u.username) like %?2%) and u.location = ?1 and u.isActive = ?3",
            nativeQuery = false)
    Page<Users> findUsersByLocation(Location location, String keyword, boolean isActive, Pageable pageable);

    @Query(value = "SELECT concat(u.last_name,' ',u.first_name) as fullName, u.id, u.username" +
            " FROM public.users u" +
            " WHERE u.is_active = True and u.location_id = ?1" +
            " ORDER BY u.id",nativeQuery = true)
    List<Object[]> getAvailable(int location_id);

    @Query("select u from Users u where lower(concat(u.firstName,' ',u.lastName)) like %?2% and u.location.id = ?1 and u.isActive = ?3")
    Page<Users> findUsersOnSpacekeyword(Long location, String fullName, boolean isActive, Pageable pageable);
    @Query("select u from Users u where (lower(u.id) like %?2% or (lower(u.firstName) like %?3% or lower(u.lastName) like %?4%)) and u.location.id = ?1 and u.isActive = ?5")
    Page<Users> findUsersOnNonSpaceKeyword(Long location, String id, String firstName, String lastName,boolean isActive,Pageable pageable);
}



