package ua.in.kp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.in.kp.dto.profile.FavouriteProjectsProfileResponseDto;
import ua.in.kp.dto.profile.MyProjectsProfileResponseDto;
import ua.in.kp.dto.profile.RecommendedProjectsProfileResponseDto;
import ua.in.kp.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{username}/myProjects")
    public ResponseEntity<MyProjectsProfileResponseDto> getMyProjects(
            @PathVariable String username, Pageable pageable) {
        return ResponseEntity.ok(profileService.getMyProjects(username, pageable));
    }

    @GetMapping("/{username}/favouriteProjects")
    public ResponseEntity<FavouriteProjectsProfileResponseDto> getFavouriteProjects(
            @PathVariable String username, Pageable pageable) {
        return ResponseEntity.ok(profileService.getFavouriteProjects(username, pageable));
    }

    @GetMapping("/{username}/recommendedProjects")
    public ResponseEntity<RecommendedProjectsProfileResponseDto> getRecommendedProjects(
            @PathVariable String username, Pageable pageable) {
        return ResponseEntity.ok(profileService.getRecommendedProjects(username, pageable));
    }
}
