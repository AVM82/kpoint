package ua.in.kp.controller;

import com.github.fge.jsonpatch.JsonPatch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.in.kp.dto.profile.PasswordDto;
import ua.in.kp.dto.profile.ProjectsProfileResponseDto;
import ua.in.kp.dto.profile.UserChangeDto;
import ua.in.kp.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
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

    @PatchMapping(path = "/{username}/settings", consumes = "application/json-patch+json")
    public ResponseEntity<UserChangeDto> updateUser(@PathVariable String username, @RequestBody JsonPatch patch) {
        return ResponseEntity.ok(profileService.updateUserData(username, patch));
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
