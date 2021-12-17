package com.nashtech.rookies.AssetManagement.service.Impl;

import com.nashtech.rookies.AssetManagement.config.Config;
import com.nashtech.rookies.AssetManagement.exception.*;
import com.nashtech.rookies.AssetManagement.model.dto.AssignmentDTO;
import com.nashtech.rookies.AssetManagement.model.entity.Assets;
import com.nashtech.rookies.AssetManagement.model.entity.Assignments;
import com.nashtech.rookies.AssetManagement.model.entity.Users;
import com.nashtech.rookies.AssetManagement.model.enums.EAssetState;
import com.nashtech.rookies.AssetManagement.model.enums.EAssignState;
import com.nashtech.rookies.AssetManagement.model.payload.CreateAssignmentRequest;
import com.nashtech.rookies.AssetManagement.model.payload.EditAssignmentRequest;
import com.nashtech.rookies.AssetManagement.repository.*;
import com.nashtech.rookies.AssetManagement.service.AssignmentService;
import com.nashtech.rookies.AssetManagement.utils.Util;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import static com.nashtech.rookies.AssetManagement.model.enums.EAssetState.ASSIGNED;
import static com.nashtech.rookies.AssetManagement.model.enums.EAssetState.AVAILABLE;
import static com.nashtech.rookies.AssetManagement.model.enums.EAssignState.*;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    @Autowired
    private AssignmentsRepository assignmentsRepository;
    private LocationsRepository locationsRepository;
    private AssetRepository assetRepository;
    private UsersRepository usersRepository;
    private RequestRepository requestRepository;

    @Autowired
    public void setRequestRepository(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @Autowired
    public void setAssignmentsRepository(AssignmentsRepository assignmentsRepository) {
        this.assignmentsRepository = assignmentsRepository;
    }

    @Autowired
    public void setLocationsRepository(LocationsRepository locationsRepository) {
        this.locationsRepository = locationsRepository;
    }

    @Autowired
    public void setAssetRepository(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Autowired
    public void setUsersRepository(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public List<Assignments> getAssignmentByAssigner(Users assigner) {
        return assignmentsRepository.findAssignmentsByAssigner(assigner).orElse(new ArrayList<>());
    }

    @Override
    public List<Assignments> getAssignmentForAssignee(Users assignee) {
        Optional<List<Assignments>> assignmentsListOptional = assignmentsRepository.getAssignmentsByAssignee(assignee);
        return assignmentsListOptional.orElse(new ArrayList<>());
    }

    private Assignments getAssignmentById(long id) {
        return assignmentsRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Assignment " + id + " not found!"));
    }

    @Override
    public AssignmentDTO getAssignmentInfo(long id) {
        return convertToDto(getAssignmentById(id));
    }

    @Override
    public List<AssignmentDTO> getUserAssignments(String userId) {
        //get current date value
        Date currentDate = Date.valueOf(LocalDate.now());
        List<Assignments> assignments = assignmentsRepository.getAssignmentsByUserId(userId, currentDate);
        return assignments
                .stream()
                .map(this::convertToDto)
                .filter((assignment) -> assignment.getState() != DECLINED)
                .collect(Collectors.toList());
    }

    private AssignmentDTO convertToDto(Assignments assignments) {
        AssignmentDTO dto = new AssignmentDTO();
        dto.setAssignee(assignments.getAssignee().getUsername());
        dto.setAssigner(assignments.getAssigner().getUsername());
        dto.setAssigneeId(assignments.getAssignee().getId());
        dto.setAssignedDate(assignments.getAssignedDate());
        dto.setAssetCode(assignments.getAsset().getAssetCode());
        dto.setNote(assignments.getNote());
        dto.setState(assignments.getState());
        dto.setId(assignments.getId());
        dto.setCategoryName(assignments.getAsset().getCategory().getName());
        dto.setAssetName(assignments.getAsset().getName());
        dto.setSpecification(assignments.getAsset().getSpecification());
        dto.setFullName(assignments.getAssignee().getLastName() + " " + assignments.getAssignee().getFirstName());
        if(requestRepository.findRequestsByAssignmentId(assignments.getId()) !=null){
            dto.setRequested(true);
        }else{
            dto.setRequested(false);
        }
        return dto;
    }

    public HashMap<String, Object> getListAssignment(long locationId,
                                                     int pageNumber,
                                                     String sort,
                                                     int direction,
                                                     String keyword,
                                                     String filterState,
                                                     Date filterDate) {
        keyword = keyword.toLowerCase();
        locationsRepository
                .findById(locationId)
                .orElseThrow(() -> new NotFoundException("Location Id was not exist"));

        Page<Assignments> list;
        Pageable page = PageRequest.of(pageNumber, Config.pageSize);

        if (filterState.equalsIgnoreCase("all")) {
            if (filterDate == null) {
                //list = assignmentsRepository.filterAllByLocation(locationId, keyword, page);
                switch (sort) {
                    case "assetCode": {
                        list = assignmentsRepository.filterAllByLocationSortByAssetCode(locationId, keyword, page);
                        break;
                    }
                    case "assetName": {
                        list = assignmentsRepository.filterAllByLocationSortByAssetName(locationId, keyword, page);
                        break;
                    }
                    case "assignee": {
                        list = assignmentsRepository.filterAllByLocationSortByAssigneeName(locationId, keyword, page);
                        break;
                    }
                    case "assigner": {
                        list = assignmentsRepository.filterAllByLocationSortByAssignerName(locationId, keyword, page);
                        break;
                    }
                    default: {
                        page = Util.pageableCreator(pageNumber, Config.pageSize, sort);
                        list = assignmentsRepository.filterAllByLocation(locationId, keyword, page);
                        break;
                    }
                }
            } else {
                switch (sort) {
                    case "assetCode": {
                        list = assignmentsRepository.filterAllByLocationAndDateSortByAssetCode(locationId, filterDate, keyword, page);
                        break;
                    }
                    case "assetName": {
                        list = assignmentsRepository.filterAllByLocationAndDateSortByAssetName(locationId, filterDate, keyword, page);
                        break;
                    }
                    case "assignee": {
                        list = assignmentsRepository.filterAllByLocationAndDateSortByAssigneeName(locationId, filterDate, keyword, page);
                        break;
                    }
                    case "assigner": {
                        list = assignmentsRepository.filterAllByLocationAndDateSortByAssignerName(locationId, filterDate, keyword, page);
                        break;
                    }
                    default: {
                        page = Util.pageableCreator(pageNumber, Config.pageSize, sort);
                        list = assignmentsRepository.filterAllByLocation(locationId, keyword, page);
                        break;
                    }
                }
            }
        } else {
            List<EAssignState> listFilter = Arrays.asList(filterState.split(","))
                    .stream()
                    .map(EAssignState::valueOf)
                    .collect(Collectors.toList());
            System.out.println();
            if (filterDate != null) {
                //list = assignmentsRepository.filterAllByLocationAndState(locationId, listFilter, keyword, page);
                System.out.println("Filter State: " + filterState);
                String sortField = sort;
                switch (sortField) {
                    case "assetCode": {
                        list = assignmentsRepository.filterAllByLocationAndStateAndDateSortByAssetCodeOrder(locationId, listFilter, filterDate, keyword, page);
                        break;
                    }
                    case "assetName": {
                        list = assignmentsRepository.filterAllByLocationAndStateAndDateSortByAssetName(locationId, listFilter, filterDate, keyword, page);
                        break;
                    }
                    case "assignee": {
                        list = assignmentsRepository.filterAllByLocationAndStateAndDateSortByAsigneeOrder(locationId, listFilter, filterDate, keyword, page);
                        break;
                    }
                    case "assigner": {
                        list = assignmentsRepository.filterAllByLocationAndStateAndDateSortByAsignerOrder(locationId, listFilter, filterDate, keyword, page);
                        break;
                    }
                    default: {
                        page = Util.pageableCreator(pageNumber, Config.pageSize, sort);
                        list = assignmentsRepository.filterAllByLocationAndStateAndDate(locationId, listFilter, filterDate, keyword, page);
                        break;
                    }
                }
            } else {
                switch (sort) {
                    case "assetCode": {
                        list = assignmentsRepository.filterAllByLocationAndStateSortByAssetCode(locationId, listFilter, keyword, page);
                        break;
                    }
                    case "assetName": {
                        list = assignmentsRepository.filterAllByLocationAndStateSortByAssetName(locationId, listFilter, keyword, page);
                        break;
                    }
                    case "assignee": {
                        list = assignmentsRepository.filterAllByLocationAndStateSortByAssigneeName(locationId, listFilter, keyword, page);
                        break;
                    }
                    case "assigner": {
                        list = assignmentsRepository.filterAllByLocationAndStateSortByAssignerName(locationId, listFilter, keyword, page);
                        break;
                    }
                    default: {
                        page = Util.pageableCreator(pageNumber, Config.pageSize, sort);
                        list = assignmentsRepository.filterAllByLocationAndState(locationId, listFilter, keyword, page);
                        break;
                    }
                }
            }
        }

        List<AssignmentDTO> listAssignment = list.getContent()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        HashMap<String, Object> response = new HashMap<>();
        response.put("totalPages", list.getTotalPages());
        response.put("pageSize", list.getSize());
        response.put("currentPage", list.getNumber() + 1);
        response.put("minDate", 0);
        response.put("data", listAssignment);

        return response;
    }

    @Override
    public List<AssignmentDTO> getAssetHistoryAssignment(String assetCode) {
        assetRepository.findById(assetCode).orElseThrow(
                () -> new NotFoundException("Asset Code was not exist")
        );

        List<Assignments> listAssignment = assignmentsRepository.findAllByAsset_AssetCode(assetCode);
        return listAssignment.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentDTO createNew(CreateAssignmentRequest request) {
        Users assignee = usersRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + request.getAssigneeId()));
        Users assigner = usersRepository.findById(request.getAssignerId())
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + request.getAssignerId()));
        Assets assets = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new NotFoundException("No asset found with id: " + request.getAssetId()));
        if (!assets.getState().equals(AVAILABLE)) {
            throw new AssetStateException("Cannot assign asset");
        }
        if (LocalDate.parse(request.getAssignedDate().toString()).isBefore(LocalDate.now())) {
            throw new DateException("Only current or future date for Assigned Date.");
        }
        Assignments assignments = new Assignments();
        assignments.setId((long) (assignmentsRepository.getLatestId() + 1));
        assignments.setAssignee(assignee);
        assignments.setAssigner(assigner);
        assignments.setAsset(assets);
        assignments.setAssignedDate(request.getAssignedDate());
        assignments.getAsset().setState(ASSIGNED);
        assignments.setNote(request.getNote());
        assignments.setState(WAITING_FOR_ACCEPTANCE);
        assignmentsRepository.save(assignments);
        return this.convertToDto(assignments);
    }

    private void validateAssignmentRequest(EditAssignmentRequest editAssignmentRequest) {
        //current or future date for assign date only
        if (LocalDate.parse(editAssignmentRequest.getAssignedDate().toString()).isBefore(LocalDate.now())) {
            throw new DateException("Assigned date cannot be a date in the past!");
        }
        //note max length == 400
        if (editAssignmentRequest.getNote().length() > 400) {
            throw new StringLengthException("Note length cannot be longer than 400 characters!");
        }
    }

    public AssignmentDTO editAssignment(EditAssignmentRequest editAssignmentRequest) {
        //verify assignment req fields
        validateAssignmentRequest(editAssignmentRequest);
        //get old assignment info using assignmentId
        Assignments oldAssignmentInfo = getAssignmentById(editAssignmentRequest.getAssignmentId());
        //if state != "waiting for acceptance" -> decline
        if (oldAssignmentInfo.getState() != WAITING_FOR_ACCEPTANCE) {
            throw new InvalidFieldException("Only assignments with WAITING_FOR_ACCEPTANCE state are allowed!");
        }
        String newAssigneeId = editAssignmentRequest.getAssigneeId();
        String oldAssigneeId = oldAssignmentInfo.getAssignee().getId();
        String newAssetCode = editAssignmentRequest.getAssetCode();
        String oldAssetCode = oldAssignmentInfo.getAsset().getAssetCode();
        //if assignee change -> get new assignee from db
        if (!newAssigneeId.equals(oldAssigneeId)) {
            Users newAssignee = usersRepository
                    .findById(newAssigneeId)
                    .orElseThrow(() ->
                            new NotFoundException("User " + newAssigneeId + " cannot be found!"));
            // if new assignee is active = false -> throw exception
            if (!newAssignee.isActive()) {
                throw new InvalidFieldException("User must be active!");
            }
            oldAssignmentInfo.setAssignee(newAssignee);
        }
        //change state of edited asset
        //if user does not change asset (same assetId), keep the state
        //else assigned -> available and vice versa for the new asset
        if (!newAssetCode.equals(oldAssetCode)) {
            Assets newAsset = assetRepository
                    .findById(newAssetCode)
                    .orElseThrow(() ->
                            new NotFoundException("Asset " + newAssetCode + " cannot be found!"));
            //check if new asset is available
            if (!newAsset.getState().equals(AVAILABLE)) {
                throw new AssetStateException("Only asset with available state can be selected!");
            }
            newAsset.setState(ASSIGNED);
            oldAssignmentInfo.getAsset().setState(AVAILABLE);
            oldAssignmentInfo.setAsset(newAsset);
        }
        //change assigner according to assignerId in req
        Users newAssigner = usersRepository
                .findById(editAssignmentRequest.getAssignerId())
                .orElseThrow(() ->
                        new NotFoundException("User " + editAssignmentRequest.getAssignerId() + " cannot be found!"));
        //check if assigner is not an Admin, throw err
        if (newAssigner.getRoles().getId() != 1) {
            throw new InvalidFieldException("Only Admins can assign assignments to others!");
        }
        //update/replace old info with the new ones
        oldAssignmentInfo.setAssigner(newAssigner);
        oldAssignmentInfo.setAssignedDate(editAssignmentRequest.getAssignedDate());
        oldAssignmentInfo.setNote(editAssignmentRequest.getNote());

        return convertToDto(assignmentsRepository.save(oldAssignmentInfo));
    }

    @Override
    public HashMap<String, Object> deleteAssignment(Long assignmentId) {
        Assignments assignments = assignmentsRepository.findById(assignmentId)
                .orElseThrow(() -> new NotFoundException("Assignment id was not found"));

        HashMap<String, Object> response = new HashMap<>();
        String message = "Delete success";
        HttpStatus status = HttpStatus.OK;

        switch (assignments.getState()) {
            case DECLINED:
            case WAITING_FOR_ACCEPTANCE:
                assignmentsRepository.deleteById(assignmentId);
                break;
            default:
                message = "You can't not delete this assignments. " +
                        "It just allow to delete assignment that " +
                        "has state of DECLINE OR WAITING_FOR_ACCEPTANCE";
                status = HttpStatus.BAD_REQUEST;
                break;
        }

        response.put("message", message);
        response.put("status", status);
        return response;
    }

    @Override
    public List<Assignments> getOrderdAssignments(String keyword, String sortBy, int index) {
        Pageable pageable = PageRequest.of(1, Config.pageSize);
        return assignmentsRepository.filterAllByLocationAndStateOrderByAssigneeUserName(keyword, sortBy, pageable).getContent();
    }

    @Override
    public HashMap<String, String> responseAssignment(Long assignCode, String state) {
        String message = "";
        HttpStatus status = HttpStatus.OK;
        HashMap<String, String> response = new HashMap<>();

        Assignments assignment = assignmentsRepository.findById(assignCode)
                .orElseThrow(() -> new NotFoundException("Assignment id was not found"));
        Assets asset = assetRepository.findById(assignment.getAsset().getAssetCode())
                .orElseThrow(() -> new NotFoundException("Asset id was not found"));

        switch (assignment.getState()) {
            case ACCEPTED:
            case DECLINED:
                if (state.equalsIgnoreCase(WAITING_FOR_ACCEPTANCE.name())) {
                    assignment.setState(WAITING_FOR_ACCEPTANCE);
                    asset.setState(ASSIGNED);
                    message = assignment.getState().name();
                } else {
                    message = "This assignment was already " + assignment.getState().name();
                    status = HttpStatus.NOT_ACCEPTABLE;
                }
                break;
            case WAITING_FOR_ACCEPTANCE:
                if (state.equalsIgnoreCase(ACCEPTED.name())) {
                    assignment.setState(ACCEPTED);
                    asset.setState(ASSIGNED);
                } else if (state.equalsIgnoreCase(DECLINED.name())) {
                    assignment.setState(DECLINED);
                    asset.setState(AVAILABLE);
                }
                break;
            default:
                message = "Assignment state does not exist";
                status = HttpStatus.BAD_REQUEST;
        }

        if (status == HttpStatus.OK) {
            assignmentsRepository.save(assignment);
            assetRepository.save(asset);
        }

        response.put("message", message);
        response.put("status", status.name());

        return response;
    }
}
