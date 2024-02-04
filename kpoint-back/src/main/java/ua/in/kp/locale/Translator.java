package ua.in.kp.locale;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class Translator {

    private final MessageSource messageSource;

    public String getLocaleMessage(String msgCode, Object... args) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(msgCode, args, locale);
    }
}
