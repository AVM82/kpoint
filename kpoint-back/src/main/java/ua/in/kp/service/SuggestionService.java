package ua.in.kp.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ua.in.kp.dto.suggestion.SuggestionCreateRequestDto;
import ua.in.kp.dto.suggestion.SuggestionResponseDto;
import ua.in.kp.entity.LikeEntity;
import ua.in.kp.entity.SuggestionEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.locale.Translator;
import ua.in.kp.mapper.SuggestionMapper;
import ua.in.kp.repository.LikeRepository;
import ua.in.kp.repository.SuggestionRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class SuggestionService {
    private final SuggestionRepository suggestionRepository;
    private final LikeRepository likeRepository;
    private final SuggestionMapper suggestionMapper;
    private final UserService userService;
    private final Translator translator;

    public SuggestionResponseDto createSuggestion(SuggestionCreateRequestDto suggestionCreateRequestDto) {
        log.info("Create suggestion method started");

        SuggestionEntity suggestionEntity = suggestionMapper.toEntity(suggestionCreateRequestDto);
        suggestionEntity.setUser(userService.getAuthenticated());

        suggestionRepository.save(suggestionEntity);
        log.info("SuggestionEntity saved, id {}", suggestionEntity.getId());

        return suggestionMapper.toDto(suggestionEntity);
    }

    public Page<SuggestionResponseDto> getAllSuggestions(Pageable pageable) {
        UserEntity user = userService.getAuthenticated();
        Page<SuggestionEntity> page = suggestionRepository.findAll(pageable);
        log.info("Got all suggestions from suggestionRepository.");
        Page<SuggestionResponseDto> toReturn = page.map(
                suggestionEntity -> suggestionMapper.toDto(suggestionEntity, user));
        log.info("Map all SuggestionEntity to DTO and return page with them.");
        return toReturn;
    }

    @Transactional
    public SuggestionResponseDto updateLike(String suggestionId) {
        UserEntity user = userService.getAuthenticated();
        SuggestionEntity suggestion = suggestionRepository.findById(suggestionId).orElseThrow(
                () -> {
                    log.warn("Suggestion not found with ID: {}", suggestionId);
                    return new ApplicationException(
                            HttpStatus.NOT_FOUND, "Suggestion not found with ID: " + suggestionId);
                });
        log.info("The suggestion to update is retrieved from database ");
        boolean userLiked = likeRepository.existsByUserAndSuggestion(user, suggestion);

        if (userLiked) {
            log.info("The suggestion is liked by logged in user with ID: {} ", user.getId());
            likeRepository.deleteBySuggestionAndUser(suggestion, user);
            suggestion.setLikeCount(suggestion.getLikeCount() - 1);
        } else {
            log.info("The suggestion is not liked by logged in user with ID: {} ", user.getId());
            LikeEntity likeEntity = new LikeEntity();
            likeEntity.setUser(user);
            likeEntity.setSuggestion(suggestion);
            likeRepository.save(likeEntity);
            suggestion.setLikeCount(suggestion.getLikeCount() + 1);
        }

        SuggestionResponseDto dto = suggestionMapper.toDto(suggestionRepository.save(suggestion), user);
        log.info("The suggestion`s like counter is updated");
        dto.setLiked(!userLiked);
        return dto;
    }

    public void deleteSuggestion(String suggestionId) {
        if (!suggestionRepository.existsById(suggestionId)) {
            log.warn("Suggestion not found with ID: {}", suggestionId);
            throw new ApplicationException(HttpStatus.NOT_FOUND, translator.getLocaleMessage(
                    "exception.suggestion.not-found", "ID", suggestionId));
        }
        suggestionRepository.deleteById(suggestionId);
        log.info("The suggestion is deleted with ID: {} ", suggestionId);
    }
}
