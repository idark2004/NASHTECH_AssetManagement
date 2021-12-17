package com.nashtech.rookies.AssetManagement.model.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAssignmentRequest {
    private String assigneeId;
    private String assignerId;
    private String assetId;
    private Date assignedDate;
    @Nullable
    private String note;
}
