package ua.in.kp.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.in.kp.dto.project.GetAllProjectsDto;
import ua.in.kp.dto.project.ProjectCreateRequestDto;
import ua.in.kp.dto.project.ProjectResponseDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.ProjectSubscribeEntity;
import ua.in.kp.entity.TagEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.mapper.ProjectMapper;
import ua.in.kp.repository.ProjectRepository;
import ua.in.kp.repository.SubscriptionRepository;
import ua.in.kp.repository.TagRepository;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserService userService;
    private final TagRepository tagRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Transactional
    public ProjectResponseDto createProject(ProjectCreateRequestDto projectDto) {
        log.info("Create project method started");

        projectDto.getTags().forEach(tag -> tagRepository.saveByNameIfNotExist(tag.toLowerCase()));

        ProjectEntity projectEntity = projectMapper.toEntity(projectDto);
        projectEntity.setOwner(userService.getAuthenticated());
        projectRepository.save(projectEntity);
        log.info("ProjectEntity saved, id {}", projectEntity.getProjectId());

        return projectMapper.toDto(projectEntity);
    }

    public Page<GetAllProjectsDto> getAllProjects(Pageable pageable) {
        Page<ProjectEntity> page = projectRepository.findAll(pageable);
        log.info("Got all projects from projectRepository.");
        Page<GetAllProjectsDto> toReturn = page.map(projectMapper::getAllToDto);
        log.info("Map all projectsEntity to DTO and return page with them.");
        return toReturn;
    }

    @Transactional(readOnly = true)
    public ProjectResponseDto getProjectById(String projectId) {
        log.info("Get by id project method started");
        ProjectEntity projectEntity =
                projectRepository
                        .findBy(projectId)
                        .orElseThrow(
                                () -> {
                                    log.warn("Project not found with ID: {}", projectId);
                                    return new ApplicationException(
                                            HttpStatus.NOT_FOUND, "Project not found with ID: " + projectId);
                                });
        log.info("Project retrieved, id {}", projectEntity.getProjectId());
        return projectMapper.toDto(projectEntity);
    }

    @Transactional(readOnly = true)
    public ProjectResponseDto getProjectByUrl(String url) {
        log.info("Trying to get project by URL...");
        ProjectEntity projectEntity =
                projectRepository
                        .findByProjectUrl(url)
                        .orElseThrow(
                                () -> {
                                    log.warn("Project with URL {} not found.", url);
                                    return new ApplicationException(
                                            HttpStatus.NOT_FOUND, "Project with URL " + url + " not found.");
                                });
        log.info("Project with url {} retrieved.", projectEntity.getUrl());
        return projectMapper.toDto(projectEntity);
    }

    @Transactional(readOnly = true)
    public ProjectResponseDto getProjectByTitle(String title) {
        log.info("Trying to get project by title...");
        ProjectEntity projectEntity =
                projectRepository
                        .findByTitle(title)
                        .orElseThrow(
                                () -> {
                                    log.warn("Project with title {} not found.", title);
                                    return new ApplicationException(
                                            HttpStatus.NOT_FOUND, "Project with title " + title + " not found.");
                                });
        log.info("Project with title {} retrieved.", projectEntity.getUrl());
        return projectMapper.toDto(projectEntity);
    }

    public Page<ProjectEntity> retrieveRecommendedProjects(
            Set<TagEntity> tags, Set<String> userProjectsIds, Pageable pageable) {
        if (userProjectsIds.isEmpty()) {
            return projectRepository.findByTagsWithSortByTagsCountThenGoalSum(
                    tags, pageable);
        } else {
            return projectRepository.findByTagsExceptOwnedAndFavouriteWithSortByTagsCountThenGoalSum(
                    tags, userProjectsIds, pageable);
        }
    }

    public Set<String> retrieveProjectsIds(Collection<ProjectEntity> projects) {
        return projects.stream().map(ProjectEntity::getProjectId).collect(Collectors.toSet());
    }

    public Page<ProjectEntity> getProjectsByUser(UserEntity userEntity, Pageable pageable) {
        return projectRepository.findAllByOwner(userEntity, pageable);
    }

    public void subscribeUserToProject(String userId, String projectId) {
        ProjectSubscribeEntity subscription = new ProjectSubscribeEntity();
        subscription.setUserId(userId);
        subscription.setProjectId(projectId);
        subscriptionRepository.save(subscription);
    }

    public List<ProjectSubscribeEntity> getUsersSubscribedToProject(String projectId) {
        return subscriptionRepository.findByProjectId(projectId);
    }
}
