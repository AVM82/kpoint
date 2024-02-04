package ua.in.kp.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ua.in.kp.dto.project.GetAllProjectsDto;
import ua.in.kp.dto.project.ProjectCreateRequestDto;
import ua.in.kp.dto.project.ProjectResponseDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.exception.ProjectNotFoundException;
import ua.in.kp.mapper.ProjectMapper;
import ua.in.kp.repository.ProjectRepository;
import ua.in.kp.repository.TagRepository;

@AllArgsConstructor
@Service
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserService userService;
    private final TagRepository tagRepository;

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

    @Transactional
    public ProjectResponseDto getProjectById(String projectId) {
        log.info("Get by id project method started");
        ProjectEntity projectEntity = projectRepository.findBy(projectId)
                .orElseThrow(() ->
                        new ProjectNotFoundException("Project not found with ID: " + projectId));
        log.info("Project retrieved, id {}", projectEntity.getProjectId());
        return projectMapper.toDto(projectEntity);
    }
}
