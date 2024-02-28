package ua.in.kp.service;

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.util.Objects;
import java.util.UUID;

@Service
@Slf4j
public class S3Service {
    public static final int WIDTH = 240;
    public static final int HEIGHT = 240;
    public static final String DEFAULT_LOGO_URI = "https://kpoint-image.s3.eu-north-1.amazonaws.com/test-logo/default-logo.jpg";

    private final S3Client s3Client;
    private final String s3Bucket;

    private final String folder;

    public S3Service(S3Client s3Client, @Value("${aws.s3.bucket}") String s3Bucket,
                     @Value("${aws.s3.bucket.folder}") String folder) {
        this.s3Client = s3Client;
        this.s3Bucket = s3Bucket;
        this.folder = folder;
    }

    public String uploadLogo(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return DEFAULT_LOGO_URI;
        }
        validateFileSize(file);
        validateFileType(file);
        try {
            byte[] logoBytes = compressImage(file);

            String logoImgUrl = UUID.randomUUID() + ".jpg";
            s3Client.putObject(PutObjectRequest.builder()
                    .bucket(s3Bucket)
                    .key(folder + logoImgUrl)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build(), RequestBody.fromBytes(logoBytes));

            log.info("Logo was uploaded to S3");
            return s3Client.utilities().getUrl(GetUrlRequest.builder()
                    .bucket(s3Bucket)
                    .key(folder + logoImgUrl)
                    .build()).toExternalForm();
        } catch (Exception e) {
            log.warn("Logo could not be loaded on S3 ");
            return e.getMessage();
        }
    }

    private void validateFileSize(MultipartFile file) {
        if (file.getSize() > 3 * 1024 * 1024) {
            throw new IllegalArgumentException("The file size must not exceed 3 MB");
        }
    }

    private void validateFileType(MultipartFile file) {
        if (!Objects.requireNonNull(file.getContentType()).startsWith("image/")) {
            throw new IllegalArgumentException("Invalid file type. Only images are supported");
        }
    }

    private byte[] compressImage(MultipartFile file) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Thumbnails.of(new ByteArrayInputStream(file.getBytes()))
                .size(WIDTH, HEIGHT)
                .outputFormat("jpg")
                .toOutputStream(outputStream);
        return outputStream.toByteArray();
    }

    public void deleteImageByUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }
        try {
            URI uri = new URI(imageUrl);
            String key = uri.getPath().substring(1);
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(s3Bucket)
                    .key(key)
                    .build());
            log.info("Logo was removed from S3");
        } catch (Exception e) {
            log.warn("Logo could not be removed from S3 " + e.getMessage());
        }
    }
}
