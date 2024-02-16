package ua.in.kp.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ua.in.kp.dto.project.*;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.TagEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.mapper.ProjectMapper;
import ua.in.kp.repository.ProjectRepository;
import ua.in.kp.repository.TagRepository;

import java.util.Collection;
import java.util.NoSuchElementException;
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
    private final S3Service s3Service;

    @Transactional
    public ProjectResponseDto createProject(ProjectCreateRequestDto projectDto, MultipartFile file) {
        log.info("Create project method started");

        projectDto.getTags().forEach(tag -> tagRepository.saveByNameIfNotExist(tag.toLowerCase()));

        ProjectEntity projectEntity = projectMapper.toEntity(projectDto);
        projectEntity.setOwner(userService.getAuthenticated());
        projectEntity.setLogoImgUrl(s3Service.uploadLogo(file));
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

    @Transactional
    public ProjectResponseDto getProjectById(String projectId) {
        log.info("Get by id project method started");
        ProjectEntity projectEntity = projectRepository.findBy(projectId)
                .orElseThrow(() ->
                        new NoSuchElementException("Project not found with ID: " + projectId));
        log.info("Project retrieved, id {}", projectEntity.getProjectId());
        return projectMapper.toDto(projectEntity);
    }

    @Transactional
    public ProjectResponseDto getProjectByUrl(String url) {
        log.info("Trying to get project by URL...");
        ProjectEntity projectEntity = projectRepository.findByProjectUrl(url)
                .orElseThrow(() ->
                        new NoSuchElementException("Project with URL " + url + " not found."));
        log.info("Project with url {} retrieved.", projectEntity.getUrl());
        return projectMapper.toDto(projectEntity);
    }

    public Page<ProjectEntity> retrieveRecommendedProjects(
            Set<TagEntity> tags, Set<String> userProjectsIds, Pageable pageable) {
        return projectRepository.findByTagsExceptOwnedAndFavouriteWithSortByTagsCountThenGoalSum(
                tags, userProjectsIds, pageable);
    }

    public Set<String> retrieveProjectsIds(Collection<ProjectEntity> projects) {
        return projects.stream()
                .map(ProjectEntity::getProjectId)
                .collect(Collectors.toSet());
    }

    public Page<ProjectEntity> getProjectsByUser(UserEntity userEntity, Pageable pageable) {
        return projectRepository.findAllByOwner(userEntity, pageable);
    }
}
