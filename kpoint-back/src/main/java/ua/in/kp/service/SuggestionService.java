package ua.in.kp.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ua.in.kp.dto.suggestion.SuggestionCreateRequestDto;
import ua.in.kp.dto.suggestion.SuggestionResponseDto;
import ua.in.kp.entity.LikeEntity;
import ua.in.kp.entity.SuggestionEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.mapper.SuggestionMapper;
import ua.in.kp.repository.LikeRepository;
import ua.in.kp.repository.SuggestionRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SuggestionService {
    private final SuggestionRepository suggestionRepository;
    private final LikeRepository likeRepository;
    private final SuggestionMapper suggestionMapper;
    private final UserService userService;

    public SuggestionResponseDto createSuggestion(SuggestionCreateRequestDto suggestionCreateRequestDto) {
        log.info("Create suggestion method started");

        SuggestionEntity suggestionEntity = suggestionMapper.toEntity(suggestionCreateRequestDto);
        suggestionEntity.setUser(userService.getAuthenticated());
        log.info(userService.getAuthenticated().toString());
        suggestionRepository.save(suggestionEntity);
        log.info("SuggestionEntity saved, id {}", suggestionEntity.getId());

        return suggestionMapper.toDto(suggestionEntity);
    }

    public Page<SuggestionResponseDto> getAllSuggestions(Pageable pageable) {
        Page<SuggestionEntity> page = suggestionRepository.findAll(pageable);
        log.info("Got all suggestions from suggestionRepository.");
        Page<SuggestionResponseDto> toReturn = page.map(suggestionMapper::toDto);
        log.info("Map all SuggestionEntity to DTO and return page with them.");
        return toReturn;
    }

    public SuggestionResponseDto updateLike(String suggestionId) {
        UserEntity user = userService.getAuthenticated();
        SuggestionEntity suggestion = suggestionRepository.findById(suggestionId).orElseThrow();
        Optional<LikeEntity> optionalLike = likeRepository.findByUserAndSuggestion(user, suggestion);
        if (optionalLike.isEmpty()) {
            LikeEntity likeEntity = new LikeEntity();
            likeEntity.setUser(user);
            likeEntity.setSuggestion(suggestion);
            likeRepository.save(likeEntity);

            suggestion.setLikeCount(suggestion.getLikeCount() + 1);
        } else {
            likeRepository.delete(optionalLike.get());
            suggestion.setLikeCount(suggestion.getLikeCount() - 1);
        }
        return suggestionMapper.toDto(suggestionRepository.save(suggestion));
    }

    @Transactional
    public void deleteSuggestion(String suggestionId) {
        likeRepository.deleteAllBySuggestionId(suggestionId);
        suggestionRepository.deleteById(suggestionId);
    }
}
