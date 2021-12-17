package com.nashtech.rookies.AssetManagement.utils;

import com.nashtech.rookies.AssetManagement.repository.AssetRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AssetCodeGenerator {

    @Autowired
    private AssetRepository assetRepository;

    public String generateCode(String prefix){
        int rows = assetRepository.getAssetRows(prefix);
        if(rows > 0) {
            String latestCode = assetRepository.getLatestAssetCode(prefix);
            int latestIndex = Integer.valueOf(latestCode.substring(prefix.length()));
            //If current index in db is greater than the rows then the next wil be the current index + 1
            if (latestIndex > rows) {
                return prefix + String.format("%06d", latestIndex + 1);
            }
        }
        // else the next code is the rows + 1
        return prefix + String.format("%06d",rows+1);
    }
}
