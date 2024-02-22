package ua.in.kp.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.http.HttpStatus;
import ua.in.kp.exception.ApplicationException;

public class PatchUtil {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private PatchUtil() {
    }

    public static <T> T applyPatch(JsonPatch patch, T dto, Class<T> dtoClass) {
        try {
            JsonNode patched = patch.apply(objectMapper.convertValue(dto, JsonNode.class));
            return objectMapper.treeToValue(patched, dtoClass);
        } catch (JsonPatchException | JsonProcessingException e) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, "Failed to apply patch to DTO");
        }
    }
}
