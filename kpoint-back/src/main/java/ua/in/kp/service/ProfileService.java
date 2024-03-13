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
import ua.in.kp.repository.TagRepository;
import ua.in.kp.repository.UserRepository;
import ua.in.kp.util.PatchUtil;

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
    private final TagRepository tagRepository;
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
        Page<GetAllProjectsDto> dtos = userService
                .getUserEntityByUsernameFetchedFavouriteProjects(user.getUsername(), pageable)
                .map(projectMapper::getAllToDto);
        log.info("{}", dtos.getTotalElements());
        return dtos;
    }

    @Transactional(readOnly = true)
    public Page<GetAllProjectsDto> getSubscribedProjects(Pageable pageable) {
        UserEntity user = userService.getAuthenticated();
        log.info("Get subscribed projects for user {}", user.getUsername());
        return subscriptionRepository.findByUserId(user.getId(), pageable)
                .map(ProjectSubscribeEntity::getProject)
                .map(projectMapper::getAllToDto);
    }

    @Transactional(readOnly = true)
    public Page<GetAllProjectsDto> getRecommendedProjectsById(Pageable pageable) {
        UserEntity user = userService.getAuthenticated();
        log.info("Get recommended projects for user {}", user.getUsername());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return projectService.retrieveRecommendedProjectsById(user.getId(), pageable)
                .map(project -> {
                    boolean isFollowed = projectService.checkIsFollowed(project, auth);
                    GetAllProjectsDto dto = projectMapper.projectEntityToGetAllDto(project);
                    dto.setFollowed(isFollowed);
                    return dto;
                });
    }

    public Page<GetAllProjectsDto> getRecommendedProjects(Pageable pageable) {
        UserEntity user = userService.getAuthenticated();
        log.info("Get recommended projects for user {}", user.getUsername());
        Set<String> subscribedProjectIds =
                subscriptionRepository.findByUserId(user.getId(), pageable).stream()
                        .map(projectSubscribeEntity -> projectSubscribeEntity.getProject().getProjectId())
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

    @Transactional
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
        if (!email.equals(patchedDto.email()) && userRepository.existsByEmail(patchedDto.email())) {
            log.warn("cannot update user data: email {} already", patchedDto.email());
            throw new ApplicationException(HttpStatus.BAD_REQUEST,
                    translator.getLocaleMessage("exception.register-email-failed", patchedDto.email()));
        }
        patchedDto.tags().forEach(tag -> tagRepository.saveByNameIfNotExist(tag.toLowerCase()));
        UserEntity updatedUser = userRepository.save(userMapper.changeDtoToEntity(patchedDto, userEntity));
        UserEntity savedUser = userRepository.save(updatedUser);
        return userMapper.toChangeDto(savedUser);
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
