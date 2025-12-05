<?php
// contact.php

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Collect and Sanitize Input
    $name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : '';
    $email = isset($_POST['email']) ? htmlspecialchars(trim($_POST['email']), ENT_QUOTES, 'UTF-8') : '';
    $message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8') : '';

    // 2. Validation (Empty Fields)
    $errors = [];

    if (empty($name)) {
        $errors[] = "Name is required.";
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required.";
    }

    if (empty($message)) {
        $errors[] = "Message is required.";
    }

    // 3. Process Logic
    if (empty($errors)) {
        // Simulate successful processing (e.g., sending email or saving to DB)
        // In a real app: mail($to, $subject, $message, $headers);
        
        // Redirect to Thank You page
        header("Location: thank-you.html");
        exit();
    } else {
        // Handle errors (For this simple demo, we'll just display them)
        echo "<h1>Oops! There were errors with your submission:</h1>";
        echo "<ul>";
        foreach ($errors as $error) {
            echo "<li>" . htmlspecialchars($error) . "</li>";
        }
        echo "</ul>";
        echo "<a href='index.php'>Go Back</a>";
    }

} else {
    // If accessed directly without POST, redirect home
    header("Location: index.php");
    exit();
}
?>
