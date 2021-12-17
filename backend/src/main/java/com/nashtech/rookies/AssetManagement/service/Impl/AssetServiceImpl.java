package com.nashtech.rookies.AssetManagement.service.Impl;

import com.nashtech.rookies.AssetManagement.config.Config;
import com.nashtech.rookies.AssetManagement.exception.*;
import com.nashtech.rookies.AssetManagement.model.dto.AssetDTO;
import com.nashtech.rookies.AssetManagement.model.dto.AssetListPopup;
import com.nashtech.rookies.AssetManagement.model.dto.ReportDTO;
import com.nashtech.rookies.AssetManagement.model.entity.Assets;
import com.nashtech.rookies.AssetManagement.model.entity.Assignments;
import com.nashtech.rookies.AssetManagement.model.entity.Category;
import com.nashtech.rookies.AssetManagement.model.entity.Location;
import com.nashtech.rookies.AssetManagement.model.enums.EAssetState;
import com.nashtech.rookies.AssetManagement.model.payload.CreateAssetRequest;
import com.nashtech.rookies.AssetManagement.model.payload.EditAssetRequest;
import com.nashtech.rookies.AssetManagement.repository.AssetRepository;
import com.nashtech.rookies.AssetManagement.repository.AssignmentsRepository;
import com.nashtech.rookies.AssetManagement.repository.CategoryRepository;
import com.nashtech.rookies.AssetManagement.repository.LocationsRepository;
import com.nashtech.rookies.AssetManagement.service.AssetService;
import com.nashtech.rookies.AssetManagement.utils.AssetCodeGenerator;
import com.nashtech.rookies.AssetManagement.utils.Util;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AssetServiceImpl implements AssetService {
    private LocationsRepository locationsRepository;
    private AssetRepository assetRepository;
    private CategoryRepository categoryRepository;
    private AssignmentsRepository assignmentsRepository;
    private AssetCodeGenerator generator;
    @Autowired
    public void setLocationsRepository(LocationsRepository locationsRepository) {
        this.locationsRepository = locationsRepository;
    }
    @Autowired
    public void setAssetRepository(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }
    @Autowired
    public void setCategoryRepository(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    @Autowired
    public void setAssignmentsRepository(AssignmentsRepository assignmentsRepository) {
        this.assignmentsRepository = assignmentsRepository;
    }
    @Autowired
    public void setGenerator(AssetCodeGenerator generator) {
        this.generator = generator;
    }

    private Assets createRequestToEntity(CreateAssetRequest request) {
        Category category = categoryRepository.findById(request.getPrefix()).get();
        Location location = locationsRepository.findById(request.getLocationId()).get();
        Assets assets = new Assets();
        assets.setAssetCode(generator.generateCode(request.getPrefix()));
        assets.setName(request.getName());
        assets.setCategory(category);
        assets.setLocation(location);
        assets.setSpecification(request.getSpecification());
        assets.setInstalledDate(request.getInstalledDate());
        assets.setState(request.getState());
        return assets;
    }

    private AssetDTO convertToDto(Assets asset) {
        AssetDTO assetDTO = new AssetDTO(
                asset.getAssetCode(),
                asset.getName(),
                asset.getCategory().getName(),
                asset.getState(),
                asset.getLocation().getId(),
                asset.getSpecification(),
                asset.getInstalledDate(),
                assignmentsRepository.existsByAsset_AssetCode(asset.getAssetCode())
        );
        return assetDTO;
    }

    //create new asset
    @Override
    public AssetDTO addNew(CreateAssetRequest request) {
        this.validateAsset(request.getName(), request.getSpecification(), request.getInstalledDate());
        Assets assets = this.createRequestToEntity(request);
        assetRepository.save(assets);
        return this.convertToDto(assets);
    }

    @Override
    public HashMap<String, Object> deleteAsset(String assetCode, Long locationId) {
        String message = "Delete success";
        HttpStatus status = HttpStatus.OK;

        Assets asset = assetRepository.findById(assetCode)
                .orElseThrow(() -> new NotFoundException("Asset Code was not exist"));

        if (!locationId.equals(asset.getLocation().getId())) {
            throw new InvalidFieldException("You are not allow to delete asset from other location");
        }

        if (asset.getState().equals(EAssetState.ASSIGNED) ||
                assignmentsRepository.existsByAsset_AssetCode(assetCode)) {
            message = Config.canNotDeleteAssetMessage;
            status = HttpStatus.NOT_ACCEPTABLE;
        }

        HashMap<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("status", status);

        if (status == HttpStatus.OK) {
            assetRepository.delete(asset);
        }

        return response;
    }

    @Override
    public HashMap<String, Object> getListAsset(long locationId,
                                                int pageNumber,
                                                String sort,
                                                int direction,
                                                String keyword,
                                                String filterState,
                                                List<String> filterCategory) {
        locationsRepository
                .findById(locationId)
                .orElseThrow(() -> new NotFoundException("Location Id was not exist"));
        keyword = keyword.toLowerCase();
        Page<Assets> list = null;
        Pageable page = Util.pageableCreator(pageNumber, Config.pageSize,sort);

        if (filterState.equalsIgnoreCase("all")) {
            if (filterCategory.isEmpty() || filterCategory.contains("ALL")) {
                list = assetRepository.filterAllByLocation(
                        locationId,
                        keyword,
                        page);
            } else {
                list = assetRepository.filterAllByLocationAndCategory(
                        locationId,
                        filterCategory,
                        keyword,
                        page
                );
            }
        } else {
            List<EAssetState> filterList = Arrays.stream(filterState.split(","))
                    .map(EAssetState::valueOf)
                    .collect(Collectors.toList());
            if (filterCategory.isEmpty() || filterCategory.contains("ALL")) {
                list = assetRepository.filterAllByLocationAndState(
                        locationId,
                        filterList,
                        keyword,
                        page);
            } else {
                list = assetRepository.filterAllByLocationAndStateAndCategory(
                        locationId,
                        filterList,
                        filterCategory,
                        keyword,
                        page
                );
            }
        }

        List<AssetDTO> assetList = list.getContent()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        HashMap<String, Object> response = new HashMap<>();
        response.put("totalPages", list.getTotalPages());
        response.put("pageSize", list.getSize());
        response.put("currentPage", list.getNumber() + 1);
        response.put("data", assetList);

        return response;
    }

    //Edit asset
    @Override
    public AssetDTO edit(EditAssetRequest request) {
        Assets assets = assetRepository.findById(request.getAssetCode()).orElseThrow(
                () -> new NoSuchElementException("No asset found with asset code: " + request.getAssetCode())
        );
        this.validateAsset(request.getAssetName(), request.getSpecification(), request.getInstalledDate());
        assets.setName(request.getAssetName());
        assets.setSpecification(request.getSpecification());
        assets.setInstalledDate(request.getInstalledDate());
        assets.setState(request.getState());
        assetRepository.save(assets);
        AssetDTO dto = this.convertToDto(assets);
        return dto;
    }

    //validate user input field
    private void validateAsset(String name, String specification, Date installedDate) {
        if (!Util.checkAssetNameLength(name)) {
            throw new StringLengthException("Name can only be from 1 to 100 characters");
        }
        if (Util.checkSpecialCharacters(name)) {
            throw new SpecialCharacterException("Name must contain only characters, numbers and whitespaces in between!");
        }
        if (!Util.checkSpecificationLength(specification)) {
            throw new StringLengthException("Specification can not exceed 400 characters");
        }
        if (LocalDate.parse(installedDate.toString()).isAfter(LocalDate.now())) {
            throw new DateException("Installed Date is the future day. Please select a different date");
        }
    }

    @Override
    public List<AssetListPopup> getAvailable(int location_id){
        List<Object[]> dataList = assetRepository.getAvailableAsset(location_id);
        log.info(String.valueOf((dataList.size())));
        List<AssetListPopup> listPopups = new ArrayList<>();
        for(Object[] o : dataList){
            AssetListPopup popup = new AssetListPopup();
            popup.setAssetCode((String)o[0]);
            popup.setAssetName((String)o[1]);
            popup.setCategory((String)o[2]);
            listPopups.add(popup);
        }
        return listPopups;
    }

    @Override
    public List<ReportDTO> getReport(int location_id) {
        List<Object[]> dataList = assetRepository.getReport(location_id);
        List<ReportDTO> reportList = new ArrayList<>();
        for(Object[] o : dataList){
            ReportDTO reportDTO = new ReportDTO();
            reportDTO.setCategory((String)o[0]);
            reportDTO.setTotal(((BigInteger) o[1]).intValue());
            reportDTO.setAssigned(((BigInteger) o[2]).intValue());
            reportDTO.setAvailable(((BigInteger) o[3]).intValue());
            reportDTO.setNotAvailable(((BigInteger) o[4]).intValue());
            reportDTO.setWaiting(((BigInteger) o[5]).intValue());
            reportDTO.setRecycled(((BigInteger) o[6]).intValue());
            reportList.add(reportDTO);
        }
        return reportList;
    }

    private boolean containKeyword(AssetDTO assetDTO, String keyword) {
        boolean isContain = false;
        if (assetDTO.getAssetCode().toLowerCase().contains(keyword.toLowerCase())) {
            isContain = true;
        }
        if (assetDTO.getAssetName().toLowerCase().contains(keyword.toLowerCase())) {
            isContain = true;
        }
        return isContain;
    }

    private Comparator<AssetDTO> sortByField(String sort, int direction) {
        Comparator<AssetDTO> assetDTOComparator = (asset1, asset2) -> {
            switch (sort) {
                case "assetName":
                    return asset1.getAssetName().compareToIgnoreCase(asset2.getAssetName());
                case "categoryName":
                    return asset1.getCategoryName().compareToIgnoreCase(asset2.getCategoryName());
                case "state":
                    return asset1.getState().name().compareToIgnoreCase(asset2.getState().name());
                case "assetCode":
                default:
                    return asset1.getAssetCode().compareToIgnoreCase(asset2.getAssetCode());
            }
        };
        if (direction == 1) {
            return assetDTOComparator.reversed();
        }
        return assetDTOComparator;
    }
}
