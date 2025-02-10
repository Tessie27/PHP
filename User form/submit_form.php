<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = htmlspecialchars($_POST['firstName']);
    $lastName = htmlspecialchars($_POST['lastName']);
    $mobile = htmlspecialchars($_POST['mobile']);
    $email = htmlspecialchars($_POST['email']);

    // Handle file upload
    if (isset($_FILES['resume']) && $_FILES['resume']['error'] == 0) {
        $fileTmpPath = $_FILES['resume']['tmp_name'];
        $fileName = $_FILES['resume']['name'];
        $fileType = $_FILES['resume']['type'];

        // Validate file type
        $allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!in_array($fileType, $allowedFileTypes)) {
            echo json_encode(["success" => false, "message" => "Invalid file type. Only PDF and Word documents are allowed."]);
            exit;
        }

        // Move file to the server (optional)
        $uploadDir = "uploads/";
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $destPath = $uploadDir . $fileName;
        move_uploaded_file($fileTmpPath, $destPath);
    } else {
        echo json_encode(["success" => false, "message" => "File upload failed."]);
        exit;
    }

    // Email configuration
    $to = "LeTezz.Khan@ricoh.co.za"; // Replace with your email
    $subject = "New Career Application";
    $message = "First Name: $firstName\nLast Name: $lastName\nMobile: $mobile\nEmail: $email\nResume: $fileName";
    $headers = "From: LeTezz.Khan@ricoh.co.za"; // Replace with a valid sender email

    // Send email
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["success" => true, "message" => "Form submitted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to send email."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
