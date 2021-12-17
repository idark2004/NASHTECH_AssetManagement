package com.nashtech.rookies.AssetManagement.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AssetListPopup {
    private String assetCode;
    private String assetName;
    private String category;
}
