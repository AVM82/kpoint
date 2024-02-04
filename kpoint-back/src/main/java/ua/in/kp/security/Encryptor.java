package ua.in.kp.security;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

public class Encryptor {
    private static final String ENCRYPTION_TYPE = "AES";
    private static final Cipher cipher;
    private static final SecretKey key;

    static {
        try {
            cipher = Cipher.getInstance(ENCRYPTION_TYPE);
            key = new SecretKeySpec(new SecureRandom().generateSeed(32), ENCRYPTION_TYPE);
        } catch (NoSuchAlgorithmException | NoSuchPaddingException e) {
            throw new RuntimeException("Encryptor initialization failed", e);
        }
    }

    private Encryptor() {
    }

    public static String encrypt(String line) {
        try {
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] encrypted = cipher.doFinal(line.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (IllegalBlockSizeException | BadPaddingException | InvalidKeyException e) {
            throw new RuntimeException("Can't encrypt line " + line, e);
        }
    }

    public static String decrypt(String line) {
        try {
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(line));
            return new String(decrypted);
        } catch (IllegalBlockSizeException | BadPaddingException | InvalidKeyException e) {
            throw new RuntimeException("Can't decrypt line " + line, e);
        }
    }
}
