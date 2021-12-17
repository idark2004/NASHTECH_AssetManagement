package com.nashtech.rookies.AssetManagement.model.dto;

import com.nashtech.rookies.AssetManagement.model.enums.EAssignState;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDTO {
    private Long id;
    private String assignee;
    private String assigneeId;
    private String assigner;
    private Date assignedDate;
    private String assetCode;
    private String assetName;
    private EAssignState state;
    private String note;
    private String specification;
    private String categoryName;
    private String fullName;
    private boolean requested;
}
