package com.nashtech.rookies.AssetManagement.controller;

import com.nashtech.rookies.AssetManagement.model.dto.RequestDTO;
import com.nashtech.rookies.AssetManagement.model.payload.ProcessReturnRequest;
import com.nashtech.rookies.AssetManagement.model.payload.ReturnAssetRequest;
import com.nashtech.rookies.AssetManagement.repository.hibernate.ReturnRequestDAO;
import com.nashtech.rookies.AssetManagement.service.ReturnRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
@RestController
@RequestMapping("api/v1/request")
public class ReturnRequestController {
    private ReturnRequestService returnRequestService;
    private ReturnRequestDAO returnRequestDAO;

    @Autowired
    public void setReturnRequestService(ReturnRequestService returnRequestService) {
        this.returnRequestService = returnRequestService;
    }

    @Autowired
    public void setReturnRequestDAO(ReturnRequestDAO returnRequestDAO) {
        this.returnRequestDAO = returnRequestDAO;
    }

    @PostMapping
    public ResponseEntity<RequestDTO> makeReturnRequest(@RequestBody ReturnAssetRequest request){
        return ResponseEntity.ok(returnRequestService.createReturnRequest(request));
    }

    @PutMapping("/complete")
    public ResponseEntity<String> processReturnRequest(@RequestBody ProcessReturnRequest request){
        boolean status = returnRequestService.processRequest(request,"complete");
        if(status){
            return  new ResponseEntity<>("Request completed successfully!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unable to complete request",HttpStatus.BAD_REQUEST);
    }
    @DeleteMapping("/cancel")
    public ResponseEntity<String> processCancelRequest(@RequestBody ProcessReturnRequest request){
        boolean status = returnRequestService.processRequest(request,"cancel");
        if(status){
            return  new ResponseEntity<>("Request cancel successfully!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unable to cancel request",HttpStatus.BAD_REQUEST);
    }

    @GetMapping
    public ResponseEntity<Object> loadReturnRequest(@RequestParam("locationId") Long locationId,
                                                    @RequestParam("keyword") String keyword,
                                                    @RequestParam("filterState") String filterState,
                                                    @RequestParam(value = "returnedDate",defaultValue = "all")String  date,
                                                    @RequestParam("sortBy")String sortBy,
                                                    @RequestParam("pageNum") int pageNum){
        return ResponseEntity.ok(returnRequestService.getReturnRequest(locationId,keyword,filterState,date,sortBy,pageNum-1));
    }

    @GetMapping("testing")
    public ResponseEntity<Object> loadReturnRequestTest(@RequestParam("locationId") Long locationId,
                                                    @RequestParam("keyword") String keyword,
                                                    @RequestParam("filterState") String filterState,
                                                    @RequestParam(name ="returnedDate",required = false, defaultValue = "ALL") String date,
                                                    @RequestParam("sortBy")String sortBy,
                                                    @RequestParam("pageNum") int pageNum){
        if(date.equalsIgnoreCase("all")){
            return ResponseEntity.ok(returnRequestDAO.searchAndFilterByState(locationId,keyword,filterState,sortBy,pageNum-1));
        }
        return ResponseEntity.ok(returnRequestDAO.searchAndFilterStateAndReturnedDate(locationId,keyword,filterState,date,pageNum-1,sortBy));
    }
}
