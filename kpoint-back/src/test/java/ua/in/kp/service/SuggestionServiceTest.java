package ua.in.kp.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ua.in.kp.dto.suggestion.SuggestionCreateRequestDto;
import ua.in.kp.dto.suggestion.SuggestionResponseDto;
import ua.in.kp.dto.suggestion.SuggestionUserDto;
import ua.in.kp.entity.SuggestionEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.mapper.SuggestionMapper;
import ua.in.kp.repository.LikeRepository;
import ua.in.kp.repository.SuggestionRepository;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SuggestionServiceTest {
    @Captor
    private ArgumentCaptor<SuggestionEntity> captor;
    @Mock
    private SuggestionMapper suggestionMapper;
    @Mock
    private UserService userService;
    @Mock
    private LikeRepository likeRepository;
    @Mock
    private SuggestionRepository suggestionRepository;
    @InjectMocks
    private SuggestionService testObject;

    @Test
    void createSuggestion() {
        SuggestionEntity suggestion = new SuggestionEntity();
        UserEntity user = new UserEntity();
        SuggestionCreateRequestDto suggestionCreateRequestDto = new SuggestionCreateRequestDto("suggestion");
        SuggestionResponseDto suggestionResponseDto = getResponseDto();

        when(suggestionMapper.toEntity(suggestionCreateRequestDto)).thenReturn(suggestion);
        when(userService.getAuthenticated()).thenReturn(user);
        when(suggestionRepository.save(suggestion)).thenReturn(suggestion);
        when(suggestionMapper.toDto(suggestion)).thenReturn(suggestionResponseDto);

        SuggestionResponseDto responseDto = testObject.createSuggestion(suggestionCreateRequestDto);

        assertNotNull(responseDto);
        verify(suggestionMapper).toEntity(suggestionCreateRequestDto);
        verify(suggestionMapper).toDto(suggestion);
        verify(userService).getAuthenticated();
        verify(suggestionRepository).save(suggestion);
    }

    @Test
    void updateLike() {
        UserEntity user = new UserEntity();
        SuggestionEntity suggestion = new SuggestionEntity();
        suggestion.setId("id");
        suggestion.setLikeCount(2);
        SuggestionResponseDto suggestionResponseDto = getResponseDto();

        when(userService.getAuthenticated()).thenReturn(user);
        when(suggestionRepository.findById("id")).thenReturn(java.util.Optional.of(suggestion));
        when(likeRepository.existsByUserAndSuggestion(user, suggestion)).thenReturn(true);
        doNothing().when(likeRepository).deleteBySuggestionAndUser(suggestion, user);
        when(suggestionRepository.save(any(SuggestionEntity.class))).thenReturn(suggestion);
        when(suggestionMapper.toDto(suggestion)).thenReturn(suggestionResponseDto);

        testObject.updateLike("id");

        verify(suggestionRepository).findById("id");
        verify(suggestionRepository).save(captor.capture());
        verify(suggestionMapper).toDto(suggestion);
        verify(likeRepository).deleteBySuggestionAndUser(suggestion, user);

        assertEquals(1, captor.getValue().getLikeCount());
    }

    @Test
    void getAllSuggestions() {
        Pageable pageable = Mockito.mock(Pageable.class);
        Page<SuggestionEntity> page = mock(Page.class);

        when(suggestionRepository.findAll(pageable)).thenReturn(page);

        testObject.getAllSuggestions(pageable);

        verify(suggestionRepository).findAll(pageable);
        verify(page).map(any());
    }

    @Test
    void deleteSuggestion_whenNotFound_throwsException() {
        String id = "id";
        when(suggestionRepository.existsById(id)).thenReturn(false);

        assertThrows(NoSuchElementException.class, () -> testObject.deleteSuggestion(id));

        verify(suggestionRepository).existsById(id);
    }

    private SuggestionResponseDto getResponseDto() {
        return new SuggestionResponseDto(
                "id",
                new SuggestionUserDto("userId", "John", "Doe"),
                "Sample suggestion content",
                5,
                LocalDateTime.now()
        );
    }
}
