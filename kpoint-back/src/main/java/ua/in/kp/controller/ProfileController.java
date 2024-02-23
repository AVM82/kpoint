package ua.in.kp.controller;

import com.github.fge.jsonpatch.JsonPatch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ua.in.kp.dto.profile.PasswordDto;
import ua.in.kp.dto.profile.ProjectsProfileResponseDto;
import ua.in.kp.dto.profile.UserChangeDto;
import ua.in.kp.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{username}/myProjects")
    public ResponseEntity<ProjectsProfileResponseDto> getMyProjects(
            @PathVariable String username, Pageable pageable) {
        return ResponseEntity.ok(profileService.getMyProjects(username, pageable));
    }

    @GetMapping("/{username}/favouriteProjects")
    public ResponseEntity<ProjectsProfileResponseDto> getFavouriteProjects(
            @PathVariable String username, Pageable pageable) {
        return ResponseEntity.ok(profileService.getFavouriteProjects(username, pageable));
    }

    @GetMapping("/{username}/recommendedProjects")
    public ResponseEntity<ProjectsProfileResponseDto> getRecommendedProjects(
            @PathVariable String username, Pageable pageable) {
        return ResponseEntity.ok(profileService.getRecommendedProjects(username, pageable));
    }

    @PatchMapping(path = "/settings")
    @PreAuthorize("hasAnyAuthority({'USER', 'ADMIN'})")
    public ResponseEntity<UserChangeDto> updateUser(@RequestBody JsonPatch patch) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("updateUser {} {}", auth.getName(), patch);
        return ResponseEntity.ok(profileService.updateUserData(auth.getName(), patch));
    }

    @Operation(summary = "Change password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password was changed successfully!",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Bad Request",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Wrong credentials",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Prohibited",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content)})
    @PatchMapping(path = "/{username}/changePassword")
    public ResponseEntity<String> changePassword(@PathVariable String username, @RequestBody PasswordDto dto) {
        profileService.changePassword(username, dto);
        return ResponseEntity.ok("Password was changed successfully!");
    }
}
