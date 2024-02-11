package ua.in.kp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.in.kp.dto.profile.ProjectsProfileResponseDto;
import ua.in.kp.dto.project.GetAllProjectsDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.TagEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.mapper.ProjectMapper;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserService userService;
    private final ProjectService projectService;
    private final ProjectMapper projectMapper;

    public ProjectsProfileResponseDto getMyProjects(String username, Pageable pageable) {
        UserEntity userEntity = userService.getByUsername(username);
        Page<GetAllProjectsDto> ownedProjectsDtos = projectService.getProjectsByUser(userEntity, pageable)
                .map(projectMapper::getAllToDto);
        return new ProjectsProfileResponseDto(userEntity.getId().toString(),
                ownedProjectsDtos);
    }

    @Transactional
    public ProjectsProfileResponseDto getFavouriteProjects(String username, Pageable pageable) {
        UserEntity userEntity = userService.getByUsername(username);
        Page<GetAllProjectsDto> favouriteProjectsDtos =
                userService.getUserEntityByUsernameFetchedFavouriteProjects(username, pageable)
                        .map(projectMapper::getAllToDto);
        return new ProjectsProfileResponseDto(userEntity.getId().toString(),
                favouriteProjectsDtos);
    }

    public ProjectsProfileResponseDto getRecommendedProjects(String username, Pageable pageable) {
        UserEntity userEntity =
                userService.getUserEntityByUsernameFetchedTagsFavouriteAndOwnedProjects(username);
        Set<TagEntity> tags = userEntity.getTags();
        Set<ProjectEntity> allProjects = userEntity.getProjectsOwned();
        allProjects.addAll(userEntity.getProjectsFavourite());
        Set<String> projectsIds = projectService.retrieveProjectsIds(allProjects);
        Page<GetAllProjectsDto> recommendedProjectsDtos =
                projectService.retrieveRecommendedProjects(tags, projectsIds, pageable)
                        .map(projectMapper::getAllToDto);
        return new ProjectsProfileResponseDto(userEntity.getId().toString(), recommendedProjectsDtos);
    }
}
