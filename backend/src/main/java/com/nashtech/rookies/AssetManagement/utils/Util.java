package com.nashtech.rookies.AssetManagement.utils;

import com.nashtech.rookies.AssetManagement.config.Config;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Util {
    public static String getZeroPrefixId(Long id)
    {
        int length = Config.LENGTH_STAFF_ID-2;
        return String.format("%0"+length+"d", id);
    }

    public static Pageable pageableCreator(int index, int size, String sortRule){
        Sort sort = Sort.by(sortRule);
        return PageRequest.of(index, size, sort);
    }

    public static boolean checkSpecialCharacters(String s){
        Pattern my_pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matcher = my_pattern.matcher(s);
        return matcher.find();
    }

    public static boolean checkSpecialCharactersAndSpace(String s){
        Pattern my_pattern = Pattern.compile("[^a-z0-9]", Pattern.CASE_INSENSITIVE);
        Matcher matcher = my_pattern.matcher(s);
        return matcher.find();
    }

    public static boolean checkAssetNameLength(String s){
        return s.isEmpty() || s.length() > 100 ? false : true;
    }

    public static boolean checkSpecificationLength(String s){
        return s.length() > 400 ? false : true;
    }
}
