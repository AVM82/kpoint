package ua.in.kp.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;

public class PatchUtil {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private PatchUtil() {
    }

    public static <T> T applyPatch(JsonPatch patch, T dto, Class<T> dtoClass)
            throws JsonPatchException, JsonProcessingException {
        JsonNode patched = patch.apply(objectMapper.convertValue(dto, JsonNode.class));
        return objectMapper.treeToValue(patched, dtoClass);
    }
}
