package ua.in.kp.service;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ua.in.kp.dto.project.GetAllProjectsDto;
import ua.in.kp.dto.project.ProjectCreateRequestDto;
import ua.in.kp.dto.project.ProjectResponseDto;
import ua.in.kp.dto.project.ProjectSubscribeDto;
import ua.in.kp.dto.subscribtion.SubscribeResponseDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.ProjectSubscribeEntity;
import ua.in.kp.entity.TagEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.locale.Translator;
import ua.in.kp.mapper.ProjectMapper;
import ua.in.kp.repository.ProjectRepository;
import ua.in.kp.repository.SubscriptionRepository;
import ua.in.kp.repository.TagRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserService userService;
    private final TagRepository tagRepository;
    private final S3Service s3Service;
    private final SubscriptionRepository subscriptionRepository;
    private final EmailServiceKp emailService;
    private final Translator translator;
    private final MeterRegistry meterRegistry;

    public ProjectService(ProjectRepository projectRepository, ProjectMapper projectMapper,
                          UserService userService, TagRepository tagRepository, S3Service s3Service,
                          SubscriptionRepository subscriptionRepository, EmailServiceKp emailService,
                          Translator translator, MeterRegistry meterRegistry) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
        this.userService = userService;
        this.tagRepository = tagRepository;
        this.s3Service = s3Service;
        this.subscriptionRepository = subscriptionRepository;
        this.emailService = emailService;
        this.translator = translator;
        this.meterRegistry = meterRegistry;

        Gauge.builder("projects_count", projectRepository::count)
                .description("A current number of projects in the system")
                .register(meterRegistry);
    }

    @Transactional
    public ProjectResponseDto createProject(ProjectCreateRequestDto projectDto, MultipartFile file) {
        log.info("Create project method started");

        String title = projectDto.getTitle();
        Optional<ProjectEntity> checkTitle = projectRepository.findByTitle(title);
        if (checkTitle.isPresent()) {
            log.warn("Project with title {} already exist!", title);
            throw new ApplicationException(HttpStatus.BAD_REQUEST, translator.getLocaleMessage(
                    "exception.project.property-already-exist", "title", title));
        }

        String url = projectDto.getUrl();
        Optional<ProjectEntity> checkUrl = projectRepository.findByProjectUrl(url);
        if (checkUrl.isPresent()) {
            log.warn("Project with url {} already exist!", url);
            throw new ApplicationException(HttpStatus.BAD_REQUEST, translator.getLocaleMessage(
                    "exception.project.property-already-exist", "url", url));
        }

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
//        Page<GetAllProjectsDto> toReturn = page.map(projectMapper::getAllToDto);
        Page<GetAllProjectsDto> toReturn = page.map(project -> {
            GetAllProjectsDto dto = projectMapper.getAllToDto(project);
            boolean isFollowed = subscriptionRepository
                    .existsByUserIdAndProjectId(userService.getAuthenticated().getId(), project.getProjectId());
            dto.setFollowed(isFollowed);
            return dto;
        });
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
                                    return new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                                            "exception.project.not-found", "ID", projectId));
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
                                    return new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                                            "exception.project.not-found", "url", url));
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
                                    return new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                                            "exception.project.not-found", "title", title));
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

    public SubscribeResponseDto subscribeUserToProject(String projectId) {
        String userId = userService.getAuthenticated().getId();
        String projUrl = getProjectUriIfExist(projectId);
        Optional<ProjectSubscribeEntity> existingSubscription =
                subscriptionRepository.findByUserIdAndProjectId(userId, projectId);
        if (existingSubscription.isPresent()) {
            return new SubscribeResponseDto("User is already subscribed to project " + projectId);
        } else {
            saveSubscription(projectId);
            emailService.sendProjectSubscriptionMessage(projectId, projUrl);
            return new SubscribeResponseDto("User subscribed to project " + projectId + " successfully");
        }
    }

    public ProjectResponseDto updateProject(String projectId, ProjectCreateRequestDto projectCreateRequestDto) {
        UserEntity user = userService.getAuthenticated();
        ProjectEntity existingProject = getProjectIfExist(user, projectId);

        ProjectEntity toUpdate = projectMapper.toEntity(projectCreateRequestDto);
        toUpdate.setOwner(user);
        existingProject.setCollectedSum(toUpdate.getCollectedSum());
        existingProject.setDescription(projectCreateRequestDto.getDescription());
        projectRepository.save(existingProject);
        emailService.sendUpdateProjectMail(projectId, existingProject.getUrl());
        return projectMapper.toDto(existingProject);
    }

    private ProjectEntity getProjectIfExist(UserEntity user, String projectId) {
        Optional<ProjectEntity> projectForUpdate = projectRepository.findByOwnerAndProjectId(user, projectId);
        if (projectForUpdate.isEmpty()) {
            throw new RuntimeException("Project not found");
        }
        return projectForUpdate.get();
    }

    private String getProjectUriIfExist(String projectId) {
        Optional<ProjectEntity> projectForUpdate = projectRepository.findBy(projectId);
        if (projectForUpdate.isEmpty()) {
            throw new RuntimeException("Project not found");
        }
        return projectForUpdate.get().getUrl();
    }

    private void saveSubscription(String projectId) {
        ProjectSubscribeEntity subscription = new ProjectSubscribeEntity();
        subscription.setUserId(userService.getAuthenticated().getId());
        subscription.setProjectId(projectId);
        subscriptionRepository.save(subscription);
    }

    public List<ProjectSubscribeDto> getSubscribedUsers(String projectId) {
        List<ProjectSubscribeEntity> listUsers = subscriptionRepository.findUserIdsByProjectId(projectId);
        List<ProjectSubscribeDto> usersId = listUsers.stream()
                .map(projectMapper::toDtoSubscribe)
                .collect(Collectors.toList());

        log.info("List subscribers {}", usersId);
        return usersId;
    }

    public SubscribeResponseDto unsubscribeUserFromProject(String projectId) {
        UserEntity user = userService.getAuthenticated();
        log.info("User {} unsubscribe from project with id {}", user.getUsername(), projectId);
        Optional<ProjectSubscribeEntity> existingSubscription =
                subscriptionRepository.findByUserIdAndProjectId(user.getId(), projectId);
        if (existingSubscription.isEmpty()) {
            throw new ApplicationException(
                    HttpStatus.NOT_FOUND,
                    translator.getLocaleMessage("exception.project.not-subscribe",
                            user.getUsername(), projectId));
        }
        subscriptionRepository.delete(existingSubscription.get());
        String projectUrl = projectRepository.findBy(projectId).orElseThrow().getUrl();
        emailService.sendUnsubscribeMessage(user.getEmail(), projectUrl);
        log.info("User {} has been unsubscribed from project with id {}", user.getUsername(), projectId);
        return new SubscribeResponseDto(translator.getLocaleMessage("project.unsubscribed",
                user.getUsername(), projectId));
    }
}
