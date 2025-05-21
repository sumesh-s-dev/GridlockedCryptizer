package util;

import java.io.*;
import java.util.Properties;

public class ConfigManager {
    private static ConfigManager instance;
    private Properties properties;
    private static final String CONFIG_FILE = "config.properties";
    
    /**
     * Private constructor for singleton pattern
     */
    private ConfigManager() {
        properties = new Properties();
        
        File configFile = new File(CONFIG_FILE);
        
        // Create default config if it doesn't exist
        if (!configFile.exists()) {
            createDefaultConfig();
        }
        
        // Load configuration
        try (InputStream input = new FileInputStream(CONFIG_FILE)) {
            properties.load(input);
            System.out.println("Configuration loaded successfully");
        } catch (IOException e) {
            System.err.println("Failed to load configuration: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Get the singleton instance
     */
    public static synchronized ConfigManager getInstance() {
        if (instance == null) {
            instance = new ConfigManager();
        }
        return instance;
    }
    
    /**
     * Create a default configuration file
     */
    private void createDefaultConfig() {
        Properties defaultProps = new Properties();
        defaultProps.setProperty("db.url", "jdbc:mysql://localhost:3306/gridlocked_cryptizer?allowPublicKeyRetrieval=true&useSSL=false");
        defaultProps.setProperty("db.base_url", "jdbc:mysql://localhost:3306/?allowPublicKeyRetrieval=true&useSSL=false");
        defaultProps.setProperty("db.user", "root");
        defaultProps.setProperty("db.password", "");
        defaultProps.setProperty("blockchain.endpoint", "http://localhost:8545");
        defaultProps.setProperty("ui.theme", "light");
        defaultProps.setProperty("log.level", "INFO");
        
        try (OutputStream output = new FileOutputStream(CONFIG_FILE)) {
            defaultProps.store(output, "Gridlocked Cryptizer Configuration");
            System.out.println("Default configuration created");
        } catch (IOException e) {
            System.err.println("Failed to create default configuration: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Get a configuration property
     */
    public String getProperty(String key) {
        return properties.getProperty(key);
    }
    
    /**
     * Get a configuration property with default value
     */
    public String getProperty(String key, String defaultValue) {
        return properties.getProperty(key, defaultValue);
    }
    
    /**
     * Set a configuration property
     */
    public void setProperty(String key, String value) {
        properties.setProperty(key, value);
        
        try (OutputStream output = new FileOutputStream(CONFIG_FILE)) {
            properties.store(output, "Gridlocked Cryptizer Configuration");
            System.out.println("Configuration updated: " + key + " = " + value);
        } catch (IOException e) {
            System.err.println("Failed to save configuration: " + e.getMessage());
            e.printStackTrace();
        }
    }
}