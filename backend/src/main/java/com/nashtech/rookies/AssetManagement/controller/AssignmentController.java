package com.nashtech.rookies.AssetManagement.controller;

import com.nashtech.rookies.AssetManagement.exception.NumberErrorException;
import com.nashtech.rookies.AssetManagement.model.dto.AssignmentDTO;
import com.nashtech.rookies.AssetManagement.model.entity.Assignments;
import com.nashtech.rookies.AssetManagement.model.entity.Users;
import com.nashtech.rookies.AssetManagement.model.payload.EditAssignmentRequest;
import com.nashtech.rookies.AssetManagement.service.AssignmentService;
import com.nashtech.rookies.AssetManagement.model.payload.CreateAssignmentRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/assignment")
@Tag(name = "Assignment")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @GetMapping("")
    public HashMap<String, Object> getListAssignment(
            @RequestParam(defaultValue = "1") long locationId,
            @RequestParam(required = false, defaultValue = "1") int pageNumber,
            @RequestParam(required = false, defaultValue = "assetCode") String sort,
            @RequestParam(required = false, defaultValue = "0") int direction,
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "all") String filterState,
            @RequestParam(required = false) Date filterDate
    ) {
        if (pageNumber < 1) {
            throw new NumberErrorException("Page Number must be greater than 0");
        }
        if (direction != 0 && direction != 1) {
            throw new NumberErrorException("Direction must be either 0 or 1");
        }
        return assignmentService.getListAssignment(
                locationId,
                pageNumber - 1,
                sort,
                direction,
                keyword,
                filterState,
                filterDate
        );
    }

    @GetMapping("/{assetCode}")
    public List<AssignmentDTO> getAssetHistoryAssignment(@PathVariable(name = "assetCode") String assetCode) {
        return assignmentService.getAssetHistoryAssignment(assetCode);
    }

    @GetMapping("/user/{userId}")
    public List<AssignmentDTO> getUserAssignments(@PathVariable(name = "userId") String userId) {
        return assignmentService.getUserAssignments(userId);
    }

    @GetMapping("/info/{id}")
    public AssignmentDTO getAssignmentInfo(@PathVariable(name = "id") long id) {
        System.out.println("AC 71");
        return assignmentService.getAssignmentInfo(id);
    }

    @PostMapping("/new")
    public ResponseEntity<AssignmentDTO> createNew(@RequestBody CreateAssignmentRequest request) {
        return new ResponseEntity<>(assignmentService.createNew(request), HttpStatus.CREATED);
    }

    @PutMapping
    public AssignmentDTO editAssignment(@RequestBody EditAssignmentRequest editAssignmentRequest) {
        return assignmentService.editAssignment(editAssignmentRequest);
    }

    @DeleteMapping("/{id}")
    public HashMap<String, Object> deleteAssignment(@PathVariable(name = "id") Long assignmentId) {
        return assignmentService.deleteAssignment(assignmentId);
    }

    @GetMapping("/test")
    public List<String> getOrderedList(@RequestParam(value = "filerRoles", required = true) String filerRoles,
                                       @RequestParam(name = "locationId") long id,
                                       @RequestParam(name = "keyword", required = true) String keyword,
                                       @RequestParam("pageNum") int index,
                                       @RequestParam("sortBy") String sortRule) {
        return assignmentService.getOrderdAssignments(keyword, sortRule, index).stream().map(assignments -> {
            return assignments.getAssignee().getUsername();
        }).collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public HashMap<String, String> responseAssignment(
            @PathVariable(name = "id") Long assignCode,
            @RequestParam(required = true) String state) {
        return assignmentService.responseAssignment(assignCode, state);
    }
}
