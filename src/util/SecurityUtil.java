package util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.regex.Pattern;

public class SecurityUtil {
    // Email validation pattern
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    // Password requirements: 8+ chars, 1+ uppercase, 1+ lowercase, 1+ digit
    private static final Pattern PASSWORD_PATTERN = 
        Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$");

    private static final int SALT_LENGTH = 16;

    /**
     * Hashes a password using SHA-256 with a random salt
     * 
     * @param plainTextPassword the password to hash
     * @return the hashed password with salt (format: salt:hash)
     */
    public static String hashPassword(String plainTextPassword) {
        try {
            // Generate a random salt
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[SALT_LENGTH];
            random.nextBytes(salt);

            // Hash the password with the salt
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashedPassword = md.digest(plainTextPassword.getBytes());

            // Convert to Base64 for storage
            String saltString = Base64.getEncoder().encodeToString(salt);
            String hashString = Base64.getEncoder().encodeToString(hashedPassword);

            // Return salt:hash
            return saltString + ":" + hashString;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    /**
     * Verifies a password against a hash
     * 
     * @param plainTextPassword the password to check
     * @param storedPassword the stored password (format: salt:hash)
     * @return true if the password matches the hash
     */
    public static boolean checkPassword(String plainTextPassword, String storedPassword) {
        try {
            // Split the stored password into salt and hash
            String[] parts = storedPassword.split(":");
            if (parts.length != 2) {
                return false;
            }

            String saltString = parts[0];
            String hashString = parts[1];

            // Decode the salt and hash
            byte[] salt = Base64.getDecoder().decode(saltString);
            byte[] hash = Base64.getDecoder().decode(hashString);

            // Hash the password with the same salt
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashedPassword = md.digest(plainTextPassword.getBytes());

            // Compare the hashes
            if (hash.length != hashedPassword.length) {
                return false;
            }

            // Time-constant comparison to prevent timing attacks
            int diff = 0;
            for (int i = 0; i < hash.length; i++) {
                diff |= hash[i] ^ hashedPassword[i];
            }
            return diff == 0;
        } catch (NoSuchAlgorithmException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Validates that an email is properly formatted
     * 
     * @param email the email to validate
     * @return true if the email is valid
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Validates that a password meets complexity requirements
     * 
     * @param password the password to validate
     * @return true if the password meets requirements
     */
    public static boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }

    /**
     * Sanitizes input to prevent XSS attacks
     * 
     * @param input the input to sanitize
     * @return the sanitized input
     */
    public static String sanitizeInput(String input) {
        if (input == null) return null;
        return input.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    }
}
