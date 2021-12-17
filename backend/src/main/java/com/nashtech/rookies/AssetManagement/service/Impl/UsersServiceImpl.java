package com.nashtech.rookies.AssetManagement.service.Impl;

import com.nashtech.rookies.AssetManagement.config.Config;
import com.nashtech.rookies.AssetManagement.exception.InvalidFieldException;
import com.nashtech.rookies.AssetManagement.exception.PasswordsNotMatchException;
import com.nashtech.rookies.AssetManagement.exception.StringLengthException;
import com.nashtech.rookies.AssetManagement.exception.UserNotFoundException;
import com.nashtech.rookies.AssetManagement.model.dto.LocationDTO;
import com.nashtech.rookies.AssetManagement.model.dto.UserDTO;
import com.nashtech.rookies.AssetManagement.model.dto.UsersDTO;
import com.nashtech.rookies.AssetManagement.model.entity.Assignments;
import com.nashtech.rookies.AssetManagement.model.entity.Location;
import com.nashtech.rookies.AssetManagement.model.entity.Roles;
import com.nashtech.rookies.AssetManagement.model.entity.Users;
import com.nashtech.rookies.AssetManagement.model.enums.EAssignState;
import com.nashtech.rookies.AssetManagement.model.enums.Gender;
import com.nashtech.rookies.AssetManagement.model.payload.UserListPopup;
import com.nashtech.rookies.AssetManagement.repository.LocationsRepository;
import com.nashtech.rookies.AssetManagement.repository.RolesRepository;
import com.nashtech.rookies.AssetManagement.repository.UsersRepository;
import com.nashtech.rookies.AssetManagement.security.UserDetailImpl;
import com.nashtech.rookies.AssetManagement.service.AssignmentService;
import com.nashtech.rookies.AssetManagement.service.UsersService;
import com.nashtech.rookies.AssetManagement.utils.UsersValidator;
import com.nashtech.rookies.AssetManagement.utils.Util;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UsersServiceImpl implements UsersService, UserDetailsService {
    UsersRepository usersRepository;
    BCryptPasswordEncoder passwordEncoder;
    RolesRepository rolesRepository;
    LocationsRepository locationsRepository;
    private ModelMapper mapper;
    private AssignmentService assignmentService;
    private Logger logger = LoggerFactory.getLogger(UsersServiceImpl.class);

    public static UserDTO convertDto(Users users) {
        UserDTO dto = new UserDTO();
        dto.setId(users.getId());
        dto.setUsername(users.getUsername());
        dto.setFirstName(users.getFirstName());
        dto.setLastName(users.getLastName());
        dto.setRole(users.getRoles().getName());
        dto.setGender(users.getGender().name());
        dto.setJoinDate(users.getJoinDate());
        dto.setDateOfBirth(users.getDateOfBirth());
        return dto;
    }

    @Autowired
    public void setUsersRepository(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Autowired
    public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    public void setRolesRepository(RolesRepository rolesRepository) {
        this.rolesRepository = rolesRepository;
    }

    @Autowired
    public void setLocationsRepository(LocationsRepository locationsRepository) {
        this.locationsRepository = locationsRepository;
    }

    @Autowired
    public void setMapper(ModelMapper mapper) {
        this.mapper = mapper;
    }

    @Autowired
    public void setAssignmentService(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = usersRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("No user found with username: " + username));
        return UserDetailImpl.build(user);
    }

    @Override
    public void changePassword(String oldPass, String newPass, String userId) {
        if (oldPass == null) {
            oldPass = "";
        }
        Users users = usersRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("No user found with userId: " + userId));
        //Check password length
        if (!UsersValidator.checkPasswordLength(newPass)) {
            throw new StringLengthException("Password needs to be from 6 to 80 characters");
        }
        //Encrypt passwords
        String encryptedNewPass = passwordEncoder.encode(newPass);
        if (users.isFirstLogin()) {
            users.setFirstLogin(false);
            this.saveChangedPassword(encryptedNewPass, users);
        } else {
            if (!UsersValidator.checkPasswordLength(oldPass)) {
                throw new StringLengthException("Password needs to be from 6 to 80 characters");
            }
            //if 2 password match then save new password else throw exception
            if (passwordEncoder.matches(oldPass, users.getPassword())) {
                this.saveChangedPassword(encryptedNewPass, users);
            } else {
                throw new PasswordsNotMatchException("Password is incorrect");
            }
        }
    }

    private void saveChangedPassword(String password, Users users) {
        users.setPassword(password);
        usersRepository.save(users);
    }

    //generate username based on [username]@[DOB in ddmmyyyy] format
    private String generatePassword(String username, Date dob) {
        //convert date to array [yyyy, MM, dd]
        SimpleDateFormat dmyFormat = new SimpleDateFormat("dd-MM-yyyy");
        String dmyDob = dmyFormat.format(dob);
        String[] dobArr = dmyDob.split("-");
        //create a dob string for the password in ddMMyyyy format
        String dobString = String.join("", dobArr);
        //return hashed password
        return passwordEncoder.encode(username + "@" + dobString);
    }

    //generate username based on user's name
    private String generateUsername(String firstName, String lastName) {
        //format: firstName + first char of every word in lastname + num (if duplicate username)
        String modifiedFirstName = firstName.toLowerCase().replaceAll("\\s+", "");
        String modifiedLastName = Arrays.stream(lastName.toLowerCase().trim().split(" "))
                .map(s -> s.substring(0, 1))
                .collect(Collectors.joining());
        //generate username
        String username = modifiedFirstName + modifiedLastName;
        //convert usernames with accented characters to without
        String temp = Normalizer.normalize(username, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        username = pattern.matcher(temp).replaceAll("").replace('đ', 'd');
        //look for duplicates, then replace
        List<String> similarUsernames = usersRepository.getUsernameStartsWith(username);
        //empty -> return username without num
        if (similarUsernames.isEmpty())
            return username;
        //add num to the end of the username if duplicates spotted
        int counter = 0;
        String usernameRegex = "^" + username + "[\\d]*$";
        for (String similarUsername : similarUsernames) {
            if (similarUsername.matches(usernameRegex)) counter++;
        }
        if (counter == 0) return username;
        return username + counter;
    }

    private Users getUserFromDTO(UsersDTO usersDTO) {
        Users newUser = new Users();
        newUser.setFirstName(usersDTO.getFirstName());
        newUser.setLastName(usersDTO.getLastName());
        newUser.setGender(usersDTO.getGender());
        newUser.setDateOfBirth(usersDTO.getDateOfBirth());
        newUser.setJoinDate(usersDTO.getJoinDate());
        newUser.setLocation(locationsRepository.getLocationsById(usersDTO.getLocationId()));
        newUser.setRoles(rolesRepository.getRolesById(usersDTO.getRoleId()));
        newUser.setFirstLogin(true);
        newUser.setActive(true);
        return newUser;
    }

    public Users getUserById(String id) {
        return usersRepository
                .findById(id)

                .orElseThrow(() -> new UserNotFoundException("User " + id + " not found!"));
    }

    public UsersDTO addNewUser(UsersDTO usersDTO) {
        //validate before creating a new user
        validateCreateUserField(usersDTO);
        Users newUser = getUserFromDTO(usersDTO);
        String username = generateUsername(usersDTO.getFirstName(), usersDTO.getLastName());
        String password = generatePassword(username, usersDTO.getDateOfBirth());
        newUser.setUsername(username);
        newUser.setPassword(password);
        return new UsersDTO(usersRepository.save(newUser));
    }

    public UsersDTO editUser(UsersDTO usersDTO) {
        //assign firstname/lastname to the new edit req
        Users oldUserInfo = getUserById(usersDTO.getId());
        usersDTO.setFirstName(oldUserInfo.getFirstName());
        usersDTO.setLastName(oldUserInfo.getLastName());
        //validate before saving the edited user
        validateCreateUserField(usersDTO);
        Users editedUser = getUserFromDTO(usersDTO);
        //set fields from old info that cannot be changed
        editedUser.setId(oldUserInfo.getId());
        editedUser.setUsername(oldUserInfo.getUsername());
        editedUser.setFirstLogin(oldUserInfo.isFirstLogin());
        editedUser.setActive(oldUserInfo.isActive());
        //if first login == true => change password according to the new dob
        //else keep old password
        if (editedUser.isFirstLogin()) {
            editedUser.setPassword(generatePassword(editedUser.getUsername(), editedUser.getDateOfBirth()));
        } else {
            editedUser.setPassword(oldUserInfo.getPassword());
        }
        return new UsersDTO(usersRepository.save(editedUser));
    }

    public boolean isValidName(String name) {
        boolean isValid = true;
        if (name.isEmpty() ||
                name.length() > 25) {
            isValid = false;
        }
        String specialCharactersString = "\"!@#$%&*()~?'+,-./\\:;<=>?[]^_`{|}0123456789";
        for (int i = 0; i < name.length(); i++) {
            char ch = name.charAt(i);
            if (specialCharactersString.contains(Character.toString(ch))) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    public boolean isValidDoB(Date dob) {
        boolean isValid = true;
        Calendar cal = Calendar.getInstance(TimeZone.getDefault());
        cal.setTime(dob);
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        int day = cal.get(Calendar.DAY_OF_MONTH);
        //calculate age
        int age = Period.between(
                LocalDate.of(year, month, day),
                LocalDate.now()
        ).getYears();
        if (age < 18) {
            isValid = false;
        }
        return isValid;
    }

    public boolean isValidGender(Gender gender) {
        boolean isValid = true;
        switch (gender.name()) {
            case "MALE":
            case "FEMALE":
                break;
            default:
                isValid = false;
        }

        return isValid;
    }

    public boolean isValidRole(int roleId) {
        return rolesRepository.findById(roleId).isPresent();
    }

    public boolean isValidLocation(long locationId) {
        boolean present = locationsRepository.findById(locationId).isPresent();
        return present;
    }

    public boolean isValidJoinDate(Date joinDate, Date dob) {
        boolean isValid = true;
        if (joinDate.getTime() <= dob.getTime()) {
            isValid = false;
        }

        return isValid;
    }

    public void validateCreateUserField(UsersDTO usersDTO) {
        if (!isValidName(usersDTO.getFirstName())
                || !isValidName(usersDTO.getLastName())
        ) {
            throw new InvalidFieldException("Name is not allow to contain number or special characters");
        }
        if (!isValidDoB(usersDTO.getDateOfBirth())) {
            throw new InvalidFieldException("Date of birth must fit to age that greater or equal than 18");
        }
        if (!isValidGender(usersDTO.getGender())) {
            throw new InvalidFieldException("Invalid Gender");
        }
        if (!isValidRole(usersDTO.getRoleId())) {
            throw new InvalidFieldException("Invalid Role");
        }
        if (!isValidLocation(usersDTO.getLocationId())) {
            throw new InvalidFieldException("Invalid Location");
        }
        if (!isValidJoinDate(usersDTO.getJoinDate(), usersDTO.getDateOfBirth())) {
            throw new InvalidFieldException("JoinDate must be greater than Date Of Birth");
        }
    }

    private String[] splitSpacedContainedKeyword(String keyword) {
        return keyword.split("\\s+");
    }

    private String lastNameBuilder(String[] spaceContainedKeywords) {
        String lastName = "";
        for (int i = 1; i < spaceContainedKeywords.length; i++) {
            if (i == 1) {
                lastName = spaceContainedKeywords[i];
            } else {
                lastName = lastName + " " + spaceContainedKeywords[i];
            }
        }
        return lastName.trim();
    }

    private List<Roles> createFilterList(String filterRoles) {
        String[] roles = filterRoles.split(",");
        System.out.println("Filter Role String: " + filterRoles);
        if (filterRoles.contains("ALL") || roles.length == 0) {
            return rolesRepository.findAll();
        } else if (filterRoles.length() == 0) {
            return new ArrayList<>();
        } else {
            List<Roles> filterRole = Arrays.stream(roles).map(type ->
                    rolesRepository.findByName(type)
            ).collect(Collectors.toList());
            return filterRole;
        }
    }

    @Override
    public HashMap<String, Object> getUserListVersionTwo(LocationDTO location, String keyword, int index, String sortRule, String filterRoles) {
        Location targetLocation = mapper.map(location, Location.class);
        Pageable pageable = PageRequest.of(index, Config.pageSize, Sort.by(sortRule));
        Page<Users> users;
        if (filterRoles.equalsIgnoreCase("ALL")) {
            users = usersRepository.findUsersByLocation(targetLocation, keyword.toLowerCase(), true, pageable);
        } else {
            keyword = keyword.toLowerCase();
            Pattern pattern = Pattern.compile("[a-zA-Z0-9]{1,70}");
            Matcher matcher = pattern.matcher(keyword);
            List<Roles> roles = Arrays.stream(filterRoles.split(","))
                    .map((name) -> rolesRepository.findByName(name))
                    .collect(Collectors.toList());
            if (keyword.contains(" ") && matcher.find()) {
                String firstName = keyword.split(" ")[0];
                String lastName = lastNameBuilder(keyword.split(" "));
                users = usersRepository.searchAndFilterWithFullName(targetLocation, roles, keyword, true, pageable);
            } else {
                users = usersRepository.filterAndSearch(targetLocation, roles, keyword, keyword, keyword, keyword, true, pageable);
            }
        }

        List<UserDTO> dtos = users.getContent().stream().map((UsersServiceImpl::convertDto)).collect(Collectors.toList());
        HashMap<String, Object> result = new HashMap<>();
        result.put("data", dtos);
        result.put("totalPage", users.getTotalPages());
        return result;
    }

    @Override
    public HashMap<String, Object> getUserDTOForPopup(long locationId, String keyword, int index, String sortRule) {
        String firstName;
        String lastName;
        String staffCode;
        Pattern pattern = Pattern.compile("[a-zA-Z0-9 ]{1,70}");
        Pageable pageable = Util.pageableCreator(index, Config.pageSize, sortRule);;
        Page<Users> result;
        if (keyword.contains(" ") && pattern.matcher(keyword).matches()) {
            String[] spacedContainedKeyword = splitSpacedContainedKeyword(keyword);
            firstName = spacedContainedKeyword[0];
            lastName = lastNameBuilder(spacedContainedKeyword);
            staffCode = keyword;
            result = usersRepository.findUsersOnSpacekeyword(locationId,keyword,true, pageable);
        } else {
            firstName = keyword;
            lastName = keyword;
            staffCode = keyword;
            result = usersRepository.findUsersOnNonSpaceKeyword(locationId, staffCode, firstName, lastName,true, pageable);
        }
        HashMap<String,Object> response = new HashMap<>();
        List<UserDTO> data = result.getContent().stream().map(UsersServiceImpl::convertDto).collect(Collectors.toList());
        response.put("data",data);
        response.put("totalPage",result.getTotalPages());
        return response;
    }

    @Override
    public String disableUser(String staffCode) {
        String message = "";
        Users assignee = new Users();
        assignee.setId(staffCode);
        logger.info("Prepare disable staffCode: " + staffCode);
        Users targetUser = usersRepository.findById(staffCode).orElseThrow(
                () -> new UserNotFoundException("Target User is not found")
        );
        Optional<List<Assignments>> assignmentForAssigneeOptional = Optional.ofNullable(assignmentService.getAssignmentForAssignee(assignee));
        List<Assignments> assignmentsFrom = assignmentForAssigneeOptional.orElse(new ArrayList<>())
                .stream()
                .filter(assignments -> EAssignState.ACCEPTED != assignments.getState())
                .collect(Collectors.toList());
        List<Assignments> testedEmptyList = assignmentForAssigneeOptional.orElse(new ArrayList<>());
        boolean notHaveValidAssignemnt = validDisableUser(staffCode);
        boolean isAvailableActive = targetUser.isActive();
        if (validDisableUser(staffCode) && targetUser.isActive()) {
            targetUser.setActive(false);
            usersRepository.save(targetUser);
        }
        message = !validDisableUser(staffCode) ? "There are valid assignments belonging to this user. Please close all assignments before disabling user" : (isAvailableActive ? "SUCCESS" : "User already disable");
        return message;
    }

    @Override
    public boolean validDisableUser(String staffCode) throws UsernameNotFoundException {
        Users assignee = usersRepository.getById(staffCode);
        Optional<List<Assignments>> assignmentForAssigneeOptional = Optional.ofNullable(assignmentService.getAssignmentForAssignee(assignee));
        List<Assignments> assignmentsFrom = assignmentForAssigneeOptional.orElse(new ArrayList<>())
                .stream()
                .filter(assignments -> EAssignState.ACCEPTED == assignments.getState())
                .collect(Collectors.toList());
        List<Assignments> testedEmptyList = assignmentForAssigneeOptional.orElse(new ArrayList<>());
        if (assignmentsFrom.size() == 0 || testedEmptyList == null || testedEmptyList.isEmpty()) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<UserListPopup> getAvailable(int location_id) {
        List<Object[]> dataList = usersRepository.getAvailable(location_id);
        List<UserListPopup> popups = new ArrayList<>();
        for (Object[] o : dataList) {
            UserListPopup user = new UserListPopup();
            user.setUserId((String) o[1]);
            user.setFullName((String) o[0]);
            user.setUsername((String) o[2]);
            popups.add(user);
        }
        return popups;
    }

    public String getUserId(String username) {
        Users users = usersRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("No user found"));
        return users.getId();
    }
}
