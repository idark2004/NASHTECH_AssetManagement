package com.nashtech.rookies.AssetManagement.model.payload;

import com.nashtech.rookies.AssetManagement.model.enums.EAssetState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditAssetRequest {
    private String assetCode;
    private String assetName;
    private String specification;
    private Date installedDate;
    private EAssetState state;
}
