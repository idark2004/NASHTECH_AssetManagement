package com.nashtech.rookies.AssetManagement.model.payload;

import com.nashtech.rookies.AssetManagement.model.enums.EAssignState;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EditAssignmentRequest {
    private long assignmentId;
    private String assignerId;
    private String assigneeId;
    private String assetCode;
    private Date assignedDate;
    private String note;
}
