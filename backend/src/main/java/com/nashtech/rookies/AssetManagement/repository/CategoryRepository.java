package com.nashtech.rookies.AssetManagement.repository;

import com.nashtech.rookies.AssetManagement.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category,String> {

    @Query(value = "SELECT COUNT(c) FROM Category c WHERE c.name = ?1")
    int getRowsByName(String s);

    @Query(value = "SELECT COUNT(c) FROM Category c WHERE c.prefix = ?1")
    int getRowsByPrefix(String s);
}
