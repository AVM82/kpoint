package ua.in.kp.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ua.in.kp.dto.user.UserRegisterRequestDto;
import ua.in.kp.dto.user.UserResponseDto;
import ua.in.kp.service.UserService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
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

    @Operation(summary = "Banning the user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User banned",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class)) }),
            @ApiResponse(responseCode = "400", description = "Bad Request",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Wrong credentials",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Prohibited",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content)})
    @PatchMapping("/{id}/ban")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponseDto> banUser(@PathVariable UUID id) {
        log.info("banning user by id {}", id);
        return ResponseEntity.ok(userService.banUserById(id.toString()));
    }

    @Operation(summary = "Unbanning the user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User unbanned",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class)) }),
            @ApiResponse(responseCode = "400", description = "Bad Request",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Wrong credentials",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Prohibited",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content)})
    @PatchMapping("/{id}/unban")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponseDto> unbanUser(@PathVariable UUID id) {
        log.info("banning user by id {}", id);
        return ResponseEntity.ok(userService.unBanUserById(id.toString()));
    }

    @GetMapping(path = "/{email}/exists_email")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> verifyExistsEmail(@NonNull @PathVariable String email) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("verifyExistEmail {} {}", auth.getName(), email);
        return ResponseEntity.ok(userService.verifyExistsEmail(email));
    }

    @GetMapping(path = "/{username}/exists_username")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> verifyExistsUsername(@NonNull @PathVariable String username) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("verifyExistUsername {} {}", auth.getName(), username);
        return ResponseEntity.ok(userService.verifyExistsUsername(username));
    }
}
