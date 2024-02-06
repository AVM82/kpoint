package ua.in.kp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.in.kp.dto.suggestion.SuggestionCreateRequestDto;
import ua.in.kp.dto.suggestion.SuggestionResponseDto;
import ua.in.kp.service.SuggestionService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/suggestions")
public class SubjectController {

    private final SuggestionService suggestionService;

    @PostMapping()
    public ResponseEntity<SuggestionResponseDto> createSuggestion(
        @Valid @RequestBody SuggestionCreateRequestDto suggestionCreateRequestDto) {
        return new ResponseEntity<>(suggestionService.createSuggestion(suggestionCreateRequestDto), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<Page<SuggestionResponseDto>> getAllSuggestions(Pageable pageable) {
        return new ResponseEntity<>(suggestionService.getAllSuggestions(pageable), HttpStatus.OK);
    }
}
