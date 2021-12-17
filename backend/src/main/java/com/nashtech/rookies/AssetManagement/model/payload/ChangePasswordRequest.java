package com.nashtech.rookies.AssetManagement.model.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChangePasswordRequest {
    private String userId;
    private String oldPass;
    private String newPass;
}
