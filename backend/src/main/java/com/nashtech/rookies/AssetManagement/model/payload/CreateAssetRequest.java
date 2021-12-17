package com.nashtech.rookies.AssetManagement.model.payload;

import com.nashtech.rookies.AssetManagement.model.enums.EAssetState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

//Class for receiving data
@NoArgsConstructor
@Data
@AllArgsConstructor
public class CreateAssetRequest {
    private String name;
    private String prefix;
    private String specification;
    private Date installedDate;
    private EAssetState state;
    private long locationId;
}
