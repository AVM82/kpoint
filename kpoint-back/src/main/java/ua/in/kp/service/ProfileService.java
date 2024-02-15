package ua.in.kp.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import ua.in.kp.mapper.ProjectMapper;
import ua.in.kp.mapper.UserMapper;
import ua.in.kp.repository.UserRepository;

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
    private final ObjectMapper objectMapper;

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
        return new ProjectsProfileResponseDto(userEntity.getId(), recommendedProjectsDtos);
    }

    public UserChangeDto updateUserData(String username, JsonPatch patch) {
        log.info("update user data by username {}", username);
        UserEntity userEntity = userService.getByUsername(username);
        UserChangeDto userChangeDto = userMapper.toChangeDto(userEntity);
        UserChangeDto patchedDto = applyPatchToCustomer(patch, userChangeDto);
        UserEntity updatedUser = userRepository.save(userMapper.changeDtoToEntity(patchedDto, userEntity));
        return userMapper.toChangeDto(updatedUser);
    }

    public void changePassword(String username, PasswordDto dto) {
        log.info("change password by username {}", username);
        UserEntity user = userService.getByUsername(username);

        if (!userService.checkIfValidOldPassword(user, dto.oldPassword())) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, "Invalid old password");
        }
        userService.changeUserPassword(user, dto.newPassword());
    }

    protected UserChangeDto applyPatchToCustomer(JsonPatch patch, Record userDto) {
        try {
            JsonNode patched = patch.apply(objectMapper.convertValue(userDto, JsonNode.class));
            return objectMapper.treeToValue(patched, UserChangeDto.class);
        } catch (JsonPatchException | JsonProcessingException e) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, "User cannot be updated");
        }
    }
}
