package com.nashtech.rookies.AssetManagement.controller;

import com.nashtech.rookies.AssetManagement.exception.NumberErrorException;
import com.nashtech.rookies.AssetManagement.model.dto.AssetDTO;
import com.nashtech.rookies.AssetManagement.model.dto.AssetListPopup;
import com.nashtech.rookies.AssetManagement.model.dto.ReportDTO;
import com.nashtech.rookies.AssetManagement.model.payload.CreateAssetRequest;
import com.nashtech.rookies.AssetManagement.model.payload.EditAssetRequest;
import com.nashtech.rookies.AssetManagement.service.AssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/asset")
@Tag(name = "Asset")
public class AssetController {

    @Autowired
    private AssetService assetService;

    //create new asset
    @PostMapping("/new")
    @Operation(description = "Create new asset")
    public ResponseEntity<AssetDTO> addNew(@RequestBody CreateAssetRequest request) {
        AssetDTO response = assetService.addNew(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    //edit asset
    @PutMapping("/edit")
    @Operation(description = "Edit existing asset")
    public ResponseEntity<AssetDTO> edit(@RequestBody EditAssetRequest request){
        AssetDTO response = assetService.edit(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(description = "Delete/disable existing asset")
    public HashMap<String, Object> deleteAsset(
            @PathVariable(name = "id") String assetCode,
            @RequestParam() Long locationId
    ) {
        return assetService.deleteAsset(assetCode, locationId);
    }

    @GetMapping()
    @Operation(description = "Get asset list")
    public HashMap<String, Object> getListAsset(
            @RequestParam(defaultValue = "1") long locationId,
            @RequestParam(required = false, defaultValue = "1") int pageNumber,
            @RequestParam(required = false, defaultValue = "assetCode") String sort,
            @RequestParam(required = false, defaultValue = "0") int direction,
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "all") String filterState,
            @RequestParam(required = false, defaultValue = "") List<String> filterCategory
    ) {
        if (pageNumber < 1) {
            throw new NumberErrorException("Page Number must be greater than 0");
        }
        if (direction != 0 && direction != 1) {
            throw new NumberErrorException("Direction must be either 0 or 1");
        }
        return assetService.getListAsset(
                locationId,
                pageNumber - 1,
                sort,
                direction,
                keyword.toLowerCase(),
                filterState,
                filterCategory);
    }

    @GetMapping("/available/{location_id}")
    @Operation(description = "Get list of available asset")
    public ResponseEntity<List<AssetListPopup>> getAvailable(@PathVariable int location_id){
        return new ResponseEntity<>(assetService.getAvailable(location_id),HttpStatus.OK);
    }

    @GetMapping("/report/{location_id}")
    public ResponseEntity<List<ReportDTO>> getReport(@PathVariable int location_id){
        return new ResponseEntity<>(assetService.getReport(location_id),HttpStatus.OK);
    }
}
