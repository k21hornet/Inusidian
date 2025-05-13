package com.inupro.inusidian.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderUtil {
    public static void main(String[] args) {
        String password = "smith";
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(password);
        System.out.println("平文パスワード: " + password);
        System.out.println("ハッシュ化パスワード: " + hashedPassword);
    }
}
