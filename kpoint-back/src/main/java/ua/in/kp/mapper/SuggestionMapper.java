package ua.in.kp.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ua.in.kp.config.MapperConfig;
import ua.in.kp.dto.suggestion.SuggestionCreateRequestDto;
import ua.in.kp.dto.suggestion.SuggestionResponseDto;
import ua.in.kp.entity.SuggestionEntity;

@Mapper(config = MapperConfig.class)
public interface SuggestionMapper {
    @Mapping(target = "user.userId", source = "user.id")
    SuggestionResponseDto toDto(SuggestionEntity suggestionEntity);

    SuggestionEntity toEntity(SuggestionCreateRequestDto suggestionCreateRequestDto);

}
