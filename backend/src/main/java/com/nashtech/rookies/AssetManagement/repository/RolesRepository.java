package com.nashtech.rookies.AssetManagement.repository;

import com.nashtech.rookies.AssetManagement.model.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RolesRepository extends JpaRepository<Roles, Integer> {
    Roles getRolesById(int id);
    Roles findByName(String name);
    @Override
    @Query("select r from Roles r")
    List<Roles> findAll();

}
