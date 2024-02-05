package ua.in.kp.service;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ua.in.kp.dto.user.UserLoginRequestDto;
import ua.in.kp.dto.user.UserLoginResponseDto;
import ua.in.kp.dto.user.UserRegisterRequestDto;
import ua.in.kp.dto.user.UserResponseDto;
import ua.in.kp.entity.ApplicantEntity;
import ua.in.kp.mapper.ApplicantMapper;
import ua.in.kp.repository.ApplicantRepository;
import ua.in.kp.security.JwtUtil;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserService userService;
    private final ApplicantRepository applicantRepository;
    private final ApplicantMapper applicantMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UserResponseDto register(UserRegisterRequestDto requestDto) {
        if (userService.existsByEmail(requestDto.email())) {
            throw new EntityExistsException(
                    "User with email " + requestDto.email() + " already exist");
        }
        return userService.create(requestDto);
    }

    public UserLoginResponseDto login(UserLoginRequestDto dto) {
        Authentication authentication = authenticationManager
                .authenticate(
                        new UsernamePasswordAuthenticationToken(dto.email(), dto.password()));
        return new UserLoginResponseDto(
                jwtUtil.generateToken(authentication.getName()),
                userService.getByEmailFetchTagsSocialsRoles(authentication.getName())
        );
    }

    public UserLoginResponseDto oauth2Login(ApplicantEntity applicant) {
        UserLoginResponseDto responseDto;
        if (userService.existsByEmail(applicant.getEmail())) {
            UserResponseDto userFromDb = userService
                    .getByEmailFetchTagsSocialsRoles(applicant.getEmail());
            responseDto = new UserLoginResponseDto(
                    jwtUtil.generateToken(userFromDb.email()), userFromDb);
            log.info("User already registered, return response dto");
        } else {
            ApplicantEntity finalApplicant = applicant;
            applicant = applicantRepository.findByEmail(applicant.getEmail())
                    .orElseGet(() -> applicantRepository.save(finalApplicant));
            responseDto = new UserLoginResponseDto(
                    null, applicantMapper.toDto(applicant));
            log.info("User was saved as applicant.");
        }
        return responseDto;
    }
}