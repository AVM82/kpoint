package ua.in.kp.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Locale;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Bean(name = "messageSource")
    public MessageSource getMessageSource() {
        final ReloadableResourceBundleMessageSource res =
                new ReloadableResourceBundleMessageSource();
        res.setDefaultEncoding("UTF-8");
        res.setFallbackToSystemLocale(false);
        res.addBasenames("classpath:messages");
        return res;
    }

    @Bean
    public MessageSourceAccessor getMessageSourceAccessor(final MessageSource messageSource) {
        return new MessageSourceAccessor(messageSource, Locale.ENGLISH);
    }

    @Bean
    @Override
    public LocalValidatorFactoryBean getValidator() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        bean.setValidationMessageSource(getMessageSource());
        return bean;
    }
}
