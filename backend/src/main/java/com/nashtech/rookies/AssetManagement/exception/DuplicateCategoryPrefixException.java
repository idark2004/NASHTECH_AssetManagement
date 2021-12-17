package com.nashtech.rookies.AssetManagement.exception;

public class DuplicateCategoryPrefixException extends RuntimeException{

    public DuplicateCategoryPrefixException() {
        super("Prefix is already existed. Please enter a different prefix");
    }
}
