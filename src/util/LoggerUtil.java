package util;

import java.io.IOException;
import java.util.logging.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LoggerUtil {
    private static final String LOG_FILE = "gridlocked_cryptizer.log";
    private final Logger logger;
    
    // Private constructor for singleton pattern
    private LoggerUtil(Class<?> clazz) {
        logger = Logger.getLogger(clazz.getName());
        
        try {
            // Create file handler
            FileHandler fileHandler = new FileHandler(LOG_FILE, true);
            fileHandler.setFormatter(new SimpleFormatter());
            
            // Create console handler
            ConsoleHandler consoleHandler = new ConsoleHandler();
            consoleHandler.setFormatter(new CustomFormatter());
            
            // Remove existing handlers
            Logger rootLogger = Logger.getLogger("");
            Handler[] handlers = rootLogger.getHandlers();
            for (Handler handler : handlers) {
                rootLogger.removeHandler(handler);
            }
            
            // Set log level
            logger.setLevel(Level.ALL);
            
            // Add handlers
            logger.addHandler(fileHandler);
            logger.addHandler(consoleHandler);
            
            // Don't forward to parent handlers
            logger.setUseParentHandlers(false);
        } catch (IOException e) {
            System.err.println("Failed to initialize logger: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Get a logger for the specified class
     */
    public static LoggerUtil getLogger(Class<?> clazz) {
        return new LoggerUtil(clazz);
    }
    
    /**
     * Log an info message
     */
    public void info(String message) {
        logger.info(message);
    }
    
    /**
     * Log a warning message
     */
    public void warn(String message) {
        logger.warning(message);
    }
    
    /**
     * Log an error message
     */
    public void error(String message) {
        logger.severe(message);
    }
    
    /**
     * Log an error message with exception
     */
    public void error(String message, Throwable throwable) {
        logger.log(Level.SEVERE, message, throwable);
    }
    
    /**
     * Custom log formatter for console output
     */
    static class CustomFormatter extends Formatter {
        private static final DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        @Override
        public String format(LogRecord record) {
            LocalDateTime now = LocalDateTime.now();
            String timestamp = dtf.format(now);
            
            return String.format("[%s] [%s] %s: %s%n", 
                timestamp,
                record.getLevel(),
                record.getLoggerName(),
                record.getMessage()
            );
        }
    }
}