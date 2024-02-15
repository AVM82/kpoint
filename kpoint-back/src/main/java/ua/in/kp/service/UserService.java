package ua.in.kp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.in.kp.dto.user.UserRegisterRequestDto;
import ua.in.kp.dto.user.UserResponseDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.enumeration.UserRole;
import ua.in.kp.mapper.UserMapper;
import ua.in.kp.repository.ApplicantRepository;
import ua.in.kp.repository.TagRepository;
import ua.in.kp.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService customUserDetailsService;
    private final ApplicantRepository applicantRepository;

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
        UserEntity userFromDb = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Can't find user by email " + email));
        return userMapper.toDto(userFromDb);
    }

    @Transactional
    public UserResponseDto banUserById(String userId) {
        log.info("banUserById {}", userId);
        UserEntity userFromDb = userRepository.findById(userId).orElseThrow(() -> {
            log.warn("Can't find user by id {}", userId);
            return new UsernameNotFoundException("Can't find user by id " + userId);
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
            return new UsernameNotFoundException("Can't find user by id " + userId);
        });
        return userMapper.toDto(userFromDb);
    }

    public UserEntity getUserEntityByUsernameFetchedTagsFavouriteAndOwnedProjects(String username) {
        return userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("Can't find user by username " + username));
    }

    public UserEntity getUserEntityByUsernameFetchedOwnedProjects(String username) {
        return userRepository.findByUsernameFetchProjectsOwned(username).orElseThrow(() ->
                new UsernameNotFoundException("Can't find user by username " + username));
    }

    public Page<ProjectEntity> getUserEntityByUsernameFetchedFavouriteProjects(String username, Pageable pageable) {
        return userRepository.findByUsernameFetchProjectsFavourite(username, pageable);
    }

    public UserEntity getByUsername(String username) {
        return userRepository.findByUsernameFetchNothing(username).orElseThrow(() ->
                new UsernameNotFoundException("Can't find user by username " + username));
    }

    public UserEntity getByUsernameFetchTagsSocials(String username) {
        return userRepository.findByUsernameFetchTagsSocials(username).orElseThrow(() ->
                new UsernameNotFoundException("Can't find user by username " + username));
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
                new UsernameNotFoundException("Can't find user by id " + id));
    }
}
