package com.nashtech.rookies.AssetManagement.controller;

import com.nashtech.rookies.AssetManagement.model.dto.LocationDTO;
import com.nashtech.rookies.AssetManagement.model.dto.UserDTO;
import com.nashtech.rookies.AssetManagement.model.dto.UsersDTO;
import com.nashtech.rookies.AssetManagement.model.payload.ChangePasswordRequest;
import com.nashtech.rookies.AssetManagement.model.payload.DisableRequest;
import com.nashtech.rookies.AssetManagement.model.payload.UserListPopup;
import com.nashtech.rookies.AssetManagement.service.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/v1/user")
@Tag(name = "Users")
public class UsersController {
    private UsersService usersService;

    @Autowired
    public void setUsersService(UsersService usersService) {
        this.usersService = usersService;
    }

    @PutMapping(value = "/password",
            produces = {"application/json"})
    public ResponseEntity<Object> changePassword(@RequestBody ChangePasswordRequest request) {
        usersService.changePassword(request.getOldPass(), request.getNewPass(), request.getUserId());
        Map<String, String> body = new HashMap<>();
        body.put("msg", "success");
        return new ResponseEntity<Object>(body, HttpStatus.OK);
    }

    @PostMapping
    public UsersDTO addNewUser(@RequestBody UsersDTO usersDTO) {
        return usersService.addNewUser(usersDTO);
    }

    @GetMapping("/edit/{id}")
    public UsersDTO getUserInfoById(@PathVariable("id") String id) {
        return new UsersDTO(usersService.getUserById(id));
    }

    @PutMapping()
    public UsersDTO editUser(@RequestBody UsersDTO usersDTO) {
        return usersService.editUser(usersDTO);
    }

    @DeleteMapping
    public ResponseEntity<String> disableUserByStaffCode(@RequestBody DisableRequest target) {
        return ResponseEntity.ok(usersService.disableUser(target.getStaffCode()));
    }

    @PostMapping("/validation")
    public ResponseEntity<Boolean> validUserByStaffCode(@RequestBody DisableRequest target) {
        return ResponseEntity.ok(usersService.validDisableUser(target.getStaffCode()));
    }


    @Operation(description = "Load all user on same location with administrators aslo filter and search",
            responses = {@ApiResponse(content = @Content(array = @ArraySchema(schema = @Schema(implementation = UserDTO.class))), responseCode = "200")
            })
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE, value = "/filterView/v2")
    public ResponseEntity<HashMap<String, Object>> filterAndSearchVersionTwo(@RequestParam(value = "filerRoles", required = true) String filerRoles,
                                                                             @RequestParam(name = "locationId") long id,
                                                                             @RequestParam(name = "keyword", required = true) String keyword,
                                                                             @RequestParam("pageNum") int index,
                                                                             @RequestParam("sortBy") String sortRule) {
        LocationDTO locationDTO = new LocationDTO();
        locationDTO.setId(id);
        if (keyword.trim().equals("") || keyword.isEmpty() || keyword.length() == 0) {
            keyword = "";
        }
        return ResponseEntity.ok(usersService.getUserListVersionTwo(locationDTO, keyword.toLowerCase(), index - 1, sortRule, filerRoles));
    }

    @GetMapping("/available/{location_id}")
    public ResponseEntity<List<UserListPopup>> getAvailable(@PathVariable int location_id) {
        return new ResponseEntity<>(usersService.getAvailable(location_id), HttpStatus.OK);
    }

    @GetMapping("/{username}")
    public ResponseEntity<String> getId(@PathVariable String username) {
        return new ResponseEntity<>(usersService.getUserId(username), HttpStatus.OK);
    }

    @GetMapping("/popup")
    public ResponseEntity<HashMap<String,Object>> getPopUpForUser(@RequestParam(name = "locationId") long id,
                                                         @RequestParam(name = "keyword", required = true) String keyword,
                                                         @RequestParam("pageNum") int index,
                                                         @RequestParam("sortBy") String sortRule) {
        if(keyword == null || keyword.trim().isEmpty()){
            keyword = "";
        }
        return new ResponseEntity<>(usersService.getUserDTOForPopup(id,keyword.toLowerCase(),index,sortRule),HttpStatus.OK);
    }

}