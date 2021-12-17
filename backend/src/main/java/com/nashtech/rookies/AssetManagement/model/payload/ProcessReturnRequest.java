package com.nashtech.rookies.AssetManagement.model.payload;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ProcessReturnRequest {
    Long requestId;
    String userId;
}
