package ua.in.kp.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ua.in.kp.dto.profile.PasswordDto;
import ua.in.kp.dto.profile.ProjectsProfileResponseDto;
import ua.in.kp.dto.profile.UserChangeDto;
import ua.in.kp.dto.project.GetAllProjectsDto;
import ua.in.kp.dto.subscribtion.MessageResponseDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.ProjectSubscribeEntity;
import ua.in.kp.entity.TagEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.locale.Translator;
import ua.in.kp.mapper.ProjectMapper;
import ua.in.kp.mapper.UserMapper;
import ua.in.kp.repository.SubscriptionRepository;
import ua.in.kp.repository.UserRepository;
import ua.in.kp.util.PatchUtil;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserService userService;
    private final ProjectService projectService;
    private final ProjectMapper projectMapper;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final S3Service s3Service;
    private final Translator translator;

    public Page<GetAllProjectsDto> getMyProjects(Pageable pageable) {
        log.info("Get my projects");
        UserEntity user = userService.getAuthenticated();
        return projectService.getProjectsByUser(user, pageable).map(projectMapper::getAllToDto);
    }

    @Transactional(readOnly = true)
    public Page<GetAllProjectsDto> getFavouriteProjects(Pageable pageable) {
        UserEntity user = userService.getAuthenticated();
        log.info("Get favourite projects for user {}", user.getUsername());
        return userService.getUserEntityByUsernameFetchedFavouriteProjects(user.getUsername(), pageable)
                .map(projectMapper::getAllToDto);
    }

    @Transactional(readOnly = true)
    public Page<GetAllProjectsDto> getSubscribedProjects(Pageable pageable) {
        UserEntity user = userService.getAuthenticated();
        log.info("Get favourite projects for user {}", user.getUsername());
        List<String> projectIds =
                subscriptionRepository.findByUserId(user.getId(), pageable)
                        .map(ProjectSubscribeEntity::getProjectId)
                        .toList();
        return projectService.getProjectByIds(projectIds, pageable);
    }

    public Page<GetAllProjectsDto> getRecommendedProjects(Pageable pageable) {
        UserEntity user = userService.getAuthenticated();
        log.info("Get recommended projects for user {}", user.getUsername());
        Set<String> subscribedProjectIds =
                subscriptionRepository.findByUserId(user.getId(), pageable).stream()
                        .map(ProjectSubscribeEntity::getProjectId)
                        .collect(Collectors.toSet());
        Set<String> ownedProjectIds =
                projectService.getProjectsByUser(user, pageable).stream()
                        .map(ProjectEntity::getProjectId)
                        .collect(Collectors.toSet());
        subscribedProjectIds.addAll(ownedProjectIds);
        Set<TagEntity> tags = userRepository.findByEmail(user.getEmail()).orElseThrow().getTags();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return projectService.retrieveRecommendedProjects(tags, subscribedProjectIds, pageable)
                .map(project -> {
                    boolean isFollowed = projectService.checkIsFollowed(project, auth);
                    GetAllProjectsDto dto = projectMapper.projectEntityToGetAllDto(project);
                    dto.setFollowed(isFollowed);
                    return dto;
                });
    }

    public ProjectsProfileResponseDto getRecommendedProjectsByFavourite(Pageable pageable) {
        UserEntity user = userService.getAuthenticated();
        log.info("Get recommended projects for user {}", user.getUsername());
        UserEntity userEntity =
                userService.getByEmail(user.getEmail());
        Set<TagEntity> tags = userEntity.getTags();
        Set<ProjectEntity> allProjects = userEntity.getProjectsOwned();
        allProjects.addAll(userEntity.getProjectsFavourite());
        Set<String> projectsIds = projectService.retrieveProjectsIds(allProjects);
        Page<GetAllProjectsDto> recommendedProjectsDtos =
                projectService.retrieveRecommendedProjects(tags, projectsIds, pageable)
                        .map(projectMapper::getAllToDto);
        return new ProjectsProfileResponseDto(userEntity.getId(), recommendedProjectsDtos);
    }

    public UserChangeDto updateUserData(String email, JsonPatch patch) {
        log.info("update user data by user with email {}", email);
        UserEntity userEntity = userService.getByEmail(email);
        UserChangeDto userChangeDto = userMapper.toChangeDto(userEntity);
        UserChangeDto patchedDto;
        try {
            patchedDto = PatchUtil.applyPatch(patch, userChangeDto, UserChangeDto.class);
        } catch (JsonPatchException | JsonProcessingException e) {
            log.warn("cannot update user data by username {}", userEntity.getUsername());
            throw new ApplicationException(HttpStatus.BAD_REQUEST,
                    translator.getLocaleMessage("exception.user.cannot-updated"));
        }
        UserEntity updatedUser = userRepository.save(userMapper.changeDtoToEntity(patchedDto, userEntity));
        return userMapper.toChangeDto(updatedUser);
    }

    public void changePassword(String email, PasswordDto dto) {
        log.info("change password by user with email {}", email);
        UserEntity user = userService.getByEmail(email);

        if (!userService.checkIfValidOldPassword(user, dto.oldPassword())) {
            log.warn("cannot change password by username {}", user.getUsername());
            throw new ApplicationException(HttpStatus.BAD_REQUEST, translator.getLocaleMessage(
                    "exception.user.invalid-old-password"));
        }
        userService.changeUserPassword(user, dto.newPassword());
    }

    public MessageResponseDto updateUserAvatar(String email, MultipartFile file) {
        log.info("update avatar by user {}", email);
        UserEntity userEntity = userService.getByEmail(email);
        userEntity.setAvatarImgUrl(s3Service.uploadLogo(file));
        return new MessageResponseDto(userRepository.save(userEntity).getAvatarImgUrl());
    }
}
