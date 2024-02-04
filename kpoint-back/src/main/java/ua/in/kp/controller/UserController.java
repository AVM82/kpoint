package ua.in.kp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.in.kp.dto.user.UserRegisterRequestDto;
import ua.in.kp.dto.user.UserResponseDto;
import ua.in.kp.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDto> create(@RequestBody UserRegisterRequestDto dto) {
        return ResponseEntity.ok(userService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAll(Pageable pageable) {
        return ResponseEntity.ok(userService.getAll(pageable));
    }
}
