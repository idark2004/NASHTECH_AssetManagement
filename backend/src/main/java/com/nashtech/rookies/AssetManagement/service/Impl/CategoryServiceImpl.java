package com.nashtech.rookies.AssetManagement.service.Impl;

import com.nashtech.rookies.AssetManagement.exception.*;
import com.nashtech.rookies.AssetManagement.model.dto.CategoryDTO;
import com.nashtech.rookies.AssetManagement.model.entity.Category;
import com.nashtech.rookies.AssetManagement.repository.CategoryRepository;
import com.nashtech.rookies.AssetManagement.service.CategoryService;
import com.nashtech.rookies.AssetManagement.utils.Util;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository cateRepo;

    private CategoryDTO entityToDTO(Category category){
        CategoryDTO dto = new CategoryDTO();
        dto.setName(category.getName());
        dto.setPrefix(category.getPrefix());
        return dto;
    }

    @Override
    public CategoryDTO addNewCategory(String prefix, String name) {
        if (name.length() < 1 || name.length() > 30){
            throw new StringLengthException("Name can only be from 1 to 30 characters");
        }
        if(Util.checkSpecialCharacters(name)){
            throw new SpecialCharacterException("Category name must contain only characters, numbers and whitespaces in between!");
        }
        if (prefix.length() < 1 || prefix.length() > 3){
            throw new StringLengthException("Prefix can only from 1 to 3 characters");
        }
        if(Util.checkSpecialCharactersAndSpace(prefix)){
            throw new SpecialCharacterException("Prefix must contain only characters and numbers!");
        }
        String formattedPrefix = prefix.toUpperCase();
        if(cateRepo.getRowsByName(name)>0){
            throw new DuplicateCategoryNameException();
        }
        if(cateRepo.getRowsByPrefix(formattedPrefix)>0){
            throw new DuplicateCategoryPrefixException();
        }
        Category cate = new Category();
        cate.setName(name);
        cate.setPrefix(formattedPrefix);
        cateRepo.save(cate);
        return this.entityToDTO(cate);
    }

    @Override
    public List<CategoryDTO> getAll(){
        List<Category> listCate = cateRepo.findAll();
        List<CategoryDTO> listDto = new ArrayList<>();
        for(Category cate : listCate){
            listDto.add(this.entityToDTO(cate));
        }
        return listDto;
    }
}
