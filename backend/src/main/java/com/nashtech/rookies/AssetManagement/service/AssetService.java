package com.nashtech.rookies.AssetManagement.service;

import com.nashtech.rookies.AssetManagement.model.dto.AssetDTO;
import com.nashtech.rookies.AssetManagement.model.dto.AssetListPopup;
import com.nashtech.rookies.AssetManagement.model.dto.ReportDTO;
import com.nashtech.rookies.AssetManagement.model.payload.CreateAssetRequest;
import com.nashtech.rookies.AssetManagement.model.payload.EditAssetRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public interface AssetService {

    AssetDTO addNew(CreateAssetRequest request);

    HashMap<String, Object> deleteAsset(String assetCode, Long locationId);

    HashMap<String, Object> getListAsset(long locationId,
                                         int i,
                                         String sort,
                                         int direction,
                                         String keyword,
                                         String filterState,
                                         List<String> filterCategory);

    AssetDTO edit(EditAssetRequest request);

    List<AssetListPopup> getAvailable(int location_id);

    List<ReportDTO> getReport(int location_id);
}
