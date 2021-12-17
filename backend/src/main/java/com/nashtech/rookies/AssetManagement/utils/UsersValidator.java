package com.nashtech.rookies.AssetManagement.utils;

public class UsersValidator {

    public static boolean checkPasswordLength(String password){
        return password.length() < 6 || password.length()>80 ? false : true;
    }
}
