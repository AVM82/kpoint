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

import java.util.NoSuchElementException;

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
        UserEntity user = userService.getAuthenticated();

        SuggestionEntity suggestionEntity = suggestionMapper.toEntity(suggestionCreateRequestDto);
        suggestionEntity.setUser(userService.getAuthenticated());

        suggestionRepository.save(suggestionEntity);
        log.info("SuggestionEntity saved, id {}", suggestionEntity.getId());

        return suggestionMapper.toDto(suggestionEntity, user);
    }

    public Page<SuggestionResponseDto> getAllSuggestions(Pageable pageable) {
        // if authenticated trying to grab likes if not just taking everything
        UserEntity user = userService.getAuthenticated();
        Page<SuggestionEntity> page = suggestionRepository.findAll(pageable);
        log.info("Got all suggestions from suggestionRepository.");
        Page<SuggestionResponseDto> toReturn = page.map(suggestionEntity -> suggestionMapper.toDto(suggestionEntity, user));

//        for (SuggestionEntity suggestionEntity : page.getContent()) {
//            for (LikeEntity likeEntity : suggestionEntity.getLikes()) {
//                log.info("Like ID: {}", likeEntity.getId());
//                log.info("Like User email: {}", likeEntity.getUser().getEmail());
//                log.info("ContextUser email: {}", user.getEmail());
//
//                if ( likeEntity.getUser().getEmail().equals(user.getEmail())){
//                   toReturn = page.map(suggestionMapper::toDto);
//                }
//
//            }
//        }

        log.info("Map all SuggestionEntity to DTO and return page with them.");
        return toReturn;
    }

    @Transactional
    public SuggestionResponseDto updateLike(String suggestionId) {
        UserEntity user = userService.getAuthenticated();
        SuggestionEntity suggestion = suggestionRepository.findById(suggestionId).orElseThrow();

        boolean userLiked = likeRepository.existsByUserAndSuggestion(user, suggestion);

        if (userLiked) {
            likeRepository.deleteBySuggestionAndUser(suggestion, user);
            suggestion.setLikeCount(suggestion.getLikeCount() - 1);
        } else {
            LikeEntity likeEntity = new LikeEntity();
            likeEntity.setUser(user);
            likeEntity.setSuggestion(suggestion);
            likeRepository.save(likeEntity);

            suggestion.setLikeCount(suggestion.getLikeCount() + 1);
        }
        return suggestionMapper.toDto(suggestionRepository.save(suggestion), user);
    }

    public void deleteSuggestion(String suggestionId) {
        if (!suggestionRepository.existsById(suggestionId)) {
            throw new NoSuchElementException("Suggestion not found with ID: " + suggestionId);
        }
        suggestionRepository.deleteById(suggestionId);
    }
}
