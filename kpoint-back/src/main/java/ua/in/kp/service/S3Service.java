package ua.in.kp.service;

import lombok.AllArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@AllArgsConstructor
@Service
public class S3Service {
    public static final int WIDTH = 240;
    public static final int HEIGHT = 240;

    private final S3Client s3Client;

    public String uploadLogo(MultipartFile file) {
        try {
            byte[] logoBytes = compressImage(file);

            String logoImgUrl = file.getOriginalFilename();
            s3Client.putObject(PutObjectRequest.builder()
                    .bucket("kpoint-image")
                    .key("logo-test/" + logoImgUrl)
                    .build(), RequestBody.fromBytes(logoBytes));

            return s3Client.utilities().getUrl(GetUrlRequest.builder()
                    .bucket("kpoint-image")
                    .key("logo-test/" + logoImgUrl)
                    .build()).toExternalForm();
        } catch (Exception e) {
            return e.getMessage();
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
//public String uploadLogo(String filePath) {
//    try {
//        Path path = Paths.get(filePath);
//        byte[] logoBytes = compressImage(Files.readAllBytes(path));
//
//        String logoImgUrl = path.getFileName().toString();
//        s3Client.putObject(PutObjectRequest.builder()
//                .bucket("kpoint-image")
//                .key("logo-test/" + logoImgUrl)
//                .build(), RequestBody.fromBytes(logoBytes));
//
//        return s3Client.utilities().getUrl(GetUrlRequest.builder()
//                .bucket("kpoint-image")
//                .key("logo-test/" + logoImgUrl)
//                .build()).toExternalForm();
//    } catch (Exception e) {
//        return e.getMessage();
//    }
//}
//
//    private byte[] compressImage(byte[] imageBytes) throws IOException {
//        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//        Thumbnails.of(new ByteArrayInputStream(imageBytes))
//                .size(WIDTH, HEIGHT)
//                .outputFormat("jpg")
//                .toOutputStream(outputStream);
//        return outputStream.toByteArray();
//    }
}
