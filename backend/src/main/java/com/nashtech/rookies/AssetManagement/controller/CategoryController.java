package com.nashtech.rookies.AssetManagement.controller;

import com.nashtech.rookies.AssetManagement.model.dto.CategoryDTO;
import com.nashtech.rookies.AssetManagement.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@Tag(name = "Category")
public class CategoryController {

    @Autowired
    private CategoryService service;

    @PostMapping("/new")
    public ResponseEntity<CategoryDTO> addNew(@RequestBody CategoryDTO dto){
        CategoryDTO addedDto = service.addNewCategory(dto.getPrefix(),dto.getName());
        return new ResponseEntity<>(addedDto,HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getList(){
        List<CategoryDTO> dtoList = service.getAll();
        return new ResponseEntity<>(dtoList,HttpStatus.OK);
    }
}
