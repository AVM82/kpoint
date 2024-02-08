package ua.in.kp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ua.in.kp.dto.profile.FavouriteProjectsProfileResponseDto;
import ua.in.kp.dto.profile.MyProjectsProfileResponseDto;
import ua.in.kp.dto.profile.RecommendedProjectsProfileResponseDto;
import ua.in.kp.dto.project.GetAllProjectsDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.TagEntity;
import ua.in.kp.entity.UserEntity;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserService userService;
    private final ProjectService projectService;

    public MyProjectsProfileResponseDto getMyProjects(String username, Pageable pageable) {
        UserEntity userEntityWithFetchedOwnedProjects =
                userService.getUserEntityByUsernameFetchedOwnedProjects(username);
        Set<ProjectEntity> projectsOwned = userEntityWithFetchedOwnedProjects.getProjectsOwned();
        int size = pageable.getPageSize();
        String userId = userEntityWithFetchedOwnedProjects.getId().toString();
        List<GetAllProjectsDto> projectsOwnedDtos = projectService.mapProjectsToListDtos(projectsOwned, size);
        return new MyProjectsProfileResponseDto(userId, projectsOwnedDtos);
    }

    public FavouriteProjectsProfileResponseDto getFavouriteProjects(String username, Pageable pageable) {
        UserEntity userEntityWithFetchedFavouriteProjects =
                userService.getUserEntityByUsernameFetchedFavouriteProjects(username);
        Set<ProjectEntity> projectsFavourite =
                userEntityWithFetchedFavouriteProjects.getProjectsFavourite();
        int size = pageable.getPageSize();
        String userId = userEntityWithFetchedFavouriteProjects.getId().toString();
        List<GetAllProjectsDto> projectsFavouriteDtos =
                projectService.mapProjectsToListDtos(projectsFavourite, size);
        return new FavouriteProjectsProfileResponseDto(userId, projectsFavouriteDtos);
    }

    public RecommendedProjectsProfileResponseDto getRecommendedProjects(String username, Pageable pageable) {
        UserEntity userEntityWithFetchedTagsFavouriteAndOwnedProjects =
                userService.getUserEntityByUsernameFetchedTagsFavouriteAndOwnedProjects(username);
        Set<String> tags = userEntityWithFetchedTagsFavouriteAndOwnedProjects.getTags().stream()
                .map(TagEntity::getName)
                .collect(Collectors.toSet());
        Set<ProjectEntity> projectsOwned = userEntityWithFetchedTagsFavouriteAndOwnedProjects.getProjectsOwned();
        Set<String> projectsOwnedIds = projectService.retrieveProjectsIds(projectsOwned);
        Set<ProjectEntity> projectsFavourite =
                userEntityWithFetchedTagsFavouriteAndOwnedProjects.getProjectsFavourite();
        Set<String> projectsFavouriteIds = projectService.retrieveProjectsIds(projectsFavourite);
        Page<ProjectEntity> recommendedProjects =
                projectService.retrieveRecommendedProjects(tags, projectsOwnedIds, projectsFavouriteIds, pageable);
        int size = pageable.getPageSize();
        String userId = userEntityWithFetchedTagsFavouriteAndOwnedProjects.getId().toString();
        List<GetAllProjectsDto> projectsRecommendedDtos =
                projectService.mapProjectsToListDtos(recommendedProjects, size);
        return new RecommendedProjectsProfileResponseDto(userId, projectsRecommendedDtos);
    }
}
