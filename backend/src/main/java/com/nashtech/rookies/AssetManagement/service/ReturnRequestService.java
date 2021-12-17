package com.nashtech.rookies.AssetManagement.service;

import com.nashtech.rookies.AssetManagement.model.dto.RequestDTO;
import com.nashtech.rookies.AssetManagement.model.enums.ERequestState;
import com.nashtech.rookies.AssetManagement.model.payload.ProcessReturnRequest;
import com.nashtech.rookies.AssetManagement.model.payload.ReturnAssetRequest;

import java.util.Date;
import java.util.HashMap;

public interface ReturnRequestService {
    RequestDTO createReturnRequest(ReturnAssetRequest request);
    boolean processRequest(ProcessReturnRequest processRequest,String aciton);
    HashMap<String,Object> getReturnRequest(long locationId, String keyword, String filterStateStr, String returnedDate, String sortBy, int index);
}
