package com.chihuahuawashawasha.backend.service;

import com.chihuahuawashawasha.backend.entity.User;
import com.chihuahuawashawasha.backend.input.NewUserInput;
import com.chihuahuawashawasha.backend.input.PasswordInput;
import com.chihuahuawashawasha.backend.input.UserUpdateInput;
import com.chihuahuawashawasha.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void createUser(NewUserInput userInput) {
        // 既存のメールか
        if (findByEmail(userInput.getEmail()).isPresent()) {
            throw new RuntimeException("Emailは既に使われています");
        }

        // パスワード入力チェック
        if (!userInput.getPassword().equals(userInput.getPasswordConfirm())) {
            throw new RuntimeException("パスワードが一致しません");
        }

        User user = new User();
        user.setUsername(userInput.getUsername());
        user.setEmail(userInput.getEmail());
        user.setPassword(passwordEncoder.encode(userInput.getPassword()));
        user.setAuthority("USER");

        userRepository.save(user);
    }

    public void update(UserUpdateInput input) {
        Optional<User> userOptional = userRepository.findById(input.getId());
        if (userOptional.isEmpty()) throw new RuntimeException();

        User user = userOptional.get();
        user.setUsername(input.getUsername());
        user.setEmail(input.getEmail());

        userRepository.save(user);
    }

    public void updatePassword(PasswordInput input) {
        Optional<User> userOptional = userRepository.findById(input.getId());
        if (userOptional.isEmpty()) throw new RuntimeException();
        User user = userOptional.get();

        if (!passwordEncoder.matches(input.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Current Password Not Match");
        }

        if (!input.getNewPassword().equals(input.getNewPasswordConfirm())) {
            throw new RuntimeException("Password Confirm Not Match");
        }

        user.setPassword(passwordEncoder.encode(input.getNewPassword()));
        userRepository.save(user);
    }
}
