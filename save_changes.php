<?php
ini_set('log_errors', 1);
ini_set('error_log', 'path_to_error_log.log');
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $updatedText = $_POST['text'] ?? 'No text received';
    error_log("Received text: " . $updatedText); // Log received text

    $filePath = 'your_html_file.html';
    if (file_exists($filePath) && is_writable($filePath)) {
        $content = file_get_contents($filePath);
        $newContent = preg_replace(
            "/<p id=\"text-container\".*?>.*?<\/p>/s", 
            "<p id=\"text-container\">" . $updatedText . "</p>", 
            $content
        );
        if (file_put_contents($filePath, $newContent)) {
            echo "Update successful";
            error_log("File updated successfully");
        } else {
            echo "Failed to write to file";
            error_log("Failed to write to file");
        }
    } else {
        echo "File does not exist or is not writable";
        error_log("File does not exist or is not writable");
    }
} else {
    echo "Invalid request method";
    error_log("Invalid request method");
}
?>
