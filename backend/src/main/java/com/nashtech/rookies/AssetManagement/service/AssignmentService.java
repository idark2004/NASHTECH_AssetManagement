package com.nashtech.rookies.AssetManagement.service;

import com.nashtech.rookies.AssetManagement.model.dto.AssignmentDTO;
import com.nashtech.rookies.AssetManagement.model.payload.EditAssignmentRequest;
import com.nashtech.rookies.AssetManagement.model.entity.Assignments;
import com.nashtech.rookies.AssetManagement.model.entity.Users;
import com.nashtech.rookies.AssetManagement.model.payload.CreateAssignmentRequest;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;

public interface AssignmentService {

    List<Assignments> getAssignmentForAssignee(Users assignee);

    List<Assignments> getAssignmentByAssigner(Users assigner);

    List<AssignmentDTO> getUserAssignments(String userId);

    public HashMap<String, Object> getListAssignment(long locationId,
                                                     int pageNumber,
                                                     String sort,
                                                     int direction,
                                                     String keyword,
                                                     String filterState,
                                                     Date filterDate);

    List<AssignmentDTO> getAssetHistoryAssignment(String assetCode);

    AssignmentDTO createNew(CreateAssignmentRequest request);

    AssignmentDTO editAssignment(EditAssignmentRequest editAssignmentRequest);

    HashMap<String, Object> deleteAssignment(Long assignmentId);

    List<Assignments> getOrderdAssignments(String keyword, String sortBy, int index);

    AssignmentDTO getAssignmentInfo(long id);

    HashMap<String, String> responseAssignment(Long assignCode, String state);

}
