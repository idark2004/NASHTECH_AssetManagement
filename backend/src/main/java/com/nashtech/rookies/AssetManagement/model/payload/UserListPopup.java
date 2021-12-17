package com.nashtech.rookies.AssetManagement.model.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserListPopup {
    private String userId;
    private String fullName;
    private String username;
}
