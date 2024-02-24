package ua.in.kp.service;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.in.kp.dto.ApiResponse;
import ua.in.kp.dto.user.UserRegisterRequestDto;
import ua.in.kp.dto.user.UserResponseDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.enumeration.UserRole;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.locale.Translator;
import ua.in.kp.mapper.UserMapper;
import ua.in.kp.repository.ApplicantRepository;
import ua.in.kp.repository.TagRepository;
import ua.in.kp.repository.UserRepository;

import java.util.List;

@Service
@Transactional(readOnly = true)
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService customUserDetailsService;
    private final ApplicantRepository applicantRepository;
    private final Translator translator;
    private final MeterRegistry meterRegistry;

    public UserService(UserRepository userRepository, TagRepository tagRepository,
                       UserMapper userMapper, PasswordEncoder passwordEncoder,
                       UserDetailsService customUserDetailsService, ApplicantRepository applicantRepository,
                       Translator translator, MeterRegistry meterRegistry) {
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.customUserDetailsService = customUserDetailsService;
        this.applicantRepository = applicantRepository;
        this.translator = translator;
        this.meterRegistry = meterRegistry;

        Gauge.builder("users_count", userRepository::count)
                .description("A current number of users in the system")
                .register(meterRegistry);
    }

    @Transactional
    public UserResponseDto create(UserRegisterRequestDto dto) {
        UserEntity mappedEntity = userMapper.toEntity(dto);
        mappedEntity.setPassword(passwordEncoder.encode(mappedEntity.getPassword()));
        mappedEntity.getTags().forEach(t -> tagRepository.saveByNameIfNotExist(t.getName()));
        applicantRepository.findByEmail(dto.email())
                .ifPresent(a -> {
                    mappedEntity.setAvatarImgUrl(a.getAvatarImgUrl());
                    applicantRepository.delete(a);
                });
        return userMapper.toDto(userRepository.save(mappedEntity));
    }

    public List<UserResponseDto> getAll(Pageable pageable) {
        log.info("getAll");
        UserEntity currentUser = getAuthenticated();
        Page<UserEntity> allUsers;
        if (currentUser.getRoles().contains(UserRole.ADMIN)) {
            allUsers = userRepository.findAllByAdmin(pageable);
        } else {
            allUsers = userRepository.findAll(pageable);
        }
        return allUsers.stream()
                .map(userMapper::toDto)
                .toList();
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public UserEntity getAuthenticated() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (UserEntity) customUserDetailsService.loadUserByUsername(email);
    }

    public UserResponseDto getByEmailFetchTagsSocialsRoles(String email) {
        return userMapper.toDto(getByEmail(email));
    }

    @Transactional
    public UserResponseDto banUserById(String userId) {
        log.info("banUserById {}", userId);
        UserEntity userFromDb = userRepository.findById(userId).orElseThrow(() -> {
            log.warn("Can't find user by id {}", userId);
            return new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                    "exception.user.not-found", "id", userId));
        });
        userRepository.delete(userFromDb);
        return userMapper.toDto(userFromDb);
    }

    @Transactional
    public UserResponseDto unBanUserById(String userId) {
        log.info("unBanUserById {}", userId);
        userRepository.unBanUserByIdForAdmin(userId);
        UserEntity userFromDb = userRepository.findByIdForAdmin(userId).orElseThrow(() -> {
            log.warn("Can't find user by id {}", userId);
            return new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                    "exception.user.not-found", "id", userId));
        });
        return userMapper.toDto(userFromDb);
    }

    public UserEntity getByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> {
            log.warn("Can't find user by email {}", email);
            return new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                    "exception.user.not-found", "email", email));
        });
    }

    public Page<ProjectEntity> getUserEntityByUsernameFetchedFavouriteProjects(String username, Pageable pageable) {
        return userRepository.findByUsernameFetchProjectsFavourite(username, pageable);
    }

    public UserEntity getByUsername(String username) {
        return userRepository.findByUsernameFetchNothing(username).orElseThrow(() -> {
            log.warn("Can't find user by username {}", username);
            return new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                    "exception.user.not-found", "username", username));
        });
    }

    public boolean checkIfValidOldPassword(UserEntity user, String oldPassword) {
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    @Transactional
    public void changeUserPassword(UserEntity user, String newPassword) {
        log.info("Change password for user {}", user.getUsername());
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public UserEntity getById(String id) {
        return userRepository.findById(id).orElseThrow(() ->
                new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                        "exception.user.not-found", "id", id)));
    }

    public ApiResponse verifyExistsEmail(String email) {
        if (!existsByEmail(email)) {
            throw new ApplicationException(HttpStatus.NOT_FOUND, "User with email " + email + " not found");
        }
        return new ApiResponse(translator.getLocaleMessage(
                "exception.user.register-email-failed", email));
    }

    public ApiResponse verifyExistsUsername(String username) {
        if (!userRepository.existsByUsername(username)) {
            throw new ApplicationException(HttpStatus.NOT_FOUND, "User " + username + " not found");
        }
        return new ApiResponse(translator.getLocaleMessage(
                "exception.user.register-username-failed", username));
    }
}
