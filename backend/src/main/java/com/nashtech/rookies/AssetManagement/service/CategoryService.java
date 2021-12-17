package com.nashtech.rookies.AssetManagement.service;

import com.nashtech.rookies.AssetManagement.model.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {
    CategoryDTO addNewCategory(String prefix, String name);
    List<CategoryDTO> getAll();
}
