package ua.in.kp.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.in.kp.dto.profile.PasswordDto;
import ua.in.kp.dto.profile.ProjectsProfileResponseDto;
import ua.in.kp.dto.profile.UserChangeDto;
import ua.in.kp.dto.project.GetAllProjectsDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.TagEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.locale.Translator;
import ua.in.kp.mapper.ProjectMapper;
import ua.in.kp.mapper.UserMapper;
import ua.in.kp.repository.UserRepository;
import ua.in.kp.util.PatchUtil;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserService userService;
    private final ProjectService projectService;
    private final ProjectMapper projectMapper;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final Translator translator;

    public ProjectsProfileResponseDto getMyProjects(String username, Pageable pageable) {
        UserEntity userEntity = userService.getByUsername(username);
        Page<GetAllProjectsDto> ownedProjectsDtos = projectService.getProjectsByUser(userEntity, pageable)
                .map(projectMapper::getAllToDto);
        return new ProjectsProfileResponseDto(userEntity.getId(),
                ownedProjectsDtos);
    }

    @Transactional(readOnly = true)
    public ProjectsProfileResponseDto getFavouriteProjects(String username, Pageable pageable) {
        UserEntity userEntity = userService.getByUsername(username);
        Page<GetAllProjectsDto> favouriteProjectsDtos =
                userService.getUserEntityByUsernameFetchedFavouriteProjects(username, pageable)
                        .map(projectMapper::getAllToDto);
        return new ProjectsProfileResponseDto(userEntity.getId(),
                favouriteProjectsDtos);
    }

    public Page<GetAllProjectsDto> getRecommendedProjects(String email, Pageable pageable) {
        UserEntity userEntity =
                userService.getUserEntityByEmailFetchedTagsFavouriteAndOwnedProjects(email);
        Set<TagEntity> tags = userEntity.getTags();
        Set<ProjectEntity> allProjects = userEntity.getProjectsOwned();
        allProjects.addAll(userEntity.getProjectsFavourite());
        Set<String> projectsIds = projectService.retrieveProjectsIds(allProjects);
        return projectService.retrieveRecommendedProjects(tags, projectsIds, pageable)
                .map(projectMapper::getAllToDto);
    }

    public UserChangeDto updateUserData(String username, JsonPatch patch) {
        log.info("update user data by username {}", username);
        UserEntity userEntity = userService.getByUsername(username);
        UserChangeDto userChangeDto = userMapper.toChangeDto(userEntity);
        UserChangeDto patchedDto;
        try {
            patchedDto = PatchUtil.applyPatch(patch, userChangeDto, UserChangeDto.class);
        } catch (JsonPatchException | JsonProcessingException e) {
            log.warn("cannot update user data by username {}", username);
            throw new ApplicationException(HttpStatus.BAD_REQUEST,
                    translator.getLocaleMessage("exception.user.cannot-updated"));
        }
        UserEntity updatedUser = userRepository.save(userMapper.changeDtoToEntity(patchedDto, userEntity));
        return userMapper.toChangeDto(updatedUser);
    }

    public void changePassword(String username, PasswordDto dto) {
        log.info("change password by username {}", username);
        UserEntity user = userService.getByUsername(username);

        if (!userService.checkIfValidOldPassword(user, dto.oldPassword())) {
            log.warn("cannot change password by username {}", username);
            throw new ApplicationException(HttpStatus.BAD_REQUEST, translator.getLocaleMessage(
                    "exception.user.invalid-old-password"));
        }
        userService.changeUserPassword(user, dto.newPassword());
    }
}
