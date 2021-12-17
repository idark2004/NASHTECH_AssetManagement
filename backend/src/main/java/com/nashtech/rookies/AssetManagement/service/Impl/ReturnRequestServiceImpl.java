package com.nashtech.rookies.AssetManagement.service.Impl;

import com.nashtech.rookies.AssetManagement.config.Config;
import com.nashtech.rookies.AssetManagement.exception.AssignmentNotFoundException;
import com.nashtech.rookies.AssetManagement.exception.InvalidReturnRequestException;
import com.nashtech.rookies.AssetManagement.exception.RequestNotFoundException;
import com.nashtech.rookies.AssetManagement.exception.UserNotFoundException;
import com.nashtech.rookies.AssetManagement.model.dto.RequestDTO;
import com.nashtech.rookies.AssetManagement.model.entity.Assignments;
import com.nashtech.rookies.AssetManagement.model.entity.Requests;
import com.nashtech.rookies.AssetManagement.model.entity.Users;
import com.nashtech.rookies.AssetManagement.model.enums.EAssetState;
import com.nashtech.rookies.AssetManagement.model.enums.EAssignState;
import com.nashtech.rookies.AssetManagement.model.enums.ERequestState;
import com.nashtech.rookies.AssetManagement.model.payload.ProcessReturnRequest;
import com.nashtech.rookies.AssetManagement.model.payload.ReturnAssetRequest;
import com.nashtech.rookies.AssetManagement.repository.AssignmentsRepository;
import com.nashtech.rookies.AssetManagement.repository.RequestRepository;
import com.nashtech.rookies.AssetManagement.repository.UsersRepository;
import com.nashtech.rookies.AssetManagement.repository.hibernate.ReturnRequestDAO;
import com.nashtech.rookies.AssetManagement.service.ReturnRequestService;
import com.nashtech.rookies.AssetManagement.utils.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReturnRequestServiceImpl implements ReturnRequestService {
    private AssignmentsRepository assignmentsRepository;
    private UsersRepository userRepo;
    private RequestRepository repository;
    private ReturnRequestDAO returnRequestDAO;
    @Autowired
    public void setAssignmentsRepository(AssignmentsRepository assignmentsRepository) {
        this.assignmentsRepository = assignmentsRepository;
    }

    @Autowired
    public void setReturnRequestDAO(ReturnRequestDAO returnRequestDAO) {
        this.returnRequestDAO = returnRequestDAO;
    }

    @Autowired
    public void setUserRepo(UsersRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Autowired
    public void setRepository(RequestRepository repository) {
        this.repository = repository;
    }


    @Override
    public RequestDTO createReturnRequest(ReturnAssetRequest request) {
        Long assignmentId = request.getAssignmentId();
        Optional<Assignments> assignmentByIdOption = assignmentsRepository.findById(assignmentId);
        Assignments assignment = assignmentByIdOption.orElseThrow(() -> {
            throw new AssignmentNotFoundException("Assignment is not found with id: " + assignmentId);
        });
        Optional<Users> userByIdOptional = userRepo.findByUsername(request.getUsername());
        Users requester = userByIdOptional.orElseThrow(() -> {
            throw new UserNotFoundException("User is not found with username" + request.getUsername());
        });
        Requests requests;
        if (assignment.getState().equals(EAssignState.ACCEPTED) && requester.isActive()) {
            if (requester.getRoles().getName().equalsIgnoreCase("admin")
                    || assignment.getAssignee().getUsername().equalsIgnoreCase(requester.getUsername())) {
                Requests requestsByAssignment = repository.findRequestsByAssignmentId(assignment.getId());
                if(requestsByAssignment != null){
                    throw new InvalidReturnRequestException("This assignment already has another request, please complete or close it");
                }
                requests = new Requests();
                requests.setAssignmentId(assignmentId);
                requests.setAsset(assignment.getAsset());
                requests.setState(ERequestState.WAITING_FOR_RETURN);
                requests.setRequestBy(requester);
                requests.setAssignedDate(assignment.getAssignedDate());
                requests.setReturnedDate(null);
                repository.save(requests);
                return dtoConverter(requests);
            } else {
                throw new InvalidReturnRequestException("Requester must be assignee of assignment or admin");
            }
        } else {
            throw new InvalidReturnRequestException("Assignment of return request is not accepted");
        }
    }

    @Override
    public boolean processRequest(ProcessReturnRequest processRequest,String action) {
        Requests request = repository.findById(processRequest.getRequestId())
                .orElseThrow(() -> new RequestNotFoundException("No request found with id: " + processRequest.getRequestId()));
        Users users = userRepo.findById(processRequest.getUserId())
                .orElseThrow(() -> new UserNotFoundException("No user found with username: "+processRequest.getUserId()));
        Assignments assignments = assignmentsRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new AssignmentNotFoundException("No assignment found with id:" + request.getAssignmentId()));
        if (request.getState().equals(ERequestState.WAITING_FOR_RETURN) && users.getRoles().getName().equals("ADMIN")) {
            switch (action) {
                case "complete": {
                    request.setAcceptedBy(users);
                    request.setReturnedDate(Date.valueOf(LocalDate.now().toString()));
                    request.setState(ERequestState.COMPLETED);
                    request.getAsset().setState(EAssetState.AVAILABLE);
                    assignmentsRepository.delete(assignments);
                    repository.save(request);
                    return true;
                }
                case "cancel": {
                    repository.delete(request);
                    return true;
                }
            }
        } else {
            throw new InvalidReturnRequestException("Cannot perform this action");
        }
        return false;
    }

    @Override
    public HashMap<String, Object> getReturnRequest(long locationId, String keyword, String filterStateStr, String returnedDate, String sortBy, int index) {
//        Page<Requests> page;
//        Pageable pageable = Util.pageableCreator(index, Config.pageSize, sortBy);
//        if (filterStateStr.equalsIgnoreCase("all")) {
//            page = repository.searchOnly(locationId,pageable);
//        } else {
//            List<ERequestState> states = Arrays.stream(filterStateStr.split(","))
//                    .map(s -> ERequestState.valueOf(s))
//                    .collect(Collectors.toList());
//            if (returnedDate == null) {
//                page = repository.searchAndFilterState(locationId, keyword, states, pageable);
//            } else {
//                page = repository.searchAndFilterStateAndReturnedDate(keyword, states, returnedDate , pageable);
//            }
//        }
//        HashMap<String, Object> response = new HashMap<>();
//        response.put("totalPage", page.getTotalPages());
//        response.put("data", page.getContent().stream().map(ReturnRequestServiceImpl::dtoConverter).collect(Collectors.toList()));
//        return response;
        Pageable pageable = Util.pageableCreator(index,Config.pageSize,"id");
        List<?> result;
        Long page;
        List<ERequestState> states = Arrays.stream(filterStateStr.split(",")).map(s -> ERequestState.valueOf(s)).collect(Collectors.toList());
        if(returnedDate.equalsIgnoreCase("all") || returnedDate.trim().isEmpty()){

            return returnRequestDAO.searchAndFilterByState(locationId,keyword,filterStateStr,sortBy,index);
        }else{
            Date.valueOf(returnedDate);
           return returnRequestDAO.searchAndFilterStateAndReturnedDate(locationId,keyword,filterStateStr,returnedDate,index,sortBy);
        }
    }

    public static RequestDTO dtoConverter(Requests requests) {
        RequestDTO requestDTO = new RequestDTO();
        requestDTO.setRequester(requests.getRequestBy().getUsername());
        requestDTO.setAssetCode(requests.getAsset().getAssetCode());
        requestDTO.setAssetName(requests.getAsset().getName());
        requestDTO.setAssignedDate(requests.getAssignedDate());
        requestDTO.setId(requests.getId());
        requestDTO.setState(requests.getState());
        if(requests.getAcceptedBy() != null){
            requestDTO.setAccepter(requests.getAcceptedBy().getUsername());
        }
        requestDTO.setReturnedDate(requests.getReturnedDate());
        return requestDTO;
    }
}
