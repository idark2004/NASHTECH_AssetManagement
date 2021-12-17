package com.nashtech.rookies.AssetManagement.model.dto;

import com.nashtech.rookies.AssetManagement.model.enums.EAssetState;
import com.nashtech.rookies.AssetManagement.model.entity.Location;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssetDTO{
    private String assetCode;
    private String assetName;
    private String categoryName;
    private EAssetState state;
    private Long locationId;
    private String specification;
    private Date installedDate;
    private boolean hasAssignmentHistory;
}
