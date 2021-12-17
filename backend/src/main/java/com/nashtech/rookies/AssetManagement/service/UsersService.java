package com.nashtech.rookies.AssetManagement.service;

import com.nashtech.rookies.AssetManagement.model.dto.LocationDTO;
import com.nashtech.rookies.AssetManagement.model.dto.UserDTO;
import com.nashtech.rookies.AssetManagement.model.dto.UsersDTO;
import com.nashtech.rookies.AssetManagement.model.entity.Users;
import com.nashtech.rookies.AssetManagement.model.payload.UserListPopup;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.HashMap;
import java.util.List;

public interface UsersService {
    void changePassword(String oldPass, String newPass, String userId);
    UsersDTO addNewUser(UsersDTO usersDTO);
    UsersDTO editUser(UsersDTO usersDTO);
    Users getUserById(String id);
    String disableUser(String staffCode) throws UsernameNotFoundException;
    List<UserListPopup> getAvailable(int location_id);
    String getUserId(String username);
    boolean validDisableUser(String staffCode) throws UsernameNotFoundException;
    HashMap<String,Object> getUserListVersionTwo(LocationDTO location, String keyword, int index, String sortRule, String filterRoles);
   HashMap<String,Object> getUserDTOForPopup(long locationId, String keyword, int index, String sortRule);
}
