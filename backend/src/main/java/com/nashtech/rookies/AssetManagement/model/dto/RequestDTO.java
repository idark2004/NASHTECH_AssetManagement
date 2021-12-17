package com.nashtech.rookies.AssetManagement.model.dto;

import com.nashtech.rookies.AssetManagement.model.enums.ERequestState;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestDTO {
    private Long id;
    private String assetCode;
    private String assetName;
    private String requester;
    private String accepter;
    private Date assignedDate;
    private Date returnedDate;
    private ERequestState state;
}
